<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','LEASECONTRACT_ALL','LEASECONTRACT_CREATE']"
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
      <el-table-column prop="id" label="主键"/>
      <el-table-column prop="contractNo" label="合同编号"/>
      <el-table-column prop="tenementId" label="租户id"/>
      <el-table-column prop="deptId" label="部门id"/>
      <el-table-column prop="stallId" label="档口id"/>
      <el-table-column prop="contractName" label="合同名称"/>
      <el-table-column prop="startDate" label="起止日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="截止日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rentFreePeriod" label="免租期"/>
      <el-table-column prop="deposit" label="保证金"/>
      <el-table-column prop="unpaidExpenses" label="未缴费用"/>
      <el-table-column prop="paymentedExpenses" label="已缴费用"/>
      <el-table-column prop="contractAmount" label="合同总金额"/>
      <el-table-column prop="fileName" label="文件名"/>
      <el-table-column v-if="checkPermission(['ADMIN','LEASECONTRACT_ALL','LEASECONTRACT_EDIT','LEASECONTRACT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','LEASECONTRACT_ALL','LEASECONTRACT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','LEASECONTRACT_ALL','LEASECONTRACT_DELETE']"
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
import { del } from '@/api/leaseContract'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/leaseContract'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
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
        contractNo: data.contractNo,
        tenementId: data.tenementId,
        deptId: data.deptId,
        stallId: data.stallId,
        contractName: data.contractName,
        startDate: data.startDate,
        endDate: data.endDate,
        rentFreePeriod: data.rentFreePeriod,
        deposit: data.deposit,
        unpaidExpenses: data.unpaidExpenses,
        paymentedExpenses: data.paymentedExpenses,
        contractAmount: data.contractAmount,
        fileName: data.fileName
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
