
module.exports = function(RED) {
    var request = require('request'),
    var saToken = require('./saToken.js');

    function sendMessage(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.endpoint = config.endpoint;
        this.endpointConfig = RED.nodes.getNode(this.endpoint);

        this.status({fill:"red",shape:"ring",text:"waiting"});

        if (this.endpointConfig) {
            this.on('input', function(msg) {

                //var body = '{ "device": "laptop", "message": "My message body." }';
                var body = '{ "temp":"' + msg +'"}'
                //TODO: Hard code the event hub param for time being
                var namespace = 'nodered-demo-ns';
                var hubName = 'nodered-demo';
                var saName = 'noderedpolicy';
                var saKey = 'Mgf6iDOeqomjJKH+0qnzjWsNIDh8A+8qTh8eur4q0i8=';
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

