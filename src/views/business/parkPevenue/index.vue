<template>
  <div class="app-container">
    <!--工具栏-->
    <div>
      <!-- 搜索  -->
        <el-date-picker v-model="query.createDateStart" type="date" placeholder="选择日期"></el-date-picker>&nbsp;-
        <el-date-picker v-model="query.createDateEnd" type="date" placeholder="选择日期"></el-date-picker>
        <el-input v-model="query.houseNumber" clearable placeholder="输入编号" style="width: 200px;" />
        <!-- <el-select v-model="query.receiptPaymentAccountId"  placeholder="请选择档口编号">
          <el-option
            v-for="(item, index) in receiptPaymentAccountList"
            :key="item.name"
            :label="item.name"
            :value="item.id"
            class="filter-item" @keyup.enter.native="toQuery"
            />
        </el-select> -->
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"  />
    <!--表单组件-->
    <accountForm ref="accountform" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="basicsParkName" label="园区id"/>
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="houseNumber" label="档口编号"/>
      <el-table-column prop="houseRent" label="房租"/>
      <el-table-column prop="propertyRent" label="物业费"/>
      <el-table-column prop="waterElectricityRent" label="水电费"/>
      <el-table-column prop="sanitationRent" label="卫生费"/>
      <el-table-column prop="liquidatedRent" label="违约金"/>
      <el-table-column prop="lateRent" label="滞纳金"/>
      <el-table-column prop="groundPoundRent" label="地磅费"/>
      <el-table-column prop="arrersRent" label="欠款金额"/>
      <el-table-column prop="paymentTypeName" label="交易类型"/>
      <el-table-column label="收款信息">
        <template slot-scope="scope">
          <span @click="findReceiptPaymentAccount(scope.row.receiptPaymentAccountId)">查看</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EDIT','PARKPEVENUE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_DELETE']"
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
      <el-table-column prop="creaeTime" label="合计">
        <template slot-scope="scope">
          <span>{{ parseInt(scope.row.houseRent+scope.row.propertyRent+scope.row.waterElectricityRent+scope.row.sanitationRent+scope.row.lateRent+scope.row.groundPoundRent+scope.row.arrersRent) }}</span>
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
import { del } from '@/api/parkPevenue'
import { parseTime } from '@/utils/index'
import { parseDate } from '@/utils/index'          //格式化日期
import eForm from './form'
import accountForm from './accountform'
import store from '@/store'
export default {
  components: { eForm,accountForm },
  mixins: [initData,initDict],
  data() {
    return {
      deptId:'',
      delLoading: false,
    }
  },
  created() {
    this.$nextTick(() => {
     //将用户的上级部门id带入后台查询
     store.dispatch('GetInfo').then(res => {
       this.deptId=res.deptPid
       this.init()
     })
      this.getDict('transaction_mode')
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.receiptPaymentAccountList=this.$refs.form.receiptPaymentAccountList
      this.url = 'api/parkPevenue'
      const sort = 'id,desc'
      const query = this.query
      //获取query搜索的值
      const houseNumber = query.houseNumber
      const supplierName = query.supplierName
      const createDateStart = query.createDateStart
      const createDateEnd = query.createDateEnd
      this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId}
      //档口编号
      if (houseNumber) { this.params['houseNumber'] = houseNumber }
      //转化日期格式
      if (createDateStart){
        this.params['createTimeStart'] = parseDate(createDateStart)
      }
      if (createDateEnd){
        this.params['createTimeEnd'] = parseDate(createDateEnd)
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
	  this.$refs.form.getReceiptPaymentAccountList() //初始化加载下拉查询数据
    },
    edit(data) {
      this.isAdd = false
	  this.$refs.form.getReceiptPaymentAccountList() //初始化加载下拉查询数据
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        houseRent: data.houseRent,
        propertyRent: data.propertyRent,
        waterElectricityRent: data.waterElectricityRent,
        sanitationRent: data.sanitationRent,
        liquidatedRent: data.liquidatedRent,
        lateRent: data.lateRent,
        groundPoundRent: data.groundPoundRent,
        arrersRent: data.arrersRent,
        archivesmouthsmanagement:{
          id:data.archivesMouthsId
        },
        basicsPark:{
          id:data.parkId
        },
        dictDetail:{
          id:data.paymentType
        },
        dept:{
          id:data.deptId
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
