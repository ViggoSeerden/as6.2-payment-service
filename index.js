const amqplib = require("amqplib");

async function startMessagingInstance() {
    const connection = await amqplib.connect(process.env.RABBITMQ.toString() ?? 'amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'osso-exchange';
    await channel.assertExchange(exchange, 'topic', { durable: true });

    const queue = '';
    await channel.assertQueue(queue, { durable: true });

    const routingKeyPattern = 'payment.request.*.*';
    await channel.bindQueue(queue, exchange, routingKeyPattern);

    channel.prefetch(5);
    console.log('Now listening...');

    channel.consume(queue, async function reply(msg) {
        console.log(`Received message with routing key '${msg.fields.routingKey}': ${msg.content.toString()}`);

        const routingKeyParts = routingKey.toString().split('.')

        const responseMessage = `Successful Response from Payment Service with amount ${routingKeyParts[3]}!`;

        await channel.publish(
            exchange,
            `payment.response.${routingKeyParts[2]}`,
            Buffer.from(JSON.stringify(responseMessage)),
            {
                correlationId: msg.properties.correlationId,
            }
        );

        console.log(`Responded "${JSON.stringify(responseMessage)}" using key payment.response.${routingKeyParts[2]}`);
        channel.ack(msg);
    });
}

startMessagingInstance();
