<template>
  <div id="app" :class="[langEn]">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    // 根据语言 th 泰文  en 英文 zh 中文 添加样式
    langEn() {
      return this.$i18n.locale
    }
  },
  beforeCreate() {
    if (this.isMobile()) {
      document.getElementsByTagName('body')[0].className = 'mobile-body'
    }
  },
  methods: {}
}
</script>
<style lang="scss">
/** 泰文字体 */
@font-face {
  font-family: PromptMedium;
  src: url('@/assets/font/Prompt-Medium.ttf');
} /** 泰文字体 */
@font-face {
  font-family: RobotoRegular;
  src: url('@/assets/font/Roboto-Regular-14.ttf');
}
.th {
  font-family: PromptMedium;
}
.en {
  font-family: RobotoRegular;
}

// 移动端的页面修改element的样式
.mobile-body {
  .el-message {
    min-width: 370px;
  }
  #app {
    width: 100vw;
  }
  .van-nav-bar__content {
    height: 16.533333vw;
  }
  .van-nav-bar .van-icon {
    color: #72788b;
  }
  .van-nav-bar__arrow {
    font-size: 20px;
  }
  .van-nav-bar__title {
    font-size: 4.266667vw;
    color: #30333a;
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0;
  }
  .van-nav-bar__right {
    .van-nav-bar__text {
      color: #30333a;
    }
  }
}
</style>