<template>
	<div>
		<el-row :gutter="10">
  		<el-col :xs="24" :sm="24" :md="8" :lg="8" >
		<el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>交易类型详情</span>   
            <el-button
              round
	          v-permission="['ADMIN','ACCOUNT_ALL','ACCOUNT_ALLOT']"
	          class="filter-item"
	          size="mini"
	          type="primary"
	          icon="el-icon-sort"
	          :style="{ display: visibleCancel }"
	          @click="add">资金调拨</el-button>
          </div>
          <div v-if=" deptId === '' ">
			<div class="my-code">点击查看详情</div>
		</div>
		<div v-else>
		<eForm ref="form" :is-add="isAdd" :init="init"/>
		<!--表格渲染-->
	    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @current-change="handleCurrentChange">
	      <el-table-column prop="deptName" label="所属园区"/>
	      <el-table-column prop="tradTypeLabel" label="交易账户类型"/>
	      <el-table-column prop="remaining" label="账户余额"/>
	    </el-table>
		</div>
        </el-card>
        </el-col>
        
        <el-col :xs="24" :sm="24" :md="16" :lg="16" >
			<accountDetail ref="accountDetail"/>
        </el-col>
  	</el-row>
	</div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/maintarinDetail'
import { parseTime } from '@/utils/index'
import { getDictMap } from '@/api/dictDetail'
import accountDetail from '../accountDetail/index'
import eForm from './form'
export default {
  components: { eForm , accountDetail },
  mixins: [initData],
  data() {
    return {
      tradType: [],
      delLoading: false,
      deptId:'',
      maintainId:'',
      deptName:'',
      datas:[],
      visibleCancel: 'none',   //显示
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
      this.url = 'api/maintarinDetail'
      this.params = {deptId: this.deptId }
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
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      this.$refs.form.maintainId = this.maintainId
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        tradType: {id : data.tradTypeId },
        transactionDate: data.transactionDate
      }
      _this.dialog = true
    },*/
   	add() {
   	  this.$refs.form.getFundFlowing(this.deptId)
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    getType(){
	  getDictMap('transaction_mode').then(res => {
	  	this.tradType = res.transaction_mode
	  }).catch(err => {
	    console.log(err.response.data.message)
	  })
   },
   handleCurrentChange(val) {
   	this.$refs.accountDetail
		if(val){
			this.$refs.accountDetail.detailId = val.id
    		this.$refs.accountDetail.init()
    	}
    }
  }
}
</script>

<style scoped>

</style>
