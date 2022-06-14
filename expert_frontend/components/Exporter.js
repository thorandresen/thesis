import { Row, Col, Button } from "react-bootstrap"
import React from "react"
import { render } from "react-dom"
import { ACTION, COMMENT, TRIGGER } from "../constants"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class Exporter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            deploys: [{ name: "deploy1", selected: [], export: false }],
            selectedIndex: 0
        }
    }

    setExport(i) {
        // 1. Make a shallow copy of the items
        let deploys = [...this.state.deploys];
        // 2. Make a shallow copy of the item you want to mutate
        let deploy = { ...deploys[i] };
        // 3. Replace the property you're intested in
        deploy.export = !deploy.export;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        deploys[i] = deploy;

        // 5. Set the state to our new copy
        this.setState({ deploys });

    }

    addNewDeploy() {
        let name = prompt("Enter name for new deploy")
        this.setState({ deploys: [...this.state.deploys, { name: name, selected: [], export: false }] }) //simple value
    }

    export() {
        let ready = true;
        let triggers = 0;
        let actions = 0;
        let comments = 0;


        let deploys = this.state.deploys

        let exports = deploys.filter(function (d) {
            return d.export
        })



        exports.forEach(e => {
            e.selected.forEach((selection, index) => {
                this.props.tabs.forEach(t => {
                    if (selection === t.name || selection.name && selection.name === t.name) {
                        e.selected[index] = t
                    }
                })
            })

            e.selected.forEach(s => {

                if (s.type === TRIGGER) {
                    triggers++

                    if (!s.code.includes("trigger()")) {
                        this.props.appendToDebug("Trigger: " + s.name + " in deploy: " + e.name + " needs to call trigger()")
                        ready = false
                    }
                    if (s.code === "") {
                        this.props.appendToDebug("The trigger is empty")
                        ready = false
                    }
                }
                if (s.type === ACTION) {
                    actions++

                    if (s.code === "") {
                        ready = false
                        this.props.appendToDebug("The action is empty")
                    }
                }
                if (s.type === COMMENT) {
                    comments++

                    if (s.code === "") {
                        ready = false
                        this.props.appendToDebug("The comment is empty")
                    }
                }
            })
        })
        let deploySelected = exports.length !== 0
        if (!deploySelected) {
            this.props.appendToDebug("You need to select a deploy for export")

        }
        var enoughCode = triggers > 0 && actions > 0 && comments > 0
        if (!enoughCode && deploySelected) {
            this.props.appendToDebug("You need to export at least one trigger, action and comment")
        } else if (ready && enoughCode && deploySelected) {
            const params = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(exports)
            }


            console.log("ready")

            fetch("http://localhost:8000/export", params)
                .then(response => response.json())
                .then(data => {
                    this.props.changeVideo()

                    this.props.appendToDebug(data.response)
                })
        }
    }

    addToDeploy(i, data, e) {
        // Copy of entire list
        let deploys = [...this.state.deploys]
        // Copy of element
        let deploy = { ...deploys[i] }

        if (e.target.checked) {
            // Update code of deploy
            deploy.selected.push(data.name)
        } else {

            deploy.selected = deploy.selected.filter(function (s) {
                return s !== data.name
            })
        }
        console.log(deploy.selected)


        // Overwrite tab with updates
        deploys[i] = deploy

        // Set state
        this.setState({ deploys })

    }

    generateList(data, deploy) {
        return (data.map((data, i) => {
            let checked = false;


            for (let j = 0; j < deploy.selected.length; j++) {
                if (deploy.selected[j].name === data.name) {
                    checked = true;
                }
            }
            return (
                <Row key={i}>
                    <Col lg={1} >
                        <input defaultChecked={checked ? true : false} onChange={this.addToDeploy.bind(this, this.state.selectedIndex, data)} type="checkbox"></input>
                    </Col>
                    <Col>
                        <p style={{ marginBottom: "2px" }}>{data.name}</p>
                    </Col>
                </Row>

            )
        }))
    }

    editDeployTab(i) {
        let newName = prompt("Enter new name of deploy")
        // Copy of entire list
        let deploys = [...this.state.deploys]
        // Copy of element
        let deploy = { ...deploys[i] }

        // Update code of tab
        deploy.name = newName;

        // Overwrite tab with updates
        deploys[i] = deploy

        // Set state
        this.setState({ deploys })
    }

    render() {
        let triggers = []
        let actions = []
        let comments = []
        this.props.tabs.forEach(t => {
            switch (t.type) {
                case TRIGGER:
                    triggers.push(t)
                    break;
                case ACTION:
                    actions.push(t)
                    break;
                case COMMENT:
                    comments.push(t)
                    break;
            }
        });
        return (

            <div>
                < Tabs selectedIndex={this.state.selectedIndex} onSelect={(index) => this.setState({ selectedIndex: index })}>
                    <TabList>
                        {this.state.deploys.map((d, i) => {
                            return (
                                <Tab key={i} onDoubleClick={() => this.editDeployTab(i)}>
                                    {d.name}
                                    <input style={{ marginLeft: "5px" }} type="checkbox" onClick={() => this.setExport(i)}></input>
                                </Tab>

                            )

                        })}
                        <div style={{ float: "right" }}>
                            <button style={{ height: "36px" }} onClick={() => this.addNewDeploy()}>+D</button>
                        </div>
                    </TabList>
                    {
                        this.state.deploys.map((d, i) => {
                            return (
                                <TabPanel key={i}>
                                    <Col style={{ backgroundColor: "#f5f5f5", height: "170px", display: "block", maxHeight: "170px", overflowX: "hidden", overflowY: "scroll" }}>
                                        <div >
                                            <h1>Select Triggers</h1>
                                            {this.generateList(triggers, d)}
                                        </div>
                                        <div>
                                            <h1>Select Actions</h1>
                                            {this.generateList(actions, d)}
                                        </div>
                                        <div>
                                            <h1>Select Comments</h1>
                                            {this.generateList(comments, d)}
                                        </div>

                                    </Col>
                                    <Row style={{ margin: "0", marginBottom: "5px" }}>
                                        <Button onClick={this.props.onTest}>Test</Button>
                                    </Row>
                                    <Row style={{ margin: "0" }}>
                                        <Button style={{ backgroundColor: "green" }} onClick={() => this.export()}>Export</Button>
                                    </Row>
                                </TabPanel>
                            )
                        })
                    }
                </Tabs >


            </div >



        )
    }

} export default Exporter