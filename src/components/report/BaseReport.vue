<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>报表管理</el-breadcrumb-item>
       <el-breadcrumb-item>省局报表导入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="upFormRef" :model="queryInfo" :rules="rules" class="pwd_form"  label-width="100px">
        <el-form-item label="报表日期：" prop="datavalue">
          <el-date-picker  v-model="queryInfo.datavalue" type="date" placeholder="选择日期"  format="yyyyMMdd"
      value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报表文件：">
            <el-upload
            ref="uploadbase"
              class="upload-demo"
              action="none"
              accept=".xls,.xlsx"
              :auto-upload="false"
              :on-change="checkType"
              :on-remove="handleRemove"
              style="border:1px dashed #e0e0e0"
              width="50%"
              :file-list="fileList"
              :limit="1"
              :http-request="uploadHttpRequest">
               <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
               <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
                      省局报表导入
               </el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
            </el-upload>
            </el-form-item>
      </el-form>
    </el-card>
    </div>
</template>
<script>
import {readFile, delay} from '../../assets/lib/utils'
import xlsx from 'xlsx'
import {Loading} from 'element-ui'
export default {
  data () {
    return {
      queryInfo: {
        datavalue: ''
      },
      rules: {
        datavalue: [
          { required: true, message: '日期为必填项', trigger: 'blur' }
        ]
      },
      fileList: [],
      currentfile: null

    }
  },
  methods: {
    handleRemove (file, fileList) {
      this.fileList = []
      this.currentfile = null
    },
    submitUpload () {
      this.$refs.upFormRef.validate(async valid => {
        if (!valid) return
        if (!this.currentfile) {
          alert('请选择文件!')
          return
        }
        // // 点击上传：手动上传到服务器，此时会触发组件的http-request
        this.$refs.uploadbase.submit()
      })
    },
    // 自定义上传方法，param是默认参数，可以取得file文件信息，具体信息如下图
    async uploadHttpRequest (param) {
      try {
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        const formData = new FormData()
        formData.append('file', param.file)
        formData.append('datavalue', this.queryInfo.datavalue)
        formData.append('userxm', userinf.userxm)
        formData.append('city', userinf.city)
        const {data: res} = await this.$http.post('upfile', formData)
        if (res === 'success') {
          this.$message.success('上传成功!!')
          this.currentfile = null
          this.fileList = []
        } else {
          this.currentfile = null
          this.fileList = []
          alert('上传失败：' + res)
        }
      } catch (err) {
        this.currentfile = null
        this.fileList = []
        alert('异常：' + err)
      }
    },
    async checkType (file, fileList) {
      let filer = file.raw
      if (!filer) return
      this.currentfile = filer
      let fileType = filer.name.substring(filer.name.lastIndexOf('.') + 1)
      if (fileType !== 'xls' && fileType !== 'xlsx') {
        this.$message.error('文件格式不正确!!')
        return false
      }
      if (filer.size / 1024 / 1024 > 1) {
        this.$message.error('文件大小不能超过1M')
        return false
      }
    },
    //  对EXCEL 文件进行解析、展现到页面、导出，方法绑定到on-change
    async checkType1 (ev) {
      let filer = ev.raw
      if (!filer) return
      let loadinginstance = Loading.service({
        text: '数据处理中，请稍等',
        background: 'rgba(0,0,0,0.5)'
      })
      await delay(1000)
      // 下面的代码是在前台对选择的文件进行处理并展现，也可以不处理直接传到后台处理
      // 读取file中的数据,二进制方式读取,必须传入原生文件filer(file.raw)，传入file会报错
      let data = await readFile(filer)
      // 把data以二进制方式读入workboot中
      let workboot = xlsx.read(data, {type: 'binary'})
      // 得到第一个sheet的数据
      let worksheet = workboot.Sheets[workboot.SheetNames[0]]
      // 把数据利用sheet_to_json转成json格式,其中sheet2JSONOpts(自带5个属性)这个参数可以不传，如果不传，则取它的默认值
      // 但在一些情况下，比如字段有空值，sheet2JSONOpts中defval的默认值是any,不传这个参数会报错
      // 所以给这个参数的属性赋值，然后传参
      const sheet2JSONOpts = {
        /** Default value for null/undefined values */
        defval: '' // 给defval赋值为空的字符串
      }
      // 选中文件的数据先通过FileReader读入内存成二进制格式，然后在通过xlsx插件把二进制格式转换成json格式
      data = xlsx.utils.sheet_to_json(worksheet, sheet2JSONOpts)
      //  把解析的json格式的数据放到一个数组里，这样以后可以把这个数组绑定到el-table的:data中显示
      let arry = []
      data.forEach(element => {
        // 可以在这对数据进行处理，然后在放到数组中,文件第一行的字段是对象的属性，第二行开始是属性的值
        // 比如文件的第一行第一列是设备类型，那么转换的对象属性名就是设备类型
        // 现在只要第一列的数据，并且把属性名改成equiptype
        let obj = {}
        // 得到属性设备类型的值
        let nameval = element['设备类型']
        // 给obj对象的equiptype属性赋值（上边得到的数值），然后放在数组中
        obj['equiptype'] = nameval
        arry.push(obj)
        // 如果不处理数据，则直接把element push到数组中即可
      })
      // console.log(arry)
      await delay(1000)
      // 可以把这个处理后的数组循环着一条一条的传到后台,每次传一个对象
      // 把处理后的数组导出到excel文件
      // 对导出格式进行设置
      let dcarry = arry.map(item => {
        return {
          设备类型: item.equiptype
        }
      })
      let sheet = xlsx.utils.json_to_sheet(dcarry)
      let book = xlsx.utils.book_new()
      // 把sheet数据放到book中，名字为sheet1
      xlsx.utils.book_append_sheet(book, sheet, 'sheet1')
      //  把boot导出成文件，文件名为车程.xls，默认放在下载目录中
      xlsx.writeFile(book, '车程.xls')
      loadinginstance.close()
    }
  },
  directives: {
    // 注册一个局部的自定义指令 v-focus
    focus: {
    // 指令的定义
      inserted: function (el) {
      // 聚焦元素
        el.querySelector('input').focus()
      }
    }
  }
}
</script>
<style lang='less'>
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 17px;
}
.pwd_form{
  margin-top: 20px;
  width: 50%;
  // border-box 你想要设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高。
  // content-box 默认值，标准盒子模型。 width 与 height 只包括内容的宽和高， 不包括边框（border），内边距（padding），外边距（margin）。注意: 内边距、边框和外边距都在这个盒子的外部。 比如说，.box {width: 350px; border: 10px solid black;} 在浏览器中的渲染的实际宽度将是 370px。
  box-sizing: border-box;
  padding: 0 10px;
}
</style>
