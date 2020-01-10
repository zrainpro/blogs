'use strict';

async function getNextId(name, ctx, base = 10000000) {
  const value = await ctx.model.Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: 1 });
  return String(base + Number(value.value));
}
async function removeCounter(name, ctx, base = 10000000) {
  const value = await ctx.model.Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { value: -1 } },
    { new: true, upsert: true, setDefaultsOnInsert: 1 });
  return String(base + Number(value.value));
}

module.exports = {
  getNextId,
  removeCounter,
};
