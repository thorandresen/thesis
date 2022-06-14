export const TRIGGER = "trigger"
export const ACTION = "action"
export const COMMENT = "comment"
export const T_COLOR = "#e87968"
export const A_COLOR = "#ffcd59"
export const C_COLOR = "#c4bfb5"
export const D_COLOR = "#a0eb91"

export const BULB = {
    name: "HueBulb",
    states: [{ type: "int", field: "brightness", value: 0 }, { type: "int", field: "hue", value: 0 }],
    info: "https://developers.meethue.com/develop/hue-api/lights-api/"
}
export const MOTION = {
    name: "MotionSensor",
    states: [{ type: "bool", field: "presence", value: false }],
    info: "https://developers.meethue.com/develop/hue-api/5-sensors-api/"
}
export const COFFEE = {
    name: "CoffeeMachine",
    states: [{ type: "int", field: "progress", value: 0 }],
    info: "https://developers.meethue.com/develop/hue-api/lights-api/"
}
export const CURTAIN = {
    name: "SmartCurtain",
    states: [{ type: "int", field: "folded", value: 0 }],
    info: "https://developers.meethue.com/develop/hue-api/5-sensors-api/"
}
