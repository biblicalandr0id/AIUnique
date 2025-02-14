from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from config import Config
import sqlite3
import os

class User:
    def __init__(self, username, email, password_hash=None):
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.purchases = []
        
    @staticmethod
    def init_db():
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS users
                    (username TEXT PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT)''')
        c.execute('''CREATE TABLE IF NOT EXISTS purchases
                    (username TEXT, model_name TEXT, purchase_date TEXT, 
                     FOREIGN KEY(username) REFERENCES users(username))''')
        conn.commit()
        conn.close()
        
    @staticmethod
    def create_user(username, email, password):
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        try:
            password_hash = generate_password_hash(password)
            c.execute('INSERT INTO users VALUES (?, ?, ?)', 
                     (username, email, password_hash))
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False
        finally:
            conn.close()
            
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_token(self):
        payload = {
            'username': self.username,
            'exp': datetime.utcnow() + Config.JWT_EXPIRATION
        }
        return jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')