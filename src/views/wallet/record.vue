<template>
  <div class="record">
    <van-nav-bar :title="$t('mask.navTxt2')" left-arrow @click-left="$router.go(-1)" fixed>
      <template #right>
        <img src="@/assets/image/mobile/search.png" alt="" @click="maskShow = !maskShow" />
      </template>
    </van-nav-bar>

    <div class="record-search flex-between">
      <span>{{ $t('mask.tableTxt3') }}</span>
      <span v-show="start_time && end_time">{{ start_time + ' ~ ' + end_time }}</span>
    </div>

    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit0">
      <!-- 这些默认就可以了-->
      <div v-for="item in dataList" :key="'name' + item.id" class="cont">
        <div class="time">{{ item.created }}</div>
        <div class="tit">GCash H5</div>
        <div class="amount flex-between">
          <span>{{ $t('mask.tableTxt2') }}</span>
          <span>{{ item.money / 100 }}</span>
        </div>
        <div class="order flex-between">
          <div class="flex">{{ $t('mask.tableTxt1') }}：{{ item.trade_no }}</div>
          <img src="@/assets/image/mobile/copy.png" alt="" @click="copy(`${item.trade_no}`)" />
        </div>
      </div>
    </mescroll-vue>
    <!--上拉下拉刷新组件功能 -->

    <div class="record-null flex-col-center" v-if="!dataList.length">
      <img src="@/assets/image/mobile/null.png" alt="" @click="copy(`${item.trade_no}`)" />
      {{ $t('public.nullTxt') }}
    </div>

    <SearchMask v-show="maskShow" @search="maskSearch"></SearchMask>
  </div>
</template>

<script>
import { getWithdrawList } from '@/api/user'
import SearchMask from './components/SearchMask'
import MescrollVue from 'mescroll.js/mescroll.vue' //引入mescroll的vue组件上拉刷新用

export default {
  name: 'WalletRecord',
  components: {
    MescrollVue,
    SearchMask
  },
  props: {},
  data() {
    return {
      mescroll: null,
      mescrollDown: {},
      start_time: '',
      end_time: '',

      mescrollUp: {
        auto: false,
        callback: this.upCallback,
        page: {
          num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 //每页数据条数,默认10
        }
      },
      dataList: [], // 列表数据

      maskShow: true
    }
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    mescrollInit0(mescroll) {
      this.mescroll = mescroll
    },

    maskSearch(e) {
      this.start_time = e.begin
      this.end_time = e.end
      this.maskShow = false
      //   console.log(this.mescroll.auto)
      this.mescrollUp.page.num = 0
      this.mescroll.triggerUpScroll()
    },

    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    async upCallback(page, mescroll) {
      try {
        let param = {
          start_time: this.start_time || '',
          end_time: this.end_time || '',
          page: page.num,
          page_size: page.size,
          type: 2
        }
        const res = await getWithdrawList(param)
        // 添加新数据到列表顶部
        let arr = res.data || []
        // 如果是第一页需手动置空列表
        if (+res.attributes.number === 1) this.dataList = []
        if (page.num === 1) this.dataList = []
        // 把请求到的数据添加到列表
        this.dataList = this.dataList.concat(arr)
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length)
        })
      } catch (error) {
        mescroll.endErr()
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.record {
  padding-top: 16.533333vw;
  height: 100%;
  background: #edeef3;
  &-search {
    height: 8vw;
    background: #fff;
    padding: 0 6.933333vw;
    span {
      font-size: 3.2vw;
      color: #72788b;
      &:last-child {
        color: #30333a;
      }
    }
  }
  .right-btn {
    position: absolute;
    right: 4.266667vw;
    top: 6.4vw;
    img {
      width: 4.266667vw;
      height: 4.266667vw;
    }
  }
  .cont {
    font-size: 3.2vw;
    color: #72788b;
    background: #fff;
    width: 91.466667vw;
    margin: 0 auto 4.266667vw;
    border-radius: 1.6vw;
    .time {
      padding: 3.2vw 2.666667vw 1.6vw;
    }
    .tit {
      font-size: 4.266667vw;
      line-height: 4.266667vw;
      color: #30333a;
      padding: 0 2.666667vw;
    }
    .amount {
      padding: 2.133333vw 2.666667vw 4.266667vw;
    }
    .order {
      height: 9.066667vw;
      background: #e0e2e9;
      padding: 0 5.333333vw 0 2.666667vw;
      border-radius: 0 0 1.6vw 1.6vw;
      img {
        width: 3.733333vw;
        height: 4.8vw;
      }
    }
  }
  .mescroll {
    position: fixed;
    top: 28.8vw;
    bottom: 0;
    height: auto;
  }
  &-null {
    height: 100%;
    background: #edeef3;
    font-size: 3.733333vw;
    color: #72788b;
    img {
      width: 34.666667vw;
      height: 34.666667vw;
      margin-bottom: 3.733333vw;
    }
  }
}
</style>