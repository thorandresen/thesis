import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import React from "react";
import { Button } from "react-bootstrap";
import { ACTION, COMMENT, TRIGGER } from "../constants";

const CodeEditor = dynamic(
    () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
    { ssr: false }
);
class EditorPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = { code: `function add(a, b) {\n  return a + b;\n}` }
        if (this.props.type == TRIGGER || props.type == ACTION) {
            this.state.language = "js"
            this.state.ph = "Please enter JS code."
        } else {
            this.state.language = "md"
            this.state.ph = "Please enter a comment."
        }
    }

    render() {
        return (
            <div>
                <CodeEditor
                    value={this.props.code}
                    language={this.state.language}
                    placeholder={this.state.ph}
                    onChange={(evn) => this.props.setCode(evn.target.value, this.props.index)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        height: "58vh",
                        maxWidth: "60vw",
                        fontFamily:
                            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
                    }}
                />
            </div >
        )
    }

} export default EditorPanel