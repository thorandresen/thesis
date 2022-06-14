import requests
from flask import Flask, request, send_file
import threading
import time

app = Flask(__name__)

id = "52788067d1716ae6"
URL = "http://localhost:1880/flow/{}".format(id)

currX = 200
flow = {}


def getFlow():
    rGet = requests.get(url=URL, headers={"Content-Type": "application/json"})
    data = rGet.json()
    return data


def addMyComment(data):
    global currX
    global flow
    comment = {
        "id": data["id"],
        "type": "myComment",
        "z": "da8f894483f9f0b2",
        "name": data["name"],
        "text": data["text"],
        "x": currX,
        "y": 50
    }
    flow["nodes"].append(comment)

    currX = currX+200


def addMyDevice(data):
    global currX
    global flow

    states = list(data["state"].keys())
    states.insert(0, "deviceId")
    device = {
        "id": data["id"],
        "type": "myDevice",
        "z": "da8f894483f9f0b2",
        "name": data["deviceName"],
        "deviceInfo": data["deviceInfo"],
        "deviceId": data["deviceId"],
        "state": data["state"],
        "outputs": len(data["state"])+1,
        "outputLabels": states,
        "x": currX,
        "y": 50,
        "wires": [],
        "d": False
    }
    flow["nodes"].append(device)
    currX = currX+200


def run(devices, comments, videoLink):
    global flow

    flow = getFlow()

    for d in devices:
        addMyDevice(d)

    for c in comments:
        addMyComment(c)

    addVideo(videoLink)

    r = requests.put(
        url=URL, headers={"Content-Type": "application/json"}, json=flow)


id = 300
vidX = 200


def addVideo(videoLink):
    global flow
    global id
    global vidX

    id = id+1
    playNode = {
        "id": id,
        "type": "inject",
        "z": "52788067d1716ae6",
        "name": "play",
        "props": [
                {
                    "p": "payload"
                },
            {
                    "p": "topic",
                    "vt": "str"
                }
        ],
        "repeat": "",
        "crontab": "",
        "once": False,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "",
        "payloadType": "date",
        "x": vidX,
        "y": 100,
        "wires": [
            [
                id+1
            ]
        ]
    }
    print("playnode id: " + str(playNode["id"]))
    id = id + 1
    execVideo = {
        "id": id,
        "type": "exec",
        "z": "52788067d1716ae6",
        "command": "start",
        "addpay": "",
        "append": videoLink,
        "useSpawn": "false",
        "timer": "",
        "winHide": False,
        "oldrc": False,
        "name": "Video",
        "x": vidX+150,
        "y": 100,
        "outputs": 0
    }
    vidX = vidX + 350
    print("execnode id: " + str(execVideo["id"]))
    flow["nodes"].append(execVideo)
    flow["nodes"].append(playNode)


clock = {
    "id": 25,
    "deviceName": "Clock",
    "deviceId": "25",
    "deviceInfo": "www.hue.com/lol",
    "state": {"time": "07:00"}
}
curtain = {
    "id": 26,
    "deviceName": "Curtain",
    "deviceId": "26",
    "deviceInfo": "www.curt.com/lol",
    "state": {"open": 100}
}
clockComment = {
    "id": 27,
    "name": "Wake me up",
    "text": ""
}
bulb = {
    "id": 22,
    "deviceName": "Hue Bulb",
    "deviceId": "1922",
    "deviceInfo": "www.hue.com/lol",
    "state": {"bri": 20, "hue": "#45235"}
}
motion = {
    "id": 23,
    "deviceName": "Hue Sensor",
    "deviceId": "1923",
    "deviceInfo": "www.hue.com/lol",
    "state": {"presence": True}
}


# venv\Scripts\activate
# $env:FLASK_APP = "nodeRedApi"
# Flask run
# Or
# python nodeRedApi.py


@ app.route("/video")
def videoToNodeRed():
    run([], [], "https://www.youtube.com/watch?v=8kCHx3_vu9M&t=54s")
    return "video uploaded"


@ app.route("/forExpert")
def receive():

    comment = {
        "id": 24,
        "name": "myComment",
        "text": "skrttt pah"
    }

    run([curtain, clock], [],
        "https://www.youtube.com/watch?v=1mZjPGQNnoA")
    return "Feature received by expert"


@ app.route("/sendFeature", methods=['POST'])
def printResponse():
    data = request.json
    print(data)
    # TODO: Unity
    return "Feature sent to novice"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=False)
