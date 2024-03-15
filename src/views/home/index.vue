<template>
  <component :is="home"></component>
</template>

<script>
import MobileHome from './mobile/index'
import PcHome from './pc/index'
export default {
  name: 'MobileHome',
  components: {
    MobileHome,
    PcHome
  },
  created() {
    this.$store.dispatch('user/getUserProfile') // 获取钱包信息
  },
  computed: {
    home() {
      //   return PcHome
      return this.isMobile() ? MobileHome : PcHome
    }
  }
}
</script>
