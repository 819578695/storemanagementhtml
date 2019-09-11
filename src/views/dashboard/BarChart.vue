<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import store from '@/store'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
import { findCostsMoney } from '@/api/parkCost'

const animationDuration = 6000

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      deptId:'',
      chart: null
    }
  },
  mounted() {
    store.dispatch('GetInfo').then(res => {
       if (this.deptId==1) {
         this.deptId=''
       }
       else{
         this.deptId=res.deptId
       }
       this.initChart()
     })
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      findCostsMoney(this.deptId).then(res => {
          var money =''
          money=res  //统计金额
          this.chart = echarts.init(this.$el, 'macarons')
          var mounth=[new Date().getMonth()+'月',new Date().getMonth()+1+'月']//保存时间的数组
          this.chart.setOption({
            title:{
              text:'园区成本',
            },
            color:'#d48265',
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '2%',
              right: '2%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [{
              type: 'category',
              data: mounth,
              axisTick: {
                alignWithLabel: true
              }
            }],
            yAxis: [{
              type: 'value',
              axisTick: {
                show: false
              }
            }],
            series: [{
              name: '成本',
              type: 'bar',
              stack: 'vistors',
              barWidth: '20%',
              data: money,
              animationDuration
            }]
          })
      }).catch(err => {
      })
    }
  }
}
</script>
