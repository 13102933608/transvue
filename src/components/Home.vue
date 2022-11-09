<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>保定市直发邮路单车利润</span>
        <span>{{ usern }}</span>
      </div>
      <el-button type="info" @click="logout" >安全退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu :collapse="isCollapse" :collapse-transition="true"
        :router="true" :unique-opened="true" :default-active="activepath"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.title}}</span>
            </template>
            <el-menu-item :index="it.path" v-for="it in item.slist" :key="it.id" @click="savepath(it.path)">
              <template slot="title">
                <i :class="it.icon"></i>
                <span>{{it.title}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      usern: '',
      menuList: [],
      isCollapse: false,
      activepath: '/welcome'
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear() // 清除session
      this.$router.push('/login') // 退出到登录页面
    },
    async getMenuList (id) {
    //  console.log('getmenu')
      try {
        const {data: res} = await this.$http.post('menus?id=' + id)
        // console.log(res)
        if (res.flag !== 200) return this.$message.error('获取菜单失败!!')
        this.menuList = res.menus
      } catch (err) {
        alert('获取菜单异常：' + err)
      }
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    savepath (activepath) { //  当前路径
      window.sessionStorage.setItem('activepath', activepath) // 把路径保存到session中
      this.activepath = activepath
    }
  },
  mounted () {
    // this.data.usern=
    // const userflag = window.sessionStorage.getItem('username')
    const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
    // console.log(userinf)
    this.usern = '用户：' + userinf.username
    this.getMenuList(userinf.id)
    // 获取保存的路径
    this.activepath = window.sessionStorage.getItem('activepath')
  }
}
</script>
<style lang="less">
// 布局器样式
.home-container {
  height: 100%;
}
// 头部样式
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; // 左右贴边
  padding-left: 0%;
  color: #fff;
  font-size: 23px;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  .el-button{
    font-size:18px;
  }
}
// 侧边栏样式
.el-aside {
   background-color: #333744;
   .el-menu {
      border-right: none;
      .el-submenu {
        span {
          font-size: 16px;

        }
      }
    }
}
// 主体样式
.el-main {
  background-color: #eaedf1;
 }
.toggle-button{
    background-color: #4A5064;
    font-size: 20px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    cursor: pointer; //经过时显示小手
    letter-spacing: 0.2em;// 字母间距
}
</style>
