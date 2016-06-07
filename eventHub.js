
module.exports = function(RED) {
    function AzureEventHub(config) {
        var request = require('request');
        var saToken = require('./saToken.js');
        
        RED.nodes.createNode(this,config);
        var node = this;

        this.endpoint = config.endpoint;
        this.endpointConfig = RED.nodes.getNode(this.endpoint);

        this.status({fill:"red",shape:"ring",text:"waiting"});

        if (this.endpointConfig) {
            this.on('input', function(msg) {

                //var body = '{ "device": "laptop", "message": "My message body." }';
                var body = '{ "temp":"' + msg +'"}';
                
                var namespace = config.namespace;
                var hubName = config.hubname;
                var saName = config.saname;
                var saKey = config.sakey;
                var token = saToken.create(namespace, hubName, saName, saKey);
                var serviceBusUriSuffix = '?timeout=60&api-version=2014-01';

                var uri = 'https://' + namespace + '.servicebus.windows.net/' +
                    hubName + '/messages' + serviceBusUriSuffix;
                this.status({fill:"green",shape:"dot",text:"sending"});
                request({
                'uri': uri,
                'method': 'POST',
                'headers': {
                    'Content-Type' : 'application/atom+xml;type=entry;charset=utf-8',
                    'Authorization' : token
                },
                'body': body
                }, function (err, response) {
                    if (!err && response.statusCode === 201) {
                        this.log("Success");
                    } else {
                       this.error("Error "+ err );
                    }
                    node.status({fill:"red",shape:"ring",text:"waiting"});
                });
            });
        } else {
            console.log("Service Bus missing Endpoint");
        }
    }
    RED.nodes.registerType("azure-eventhub", AzureEventHub);
}

