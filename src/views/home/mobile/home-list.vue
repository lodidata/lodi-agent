<template>
  <div class="details">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$t('detail.title')"
      left-arrow
      @click-left="$router.go(-1)"
      fixed
    ></van-nav-bar>

    <div class="details-nav flex-between">
      <div
        v-for="item in navList"
        :key="item.val"
        class="flex-center flex-1"
        :class="{ active: +item.val === navIdx }"
        @click="navIdx = +item.val"
      >
        {{ $t(item.txt) }}
      </div>
    </div>

    <!-- 平台详情 -->
    <div class="details-cont">
      <div class="search">
        <div class="search-ipt">
          <p>{{ $t('detail.searchTxt') }}：</p>
          <input type="text" :placeholder="$t('detail.searchIpt')" v-model="account" />
        </div>

        <div class="search-group flex-between pt" v-show="navIdx === 1">
          <div
            @click="
              () => {
                show = true
                showIdx = 1
                currentDate = new Date(beginTime.replace(/-/g, ','))
              }
            "
            class="search-ipt flex-1"
          >
            <p>{{ $t('public.timeStart') }}：</p>
            <div class="ipt flex-between">
              {{ beginTime }}
              <img src="@/assets/image/date.png" alt="" />
            </div>
          </div>

          <div
            @click="
              () => {
                show = true
                showIdx = 2
                currentDate = new Date(endTime.replace(/-/g, ','))
              }
            "
            class="search-ipt flex-1"
          >
            <p>{{ $t('public.timeEnd') }}：</p>
            <div class="ipt flex-between">
              {{ endTime }}
              <img src="@/assets/image/date.png" alt="" />
            </div>
          </div>
        </div>

        <div
          @click="
            () => {
              show = true
              showIdx = 3
              currentDate = new Date(monthVal.replace(/-/g, ',') + ',1')
            }
          "
          v-show="navIdx === 2"
          class="search-ipt pt"
        >
          <p>{{ $t('public.timeTxt') }}：</p>
          <div class="ipt flex-between">
            {{ monthVal }}
            <img src="@/assets/image/date.png" alt="" />
          </div>
        </div>

        <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
          <van-datetime-picker
            v-model="currentDate"
            :type="navIdx === 1 ? 'date' : 'year-month'"
            :cancelButtonText="$t('button.btn4')"
            :confirmButtonText="$t('button.btn5')"
            @confirm="confirmFn()"
            @cancel="show = false"
          />
        </van-popup>

        <div class="search-btn flex-center" @click="getData">{{ $t('button.btn1') }}</div>
      </div>

      <div class="title">{{ $t('detail.title1') }}</div>

      <div class="align-center flex-wrap">
        <div class="cont-nav flex-between" v-for="(item, idx) in itemList" :key="'detail' + idx">
          <img :src="item.imgUrl" alt="" />
          <div class="text-right flex-1">
            <p>{{ $t(item.tit) }}</p>
            <p class="amount">
              {{ item.val }}
            </p>
          </div>
        </div>
      </div>

      <PageTable :tableHead="gameHead" :tableBody="gameData">
        <template slot="table">
          <div
            class="table-cont align-center"
            v-for="(item, idx) in gameData"
            :key="'tableBody' + idx"
          >
            <span class="flex-center flex-1">{{ item.game_type_name }}</span>
            <span class="flex-center flex-1">{{ item.game_bet_amount }}</span>
            <span class="flex-center flex-1">{{ item.game_prize_amount }}</span>
            <span class="flex-center flex-1">{{ item.profit }}</span>
          </div>
        </template>
      </PageTable>
    </div>

    <!-- 成本明细 -->
    <div class="details-cont">
      <div class="title">{{ $t('detail.title2') }}</div>
      <PageTable :tableHead="costHead" :tableBody="costData">
        <template slot="table">
          <div
            class="table-cont align-center"
            v-for="(item, idx) in costData"
            :key="'tableBody' + idx"
          >
            <span class="flex-center flex-1">{{ item.bet_ratio_amount }}</span>
            <span class="flex-center flex-1">{{ item.deposit_ratio_amount }}</span>
            <span class="flex-center flex-1">{{ item.revenue_ratio_amount }}</span>
            <span class="flex-center flex-1">{{ item.coupon_ratio_amount }}</span>
            <span class="flex-center flex-1">{{ item.manual_ratio_amount }}</span>
          </div>
        </template>
      </PageTable>
    </div>

    <!-- 代理详情 -->
    <div class="details-cont">
      <div class="title">{{ $t('detail.title3') }}</div>
      <PageTable :tableHead="proxyHead" :tableBody="proxyData">
        <template slot="table">
          <div
            class="table-cont align-center"
            v-for="(item, idx) in proxyData"
            :key="'tableBody' + idx"
          >
            <span class="flex-center flex-1">{{ item.user_name }}</span>
            <span class="flex-center flex-1">{{ item.agent_name }}</span>
            <span class="flex-center flex-1">{{ item.agent_cnt }}</span>
            <span class="flex-center flex-1">{{ item.bet_amount }}</span>
            <span class="flex-center flex-1">{{ item.bkge }}</span>
          </div>
        </template>
      </PageTable>

      <el-pagination
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        :pager-count="5"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { homeTableData } from '@/api/user'
const navList = Object.freeze([
  {
    val: '1',
    txt: 'detail.headNav1'
  },
  {
    val: '2',
    txt: 'detail.headNav2'
  }
])
import PageTable from '@/components/PageTable'

