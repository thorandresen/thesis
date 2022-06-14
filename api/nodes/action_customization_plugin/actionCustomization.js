module.exports = function (RED) {

    function MyActionCustomizationNode(config) {
        RED.nodes.createNode(this, config);

        this.mode = config.mode;


        var node = this;
        node.on('input', function (msg) {
            action = msg.payload
            action.mode = node.mode
            msg.payload = {
                action: action,
            }

            if (node.mode === "") {
                node.warn("You need to select a configuration for the action customization")
            } else {
                node.send(msg)
            }
        });


    }

    RED.nodes.registerType("actionCustomization", MyActionCustomizationNode);
}