<template>
  <div class="app-container">
  	<!--<eForm ref="form" :is-add="isAdd"/>-->
  	<el-row :gutter="10">
  		<el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
        	<div slot="header" class="clearfix">
        		<span>账户维护</span>
        	</div>
        	<!--工具栏-->
			    <div class="head-container">
			      <!-- 搜索 -->
			      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" v-permission="['ADMIN','ACCOUNT_SELECTDEPT']"/>
			      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px" v-permission="['ADMIN','ACCOUNT_SELECTDEPT']">
			        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
			      </el-select>
			      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery" v-permission="['ADMIN','ACCOUNT_SELECTDEPT']">搜索</el-button>
			      <div style="display: inline-block;margin: 0px 2px;">
		      </div>
			    </div>
			    <!--表格渲染-->
			    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @current-change="handleCurrentChange">
			      <el-table-column prop="deptName" label="园区名称"/>
			      <el-table-column prop="remaining" label="余额"/>
			    </el-table>
			    <!--分页组件-->
			    <el-pagination
			      :total="total"
			      style="margin-top: 8px;"
			      :current-page="page + 1"
			      layout="total, prev, pager, next, sizes"
			      @size-change="sizeChange"
			      @current-change="pageChange"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
      	<maintainDetail ref="maintainDetail"/>
      </el-col>
  	</el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/maintain'
import maintainDetail from '../maintainDetail/index'
import store from '@/store'
//import eForm from './form'
export default {
  components: { maintainDetail  },
  mixins: [initData],
  data() {
    return {
      deptId: '',
      delLoading: false,
      queryTypeOptions: [
        { key: 'deptName', display_name: '园区名称' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      store.dispatch('GetInfo').then(res => {
        this.deptId=res.deptId
        this.init()
      })
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/maintain'
      const query = this.query
      const type = query.type
      const value = query.value

      //最高级别查询所有数据
      if(this.deptId==1){
        this.params = { page: this.page, size: this.size}
      }
      else{
         this.params = { page: this.page, size: this.size, deptId: this.deptId }
      }
      if (type && value) { this.params[type] = value }
			if(this.$refs.maintainDetail){
      	this.$refs.maintainDetail.data=[]
      	this.$refs.maintainDetail.deptId=''
      }
      return true
    },
    /*subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },*/
    handleCurrentChange(val) {
    	if(val){
    		this.$refs.maintainDetail.deptId = val.deptId
    		this.$refs.maintainDetail.init()
    	}
    },
/*    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        deptId: data.deptId,
        remaining: data.remaining,
        maintainDetail: data.maintainDetail
      }
      _this.dialog = true
    }*/
  }
}
</script>

<style scoped>

</style>
