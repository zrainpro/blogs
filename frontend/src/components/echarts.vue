<template>
  <div ref="echarts" :style="`width: ${width}px; height: ${height}px`"></div>
</template>

<script>
import echarts from 'echarts';

const defaultConfig = {
  title: {
    text: ''
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
  legend: {
    data: ['邮件营销']
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
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '邮件营销',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      data: [120, 132, 101, 134, 90, 230, 210]
    }
  ]
};

export default {
  name: "echarts",
  props: {
    config: {
      type: Object,
      default: () => JSON.parse(JSON.stringify(defaultConfig))
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: 400
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.echarts);
    this.chart.setOption(this.config)
  },
  watch: {
    config: {
      deep: true,
      handler() {
        this.chart.setOption(this.config)
      }
    }
  },
  beforeDestroy() {
    this.chart.destroy();
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
