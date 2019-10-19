<template>
  <div class="app-container">
   <el-dialog ref="paymentIndex" :append-to-body="true" title="付款信息详情" :visible.sync="dialog"  width="1000px">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
           v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dictMap="dictMap" :findbyProcurementId="findbyProcurementId"/>
    <!--表格渲染-->
    <el-table  v-loading="loading"  :data="data" size="small" style="width: 100%;">
      <el-table-column prop="actualPaymentAmount" label="实际付款金额" width="100"/>
      <el-table-column prop="actualPaymentDate" label="实际付款日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.actualPaymentDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentTypeName" label="支付方式"/>
      <el-table-column prop="receiptPaymentAccountName" label="收付款账户"/>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentDescription" label="付款说明"/>
      <el-table-column prop="paymentRatio" label="付款比例"/>
      <el-table-column prop="dueDate" label="应付日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.dueDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_EDIT','PROCUREMENTINFORMATION_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_DELETE']"
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
    <!-- <!--分页组件
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      :current-page="page + 1"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/> -->
      </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/procurementPaymentInfo'
import { parseTime,parseDate } from '@/utils/index'
import eForm from './paymentForm'
import { getProcurementInformationAll } from '@/api/procurementInformation' //查询所有的收付款信息
import { findByProcurementPaymentInfoById } from '@/api/procurementPaymentInfo' //查询采购收付款信息
import store from '@/store'
export default {
  components: { eForm },
  mixins: [initData,initDict],   // 初始化数据
  data() {
    return {
      delLoading: false,
      dialog:false,
      data:[],
      procurementId:'',
      loading:true,
      time: 170
    }
  },
  created() {
       this.getDictMap('transaction_mode')
  },
  methods: {
    parseTime,
    parseDate,
    checkPermission,
    findbyProcurementId(){
      this.loading = true
       findByProcurementPaymentInfoById(this.procurementId).then(res => {
          this.data=res.content
         setTimeout(() => {
          this.loading = false
         }, this.time)
       }).catch(err => {
         this.loading = false
       })
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
        this.findbyProcurementId()

      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      this.$refs.form.form.procurementInformation.id  = this.procurementId
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.dictId= data.paymentTypeId//保存支付类型id
      _this.receiptPaymentAccountId= data.receiptPaymentAccountId//保存收付款信息Id
      _this.findbyReceiptPaymentAccount(data.paymentTypeId) //根据支付方式查询账户
      _this.form = {
        id: data.id,
        actualPaymentAmount: data.actualPaymentAmount,
        actualPaymentDate: data.actualPaymentDate,
        paymentDescription: data.paymentDescription,
        paymentRatio: data.paymentRatio,
        dueDate: data.dueDate,
        dictDetail:{
          id:data.paymentTypeId
        },
        receiptPaymentAccount: {
          id:data.receiptPaymentAccountId
        },
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
