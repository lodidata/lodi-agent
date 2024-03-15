<template>
  <div class="right">
    <div class="right-head align-center flex-wrap">
      <div class="align-center">
        <div
          class="nav flex-center"
          v-for="(item, idx) in navList"
          :key="item.id"
          :class="{ active: navIdx === idx }"
          @click="navClick(idx)"
        >
          {{ $t(item.txt) }}
        </div>
      </div>
      <el-date-picker
        v-model="times"
        type="daterange"
        range-separator="-"
        :start-placeholder="$t('public.timeStart')"
        :end-placeholder="$t('public.timeEnd')"
        value-format="yyyy-MM-dd"
        :clearable="false"
      ></el-date-picker>
      <div class="search align-center">
        <div class="btn flex-center" @click="search">{{ $t('button.btn1') }}</div>
        <div class="btn flex-center" @click="logout">{{ $t('button.btn2') }}</div>
      </div>
    </div>

    <div class="right-list flex-wrap">
      <div class="right-list-cont flex-between" v-for="item in itemList" :key="item.id">
        <img :src="item.imgUrl" alt="" />
        <div class="text-right flex-1">
          <p>{{ $t(item.tit) }}</p>
          <p
            class="amount"
            :class="{
              f20: item.val.toString().length > 12,
              f16: item.val.toString().length > 16
            }"
          >
            {{ item.val }}
          </p>
        </div>
      </div>
    </div>

    <div class="title">
      {{ $t('home.rightTit1') }}：
      <span>{{ time }}</span>
    </div>
    <!-- 游戏分类 -->
    <el-table
      :data="gameData"
      border
      :cell-style="cellStyle"
      :header-cell-style="{
        color: '#9D9D9D',
        background: '#171633',
        borderColor: '#0E0D20',
        fontWeight: '500',
        textAlign: 'center'
      }"
      style="width: 740px; border-color: #0e0d20; margin-bottom: 20px; font-size: 16px"
    >
      <el-table-column
        prop="game_name"
        align="center"
        :label="$t('home.tableTxt1')"
        width="180"
      ></el-table-column>
      <el-table-column prop="bet" align="center" :label="$t('home.tableTxt2')"></el-table-column>
      <el-table-column
        prop="proportion"
        align="center"
        :label="$t('home.tableTxt3')"
      ></el-table-column>
      <el-table-column prop="fee" align="center" :label="$t('home.tableTxt5')"></el-table-column>
      <el-table-column prop="bkge" align="center" :label="$t('home.tableTxt4')"></el-table-column>
      <template slot="empty">
        <div class="table_empty">{{ $t('public.nullTxt') }}</div>
      </template>
    </el-table>

    <div class="right-chart">
      <div class="chart-nav flex-between">
        <div class="chart-nav-title">{{ $t('home.rightTit2') }}</div>
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

      <div id="main" style="height: 422px; width: 100%; margin-top: 20px"></div>
    </div>
  </div>
</template>

