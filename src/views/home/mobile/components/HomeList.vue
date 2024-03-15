<template>
  <div class="list">
    <!-- nav -->
    <div class="list-nav align-center">
      <div
        v-for="(item, idx) in navList"
        :key="item.id"
        :class="{ active: navIdx === idx }"
        class="flex-1 flex-center"
        @click="navClick(idx)"
      >
        {{ $t(item.txt) }}
      </div>
    </div>

    <div class="search-group flex-between pt">
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
      <van-popup v-model="show" position="bottom" :style="{ height: '40%' }">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :cancelButtonText="$t('button.btn4')"
          :confirmButtonText="$t('button.btn5')"
          @confirm="confirmFn()"
          @cancel="show = false"
        />
      </van-popup>
    </div>
    <div class="search-btn flex-center" @click="search">{{ $t('button.btn1') }}</div>

    <!-- list -->
    <div class="list-list flex-wrap">
      <div class="list-cont flex-col-center" v-for="item in itemList" :key="item.id">
        <img :src="item.imgUrl" alt="" />
        <div class="text-center">
          <p class="amount">
            {{ item.val }}
          </p>
          <p>{{ $t(item.tit) }}</p>
        </div>
      </div>
    </div>

    <!-- table -->
    <PageTable :tableHead="tableHead" :tableBody="gameData">
      <template slot="table">
        <div
          class="table-cont align-center"
          v-for="(item, idx) in gameData"
          :key="'tableBody' + idx"
        >
          <span class="flex-center flex-1">{{ item.game_name }}</span>
          <span class="flex-center flex-1">{{ item.bet }}</span>
          <span class="flex-center flex-1">{{ item.proportion }}</span>
          <span class="flex-center flex-1">{{ item.fee }}</span>
          <span class="flex-center flex-1">{{ item.bkge }}</span>
        </div>
      </template>
    </PageTable>

    <!-- other table -->
    <PageTable :tableHead="otherTableHead" :tableBody="otherData">
      <template slot="table">
        <div
          class="table-cont align-center"
          v-for="(item, idx) in otherData"
          :key="'otherBody' + idx"
        >
          <span class="flex-center flex-1">{{ item.deposit }}</span>
          <span class="flex-center flex-1">{{ item.manual }}</span>
          <span class="flex-center flex-1">{{ item.coupon }}</span>
          <span class="flex-center flex-1">{{ item.revenue }}</span>
          <span class="flex-center flex-1">{{ item.fee_amount }}</span>
        </div>
      </template>
    </PageTable>
  </div>
</template>

<script>
import { myMixin } from '@/utils/mixins'
import PageTable from '@/components/PageTable'
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
])
export default {
  name: 'MobileHomeList',
  components: {
    PageTable
  },
  props: {
    itemList: {
      type: Array,
      default: () => []
    },
    gameData: {
      type: Array,
      default: () => []
    },
    otherData: {
      type: Array,
      default: () => []
    },
    time: String
  },
  mixins: [myMixin],
  inject: ['parent'],
  data() {
    return {
      show: false,
      beginTime: '',
      endTime: '',
      currentDate: new Date(),
      showIdx: 1, // 1 开始时间 2 结束时间
      navList,
      navIdx: 0,
      tableHead: [
        'home.tableTxt1',
        'home.tableTxt2',
        'home.tableTxt3',
        'home.tableTxt5',
        'home.tableTxt4'
      ],
      otherTableHead: [
        'home.tableTxt6',
        'home.tableTxt7',
        'home.tableTxt8',
        'home.tableTxt9',
        'home.tableTxt10'
      ]
    }
  },
  created() {
    this.beginTime = this.getToday()[0]
    this.endTime = this.getToday()[1]
  },
  methods: {
    search() {
      let times = [this.beginTime, this.endTime]
      if (new Date(Date.parse(this.beginTime)) > new Date(Date.parse(this.endTime))) {
        this.$message.error(this.$t('error.txt8'))
        return
      }
      this.parent.search(this.navIdx, times)
    },

    confirmFn() {
      let idx = this.showIdx,
        time = this.timeFormat(this.currentDate)
      this.currentDate = new Date()
      this.show = false
      if (idx == 1) {
        this.beginTime = time
        return
      } else {
        this.endTime = time
      }
    },

    timeFormat(time) {
      // 时间格式化 2019-09-08
      let year = time.getFullYear(),
        month = time.getMonth() + 1,
        day = time.getDate(),
        months = +month > 10 ? month : '0' + month,
        days = +day > 10 ? day : '0' + day,
        timeD = year + '-' + months + '-' + days
      return timeD
    },

    navClick(idx) {
      this.navIdx = idx
      if (idx === 1) {
        this.beginTime = this.getYesterday()[0]
        this.endTime = this.getYesterday()[1]
      } else if (idx === 2) {
        this.beginTime = this.getWeekStartAndEnd(0)[0]
        this.endTime = this.getWeekStartAndEnd(0)[1]
      } else if (idx === 3) {
        this.beginTime = this.getWeekStartAndEnd(-1)[0]
        this.endTime = this.getWeekStartAndEnd(-1)[1]
      } else if (idx === 4) {
        this.beginTime = this.getMonthStartAndEnd(0)[0]
        this.endTime = this.getMonthStartAndEnd(0)[1]
      } else if (idx === 5) {
        this.beginTime = this.getMonthStartAndEnd(-1)[0]
        this.endTime = this.getMonthStartAndEnd(-1)[1]
      } else {
        this.beginTime = this.getToday()[0]
        this.endTime = this.getToday()[1]
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.list {
  padding: 0 4.266667vw;
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
    margin: 5.333333vw 0;
  }
  &-nav {
    width: 100%;
    border: 0.266667vw solid #7753e0;
    border-radius: 4vw;
    div {
      font-size: 3.733333vw;
      color: #666666;
      border-right: 0.266667vw solid #7753e0;
      height: 8.533333vw;
      &:first-child {
        border-radius: 3.5vw 0 0 3.5vw;
      }
      &:last-child {
        border-radius: 0 3.5vw 3.5vw 0;
        border: 0;
      }
    }
    .active {
      background: #7753e0;
      color: #fff;
    }
  }
  &-list {
    margin-bottom: 4.266667vw;
    .list-cont {
      width: 29.333333vw;
      height: 25.6vw;
      background: #171633;
      border-radius: 1.333333vw;
      margin: 0 1.6vw 2.666667vw 0;
      font-size: 3.2vw;
      color: #9d9d9d;
      img {
        width: 5.333333vw;
        height: 5.333333vw;
      }
      .amount {
        font-size: 3.733333vw;
        line-height: 3.733333vw;
        color: #ffffff;
        padding: 2.666667vw 0 1.6vw;
      }
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}

// 泰文样式
.th,
.en {
  .list {
    &-nav {
      border-radius: 5.333333vw;
      div {
        font-size: 3.2vw;
        height: 10.666667vw;
        &:first-child {
          border-radius: 4.8vw 0 0 4.8vw;
        }
        &:last-child {
          border-radius: 0 4.8vw 4.8vw 0;
        }
      }
    }
  }
}

// 英文
.en {
}
</style>