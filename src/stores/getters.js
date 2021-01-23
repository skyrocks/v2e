/*
 * @Author: shilei
 * @Date: 2020-08-17 09:45:42
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-15 16:59:56
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/src/stores/getters.js
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,

  token: state => state.auth.token,
  userId: state => state.auth.userId,
  loginName: state => state.auth.loginName,
  name: state => state.auth.name,
  avatar: state => state.auth.avatar,

  menus: state => state.menu.menus,

  tagsView: state => state.settings.tagsView,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters
