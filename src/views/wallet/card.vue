<template>
  <div class="card">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$t('mask.cardTit2')"
      left-arrow
      @click-left="$router.go(-1)"
      fixed
    ></van-nav-bar>

    <div class="card-ipt">
      <p class="align-center ipt-tit">
        <span>*</span>
        <span>{{ $t('mask.cardTxt1') }}</span>
      </p>
      <el-input :placeholder="$t('mask.cardIpt1')" v-model="cardName" clearable></el-input>
    </div>

    <div class="card-ipt">
      <p class="align-center ipt-tit">
        <span>*</span>
        <span>{{ $t('mask.cardTxt2') }}</span>
      </p>
      <el-select v-model="bankName" :placeholder="$t('mask.cardIpt2')">
        <el-option
          v-for="item in bankList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>

    <div class="card-ipt">
      <p class="align-center ipt-tit">
        <span>*</span>
        <span>{{ $t('mask.cardTxt3') }}</span>
      </p>
      <el-input :placeholder="$t('mask.cardIpt3')" v-model="bankAccount" clearable></el-input>
    </div>

    <div class="card-ipt">
      <p class="align-center ipt-tit">
        <span></span>
        <span>{{ $t('mask.cardTxt4') }}</span>
      </p>
      <el-input :placeholder="$t('mask.cardIpt4')" v-model="bankBranch" clearable></el-input>
    </div>

    <div class="flex-center card-btn" @click="bindCard">{{ $t('button.btn6') }}</div>
  </div>
</template>

<script>
import { addBank, getBankList } from '@/api/user'
export default {
  name: 'WalletCard',
  props: {},
  data() {
    return {
      cardName: '', // 户名
      bankName: '', // 银行
      bankAccount: '', // 账号
      bankBranch: '', // 支行
      bankList: [] // 银行列表
    }
  },
  computed: {},
  created() {
    this.getBank()
  },
  mounted() {},
  destroyed() {},
  methods: {
    // 获取银行卡列表
    async getBank() {
      const res = await getBankList()
      this.bankList = res.data.list.filter(i => i.name) || []
    },

    // 绑定银行卡
    async bindCard() {
      let bank = this.bankName, // 银行ID
        name = this.cardName, // 户名
        account = this.bankAccount, // 银行账号
        deposit_bank = this.bankBranch, // 开户支行
        params = {
          bank,
          name,
          account,
          deposit_bank
        }
      if (name.length < 5) {
        this.$message.error(this.$t('error.txt1'))
        return
      }
      if (account.length < 5) {
        this.$message.error(this.$t('error.txt2'))
        return
      }
      if (['', null, undefined].includes(bank)) {
        this.$message.error(this.$t('error.txt3'))
        return
      }
      const res = await addBank(params)
      if (res.state === 0) {
        this.$message.success(res.message)
        setTimeout(() => {
          this.$router.push({ path: '/wallet' })
        }, 1500)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.card {
  padding-top: 16.533333vw;
  height: 100%;
  background: #edeef3;
  &-ipt {
    padding: 4.266667vw 4.266667vw 0;
    .ipt-tit {
      font-size: 3.733333vw;
      color: #72788b;
      margin-bottom: 1.6vw;
      span {
        &:first-child {
          color: #e94951;
          margin: 1.066667vw 1.066667vw 0 0;
        }
      }
    }

    .el-input--small .el-input__inner {
      height: 11.2vw;
      line-height: 11.2vw;
    }
    .el-select {
      width: 100%;
    }
  }
  &-btn {
    cursor: pointer;
    width: 91.466667vw;
    height: 11.733333vw;
    background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
    border-radius: 1.333333vw;
    margin: 6.933333vw auto 0;
    color: #fff;
  }
}
</style>