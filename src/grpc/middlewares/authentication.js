module.exports = async (ctx, next) => {
  console.warn(JSON.stringify({
    type: TYPE_WARN.GRPC,
    message: 'Auth middleware is must!',
    fullname: ctx.fullName,
    metadata: ctx.metadata
  }, 0, 2))

  await next();
};
