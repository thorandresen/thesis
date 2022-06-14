module.exports = function (RED) {

    function MyTriggerNode(config) {
        RED.nodes.createNode(this, config);
        // this.deviceId = config.deviceId;
        // this.state = config.state;
        this.operator = config.operator;
        this.value = config.value;
        this.dataType = config.dataType;
        this.mode = config.mode;


        var node = this;
        node.on('input', function (msg) {

            var globalContext = this.context().global;

            globalContext.set(msg.topic, msg.payload)

            var id = globalContext.get("deviceId")
            var state = globalContext.get("state")


            if (id !== undefined && state !== undefined) {

                msg.payload = {

                    deviceId: id.deviceId,
                    state: state.state,
                    operatorType: node.operator,
                    value: node.value,
                    valueType: node.dataType,
                    mode: node.mode
                }
                msg.topic = "trigger"
                if (node.operator === "") {
                    node.warn("You need to enter an operator for the trigger. Double click the node to access settings")
                }
                else if (node.value === "") {
                    node.warn("You need to enter a value for the trigger. Double click the node to access settings")
                }
                else if (node.dataType === "") {
                    node.warn("You need to enter a data type for the trigger. Double click the node to access settings")
                }
                else {
                    node.send(msg)
                }
                globalContext.set("id", undefined)
                globalContext.set("state", undefined)

            }

        });

    }

    RED.nodes.registerType("myTrigger", MyTriggerNode);
}