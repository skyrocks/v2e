<script>
import { create } from '@/api/log'
export default {
  name: 'Base',
  beforeMount() {
    console.log('beforeMount')
    this.writeLog()
  },
  methods: {
    writeLog() {
      create({ route: window.__V.route.path, menu: window.__V.route.meta.title, logType: '1', method: '' })
    }
  }
}
</script>
