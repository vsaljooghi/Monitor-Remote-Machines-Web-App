import sqlite3
import hashlib

def check_password(hashed_password, user_password):
    return hashed_password == hashlib.md5(user_password.encode()).hexdigest()
    
def validate(username, password):
    con = sqlite3.connect('./DB/Auth.db')
    validation = False
    with con:
       cur = con.cursor()
       cur.execute("SELECT * FROM Users")
       rows = cur.fetchall()
       for row in rows:
         dbUser = row[0]
         dbPass = row[1]
         if dbUser==username:
          validation=check_password(dbPass, password)
    return validation
