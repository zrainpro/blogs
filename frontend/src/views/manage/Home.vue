<template>
  <div>
    <echarts :config="time"></echarts>
    <echarts :config="address"></echarts>
  </div>
</template>

<script>
import echarts from '../../components/echarts';
export default {
  name: 'manageHome',
  components: { echarts },
  data() {
    return {
      time: {
        title: {
          text: '浏览时间分布统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      },
      address: {
        title: {
          text: '城市浏览统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      }
    }
  },
  mounted() {
    // 时间统计
    this.apiPost('/api/statistics/time').then(res => {
      this.time.xAxis[0].data = res.data.map(_ => _.name);
      this.time.series.push({
        name: '',
        type: 'line',
        stack: '',
        areaStyle: {},
        data: res.data.map(_ => _.count)
      })
    });
    // 位置统计
    this.apiPost('/api/statistics/address').then(res => {
      this.address.xAxis[0].data = res.data.map(_ => _.name);
      this.address.series.push({
        name: '',
        type: 'bar',
        stack: '',
        areaStyle: {},
        data: res.data.map(_ => _.count)
      })
    })
  }
}
</script>

<style lang="less" scoped>

</style>
