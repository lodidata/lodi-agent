<template>
  <div class="share">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="$t('mask.shareTit')"
      left-arrow
      @click-left="$router.push({ path: '/' })"
      fixed
    ></van-nav-bar>

    <WalletHead></WalletHead>

    <!-- 转入主钱包 -->
    <ShareMask v-if="shareShow" @close="shareShow = false"></ShareMask>

    <div class="share-btn flex-center" @click="shareShow = true">{{ $t('mask.shareTxt') }}</div>
    <div class="share-btn bank-btn flex-center" @click="$router.push({ path: '/wallet' })">
      {{ $t('mask.shareTxt2') }}
    </div>
  </div>
</template>

<script>
import WalletHead from './components/WalletHead'
import ShareMask from './components/ShareMask'
export default {
  name: '',
  components: {
    WalletHead,
    ShareMask
  },
  props: {},
  data() {
    return {
      shareShow: false
    }
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {}
}
</script>

<style scoped lang='scss'>
.share {
  padding-top: 16.533333vw;
  height: 100%;
  background: #edeef3;
  .head {
    margin-bottom: 18.666667vw;
  }
  &-btn {
    width: 91.733333vw;
    height: 11.733333vw;
    background-image: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
    border-radius: 1.333333vw;
    font-size: 4.266667vw;
    color: #ffffff;
    margin: 0 auto;
  }
  .bank-btn {
    background: #28273e;
    margin-top: 5.333333vw;
  }
}
</style>