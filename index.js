const amqplib = require("amqplib");

async function startMessagingInstance() {
    connection = await amqplib.connect(process.env.RABBITMQ.toString() ?? 'amqp://localhost')
    channel = await connection.createChannel()

    var queue = 'payment-skeleton';

    channel.assertQueue(queue, {
        durable: false
    });

    channel.prefetch(1);
    console.log('Now listening...');
    channel.consume(queue, async function reply(msg) {

        console.log(`Received: ${msg.content.toString()}`);

        responseMessage = "Successful Response from Payment Service!"

        await channel.sendToQueue(msg.properties.replyTo,
            Buffer.from(JSON.stringify(responseMessage)), {
            correlationId: msg.properties.correlationId
        });

        console.log(`Responded: ${JSON.stringify(responseMessage)}`);

        channel.ack(msg);
    });
}
startMessagingInstance()