<template>
  <div class="app-container">
  	<!--表单组件-->
    <el-row :gutter="10">
      <!--档口数据-->
      <el-col :xs="5" :sm="4" :md="3" :lg="3" :xl="3">
        <el-tree 
        	:data="stalls" 
        	:props="defaultProps" 
        	:expand-on-click-node="false" 
        	default-expand-all @node-click="handleNodeClick"/>
      </el-col>
    	<!--工具栏-->
	    <div class="head-container">
	    	<!-- 日期范围搜索  -->
		    <el-date-picker v-model="query.applicationsDateStart" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>&nbsp;-
		    <el-date-picker v-model="query.applicationsDateEnd" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>
	    	<!-- 搜索 -->
      	<el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
			</div>
			<div >
            <span style="font-size: 20px;">收入:{{getSum}}</span>&emsp;&emsp;
            <span style="font-size: 20px;">支出:{{this.costsum}}</span>&emsp;&emsp;
            <span style="color: red;font-size: 20px;">毛利:{{gross}}</span>
			</div>
      <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
        	<div slot="header" class="clearfix">
        		<span>收入</span>
        	</div>
			    <!--表格渲染-->
			    <el-table
			    	v-loading="loading"
			    	:data="data"
			    	size="small"
			    	style="width: 100%;"
			    	:summary-method="getSummaries"
			    	show-summary>
			      <el-table-column prop = "tallyLabe" label="收入类型"/>
			      <el-table-column prop = "money" label="金额"/>
			    </el-table>
			  </el-card>
			</el-col>
			<!-- 右侧 -->
			<el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card class="box-card">
        	<div slot="header" class="clearfix">
        		<span>园区支出</span>
        	</div>
			    <pevenueIndex ref="pevenueIndex"  v-on:costSum="getCostSum"/>
			  </el-card>
			</el-col>
		</el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import pevenueIndex from './pevenueIndex'
import { parseDate } from '@/utils/index'
import { getMarginTree } from '@/api/margin'
export default {
  components: {pevenueIndex },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      depts: [],
      sum : [],
      costsum:0,
      pevenuesSum:0,
      //毛利
      gross :0,
      //园区-档口信息
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      //获取部门-档口
      stalls: [],
    }
  },
  created() {
    this.getStall()
    this.$nextTick(() => {
      this.marginInit()
    })
  },
  computed: {
  	getSum :function() {
  		var pevenuesSum =0;
      	this.sum.forEach(item =>{
      		if(!isNaN(item)){
      			pevenuesSum = parseFloat(pevenuesSum+item)
      		}
      	})
      	this.pevenuesSum=pevenuesSum
      	return pevenuesSum;
  	}
  },
  methods: {
  	parseDate,
    checkPermission,
    beforeInit() {
			this.url = 'api/margin'
      const sort = 'createTime,desc'
      const query = this.query
			const houseId = this.houseId
      const deptId = JSON.parse(sessionStorage.getItem("user")).deptId
  		this.params = {sort: sort, deptId: deptId, houseId: houseId}
  		//查询的值
      const applicationsDateStart = query.applicationsDateStart
      const applicationsDateEnd = query.applicationsDateEnd
      //获取部门信息
      this.depts = JSON.parse(sessionStorage.getItem("depts"))
			//查询部门
       if(this.deptId!=''){
       		query.deptId = this.deptId
       }
      if (query.deptId!=null) {this.params['deptId'] = query.deptId }
      //转化日期格式
      if (applicationsDateStart){
        this.params['createTimeStart'] = parseDate(applicationsDateStart)
      }
      if (applicationsDateEnd){
        this.params['createTimeEnd'] = parseDate(applicationsDateEnd)
      }
	  	return true
    },
    getSummaries(param){
    	const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index];
          } else {
            sums[index] = '--';
          }
        });
        this.sum = sums
        return sums;
      },
      getCostSum(data){
      	this.costsum = data
      	this.gross = this.pevenuesSum - this.costsum
      },
      getStall(){
  	  const user = JSON.parse(sessionStorage.getItem("user"))
  	  const deptId =user.deptId
        //查询部门
        getMarginTree().then(res => {
        	this.stalls = res
        })
      },
      handleNodeClick(data) {
      	if(data.children != null){
      		this.deptId = data.id
      		this.houseId = undefined
      	}else {
      		this.deptId = data.deptId
          this.houseId = data.id
        }
        this.marginInit()
      }
    }
  }
</script>

<style scoped>

</style>
