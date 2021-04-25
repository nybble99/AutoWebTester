from flask import Flask
from flask_cors import CORS
from flask import request
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/logPost', methods = ['POST'])
def receiveData():
    filename = str(datetime.datetime.now()).replace(' ', '_')
    filename = filename.replace(':','-')
    filePath = "#path#\\" + filename + ".json"
    f = open(filePath, "w+")
    f.write(str(request.json))
    f.close()
    return ""