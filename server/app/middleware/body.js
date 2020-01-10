
'use strict';

module.exports = () => {
  return async function body(ctx, next) {
    await next();
    const body = ctx.body;
    if (!body) {
      return {
        code: 200,
        data: null,
        message: 'no response',
      };
    }
    ctx.body = body.self ? {
      code: 200,
      message: 'success',
      ...(delete body.self && body),
    } : {
      code: 200,
      data: body,
      message: 'success',
    };
  };
};
