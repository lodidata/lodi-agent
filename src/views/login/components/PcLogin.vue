<template>
  <div class="login flex-center">
    <div class="login-container">
      <p class="title text-center">{{ $t('login.title') }}</p>
      <input type="text" v-model="form.name" :placeholder="$t('login.nameIpt')" />
      <div class="ipt-pass align-center">
        <input
          :type="type ? 'password' : 'text'"
          v-model="form.password"
          :placeholder="$t('login.passIpt')"
        />
        <img :src="passImg" alt="" @click="type = !type" />
      </div>
      <div class="ipt-code align-center" v-if="codeImg">
        <input type="text" v-model="form.code" :placeholder="$t('login.codeIpt')" />
        <img :src="codeImg" alt="" @click="getAuthCode" />
      </div>
      <div class="btn flex-center" @click="login">{{ $t('login.loginBtn') }}</div>

      <PcLang></PcLang>
    </div>
  </div>
</template>

<script>
import { captchaImage } from '@/api/user'
const passOn = require('@/assets/image/login/pass-on.png')
const passOff = require('@/assets/image/login/pass-off.png')
import PcLang from '@/components/PcLang'
export default {
  data() {
    return {
      form: {
        name: '',
        password: '',
        code: '',
        token: ''
      },
      type: true, // 默认不显示密码
      code_image: '', // 图形验证码
      redirect: undefined,
      otherQuery: {}
    }
  },
  name: 'PcLogin',
  components: {
    PcLang
  },
  computed: {
    passImg() {
      return this.type ? passOff : passOn
    },

    codeImg() {
      return this.code_image
    }
  },
  watch: {
    $route: {
      handler({ query }) {
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  beforeCreate() {
    document.getElementsByTagName('body')[0].className = 'login-body'
  },
  beforeDestroy() {
    document.getElementsByTagName('body')[0].className = ''
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('user/login', this.form)
      } catch (error) {
        if ([105, 165].includes(error.state)) {
          this.getAuthCode()
        }
      }
      this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
    },

    async getAuthCode() {
      //获取图形验证码
      let res = await captchaImage()
      this.code_image = res.data.images.replace(/[\r\n]/g, '')
      this.form.token = res.data.token
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style scoped lang='scss'>
.login {
  background: #fff;
  width: 900px;
  height: 550px;
  background: url('@/assets/image/login/login-bg.png') center no-repeat;
  background-size: cover;
  position: relative;
  &-container {
    width: 300px;
    height: 378px;
    background-image: linear-gradient(
      224deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
    border: 1.5px solid #ffffff;
    border-radius: 5px;
    padding: 40px 50px;
    .title {
      font-size: 16px;
      color: #30333a;
      padding-bottom: 44px;
    }
    .btn {
      width: 200px;
      height: 44px;
      background: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
      border-radius: 22px;
      font-size: 16px;
      color: #ffffff;
      margin-top: 44px;
      cursor: pointer;
    }
    input {
      border: 0;
      height: 38px;
      background: none;
      border-bottom: 1px solid #c0bed1;
      width: 100%;
    }
    .ipt-pass {
      padding-top: 24px;
      border-bottom: 1px solid #c0bed1;
      input {
        border: 0;
      }
      img {
        width: 18px;
        height: 13px;
        cursor: pointer;
      }
    }
    .ipt-code {
      padding-top: 24px;
      img {
        width: 64px;
        height: 28px;
        margin-left: 16px;
        cursor: pointer;
      }
    }
  }
  .lang-absolute {
    position: absolute;
    left: 32px;
    top: 44px;
    ::v-deep .lang {
      border: 0;
    }
  }
}
</style>
<style lang='scss'>
.login-body {
  background: url('@/assets/image/login/bg.png') center no-repeat;
  background-size: cover;
  #app {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
