<template>
	<div>
		<div v-if="deptName === ''">
			<div class="my-code">点击资金账户查看详情</div>
		</div>
		<div v-else>
			<!--工具栏-->
	    <div class="head-container">
	      <!-- 新增 -->
	      <div style="display: inline-block;margin: 0px 2px;">
	        <el-button
	          v-permission="['ADMIN','FINANCEMAINTARINDETAIL_ALL','FINANCEMAINTARINDETAIL_CREATE']"
	          class="filter-item"
	          size="mini"
	          type="primary"
	          icon="el-icon-plus"
	          @click="add">新增</el-button>
	      </div>
	    </div>
			<eForm ref="form" :is-add="isAdd"/>
			<!--表格渲染-->
	    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
	    	<el-table-column label="所属园区">
	          <template slot-scope="scope">
	            {{ deptName }}
	          </template>
	        </el-table-column>
	      <el-table-column prop="tradTypeLabel" label="交易账户类型"/>
	      <el-table-column prop="remaining" label="余额"/>
	      <el-table-column prop="transactionDate" label="最近交易日期">
	        <template slot-scope="scope">
	          <span>{{ parseTime(scope.row.transactionDate) }}</span>
	        </template>
	      </el-table-column>
	      <el-table-column v-if="checkPermission(['ADMIN','FINANCEMAINTARINDETAIL_ALL','FINANCEMAINTARINDETAIL_EDIT','FINANCEMAINTARINDETAIL_DELETE'])" label="修改" width="150px" align="center">
	        <template slot-scope="scope">
	          <el-button v-permission="['ADMIN','FINANCEMAINTARINDETAIL_ALL','FINANCEMAINTARINDETAIL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
	          <!--<el-popover
	            v-permission="['ADMIN','FINANCEMAINTARINDETAIL_ALL','FINANCEMAINTARINDETAIL_DELETE']"
	            :ref="scope.row.id"
	            placement="top"
	            width="180">
	            <p>确定删除本条数据吗？</p>
	            <div style="text-align: right; margin: 0">
	              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
	              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
	            </div>
	            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
	          </el-popover>-->
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
	</div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/financeMaintarinDetail'
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
      deptName:'',
      maintainId:'',
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
      this.url = 'api/financeMaintarinDetail'
      this.params = { page: this.page, size: this.size, deptName: this.deptName }
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
      this.$refs.form.maintainId = this.maintainId
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        tradTypeId: data.tradTypeId,
        remaining: data.remaining,
        transactionDate: data.transactionDate
      }
      _this.dialog = true
    },
    getType(){
	  getDictMap('transaction_mode').then(res => {
	  	this.tradType = res.transaction_mode
	  }).catch(err => {
	    console.log(err.response.data.message)
	  })
    }
  }
}
</script>

<style scoped>

</style>
