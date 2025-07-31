import datetime
import time
import winsound
from threading import *


class Alarm:
    def __init__(self, data:dict={}):
        #contains data of alarms set by the user
        self.data = data

    def setAlarm(self, data:list):

        hours = data[0]
        minutes = data[1]
        name = data[2]

        if(name==""):
            name = f"Alarm{len(self.data) + 1}"
        
        print(name, hours, minutes)
        self.data[name] = f"{hours}:{minutes}"
        
    def deleteAlarm(self, name:str):
        if(self.data[name]):
            del self.data[name]
            return True
        else:
            return False

    def ringAlarm(self):
        winsound.PlaySound("sound.wav",winsound.SND_ASYNC)
        
    def snoozeAlarm(self, name, minutes:int):
        prevData = self.data[name]

        prevMins = int(prevData.split(":")[1])
        hours = prevData.split(":")[0]

        self.data[name] = f"{hours}:{prevMins + minutes}"


def checkAlarm(alarm:Alarm):
    while True:
        currentTime = datetime.datetime.now().strftime("%H:%M")
        time.sleep(1)
        for a in alarm.data.keys():
            if(currentTime == alarm.data[a]):
                alarm.ringAlarm()
                print(f"Ringing {a}: {alarm.data[a]}")
                
            else:
                print(f"{a}: {alarm.data[a]}")
                continue



        
