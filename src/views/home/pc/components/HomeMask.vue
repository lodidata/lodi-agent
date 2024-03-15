<template>
  <div class="mask flex-center">
    <div class="mask-cont">
      <!-- 提现 -->
      <div class="withdraw" v-if="+pageIdx === 1">
        <div class="withdraw-head flex-between">
          <div class="head-nav align-center">
            <span
              v-for="item in headList"
              class="flex-center"
              :key="item.id"
              :class="{ active: item.id === headId }"
              @click="headId = item.id"
            >
              {{ $t(item.txt) }}
            </span>
          </div>
          <img src="@/assets/image/close.png" class="close" alt="" @click="close" />
        </div>

        <!-- 提现 -->
        <MaskWithdraw
          v-if="headId === 'headList1'"
          @add="pageIdx = 3"
          @in="pageIdx = 4"
        ></MaskWithdraw>

        <!-- 提款记录 -->
        <div class="withdraw-record" v-else>
          <div class="record-head align-center">
            <el-date-picker
              v-model="times"
              type="daterange"
              range-separator="-"
              :start-placeholder="$t('public.timeStart')"
              :end-placeholder="$t('public.timeEnd')"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <div class="btn flex-center" @click="getData">{{ $t('button.btn1') }}</div>
          </div>
          <div class="record-table">
            <el-table
              :data="recordData"
              border
              :cell-style="cellStyles"
              :header-cell-style="{
                fontWeight: '500',
                textAlign: 'center'
              }"
              style="width: 100%; font-size: 16px"
            >
              <el-table-column
                prop="trade_no"
                align="center"
                :label="$t('mask.tableTxt1')"
              ></el-table-column>
              <el-table-column
                prop="money"
                align="center"
                :label="$t('mask.tableTxt2')"
                width="140px"
              ></el-table-column>
              <el-table-column
                prop="created"
                align="center"
                :label="$t('mask.tableTxt3')"
                width="180px"
              ></el-table-column>
              <template slot="empty">
                <div class="table_empty">{{ $t('public.nullTxt') }}</div>
              </template>
            </el-table>

            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-sizes="[10, 20, 30, 40, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!-- 绑定银行卡 -->
      <div class="bank" v-if="pageIdx === 3">
        <div class="bank-head flex-between">
          {{ $t('mask.cardTit') }}
          <img src="@/assets/image/close.png" class="close" alt="" @click="close" />
        </div>
        <div class="bank-ipt">
          <p class="align-center ipt-tit">
            <span>*</span>
            <span>{{ $t('mask.cardTxt1') }}</span>
          </p>
          <el-input :placeholder="$t('mask.cardIpt1')" v-model="cardName" clearable></el-input>
        </div>

        <div class="bank-ipt">
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

        <div class="bank-ipt">
          <p class="align-center ipt-tit">
            <span>*</span>
            <span>{{ $t('mask.cardTxt3') }}</span>
          </p>
          <el-input :placeholder="$t('mask.cardIpt3')" v-model="bankAccount" clearable></el-input>
        </div>

        <div class="bank-ipt">
          <p class="align-center ipt-tit">
            <span></span>
            <span>{{ $t('mask.cardTxt4') }}</span>
          </p>
          <el-input :placeholder="$t('mask.cardIpt4')" v-model="bankBranch" clearable></el-input>
        </div>

        <div class="flex-center bank-btn" @click="bindCard">{{ $t('button.btn6') }}</div>
      </div>

      <!-- 主钱包转账 -->
      <MaskWallet v-if="pageIdx === 4" @close="close"></MaskWallet>
    </div>
  </div>
</template>

