<template>
  <div class="head">
    <div class="head-head">
      <div class="name align-center">
        <img src="@/assets/image/mobile/name.png" alt="" />
        <span>{{ userName }}</span>
      </div>
      <!-- 退出 -->
      <img src="@/assets/image/mobile/exit.png" alt="" class="exit" @click="logout" />

      <div class="amount-txt">
        {{ $t('home.headLeft1') }}
      </div>

      <div class="amount flex-between">
        <p class="amount-val flex-1" :class="{ amountF16: amount.toString().length > 20 }">
          {{ amount }}
        </p>

        <div class="amount-btn align-center">
          <div class="wallet-btn flex-center" @click="maskShow = true">
            {{ $t('home.headLeft2') }}
            <img src="@/assets/image/mobile/arrow-white.png" alt="" />
          </div>
        </div>
      </div>

      <!-- 语言 -->
      <MobileLang></MobileLang>
    </div>

    <div class="head-cont">
      <div class="code flex-between">
        <div>
          <p>{{ $t('home.headLeft4') }}</p>
          <p class="align-center">
            {{ code }}
            <img src="@/assets/image/mobile/copy.png" alt="" @click="copy(code)" />
          </p>
        </div>
        <div class="flex-col-center">
          <img src="@/assets/image/mobile/copy-url.png" alt="" @click="copy(codeUrl)" />
          {{ $t('home.headLeft5') }}
        </div>
      </div>
      <div class="flex-between flex-wrap">
        <div
          v-for="(item, index) in contList"
          :key="'cont' + index"
          class="cont-list flex-col-center"
        >
          <div class="cont-title">
            <img v-if="item.imgUrl" :src="item.imgUrl" alt="" />
            <p v-else>
              {{ $t(item.title) }}
            </p>
          </div>

          <div class="align-center" v-if="item.subList">
            <div
              class="numbers flex-col-center"
              v-for="(i, idx) in item.subList"
              :key="'sub' + idx"
            >
              <p class="cont-title">{{ $t(i.tit) }}</p>
              <p class="cont-val">{{ i.val }}</p>
            </div>
          </div>
          <div v-else class="cont-val">
            {{ item.val }}
          </div>
        </div>
      </div>

      <div class="btn flex-center" @click="$router.push({ path: '/homeList' })">
        <p>{{ $t('home.headLeft3') }}</p>
        <img src="@/assets/image/mobile/arrow.png" alt="" />
      </div>

      <!-- 弹窗 -->
      <HomeMask v-show="maskShow" @close="maskShow = false"></HomeMask>
    </div>
  </div>
</template>

