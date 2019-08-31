<template>
  <div class="app-container">
  	<!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
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
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toSelect">搜索</el-button>
			</div>
      <el-col :xs="28" :sm="28" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>园区收入</span>
          </div>
			    <!--表格渲染-->
			    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
			      <el-table-column prop="propertyRent" label="物业费"/>
			      <el-table-column prop="waterElectricityRent" label="水费"/>
			      <el-table-column prop="sanitationRent" label="卫生费"/>
			      <el-table-column prop="" label="管理费"/>
			      <el-table-column prop="liquidatedRent" label="违约金"/>
			      <el-table-column prop="lateRent" label="滞纳金"/>
			      <el-table-column prop="" label="停车费"/>
			      <el-table-column prop="groundPoundRent" label="地磅费"/>
			      <el-table-column prop="houseRent" label="房租"/>
			      <el-table-column prop="" label="电费"/>
			      <el-table-column prop="createTime" label="时间">
			      	<template slot-scope="scope">
			          <span>{{ parseDate(scope.row.createTime) }}</span>
			        </template>
			      </el-table-column>
			    </el-table>
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
          </div>
			    <pevenueIndex ref="pevenueIndex"/>
			  </el-card>
			</el-col>
		</el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import eForm from './form'
import pevenueIndex from './pevenueIndex'
import { parseDate } from '@/utils/index'
export default {
  components: {pevenueIndex, eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      depts: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
  	parseDate,
    checkPermission,
    beforeInit() {
  		this.url = 'api/parkPevenue'
      const sort = 'id,desc'
      const query = this.query
  		this.params = { page: this.page, size: this.size, sort: sort, }
  		
  		//查询的值
      const applicationsDateStart = query.applicationsDateStart
      const applicationsDateEnd = query.applicationsDateEnd
      //查询部门
      const deptId = query.deptId
      //获取部门信息
      this.depts = JSON.parse(sessionStorage.getItem("depts"))
      
	  	return true
    },
    toSelect(){
    	this.$refs.pevenueIndex.getType();
    	this.init()
    }
    
  }
}
</script>

<style scoped>

</style>
