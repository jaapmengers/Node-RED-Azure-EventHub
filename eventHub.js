
module.exports = function(RED) {
    function AzureEventHub(config) {
        RED.nodes.createNode(this,config);

        var eventHubs = require('eventhubs-js');

        this.on('input', function(msg) {
          eventHubs.init({
                hubNamespace: config.namespace,
                hubName: config.hubname,
                keyName: config.saname,
                key: config.sakey
            });

            eventHubs.sendMessage({
                message: msg.payload,
                deviceId: 1,
            });
        });
    }
    RED.nodes.registerType("azure-eventhub", AzureEventHub);
}
