module.exports = function (RED) {

    function MyTriggerCustomizationNode(config) {
        RED.nodes.createNode(this, config);

        this.mode = config.mode;


        var node = this;
        node.on('input', function (msg) {
            trigger = msg.payload
            trigger.mode = node.mode
            msg.payload = {
                trigger: trigger,
            }
            if (node.mode === "") {
                node.warn("You need to select a configuration for the trigger customization")
            } else {
                node.send(msg)
            }
        });


    }

    RED.nodes.registerType("triggerCustomization", MyTriggerCustomizationNode);
}