'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

module.exports = class Proxy extends Controller {
  constructor(props) {
    super(props);
    this.supportTimeType = [ 'day', 'hour' ];
    this.typeTrans = {
      day: 'YYYY-MM-DD',
      hour: 'DD',
    };
  }
  // 浏览时间统计
  async timeCount() {
    const { ctx } = this;
    const params = ctx.request.body;
    const type = params.type || 'day'; // 统计类型, 支持 day 按天统计, hour 按时间段统计
    const city = params.city; // 进行统计的城市
    if (!this.supportTimeType.includes(type)) ctx.throw('不支持的 type 类型');
    let startTime = params.startTime || moment(moment(moment() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD') + ' 00:00:00').valueOf(); // 搜索开始时间, 默认前一周
    let endTime = params.endTime || moment().valueOf(); // 搜索结束时间, 默认当天
    // 对时间做安全处理
    startTime = moment(moment(startTime).format('YYYY-MM-DD') + ' 00:00:00').valueOf();
    endTime = moment(moment(endTime).format('YYYY-MM-DD') + ' 23:59:59').valueOf();

    const query = {
      createTime: { $lte: endTime, $gte: startTime },
    };
    if (city) query.city = city;

    // 查询到全局的数据
    const data = await ctx.model.Views.find(query).select('createTime');
    // 筛选数据, 根据时间统计, 包括 天的统计, 时间段的统计(时间段统计略难)
    const countData = {};
    const format = this.typeTrans[type];
    for (const item of data) {
      const time = moment(item.createTime).format(format);
      if (!countData[time]) countData[time] = 0;
      countData[time]++;
    }
    ctx.body = Object.entries(countData).map(([ key, val ]) => ({
      count: val,
      name: key,
    }));
  }
  // 浏览人 位置 统计
  async addressCount() {
    const { ctx } = this;
    const params = ctx.request.body;
    let startTime = params.startTime || moment(moment(moment() - 7 * 24 * 3600 * 1000).format('YYYY-MM-DD') + ' 00:00:00').valueOf(); // 搜索开始时间, 默认前一周
    let endTime = params.endTime || moment().valueOf(); // 搜索结束时间, 默认当天
    // 对时间做安全处理
    startTime = moment(moment(startTime).format('YYYY-MM-DD') + ' 00:00:00').valueOf();
    endTime = moment(moment(endTime).format('YYYY-MM-DD') + ' 23:59:59').valueOf();

    const data = await ctx.model.Views.find({
      createTime: { $lte: endTime, $gte: startTime },
    }).select('ip city');

    const countData = {};
    for (const item of data) {
      if (!countData[item.city]) countData[item.city] = 0; // 赋初值
      countData[item.city]++;
    }
    ctx.body = Object.entries(countData).map(([ key, val ]) => ({
      count: val,
      name: key,
    }));
  }
};
