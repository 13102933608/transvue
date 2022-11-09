<template>
   <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>报表管理</el-breadcrumb-item>
     <el-breadcrumb-item>省局报表删除</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-form ref="basedelFormRef" :model="queryInfo" :rules="rules" class="del_form"  label-width="100px">
                <el-form-item prop="filedate" label="报表日期：">
                  <el-date-picker  v-model="queryInfo.filedate" type="date" placeholder="选择日期"  format="yyyyMMdd"
                           value-format="yyyyMMdd" >
                  </el-date-picker>
                </el-form-item>
                  <el-form-item class="btns">
                   <el-button type="primary" @click="basedel">删除</el-button>
                   <el-button type="info" @click="resetdelForm()">清空</el-button>
                 </el-form-item>
    </el-form>
    </el-card>
</div>
</template>
<script>
export default{
  data () {
    return {
      queryInfo: {
        filedate: '',
        userxm: ''
      },
      rules: {
        filedate: [
          { required: true, message: '日期为必填项', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetdelForm () {
      this.$refs.basedelFormRef.resetFields()
    },
    async basedel () {
      const confirmResult = await this.$confirm('确定删除省局报表吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消操作！')
      this.$refs.basedelFormRef.validate(async valid => {
        if (!valid) return
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        this.queryInfo.userxm = userinf.userxm
        try {
          const {data: res} = await this.$http.post('basedel', this.queryInfo)
          if (res === 'success') {
            this.$message.success('删除成功!!')
          } else {
            this.$message.error('删除失败：' + res)
          }
        } catch (err) {
          alert('异常错误：' + err)
        }
      })
    }
  }
}
</script>
<style lang='less'>
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 17px;
}
.del_form{
  margin-top: 20px;
  width: 50%;
  // border-box 你想要设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高。
  // content-box 默认值，标准盒子模型。 width 与 height 只包括内容的宽和高， 不包括边框（border），内边距（padding），外边距（margin）。注意: 内边距、边框和外边距都在这个盒子的外部。 比如说，.box {width: 350px; border: 10px solid black;} 在浏览器中的渲染的实际宽度将是 370px。
  box-sizing: border-box;
  padding: 0 10px;
}
.btns{
    // Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。设为Flex布局以后，子元素的float、clear和vertical-align属性将失效。
  display: flex;
  // justify-content 元素在主轴（页面）上的排列
  justify-content: flex-start;
}
</style>
