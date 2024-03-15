<template>
  <component :is="login"></component>
</template>

<script>
import MobileLogin from './components/MobileLogin'
import PcLogin from './components/PcLogin'
export default {
  name: 'Login',
  components: {
    MobileLogin,
    PcLogin
  },
  computed: {
    login() {
      //   return PcLogin
      return this.isMobile() ? MobileLogin : PcLogin
    }
  }
}
</script>
