<template>
  <div class="mask flex-center">
    <div class="mask-cont">
      <!-- 确认弹窗 -->
      <div class="confirm">
        <div class="confirm-txt text-center">{{ $t('mask.title') }}</div>
        <div class="confirm-btn flex-center">
          <p class="flex-center" @click="$emit('close')">{{ $t('button.btn4') }}</p>
          <p class="flex-center" @click="goWallet">
            {{ $t('button.btn5') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileHomeMask',
  props: {},
  components: {},
  data() {
    return {}
  },
  created() {},
  methods: {
    goWallet() {
      this.$emit('close')
      this.$router.push({ path: '/walletShare' })
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
    width: 90.666667vw;
    background: #edeef3;
    border-radius: 2.666667vw;
    .confirm {
      padding-bottom: 5.333333vw;
      &-txt {
        padding: 15.466667vw 5.333333vw 17.6vw;
        font-size: 5.333333vw;
        color: #30333a;
      }
      &-btn {
        p {
          width: 40vw;
          height: 11.733333vw;
          background: #28273e;
          border-radius: 1.333333vw;
          font-size: 4.266667vw;
          color: #fff;
          cursor: pointer;
          &:last-child {
            background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
            margin-left: 2.666667vw;
          }
        }
      }
    }
  }
}
</style>