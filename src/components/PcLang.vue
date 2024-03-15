<template>
  <div class="lang-absolute">
    <div>
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
          txt: 'EN',
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
.lang-absolute {
  position: relative;
  .lang {
    width: 100px;
    height: 30px;
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 4px;
    font-size: 14px;
    padding: 0 10px;
    position: relative;
    cursor: pointer;
    .lang-logo {
      width: 25px;
      height: 25px;
    }
    .down {
      transition: all 0.3s;
    }
  }
  .lang-list {
    position: absolute;
    font-size: 14px;
    top: 30px;
    left: -15px;
    width: 125px;
    background: #000000;
    border: 2px solid rgba(127, 79, 232, 1);
    border-radius: 5px;
    div {
      height: 40px;
      padding-left: 10px;
      cursor: pointer;
      img {
        margin-right: 10px;
      }
    }
    .active-lang {
      color: #6b5aea;
    }
  }
}
</style>