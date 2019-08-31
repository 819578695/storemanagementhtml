<template>
  <div class="app-container">
  	<eForm ref="form" :is-add="isAdd"/>
  	<el-row :gutter="10">
  		<el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <el-card class="box-card">
        	<div slot="header" class="clearfix">
        		<span>账户维护</span>
        	</div>
        	<!--工具栏-->
			    <div class="head-container">
			      <!-- 搜索 -->
			      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
			      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
			        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
			      </el-select>
			      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
			      <div style="display: inline-block;margin: 0px 2px;">
		        <el-button
		          v-permission="['ADMIN','FINANCEMAINTAIN_ALL','FINANCEMAINTAIN_CREATE']"
		          class="filter-item"
		          size="mini"
		          type="primary"
		          icon="el-icon-plus"
		          @click="add">新增</el-button>
		      </div>
			    </div>
			    <!--表格渲染-->
			    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @current-change="handleCurrentChange">
			      <el-table-column prop="deptName" label="园区名称"/>
			      <el-table-column prop="remaining" label="余额"/>
			      <el-table-column v-if="checkPermission(['ADMIN','FINANCEMAINTAIN_ALL','FINANCEMAINTAIN_EDIT','FINANCEMAINTAIN_DELETE'])" label="操作" width="150px" align="center">
			        <template slot-scope="scope">
			          <el-button v-permission="['ADMIN','FINANCEMAINTAIN_ALL','FINANCEMAINTAIN_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
			          <el-popover
			            v-permission="['ADMIN','FINANCEMAINTAIN_ALL','FINANCEMAINTAIN_DELETE']"
			            :ref="scope.row.id"
			            placement="top"
			            width="180">
			            <p>确定删除本条数据吗？</p>
			            <div style="text-align: right; margin: 0">
			              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
			              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
			            </div>
			            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
			          </el-popover>
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
			      @current-change="pageChange"/>
        </el-card>	
      </el-col>
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>账户详情</span>
            <el-button
              v-if="checkPermission(['ADMIN','FINANCEMAINTARINDETAIL_ALL','FINANCEMAINTARINDETAIL_EDIT','FINANCEMAINTARINDETAIL_DELETE']) && this.$refs.financeMaintarinDetail && this.$refs.financeMaintarinDetail.deptName"
              class="filter-item"
              size="mini"
              style="float: right;padding: 4px 10px"
              type="primary"
              icon="el-icon-plus"
              @click="$refs.maintainDetail.$refs.form.dialog = true;$refs.maintainDetail.isAdd = true">新增</el-button>
          </div>
          <maintainDetail ref="maintainDetail"/>
        </el-card>
      </el-col>
  	</el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/financeMaintain'
import maintainDetail from '../maintainDetail/index'
import eForm from './form'
export default {
  components: { maintainDetail , eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'deptId', display_name: '园区名称' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/financeMaintain'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      if(this.$refs.maintainDetail){
      	this.$refs.maintainDetail.data=[]
      	this.$refs.maintainDetail.deptId=''
      }
      return true
    },
    subDelete(id) {
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
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    handleCurrentChange(val) {
    	if(val){
    		this.$refs.maintainDetail.deptName = val.deptName
    		this.$refs.maintainDetail.maintainId = val.deptId
    		this.$refs.maintainDetail.init()
    	}
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        deptId: data.deptId,
        remaining: data.remaining,
        maintainDetail: data.maintainDetail
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
