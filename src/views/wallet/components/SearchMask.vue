<template>
  <div class="mask">
    <div class="mask-cont">
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchMask',
  props: {},
  components: {},
  data() {
    return {
      show: false,
      beginTime: '',
      endTime: '',
      currentDate: new Date(),
      showIdx: 1 // 1 开始时间 2 结束时间
    }
  },
  created() {
    this.beginTime = this.getToday()
    this.endTime = this.getToday()
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
      return t
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

    // 点击搜索
    search() {
      let begin = this.beginTime,
        end = this.endTime,
        startTime = new Date(Date.parse(begin)),
        endTime = new Date(Date.parse(end)),
        param = {
          begin,
          end
        }
      if (startTime > endTime) {
        this.$message.error(this.$t('error.txt8'))
        return
      }
      this.$emit('search', param)
    }
  }
}
</script>

<style scoped lang='scss'>
.mask {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0;
  top: 16.533333vw;
  right: 0;
  bottom: 0;
  z-index: 20;
  &-cont {
    background: #ffffff;
    padding: 1.333333vw 4.266667vw 5.333333vw;
    .search-ipt {
      font-size: 3.2vw;
      color: #72788b;
      input[type='text'],
      .ipt {
        height: 10.666667vw;
        border: 0.266667vw solid #e8e9f0;
        border-radius: 1.333333vw;
        color: #30333a;
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
      border-radius: 1.333333vw;
      font-size: 3.733333vw;
      color: #fff;
      margin-top: 5.333333vw;
    }
  }
}
</style>