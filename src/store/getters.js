const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.auth.token,
  avatar: state => state.auth.avatar,
  name: state => state.auth.name,
  userId: state => state.auth.userId,

  menus: state => state.menu.menus
}
export default getters
