from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import json
from types import SimpleNamespace
import time
from datetime import datetime
import os

def convertLogtimeToDatetime(logTime): #converts javascript ISO format to datetime
    return datetime.fromisoformat(logTime.strip('Z'))

print("Enter log file path")

valid = False
sampleLogPath = ""

while(valid == False):
    logPath = input()
    if(os.path.isfile(logPath)):
        valid = True
        sampleLogPath = logPath
    else:
        print("Enter a valid path")

#sampleLogPath = "G:\\CSChallengesProject\\repo\\AutoWebTester\\latestLog.json" #for testing

#loads the json log file into a string
f = open(sampleLogPath, "r")
unparsedString = f.read()
f.close()

#formats the string to make it usable for json.loads
requotedString = unparsedString.replace("'", "\"") 
jsonString = requotedString.replace("False", "\"False\"")

try:
    log = json.loads(jsonString) #converts the json string into a dictionary
    href = log["href"] #log source page
    currentTime = convertLogtimeToDatetime(log["loadTime"]) #used in the main loop for timing - starts at session load

    #gets rid of default logging and allows me to do my own
    driverOptions = webdriver.ChromeOptions()
    driverOptions.add_experimental_option("excludeSwitches", ['enable-logging']) 

    driver = webdriver.Chrome(options=driverOptions) #initialising webdriver with above options
    driver.get(href) #loads the page

    driver.implicitly_wait(5000) #to give the page time to load itself up

    #loops through all logged interactions
    for x in range(len(log["interactions"])):
        currentInteraction = log["interactions"][x]
        eventType = currentInteraction["myEventType"]
        targetID = currentInteraction["target"] #id of target element
        createdAt = convertLogtimeToDatetime(currentInteraction["createdAt"])
        elem = driver.find_element_by_id(targetID)

        nextDelay = (createdAt-currentTime).total_seconds() #seconds between this events creation and the last events creation (or the session load if its the first)
        currentTime = createdAt

        time.sleep(nextDelay)

        if eventType == "keypress": 
            key = currentInteraction["key"]

            if key == "Enter": #since this will just type "Enter" and not the enter key
                key = Keys.RETURN

            elem.send_keys(key)
        if eventType == "mousedown":
            elem.click()

        # try:
        #     alertObj = driver.switch_to_alert()
        #     alertObj.accept()
        # except selenium.common.exceptions.NoAlertPresentException:
        #     print("No alert")

    time.sleep((convertLogtimeToDatetime(log["unloadTime"]) - createdAt).total_seconds())#sleeps the remaining time until 
    driver.close()
except: #should add more errors to customise error message
    print("Error replicating log") 
    
    

