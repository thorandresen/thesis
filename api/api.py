# venv\Scripts\activate
from asyncio.windows_events import NULL
from json import JSONEncoder
import string
from flask import Flask
import requests
from flask import request
import json
import threading
import time
from random import randrange


app = Flask(__name__)


@app.route("/on")  # http://127.0.0.1:5000/on
def on():
    r = requests.put(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"on":true}')
    return "Light turned on"


@app.route("/off")  # http://127.0.0.1:5000/off
def off():
    r = requests.put(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"on":false}')
    return "Light turned off"


@app.route("/setPower")  # http://127.0.0.1:5000/setPower?value=true/false
def setPower():
    value = request.args.get('value', default=0, type=(str))

    if(value == NULL):
        return 'Wrong input'

    r = requests.put(url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state',
                     data='{"on":' + value + '}')

    return r.json()[0]


# http://127.0.0.1:5000/getLightInformation
@ app.route("/getLightInformation")
def lightInformation():
    r = requests.get(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16').json()['state']

    return r


@ app.route("/setEffect")  # http://127.0.0.1:5000/setEffect
def setEffect():
    r = requests.put(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"effect":"colorloop"}')

    return r.json()[0]


currentHue = 0


@ app.route("/setHue")  # http://127.0.0.1:5000/setHue?value=0-65535
def setHue():
    global currentHue
    value = request.args.get('value', default=0, type=int)

    if(value == NULL or value < 0 or value > 65535):
        return 'Wrong input'
    currentHue = value
    r = requests.put(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"hue":' + str(value) + '}')

    return r.json()[0]


@ app.route("/setCT")  # http://127.0.0.1:5000/setCT?value=153-500
def setCT():
    value = request.args.get('value', default=0, type=int)

    if(value == NULL or value < 153 or value > 500):
        return 'Wrong input'

    r = requests.put(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"ct":' + str(value) + '}')

    return r.json()[0]


# http://127.0.0.1:5000/setBrightness?value=1-254
@ app.route("/setBrightness")
def setBrightness():
    value = request.args.get('value', default=0, type=int)

    if(value == NULL or value < 1 or value > 254):
        return 'Wrong input'

    r = requests.put(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"bri":' + str(value) + '}')

    return r.json()[0]


# http://127.0.0.1:5000/getMotionSensorInformation
@ app.route("/getMotionSensorInformation")
def motionSensorInformation():
    r = requests.get(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/sensors/2').json()['state']['presence']

    return str(r)


# http://127.0.0.1:5000/getLightSensorInformation
@ app.route("/getLightSensorInformation")
def lightSensorInformation():
    r = requests.get(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/sensors/3').json()['state']['lightlevel']

    return str(r)


# http://127.0.0.1:5000/getTemperatureSensorInformation
@ app.route("/getTemperatureSensorInformation")
def temperatureSensorInformation():
    r = requests.get(
        url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/sensors/4').json()['state']['temperature']

    return str(r)


# http://127.0.0.1:5000/getAllSensorInformation
@ app.route("/getAllSensorInformation")
def allSensorInformation():
    temp = temperatureSensorInformation()
    light = lightSensorInformation()
    presence = motionSensorInformation()

    object = {
        "temp": temp,
        "light": light,
        "presence": presence
    }

    return object


@ app.route("/resettest")
def resetTest():
    r = requests.get("http://192.168.0.123:4444/resettest")
    #r = requests.get("http://127.0.0.1:4444/resettest")

    return str(r)


@ app.route("/testdata", methods=["POST"])  # http://127.0.0.1:5000/testdata
def test_data():
    req = request.get_json()
    print(req)

    # r = requests.post("http://192.168.0.121:4444/", json.dumps(req))
    # r = requests.post("http://127.0.0.1:4444/", json.dumps(req))

    return "Received"


@ app.route("/json", methods=["POST"])  # http://127.0.0.1:5000/json
def json_unity():
    req = request.get_json()
    print(req)

    r = requests.post("http://192.168.0.123:4444/test", json.dumps(req))
    # r = requests.post("http://127.0.0.1:4444/test", json.dumps(req))

    return "Received"


@ app.route("/data", methods=["POST"])  # http://127.0.0.1:5000/json
def data_unity():
    req = request.get_json()

    print(json.dumps(req))

    r = requests.post(
        "http://192.168.0.105:5001/receiveFeature", json=req)

    return "Received"


globalThreads = []
apiUrl = "http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state"
testing = False
lastCalled = NULL


@ app.route("/pulse")
def pulse():
    global lastCalled
    global testing
    pulseThread = threading.Thread(target=pulseLight)

    lastCalled = "pulse"
    for t in globalThreads:
        print("shutting off threads from pulse")
        if t.get("b"):
            t.get("b").activate = False
        if t.get("p"):
            t.get("p").activate = False
    pulseThread.activate = True
    globalThreads.append({"p": pulseThread})
    if testing == False:
        pulseThread.start()

    return "now pulsing"


def pulseLight():
    global currentHue
    delay = 3

    t = threading.currentThread()
    while getattr(t, "activate", True):
        r = requests.put(
            url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"bri":' + str(254) + ',"transitiontime":30,"hue":'+str(currentHue)+'}')
        time.sleep(delay)
        r1 = requests.put(
            url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"bri":' + str(0) + ',"transitiontime":30}')
        time.sleep(delay)
        print("pulsed")
    print("pulse stopped")


@ app.route("/blink")
def blink():
    global testing
    global lastCalled
    lastCalled = "blink"
    thread = threading.Thread(target=runBlink)

    for t in globalThreads:
        print("shutting off threads from blink")
        if t.get("p"):
            t.get("p").activate = False
        if t.get("b"):
            t.get("b").activate = False

    thread.activate = True
    globalThreads.append({"b": thread})

    if testing == False:
        thread.start()

    return "now blinking"


def runBlink():
    t = threading.currentThread()

    while getattr(t, "activate", True):
        r = requests.put(
            url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"bri":0,"transitiontime":1,"hue":'+str(currentHue)+'}')
        time.sleep(0.3)
        r = requests.put(
            url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"bri":254,"transitiontime": 1}')
        time.sleep(0.3)
        print("blinked")
    print("blink stopped")


@ app.route("/normal")
def normal():
    global lastCalled
    global testing
    lastCalled = "normal"
    for t in globalThreads:
        print("shutting off threads from normal")
        mT = list(t.items())[0][1]
        if mT:
            mT.activate = False

    if testing == False:
        r = requests.put(
            url='http://192.168.0.108/api/dpfYHD7aXhETTFOW7cafIgTrZskxuiJCJ3tPENkB/lights/16/state', data='{"bri":' + str(254) + ',"hue":'+str(currentHue)+'}')
    return "normal light"


@ app.route("/testBri")
def testBrightness():
    t = threading.Thread(target=runTestBrightness)
    t.start()
    return 'brightness tested'


def runTestBrightness():
    global testing
    shutOffAllThreads()
    testing = True
    r = requests.put(url=apiUrl, data='{"bri":'+str(0)+'}')
    time.sleep(0.5)
    for i in range(0, 254, 3):
        r = requests.put(url=apiUrl, data='{"bri":'+str(i)+'}')
    for i in range(254, 0, -3):
        r = requests.put(url=apiUrl, data='{"bri":'+str(i)+'}')
    r = requests.put(url=apiUrl, data='{"bri":254}')
    time.sleep(0.5)

    testing = False
    runLastCalled()


@ app.route("/testCt")
def testCt():
    t = threading.Thread(target=runTestCt)
    t.start()
    return 'ct tested'


def runTestCt():
    global testing
    shutOffAllThreads()
    testing = True
    for i in range(500, 153, -3):
        r = requests.put(url=apiUrl, data='{"ct":'+str(i)+',"bri":254}')
    for i in range(153, 500, 3):
        r = requests.put(url=apiUrl, data='{"ct":'+str(i)+'}')
    testing = False
    runLastCalled()


@ app.route("/testHue")
def testHue():
    t = threading.Thread(target=runTestHue)
    t.start()
    return 'hue tested'


def runTestHue():
    global testing
    shutOffAllThreads()
    testing = True
    for i in range(0, 65535, 500):
        r = requests.put(url=apiUrl, data='{"hue":'+str(i)+',"bri":254}')
    testing = False
    runLastCalled()


@ app.route("/testSwitch")
def testSwitch():
    t = threading.Thread(target=runTestSwitch)
    t.start()
    return 'on/off tested'


def runTestSwitch():
    global testing
    shutOffAllThreads()

    testing = True
    r = requests.put(url=apiUrl, data='{"on":true,"bri":254}')
    time.sleep(0.5)
    r = requests.put(url=apiUrl, data='{"on":false}')
    time.sleep(0.5)
    r = requests.put(url=apiUrl, data='{"on":true}')
    time.sleep(0.5)
    r = requests.put(url=apiUrl, data='{"on":false}')
    time.sleep(1)
    r = requests.put(url=apiUrl, data='{"on":true}')
    testing = False
    runLastCalled()


def runLastCalled():
    if lastCalled == "blink":
        blink()
    if lastCalled == "pulse":
        pulse()
    if lastCalled == "normal":
        normal()
    resetTest()


def shutOffAllThreads():
    for t in globalThreads:
        print("shutting off threads in test")
        mT = list(t.items())[0][1]
        if mT:
            mT.activate = False


# cd api; python api.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=False)

# # http://127.0.0.1:5000/getAllSensorInformation
# @app.route("/getAllSensorInformation")
# def allSensorInformation():
#     return object
