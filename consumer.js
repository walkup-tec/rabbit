const amqp = require("amqplib");

const RABBIT_URL = "amqp://guest:guest@rabbitmq:5672";
const QUEUE = "7624";
const RESPONSE_QUEUE = "fila_resposta";

async function start() {
  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();

  await ch.assertQueue(QUEUE, { durable: true });
  await ch.assertQueue(RESPONSE_QUEUE, { durable: true });

  console.log("👂 Aguardando mensagens...");

  ch.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());
    const correlationId = msg.properties.correlationId;

    console.log("📩 Recebido:", content);

    const response = {
      correlationId,
      status: "processado",
      resultado: "sucesso",
    };

    ch.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(response)),
      { correlationId },
    );

    ch.ack(msg);
  });
}

start();
