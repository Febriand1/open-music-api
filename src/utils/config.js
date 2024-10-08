const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  jwt: {
    accessKey: process.env.ACCESS_TOKEN_KEY,
    refreshKey: process.env.REFRESH_TOKEN_KEY,
    maxAgeSec: process.env.ACCESS_TOKEN_AGE,

  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
};

module.exports = config;
