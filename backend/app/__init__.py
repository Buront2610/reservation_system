from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config
from flask_mail import Mail
import logging
from logging.handlers import RotatingFileHandler
import os
from flask_cors import CORS


db = SQLAlchemy()
migrate = Migrate()

def setup_logger(app: Flask):
    # Loggerの設定
    if not app.debug:
        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/myapp.log', maxBytes=10240, backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('MyApp startup')

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'your_email_address'
    app.config['MAIL_PASSWORD'] = 'your_password'


    CORS(app, origins=['http://localhost:9999'])  #      
    db.init_app(app)
    migrate.init_app(app, db)

    setup_logger(app)

    with app.app_context():
        from app.routes import bp
        app.register_blueprint(bp, url_prefix='/api')
        db.create_all()

    return app
