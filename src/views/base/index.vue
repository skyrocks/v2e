<script>
import { create } from '@/api/log'
export default {
  name: 'Base',
  beforeMount() {
    this.addLog()
  },
  methods: {
    addLog() {
      //基于页面的日志记录,所以不在路由守卫中配置
      create({ route: this.$route.path, menu: this.$route.meta.title, logType: '1' }) //logType=1 菜单类日志
    }
  }
}
</script>
