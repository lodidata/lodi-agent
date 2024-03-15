<template>
  <component :is="detail"></component>
</template>

<script>
import MobileDetail from './mobile/home-list'
import PcDetail from './pc/home-list'
export default {
  name: 'homeList',
  components: {
    MobileDetail,
    PcDetail
  },
  computed: {
    detail() {
      //   return PcDetail
      return this.isMobile() ? MobileDetail : PcDetail
    }
  }
}
</script>
