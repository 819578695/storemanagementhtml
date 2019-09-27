<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts" />
    <el-row :gutter="24">
      <el-col :xs="17" :sm="18" :md="20" :lg="24" :xl="24">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索  -->
        <el-date-picker clearable v-model="query.applicationsDateStart" type="date" placeholder="选择日期" style="width:150px;"
         class="filter-item"></el-date-picker>&nbsp;-
        <el-date-picker clearable v-model="query.applicationsDateEnd" type="date" placeholder="选择日期" style="width:150px;" class="filter-item"></el-date-picker>
<!--        <el-input v-model="query.pno" clearable placeholder="输入编号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
 -->
        <el-select v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_DEPT']" clearable v-model="query.deptId"  placeholder="请选择园区" class="filter-item" style="width:130px;">
         <el-option
           v-for="(item, index) in deptList"
           :key="item.id"
           :label="item.name"
           :value="item.id"
           />
        </el-select>
        <el-input clearable v-model="query.supplierName"  placeholder="输入供应商名称" style="width: 130px;" class="filter-item" @keyup.enter.native="toQuery"/>
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
            v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_CREATE']"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="add">新增</el-button>
        </div>
        <!-- 导出 -->
        <div style="display: inline-block;">
          <el-button
            v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_EXPORT']"
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
            v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_EXPORT_ALL']"
            :loading="downloadAllLoading"
            size="mini"
            class="filter-item"
            type="warning"
            icon="el-icon-download"
            @click="downloadAll">全部导出</el-button>
        </div>
    </div>
    <!--表格渲染-->
    <el-table    v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="pno" label="项目编号"/>
      <el-table-column prop="projectName" label="项目名称"/>
      <el-table-column prop="deptName" label="公司名称"/>
      <el-table-column prop="supplierName" label="供应商名称"/>
      <el-table-column prop="purchaseDescription" label="采购说明"/>
      <el-table-column prop="contractEndDate" label="合同截止日" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.contractEndDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractAmount" label="合同总金额" width="100"/>
      <el-table-column prop="paymentRatio" label="付款比例"/>
      <el-table-column prop="applicationsAmount" label="申请金额" width="100"/>
      <el-table-column prop="applicationsDate" label="申请时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.applicationsDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dueDate" label="应付日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.dueDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualPaymentAmount" label="实际付款金额" width="100"/>
      <el-table-column prop="actualPaymentDate" label="实际付款日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.actualPaymentDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentTypeName" label="付款方式"/>
      <el-table-column prop="receiptPaymentAccountName" label="收付款账户"/>
      <el-table-column v-if="checkPermission(['ADMIN','PROCUREMENTINFORMATION_ALL','PROCUREMENTINFORMATION_EDIT','PROCUREMENTINFORMATION_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','PROCUREMENTINFORMATION_ALL']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
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
import checkPermission from '@/utils/permission' //权限控制
import initData from '@/mixins/initData'         //查询表格
import initDict from '@/mixins/initDict'
import { del } from '@/api/procurementInformation' //删除
import { parseTime,parseDate } from '@/utils/index'         //格式化日期
import { getProcurementInformationAll } from '@/api/procurementInformation' //查询所有的收付款信息
import eForm from './form'                        //表单
import store from '@/store'
export default {
  components: { eForm }, //注册表单组件
  mixins: [initData,initDict],   // 初始化数据
  data() {
    return {
      dataALL:[], //保存全部导出的数据
      downloadLoading: false,//导出加载
      downloadAllLoading: false,//全部导出加载
      delLoading: false,//删除加载
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
     this.deptList=JSON.parse(sessionStorage.getItem("depts"))
      this.getDict('transaction_mode')
    })
  },
  methods: {
    parseTime,
    parseDate,
    checkPermission,
    //页面初始化之前调用方法
    beforeInit() {
      this.url = 'api/procurementInformation'
      const sort = 'applicationsDate,desc'
      const query = this.query
      //获取query搜索的值
      const value = query.pno
      const supplierName = query.supplierName
      const applicationsDateStart = query.applicationsDateStart
      const deptId = query.deptId
      const applicationsDateEnd = query.applicationsDateEnd
      //最高级别查询所有数据
      if(this.deptId==1){
        this.params = { page: this.page, size: this.size, sort: sort}
      }
      else{
         this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId}
      }
      if (value) { this.params['pno'] = value }
      if (supplierName) { this.params['supplierName'] = supplierName }
      if (deptId) { this.params['deptId'] = deptId }
      //转化日期格式
      if (applicationsDateStart){
        this.params['applicationsDateStart'] = parseDate(applicationsDateStart)
      }
      if (applicationsDateEnd){
        this.params['applicationsDateEnd'] = parseDate(applicationsDateEnd)
      }
      return true
    },
    subDelete(id) {
      this.delLoading = true //点击删除启用加载中
      del(id).then(res => {
        this.delLoading = false//删除返回时关闭加载中
        this.$refs[id].doClose()//关闭
        this.dleChangePage()// 预防删除第二页最后一条数据时，或者多选删除第二页的数据时，页码错误导致请求无数据
        this.init()        //操作成功查询
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
      this.isAdd = true    //显示标题
      this.$refs.form.dialog = true //显示表单模态窗
      this.$refs.form.getReceiptPaymentAccountList() //加载下拉查询数据
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      this.$refs.form.getReceiptPaymentAccountList();
      //给表单赋值
      this.$refs.form.form = {
        id: data.id,
        pno: data.pno,
        projectName: data.projectName,
        supplierName: data.supplierName,
        purchaseDescription: data.purchaseDescription,
        contractEndDate: data.contractEndDate,
        contractAmount: data.contractAmount,
        paymentRatio: data.paymentRatio,
        applicationsAmount: data.applicationsAmount,
        applicationsDate: data.applicationsDate,
        dueDate: data.dueDate,
        actualPaymentAmount: data.actualPaymentAmount,
        actualPaymentDate: data.actualPaymentDate,
        dept:{
          id:data.deptId
        },
        dictDetail:{
          id:data.paymentType
        },
        receiptPaymentAccount: {
          id:data.receiptPaymentAccountId
        }
      }
      //下拉框赋值
      this.$refs.form.dialog = true
    },
   //重置
   reset(){
     this.query.pno= ''
     this.query.supplierName= ''
     this.query.applicationsDateEnd = null
     this.query.applicationsDateStart = null
     this.query.deptId=''
     this.init()
   },
    // 导出
    download() {
       this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['编号', '项目名称', '供应商名称', '采购说明', '合同截止日', '合同总金额', '付款比例', '申请金额', '申请日期', '应付日期', '实际付款金额', '实际付款日期', '付款方式','收付款账户']
        const filterVal = ['pno', 'projectName', 'supplierName', 'purchaseDescription', 'contractEndDate', 'contractAmount', 'paymentRatio', 'applicationsAmount', 'applicationsDate', 'dueDate', 'actualPaymentAmount', 'actualPaymentDate', 'paymentType', 'receiptPaymentAccountName']
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
         getProcurementInformationAll(params).then(res => {
           this.downloadAllLoading = true
           this.dataALL = res
           import('@/utils/export2Excel').then(excel => {
             const tHeader = ['编号', '项目名称', '供应商名称', '采购说明', '合同截止日', '合同总金额', '付款比例', '申请金额', '申请日期', '应付日期', '实际付款金额', '实际付款日期', '付款方式','收付款账户']
             const filterVal = ['pno', 'projectName', 'supplierName', 'purchaseDescription', 'contractEndDate', 'contractAmount', 'paymentRatio', 'applicationsAmount', 'applicationsDate', 'dueDate', 'actualPaymentAmount', 'actualPaymentDate', 'paymentType', 'receiptPaymentAccountName']
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
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'contractEndDate' || j === 'actualPaymentDate'|| j === 'applicationsDate'|| j === 'dueDate') {
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
