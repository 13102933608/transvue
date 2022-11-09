<template>
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
     <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
     <el-breadcrumb-item>报表管理</el-breadcrumb-item>
     <el-breadcrumb-item>单车利润查询</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-form ref="vereportFormRef" :model="queryInfo" :rules="rules"  label-width="30px">
           <el-row :gutter="25"> <!--   分栏间隙 -->
            <el-col :span="6"> <!--列宽-->
            <el-form-item prop="daterange">
            <el-date-picker
      v-model="datevalue"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期" format="yyyyMMdd"
                           value-format="yyyyMMdd">
    </el-date-picker>
            </el-form-item>
             </el-col>
                  <el-col :span="4">
               <el-form-item>
               <el-select v-model="value" placeholder="邮路名称"
               multiple
               collapse-tags>
                  <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                   </el-option>
               </el-select>
               </el-form-item>
             </el-col>
            <el-col :span="2">
               <el-form-item>
                    <el-button type="primary" @click="getReportList">查询
                   </el-button>
               </el-form-item>
            </el-col>
               <el-col :span="2">
                   <el-form-item>
                   <el-button type="primary" @click="exportExcel">导出报表</el-button>
               </el-form-item>

           </el-col>
        </el-row>
        </el-form>
         <el-table :data="userList" border :stripe="true" height="600"
         id='loadtable'  v-loading.fullscreen.lock="loading"
         element-loading-text="正在处理..."
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.3)">
      <el-table-column
      fixed
       type="index"
       width="50">
       </el-table-column>
       <el-table-column
       fixed
        prop="c0"
        label="邮路名称"
        width="200">
      </el-table-column>
       <el-table-column
        prop="c1"
        label="车牌号"
        width="100">
      </el-table-column>
        <el-table-column
        prop="c2"
        label="结算车型"
        width="100"
        >
      </el-table-column>
      <!--<el-table-column label="量收情况">-->
       <el-table-column
        prop="c3"
        label="业务量(件)"
        width="100"
              >
      </el-table-column>
       <el-table-column
        prop="c4"
        label="收入(元)"
        width="100"
             >
      </el-table-column>
       <el-table-column
        prop="c5"
        label="重量(千克)"
        width="100"
               >
      </el-table-column>
      <!--</el-table-column> -->
      <!-- <el-table-column label="重量区间量收"> -->
       <el-table-column
        prop="c6"
        label="0.3千克以内量(件)"
        width="140"
            >
      </el-table-column>
       <el-table-column
        prop="c7"
        label="0.3千克以内收入(元)"
        width="150"
                 >
      </el-table-column>
       <el-table-column
        prop="c8"
        label="0.3-1千克量(件)"
        width="150"
        >
      </el-table-column>
       <el-table-column
        prop="c9"
        label="0.3-1千克收入(元)"
        width="150"
              >
      </el-table-column>
       <el-table-column
        prop="c10"
        label="1-2千克量(件)"
        width="140"
            >
      </el-table-column>
       <el-table-column
        prop="c11"
        label="1-2千克收入(元)"
        width="150"
                >
      </el-table-column>
       <el-table-column
        prop="c12"
        label="2-3公斤量(件)"
        width="150"
                >
      </el-table-column>
       <el-table-column
        prop="c13"
        label="2-3公斤收入(元)"
        width="150"
                >
      </el-table-column>
       <el-table-column
        prop="c14"
        label="3至5公斤量(件)"
        width="150"
                >
      </el-table-column>
       <el-table-column
        prop="c15"
        label="3至5公斤收入(元)"
        width="150"
               >
      </el-table-column>
       <el-table-column
        prop="c16"
        label="5公斤以上量(件)"
        width="150"
        >
      </el-table-column>
       <el-table-column
        prop="c17"
        label="5公斤以上收入(元)"
        width="150"
         >
      </el-table-column>
      <!-- </el-table-column>
      <el-table-column label="直达省费用结算"> -->
       <el-table-column
        prop="c18"
        label="进口处理费"
        width="100"
       >
      </el-table-column>
       <el-table-column
        prop="c19"
        label="投递费"
        width="100"
        >
      </el-table-column>
       <el-table-column
        prop="c20"
        label="二干费"
        width="100"
               >
      </el-table-column>
       <el-table-column
        prop="c21"
        label="直达省费用合计"
        width="120"
        >
      </el-table-column>
      <!-- </el-table-column>
      <el-table-column label="省内费用结算"> -->
      <el-table-column
        prop="snjy"
        label="省内结余"
        width="100"
        >
      </el-table-column>
       <el-table-column
        prop="clysf"
        label="车辆运输费(单程)"
        width="150"
        >
      </el-table-column>
        <el-table-column
        prop="lscb"
        label="揽收成本"
        width="150"
        >
      </el-table-column>
       <el-table-column
        prop="clcb"
        label="出口处理成本"
        width="160"
        >
      </el-table-column>
      <!-- </el-table-column> -->
       <el-table-column
        prop="lr"
        label="利润"
        width="100"
        >
      </el-table-column>
      <el-table-column
        prop="filedate"
        label="报表日期"
        width="100"
        >
      </el-table-column>
      </el-table>
      </el-card>
    </div>

