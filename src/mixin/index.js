/*
 * @Author: shilei
 * @Date: 2020-09-28 15:12:09
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-26 16:36:06
 * @Description: 全局业务组件混入
 * @FilePath: /aolong-parrot/src/mixin/index.js
 */
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import { create } from '@/api/log'
import cache from '@/utils/cache'

const mixin = {
  mounted() {
    // 基于页面的日志记录,所以不在路由守卫中配置
    create({ route: this.$route.path, menu: this.$route.meta.title, logType: '1' }) // logType=1 菜单类日志

    // 页面引导
    if (this.steps) {
      let guideFlag = cache.get(window.__C.K_GUIDE)
      if (guideFlag === undefined || guideFlag === '' || !guideFlag[this.$route.path]) {
        // 执行一次, 记录标记
        if (guideFlag === undefined || guideFlag === '') {
          guideFlag = {}
        }
        this.$nextTick(function() {
          const driver = new Driver({
            doneBtnText: '完成', // 结束按钮的文字
            stageBackground: '#ffffff', // 突出显示元素的背景颜色
            nextBtnText: '下一步', // 下一步按钮的文字
            prevBtnText: '上一步', // 上一步按钮的文字
            closeBtnText: '关闭' // 关闭按钮的文字
          })
          if (this.gridSteps && guideFlag.grid !== true) {
            this.steps = this.steps.concat(this.gridSteps)
            guideFlag.grid = true
          }
          driver.defineSteps(this.steps)
          driver.start()

          guideFlag[this.$route.path] = true
          cache.set(window.__C.K_GUIDE, guideFlag)
        })
      }
    }
  }
}

export { mixin }
