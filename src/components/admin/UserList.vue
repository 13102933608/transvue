<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>系统管理</el-breadcrumb-item>
     <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row :gutter="25"> <!--   间隙 -->
            <el-col :span="10"> <!--列宽-->
        <el-input placeholder="请输入用户代码" v-model="queryInfo.username" :clearable="true" @clear="getUserListq">
            <el-button icon="el-icon-search" slot="append" @click="getUserListq" >

            </el-button>

        </el-input>
        </el-col>
        <el-col :span="4">
        <el-button type="primary" @click="openaddDialog">添加用户</el-button>
        </el-col>
        </el-row>
         <el-table
      :data="userList"
      style="width: 100%" border :stripe="true" >
      <el-table-column
       type="index"
       width="50">
       </el-table-column>
       <el-table-column
        prop="vc_brh_name"
        label="所属机构"
        width="220">
      </el-table-column>
       <el-table-column
        prop="username"
        label="用户代码"
        width="180">
      </el-table-column>
        <el-table-column
        prop="userxm"
        label="用户姓名"
        width="180">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
                    <!--{{scope.row}} 存储了当前行的信息
           <el-switch v-model="scope.row.state"></el-switch>
           -->
           <!--tooltip 文字提示-->
            <el-tooltip placement="top-start" content="编辑用户" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showeditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip placement="top-start" content="注销用户" :enterable="false">
               <el-button type="danger" size="mini" icon="el-icon-delete" @click="updateUserState(scope.row)"></el-button>
            </el-tooltip>
             <el-tooltip placement="top-start" content="分配权限" :enterable="false">
               <el-button type="warning" size="mini" icon="el-icon-setting" @click="showqxDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip placement="top-start" content="密码初始化" :enterable="false">
               <el-button type="warning" size="mini" icon="el-icon-key" @click="initUserPwd(scope.row)"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div>
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 5, 100]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </div>
    </el-card>
    <el-dialog title="添加用户" width="50%" :visible.sync="addDialogVisalbe" @close="addDialogClosed">
        <el-form ref="addFormRef" :rules="addFormRules" :model="addForm" label-width="100px">
            <el-form-item prop="username" label="用户代码：">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="userxm" label="用户姓名：">
              <el-input v-model="addForm.userxm" ></el-input>
            </el-form-item>
            <el-form-item prop="n_brh_no" label="机构名称：">
                 <el-cascader ref="addFormcascader" v-model="addForm.value" :options="addForm.options" @change="handleChange" :show-all-levels="false"  :props="addForm.props"></el-cascader>
           </el-form-item>

    </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="addUser" >确定</el-button>
         <el-button @click="addDialogVisalbe=false">关闭</el-button>
       </span>
    </el-dialog>
     <el-dialog title="修改用户" width="50%" :visible.sync="editDialogVisalbe" @close="editDialogClosed">
        <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="100px">
           <el-form-item prop="username" label="用户代码：">
              <el-input v-model="editForm.username" ></el-input>
            </el-form-item>
             <el-form-item prop="userxm" label="用户姓名：">
              <el-input v-model="editForm.userxm" ></el-input>
            </el-form-item>
            <el-form-item prop="n_brh_no" label="机构名称：">
                 <el-cascader ref="editFormcascader" v-model="editForm.value" :options="editForm.options" @change="handleChangeedit" :show-all-levels="false"  :props="{ checkStrictly: true }"></el-cascader>
           </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="editUser" >确定</el-button>
         <el-button @click="editDialogVisalbe=false">关闭</el-button>
       </span>
    </el-dialog>
     <el-dialog title="权限分配" width="50%" :visible.sync="qxDialogVisalbe" @close="qxDialogClosed">
        <el-form ref="qxFormRef"  :model="qxForm" label-width="100px">
           <el-form-item prop="username" label="用户代码：">
              <el-input v-model="qxForm.username" disabled ></el-input>
            </el-form-item>
            <el-form-item prop="n_menu_no" label="权限名称：">
                 <el-cascader ref="qxFormcascader"  v-model="qxForm.value" :options="qxForm.options" @change="handleChangeqx" :show-all-levels="false"  :props="{multiple: true }"></el-cascader>
           </el-form-item>
                </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="qxUser" >确定</el-button>
         <el-button @click="qxDialogVisalbe=false">关闭</el-button>
       </span>
    </el-dialog>
    </div>

