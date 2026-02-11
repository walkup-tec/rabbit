const amqp = require('amqplib');

const RABBIT_URL = "amqp://walkup:264500mmS%40@rabbitmq:5672/";
const QUEUE = "7624";
const RESPONSE_QUEUE = "fila_resposta";

async function start() {
  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();

  await ch.assertQueue(RESPONSE_QUEUE, { durable: true });

  console.log("👂 Aguardando mensagens na fila 7624");

  ch.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const correlationId = msg.properties.correlationId;

    const response = {
      correlationId,
      status: "processado",
      resultado: "sucesso"
    };

    const replyQueue = msg.properties.replyTo || RESPONSE_QUEUE;

    ch.sendToQueue(
      replyQueue,
      Buffer.from(JSON.stringify(response)),
      { correlationId }
    );

    ch.ack(msg);
  });
}

start();




