<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
    	<!-- 日期范围搜索  -->
	    <el-date-picker v-model="query.applicationsDateStart" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>&nbsp;-
	    <el-date-picker v-model="query.applicationsDateEnd" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>
      <!-- 交易类型 -->
      <el-select v-model="query.tradTypeId" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in tradTypeId" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <!-- 记账类型 -->
      <el-select v-model="query.tallyTypeId" placeholder="记账类型" class="filter-item">
      	<el-option 
      		v-for="(item, index) in tallyTypeList" 
      		:key="item.id" 
      		:lable="item.id" 
      		:value="item.label">
      	</el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','JOURNALACCOUNTOFCAPITAL_ALL','JOURNALACCOUNTOFCAPITAL_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="tradDate" label="交易日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.tradDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tradTypeId" label="交易类型"/>
      <el-table-column prop="money" label="金额"/>
      <el-table-column prop="tallyTypeId" label="记账类型"/>
      <el-table-column prop="urrentBalance" label="当前账户余额"/>
      <el-table-column prop="receiptPaymentName" label="收付款人名称"/>
      <el-table-column prop="type" label="类型"/>
      <el-table-column prop="backNum" label="银行账号"/>
      <el-table-column prop="backAccount" label="银行户名"/>
      <el-table-column v-if="checkPermission(['ADMIN','JOURNALACCOUNTOFCAPITAL_ALL','JOURNALACCOUNTOFCAPITAL_EDIT','JOURNALACCOUNTOFCAPITAL_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','JOURNALACCOUNTOFCAPITAL_ALL','JOURNALACCOUNTOFCAPITAL_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','JOURNALACCOUNTOFCAPITAL_ALL','JOURNALACCOUNTOFCAPITAL_DELETE']"
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
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/journalAccountOfCapital'
import { parseTime } from '@/utils/index'
import { getDictMap } from '@/api/dictDetail'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      tradTypeId: [
        { key: '0', value: '收入'},
        { key: '1', value: '支出'}
      ],
      tallyTypeList: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getTallyType()
    })
  },
 
  methods: {
    parseTime,
    checkPermission,
    getTallyType() {
      getDictMap('account_type').then(res => {
        this.tallyTypeList = res.account_type
      }).catch(err => {
        console.log(err.response.data.message)
      })
    },
    beforeInit() {
      this.url = 'api/journalAccountOfCapital'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      //查询的值
      const applicationsDateStart = query.applicationsDateStart
      const applicationsDateEnd = query.applicationsDateEnd
      //转化日期格式
      if (applicationsDateStart){
        this.params['applicationsDateStart'] = parseDate(applicationsDateStart)
      }
      if (applicationsDateEnd){
        this.params['applicationsDateEnd'] = parseDate(applicationsDateEnd)
      }
      //交易类型id
      const tallyTypeId = query.tradTypeId
      const type = query.type
      const value = query.value
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
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        tradDate: data.tradDate,
        tradTypeId: data.tradTypeId,
        money: data.money,
        tallyTypeId: data.tallyTypeId,
        urrentBalance: data.urrentBalance,
        receiptPaymentName: data.receiptPaymentName,
        type: data.type,
        backNum: data.backNum,
        backAccount: data.backAccount
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
