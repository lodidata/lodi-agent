<template>
  <div class="wallet">
    <div class="wallet-head flex-between">
      <span>{{ $t('mask.shareTxt') }}</span>
      <img src="@/assets/image/close.png" class="close" alt="" @click="close" />
    </div>

    <div class="wallet-ipt">
      <el-input
        :placeholder="$t('mask.withdrawIpt')"
        v-model="amount"
        clearable
        v-input-point2
      ></el-input>
    </div>

    <div class="flex-center wallet-btn" @click="confirm">{{ $t('mask.shareBtn') }}</div>
  </div>
</template>

<script>
import { transferAmount } from '@/api/user'
export default {
  name: 'MaskWallet',
  props: {},
  data() {
    return {
      amount: ''
    }
  },
  created() {},
  methods: {
    close() {
      this.amount = ''
      this.$emit('close')
      this.$store.commit('user/UPDATE_WALLET_SHOW', false)
    },

    async confirm() {
      if (['', null, 0, undefined].includes(this.amount)) {
        this.$message.error(this.$t('mask.withdrawIpt'))
        return
      }
      let params = {
        money: this.amount * 100
      }
      const res = await transferAmount(params)
      if (res.state === 0) {
        this.amount = ''
        this.$message.success(res.message)
        this.$store.dispatch('user/getUserProfile') // 刷新钱包数据
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.wallet {
  .close {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  &-head {
    padding: 14px 20px 8px;
    height: 50px;
    font-size: 18px;
    color: #7753e0;
    border-bottom: 1px solid rgba(205, 206, 213, 1);
    span {
      position: relative;
      &::after {
        content: '';
        left: -4px;
        width: 100px;
        height: 3px;
        bottom: -12px;
        position: absolute;
        background-image: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
      }
    }
  }
  &-ipt {
    width: 450px;
    height: 52px;
    margin: 216px auto 50px;
    ::v-deep .el-input--small .el-input__inner {
      height: 52px;
      line-height: 52px;
      text-align: center;
    }
  }
  &-btn {
    cursor: pointer;
    width: 343px;
    height: 44px;
    background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
    border-radius: 5px;
    margin: 0 auto;
    color: #fff;
  }
}
</style>