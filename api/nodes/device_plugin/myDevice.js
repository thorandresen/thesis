module.exports = function (RED) {

    function MyDeviceNode(config) {
        RED.nodes.createNode(this, config);
        this.deviceId = config.deviceId;
        this.state = config.state;
        this.deviceInfo = config.deviceInfo
        this.outputs = config.outputs


        var node = this;
        node.on('input', function (msg) {

            // msg.payload = { "deviceId": node.deviceId, "state": node.state, "outputs": node.outputs }
            // node.send(msg)

            var msgs = []
            var idMsg = { payload: { "deviceId": node.deviceId }, topic: "deviceId" }
            msgs.push(idMsg)

            Object.entries(node.state).forEach(([key, value]) => {
                tempMsg = {
                    payload: { "state": key }, topic: "state"
                }
                msgs.push(tempMsg)
            });

            node.send(msgs)


        })
    }
    RED.nodes.registerType("myDevice", MyDeviceNode);
}