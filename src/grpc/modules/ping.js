const name = 'Ping';
const service = 'PingMethod';
const proto = require('path').resolve(`${__dirname}/../proto/ping.proto`);

const Ping = async (ctx, next) => {
  try {
    ctx.res = { message: 'pong' };
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  name,
  proto,
  service,
  handlers: [
    { method: Ping }
  ]
}
