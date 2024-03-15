<template>
  <div class="foot">
    <div class="foot-txt flex-between">
      <div class="title">{{ $t('home.rightTit2') }}</div>

      <div class="align-center">
        <div
          v-for="item in chartNav"
          :key="'chart' + item.id"
          :class="{ active: chartIdx === item.id }"
          class="nav flex-center"
          @click="chartClick(item.id)"
        >
          {{ $t(item.txt) }}
        </div>
      </div>
    </div>

    <div id="main"></div>
  </div>
</template>

<script>
const chartNav = Object.freeze([
  {
    id: 1,
    txt: 'home.rightNav7'
  },
  {
    id: 2,
    txt: 'home.rightNav8'
  }
])
export default {
  name: 'MobileHomeFoot',
  props: {
    chartList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartNav,
      chartIdx: 1
    }
  },
  inject: ['parent'],
  methods: {
    chartClick(e) {
      this.chartIdx = e
      let times = this.getToday()[0]
      let params = {
        type: e
      }
      if (e === 1) {
        params.time = times
      } else {
        params.time = times.substring(0, 5) + '01-01'
      }

      this.parent.chartSearch(params)
    },

    // 获取今天的时间
    getToday() {
      let date = new Date(),
        year = date.getFullYear(),
        m = date.getMonth() + 1,
        month = m > 10 ? m : '0' + m,
        d = date.getDate(),
        day = d > 10 ? d : '0' + d,
        t = year + '-' + month + '-' + day
      return [t, t]
    },

    drawChart() {
      // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
      let myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据

      let dataArr = [],
        barArr = [],
        lineArr = []
      this.chartList.map(item => {
        dataArr.push(item.time.substring(5, 12))
        barArr.push(item.bet_amount / 1000)
        lineArr.push(item.bkge / 1000)
      })
      // bet_amount 总流水	bkge 总盈利  总流水是柱状图，折线图是总分红
      let option = {
        title: {},
        tooltip: {
          confine: true,
          formatter: function (params) {
            return `${params.seriesName}<br/>${params.name} ${params.value * 1000}`
          }
        },
        legend: {
          //   data: ['销量', '销量s']
          textStyle: {
            fontSize: 12, //字体大小
            color: '#ffffff' //字体颜色
          }
        },
        xAxis: {
          data: dataArr,
          axisLabel: {
            textStyle: {
              fontSize: '2.133333vw',
              color: '#E4E4E4'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          splitLine: {
            show: true,
            lineStyle: {
              color: '#25243D', //垂直于x轴的线的颜色
              width: 1 //线的宽度
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: '3.2vw',
              color: '#E4E4E4'
            }
          },
          axisTick: {
            show: false
          },
          name: 'k',
          axisLine: {
            show: false, // 必须显示!!!!!!否则name无效
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: this.$t('home.chartTxt1'),
            type: 'bar',
            barWidth: 10,
            data: barArr,
            itemStyle: {
              color: '#3572FF'
            }
          },
          {
            name: this.$t('home.chartTxt2'),
            type: 'line',
            data: lineArr,
            itemStyle: {
              color: '#FF9900'
            }
          }
        ]
      }
      myChart.clear()
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  },
  watch: {
    chartList: {
      handler(val, oldVal) {
        //执行代码
        if (JSON.stringify(val) === JSON.stringify(oldVal) || !val.length) return
        this.drawChart()
      },
      deep: true,
      immediate: true //true就表示会立即执行
    }
  }
}
</script>

<style scoped lang='scss'>
.foot {
  width: 91.466667vw;
  margin: 6.933333vw auto 0;
  background: #171633;
  border-radius: 1.333333vw;
  #main {
    height: 76.8vw;
    width: 100%;
  }
  &-txt {
    padding: 2.666667vw 4.266667vw 5.333333vw;
    .title {
      font-size: 4.266667vw;
      color: #ffffff;
    }
    .align-center {
      border: 0.266667vw solid #7753e0;
      border-radius: 4vw;
      .nav {
        width: 15.466667vw;
        height: 8.533333vw;
        font-size: 3.733333vw;
        color: #666;
        &:first-child {
          border-right: 0.266667vw solid #7753e0;
          border-radius: 3.5vw 0 0 3.5vw;
        }
        &:last-child {
          border-radius: 0 3.5vw 3.5vw 0;
        }
      }
      .active {
        background: #7753e0;
        color: #ffffff;
      }
    }
  }
}
</style>