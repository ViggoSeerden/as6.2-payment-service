"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const amqplib = require("amqplib");
function startMessagingInstance() {
    return __awaiter(this, void 0, void 0, function* () {
        connection = yield amqplib.connect('amqp://localhost');
        channel = yield connection.createChannel();
        var queue = 'payment-skeleton';
        channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        console.log('Now listening...');
        channel.consume(queue, function reply(msg) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(`Received: ${msg.content.toString()}`);
                responseMessage = "Successful Response from Payment Service!";
                yield channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(responseMessage)), {
                    correlationId: msg.properties.correlationId
                });
                console.log(`Responded: ${JSON.stringify(responseMessage)}`);
                channel.ack(msg);
            });
        });
    });
}
startMessagingInstance();
