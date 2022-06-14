import Head from 'next/head'
import { Row, Col, Container, Button } from 'react-bootstrap';
import VideoPlayer from '../components/VideoPlayer';
import DevicePanel from '../components/DevicePanel';
import EditorPanel from '../components/EditorPanel';
import FilePanel from '../components/FilePanel';
import Debugger from '../components/Debugger';
import Exporter from '../components/Exporter';
import React, { useId } from 'react';
import styles from '../styles/Home.module.css'
import * as consts from 'constants'
import 'bootstrap/dist/css/bootstrap.min.css';


import TestPanel from '../components/TestPanel';
import { ACTION, COMMENT, TRIGGER } from '../constants';

import { COFFEE, CURTAIN, BULB, MOTION } from '../constants';


const brightness = "HueBulb.brightness = "
const hue = "HueBulb.hue = "
const presence = "MotionSensor.presence = "

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIndex: 0,
      triggerCode: '',
      actionCode: '',
      commentCode: '',
      testVisible: false,
      devices: [BULB, MOTION],
      tabs: [{ type: 'trigger', name: "myTrigger", code: '' }, { type: 'action', name: "myAction", code: '' }, { type: 'comment', name: "myComment", code: '' }],
      debugTexts: ['Ready ... '],
      currentUrl: "https://www.youtube.com/embed/aIQ-etkDXKc",
      urlIndex: 0,
      urls: ["https://www.youtube.com/embed/aW1Scl9ixG8", "https://www.youtube.com/embed/aIQ-etkDXKc"]
    }

    this.appendState = this.appendState.bind(this)
    this.actionClicked = this.actionClicked.bind(this)
    this.testClosed = this.testClosed.bind(this)
    this.updateDeviceState = this.updateDeviceState.bind(this)
    this.addTab = this.addTab.bind(this)
    this.editTab = this.editTab.bind(this)
    this.onCodeChange = this.onCodeChange.bind(this)
    this.setSelectedIndex = this.setSelectedIndex.bind(this)
    this.changeVideo = this.changeVideo.bind(this)
    // this.onEscapePressed = this.onEscapePressed.bind(this)
  }
  // componentDidMount() {
  //   document.addEventListener("keydown", this.onEscapePressed, false);
  // }

  // onEscapePressed(event) {
  //   if (event.key === "Escape") {
  //     this.setState({ testVisible: false })
  //   }
  // }

  setSelectedIndex(index) {
    this.setState({ selectedIndex: index })
  }

  appendState(device, state) {
    let tabs = [...this.state.tabs]

    let i = this.state.selectedIndex

    // Copy of element
    let tab = { ...tabs[i] }

    // Update code of tab
    tab.code = tab.code.concat(device.name + "." + state.field);

    // Overwrite tab with updates
    tabs[i] = tab

    // Set state
    this.setState({ tabs })
  }

  changeVideo() {
    console.log("changing video")
    setTimeout(function () {
      let index = this.state.urlIndex;
      index++;
      if (index === this.state.urls.length) {
        index = 0
      }
      this.setState({ currentUrl: this.state.urls[index], urlIndex: index })
    }.bind(this), 1000)
  }

  onCodeChange(code, i) {
    // Copy of entire list
    let tabs = [...this.state.tabs]
    // Copy of element
    let tab = { ...tabs[i] }

    // Update code of tab
    tab.code = code;

    // Overwrite tab with updates
    tabs[i] = tab

    // Set state
    this.setState({ tabs })
  }

  appendToDebug(newText) {
    this.setState(previousState => ({ debugTexts: [...previousState.debugTexts, newText] }))
  }

  actionClicked(action) {
    let tempCode = "";
    let code = action.code
    let finalCode = action.code
    let startIndex = 0;
    let endIndex = 0;

    let replacementTexts = [];
    if (code.includes(brightness)) { replacementTexts.push(brightness) }
    if (code.includes(hue)) { replacementTexts.push(hue) }
    if (code.includes(presence)) { replacementTexts.push(presence) }
    if (code.includes("console.log")) { this.getConsoleLogText(code) }
    if (replacementTexts !== []) {
      for (let j = 0; j < replacementTexts.length; j++) {
        // String for uniquely identifying state fields.
        let text = replacementTexts[j].substring(replacementTexts[j].length - 5)
        for (let i = 0; i < code.length; i++) {
          // Get last 5 characters from current index
          let lastChars = code.charAt(i - 4) + code.charAt(i - 3) + code.charAt(i - 2) + code.charAt(i - 1) + code.charAt(i)

          // Compare with unique identifier
          if (lastChars === text) {

            // Value starts from next char
            startIndex = i + 1
          }
          if (startIndex !== 0) {

            // Value should end at next ;
            if (code.charAt(i) === ";") {
              endIndex = i
            }
          }

          if (startIndex !== 0 && endIndex !== 0) {
            // if indeces are set, we can get the substring
            let value = code.substring(startIndex, endIndex)
            // Replace original string with state update
            console.log(replacementTexts[j] + value)
            tempCode = finalCode.replace(replacementTexts[j] + value, "this.updateDeviceState(" + value + ", '" + replacementTexts[j] + "')")

            // Replace code with updated code
            finalCode = tempCode

            // Reset indeces
            startIndex = 0
            endIndex = 0
          }

        }

      }
    } else {
      tempCode = code
    }
    try {
      eval(tempCode)
    } catch (err) {
      this.appendToDebug(err.message)
    }

  }

  getConsoleLogText(code) {
    let startIndex;
    let endIndex;
    for (let i = 0; i < code.length; i++) {
      if (code.charAt(i - 3) + code.charAt(i - 2) + code.charAt(i - 1) + code.charAt(i) === "log(") {
        startIndex = i + 1
      }
      if (startIndex !== 0) {
        if (code.charAt(i) === ")") {
          endIndex = i

          this.appendToDebug(code.substring(startIndex, endIndex))
        }
      }
    }
  }

  updateDeviceState(value, field) {
    let stateIndex
    if (field === brightness) {
      stateIndex = 0
    } else { stateIndex = 1 }

    // 1. Make a shallow copy of the items
    let devices = [...this.state.devices];
    // 2. Make a shallow copy of the item you want to mutate
    let device = { ...devices[0] };
    // 3. Replace the property you're intested in
    device.states[stateIndex].value = value;
    device.update = Math.floor(Math.random() * 10);
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    devices[0] = device;
    // 5. Set the state to our new copy
    this.setState({ devices });
  }

  testClicked() {
    this.appendToDebug("testing ...")
    this.setState({ testVisible: true })
  }

  addTab(type) {
    let name = prompt("Enter name of new " + type)
    if (name !== "") {
      this.setState(previousState => ({ tabs: [...previousState.tabs, { type: type, name: name, code: "" }] }))
    }
  }

  editTab(i, type) {
    let newName = prompt("Enter new name of " + type)
    // Copy of entire list
    let tabs = [...this.state.tabs]
    // Copy of element
    let tab = { ...tabs[i] }

    // Update code of tab
    tab.name = newName;

    // Overwrite tab with updates
    tabs[i] = tab

    // Set state
    this.setState({ tabs })
  }


  testClosed() {
    this.setState({ testVisible: false })
  }

  render() {
    return (
      <div>
        <Head>
          <title>Expert IDE</title>
        </Head>
        <main>
          <Container fluid style={{ padding: "20px " }}>
            {this.state.testVisible ? <TestPanel onTestClosed={this.testClosed} onActionClick={this.actionClicked} tabs={this.state.tabs} devices={this.state.devices}></TestPanel> : <div></div>}

            <Row>
              <Col lg={7}>
                <DevicePanel devices={this.state.devices} stateClicked={this.appendState}></DevicePanel>
                <FilePanel setSelectedIndex={this.setSelectedIndex} onCodeChange={this.onCodeChange} tabs={this.state.tabs} editTab={this.editTab} addTab={this.addTab}></FilePanel>
                <Debugger debugTexts={this.state.debugTexts} ></Debugger>
              </Col>
              <Col>
                <VideoPlayer videoUrl={this.state.currentUrl}></VideoPlayer>
                <Exporter changeVideo={this.changeVideo} appendToDebug={this.appendToDebug.bind(this)} tabs={this.state.tabs} onTest={this.testClicked.bind(this)}></Exporter>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    )
  }

} export default Home
