<template>
<div>
    <div>
    <el-form ref="vereportFormRef" :model="queryInfo" :rules="rules"  label-width="120px" style="margin-top:30px;">
                   <el-row :gutter="20"> <!--   分栏间隙 -->
            <el-col :span="4"> <!--列宽-->
            <el-form-item prop="filedate">
            <el-date-picker   v-model="queryInfo.filedate" type="date" placeholder="选择开始日期"  format="yyyyMMdd"
                           value-format="yyyyMMdd" >
                  </el-date-picker>
            </el-form-item>
            </el-col>
            <el-col :span="4"> <!--列宽-->
            <el-form-item prop="enddate">
            <el-date-picker   v-model="queryInfo.enddate" type="date" placeholder="选择结束日期"  format="yyyyMMdd"
                           value-format="yyyyMMdd" >
                  </el-date-picker>
            </el-form-item>
             </el-col>
            <el-col :span="4">
  <el-form-item >
               <el-select v-model="queryInfo.valueid" placeholder="邮路名称"
              clearable style="width:200px">
                  <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                   </el-option>
               </el-select>
               </el-form-item>
             </el-col>
             <el-col :span="4" class="btns">
               <el-form-item>
                    <el-button type="primary" @click="getReportList">查询
                   </el-button>
                </el-form-item>
           </el-col>
        </el-row>
      </el-form>
    </div>
<div id="main" class="chartform">
</div>
</div>

</template>
<script>
import * as echarts from 'echarts'
export default{
  data () {
    return {
      queryInfo: {
        filedate: '',
        valueid: '',
        enddate: '',
        city: ''
      },
      rules: {
        filedate: [
          { required: true, message: '日期为必填项', trigger: 'blur' }
        ],
        enddate: [
          { required: true, message: '日期为必填项', trigger: 'blur' }
        ]
      },
      options: [],
      textname: '',
      legenddata: [],
      seriesname: '',
      xAxisdata: [],
      seriesdata: [],
      myChart: ''
    }
  },
  mounted () {
    this.getOptions()
    this.textname = ''
    this.legenddata = ['利润']
    this.seriesname = '利润'
    // this.getinit()
    this.getcharts1()
  },
  methods: {
    // 生成本市邮路下拉框
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
    // 查询报表，只能查询本市的邮路
    getReportList () {
      if (!this.queryInfo.valueid) {
        alert('请选择邮路')
      } else {
        this.$refs.vereportFormRef.validate(async valid => {
          if (!valid) return
          try {
            const {data: res} = await this.$http.post('getlychart', this.queryInfo)
            if (res.res === 'success') {
              this.xAxisdata = JSON.parse(res.xdata)
              this.seriesdata = JSON.parse(res.ydata)
              this.getcharts()
            } else {
              alert('失败' + res)
            }
          } catch (err) {
            alert('异常：' + err)
          }
        })
      }
    },
    getcharts1 () {
      this.myChart = echarts.init(document.getElementById('main'), 'light')
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: this.textname
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ''
        },
        // color: ['blue'], // 设置区分（每条线是什么颜色，和 legend 一一对应
        xAxis: {
          type: 'category',
          data: this.xAxisdata,
          name: '日期', // X轴名称
          boundaryGap: false // 坐标轴两边不留白
        //   nameTextStyle: { // 坐标轴名称的文字样式
        //     color: '#FA6F53',
        //     fontSize: 16,
        //     padding: [0, 0, 0, 20]
        //   },
        //   axisLine: { // 坐标轴轴线相关设置。
        //     lineStyle: {
        //       color: '#FA6F53'
        //     }
        //   }

        },
        yAxis: {
          type: 'value',
          name: '利润：(元)',
          axisLine: {
            show: true
          }

        },
        series: [{
          name: this.seriesname,
          type: 'line', // 类型为折线图
          data: this.seriesdata
        //   lineStyle: {                // 线条样式 => 必须使用normal属性
        //     normal: {
        //         color: '#8AE09F',
        //         }
        //     }
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },
    getcharts () {
      // this.myChart = echarts.init(document.getElementById('main'), 'light')
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: this.textname
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ''
        },
        // color: ['blue'], // 设置区分（每条线是什么颜色，和 legend 一一对应
        xAxis: {
          type: 'category',
          data: this.xAxisdata,
          name: '日期', // X轴名称
          boundaryGap: false // 坐标轴两边不留白
        //   nameTextStyle: { // 坐标轴名称的文字样式
        //     color: '#FA6F53',
        //     fontSize: 16,
        //     padding: [0, 0, 0, 20]
        //   },
        //   axisLine: { // 坐标轴轴线相关设置。
        //     lineStyle: {
        //       color: '#FA6F53'
        //     }
        //   }

        },
        yAxis: {
          type: 'value',
          name: '利润：(元)',
          axisLine: {
            show: true
          }

        },
        series: [{
          name: this.seriesname,
          type: 'line', // 类型为折线图
          data: this.seriesdata
        //   lineStyle: {                // 线条样式 => 必须使用normal属性
        //     normal: {
        //         color: '#8AE09F',
        //         }
        //     }
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    }
  }
}
</script>
<style lang='less'>
.chartform{
    width:100%;
    height: 600px;
    margin-top:50px;
    font-size:20px;

}
</style>