const nav1 = require('@/assets/image/nav1.png')
const nav2 = require('@/assets/image/nav2.png')
const nav3 = require('@/assets/image/nav3.png')
const nav4 = require('@/assets/image/nav4.png')
const nav5 = require('@/assets/image/nav5.png')
export default {
  name: 'MobileHomeList',
  components: {
    PageTable
  },
  props: {},
  data() {
    return {
      navList,
      navIdx: 1,
      show: false,
      showIdx: 1, // 1 开始时间 2 结束时间 3 月结时间
      currentDate: new Date(), // 默认时间
      beginTime: '', // 开始时间
      endTime: '', // 结束时间
      monthVal: '', // 月结日期
      account: '', // 用户账号
      gameData: [], // 游戏table
      gameHead: [
        'detail.table1Txt1',
        'detail.table1Txt2',
        'detail.table1Txt3',
        'detail.table1Txt4'
      ],

      proxyData: [], // 代理table
      proxyHead: [
        'detail.table3Txt1',
        'detail.table3Txt2',
        'detail.table3Txt3',
        'detail.table3Txt4',
        'detail.table3Txt11'
      ],

      costData: [], // 成本明细
      costHead: [
        'detail.table2Txt1',
        'detail.table2Txt2',
        'detail.table2Txt3',
        'detail.table2Txt4',
        'detail.table2Txt5'
      ],

      info: {},

      pageNo: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    itemList() {
      const res = this.info || {}
      return [
        {
          imgUrl: nav1,
          tit: 'detail.list1',
          val: res.total_tz || 0
        },
        {
          imgUrl: nav2,
          tit: 'detail.list2',
          val: res.total_fj || 0
        },
        {
          imgUrl: nav3,
          tit: 'detail.list3',
          val: res.total_yk || 0
        },
        {
          imgUrl: nav4,
          tit: 'detail.list4',
          val: res.total_kk || 0
        },
        {
          imgUrl: nav5,
          tit: 'detail.list5',
          val: res.total_yl || 0
        }
      ]
    }
  },
  created() {
    this.beginTime = this.getToday(0)
    this.endTime = this.getToday(0)
    this.monthVal = this.getToday(1)
    this.getData()
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 获取今天的时间
    getToday(idx) {
      let date = new Date(),
        year = date.getFullYear(),
        m = date.getMonth() + 1,
        month = m > 10 ? m : '0' + m,
        d = date.getDate(),
        day = d > 10 ? d : '0' + d,
        t = year + '-' + month + '-' + day
      return idx === 0 ? t : year + '-' + month
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },

    handleCurrentChange(val) {
      this.pageNo = val
      this.getData()
    },

    confirmFn() {
      let idx = this.showIdx,
        time = this.timeFormat(this.currentDate)
      this.currentDate = new Date()
      this.show = false
      if (idx == 1) {
        this.beginTime = time
        return
      } else if (idx === 2) {
        this.endTime = time
        return
      } else {
        this.monthVal = time
      }
    },

    timeFormat(time) {
      // 时间格式化 2019-09-08
      let year = time.getFullYear(),
        month = time.getMonth() + 1,
        day = time.getDate(),
        months = +month > 10 ? month : '0' + month,
        days = +day > 10 ? day : '0' + day,
        timeD = year + '-' + months + '-' + days,
        timeM = year + '-' + months
      return this.showIdx != 3 ? timeD : timeM
    },

    // 查询参数
    param() {
      let params = {
        page: this.pageNo,
        page_size: this.pageSize,
        model: this.navIdx, // 报表模型：1-日结，2-月结
        user_name: this.account
      }
      if (this.navIdx === 1) {
        params.date_start = this.beginTime
        params.date_end = this.endTime
        this.tableIdx = 1
      } else {
        this.tableIdx = 2
        params.month = this.monthVal // 月报表查询
      }
      return params
    },

    async getData() {
      if (new Date(Date.parse(this.beginTime)) > new Date(Date.parse(this.endTime))) {
        this.$message.error(this.$t('error.txt8'))
        return
      }
      try {
        let params = this.param()
        const res = await homeTableData(params)
        const { attributes, data } = res || {}
        const { agent_details, game_info, platform_info } = data || {}
        this.total = attributes.total
        this.gameData = game_info || []
        this.proxyData = agent_details || []
        let arr = []
        arr.push(platform_info)
        this.costData = arr || []
        this.info = data
      } catch (error) {
        this.proxyData = []
        this.gameData = []
        this.costData = []
        this.total = 0
        this.info = {}
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.details {
  padding: 16.533333vw 0 10.666667vw;

  ::v-deep .van-nav-bar__content {
    height: 16.533333vw;
    background: #0e0d20;
  }
  ::v-deep .van-nav-bar .van-icon {
    color: #fff;
  }

  ::v-deep.van-nav-bar__title {
    color: #fff;
  }

  &-nav {
    height: 11.733333vw;
    font-size: 3.733333vw;
    color: #72788b;
    border-bottom: 0.266667vw solid #39375a;
    div {
      height: 100%;
    }
    .active {
      position: relative;
      color: #7f4fe8;
      &::after {
        content: '';
        background: url('@/assets/image/border-bg.png') center no-repeat;
        background-size: cover;
        width: 100%;
        height: 0.8vw;
        position: absolute;
        bottom: -0.533333vw;
      }
    }
  }
  &-cont {
    margin-top: 5.333333vw;
    padding: 0 4.266667vw;
    .search {
      padding-bottom: 6.933333vw;
    }
    .search-ipt {
      font-size: 3.2vw;
      color: #7753e0;
      input[type='text'],
      .ipt {
        height: 10.666667vw;
        background: #171633;
        border: 0.266667vw solid rgba(119, 83, 224, 1);
        border-radius: 6.666667vw;
        color: #666666;
        padding: 0 5.333333vw;
        width: 100%;
        margin-top: 2.133333vw;
        font-size: 3.733333vw;
      }
      img {
        width: 4.266667vw;
        height: 3.733333vw;
      }
    }
    .search-group {
      .search-ipt {
        &:first-child {
          margin-right: 3.2vw;
        }
      }
    }
    .pt {
      padding-top: 3.2vw;
    }
    .search-btn {
      height: 10.666667vw;
      background-image: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
      border-radius: 6.666667vw;
      font-size: 3.733333vw;
      color: #fff;
      margin-top: 5.333333vw;
    }

    .title {
      font-size: 4.266667vw;
      color: #e4e4e4;
      padding-bottom: 2.666667vw;
    }
    .cont-nav {
      width: 44.266667vw;
      height: 24vw;
      background: #171633;
      border-radius: 1.066667vw;
      margin: 0 2.666667vw 2.666667vw 0;
      padding: 0 4vw;
      font-size: 3.2vw;
      color: #999999;
      &:nth-child(2n) {
        margin-right: 0;
      }
      &:last-child {
        width: 100%;
        margin: 0 0 5.333333vw 0;
      }
      img {
        width: 10.666667vw;
        height: 10.666667vw;
      }
      .amount {
        font-size: 5.333333vw;
        line-height: 5.333333vw;
        color: #e4e4e4;
        padding-top: 1.066667vw;
        word-break: break-all;
      }
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 5.333333vw;
  }
  .el-pagination .btn-prev,
  .el-pagination .btn-next {
    color: #fff;
  }
  .el-pagination .btn-prev,
  .el-pagination .btn-next,
  .el-pagination button:disabled {
    background: rgb(23, 22, 51);
  }
  .el-pager li {
    background: rgb(23, 22, 51);
  }

  .el-pager li:hover {
    color: #fff;
  }

  .el-pager li.active {
    color: #fff;
  }
}

.th {
  .details {
    ::v-deep .table {
      .table-head div {
        height: 14.933333vw;
      }
    }
  }
}
</style>