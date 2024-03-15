<template>
  <div class="detail">
    <div class="detail-head flex-between">
      <div class="detail-nav align-center">
        <div
          v-for="item in navList"
          :key="item.val"
          class="flex-center"
          :class="{ active: +item.val === navIdx }"
          @click="navIdx = +item.val"
        >
          {{ $t(item.txt) }}
        </div>
      </div>

      <div class="back-btn align-center" @click="$router.go(-1)">
        <img src="@/assets/image/back.png" alt="" />
        {{ $t('detail.back') }}
      </div>
    </div>

    <div class="detail-container">
      <div class="detail-search align-center">
        <div class="detail-search-ipt flex-center">
          {{ $t('detail.searchTxt') }}：
          <input type="text" :placeholder="$t('detail.searchIpt')" v-model="account" />
        </div>
        <div class="detail-search-ipt flex-center m-l">
          {{ $t('public.timeTxt') }}：
          <el-date-picker
            v-model="times"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('public.timeStart')"
            :end-placeholder="$t('public.timeEnd')"
            v-show="navIdx === 1"
            value-format="yyyy-MM-dd"
          ></el-date-picker>

          <el-date-picker
            v-model="monthVal"
            type="month"
            :placeholder="$t('public.timeMonth')"
            v-show="navIdx === 2"
            value-format="yyyy-MM"
          ></el-date-picker>
        </div>
        <div class="detail-search-btn align-center">
          <div class="flex-center" @click="getData">
            {{ $t('button.btn1') }}
          </div>
          <div class="flex-center" @click="exportData">{{ $t('button.btn3') }}</div>
        </div>
      </div>
      <div class="detail-list">
        <div class="title">{{ $t('detail.title1') }}</div>
        <div class="align-center">
          <div class="cont-nav flex-between" v-for="(item, idx) in itemList" :key="'detail' + idx">
            <img :src="item.imgUrl" alt="" />
            <div class="text-right flex-1">
              <p>{{ $t(item.tit) }}</p>
              <p
                class="amount"
                :class="{
                  f20: item.val.toString().length > 10,
                  f16: item.val.toString().length > 11
                }"
              >
                {{ item.val }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 游戏分类 -->
      <el-table
        :data="gameData"
        border
        :cell-style="cellStyle"
        :header-cell-style="{
          color: '#9D9D9D',
          background: '#171633',
          borderColor: '#0E0D20',
          fontWeight: '500',
          textAlign: 'center'
        }"
        style="width: 100%; border-color: #0e0d20; margin: 30px 0 20px; font-size: 16px"
      >
        <el-table-column
          prop="game_type_name"
          :label="$t('detail.table1Txt1')"
          align="center"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="game_bet_amount"
          align="center"
          class-name=""
          :label="$t('detail.table1Txt2')"
        ></el-table-column>
        <el-table-column
          prop="game_prize_amount"
          align="center"
          :label="$t('detail.table1Txt3')"
        ></el-table-column>
        <el-table-column
          prop="profit"
          align="center"
          :label="$t('detail.table1Txt4')"
        ></el-table-column>
        <template slot="empty">
          <div class="table_empty">{{ $t('public.nullTxt') }}</div>
        </template>
      </el-table>

      <!-- 成本明细 -->
      <div>
        <div class="title">{{ $t('detail.title2') }}</div>
        <el-table
          :data="costData"
          border
          :cell-style="cellStyles"
          :header-cell-style="{
            color: '#9D9D9D',
            background: '#171633',
            borderColor: '#0E0D20',
            fontWeight: '500',
            textAlign: 'center'
          }"
          style="width: 100%; border-color: #0e0d20; margin-bottom: 20px; font-size: 16px"
        >
          <el-table-column
            prop="bet_ratio_amount"
            align="center"
            :label="$t('detail.table2Txt1')"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="deposit_ratio_amount"
            align="center"
            :label="$t('detail.table2Txt2')"
          ></el-table-column>
          <el-table-column
            prop="revenue_ratio_amount"
            align="center"
            :label="$t('detail.table2Txt3')"
          ></el-table-column>
          <el-table-column
            prop="coupon_ratio_amount"
            align="center"
            :label="$t('detail.table2Txt4')"
          ></el-table-column>
          <el-table-column
            prop="manual_ratio_amount"
            align="center"
            :label="$t('detail.table2Txt5')"
          ></el-table-column>
          <template slot="empty">
            <div class="table_empty">{{ $t('public.nullTxt') }}</div>
          </template>
        </el-table>
      </div>

      <!-- 代理详情 -->
      <div>
        <div class="title">{{ $t('detail.title3') }}</div>
        <el-table
          :data="proxyData"
          border
          :cell-style="cellStyles"
          :header-cell-style="{
            color: '#9D9D9D',
            background: '#171633',
            borderColor: '#0E0D20',
            fontWeight: '500',
            textAlign: 'center'
          }"
          style="width: 100%; border-color: #0e0d20; font-size: 12px"
        >
          <el-table-column
            prop="user_name"
            :label="$t('detail.table3Txt1')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="agent_name"
            :label="$t('detail.table3Txt2')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="agent_cnt"
            :label="$t('detail.table3Txt3')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="bet_amount"
            :label="$t('detail.table3Txt4')"
            align="center"
            width="120"
          ></el-table-column>

          <el-table-column :label="$t('detail.table3Txt5')" align="center" v-if="tableIdx === 1">
            <el-table-column
              prop="bet_amount_list.GAME"
              :label="$t('detail.table3SubTxt1')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="bet_amount_list.SABONG"
              :label="$t('detail.table3SubTxt2')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="bet_amount_list.BY"
              :label="$t('detail.table3SubTxt3')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="bet_amount_list.LIVE"
              :label="$t('detail.table3SubTxt4')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="bet_amount_list.QP"
              :label="$t('detail.table3SubTxt5')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="bet_amount_list.SPORT"
              :label="$t('detail.table3SubTxt6')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="bet_amount_list.ESPORTS"
              :label="$t('detail.table3SubTxt7')"
              align="center"
            ></el-table-column>
          </el-table-column>
          <el-table-column :label="$t('detail.table3Txt6')" align="center" v-if="tableIdx === 1">
            <el-table-column
              prop="proportion_list.GAME"
              :label="$t('detail.table3SubTxt1')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="proportion_list.SABONG"
              :label="$t('detail.table3SubTxt2')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="proportion_list.BY"
              :label="$t('detail.table3SubTxt3')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="proportion_list.LIVE"
              :label="$t('detail.table3SubTxt4')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="proportion_list.QP"
              :label="$t('detail.table3SubTxt5')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="proportion_list.SPORT"
              :label="$t('detail.table3SubTxt6')"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="proportion_list.ESPORTS"
              :label="$t('detail.table3SubTxt7')"
              align="center"
            ></el-table-column>
          </el-table-column>

          <el-table-column :label="$t('detail.table3Txt9')" align="center" v-if="tableIdx === 1">
           <el-table-column
              prop="cb_all_games"
              :label="$t('detail.table3SubTxt8')"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="cb_deposit_ratio_amount"
              :label="$t('detail.table3SubTxt9')"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="cb_revenue_ratio_amount"
              :label="$t('detail.table3SubTxt10')"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="cb_coupon_ratio_amount"
              :label="$t('detail.table3SubTxt11')"
              align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="cb_manual_ratio_amount"
              :label="$t('detail.table3SubTxt12')"
              align="center"
              width="120"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            prop="fee_amount"
            :label="$t('detail.table3Txt12')"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="settle_amount"
            :label="$t('detail.table3Txt11')"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="date"
            :label="$t('detail.table3Txt8')"
            align="center"
            width="120"
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
</template>

