<template>
  <div class="home justify-between">
    <div class="home-left">
      <HomeLeft :contList="contList" :amountInfo="balanceInfo"></HomeLeft>
    </div>
    <div class="flex-1">
      <HomeRight
        :itemList="itemList"
        :chartList="chartList"
        :gameData="gameData"
        :time="gameTime"
        @search="search"
        @chart="chartSearch"
      ></HomeRight>
    </div>
  </div>
</template>

<script>
import { homeData, getWalletInfo, homeChart } from '@/api/user'
import HomeLeft from './components/HomeLeft'
import HomeRight from './components/HomeRight'

const list1 = require('@/assets/image/list1.png')
const list2 = require('@/assets/image/list2.png')
const list3 = require('@/assets/image/list3.png')
const list4 = require('@/assets/image/list4.png')
const list5 = require('@/assets/image/list5.png')
const list6 = require('@/assets/image/list6.png')
const list7 = require('@/assets/image/list7.png')
const list8 = require('@/assets/image/list8.png')
const list9 = require('@/assets/image/list9.png')
const list10 = require('@/assets/image/list10.png')
const list11 = require('@/assets/image/list11.png')
const list12 = require('@/assets/image/list12.png')
const list13 = require('@/assets/image/list13.png')
export default {
  name: 'PcHome',
  components: { HomeLeft, HomeRight },
  props: {},
  data() {
    return {
      info: {},
      agent_info: {},

      balanceInfo: {},
      timeArr: [], // 当前时间
      pageIdx: 0,

      chartList: [],
      gameData: [],
      gameTime: '',

      timer: null // 定时器
    }
  },
  provide() {
    return {
      parent: this
    }
  },
  computed: {
    contList() {
      const res = this.agent_info || {}
      return [
        {
          title: 'home.list1',
          val: '',
          imgUrl: ''
        },
        {
          title: '',
          val: '',
          imgUrl: require('@/assets/image/member.png')
        },
        {
          title: 'home.list2',
          val: res.all_agent || 0,
          imgUrl: ''
        },
        {
          title: '',
          val: '',
          imgUrl: '',
          subList: [
            {
              tit: 'home.list3',
              val: res.direct_agent || 0
            },
            {
              tit: 'home.list4',
              val: res.next_agent || 0
            }
          ]
        },
        {
          title: 'home.list5',
          val: res.bet_amount || 0,
          imgUrl: ''
        },
        {
          title: 'home.list6',
          val: res.proportion || 0,
          imgUrl: ''
        },
        {
          title: 'home.list18',
          val: res.fee_amount || 0,
          imgUrl: ''
        },
        {
          title: 'home.list7',
          val: res.profits || 0,
          imgUrl: ''
        }
      ]
    },

    itemList() {
      const info = this.info || {}
      let arr = [
          {
            id: 'list1',
            imgUrl: list1,
            tit: 'home.list5',
            val: info.total_bet_amount
          },
          {
            id: 'list2',
            imgUrl: list2,
            tit: 'home.list7',
            val: info.profits
          },
          {
            id: 'list3',
            imgUrl: list3,
            tit: 'home.list8',
            val: info.next_bet_amount
          },
          {
            id: 'list4',
            imgUrl: list4,
            tit: 'home.list9',
            val: info.bet_amount
          },
          {
            id: 'list5',
            imgUrl: list5,
            tit: 'home.list6',
            val: info.proportion
          },
          {
            id: 'list6',
            imgUrl: list6,
            tit: 'home.list10',
            val: info.first_recharge_user
          },
          {
            id: 'list7',
            imgUrl: list7,
            tit: 'home.list11',
            val: info.valid_amount
          },
          {
            id: 'list8',
            imgUrl: list8,
            tit: 'home.list12',
            val: info.new_register
          },
          {
            id: 'list9',
            imgUrl: list9,
            tit: 'home.list13',
            val: info.all_recharge_amount
          },
          {
            id: 'list10',
            imgUrl: list10,
            tit: 'home.list14',
            val: info.bet_user
          },
          {
            id: 'list11',
            imgUrl: list11,
            tit: 'home.list15',
            val: info.valid_user
          },
          {
            id: 'list12',
            imgUrl: list12,
            tit: 'home.list16',
            val: info.first_recharge_amount
          },
          {
            id: 'list13',
            imgUrl: list13,
            tit: 'home.list18',
            val: info.fee_amount
          }
        ],
        nullArr = [false, null, undefined],
        arrRes = arr.filter(i => !nullArr.includes(i.val))
      return arrRes
    }
  },
  created() {
    this.timeArr = this.getToday()
    this.getAmount()
    this.timeInt()
  },
  mounted() {},
  beforeDestroy() {
    clearInterval(this.timer)
    this.tim = null
  },
  destroyed() {},
  methods: {
    timeInt() {
      let idx = this.pageIdx
      if (idx === 0) {
        this.getInfo()
        this.timer = setInterval(() => {
          this.getInfo()
          // }, 10000)
        }, 600000)
        return
      } else {
        clearInterval(this.timer)
        this.getInfo()
      }
    },

    search(idx, t) {
      this.pageIdx = idx
      this.timeArr = t
      this.timeInt()
    },

    async getInfo() {
      try {
        let params = {
          start_time: this.timeArr[0],
          end_time: this.timeArr[1]
        }
        const data = await homeData(params),
          res = data.data
        this.agent_info = res.agent_info
        this.info = res.time_info || {}
        this.chartList = res.bet_list || []
        this.gameData = res.game_list || []
        this.gameTime = res.yesterday_time || []
      } catch (error) {
        clearInterval(this.tim)
      }
    },

    // 获取金额
    async getAmount() {
      const res = await getWalletInfo()
      this.balanceInfo = res.data
    },

    // 图表 天、月查询
    async chartSearch(e) {
      const res = await homeChart(e)
      this.chartList = res || []
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
    }
  }
}
</script>

<style scoped lang='scss'>
.home {
  padding: 20px 0 40px;
  &-left {
    margin-right: 20px;
    width: 418px;
  }
}
</style>