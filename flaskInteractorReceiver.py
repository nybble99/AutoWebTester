from flask import Flask
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

@app.route('/postmethod', methods = ['POST'])
def receiveData():
    f = open("G:\CSChallengesProject\demofile2.txt", "a")
    f.write(str(request.json))
    f.close()
    return ""