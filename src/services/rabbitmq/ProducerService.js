const amqp = require('amqplib');
const config = require('../../utils/config');

const ProducerService = {
  sendMessage: async (queue, message) => {
    let connection;
    try {
      connection = await amqp.connect(config.rabbitMq.server);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
      console.error('Error sending message to queue:', error);
    } finally {
      if (connection) {
        await connection.close();
      }
    }
  },
};

module.exports = ProducerService;
