<template>
	<div>
		<el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>账户详情</span>
          </div>
	    	<!-- 搜索 -->
	    	<el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" :style="{ display: visibleCancel }"/>
		    <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px" :style="{ display: visibleCancel }">
		      <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
		    </el-select>
	  		<el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery" :style="{ display: visibleCancel }">搜索</el-button>
			<el-button
	          v-permission="['ADMIN','ACCOUNTDETAIL_ALL','ACCOUNTDETAIL_ADD']"
	          class="filter-item"
	          size="mini"
	          type="primary"
	          icon="el-icon-plus"
	          :style="{ display: visibleCancel }"
	          @click="add">新增</el-button>
          <div v-if=" detailId === '' ">
			<div class="my-code">点击查看详情</div>
		  </div>
		<div v-else>
		<eForm ref="form" :is-add="isAdd" :init="init"/>
		
		<!--表格渲染-->
	    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
	      <el-table-column prop="name" label="名称"/>
	      <el-table-column prop="remaining" label="金额"/>
	      <el-table-column prop="accountName" label="账户名称/开户人"/>
	      <el-table-column prop="accountNum" label="账号"/>	      
	      <el-table-column prop="bankName" label="开户行"/>
	      <el-table-column v-if="checkPermission(['ADMIN','ACCOUNTDETAIL_ALL','ACCOUNTDETAIL_EDIT','ACCOUNTDETAIL_DELETE'])" label="修改" width="150px" align="center">
	        <template slot-scope="scope">
	          <el-button v-permission="['ADMIN','ACCOUNTDETAIL_ALL','ACCOUNTDETAIL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
	          <el-popover
	            v-permission="['ADMIN','ACCOUNTDETAIL_ALL','ACCOUNTDETAIL_DELETE']"
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
		</div>
        </el-card>
	</div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/receiptPaymentAccount'
import { parseTime } from '@/utils/index'
import { getDictMap } from '@/api/dictDetail'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      tradType: [],
      delLoading: false,
      detailId:'',
      deptName:'',
      visibleCancel: 'none',   //显示
      //查询类型
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'bankName', display_name: '开户行' },
        { key: 'accountName', display_name: '账户名称/开户人' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.getType()
    })
	this.loading = false
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
    	if(this.detailId === ''){
    		this.visibleCancel = 'none';
    	}else{
    		this.visibleCancel = '';
    	}
      this.url = 'api/receiptPaymentAccount'
      let query = this.query
      let type = query.type
      let value = query.value
      this.params = { page: this.page, size: this.size, detailId: this.detailId }
      if (type && value) { this.params[type] = value }
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
      this.$refs.form.form.detailId = this.detailId
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        remaining: data.remaining,
      	accountName: data.accountName,
        accountNum: data.accountNum,
        bankName: data.bankName,
        detailId: data.detailId,
        name: data.name,
      }
      _this.dialog = true
    },
    getType(){
	  getDictMap('transaction_mode').then(res => {
	  	this.tradType = res.transaction_mode
	  }).catch(err => {
	    console.log(err.response.data.message)
	  })
   },
  }
}
</script>

<style scoped>

</style>
