import { useEffect, useRef } from "react";


export default function Debugger(props) {

    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [props.debugTexts]);

    return (
        < div style={{ padding: "10px", marginTop: "5px", height: "16vh", backgroundColor: "#151716", overflowY: "scroll" }} >

            <div>
                {
                    props.debugTexts.map((d, i) => {
                        return (
                            <div key={i}>
                                <p style={{ fontSize: "12px", padding: "0px", margin: "0px", color: "white" }}>{d}</p>
                                <div ref={messagesEndRef} />

                            </div>
                        )

                    })
                }
            </div>


        </div >
    )
}