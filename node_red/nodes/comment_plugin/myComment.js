
module.exports = function (RED) {

    function MyCommentNode(config) {
        RED.nodes.createNode(this, config);
        this.text = config.text;




        var node = this;
        node.on('input', function (msg) {
            msg.payload = {

                text: node.text

            }
            msg.topic = "comment"
            if (node.text === "") {
                node.warn("You need to enter a comment text. Double click the node to enter the text")
            } else {
                node.send(msg)

            }

        })
    }

    RED.nodes.registerType("myComment", MyCommentNode);
}