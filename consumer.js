const amqp = require('amqplib');

const RABBIT_URL = "amqp://walkup:264500mmS%40@rabbitmq:5672/";
const QUEUE = "7624";

async function start() {
  const conn = await amqp.connect(RABBIT_URL);
  const ch = await conn.createChannel();

  await ch.assertQueue(QUEUE);

  console.log("👂 Aguardando mensagens na fila 7624");

  ch.consume(QUEUE, async (msg) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());
    const correlationId = msg.properties.correlationId;

    const response = {
      correlationId,
      status: "processado",
      resultado: "sucesso"
    };

    ch.sendToQueue(
      msg.properties.replyTo,
      Buffer.from(JSON.stringify(response)),
      { correlationId }
    );

    ch.ack(msg);
  });
}

start();
;


