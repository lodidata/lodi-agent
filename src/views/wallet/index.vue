<template>
  <div class="wallet">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$t('mask.navTxt1')"
      :right-text="$t('mask.navTxt2')"
      left-arrow
      fixed
      @click-left="$router.push({ path: '/walletShare' })"
      @click-right="$router.push({ path: '/walletRecord' })"
    ></van-nav-bar>

    <!-- 头部 -->
    <WalletHead></WalletHead>

    <!-- 金额输入 -->
    <div class="wallet-amount">
      <div class="ipt flex-between">
        <span>{{ $t('mask.withdrawTxt') }}</span>
        <div class="ipt-input">
          <el-input
            :placeholder="$t('mask.withdrawIpt')"
            v-model="amount"
            v-input-point2
          ></el-input>
        </div>
      </div>

      <div class="tips"></div>
      <div class="limit flex-between">
        <span>{{ $t('mask.withdrawLimit') }}</span>
        <span>
          {{ min + '-' + max / 100 }}
        </span>
      </div>
      <div class="amount flex-between">
        <span>{{ $t('mask.withdrawTxt') }}</span>
        <span>{{ amount }}</span>
      </div>
    </div>

    <!-- 银行卡列表 -->
    <div class="wallet-bank" v-if="bankList.length">
      <div
        class="txt flex-between"
        @click="bankShow = !bankShow"
        v-click-outside="() => (bankShow = false)"
      >
        <span>please select bank card</span>
        <img src="@/assets/image/arrow-down.png" alt="" :class="{ on: bankShow }" />
      </div>

      <div class="back-cont">
        <div class="txt-list" v-show="bankShow">
          <div
            class="txt-list-cont flex-col-between"
            v-for="item in bankList"
            :key="item.account"
            :class="{ active: info.account === item.account }"
            @click="bankSelect(item)"
          >
            <div class="flex-between">
              <span>{{ $t('mask.bankTxt1') }}：</span>
              <span>{{ item.bank_name }}</span>
            </div>
            <div class="flex-between">
              <span>{{ $t('mask.bankTxt2') }}：</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="flex-between">
              <span>{{ $t('mask.bankTxt3') }}：</span>
              <span>{{ item.account }}</span>
            </div>
          </div>
        </div>

        <!-- checkList 数据列表 -->
        <div class="check-bank" v-show="!bankShow">
          <div v-for="item in checkList" :key="'check-bank' + item.account">
            <div class="flex">
              <span>{{ $t('mask.bankTxt1') }}：</span>
              <span>{{ item.bank_name }}</span>
            </div>
            <div class="flex">
              <span>{{ $t('mask.bankTxt2') }}：</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="flex">
              <span>{{ $t('mask.bankTxt3') }}：</span>
              <span>{{ item.account }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 无银行卡 -->
    <div v-else class="no_card flex-col-center" @click="$router.push({ path: '/addCard' })">
      <img src="@/assets/image/add_card.png" alt="" />
      <div class="add_card">{{ $t('mask.addCardTit') }}</div>
      <div class="tips">{{ $t('mask.addCardTxt') }}</div>
    </div>

    <div class="btn flex-center" @click="submitWithdraw">{{ $t('button.btn7') }}</div>
  </div>
</template>

<script>
import _ from 'lodash'
import WalletHead from './components/WalletHead'
import { getBindList, withdraw, getWalletInfo } from '@/api/user'

export default {
  name: 'wallet',
  components: {
    WalletHead
  },
  props: {},
  data() {
    return {
      amount: '',
      amountError: true,

      bankList: [],
      bankShow: false,
      info: {},
      bankId: '',

      balanceInfo: {}
    }
  },
  computed: {
    checkList() {
      let arr = [],
        info = this.info
      arr.unshift(info)
      return arr
    },

    min() {
      return this.balanceInfo?.withdraw_money?.min / 100 || 0
    },

    max() {
      return this.balanceInfo?.withdraw_money?.max / 100 || 0
    }
  },
  created() {
    this.getBindData()
    this.getAmount()
  },
  mounted() {},
  destroyed() {},
  methods: {
    bankSelect(e) {
      this.info = e
      this.bankShow = false
    },

    // 获取金额
    async getAmount() {
      const res = await getWalletInfo()
      this.balanceInfo = res.data || {}
    },

    async getBindData() {
      const data = await getBindList(),
        res = data.data
      this.bankList = res.list || []
      if (res.list.length) {
        this.bankId = res.list[0].id
        this.info = res.list[0]
      }
    },

    // 确认提现
    submitWithdraw: _.debounce(async function () {
      // 走提现路线
      let amount = +this.amount,
        min = +this.min,
        max = +this.balanceInfo.balance / 100

      if (Object.keys(this.info).length === 0) {
        this.$message.error(this.$t('error.txt9'))
        return
      }
      if (amount > max) {
        this.$message.error(this.$t('error.txt4'))
        return
      }
      if (amount < min) {
        this.$message.error(this.$t('error.txt5') + min)
        return
      }
      this.$store.commit('user/UPDATE_CURRENT_TIME', `${new Date().getTime()}`.substr(0, 10))
      let params = {
        withdraw_money: amount * 100,
        // withdraw_money: 1000,
        withdraw_card: this.info.id
      }
      const res = await withdraw(params) // 提现
      this.$store.commit('user/UPDATE_CURRENT_TIME', '')
      if (+res.state === 166) {
        this.$message.success(res.message)
        this.amount = ''
        this.$store.dispatch('user/getUserProfile')
        return
      }
    }, 500)
  }
}
</script>

<style scoped lang='scss'>
.wallet {
  padding: 16.533333vw 0;
  height: 100%;
  background: #edeef3;
  overflow-y: auto;
  .right-btn {
    position: absolute;
    right: 4.266667vw;
    top: 5.6vw;
    font-size: 3.733333vw;
    color: #30333a;
  }
  &-amount {
    background: #ffffff;
    border-radius: 1.6vw;
    width: 91.466667vw;
    margin: 0.8vw auto 4vw;
    padding: 2.666667vw 4.266667vw 7.466667vw;
    font-size: 3.2vw;
    color: #72788b;
    .ipt {
      .el-input {
        width: 40vw;
        height: 11.733333vw;
        border: 0.266667vw solid #e8e9f0;
        border-radius: 1.333333vw;
        font-size: 3.733333vw;
        padding: 0 1.333333vw;
      }
      ::v-deep .el-input--small .el-input__inner {
        height: 11.2vw;
        line-height: 11.2vw;
        border: 0;
        padding: 0;
      }
      .bRed {
        border-color: #e94951;
      }
    }
    .tips {
      height: 7.466667vw;
    }
    .amount {
      height: 8vw;
      span:last-child {
        font-size: 6.4vw;
        color: #7f4fe8;
      }
    }
    .limit {
      padding-bottom: 8vw;
      span:last-child {
        color: #30333a;
      }
    }
  }
  &-bank {
    background: #ffffff;
    border-radius: 1.6vw;
    width: 91.466667vw;
    margin: 0 auto;
    font-size: 3.2vw;
    position: relative;
    .txt {
      font-size: 3.733333vw;
      color: #30333a;
      height: 11.733333vw;
      line-height: 11.733333vw;
      padding: 0 2.666667vw;
      border-bottom: 0.266667vw solid #e8e9f0;
      img {
        width: 2.133333vw;
        height: 1.6vw;
      }

      .on {
        transform: rotateX(180deg);
      }
    }
    .txt-list {
      background: #fff;
      &-cont {
        font-size: 3.2vw;
        color: #72788b;
        height: 26.666667vw;
        padding: 3.2vw 5.333333vw;
        border: 0.266667vw solid #e8e9f0;
        border-radius: 1.333333vw;
        margin-bottom: 4vw;
        background: #fff;
        &:last-child {
          margin-bottom: 0;
        }
        div {
          span:last-child {
            color: #30333a;
          }
        }
      }
      .active {
        border-color: #7f4fe8;
      }
    }
    .back-cont {
      padding: 4.266667vw 2.666667vw 5.333333vw;
      max-height: 52vw;
      overflow-y: auto;
      .check-bank {
        padding: 2.666667vw 4vw;
        border-radius: 0.533333vw;
        background: #edeef3;
        div {
          &:nth-child(2) {
            padding: 1.6vw 0;
          }
          span {
            &:first-child {
              width: 27.733333vw;
            }
            &:last-child {
              color: #30333a;
            }
          }
        }
      }
    }
  }
  .no_card {
    width: 91.466667vw;
    margin: 0 auto;
    height: 34.666667vw;
    border: 0.533333vw dashed rgba(187, 192, 208, 1);
    border-radius: 1.333333vw;
    img {
      height: 5.333333vw;
      width: 5.333333vw;
    }
    .add_card {
      margin-top: 5.333333vw;
      font-size: 3.733333vw;
      color: #30333a;
    }
    .tips {
      margin-top: 2.666667vw;
      font-size: 3.2vw;
      color: #72788b;
    }
  }
  .btn {
    width: 91.466667vw;
    height: 11.733333vw;
    background: #ffffff;
    background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
    border-radius: 1.6vw;
    margin: 6.933333vw auto 0;
    color: #fff;
    font-size: 4.266667vw;
  }
}
</style>