from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import json
from types import SimpleNamespace
import time
from datetime import datetime

sampleLogPath = "G:\\CSChallengesProject\\repo\\AutoWebTester\\latestLog.json" #make this able to be input by user

#loads the json log file into a string
f = open(sampleLogPath, "r")
unparsedString = f.read()
f.close()

#formats the string to make it usable for json.loads
requotedString = unparsedString.replace("'", "\"") 
jsonString = requotedString.replace("False", "\"False\"")

log = json.loads(jsonString) #converts the json string into a dictionary

href = log["href"] #log source page
loadTime = datetime.fromisoformat(log["loadTime"].strip('Z'))

driver = webdriver.Chrome()
driver.get(href) #loads the page

driver.implicitly_wait(5000) #to give the page time to load itself up

#planned loop
for x in log["interactions"]:
    eventType = x["myEventType"]
    targetID = x["target"]
    elem = driver.find_element_by_id(targetID)

    if eventType == "keypress":
        key = x["key"]
        if key == "Enter":
            key = Keys.RETURN
        elem.send_keys(key)
    if eventType == "mousedown":
        elem.click()

    print(eventType + " successful")

    # try:
    #     alertObj = driver.switch_to_alert()
    #     alertObj.accept()
    # except selenium.common.exceptions.NoAlertPresentException:
    #     print("No alert")
# elem = driver
        

# driver = webdriver.Chrome()
# driver.get("http://127.0.0.1/samplePage.html")
# driver.implicitly_wait(1000)

# elem = driver.find_element_by_id("textBox")
# elem.send_keys("e")


