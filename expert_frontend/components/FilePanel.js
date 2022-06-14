import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import EditorPanel from './EditorPanel';
import 'react-tabs/style/react-tabs.css';
import { ACTION, A_COLOR, COMMENT, C_COLOR, TRIGGER, T_COLOR } from '../constants';


export default function FilePanel(props) {

    const getTabColor = (type) => {
        let styleObject = {
            height: "36px",
        }
        if (type === TRIGGER) {
            styleObject.backgroundColor = T_COLOR
        }
        if (type === ACTION) {
            styleObject.backgroundColor = A_COLOR
        } else if (type === COMMENT) {
            styleObject.backgroundColor = C_COLOR
        }

        return styleObject
    }

    return (
        < Tabs selectedIndex={props.selectedIndex} onSelect={(index) => props.setSelectedIndex(index)}>
            <TabList>
                {props.tabs.map((t, i) => {
                    return (
                        <Tab style={getTabColor(t.type)} onDoubleClick={() => props.editTab(i, t.type)} key={i}>{t.name}</Tab>
                    )
                })}
                <div style={{ float: "right" }}>
                    <button style={getTabColor(TRIGGER)} onClick={() => props.addTab(TRIGGER)}>+T</button>
                    <button style={getTabColor(ACTION)} onClick={() => props.addTab(ACTION)}>+A</button>
                    <button style={getTabColor(COMMENT)} onClick={() => props.addTab(COMMENT)}>+C</button>
                </div>

            </TabList>
            {
                props.tabs.map((t, i) => {
                    return (
                        <TabPanel key={i}>
                            <EditorPanel type={t.type} index={i} code={t.code} setCode={props.onCodeChange}></EditorPanel>
                        </TabPanel>
                    )
                })
            }
        </Tabs >
    )


}