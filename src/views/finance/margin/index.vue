<template>
  <div class="app-container">
  	<!--表单组件-->
    <el-row :gutter="10">
    	<!--工具栏-->
	    <div class="head-container">
	    	<!-- 日期范围搜索  -->
		    <el-date-picker v-model="query.applicationsDateStart" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>&nbsp;-
		    <el-date-picker v-model="query.applicationsDateEnd" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>
	    	<!-- 搜索 -->
        <el-select v-model="query.deptId" clearable placeholder="请选择园区" class="filter-item" style="width: 130px">
          <el-option
          	v-for="item in depts"
          	:key="item.id"
          	:label="item.label"
          	:value="item.id"/>
        </el-select>
      	<el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
			</div>
      <el-col :xs="28" :sm="28" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>园区收入</span>
            <span >合计:{{getSum}}</span>
            <span style="color: red;font-weight: 800;font-size: 20px;">毛利:{{gross}}</span>
          </div>
			    <!--表格渲染-->
			    <el-table
			    	v-loading="loading"
			    	:data="pevenues"
			    	size="small"
			    	style="width: 100%;"
			    	:summary-method="getSummaries"
			    	show-summary>
			    	<el-table-column prop="createTime" label="时间">
			      	<template slot-scope="scope">
			          <span>{{ parseDate(scope.row.createTime) }}</span>
			        </template>
			      </el-table-column>
			      <el-table-column prop="propertyRent" label="物业费"/>
			      <el-table-column prop="waterRent" label="水费"/>
			      <el-table-column prop="sanitationRent" label="卫生费"/>
			      <el-table-column prop="managementRent" label="管理费"/>
			      <el-table-column prop="liquidatedRent" label="违约金"/>
			      <el-table-column prop="lateRent" label="滞纳金"/>
			      <el-table-column prop="parkingRent" label="停车费"/>
			      <el-table-column prop="groundPoundRent" label="地磅费"/>
			      <el-table-column prop="houseRent" label="房租"/>
			      <el-table-column prop="electricityRent" label="电费"/>
			      <el-table-column prop="arrersRent" label="欠款"/>
			    </el-table>
			    <!--<div>
			    	<span style="color: red;font-weight: 800;font-size: 20px;">收入合计：</span><span style="font-weight: 800;font-size: 20px;" id="incomeTotal">0</span>
            <span style="color: red;font-weight: 800;font-size: 20px;">成本合计：</span><span style="font-weight: 800;font-size: 20px;" id="costTotal">0</span>
            <span style="color: red;font-weight: 800;font-size: 20px;">毛利合计：</span><span style="font-weight: 800;font-size: 20px;" id="marginTotal">0</span>
			    </div>-->
			    <!--分页组件-->
			    <el-pagination
			      :total="total"
			      style="margin-top: 8px;"
			      :current-page="page + 1"
			      layout="total, prev, pager, next, sizes"
			      @size-change="sizeChange"
			      @current-change="pageChange">
			    </el-pagination>
			  </el-card>
			</el-col>
			<!-- 右侧 -->
			<el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>园区成本</span>
            <span>合计:{{this.costsum}}</span>
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
    }
  },
  created() {
    this.$nextTick(() => {
      this.financeInit()
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
  		this.params = { page: this.page, size: this.size, sort: sort, }
  		//查询的值
      const applicationsDateStart = query.applicationsDateStart
      const applicationsDateEnd = query.applicationsDateEnd
      //查询部门
      const deptId = query.deptId
      //获取部门信息
      this.depts = JSON.parse(sessionStorage.getItem("depts"))

      if (deptId) {this.params['deptId'] = deptId }
      //转化日期格式
      if (applicationsDateStart){
        this.params['tradDateStart'] = parseDate(applicationsDateStart)
      }
      if (applicationsDateEnd){
        this.params['tradDateEnd'] = parseDate(applicationsDateEnd)
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
      }
    }
  }
</script>

<style scoped>

</style>
