const getters = {
  token: state => state.user.token,
  info: state => state.user.info,
  time: state => state.user.time,
  source: state => state.app.source,
}
export default getters
