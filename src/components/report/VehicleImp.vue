<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>报表管理</el-breadcrumb-item>
       <el-breadcrumb-item>发车信息导入</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="veupFormRef" :model="queryInfo" :rules="rules" class="pwd_form"  label-width="100px">
        <el-form-item label="报表日期：" prop="datavalue">
          <el-date-picker  v-model="queryInfo.datavalue" type="date" placeholder="选择日期"  format="yyyyMMdd"
      value-format="yyyyMMdd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报表文件：">
            <el-upload
            ref="veuploadbase"
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
                      发车信息导入
               </el-button>
                <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件</div>
            </el-upload>
            </el-form-item>
      </el-form>
    </el-card>
    </div>
</template>
<script>
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
      this.$refs.veupFormRef.validate(async valid => {
        if (!valid) return
        if (!this.currentfile) {
          alert('请选择文件!')
          return
        }
        // // 点击上传：手动上传到服务器，此时会触发组件的http-request
        this.$refs.veuploadbase.submit()
      })
    },
    // 自定义上传方法，param是默认参数，可以取得file文件信息
    async uploadHttpRequest (param) {
      try {
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        const formData = new FormData()
        formData.append('file', param.file)
        formData.append('datavalue', this.queryInfo.datavalue)
        formData.append('userxm', userinf.userxm)
        formData.append('city', userinf.city)
        const {data: res} = await this.$http.post('upvefile', formData)
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
      let filer = file.raw // file是有关文件信息的对象，raw才是真正的File
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