<script>
import { addBank, getBankList, getWithdrawList } from '@/api/user'
import MaskWithdraw from './MaskWithdraw'
import MaskWallet from './MaskWallet'
export default {
  name: 'HomeMask',
  props: {},
  components: {
    MaskWithdraw,
    MaskWallet
  },
  data() {
    return {
      pageIdx: 1,

      // 取款记录
      times: [],
      recordData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,

      headList: [
        {
          id: 'headList1',
          txt: 'mask.navTxt1'
        },
        {
          id: 'headList2',
          txt: 'mask.navTxt2'
        }
      ],
      headId: 'headList1',

      //   添加银行卡
      cardName: '', // 户名
      bankName: '', // 银行
      bankAccount: '', // 账号
      bankBranch: '', // 支行
      bankList: [] // 银行列表
    }
  },
  created() {
    this.getBank()
    this.times = this.getToday()
  },
  methods: {
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
    },

    close() {
      this.headId = 'headList1'
      this.cardName = '' // 户名
      this.bankName = '' // 银行
      this.bankAccount = '' // 账号
      this.bankBranch = '' // 支行
      this.pageIdx = 1
      this.$emit('close')
      this.$store.commit('user/UPDATE_WALLET_SHOW', false)
      if (this.$refs.withdrawRef) {
        this.$refs.withdrawRef.clear()
      }
    },

    cellStyles() {
      return 'text-align: center;'
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },

    handleCurrentChange(val) {
      this.pageNo = val
      this.getData()
    },

    async getData() {
      let start_time = '',
        end_time = ''
      if (this.times.length) {
        start_time = this.times[0]
        end_time = this.times[1]
      }
      let params = {
        start_time,
        end_time,
        page: this.pageNo,
        page_size: this.pageSize,
        type: 2
      }
      const res = await getWithdrawList(params)
      this.total = res.attributes.total
      if (res.data) {
        this.recordData = res.data.map(i => {
          i.money = i.money / 100
          return i
        })
      } else {
        this.recordData = ''
      }
    },

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
        this.pageIdx = 2
        this.$message.success(res.message)
      }
    }
  },
  watch: {
    times(val) {
      if (!val) this.times = []
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
    width: 564px;
    background: #edeef3;
    border-radius: 10px;
    min-height: 605px;
    .close {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .confirm {
      padding-bottom: 30px;
      &-img {
        padding: 16px 20px 0 0;
      }
      &-txt {
        padding: 64px 20px 86px;
        font-size: 22px;
        color: #30333a;
      }
      &-btn {
        p {
          width: 150px;
          height: 44px;
          background: #28273e;
          border-radius: 5px;
          font-size: 16px;
          color: #fff;
          cursor: pointer;
          &:last-child {
            background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
            margin-left: 10px;
          }
        }
      }
    }
    .withdraw {
      &-head {
        padding: 14px 20px 8px;
        height: 48px;
        margin-bottom: 20px;
        border-bottom: 1px solid #cdced5;
        span {
          height: 48px;
          width: 100px;
          cursor: pointer;
          font-size: 18px;
          color: #30333a;
        }
        .active {
          position: relative;
          color: #7f4fe8;
          margin-top: -1px;
          &::after {
            content: '';
            background: url('@/assets/image/border-bg.png') center no-repeat;
            background-size: cover;
            width: 100px;
            height: 3px;
            position: absolute;
            bottom: 1px;
            left: 0;
          }
        }
      }
      .record-head {
        padding: 0 20px;
        .btn {
          background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
          border-radius: 5px;
          color: #fff;
          width: 60px;
          height: 30px;
          margin-left: 20px;
          cursor: pointer;
        }
        .el-date-editor {
          border-radius: 15px;
        }
        ::v-deep .el-date-editor .el-range-separator {
          padding: 0;
        }
      }
      .record-table {
        padding: 20px;
        .el-pagination {
          text-align: right;
          margin-top: 20px;
        }
      }
    }
    .bank {
      padding-bottom: 20px;
      &-head {
        padding: 14px 20px 8px;
        font-size: 18px;
        color: #30333a;
        border-bottom: 1px solid rgba(205, 206, 213, 1);
      }
      &-ipt {
        padding: 14px 20px 0;
        .ipt-tit {
          font-size: 14px;
          color: #72788b;
          margin-bottom: 4px;
          span {
            &:first-child {
              color: #e94951;
              margin: 4px 4px 0 0;
            }
          }
        }
        .el-select {
          width: 100%;
        }
      }
      &-btn {
        cursor: pointer;
        width: 343px;
        height: 44px;
        background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
        border-radius: 5px;
        margin: 20px auto 0;
        color: #fff;
      }
    }
  }
}

/** 泰语修改样式 */
.th {
  .mask {
    &-cont {
      .confirm {
        &-txt {
          padding: 64px 20px 86px;
        }
      }
      .withdraw {
        &-head {
          span {
            width: 160px;
          }
          .active {
            &::after {
              width: 160px;
            }
          }
        }
        .record-head {
          .btn {
            width: 80px;
          }
        }
      }
    }
  }
}
/** 英语修改样式 */
.en {
  .mask {
    &-cont {
      .confirm {
        &-txt {
          padding: 64px 20px 86px;
        }
      }
      .withdraw {
        &-head {
          span {
            width: 160px;
          }
          .active {
            &::after {
              width: 160px;
            }
          }
        }
      }
    }
  }
}
</style>