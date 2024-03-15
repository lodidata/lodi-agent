<template>
  <div class="lang-cont">
    <div
      class="lang flex-between"
      @click="langShow = !langShow"
      v-click-outside="() => (langShow = false)"
    >
      <img :src="langLogo" alt="" class="lang-logo" />
      {{ langTxt }}
      <img
        src="@/assets/image/arrow-down-white.png"
        class="down"
        alt=""
        :class="{ on: langShow }"
      />
    </div>
    <div class="lang-list" v-show="langShow">
      <div
        v-for="(item, index) in langList"
        :key="'lang' + index"
        class="align-center"
        :class="{ 'active-lang': langI18n === item.val }"
        @click="langClick(item)"
      >
        <img :src="item.imgUrl" alt="" />
        {{ item.txt }}
      </div>
    </div>
  </div>
</template>

<script>
const imgEn = require('@/assets/image/en.png')
// const imgZh = require('@/assets/image/zh.png')
const imgTh = require('@/assets/image/th.png')
export default {
  name: '',
  props: {},
  data() {
    return {
      langList: [
        {
          imgUrl: imgEn,
          txt: 'English',
          val: 'en'
        },
        // {
        //   imgUrl: imgZh,
        //   txt: '中文',
        //   val: 'zh'
        // },
        {
          imgUrl: imgTh,
          txt: 'ไทย',
          val: 'th'
        }
      ],
      langShow: false
    }
  },
  computed: {
    langI18n() {
      return this.$i18n.locale
    },

    langLogo() {
      let lang = this.langI18n || 'en'
      return this.langList.filter(i => i.val === lang)[0].imgUrl
    },

    langTxt() {
      let lang = this.langI18n || 'en'
      return this.langList.filter(i => i.val === lang)[0].txt
    }
  },
  methods: {
    langClick(e) {
      this.langShow = false
      if (e.val === this.langVa) return
      this.$i18n.locale = e.val
      localStorage.setItem('language', e.val)
    }
  }
}
</script>

<style scoped lang='scss'>
.lang-cont {
  position: relative;
}
.lang {
  width: 26.666667vw;
  height: 8vw;
  border: 0.266667vw solid rgba(255, 255, 255, 1);
  border-radius: 4vw;
  font-size: 3.733333vw;
  padding: 0 1.6vw;
  cursor: pointer;
  .lang-logo {
    width: 6.666667vw;
    height: 6.666667vw;
  }
  .down {
    transition: all 0.3s;
  }
}
.lang-list {
  position: absolute;
  font-size: 3.733333vw;
  top: 9.6vw;
  width: 33.333333vw;
  background: #000000;
  border: 0.533333vw solid rgba(127, 79, 232, 1);
  border-radius: 1.333333vw;
  z-index: 10;
  div {
    height: 10.666667vw;
    padding-left: 2.666667vw;
    cursor: pointer;
    img {
      margin-right: 2.666667vw;
    }
  }
  .active-lang {
    color: #6b5aea;
  }
}
</style>