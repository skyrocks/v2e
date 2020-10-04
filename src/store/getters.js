const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.auth.token,
  userId: state => state.auth.userId,
  loginName: state => state.auth.loginName,
  name: state => state.auth.name,
  avatar: state => state.auth.avatar,

  menus: state => state.menu.menus
}
export default getters
