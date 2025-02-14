import sqlite3
import json
import os
from datetime import datetime
from werkzeug.utils import secure_filename
from config import Config

class ModelCatalog:
    def __init__(self):
        self.init_db()
        
    def init_db(self):
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS models
                    (name TEXT PRIMARY KEY, description TEXT, price REAL,
                     file_path TEXT, requirements TEXT, example_code TEXT,
                     tags TEXT, date_added TEXT, author TEXT)''')
        conn.commit()
        conn.close()
        
    def add_model(self, model_data, model_file):
        filename = secure_filename(model_file.filename)
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        model_file.save(file_path)
        
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('''INSERT INTO models VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                 (model_data['name'], model_data['description'], model_data['price'],
                  file_path, json.dumps(model_data['requirements']),
                  model_data['example_code'], json.dumps(model_data['tags']),
                  datetime.utcnow().strftime('%Y-%m-%d'), model_data['author']))
        conn.commit()
        conn.close()
        
    def get_model(self, name):
        conn = sqlite3.connect('database.db')
        c = conn.cursor()
        c.execute('SELECT * FROM models WHERE name = ?', (name,))
        model = c.fetchone()
        conn.close()
        
        if model:
            return {
                'name': model[0],
                'description': model[1],
                'price': model[2],
                'file_path': model[3],
                'requirements': json.loads(model[4]),
                'example_code': model[5],
                'tags': json.loads(model[6]),
                'date_added': model[7],
                'author': model[8]
            }
        return None