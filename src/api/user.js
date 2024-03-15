import {
  get,
  post,
  put
} from '@/utils/request'

export const captchaImage = () => get('/block/condition/captcha/image') // 验证码
export const login = data => post('/user/auth/login', data) // 登录

export const homeData = data => get('/user/agent/rpt', data) // 首页数据
export const userProfile = data => get('/user/profile', data) // 详细资料
export const homeChart = data => get('/user/agent/rpt/betList', data) // 首页折线图

export const homeTableData = data => get('/user/agent/rpt/shareholder', data) // 首页表格数据

export const HomeMarket = data => get('/user/agent/market', data) // 邀请码

export const addBank = data => put('/user/bank', data) // 提现 - 添加银行卡
export const getBankList = data => get('/user/bank', data) // 提现 - 获取银行卡列表
export const getBindList = data => get('/user/bank/bind', data) // 提现 - 获取绑定的银行卡列表
export const getWalletInfo = data => get('/user/wallet/verticalWithdraw', data) // 提现 - 获取钱包余额
export const withdraw = data => put('/user/wallet/withdraw/share', data) // 提现 - 钱包提现
export const getWithdrawList = data => get('/user/capital/withdraw', data) // 提现 - 取款记录

export const transferAmount = data => put('/user/wallet/recharge/share', data) // 转入金额