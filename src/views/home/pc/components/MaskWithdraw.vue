<template>
  <div class="withdraw">
    <div class="withdraw-head">
      <div>
        <div class="title align-center">
          <img src="@/assets/image/amount.png" alt="" />
          <span>{{ $t('mask.withdrawTit') }}</span>
        </div>
        <!-- <div class="text">
          <p>{{ $t('mask.codeTxt1') }}：{{ requireBet }}</p>
          <p>{{ $t('mask.codeTxt2') }}：{{ totalBet }}</p>
        </div> -->
      </div>
      <div class="amount-txt">{{ amountValue }}</div>
    </div>
    <!-- 按钮选择 -->
    <div v-if="!submitShow" class="wallet-btn">
      <div class="flex-center" @click="$emit('in')">{{ $t('mask.shareTxt') }}</div>
      <div class="flex-center" @click="goWithdraw">{{ $t('mask.shareTxt2') }}</div>
    </div>

    <div v-if="submitShow">
      <div class="withdraw-ipt">
        <div class="ipt-val flex-between">
          <span>{{ $t('mask.withdrawTxt') }}</span>
          <div class="align-center flex-1">
            <span class="amount-logo">¥</span>
            <el-input
              :placeholder="$t('mask.withdrawIpt')"
              v-model="amount"
              clearable
              v-input-point2
              max-length="10"
            ></el-input>
          </div>
        </div>
        <div class="flex-between">
          <span>{{ $t('mask.withdrawLimit') }}</span>
          <span>{{ minAmount }}-{{ maxAmount }}</span>
        </div>
        <div class="ipt-tips flex-between">
          <span>{{ $t('mask.withdrawAmount') }}</span>
          <span>{{ amount }}</span>
        </div>
      </div>

      <div class="withdraw-card" v-if="bankList.length">
        <div
          class="card-head flex-between"
          @click="bankShow = !bankShow"
          v-click-outside="() => (bankShow = false)"
        >
          <span>please select bank card</span>
          <img src="@/assets/image/arrow-down.png" alt="" :class="{ on: bankShow }" />
        </div>

        <div class="card-list" v-show="bankShow">
          <div
            class="card-cont flex-col justify-between"
            v-for="(item, i) in bankList"
            :key="'cont' + i"
            :class="{ cardActive: item.id === bankId }"
            @click="checkBank(item)"
          >
            <div class="align-center">
              <span>{{ $t('mask.bankTxt1') }}</span>
              <span class="text-right">{{ item.bank_name }}</span>
            </div>
            <div class="align-center">
              <span>{{ $t('mask.bankTxt2') }}</span>
              <span class="text-right">{{ item.name }}</span>
            </div>
            <div class="align-center">
              <span>{{ $t('mask.bankTxt3') }}</span>
              <span class="text-right">{{ item.account }}</span>
            </div>
          </div>
        </div>

        <div class="cont-height" v-show="!bankShow">
          <div
            class="card-cont flex-col justify-between"
            v-for="(item, i) in checkList"
            :key="'card' + i"
          >
            <div class="align-center">
              <span>{{ $t('mask.bankTxt1') }}</span>
              <span>{{ item.bank_name }}</span>
            </div>
            <div class="align-center">
              <span>{{ $t('mask.bankTxt2') }}</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="align-center">
              <span>{{ $t('mask.bankTxt3') }}</span>
              <span>{{ item.account }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="no-card flex-center flex-col" v-else @click="$emit('add')">
        <img src="@/assets/image/add_card.png" alt="" />
        <p class="add-txt">{{ $t('mask.addCardTit') }}</p>
        <p>{{ $t('mask.addCardTxt') }}</p>
      </div>

      <div
        class="withdraw-btn flex-center"
        :class="{ activeBtn: amount.length }"
        @click="submitWithdraw"
      >
        {{ $t('button.btn7') }}
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { getBindList, withdraw } from '@/api/user'
export default {
  name: 'MaskWithdraw',
  props: {},
  inject: ['parent'],
  data() {
    return {
      info: {}, // 当前选择银行卡信息
      amount: '', // 取款金额
      bankList: [], // 绑定银行卡列表
      bankId: '',

      bankShow: false
    }
  },
  computed: {
    submitShow() {
      return this.$store.state.user.walletShow
    },

    checkList() {
      let arr = [],
        info = this.info
      arr.unshift(info)
      return arr
    },

    amountInfo() {
      return this.parent.balanceInfo || {}
    },

    amountValue() {
      return this.$store.state.user.profileInfo.share_wallet / 100 || 0
    },

    minAmount() {
      return this.amountInfo.withdraw_money ? this.amountInfo.withdraw_money.min / 100 : 0
    },

    maxAmount() {
      return this.amountInfo.withdraw_money ? this.amountInfo.withdraw_money.max / 100 : 0
    },

    //  应有打码量
    requireBet() {
      return this.amountInfo.require_bet / 100 || '0.0'
    },

    // 实际打码量
    totalBet() {
      return this.amountInfo.total_bet / 100 || '0.0'
    }
  },
  created() {
    if (this.submitShow) {
      this.getBindData()
    }
  },
  methods: {
    goWithdraw() {
      this.$store.commit('user/UPDATE_WALLET_SHOW', true)
      this.getBindData()
    },

    clear() {
      this.amount = ''
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

    checkBank(e) {
      this.info = e
      this.bankShow = false
      this.bankId = e.id
    },

    // 确认提现
    submitWithdraw: _.debounce(async function () {
      // 走提现路线
      let amount = +this.amount,
        min = +this.minAmount,
        max = +this.amountInfo.balance / 100
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
        this.parent.getAmount()
        return
      }
    }, 500)
  }
}
</script>

<style scoped lang='scss'>
.withdraw {
  padding-bottom: 42px;
  &-head {
    background: url('@/assets/image/mask-head-bg.png') center no-repeat;
    background-size: cover;
    width: 544px;
    height: 84px;
    margin: 0 auto;
    color: #fff;
    position: relative;
    .title {
      font-size: 14px;
      padding: 24px 0 0 30px;
      img {
        width: 15px;
        margin-right: 8px;
      }
    }
    // .text {
    //   font-size: 12px;
    //   color: #e1e3eb;
    //   padding: 8px 0 0 30px;
    //   p {
    //     width: 200px;
    //     word-break: break-all;
    //   }
    // }
    .amount-txt {
      font-size: 26px;
      position: absolute;
      top: 32px;
      width: 100%;
      padding: 0 20px 0 244px;
      text-align: left;
      word-break: break-all;
    }
  }

  .wallet-btn {
    width: 524px;
    margin: 70px auto 0;
    .flex-center {
      height: 44px;
      background-image: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
      border-radius: 6px;
      font-size: 16px;
      color: #ffffff;
      cursor: pointer;
      &:last-child {
        background: #28273e;
        margin-top: 20px;
      }
    }
  }
  &-ipt {
    width: 524px;
    background: #ffffff;
    padding: 20px 20px 28px;
    margin: 4px auto 16px;
    font-size: 12px;
    color: #72788b;
    .ipt-val {
      margin-bottom: 20px;
      .align-center {
        padding-left: 30px;
        border-bottom: 1px solid #a4a4a4;
        ::v-deep .el-input__inner {
          border: 0;
        }
        .amount-logo {
          font-size: 24px;
          color: #383b46;
        }
      }
    }
    .ipt-tips {
      height: 33px;
      margin-top: 30px;
      span:last-child {
        font-size: 24px;
        color: #7f4fe8;
      }
    }
  }
  &-card {
    width: 524px;
    background: #ffffff;
    border-radius: 5px;
    margin: 0 auto;
    .card-head {
      font-size: 14px;
      color: #30333a;
      height: 44px;
      border-bottom: 1px solid #e8e9f0;
      padding: 0 20px;
      width: 492px;
      margin: 0 auto;
      cursor: pointer;
      img {
        width: 8px;
        transition: all 0.3s;
      }
    }
    .cont-height {
      padding: 16px 0 20px;
    }

    .card-cont {
      width: 492px;
      height: 68px;
      background: #edeef3;
      border-radius: 2px;
      margin: 0 auto;
      padding: 8px 12px;
      font-size: 12px;
      color: #72788b;
      div {
        span {
          &:first-child {
            width: 110px;
          }
          &:last-child {
            flex: 1;
            color: #30333a;
          }
        }
      }
    }

    .card-list {
      max-height: 224px;
      overflow-y: scroll;
      padding: 16px 0 20px;
      /* 修改滚动条样式 */
      &::-webkit-scrollbar {
        width: 3px;
        /*设置滚动条的宽度*/
      }
      /* 滚动区域的样式 */
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        /*设置滚动条的圆角*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        /*设置内阴影*/
        background: #edeef3;
        /*设置滚动条的颜色*/
      }
      /* 滚动条的背景样式 */
      &::-webkit-scrollbar-track {
        /* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
        border-radius: 0;
      }
      .card-cont {
        margin-bottom: 20px;
        cursor: pointer;
        border: 1px solid #e8e9f0;
        background: #fff;
        &:last-child {
          margin-bottom: 0;
        }
      }
      .cardActive {
        border-color: #7f4fe8;
      }
    }
  }

  .no-card {
    width: 524px;
    margin: 0 auto;
    height: 130px;
    border: 2px dashed #bbc0d0;
    border-radius: 5px;
    font-size: 12px;
    color: #72788b;
    cursor: pointer;
    .add-txt {
      color: #30333a;
      margin: 20px 0 10px;
    }
    img {
      width: 40px;
    }
  }

  &-btn {
    width: 524px;
    height: 44px;
    background: #ffffff;
    background: linear-gradient(270deg, rgba(176, 48, 171, 0.6) 0%, rgba(87, 103, 253, 0.6) 100%);
    border-radius: 6px;
    margin: 16px auto 0;
    color: #fff;
    cursor: pointer;
  }
  .activeBtn {
    background: linear-gradient(270deg, rgb(176, 48, 171) 0%, rgb(87, 103, 253) 100%);
  }
}
</style>