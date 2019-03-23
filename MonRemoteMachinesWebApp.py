import os
import time
import json
import dbhandler
import logging
from logging.handlers import RotatingFileHandler
from threading import Thread, Event
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from flask import Flask, render_template, redirect, url_for, session, request
from flask_socketio import SocketIO

# Constants to be configured

WATCH_PATH = "/var/log/remote_machines/"
Files_To_WATCH = ["remote_machines_info.log", "remote_heartbeats.log", "remote_machines_warn.log", "remote_machines_err.log"] 
log_file = "./log/debug.log"
log_format = '%(asctime)s: %(name)s: %(funcName)s(): %(message)s'
log_datefmt = '%d/%m %I:%M:%S %p'
log_level= logging.DEBUG

# End of constants

logger =logging.getLogger()  # gets the root logger
logger.setLevel(log_level)
rotating_file_handler=RotatingFileHandler(log_file, mode='w', maxBytes=50*1024*1024, backupCount=1)
formatter=logging.Formatter(log_format,log_datefmt)
rotating_file_handler.setFormatter(formatter)
logger.addHandler(rotating_file_handler)
''''# Log to terminal emulator
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)
logger.addHandler(stream_handler)
'''

MyLogFollowers= []
fevents = {}

appFlask = Flask(__name__)
appFlask.config['SECRET_KEY'] = os.urandom(12)
socketio = SocketIO(appFlask)

jsonData=None

def readTableStructure():
    global jsonData
    with open("./config/MonitorResrcs.json", 'r') as f:
        jsonData = json.load(f)

readTableStructure()

@appFlask.route('/')
def home():
    if not session.get('logged_in'):
       return render_template('login.html')
    else:
       return render_template('dashboard.html', MyTableStructure=jsonData)

@appFlask.route('/login', methods=['POST'])
def do_login():
    error = None
    username = request.form['username']
    password = request.form['password']
    validation = dbhandler.validate(username, password)
    if validation == True:
       session['logged_in'] = True
       return redirect(url_for('home'))
    else:
       error = 'Invalid Credentials. Please try again.'
       return render_template('login.html', error=error)

@socketio.on('connect', namespace='/monitoring_servers')
def client_connect():
    logger.debug('Client is connected')

@socketio.on('disconnect', namespace='/monitoring_servers')
def client_disconnect():
    logger.debug('Client is disconnected')

class LogFollower(Thread):

  def __init__(self, logfile):
    Thread.__init__(self)
    self.mFilePath = logfile
    self.fname = os.path.basename(self.mFilePath)
    self.fsize = os.stat(self.mFilePath).st_size
    self.flog = open(self.mFilePath, 'r')
    self.fpos = self.flog.seek(0,2) # Go to EOF

  def fetch_new_log(self):
      self.flog.seek(self.fpos)
      tmp_fpos=self.flog.tell()
      fetchedline = self.flog.readline()
      if not fetchedline:
        self.flog.seek(tmp_fpos)
        return
      self.fpos=self.flog.tell()
      self.dispatcher(fetchedline)

  def dispatcher(self,fetchedline):
      MSG={"ServerName":"" , "Subject":"", "Value":"", "Color":""}  # ToDo: Change Time
     
      if self.fname == "remote_heartbeats.log":
          splittedline=fetchedline.rstrip().split()
          if splittedline[4] == "MONITOR:":
            MSG["ServerName"]=splittedline[3].upper()
            MSG["Subject"]=splittedline[5]
            MSG["Value"]=""
            MSG["Color"]=""
          else:
            return
       
      elif self.fname in {"remote_machines_info.log", "remote_machines_warn.log", "remote_machines_err.log"}:
          splittedline=fetchedline.rstrip().split()
          MSG["Color"]=""
          if splittedline[4] == "MONITOR:":
            MSG["ServerName"]=splittedline[3].upper()
            MSG["Subject"]=splittedline[5]
            if MSG["Subject"] in {"Sitad", "Civil", "Post", "TRANS", "NTP"}:
               MSG["ServerName"]= MSG["Subject"]
            elif MSG["Subject"] == "Storage":
              if self.fname == "remote_machines_info.log":
                 MSG["Color"]= "G" 
              elif self.fname == "remote_machines_warn.log":
                 MSG["Color"]= "O"
              else:
                 MSG["Color"]= "R"
            MSG["Value"]=splittedline[6]
          else:
            return

      logger.debug("Msg to clients: " + str(MSG))
      socketio.emit('my_server_event',MSG, namespace='/monitoring_servers')


  def run(self):
    while True:
       fevents[self.fname].wait()
       current_fsize = os.stat(self.mFilePath).st_size
       
       if current_fsize < self.fsize: # log file is truncated during rotation process by logrotate
         self.fpos = self.flog.seek(0,0) # Go to beginning of the log file
       self.fsize = current_fsize
       self.fetch_new_log()
       fevents[self.fname].clear()

for file in Files_To_WATCH:
    MyLogFollowers.append(LogFollower(WATCH_PATH + file))
    fevents.update( {file : Event()} )

class MyEventHandler(FileSystemEventHandler):
  global MyLogFollowers
  
  def on_any_event(self, event):
    EventedFile = os.path.basename(event.src_path)
    if event.is_directory or not (EventedFile in Files_To_WATCH):
      return
    elif event.event_type == 'modified':
      fevents[EventedFile].set()

if __name__ == '__main__':
  try:
    for LogFollowerObj in MyLogFollowers:
        LogFollowerObj.start()
        
    MyObserver = Observer()
    MyObserver.schedule(MyEventHandler(), WATCH_PATH, recursive=True)
    MyObserver.start()
    socketio.run(app=appFlask, host='127.0.0.1', port=5000, debug=True)

  except(KeyboardInterrupt, SystemExit):
    MyObserver.stop()

  MyObserver.join()
  for LogFollowerObj in MyLogFollowers:
      LogFollowerObj.join()
