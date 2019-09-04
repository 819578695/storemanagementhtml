<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.deptName" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts" />
    <!--表单组件-->
    <accountForm ref="accountform" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="主键"/>
      <el-table-column prop="rentContractName" label="合同名称"/>
      <el-table-column prop="basicsParkName" label="档口名称"/>
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="siteRent" label="场地租金"/>
      <el-table-column prop="waterRent" label="水费"/>
      <el-table-column prop="electricityRent" label="电费"/>
      <el-table-column prop="propertyRent" label="物业费"/>
      <el-table-column prop="taxCost" label="税赋成本"/>
      <el-table-column prop="otherRent" label="其他费用"/>
      <el-table-column prop="paymentTypeName" label="交易类型"/>
      <el-table-column prop="createTime" label="创建时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款信息">
        <template slot-scope="scope">
          <span style="cursor: pointer;" @click="findReceiptPaymentAccount(scope.row.receiptPaymentAccountId)">查看</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PARKCOST_ALL','PARKCOST_EDIT','PARKCOST_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_DELETE']"
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
import { receiptPaymentAccountById } from '@/api/receiptPaymentAccount'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/parkCost'
import { parseTime } from '@/utils/index'
import { parseDate } from '@/utils/index'
import eForm from './form'
import accountForm from './accountform'
import store from '@/store'
export default {
  components: { eForm,accountForm},
  mixins: [initData,initDict],
  data() {
    return {
      delLoading: false,
      deptId:''
    }
  },
  created() {
    this.$nextTick(() => {
      //将用户的上级部门id带入后台查询
      store.dispatch('GetInfo').then(res => {
        this.deptId=res.deptId
        this.init()
      })
      // 加载数据字典
      this.getDict('transaction_mode')
    })
  },
  methods: {
    parseTime,
    parseDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/parkCost'
      const sort = 'id,desc'
      const query = this.query
      const deptName = query.deptName
       //最高级别查询所有数据
       if(this.deptId==1){
         this.params = { page: this.page, size: this.size, sort: sort}
       }
       else{
          this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId }
       }
       if (deptName) { this.params['deptName'] = deptName }
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
      this.$refs.form.getReceiptPaymentAccountList() //初始化加载下拉查询数据
    },
    edit(data) {
      this.isAdd = false
       this.$refs.form.getReceiptPaymentAccountList() //初始化加载下拉查询数据
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        basicsPark:{
          id:data.parkId
        },
        rentContract:{
          id:data.rentContractId
        },
        siteRent: data.siteRent,
        waterRent: data.waterRent,
        electricityRent: data.electricityRent,
        propertyRent: data.propertyRent,
        taxCost: data.taxCost,
        otherRent: data.otherRent,
        createTime: data.createTime,
        dictDetail: {
          id:data.paymentType
        },
        receiptPaymentAccount: {
          id:data.receiptPaymentAccountId
        }
      }
      _this.dialog = true
    },
    //查看收付款信息详情
    findReceiptPaymentAccount(id){
      if(id!=null||id!=''){
        const _this = this.$refs.accountform
        receiptPaymentAccountById(id).then(res => {
           _this.dialog= true
          _this.form= res
         }).catch(err => {

         })
      }
    }
  }
}
</script>

<style scoped>

</style>
