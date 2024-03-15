<template>
  <div class="mask flex-center">
    <div class="mask-cont flex-col-center">
      <div class="close justify-end">
        <i class="el-icon-close" @click="$emit('close')"></i>
      </div>
      <p>{{ $t('mask.shareTxt') }}</p>
      <el-input :placeholder="$t('mask.withdrawIpt')" v-model="amount" v-input-point2></el-input>
      <div class="btn flex-center" @click="confirm">{{ $t('mask.shareBtn') }}</div>
    </div>
  </div>
</template>

<script>
import { transferAmount } from '@/api/user'
export default {
  name: '',
  props: {},
  data() {
    return {
      amount: ''
    }
  },
  methods: {
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
        this.$emit('close')
        this.$store.dispatch('user/getUserProfile') // 刷新钱包数据
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
  &-cont {
    background: #ffffff;
    border-radius: 2.666667vw;
    width: 90.666667vw;
    padding: 5.333333vw 4.266667vw 8vw;
    box-sizing: border-box;
    .close {
      font-size: 5.333333vw;
      width: 100%;
    }
    p {
      font-size: 3.733333vw;
      color: #30333a;
      padding-top: 5.333333vw;
    }
    .el-input {
      font-size: 4.266667vw;
      color: #bbc0d0;
      margin: 6.666667vw 0 16vw;
    }
    ::v-deep .el-input--small .el-input__inner {
      height: 13.866667vw;
      line-height: 13.866667vw;
    }
    .btn {
      width: 58.666667vw;
      height: 11.733333vw;
      background-image: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
      border-radius: 1.333333vw;
      font-size: 4.266667vw;
      color: #ffffff;
    }
  }
}
</style>