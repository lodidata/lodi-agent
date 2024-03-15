<template>
  <div class="left">
    <div class="left-top">
      <div class="left-top-head">
        <div class="name align-center">
          <img src="@/assets/image/name-logo.png" alt="" />
          {{ userName }}
        </div>

        <!-- 语言切换 -->
        <PcLang></PcLang>

        <div class="amount flex-col align-end">
          <div class="amount-tit align-center justify-end">
            <img src="@/assets/image/amount.png" alt="" />
            <span>{{ $t('home.headLeft1') }}</span>
          </div>
          <div class="amount-txt" :class="{ nr: amount.toString().length > 10 }">
            {{ amount }}
          </div>
          <div
            class="amount-btn flex-center"
            :class="{ nt: amount.toString().length > 10 }"
            @click="maskShow = true"
          >
            {{ $t('home.headLeft2') }}
            <img src="@/assets/image/arrow.png" alt="" />
          </div>
        </div>
      </div>

      <div class="left-top-cont flex-between flex-wrap">
        <div v-for="(item, index) in contList" :key="'cont' + index" class="flex-col-center">
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
    </div>

    <div class="btn flex-center" @click="$router.push({ path: '/homeList' })">
      <p>{{ $t('home.headLeft3') }}</p>
      <img src="@/assets/image/arrow.png" alt="" />
    </div>

    <div class="left-list">
      <div class="left-list-cont flex-col justify-center" v-for="item in itemList" :key="item.val">
        <p>{{ $t(item.title) }}</p>
        <div class="txt flex-between">
          <p>{{ item.val }}</p>
          <img src="@/assets/image/copy.png" alt="" @click="copy(`${item.val}`)" />
        </div>
      </div>
    </div>

    <!-- 钱包弹窗 -->
    <HomeMask v-show="maskShow" @close="maskShow = false"></HomeMask>
  </div>
</template>

<script>
import { HomeMarket } from '@/api/user'
import HomeMask from './HomeMask'
import PcLang from '@/components/PcLang'

export default {
  name: 'HomeLeft',
  props: {
    contList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      maskShow: false,
      itemList: []
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
  components: {
    HomeMask,
    PcLang
  },
  created() {
    this.getCode()
  },
  methods: {
    async getCode() {
      let data = await HomeMarket(),
        res = data.data
      let obj = {
          title: 'home.list17',
          val: res.marker_link.code
        },
        urlList = res.marker_link.h5_url.map(i => {
          return {
            title: 'home.urlTxt',
            val: i
          }
        })
      urlList.unshift(obj)
      this.itemList = urlList
    }
  }
}
</script>

<style scoped lang='scss'>
.left {
  &-top {
    &-head {
      height: 214px;
      background: url('@/assets/image/head-bg.png') center no-repeat;
      background-size: cover;
      color: #fff;
      font-size: 16px;
      position: relative;
      .name {
        width: 150px;
        height: 50px;
        background: url('@/assets/image/name-bg.png') center no-repeat;
        background-size: cover;
        padding-left: 14px;
        position: absolute;
        top: 42px;
        left: 0;
        font-size: 18px;
        img {
          width: 16px;
          height: 18px;
          margin-right: 10px;
        }
      }
      .lang-absolute {
        position: absolute;
        top: 112px;
        left: 14px;
      }

      .amount {
        width: 208px;
        position: absolute;
        top: 50px;
        right: 20px;
        &-tit {
          //   padding-right: 16px;
          img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
        }
        &-txt {
          font-size: 26px;
          //   padding-right: 14px;
          line-height: 26px;
          padding-top: 10px;
          word-break: break-all;
        }
        &-btn {
          margin-top: 38px;
          width: 90px;
          height: 30px;
          background: #ffffff;
          border-radius: 4px;
          color: #7f4fe8;
          cursor: pointer;
          img {
            width: 8px;
            // height: 12px;
            margin: 0px 0 0 4px;
          }
        }
        .nr {
          padding-right: 0;
        }
        .nt {
          margin-top: 10px;
        }
      }
    }
    &-cont {
      background: #171633;
      .flex-col-center {
        width: 50%;
        height: 106px;
        &:first-child,
        &:nth-child(2) {
          height: 86px;
        }
        &:nth-child(3),
        &:nth-child(4) {
          margin-bottom: 20px;
        }
        &:nth-child(5),
        &:nth-child(6) {
          border-top: 1px solid rgba(5, 4, 17, 1);
          border-bottom: 1px solid rgba(5, 4, 17, 1);
        }
        .cont-title {
          font-size: 14px;
          color: #999999;
        }
        .cont-val {
          font-size: 18px;
          color: #e4e4e4;
          padding-top: 12px;
        }
        .align-center {
          border-radius: 4px;
          background: rgba(35, 33, 74, 0.6);
          .numbers {
            width: 86px;
            height: 82px;
            position: relative;
            .cont-val {
              padding-top: 14px;
            }
            &:first-child {
              &::after {
                position: absolute;
                content: '';
                right: 0;
                width: 1px;
                height: 36px;
                background: #282855;
              }
            }
          }
        }
      }
    }
  }
  .btn {
    // width: 80px;
    // margin: 0 auto;
    color: #e4e4e4;
    cursor: pointer;
    background: #171633;
    padding-bottom: 16px;
    img {
      width: 8px;
      //   height: 12px;
      margin-left: 8px;
    }
  }
  &-list {
    margin-top: 20px;
    height: 516px;
    background: #171633;
    &-cont {
      height: 80px;
      border-bottom: 1px solid #050411;
      padding: 0 20px 0 16px;
      font-size: 14px;
      &:first-child {
        .txt {
          color: #8849f1;
        }
      }
      .txt {
        font-size: 16px;
        color: #fff;
        margin-top: 2px;
        p {
          @include ellipsis;
        }
      }
    }
    img {
      width: 14px;
      height: 18px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
/** 泰语修改样式 */
.th {
  .left {
    .cont-title {
      font-size: 12px;
    }
  }
}
</style>