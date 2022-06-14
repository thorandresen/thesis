import { Col, Row } from "react-bootstrap"
import { D_COLOR } from "../constants"

export default function DevicePanel(props) {

    let devices = props.devices
    return (
        <Row style={{ margin: 0, marginBottom: "5px" }}>
            {devices.map((d, i) => {
                return (
                    <Col key={i} style={{ backgroundColor: D_COLOR, border: "solid", paddingBottom: "10px", marginRight: i % 2 === 0 ? "50px" : "0px" }}>
                        <Row>
                            <Col>
                                <h1>{d.name}</h1>
                            </Col>
                            <Col>
                                <a style={{ textDecoration: "none", color: "black", float: "right" }} href={d.info} target="_blank">(i)</a>
                            </Col>
                        </Row>


                        {d.states.map((s, j) => {
                            return (
                                <div key={j}>
                                    <p style={{ display: "inline-block", margin: "0" }} >{s.type + " "}</p> <p onClick={() => props.stateClicked(d, s)} style={{ display: "inline-block", margin: "0", cursor: "pointer" }}>{s.field}</p>
                                </div>
                            )
                        })}
                    </Col>
                )
            })}
        </Row>

    )
}