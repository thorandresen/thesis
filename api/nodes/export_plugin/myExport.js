module.exports = function (RED) {
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function resetGlobalContext(globalContext) {

        globalContext.set("trigger", undefined)
        globalContext.set("action", undefined)
        globalContext.set("comment", undefined)

    }

    function MyExportNode(config) {
        RED.nodes.createNode(this, config);
        this.blocks = config.blocks;
        this.name = config.name;

        var node = this;
        node.on('input', function (msg) {
            msg.payload = msg.payload
            node.send(msg)
            // var globalContext = this.context().global;
            // globalContext.set(msg.topic, msg.payload)

            // trigger = globalContext.get("trigger")
            // action = globalContext.get("action")
            // comment = globalContext.get("comment")
            // if (trigger !== undefined && action !== undefined && comment !== undefined) {
            //     // msg.payload = {
            //     //     trigger,
            //     //     action,
            //     //     comment,
            //     // }

            //     let data = msg.payload
            //     msg.payload = data
            //     node.send(msg)
            //     // resetGlobalContext(globalContext)
            // }
            // else {
            //     delay(500).then(() => {
            //         trigger = globalContext.get("trigger")
            //         action = globalContext.get("action")
            //         comment = globalContext.get("comment")
            //         if (trigger === undefined) {
            //             node.warn("no trigger attached to export: " + node.name)
            //         }
            //         else if (action === undefined) {
            //             node.warn("no action attached to export: " + node.name)
            //         }
            //         else if (comment === undefined) {
            //             node.warn("no comment attached to export: " + node.name)
            //         }
            //     })

            // }

        })

    }

    RED.nodes.registerType("myExport", MyExportNode);
}