<script>
import { HomeMarket } from '@/api/user'
import HomeMask from './HomeMask'
import MobileLang from '@/components/MobileLang'
export default {
  name: 'MobileHomeHead',
  props: {
    contList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    HomeMask,
    MobileLang
  },
  data() {
    return {
      maskShow: false, // 弹窗
      code: '',
      codeUrl: ''
    }
  },
  inject: ['parent'],
  computed: {
    userName() {
      return this.$store.state.user.profileInfo.user_name
    },

    amount() {
      return this.$store.state.user.profileInfo.share_wallet / 100 || 0
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
    },

    async getCode() {
      const data = await HomeMarket(),
        res = data.data
      this.code = res.marker_link.code
      if (res.marker_link.h5_url.length) {
        this.codeUrl = res.marker_link.h5_url[0]
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.head {
  &-head {
    height: 57.333333vw;
    background: url('@/assets/image/mobile/head-bg.png') center no-repeat;
    background-size: cover;
    color: #fff;
    font-size: 3.733333vw;
    position: relative;
    .name {
      width: 32.533333vw;
      height: 8vw;
      background: url('@/assets/image/mobile/name-bg.png') center no-repeat;
      background-size: cover;
      padding-left: 4.266667vw;
      position: absolute;
      left: 0;
      top: 8vw;
      img {
        width: 4.266667vw;
        height: 4.266667vw;
        margin-right: 1.6vw;
      }
    }
    .exit {
      position: absolute;
      right: 6.4vw;
      top: 4.266667vw;
      width: 4.266667vw;
      height: 4.266667vw;
    }
    .amount {
      position: absolute;
      left: 4.266667vw;
      right: 4.266667vw;
      top: 29.333333vw;
      &-btn {
        ::v-deep .lang-list {
          left: -4vw;
        }
        .wallet-btn {
          background: linear-gradient(to right, #f1951e, #eec821);
          width: 26.666667vw;
          padding: 0 2.5vw;
          margin-left: 3.2vw;
          height: 10.666667vw;
          border-radius: 5.333333vw;
          img {
            width: 2.933333vw;
            height: 2.933333vw;
            margin-left: 1.066667vw;
          }
        }
      }
    }

    .amount-val {
      font-size: 6.933333vw;
      line-height: 6.933333vw;
      word-break: break-all;
    }
    .amount-txt {
      position: absolute;
      left: 4.266667vw;
      right: 4.266667vw;
      top: 24vw;
      font-size: 3.733333vw;
    }
    .amountF16 {
      font-size: 4.266667vw;
      line-height: 4.266667vw;
    }
    .lang-cont {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(23, 22, 51, 0.1);
      height: 11.2vw;
      display: flex;
      align-items: center;
      justify-content: center;
      ::v-deep .lang {
        border: 0;
      }
      ::v-deep .lang-list {
        top: 11.2vw;
      }
    }
  }
  &-cont {
    background: #171633;
    width: 91.2vw;
    margin: 4.266667vw auto 6.933333vw;
    border-radius: 1.333333vw;
    position: relative;
    .code {
      padding: 6.4vw 4.266667vw;
      font-size: 3.733333vw;
      color: #999999;
      border-bottom: 0.266667vw solid rgba(5, 4, 17, 1);
      .align-center {
        font-size: 5.333333vw;
        color: #ffffff;
        padding-top: 2.133333vw;
        img {
          width: 3.733333vw;
          height: 4.8vw;
          margin-left: 2.133333vw;
        }
      }
      .flex-col-center {
        img {
          width: 8.266667vw;
          height: 8.266667vw;
          margin-bottom: 1.6vw;
        }
      }
    }
    .cont-list {
      width: 50%;
      font-size: 3.2vw;
      &:first-child,
      &:nth-child(2) {
        padding-top: 2.133333vw;
      }
      &:nth-child(3),
      &:nth-child(4) {
        padding-bottom: 3.2vw;
      }
      &:nth-child(5),
      &:nth-child(6) {
        border-top: 0.266667vw solid rgba(5, 4, 17, 1);
        border-bottom: 0.266667vw solid rgba(5, 4, 17, 1);
        height: 28.8vw;
      }
      &:nth-child(7),
      &:nth-child(8) {
        height: 21.333333vw;
      }
      .cont-title {
        font-size: 3.733333vw;
        color: #999999;
        img {
          width: 6.933333vw;
          height: 4.8vw;
        }
      }
      .cont-val {
        font-size: 4.266667vw;
        color: #e4e4e4;
        padding-top: 2.666667vw;
      }
      .align-center {
        border-radius: 1.066667vw;
        background: rgba(35, 33, 74, 0.6);
        .numbers {
          width: 18.666667vw;
          height: 17.6vw;
          position: relative;
          &:first-child {
            &::after {
              position: absolute;
              content: '';
              top: 5.866667vw;
              right: 0;
              width: 0.266667vw;
              height: 8.533333vw;
              background: #282855;
            }
          }
        }
      }
    }
    .btn {
      color: #e4e4e4;
      cursor: pointer;
      background: #171633;
      padding-bottom: 3.2vw;
      font-size: 3.733333vw;
      img {
        width: 2.133333vw;
        margin-left: 1.6vw;
      }
    }
  }
}

// 泰文样式
.th {
  .head {
    &-cont {
      .cont-list {
        &:nth-child(3),
        &:nth-child(4) {
          .cont-title {
            font-size: 3.2vw;
          }
          .numbers {
            width: 21vw;
          }
        }
      }
    }
  }
}

// 英文样式
.en {
}
</style>