import mysql.connector
from config import Config

class Database:
    def __init__(self):
        self.connection = mysql.connector.connect(
            host=Config.MYSQL_HOST,
            user=Config.MYSQL_USER,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DB,
            port=Config.MYSQL_PORT
        )
        self.cursor = self.connection.cursor(dictionary=True)
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cursor.close()
        self.connection.close()
    
    def execute(self, query, params=None):
        self.cursor.execute(query, params)
        return self.cursor
    
    def commit(self):
        self.connection.commit()
    
    def fetchone(self):
        return self.cursor.fetchone()
    
    def fetchall(self):
        return self.cursor.fetchall()