</template>
<script>
export default{
  data () {
    return {
      queryInfo: {
        username: '', // 查询条件
        pageNum: 1, // 当前页
        pageSize: 5, // 每页最大记录数
        userid: '', // 登录用户id
        n_brh_no: '' // 登录用户机构
      },
      userList: [],
      total: 0, // 总记录数
      addDialogVisalbe: false,
      qxDialogVisalbe: false,
      addForm: {
        username: '',
        userxm: '',
        value: [],
        options: [],
        n_brh_no: '',
        props: {
          checkStrictly: true // 父子不互相关联
        }

      },
      addFormRules: {
        username: [
          { required: true, message: '用户代码为必填项', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        userxm: [
          { required: true, message: '用户姓名为必填项', trigger: 'blur' }
        ],
        n_brh_no: [
          { required: true, message: '机构为必填项', trigger: 'blur' }
        ]
      },
      editDialogVisalbe: false,
      editForm: {
        username: '',
        userxm: '',
        value: [],
        options: [],
        n_brh_no: ''
      },
      editFormRules: {
        username: [
          { required: true, message: '修改用户名为必填项', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur' }
        ],
        userxm: [
          { required: true, message: '用户姓名为必填项', trigger: 'blur' }
        ],
        n_brh_no: [
          { required: true, message: '机构为必填项', trigger: 'blur' }
        ]
      },
      qxForm: {
        username: '',
        n_brh_no: '',
        value: [],
        options: [],
        n_menu_no: '',
        id: '',
        oprid: '',
        showkey: 0
      }

    }
  },
  methods: {
    // 查询用户
    async getUserList () {
      const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
      this.queryInfo.n_brh_no = userinf.n_brh_no
      // const {data: res} = await this.$http.get('alluser', {params: {id: 123,name:'1343'}})
      try {
        // const {data: res} = await this.$http.get('alluser', {params: this.queryInfo})
        const {data: res} = await this.$http.post('alluser', this.queryInfo)
        this.userList = res.data
        this.total = res.numbers
      } catch (err) {
        alert('异常：' + err)
      }
    },
    async initUserPwd (userInfo) {
      try {
        const confirmResult = await this.$confirm('确定初始化密码为:Trans123吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') return this.$message.info('取消操作！')
        const {data: res} = await this.$http.post(`initpwd?id=${userInfo.id}`)
        //  const {data: res} = await this.$http.post('updatestate?id='+id)
        if (res === 'error') {
          return this.$message.error('初始化失败！')
        }
        this.$message.success('初始化成功！')
      } catch (err) {
        alert('异常：' + err)
      }
    },
    // 注销用户
    async updateUserState (userInfo) {
      try {
        const confirmResult = await this.$confirm('确定删除用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') return this.$message.info('取消操作！')
        const {data: res} = await this.$http.post(`updatestate?id=${userInfo.id}`)
        //  const {data: res} = await this.$http.post('updatestate?id='+id)
        if (res === 'error') {
          return this.$message.error('注销失败！')
        }
        this.queryInfo.pageNum = 1
        this.getUserList()
        this.$message.success('注销成功！')
      } catch (err) {
        alert('异常：' + err)
      }
    },
    // 每页显示记录数发生变化
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 当前页发生变化
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    getUserListq () {
      this.queryInfo.pageNum = 1
      this.getUserList()
    },
    // 关闭添加用户窗口
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
      this.addForm.value = []
    },
    handleChange (value) {
      if (value) {
        this.addForm.n_brh_no = value[value.length - 1] + ''
      }
    },
    handleChangeedit (value) {
      if (value) {
        this.editForm.n_brh_no = value[value.length - 1] + ''
      }
    },
    async openaddDialog () {
      try {
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        const {data: res} = await this.$http.post('getbrhlist?id=' + userinf.n_brh_no + '&brhname=' + encodeURI(userinf.vc_brh_name))
        //  const res = '[{"value":1,"label":" 保定市分公司","children":[{"value":2,"label":"财务部","children":[]},{"value":3,"label":"寄递事业部","children":[{"value":4,"label":"邮区中心局"},{"value":5,"label":"运营管理部"}]}]}]'
        // if (res) {
        // 级联选择器返回的字符串格式如上边的res,JSON.parse是把json格式的字符串转化成对象格式，如果有[],则转成数组
        this.addForm.options = JSON.parse(res)
        // }
        const {data: res1} = await this.$http.post('getbrhaddr?id=' + userinf.n_brh_no + '&endbrh=' + userinf.n_brh_no)
        // 级联选择器如果单选，则赋初值必须是[a1,a2,a3] 这种数组格式, 数组里的最后一个数字是选择机构的id,前边的是该ID的上级机构ID，这个数组代表了从第一个上级，第二个上级，一直到它本身，这样级联器才能找到该机构并赋值成功
        // 如果是多选，则赋初值是[[],[],[]] 这种数组格式，二层[],代表一个选中的机构，每个选中机构的[]，和单选的组织一样，都是从第一个上级，一直到本身
        this.addForm.value = JSON.parse(res1).reverse()
        this.addForm.n_brh_no = userinf.n_brh_no
        this.addDialogVisalbe = true
      } catch (err) {
        alert('异常：' + err)
      }
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        try {
          const {data: res} = await this.$http.post('adduser', this.addForm)
          if (res === 'success') {
            this.$message.success('操作成功!!')
            this.addForm.value = []
            this.addDialogVisalbe = false
            this.queryInfo.pageNum = 1
            await this.getUserList()
          } else {
            this.$message.error('操作失败!!')
          }
        } catch (err) {
          alert('异常：' + err)
        }
      })
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.editForm.value = []
    },
    async showeditDialog (userInfo) {
      try {
        const {data: res} = await this.$http.post('getupdateuser?id=' + userInfo.id)
        this.editForm = res
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        const {data: res2} = await this.$http.post('getbrhlist?id=' + userinf.n_brh_no + '&brhname=' + encodeURI(userinf.vc_brh_name))
        this.editForm.options = JSON.parse(res2)
        const {data: res1} = await this.$http.post('getbrhaddr?id=' + userInfo.n_brh_no + '&endbrh=' + userinf.n_brh_no)
        this.editForm.value = JSON.parse(res1).reverse()
        this.editDialogVisalbe = true
      } catch (err) {
        alert('异常：' + err)
      }
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        try {
          const {data: res} = await this.$http.post('edituser', this.editForm)
          if (res === 'success') {
            this.$message.success('操作成功!!')
            // 级联选择器当窗口关闭时，要把value即选中的值清空，要不然在打开窗口调用级联选择器时会报警告
            this.editForm.value = []
            this.editDialogVisalbe = false
            this.queryInfo.pageNum = 1
            this.getUserList()
          } else {
            this.$message.error('操作失败!!')
          }
        } catch (err) {
          alert('异常：' + err)
        }
      })
    },
    qxDialogClosed () {
      this.$refs.qxFormRef.resetFields()
      // 级联选择器当窗口关闭时，要把value即选中的值清空，要不然在打开窗口调用级联选择器时会报警告
      this.qxForm.value = []
    },
    handleChangeqx (value) {
      if (value) {
        this.qxForm.n_menu_no = JSON.stringify(value)
      }
    },
    async showqxDialog (userInfo) {
      try {
        // 查询编辑的用户的信息
        const {data: res} = await this.$http.post('getupdateuser?id=' + userInfo.id)
        this.qxForm = res
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        this.qxForm.oprid = userinf.id
        //  获取登录用户所拥有的权限，登录用户只能把自己所拥有的权限授权给其他用户
        const {data: res2} = await this.$http.post('qxmenus?id=' + userinf.id)
        this.qxForm.options = JSON.parse(res2)
        //   查询编辑的用户当前所拥有的权限，在级联选择器中进行回显，多选时是[[],[],[]]这种格式
        const {data: res1} = await this.$http.post('getmenuaddr?id=' + userInfo.id)
        this.qxForm.value = JSON.parse(res1)
        this.qxDialogVisalbe = true
      } catch (err) {
        alert('异常：' + err)
      }
    },
    qxUser () {
      try {
        //  JSON.stringify()的作用是将 JavaScript 对象转换为 JSON 字符串，而JSON.parse()可以将JSON字符串转为一个对象。
        // 在使用JSON.parse()需要注意一点，由于此方法是将JSON字符串转换成对象，所以你的字符串必须符合JSON格式，即键值都必须使用双引号包裹
        //  在比较数组是否相等，或拷贝数组时，可以先利用JSON.stringify()把数组转成字符串，就方便比较和拷贝了，操作完后，在用JSON.parse(),转换回数组
        this.qxForm.n_menu_no = JSON.stringify(this.qxForm.value)
        this.$refs.qxFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('editqx', this.qxForm)
          if (res === 'success') {
            this.$message.success('操作成功!!')
            this.qxForm.value = []
            this.qxDialogVisalbe = false
          } else {
            this.$message.error('操作失败!!')
          }
        })
      } catch (err) {
        alert('异常：' + err)
      }
    }
  },
  mounted () {
    this.getUserList()
  }
}
</script>
<style lang='less'>
.el-breadcrumb {
  font-size: 18px;
}
.el-input {
  font-size: 16px;
}
.el-button {
  font-size: 16px;
}

</style>
