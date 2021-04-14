from flask import Flask
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

@app.route('/logPost', methods = ['POST'])
def receiveData():
    f = open("G:\\CSChallengesProject\\repo\\AutoWebTester\\latestLog.json", "w")
    f.write(str(request.json))
    f.close()
    return ""