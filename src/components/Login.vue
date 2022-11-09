<template>
    <div id="login" class="login_container" v-cloak>
        <div class="login_box">
              <div class="avatar_box">
                <img src="../assets/logo.png" alt="">

              </div>
              <el-form ref="loginFormRef" :rules="loginrules" :model="loginForm" class="login_form" label-width="0px">
                 <el-form-item prop="username">
                   <el-input  v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
                 </el-form-item>
                 <el-form-item prop="pmm">
                   <el-input v-model="loginForm.pmm" placeholder="请输入用户密码" prefix-icon="el-icon-lock" type="password"></el-input>
                 </el-form-item>
                 <el-form-item prop="code" >
                     <el-row :span="24">
                       <el-col :span="12">
                         <el-input v-model="loginForm.code"  placeholder="请输入验证码"
                               ></el-input>
                       </el-col>
                       <el-col :span="12">
                          <div class="login-code" @click="refreshCode">
                              <!--验证码组件-->
                              <s-identify :identifyCode="identifyCode"></s-identify>
                          </div>
                       </el-col>
                      </el-row>
                 </el-form-item>
                 <el-form-item class="btnslogin">
                   <el-button type="primary" @click="login">登录</el-button>
                   <el-button type="info" @click="resetloginForm()">重置</el-button>
                 </el-form-item>
              </el-form>
        </div>
    </div>
</template>
<script>

import SIdentify from './util/identify.vue'

export default {
  name: 'Login',
  components: { SIdentify },
  data () {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        if (this.loginForm.code !== this.identifyCode) {
          callback(new Error('验证码输入错误'))
        }
        callback()
      }
    }
    return {
      identifyCodes: '1234567890',
      identifyCode: '',
      loginForm: {
        username: '',
        pmm: '',
        code: '' // text框输入的验证码
      },
      loginrules: {
        username: [
          { required: true, message: '用户名为必填项', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        pmm: [
          { required: true, message: '用户密码为必填项', trigger: 'blur' },
          {pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,30}$/, message: '密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 8 - 30位'}
        ],
        code: [
          { required: true, validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetloginForm () {
      // console.log(111)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        try {
          // await 表示等一下，代码就暂停到这里，不再向下执行了，它等什么呢？等后面的promise对象执行完毕，然后拿到promise resolve 的值并进行返回，返回值拿到之后，它继续向下执行。
          // await 后面放置的就是返回promise对象的一个表达式，所以它后面可以写上 this.$http.post('login', this.loginForm)的调用
          // 即可以把promise对象的返回值赋给一个变量，这个promise的异常如何处理？用的是try/catch 来捕获异常，把await 放到 try 中进行执行，如有异常，就使用catch 进行处理。
          // promise如果不用await,应该这样调用：promise函数.then(成功时执行的函数).catch(失败时执行的函数)
          // 成功时执行的函数最为then的参数，成功时执行的函数可以这样写： function(res){...} 其中函数的参数res，是promise中用resolve返回的参数即resolve(res1) 里的res1
          const {data: res} = await this.$http.post('login', this.loginForm)
          // console.log('enterlogin')
          if (res.flag === 'ok') {
            window.sessionStorage.setItem('userinf', JSON.stringify(res.user))// 把user对象存储到session中
            window.sessionStorage.setItem('username', res.user.username)
            // this.$router.push('/home')
            this.$router.push({path: '/home'})
            // console.log('log:' + JSON.stringify(res.user))
            // this.$message.success('操作成功！！')
            // console.log(res.user)
          } else {
            this.$message.error('用户名不存在或密码错误!!')
          }
        } catch (err) {
          alert('登录异常：' + err)
        }
      })
    },
    // 验证码
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
      // console.log(this.identifyCode)
    }
  },
  created () {
    this.refreshCode()
  },
  mounted () {
    this.identifyCode = ''
    this.makeCode(this.identifyCodes, 4)
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
<style lang="less">

.login_container{
  background: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  .avatar_box{
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0 0 10px #ddd;
    background-color:#0ee;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-40%);
    img{
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}
.login_form{
  position: absolute;
  bottom: 0%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}
.el-input {
  font-size: 16px;
}
.btnslogin{
  display: flex;
  justify-content: flex-end;
}
.el-button{
font-size:16px;
}
 /*验证码样式*/
.code{
    width:150px;
    height:31px;
    border:2px solid rgba(186,186,186,1);
}
.login-code{
     cursor: pointer;
      }
</style>
