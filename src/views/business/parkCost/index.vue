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
      <!-- <el-select v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_DEPT']" clearable v-model="query.deptId"  placeholder="请选择园区" class="filter-item" style="width: 130px">
        <el-option
          v-for="(item, index) in deptList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          class="filter-item" @keyup.enter.native="toQuery"
          />
      </el-select> -->
      <dept  v-model="query.deptId" :permission="['ADMIN','PARKCOST_ALL','PARKCOST_DEPT']" @deptValue="deptValue"  />
      <el-select  clearable v-model="query.isVertify"  placeholder="请选择审核状态" class="filter-item" style="width: 130px">
        <el-option label="审核中" value="0"/>
        <el-option label="审核失败" value="1" />
        <el-option label="审核通过" value="2"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
     <!-- <!-- 重置
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="info"
          icon="el-icon-refresh-left"
          @click="reset">重置</el-button>
      </div> -->
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
      <!-- 审核 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_VERTIFY']"
          class="filter-item"
          :loading="vertifyLoading"
          size="mini"
          type="danger"
          icon="el-icon-s-check"
          @click="vertify">审核</el-button>
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
    <el-table  :summary-method="getSummaries" show-summary v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column width="55" type="selection"/>
      <el-table-column prop="rentContractName" label="合同名称"/>
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="siteRent" label="场地租金"/>
      <el-table-column prop="waterRent" label="水费"/>
      <el-table-column prop="electricityRent" label="电费"/>
      <el-table-column prop="propertyRent" label="物业费"/>
      <el-table-column prop="taxCost" label="税赋成本"/>
      <el-table-column prop="otherRent" label="其他费用"/>
      <el-table-column prop="startTime" label="开始时间">
        <template slot-scope="scope">
            <span>{{ parseDate(scope.row.startTime) }}</span>
          </template>
      </el-table-column>
      <el-table-column prop="endTime" label="截止时间">
       <template slot-scope="scope">
             <span>{{ parseDate(scope.row.endTime) }}</span>
           </template>
      </el-table-column>
      <el-table-column prop="paymentTypeName" sortable label="交易类型"  width="100" />
      <el-table-column prop="isVertify" sortable label="审核状态" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.isVertify==0?'审核中':scope.row.isVertify==1?'审核失败':'审核通过' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="costRemarks" label="备注" width="100"/>
      <el-table-column label="收款信息">
        <template slot-scope="scope">
          <span style="cursor: pointer;" @click="findReceiptPaymentAccount(scope.row.receiptPaymentAccountId)">查看</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PARKCOST_ALL','PARKCOST_EDIT','PARKCOST_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope" v-if="scope.row.isVertify!=2">
          <el-button  v-permission="['ADMIN','PARKCOST_ALL','PARKCOST_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
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
import { del,getParkCostAll,vertify } from '@/api/parkCost'
import { parseTime,parseDate } from '@/utils/index'
import eForm from './form'
import accountForm from './accountform'
import store from '@/store'
import dept  from '@/components/DeptSelect'
export default {
  components: { eForm,accountForm,dept},
  mixins: [initData,initDict],
  data() {
    return {
      vertifys:[],//保存审核的集合
      multipleSelection: [],
      dataALL:[], //保存全部导出的数据
      downloadLoading: false,//导出加载
      downloadAllLoading: false,//全部导出加载
      delLoading: false,
      vertifyLoading:false,//审核加载中
      deptId:'',
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
      this.getDictMap('transaction_mode')
    })
  },
  methods: {
    deptValue(value){
      this.query.deptId=value
    },
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
      const isVertify = query.isVertify
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
       if (isVertify){
         this.params['isVertify'] = isVertify
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
        costRemarks:data.costRemarks
      }
      _this.dialog = true
    },
    //重置
    reset(){
      this.query.createDateStart=null
      this.query.createDateEnd=null
      this.query.deptId=''
      this.query.isVertify=''
      this.init()
    },
    // 导出
    download() {
       this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['合同名称',  '公司名称', '场地租金', '水费', '电费', '物业费', '税赋成本', '其他费用', '交易类型', '审核状态','备注' ,'创建时间', '收付款账户名称']
        const filterVal = ['rentContractName', 'deptName', 'siteRent', 'waterRent', 'electricityRent', 'propertyRent', 'taxCost', 'otherRent','paymentTypeName','isVertify','costRemarks', 'createTime', 'receiptPaymentAccountName']
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,  //表头
          data,             //数据
          filename: '园区成本_'+this.parseTime(new Date()) //文件名
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
             const tHeader = ['合同名称', '部门名称', '场地租金', '水费', '电费', '物业费', '税赋成本', '其他费用', '交易类型','审核状态','备注' ,'创建时间', '收付款账户名称']
             const filterVal = ['rentContractName', 'deptName', 'siteRent', 'waterRent', 'electricityRent', 'propertyRent', 'taxCost', 'otherRent','paymentTypeName','isVertify','costRemarks', 'createTime', 'receiptPaymentAccountName']
             const data = this.formatJson(filterVal, this.dataALL)
             excel.export_json_to_excel({
               header: tHeader,
               data,
               filename: '园区成本_'+this.parseTime(new Date()) //文件名
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
    //批量操作
    handleSelectionChange(val) {
    var isCheckbox=[] //保存已勾选的集合
        this.multipleSelection = val;
        for (var i = 0; i < this.multipleSelection.length; i++) {
          isCheckbox.push(this.multipleSelection[i].id)
        }
        this.vertifys = isCheckbox
      },
      //审核
      vertify(){
        if(this.vertifys==''){
            this.$notify({
              title: '请选择要操作的数据',
              type: 'error',
              duration: 2500
            })
        }
        else{
           this.vertifyLoading = true
          this.$confirm('确认审核, 是否继续?', '提示', {
             distinguishCancelAndClose: true,
             confirmButtonText: '审核通过',
             cancelButtonText: '审核失败',
             type: 'warning'
           }).then(() => {
                this.updateVertify(2)
                this.vertifyLoading = false
             //审核通过
           }).catch(action  => {
             //点击审核未通过
              if ( action === 'cancel') {
                 this.updateVertify(1)
                 this.vertifyLoading = false
              }
              else{
                this.vertifyLoading = false
              }
           });
        }
      },
      //发送审核请求
      updateVertify(status){
        vertify(this.vertifys,status).then(res => {
          this.$notify({
            title: '操作成功',
            type: 'success',
            duration: 2500
          })
          this.init()
          }).catch(err => {
            this.vertifyLoading = false
            console.log(err.response.data.message)
          })
      },
      //合计
      getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '合计';
              return;
            }
            else if (index === 1 || index === 2 || index === 9||index === 10||index === 11 ||index === 12 ||index === 13) {
               sums[index] = '';
               return;
             }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                }
                else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 元';
            } else {
              sums[index] = '';
            }
          });

          return sums;
        }
  }
}
</script>

<style scoped="scoped">

</style>
