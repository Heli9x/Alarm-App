from flask import *
from flask_cors import CORS
from alarm import *

app = Flask(__name__)
CORS(app)

device = Alarm()

@app.post('/setAlarm')
def loadAlarm():
    res = request.get_json()
    device.data = {}
    
    for alarm in res['Alarms']:
        device.setAlarm(alarm)
        
    print(device.data)
    return jsonify(device.data)

@app.get('/alarmlist')
def listAlarms():
    print(device.data)
    return jsonify(device.data)

@app.get('/deletAlarm')
def delAlarm():
    res = request.get_json()
    name = res['name']
    try:
        if(device.deleteAlarm(name)):
            return jsonify(device.data)
    
    except KeyError:
        return jsonify({"Message": "Failed to delete alarm", "Reason": "Does not exist"})
    

@app.post('/newAlarm')
def addAlarm():
    res = request.get_json()
    name = res['Alarm'][2]
    
    try:
        if(device.data[name][2]):
            return "Already Exists"
    
    except KeyError:
        device.setAlarm(res['Alarm'])
        return "Added new alarm" 
    
    except 'dict':
        return "Error adding the alarm" 
    
app.run(port=5100)