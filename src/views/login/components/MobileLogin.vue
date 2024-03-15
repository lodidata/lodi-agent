<template>
  <div class="login">
    <div class="login-title flex-center">{{ $t('login.title') }}</div>

    <div class="login-ipt">
      <p class="align-center">
        <span>*</span>
        {{ $t('login.nameTxt') }}
      </p>
      <div class="flex-between" :class="{ focus: nameFocus }">
        <input
          v-model="form.name"
          :placeholder="$t('login.nameIpt')"
          @blur="nameFocus = false"
          @focus="nameFocus = true"
        />
      </div>
    </div>

    <div class="login-ipt">
      <p class="align-center">
        <span>*</span>
        {{ $t('login.passTxt') }}
      </p>
      <div class="flex-between" :class="{ focus: passFocus }">
        <input
          :type="type ? 'password' : 'text'"
          v-model="form.password"
          :placeholder="$t('login.passIpt')"
          @blur="passFocus = false"
          @focus="passFocus = true"
        />
        <img :src="passImg" alt="" @click="type = !type" />
      </div>
    </div>

    <div class="login-code" v-if="codeImg">
      <p class="align-center">
        <span>*</span>
        {{ $t('login.codeIpt') }}
      </p>
      <div class="flex-between">
        <div class="flex-between code-ipt" :class="{ focus: codeFocus }">
          <input
            type="text"
            v-model="form.code"
            :placeholder="$t('login.codeIpt')"
            @blur="codeFocus = false"
            @focus="codeFocus = true"
          />
          <img :src="codeImg" alt="" @click="getAuthCode" />
        </div>
        <img src="@/assets/image/login/refresh.png" alt="" @click="getAuthCode" />
      </div>
    </div>

    <div class="login-btn flex-center" @click="login">{{ $t('login.loginBtn') }}</div>

    <!-- 切换语言 -->
    <MobileLang></MobileLang>
  </div>
</template>

<script>
import { captchaImage } from '@/api/user'
import MobileLang from '@/components/MobileLang'
const passOn = require('@/assets/image/login/pass-on.png')
const passOff = require('@/assets/image/login/pass-off.png')
export default {
  name: 'MobileLogin',
  components: {
    MobileLang
  },
  props: {},
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
      otherQuery: {},

      nameFocus: false, // 名称输入添加样式
      passFocus: false, // 名称输入添加样式
      codeFocus: false // 名称输入添加样式
    }
  },
  computed: {
    passImg() {
      return this.type ? passOff : passOn
    },

    codeImg() {
      return this.code_image
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
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
      this.code_image = res.images.replace(/[\r\n]/g, '')
      this.form.token = res.token
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
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
  }
}
</script>

<style scoped lang='scss'>
.login {
  height: 100%;
  font-size: 3.2vw;
  color: #72788b;

  background: url('@/assets/image/mobile/login.png') center no-repeat;
  background-size: cover;
  &-title {
    padding: 16.533333vw 0 6.933333vw;
    font-size: 4.266667vw;
    color: #fff;
  }
  &-ipt {
    width: 91.466667vw;
    margin: 0 auto 11.733333vw;
    p {
      padding-bottom: 1.6vw;
      span {
        color: #e94951;
        margin-right: 1.333333vw;
      }
    }
    div {
      height: 12vw;
      background: #28273e;
      border: 0.266667vw solid rgba(57, 55, 90, 1);
      border-radius: 1.333333vw;
      padding: 0 3.2vw 0 2.666667vw;
      input {
        flex: 1;
        height: 12vw;
        background: none;
        border: 0;
        font-size: 3.733333vw;
        color: #ffffff;
      }
    }
  }
  &-code {
    width: 91.466667vw;
    margin: 0 auto 13.866667vw;
    p {
      padding-bottom: 1.6vw;
      span {
        color: #e94951;
        margin-right: 1.333333vw;
      }
    }
    .code-ipt {
      height: 12vw;
      background: #28273e;
      border: 0.266667vw solid rgba(57, 55, 90, 1);
      border-radius: 1.333333vw;
      padding: 0 3.2vw 0 2.666667vw;
      flex: 1;
      margin-right: 6.4vw;
      input {
        flex: 1;
        height: 12vw;
        background: none;
        border: 0;
        font-size: 3.733333vw;
        color: #ffffff;
      }
    }
  }
  .focus {
    border-color: #7f4fe8;
  }
  &-btn {
    width: 91.466667vw;
    height: 12vw;
    background-image: linear-gradient(270deg, #b030ab 0%, #5767fd 100%);
    border-radius: 1.333333vw;
    color: #fff;
    font-size: 4.266667vw;
    margin: 0 auto;
  }
  .lang-cont {
    margin: 30px auto;
    display: flex;
    justify-content: center;
  }
}
</style>