import Vue from 'vue'
import {
  Pagination,
  DatePicker,
  Table,
  TableColumn,
  Message,
  Input,
  Select,
  Option
} from 'element-ui'
import i18n from "@/lang" // 国际化

// 默认样式太大了，换成small的
Vue.prototype.$ELEMENT = {
  size: 'small',
  zIndex: 2000
};

const elementArr = [Pagination, DatePicker, Table, Input, Select, Option, TableColumn];
elementArr.forEach(item => Vue.use(item));
Vue.prototype.$message = Message


import 'vant/lib/index.css';
import {
  DatetimePicker,
  NavBar,
  Popup
} from 'vant';
const vantArr = [DatetimePicker, NavBar, Popup];
vantArr.forEach(item => Vue.use(item));


import inputDirective from '@/directives/input' // 自定义指令
inputDirective(Vue)


//引入基本模板
// import echarts from "echarts";

let echarts = require('echarts/lib/echarts')
// 引入折线图等组件
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
Vue.prototype.$echarts = echarts

// 全局过滤器
import filters from '@/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


//判断是否是移动端
Vue.prototype.isMobile = function () {
  var mobileArray = ["iPhone", "iPad", "Android", "Windows Phone", "BB10; Touch", "BB10; Touch", "PlayBook", "Nokia"];
  var ua = navigator.userAgent;
  var res = mobileArray.filter(function (arr) {
    return ua.indexOf(arr) > 0;
  });
  return res.length > 0;
}

// 复制
Vue.prototype.copy = function (txt) {
  var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  var t = document.createElement("input");
  t.value = txt
  document.body.appendChild(t)
  if (isiOS) {
    t.position = "absolute";
    t.style.left = "-9999px";
    t.setAttribute("readonly", "");
    var e = document.createRange();
    e.selectNodeContents(t);
    var i = window.getSelection();
    i.removeAllRanges(),
      i.addRange(e),
      t.setSelectionRange(0, txt.length)
  } else
    t.select();
  try {
    document.execCommand("copy", !1, null)
    Message.success(i18n.t('error.txt6'))

  } catch (n) {
    Message.error(i18n.t('error.txt6'))
  }
  t.remove()
}
