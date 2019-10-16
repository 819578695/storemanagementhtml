<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dictMap="dictMap" />
    <!--表单组件-->
    <accountForm ref="accountform" />
    <el-row :gutter="20">
      <el-col :xs="17" :sm="18" :md="20" :lg="24" :xl="24">
    <!--工具栏-->
      <div class="head-container">
      <!-- 搜索 -->
      <el-date-picker clearable v-model="query.createDateStart" type="date" placeholder="选择日期" class="filter-item"></el-date-picker>&nbsp;-&nbsp;
      <el-date-picker clearable v-model="query.createDateEnd" type="date" placeholder="选择日期" class="filter-item"></el-date-picker>
      <el-select v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_DEPT']" clearable v-model="query.deptId"  placeholder="请选择园区" class="filter-item" style="width: 130px">
        <el-option
          v-for="(item, index) in deptList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          class="filter-item" @keyup.enter.native="toQuery"
          />
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 重置 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="info"
          icon="el-icon-refresh-left"
          @click="reset">重置</el-button>
      </div>
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
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_EXPROT']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
      <!-- 全部导出 -->
      <div style="display: inline-block;">
        <el-button
          v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_EXPROT_ALL']"
          :loading="downloadAllLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="downloadAll">全部导出</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="rentContractName" label="合同名称"/>
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
    </el-col>
   </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import { receiptPaymentAccountById } from '@/api/receiptPaymentAccount'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del,getParkCostAll } from '@/api/parkCost'
import { parseTime,parseDate } from '@/utils/index'
import eForm from './form'
import accountForm from './accountform'
import store from '@/store'
export default {
  components: { eForm,accountForm},
  mixins: [initData,initDict],
  data() {
    return {
      dataALL:[], //保存全部导出的数据
      downloadLoading: false,//导出加载
      downloadAllLoading: false,//全部导出加载
      delLoading: false,
      deptId:'',
      deptList:[],
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
      this.deptList=JSON.parse(sessionStorage.getItem("depts"))
      this.getDictMap('transaction_mode')
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
      const houseNumber = query.houseNumber
      const createDateStart = query.createDateStart
      const createDateEnd = query.createDateEnd
      const deptName = query.deptName
      const deptId = query.deptId
       //最高级别查询所有数据
       if(this.deptId==1){
         this.params = { page: this.page, size: this.size, sort: sort}
       }
       else{
          this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId }
       }
       if (deptId) { this.params['deptId'] = deptId }
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
      _this.dictId= data.paymentType//保存支付类型id
      _this.receiptPaymentAccountId= data.receiptPaymentAccountId//保存收付款信息Id
      _this.findbyReceiptPaymentAccount(data.paymentType) //根据支付方式查询账户
      _this.form = {
        id: data.id,
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
        startTime:data.startTime,
        endTime:data.endTime,
        dictDetail: {
          id:data.paymentType
        },
        receiptPaymentAccount: {
          id:data.receiptPaymentAccountId
        },
        dept:{
          id:data.deptId
        },
      }
      _this.dialog = true
    },
    //重置
    reset(){
      this.query.createDateStart=null
      this.query.createDateEnd=null
      this.query.deptId=''
      this.init()
    },
    // 导出
    download() {
       this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['合同名称',  '公司名称', '场地租金', '水费', '电费', '物业费', '税赋成本', '其他费用', '交易类型', '创建时间', '收付款账户名称']
        const filterVal = ['rentContractName', 'deptName', 'siteRent', 'waterRent', 'electricityRent', 'propertyRent', 'taxCost', 'otherRent','paymentTypeName', 'createTime', 'receiptPaymentAccountName']
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,  //表头
          data,             //数据
          filename: 'table-list' //文件名
        })
        this.downloadLoading = false
      })
    },
    // 全部导出
    downloadAll() {
         const sort = 'id,desc'
         const params = { sort: sort }
         getParkCostAll(params).then(res => {
           this.downloadAllLoading = true
           this.dataALL = res.content
           import('@/utils/export2Excel').then(excel => {
             const tHeader = ['合同名称', '部门名称', '场地租金', '水费', '电费', '物业费', '税赋成本', '其他费用', '交易类型', '创建时间', '收付款账户名称']
             const filterVal = ['rentContractName', 'deptName', 'siteRent', 'waterRent', 'electricityRent', 'propertyRent', 'taxCost', 'otherRent','paymentTypeName', 'createTime', 'receiptPaymentAccountName']
             const data = this.formatJson(filterVal, this.dataALL)
             excel.export_json_to_excel({
               header: tHeader,
               data,
               filename: 'table-list'
             })
             this.downloadAllLoading = false
           })
         })
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
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime') {
          return parseDate(v[j])
        }  else {
          return v[j]
        }
      }))
    },
  }
}
</script>

<style scoped>

</style>