<script>
import { get } from '@/utils/request'
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
const nav1 = require('@/assets/image/nav1.png')
const nav2 = require('@/assets/image/nav2.png')
const nav3 = require('@/assets/image/nav3.png')
const nav4 = require('@/assets/image/nav4.png')
const nav5 = require('@/assets/image/nav5.png')
export default {
  name: 'PCHomeList',
  components: {},
  props: {},
  data() {
    return {
      navList,
      navIdx: 1,
      times: [], // 日结 日期
      monthVal: '', // 月结日期
      account: '', // 用户账号
      gameData: [], // 游戏table
      proxyData: [], // 代理table
      costData: [], // 成本明细

      tableIdx: 1, // 默认月结数据

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
    this.times = this.getToday(0)
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
      return idx === 0 ? [t, t] : year + '-' + month
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },

    handleCurrentChange(val) {
      this.pageNo = val
      this.getData()
    },

    // 导出表格
    async exportData() {
      let params = this.param()
      params.export = 1
      const res = await get('/user/agent/rpt/shareholder', params, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(
        new Blob([res], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
      )
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', 'excel.xls')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
        params.date_start = this.times.length ? this.times[0] : ''
        params.date_end = this.times.length ? this.times[1] : ''
        this.tableIdx = 1
      } else {
        this.tableIdx = 2
        params.month = this.monthVal // 月报表查询
      }
      return params
    },

    async getData() {
      try {
        let params = this.param()
        const res = await homeTableData(params)
        const { attributes, data } = res || {}
        const { agent_details, game_info, platform_info } = data || {}
        this.total = attributes.total
        this.gameData = game_info || []
        if (agent_details.length) {
          this.proxyData = agent_details.map(i => {
            if (i.proportion_list && i.bet_amount_list) {
              i.proportion_list = JSON.parse(i.proportion_list)
              i.bet_amount_list = JSON.parse(i.bet_amount_list)
            } else {
              i.proportion_list = {}
              i.bet_amount_list = {}
            }
            return i
          })
        } else {
          this.proxyData = []
        }
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
    },

    //设置指定行、列、具体单元格颜色 row, column, rowIndex, columnIndex
    cellStyle({ columnIndex }) {
      if (columnIndex === 0) {
        //指定坐标rowIndex ：行，columnIndex ：列
        return 'background: #1F1E4B;color: #fff;border-color: #0e0d20;' //rgb(105,0,7)
      } else if (columnIndex === 1) {
        return 'background: #16A1B0;color: #fff;border-color: #0e0d20;'
      } else if (columnIndex === 2) {
        return 'background: #E66F31;color: #fff;border-color: #0e0d20;'
      } else if (columnIndex === 3) {
        return 'background: #619030;color: #fff;border-color: #0e0d20;'
      } else {
        return ''
      }
    },
    cellStyles() {
      return 'background: #1F1E4B;color: #fff;border-color: #0e0d20;' //rgb(105,0,7)
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
.detail {
  height: 100%;
  //   background: #fff;
  &-head {
    background: #171633;
    .back-btn {
      font-size: 18px;
      cursor: pointer;
      padding-right: 20px;
      img {
        width: 20px;
        margin-right: 8px;
      }
    }
  }
  &-nav {
    height: 60px;
    font-size: 18px;
    color: #e4e4e4;
    padding: 0 20px;
    div {
      height: 100%;
      width: 100px;
      cursor: pointer;
      color: #9d9d9d;
    }
    .active {
      position: relative;
      color: #e4e4e4;
      &::after {
        content: '';
        background: url('@/assets/image/border-bg.png') center no-repeat;
        background-size: cover;
        width: 100px;
        height: 3px;
        position: absolute;
        bottom: -1px;
      }
    }
  }
  &-container {
    padding: 0 20px 84px;
  }
  &-search {
    padding: 36px 0 30px;
    &-ipt {
      font-size: 16px;
      color: #7753e0;
      input[type='text'] {
        width: 196px;
        height: 30px;
        background: #171633;
        border: 1px solid rgba(119, 83, 224, 1);
        border-radius: 15px;
        color: #666666;
        padding-left: 10px;
      }
    }
    .m-l {
      margin-left: 10px;
    }
    &-btn {
      div {
        font-size: 14px;
        width: 60px;
        height: 30px;
        background: #7753e0;
        border: 1px solid rgba(119, 83, 224, 1);
        border-radius: 4px;
        color: #fff;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  &-list {
    .cont-nav {
      width: 282px;
      height: 142px;
      background: #171633;
      border-radius: 4px;
      font-size: 16px;
      padding: 36px 16px;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
      p {
        &:last-child {
          padding-top: 10px;
          //   font-size: 22px;
          color: #e4e4e4;
          word-break: break-all;
        }
      }
    }
  }
  .title {
    font-size: 18px;
    color: #e4e4e4;
    padding-bottom: 10px;
  }

  .table_empty {
    background: #1f1e4b;
    color: #fff;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #0e0d20;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #0e0d20;
  }

  .el-date-editor {
    margin-left: 20px;
    background: #171633;
    border: 1px solid #7753e0;
    border-radius: 15px;
    ::v-deep .el-range-separator {
      color: #fff;
      padding: 0;
    }
    ::v-deep .el-range-input {
      background: none;
      color: #959595;
      border-color: #7753e0;
    }
    ::v-deep .el-input__inner {
      background: #171633;
    }
  }
  .el-date-editor--month {
    ::v-deep .el-input__inner {
      border: 0 !important;
      border-radius: 15px;
    }
  }

  .el-date-editor .el-range-separator {
    color: #fff;
  }
  ::v-deep .el-table__empty-text {
    width: 100%;
  }
  .el-pagination {
    text-align: right;
    margin-top: 20px;
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

/** 泰语修改样式 */
.th {
  .detail {
    &-nav {
      div {
        width: 130px;
      }
    }
    .detail-search-btn div {
      width: 80px;
    }
  }
}
/** 英语修改样式 */
.en {
  .detail {
    &-nav {
      div {
        width: 180px;
      }
      .active {
        &::after {
          width: 180px;
        }
      }
    }
  }
}
</style>