<script>
import { myMixin } from '@/utils/mixins'
const navList = Object.freeze([
    {
      id: 'nav1',
      val: '',
      txt: 'home.rightNav1'
    },
    {
      id: 'nav2',
      val: '',
      txt: 'home.rightNav2'
    },
    {
      id: 'nav3',
      val: '',
      txt: 'home.rightNav3'
    },
    {
      id: 'nav4',
      val: '',
      txt: 'home.rightNav4'
    },
    {
      id: 'nav5',
      val: '',
      txt: 'home.rightNav5'
    },
    {
      id: 'nav6',
      val: '',
      txt: 'home.rightNav6'
    }
  ]),
  chartNav = Object.freeze([
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
  name: 'HomeRight',
  props: {
    itemList: {
      type: Array,
      default: () => []
    },
    chartList: {
      type: Array,
      default: () => []
    },
    gameData: {
      type: Array,
      default: () => []
    },
    time: String
  },
  data() {
    return {
      navIdx: 0,
      navList, // 搜索导航栏
      chartIdx: 1,
      chartNav, // 天 月切换

      times: []
    }
  },
  created() {
    this.times = this.getToday()
  },
  mixins: [myMixin],
  mounted() {},
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

      this.$emit('chart', params)
    },

    async logout() {
      await this.$store.dispatch('user/logout')
    },

    cellStyle() {
      return 'background: #1D1C3F;color: #fff;border-color: #0e0d20;' //rgb(105,0,7)
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
        barArr.push(item.bet_amount)
        lineArr.push(item.bkge)
      })
      // bet_amount 总流水	bkge 总盈利  总流水是柱状图，折线图是总分红

      let option = {
        title: {},
        tooltip: {},
        legend: {
          //   data: ['销量', '销量s']
          textStyle: {
            fontSize: 14, //字体大小
            color: '#ffffff' //字体颜色
          }
        },
        xAxis: {
          data: dataArr,
          axisLabel: {
            textStyle: {
              fontSize: '12px',
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
              fontSize: '12px',
              color: '#E4E4E4'
            }
          },
          axisTick: {
            show: false
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
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },

    navClick(idx) {
      this.navIdx = idx
      if (idx === 1) {
        this.times = this.getYesterday()
      } else if (idx === 2) {
        this.times = this.getWeekStartAndEnd(0)
      } else if (idx === 3) {
        this.times = this.getWeekStartAndEnd(-1)
      } else if (idx === 4) {
        this.times = this.getMonthStartAndEnd(0)
      } else if (idx === 5) {
        this.times = this.getMonthStartAndEnd(-1)
      } else {
        this.times = this.getToday()
      }
    },

    search() {
      this.$emit('search', this.navIdx, this.times)
    },

    setTime() {
      this.time2 = this.getYesterday() // 昨天
      this.time3 = this.getWeekStartAndEnd(0) // 本周
      this.time4 = this.getWeekStartAndEnd(-1) // 上周
      this.time5 = this.getMonthStartAndEnd(0) // 本月
      this.time6 = this.getMonthStartAndEnd(-1) // 上月
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
.right {
  //   padding-top: 40px;
  &-head {
    .search {
      .btn {
        width: 60px;
        height: 30px;
        background: #7753e0;
        border: 1px solid rgba(119, 83, 224, 1);
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        margin-left: 10px;
      }
    }
    .el-date-editor {
      margin-left: 10px;
      border: 1px solid #7753e0;
      background: #171633;
      width: 212px;
      border-radius: 15px;
      ::v-deep .el-range-separator {
        color: #fff;
        padding: 0;
        width: 12px;
      }
      ::v-deep .el-range-input {
        background: none;
        color: #959595;
        width: 90px;
      }
    }
  }
  &-list {
    margin: 20px 0 10px;
    &-cont {
      width: 238px;
      height: 86px;
      background: #171633;
      border-radius: 4px;
      padding: 10px 20px 15px;
      margin: 0 10px 10px 0;
      font-size: 16px;
      &:first-child {
        width: 486px;
      }
      //   &:nth-child(2) {
      //     margin-right: 0;
      //   }
      image {
        width: 40px;
        height: 40px;
      }
      .amount {
        // font-size: 16px;
        color: #e4e4e4;
      }
    }
  }
  .title {
    font-size: 18px;
    color: #e4e4e4;
    padding-bottom: 10px;
    span {
      font-size: 16px;
    }
  }
  &-chart {
    width: 740px;
    height: 496px;
    background: #171633;
    border-radius: 4px;
    padding: 24px 20px;
    .chart-nav {
      &-title {
      }
    }
  }
  .nav {
    cursor: pointer;
    width: 60px;
    height: 30px;
    background: #171633;
    border-right: 1px solid #7753e0;
    border-top: 1px solid #7753e0;
    border-bottom: 1px solid #7753e0;
    &:first-child {
      border-left: 1px solid #7753e0;
      border-radius: 15px 0 0 15px;
    }
    &:last-child {
      border-radius: 0 15px 15px 0;
    }
  }
  .active {
    color: #fff;
    background: #7753e0;
  }

  ::v-deep .el-table__empty-text {
    width: 100%;
  }
  .table_empty {
    background: #1d1c3f;
    color: #fff;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #0e0d20;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #0e0d20;
  }
}

/** 泰语修改样式 */
.th,
.en {
  .right {
    .nav {
      width: 90px;
    }
    .btn {
      width: 80px;
      margin: 10px 10px 0 0;
    }
  }
}

/** 英语修改样式 */
</style>