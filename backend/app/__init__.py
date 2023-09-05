import email
from flask import Flask, app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from app.config import Config
from flask_mail import Mail
import logging
from logging.handlers import RotatingFileHandler
import os
from flask_cors import CORS
# Import flask_jwt_extended library
from flask_jwt_extended import JWTManager


db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()  # Add this line

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
    app.config['JWT_SECRET_KEY'] = os.environ.get('SECRET_KEY')  # Add this line



    CORS(app, origins=['http://localhost:5555', 'http://192.168.20.10:5555'])  #      
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)  # Add this line


    setup_logger(app)

    with app.app_context():
        from app.routes import bp
        app.register_blueprint(bp, url_prefix='/api')
        db.create_all()

    return app

# def setup_admin_account():
#     from .models import User
#     existing_users = User.query.all()
#     if len(existing_users) == 0:
#         #ユーザがいない場合、管理者アカウントを作成
#         admin = User(username='admin', email='admin@example.com', role='admin')
#         admin.set_password('password')
#         db.session.add(admin)
#         db.session.commit()
#         print('Admin account created')
#         logging.info('Admin account created')

# @app.before_first_request
# def before_first_request():
#     setup_admin_account()
