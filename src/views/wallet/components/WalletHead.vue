<template>
  <div class="head">
    <div class="head-name align-center">
      <img src="@/assets/image/mobile/name.png" />
      {{ userName }}
    </div>
    <div class="head-amount">
      <div class="head-amount-tit align-center">
        <span>{{ $t('home.headLeft1') }}</span>
      </div>
      <div class="head-amount-txt">{{ amount }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WallerHeader',
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    userName() {
      return this.$store.state.user.profileInfo.user_name
    },

    amount() {
      return this.$store.state.user.profileInfo.share_wallet / 100 || 0
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>

<style scoped lang='scss'>
.head {
  height: 26.666667vw;
  background: url('@/assets/image/mobile/head-bg3.png') no-repeat center;
  background-size: cover;
  margin: 0 1.6vw;
  position: relative;
  font-size: 3.733333vw;
  color: #fff;
  &-name {
    position: absolute;
    top: 6.666667vw;
    left: 2.666667vw;
    width: 32.533333vw;
    height: 8vw;
    background: rgba(0, 0, 0, 0.16);
    border-radius: 0 4vw 4vw 0;
    padding-left: 4.266667vw;
    img {
      width: 4.266667vw;
      height: 4.533333vw;
      margin-right: 2.4vw;
    }
  }
  &-amount {
    position: absolute;
    top: 6.666667vw;
    right: 6.666667vw;
    &-tit {
      justify-content: flex-end;
      img {
        width: 4vw;
        height: 4vw;
        margin-right: 2.133333vw;
      }
    }
    &-txt {
      text-align: right;
      margin-top: 1.066667vw;
      font-size: 6.4vw;
      line-height: 6.4vw;
      word-break: break-all;
      width: 42.667vw;
    }
  }
}
</style>