import {Loading} from 'element-ui'
export function readFile (file) {
  return new Promise(resolve => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = ev => {
      resolve(ev.target.result)
    }
  })
}
export function delay (interval = 0) {
  return new Promise(resolve => {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, interval)
  })
}
export function openFullScreen () {
  const loading = Loading.service({
    lock: true, // 是否锁屏
    text: '正在导出...', // 加载动画的文字
    spinner: 'el-icon-loading', // 引入的loading图标
    background: 'rgba(0, 0, 0, 0.3)', // 背景颜色
    // target: '.sub-main', // 需要遮罩的区域
    body: true,
    customClass: 'mask' // 遮罩层新增类名
  })
  return loading
}
export function openFullScreenload () {
  const loading = Loading.service({
    lock: true, // 是否锁屏
    text: '正在加载...', // 加载动画的文字
    spinner: 'el-icon-loading', // 引入的loading图标
    background: 'rgba(0, 0, 0, 0.3)', // 背景颜色
    // target: '.sub-main', // 需要遮罩的区域
    body: true,
    customClass: 'mask' // 遮罩层新增类名
  })
  return loading
}
export function closeFullScreen (loading) {
  loading.close()
}