</template>
<script>
import xlsx from 'xlsx'
import {delay} from '../../assets/lib/utils'
export default{
  data () {
    return {
      queryInfo: {
        filedate: '',
        valueid: '',
        enddate: '',
        city: ''
      },
      loading: false,
      userList: [],
      options: [],
      datevalue: '',
      value: [],
      total: 0, // 总记录数
      rules: {
        filedate: [
          { required: true, message: '日期为必填项', trigger: 'blur' }
        ]

      }
    }
  },
  mounted () {
    this.getOptions()
  },
  methods: {
    async getOptions () {
      try {
        const userinf = JSON.parse(window.sessionStorage.getItem('userinf'))
        const {data: res} = await this.$http.post('getyllist?city=' + encodeURI(userinf.city))
        this.options = JSON.parse(res)
        this.queryInfo.city = userinf.city
      } catch (err) {
        alert('异常：' + err)
      }
    },
    // 查询用户
    async getReportList () {
      let bb = this.datevalue
      let bdate = bb[0]
      let edate = bb[1]
      this.queryInfo.filedate = bdate
      this.queryInfo.enddate = edate
      if (!this.queryInfo.filedate) {
        return this.$message.error('日期为必填项！')
      } else {
        try {
          this.queryInfo.valueid = JSON.stringify(this.value) // 邮路ID
          this.loading = true
          await delay(1000)
          const {data: res} = await this.$http.post('getreportlist', this.queryInfo)
          this.userList = res.data
          // this.loading = false
          // this.total = res.numbers
          // setTimeout(function () { // setTimeout是异步执行的，设定定时器，超时3S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
          this.loading = false
        } catch (err) {
          this.loading = false
          alert('异常：' + err)
        }
      }
    },
    exportExcel () {
      // 利用json_to_sheet导出数据
      // let dcarry = this.userList.map(item => {
      //   return {
      //     '邮路名称': item.c0,
      //     '车牌号': item.c1,
      //     '结算车型': item.c2,
      //     '业务量(件)': item.c3,
      //     '收入(元)': item.c4,
      //     '重量(千克)': item.c5,
      //     '0.3千克以内量(件)': item.c6,
      //     '0.3千克以内收入(元)': item.c7,
      //     '0.3-1千克量(件)': item.c8,
      //     '0.3-1千克收入(元)': item.c9,
      //     '1-2千克量(件)': item.c10,
      //     '1-2千克收入(元)': item.c11,
      //     '2-3公斤量(件)': item.c12,
      //     '2-3公斤收入(元)': item.c13,
      //     '3至5公斤量(件)': item.c14,
      //     '3至5公斤收入(元)': item.c15,
      //     '5公斤以上量(件)': item.c16,
      //     '5公斤以上收入(元)': item.c17,
      //     '进口处理费': item.c18,
      //     '投递费': item.c19,
      //     '二干费': item.c20,
      //     '直达省费用合计': item.c21,
      //     '省内结余': item.snjy,
      //     '车辆运输费(单程)': item.clysf,
      //     '揽收成本': item.lscb,
      //     '出口处理成本': item.clcb,
      //     '利润': item.lr
      //   }
      // })
      // let workBook = xlsx.utils.json_to_sheet(dcarry)
      //  增加表头
      //  const range = XLSX.utils.decode_range(workBook['!ref']) //获取工作表的有效范围，可操作的二位数组
      //   for(let c = range.s.c; c <= range.e.c; c++) {
      //     const header = XLSX.utils.encode_col(c) + '1' //某列第一行， 就是表头单元
      //     workBook[header].v = fields[c] //设置表头单元格文字
      //   }
      // 改变列宽
      //  workBook["!cols"] = [{ wpx: 400 }, { wpx: 400 }, { wpx: 400 }, { wpx: 400 }];
      // let book = xlsx.utils.book_new()
      // // 把sheet数据放到book中，名字为sheet1
      // xlsx.utils.book_append_sheet(book, workBook, 'sheet1')
      // //  把boot导出成文件，文件名为车程.xls，默认放在下载目录中
      // xlsx.writeFile(book, this.queryInfo.filedate + '单车利润.xls')
      //  利用 talbe_to_sheet报table数据导出
      try {
        if (this.userList.length > 0) {
          // this.loading = true
          // await delay(1000)
          // 克隆一个表格
          let tableclone = document.querySelector('#loadtable').cloneNode(true)
          // 因为element-ui的表格的fixed属性导致多出一个table，会下载重复内容，这里删除掉
          tableclone.removeChild(tableclone.querySelector('.el-table__fixed'))
          let sheet = xlsx.utils.table_to_sheet(tableclone, {raw: true})
          // sheet['!cols'] = [{wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 20}]
          let book = xlsx.utils.book_new()
          // 把sheet数据放到book中，名字为sheet1
          xlsx.utils.book_append_sheet(book, sheet, 'sheet1')
          let filename = this.queryInfo.filedate
          if (this.queryInfo.enddate !== this.queryInfo.filedate) {
            filename = this.queryInfo.filedate + '-' + this.queryInfo.enddate
          }
          //  把boot导出成文件，文件名为车程.xls，默认放在下载目录中
          xlsx.writeFile(book, filename + '单车利润.xls')
          // setTimeout(function () { // 设定定时器，超时5S后自动关闭遮罩层，避免请求失败时，遮罩层一直存在的问题
          // this.loading = false // 关闭遮罩层
        // }, 5000)
        } else {
          alert('数据为空')
          return
        }
      } catch (err) {
        //  this.loading = false
        alert('异常：' + err)
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
.btns{
  display: flex;
   justify-content: start;
}

</style>
