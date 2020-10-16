import _this from '@/main'

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * 获取字符串长度, 一个中文代表2个字符
 *
 * @export
 * @param {*} str
 * @returns
 */
export function getStringLength(str) {
  var length = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) >= 0 && str.charCodeAt(i) <= 255) {
      length = length + 1
    } else {
      length = length + 2
    }
  }
  return length
}

/**
 * 获取app-main区域的高度
 *
 * @export
 * @returns
 */
export function getAppHeight() {
  console.log(_this.$store.getters.tagsView)
  return document.documentElement.clientHeight - 50 - (_this.$store.getters.tagsView ? 34 : 0)
}

/**
 * 获取app-main区域的宽度
 *
 * @export
 * @returns
 */
export function getAppWidth() {
  const sb = localStorage.getItem('sb') // 侧边栏状态, 0 关闭, 1 展开
  if (sb == 1) {
    return document.documentElement.clientWidth - 210
  } else {
    return document.documentElement.clientWidth - 54
  }
}

/**
 * 对象数组合并去重
 *
 * @export
 * @param {*} arr
 * @returns
 */
export function concatUnique(arr1, arr2, key) {
  const arr = arr1.concat(arr2)
  const res = new Map()
  return arr.filter(item => !res.has(item[key]) && res.set(item[key], 1))
}
