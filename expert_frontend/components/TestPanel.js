import styles from '../styles/Test.module.css'
import { Row, Col, Button } from 'react-bootstrap';
import { ACTION, TRIGGER } from '../constants';
import { useEffect, useRef } from "react";

export default function TestPanel(props) {

    return (

        <div className={styles.testDiv}>
            <Row style={{ padding: "5px" }}>
                <Col style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: "bold"

                }}>Test the implementation</Col>
                <Col lg={1} style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "flex-end",
                }} onClick={props.onTestClosed}>
                    <p style={{ backgroundColor: "red", color: "white", textAlign: "center", height: "30px", width: "30px", fontWeight: "bold" }}>X</p>
                </Col>
            </Row>
            <Row className={styles.boxRow}>
                {props.devices && props.devices.map((d, i) => {
                    return (
                        <Col key={i} className={styles.testDevice}>
                            <p style={{ fontWeight: "bold" }}>{d.name}</p>
                            {d.states.map((s, j) => {
                                return (
                                    <p key={j}>{s.field} = {s.value.toString()}</p>
                                )
                            })}
                        </Col>
                    )
                })}
            </Row>
            <Row className={styles.boxRow}>

                {props.tabs && props.tabs.map((t, i) => {
                    if (t.type == ACTION) {
                        return (<Col key={i} className={styles.testAction}>
                            <p style={{
                                fontWeight: "bold"
                            }}>
                                {t.name}
                            </p>
                            <Button onClick={() => props.onActionClick(t)}>Run</Button>
                        </Col>)
                    }

                })}
            </Row>

        </div>
    )
}