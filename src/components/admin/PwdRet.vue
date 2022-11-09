<template>
   <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>系统管理</el-breadcrumb-item>
     <el-breadcrumb-item>个人密码重置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-form ref="pwdFormRef" :model="queryInfo" :rules="rules" class="pwd_form"  label-width="0px">
                 <el-form-item prop="pmm">
                   <el-input  v-model="queryInfo.pmm" placeholder="请输入新密码" prefix-icon="el-icon-lock" type="password" ></el-input>
                 </el-form-item>
                 <el-form-item prop="repmm">
                   <el-input  v-model="queryInfo.repmm" placeholder="密码确认" prefix-icon="el-icon-lock" type="password"></el-input>
                 </el-form-item>
                  <el-form-item class="btnspwd">
                   <el-button type="primary" @click="editpwd">修改密码</el-button>
                   <el-button type="info" @click="resetpwdForm()">清空</el-button>
                 </el-form-item>
    </el-form>
    </el-card>
</div>
</template>
<script>
export default{
  data () {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else {
        if (this.queryInfo.repmm !== this.queryInfo.pmm) {
          callback(new Error('两次输入的密码不一致'))
        }
        callback()
      }
    }
    return {
      queryInfo: {
        pmm: '',
        id: '',
        repmm: ''
      },
      rules: {
        pmm: [
          { required: true, message: '用户密码为必填项', trigger: 'blur' },
          {pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位'}
        ],
        repmm: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetpwdForm () {
      this.$refs.pwdFormRef.resetFields()
    },
    editpwd () {
      this.$refs.pwdFormRef.validate(async valid => {
        if (!valid) return
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        this.queryInfo.id = userinf.id
        try {
          const {data: res} = await this.$http.post('editpwd', this.queryInfo)
          if (res === 'success') {
            this.$message.success('操作成功!!')
          } else {
            this.$message.error('操作失败!!')
          }
        } catch (err) {
          alert('异常错误：' + err)
        }
      })
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
.btnspwd{
    // Flex是Flexible Box的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性。设为Flex布局以后，子元素的float、clear和vertical-align属性将失效。
  display: flex;
  // justify-content 元素在主轴（页面）上的排列
  justify-content: flex-end;
}
</style>
