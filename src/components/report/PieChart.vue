<template>
<div>
    <div>
    <el-form ref="pieFormRef" :model="queryInfo" :rules="rules"  label-width="120px" style="margin-top:30px;">
                   <el-row :gutter="20"> <!--   分栏间隙 -->
            <el-col :span="4"> <!--列宽-->
            <el-form-item prop="filedate">
            <el-date-picker   v-model="queryInfo.filedate" type="date" placeholder="选择开始日期"  format="yyyyMMdd"
                           value-format="yyyyMMdd"  @change="datechange">
                  </el-date-picker>
            </el-form-item>
            </el-col>
             <el-col :span="4">
  <el-form-item >
               <el-select v-model="queryInfo.valueid" placeholder="邮路名称"
              clearable style="width:200px" @change="carselect">
                  <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                   </el-option>
                                   </el-select>
                             </el-form-item>
            </el-col>
            <el-col :span="4">
  <el-form-item >
               <el-select v-model="queryInfo.carid" placeholder="车辆"
              clearable style="width:200px">
                  <el-option
                        v-for="item in caroptions"
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
        city: '',
        carid: ''
      },
      rules: {
        filedate: [
          { required: true, message: '日期为必填项', trigger: 'blur' }
        ]
      },
      options: [],
      caroptions: [],
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
    this.seriesname = '重量占比'
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
    datechange () {
      this.queryInfo.valueid = ''
      this.queryInfo.carid = ''
      this.caroptions = []
    },
    // 生成车辆下拉表
    async carselect () {
      if (this.queryInfo.filedate) {
        if (this.queryInfo.valueid) {
          try {
            const {data: res} = await this.$http.post('getcarlist?ylid=' + this.queryInfo.valueid + '&filedate=' + this.queryInfo.filedate)
            this.caroptions = JSON.parse(res)
            this.queryInfo.carid = ''
          } catch (err) {
            alert('异常：' + err)
          }
        } else {
          this.queryInfo.carid = ''
          this.caroptions = []
        }
      } else {
        alert('请先选择日期')
      }
    },
    // 查询报表，只能查询本市的邮路
    getReportList () {
      if (!this.queryInfo.valueid) {
        alert('请选择邮路')
      } else {
        if (!this.queryInfo.carid) {
          alert('请选择车辆')
        } else {
          this.$refs.pieFormRef.validate(async valid => {
            if (!valid) return
            try {
              const {data: res} = await this.$http.post('getpiechart', this.queryInfo)
              if (res.res === 'success') {
                // this.xAxisdata = JSON.parse(res.xdata)
                this.seriesdata = JSON.parse(res.ydata)
                // this.seriesdata = [ {value: 1048, name: '<0.3千克'},
                //   {value: 735, name: '0.3-1千克'},
                //   {value: 580, name: '1-2千克'},
                //   {value: 484, name: '2-3千克'},
                //   {value: 300, name: '3-5千克'},
                //   {value: 400, name: '>5千克'}]
                this.getcharts()
              } else {
                alert('失败' + res)
              }
            } catch (err) {
              alert('异常：' + err)
            }
          })
        }
      }
    },
    getcharts1 () {
      this.myChart = echarts.init(document.getElementById('main'), 'light')
      var option = {
        title: { // 本例把title设置成了空
          text: this.textname
        },
        tooltip: {
          trigger: 'item' // 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          // formatter: '{a} <br/> {b}:{c}({d}%)'
        },
        legend: {
          top: '2%',
          left: 'center'
        },
        series: [{ // 每一条线的数据
          name: this.seriesname, // 系列名称，用于tooltip的显示，legend 的图例筛选
          type: 'pie', // 类型为折线图
          center: ['50%', '45%'], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
          radius: ['15%', '60%'], // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
          avoidLabelOverlap: true, // 是否启用防止标签重叠策略，默认开启,环形图中需要强制所有标签放在中心位置设为false
          label: { // 饼图图形上的文本标签
            normal: {
              show: true, // 是否显示标签
              // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
              position: 'outside',
              // 显示的标签的内容
              // a（系列名称），b（数据项名称），c（数值）, d（百分比）
              formatter: '{a},{b}:{c}({d}%)'
            },
            emphasis: { // 鼠标放在圆环上显示的标签样式
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: true, // 是否显示引导线
              length: 10, // 百分比引导线
              length2: 20 // 视觉引导项第二段的长度。
            }
          },
          data: this.seriesdata
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(option)
    },
    getcharts () {
      // this.myChart = echarts.init(document.getElementById('main'), 'light')
      // 指定图表的配置项和数据
      var option = {
        title: { // 本例把title设置成了空
          text: this.textname
        },
        tooltip: {
          trigger: 'item' // 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          // formatter: '{a} <br/> {b}:{c}({d}%)'
        },
        legend: {
          top: '2%',
          left: 'center'
        },
        series: [{ // 每一条线的数据
          name: this.seriesname, // 系列名称，用于tooltip的显示，legend 的图例筛选
          type: 'pie', // 类型为折线图
          center: ['50%', '45%'], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
          radius: ['15%', '60%'], // 饼图的半径，数组的第一项是内半径，第二项是外半径。[ default: [0, '75%'] ]
          avoidLabelOverlap: true, // 是否启用防止标签重叠策略，默认开启,环形图中需要强制所有标签放在中心位置设为false
          label: { // 饼图图形上的文本标签
            normal: {
              show: true, // 是否显示标签
              // 标签的位置。'outside'饼图扇区外侧，通过视觉引导线连到相应的扇区。'inside','inner' 同 'inside',饼图扇区内部。'center'在饼图中心位置。
              position: 'outside',
              // 显示的标签的内容
              // a（系列名称），b（数据项名称），c（数值）, d（百分比）
              formatter: '{a},{b}:{c}({d}%)'
            },
            emphasis: { // 鼠标放在圆环上显示的标签样式
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: true, // 是否显示引导线
              length: 10, // 百分比引导线
              length2: 20 // 视觉引导项第二段的长度。
            }
          },
          data: this.seriesdata
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
