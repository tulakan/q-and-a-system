// import { clearTimeout } from 'timers';

// import { setTimeout } from 'timers';

/**
 * Created by Kanrawee Karaboot on 4/3/2017.
 */
const Joi = require('joi');


//MQTT Service file

//init MQTT variable
var mqtt = require('mqtt')
var mqttOptions = {
    port: 16317,
    host: 'mqtt://m12.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'hduypxmn',
    password: '0lJtYsmmA8Pm',
    keepalive: 5,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};


var client = mqtt.connect('mqtt://m12.cloudmqtt.com', mqttOptions)
client.on('connect', function () {
    console.log('on connect');
})

var replyTime;
var replyFlaq = false;

exports.register = function (server, options, next) {

    //test mqtt
    server.route({
        method: 'GET',
        path: '/MQTTService/testMQTT',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'test mqtt service',
            notes: 'if work it will replay OK!'
        },
        handler: function (request, reply) {
            var startData = {
                "scanState": true,
                "deviceUUID": [
                    'e9:85:a4:34:d0:2a',
                    'e3:85:a4:34:d0:23'
                ]
            }

            var startDataString = JSON.stringify(startData);
            client.publish('gateway-ble', startDataString, function (err, granted) {
                console.log('err --> ', err);
                console.log('granted --> ', granted);
            });
            console.log("send start")
            setTimeout(function () {
                var stopData = {
                    "scanState": false,
                }
                var stopDataString = JSON.stringify(stopData);

                client.publish('gateway-ble', stopDataString),
                    console.log("send top")
                client.end()
                reply({
                    statusCode: 200,
                    message: 'MQTT OK'
                });
            }, 3000);




        }
    });


    //check GW Status  (classroomName)
    server.route({
        method: 'GET',
        path: '/MQTTService/checkGatewayStatus/{classIdx}/{roomIdx}',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'Check Gateway Status via mqtt protocal',
            notes: 'if work it will replay OK!',
            validate: {
                // Id is required field
                params: {
                    classIdx: Joi.string().required(),
                    roomIdx: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            let targetGatewayTopic = 'gateway-ble/' + request.params.classIdx + '/' + request.params.roomIdx
            console.log('targetGatewayTopic --> ', targetGatewayTopic);

            //pub masage to targetGatewayTopic to check ble scan state
            let checkData = JSON.stringify('checkBLEScanState');
            client.publish(targetGatewayTopic, checkData);

            let data;

            //sub for recieve BLE scan state
            var GWStateData = null
            client.subscribe(targetGatewayTopic + '/checkBLEScanState');
            client.on('message', function (topic, message) {
                GWStateData = message
                console.log('message --> ', GWStateData);
            });

            setTimeout(function () {
                if (GWStateData == null) {
                    data = {
                        statusCode: 404,
                        GWState: false,
                        message: 'GW not Found'
                    }
                    console.log('404 GW not Found');
                } else {
                    data = {
                        statusCode: 200,
                        GWState: true,
                        message: 'GW Ready'
                    }
                }
                console.log('timer reply data --> ', data);
                reply(data)
            }, 2000)
        }
    })

    //init GW (initData,classroomName)  initialGateway
    server.route({
        method: 'POST',
        path: '/MQTTService/sendMacAddressListToGateway/{classIdx}/{roomIdx}',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'test mqtt service',
            notes: 'if work it will replay OK!',
            validate: {
                // Id is required field
                params: {
                    classIdx: Joi.string().required(),
                    roomIdx: Joi.string().required()
                },
                payload: {
                    macAddressList: Joi.array().required(),
                }
            },
        },

        handler: function (request, reply) {
            let targetGatewayTopic = 'gateway-ble/' + request.params.classIdx + '/' + request.params.roomIdx
            console.log('targetGatewayTopic --> ', targetGatewayTopic);

            //pub macAdressList to targetGatewayTopic for check student
            let bufferData = {
                message: 'sendingMacAdressDATA',
                macAddressList: request.payload.macAddressList
            }
            let macAdressListData = JSON.stringify(bufferData);
            client.publish(targetGatewayTopic, macAdressListData, {}, function (error, granted) {
                console.log("sent --> ", macAdressListData)
                if (error != undefined) {
                    reply({
                        statusCode: 503,
                        message: 'publish Error'
                    })
                    console.log('error --> ', error);
                } else {
                    reply({
                        statusCode: 200,
                        message: 'publish success'
                    })
                    console.log('publish success');
                }
            });




        }
    })



    //start scan
    server.route({
        method: 'GET',
        path: '/MQTTService/startScan/{classIdx}/{roomIdx}',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'test mqtt service',
            notes: 'if work it will replay OK!',
            validate: {
                // Id is required field
                params: {
                    classIdx: Joi.string().required(),
                    roomIdx: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            let targetGatewayTopic = 'gateway-ble/' + request.params.classIdx + '/' + request.params.roomIdx
            console.log('targetGatewayTopic --> ', targetGatewayTopic);

            let bufferData = {
                message: 'startScan',
            }
            let startScanData = JSON.stringify(bufferData);
            client.publish(targetGatewayTopic, startScanData, {}, function (error, granted) {
                console.log("sent --> ", startScanData)
                if (error != undefined) {
                    reply({
                        statusCode: 503,
                        message: 'publish Error'
                    })
                    console.log('error --> ', error);
                } else {
                    reply({
                        statusCode: 200,
                        message: 'publish success'
                    })
                    console.log('publish success');
                }
            });

        }
    })

    //stop scan
    server.route({
        method: 'GET',
        path: '/MQTTService/stopScan/{classIdx}/{roomIdx}',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'test mqtt service',
            notes: 'if work it will replay OK!',
            validate: {
                // Id is required field
                params: {
                    classIdx: Joi.string().required(),
                    roomIdx: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            let targetGatewayTopic = 'gateway-ble/' + request.params.classIdx + '/' + request.params.roomIdx
            console.log('targetGatewayTopic --> ', targetGatewayTopic);

            let bufferData = {
                message: 'stopScan',
            }
            let stopScanData = JSON.stringify(bufferData);
            client.publish(targetGatewayTopic, stopScanData, {}, function (error, granted) {
                console.log("sent --> ", stopScanData)
                if (error != undefined) {
                    reply({
                        statusCode: 503,
                        message: 'publish Error'
                    })
                    console.log('error --> ', error);
                } else {
                    reply({
                        statusCode: 200,
                        message: 'publish success'
                    })
                    console.log('publish success');
                }
            });

        }
    })



    //init GW 
    server.route({
        method: 'GET',
        path: '/MQTTService/getAnswerData/{classIdx}/{roomIdx}/',
        config: {
            // Include this API in swagger documentation
            tags: ['api'],
            description: 'test mqtt service',
            notes: 'if work it will replay OK!',
            validate: {
                // Id is required field
                params: {
                    classIdx: Joi.string().required(),
                    roomIdx: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {
            var bufferAnswerData = null;
            var answerDataList;
            var replyData;
            let targetGatewayTopic = 'gateway-ble/' + request.params.classIdx + '/' + request.params.roomIdx
            console.log('targetGatewayTopic --> ', targetGatewayTopic);

            let bufferData = {
                message: 'getAnswerData',
            }
            let getAnswerData = JSON.stringify(bufferData);
            client.publish(targetGatewayTopic, getAnswerData, {}, function (error, granted) {
                console.log("sent --> ", getAnswerData)
                if (error != undefined) {
                    reply({
                        statusCode: 503,
                        message: 'publish Error'
                    })
                    console.log('error --> ', error);
                } else {
                    // reply({
                    //     statusCode: 200,
                    //     message: 'publish success'
                    // })
                    console.log('publish success');
                }
            });

            client.subscribe(targetGatewayTopic + '/answerData');
            client.on('message', function (topic, message) {
                bufferAnswerData = message
                console.log('bufferAnswerData --> ', bufferAnswerData);
                answerDataList = JSON.parse(bufferAnswerData);
            });

            setTimeout(function () {
                if (bufferAnswerData == null) {
                    replyData = {
                        statusCode: 404,
                        GWState: false,
                        message: 'Not have answer data'
                    }
                    console.log('404 GW not Found');
                } else {
                    replyData = {
                        statusCode: 200,
                        message: 'reply answer data successfull.',
                        data: answerDataList

                    }
                }
                console.log('timer reply data --> ', replyData);
                reply(replyData)
            }, 2000)
        }
    })



    //init GW (initData,classroomName)
    // server.route({
    //     method: 'GET',
    //     path: '/testMQTT',
    //     config: {
    //         // Include this API in swagger documentation
    //         tags: ['api'],
    //         description: 'test mqtt service',
    //         notes: 'if work it will replay OK!'
    //     },
    //     handler: function (request, reply) {

    //     }
    // })

    return next();
};



exports.register.attributes = {
    name: 'routes-mqtt'
};

function stop() {
    // var stopData = {
    //     "scanState": false,
    // }
    // var stopDataString = JSON.stringify(stopData);

    // client.publish('gateway-ble', stopDataString),
    //     console.log("send top")
    // client.end()
}
