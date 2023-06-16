"""
Flaskアプリケーションのエントリーポイント
"""
from app import create_app
from app.functions import schedule_secret_key_regeneration, set_secret_key_env
import os

app = create_app()

# 環境変数からシークレットキーを取得
app.secret_key = os.environ.get('SECRET_KEY')

if __name__ == "__main__":
          # シークレットキーが環境変数に存在しない場合、新たに設定
     if not app.secret_key:
          set_secret_key_env()
          app.secret_key = os.environ.get('SECRET_KEY')

     # シークレットキーの定期再生成をスケジューリング
     # schedule_secret_key_regeneration()
     app.run(host="192.168.20.10", debug=False)

