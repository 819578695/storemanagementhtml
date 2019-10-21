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
      <!-- 搜索  -->
        <el-date-picker clearable v-model="query.createTimeStart" type="date" placeholder="选择日期" style="width:150px;"  class="filter-item"></el-date-picker>&nbsp;-
        <el-date-picker clearable v-model="query.createTimeEnd" type="date" placeholder="选择日期" style="width:150px;"  class="filter-item"></el-date-picker>
        <el-select v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_DEPT']" clearable v-model="query.deptId"  placeholder="请选择园区" class="filter-item" style="width:130px;">
          <el-option
            v-for="(item, index) in deptList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            class="filter-item" @keyup.enter.native="toQuery"
            />
        </el-select>
        <el-select  clearable v-model="query.isVertify"  placeholder="请选择审核状态" class="filter-item" style="width: 130px">
          <el-option label="审核中" value="0"/>
          <el-option label="审核失败" value="1" />
          <el-option label="审核通过" value="2"/>
        </el-select>
        <el-input clearable v-model="query.linkman"  placeholder="输入租户名称" style="width: 130px;"  class="filter-item" />
        <el-input clearable v-model="query.houseNumber"  placeholder="输入档口编号" style="width: 130px;"  class="filter-item" />
        <el-select clearable v-model="query.type"  placeholder="请选择类型" class="filter-item" style="width:130px;">
          <el-option
           v-for="(item, index) in dictMap.pevenue_status"
             :key="item.index"
             :label="item.label"
             :value="item.id"
            class="filter-item" @keyup.enter.native="toQuery"
            />
        </el-select>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
     <!--  重置
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
          v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!-- 审核 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_VERTIFY']"
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
          v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EXPORT']"
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
          v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EXPORT_ALL']"
          :loading="downloadAllLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="downloadAll">全部导出</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table :summary-method="getSummaries" show-summary v-loading="loading" @selection-change="handleSelectionChange" :data="data" size="small" style="width: 100%;">
      <el-table-column width="55" type="selection"/>
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="linkman" label="租户名称"/>
      <el-table-column prop="houseNumber" label="档口编号"/>
      <el-table-column prop="leaseContractName" label="合同名称"/>
      <el-table-column prop="houseRent" label="房租"/>
      <el-table-column prop="propertyRent" label="物业费"/>
      <el-table-column prop="waterRent" label="水费"/>
      <el-table-column prop="electricityRent" label="电费"/>
      <el-table-column prop="sanitationRent" label="卫生费"/>
      <el-table-column prop="liquidatedRent" label="违约金"/>
      <el-table-column prop="managementRent" label="管理费"/>
      <el-table-column prop="parkingRent" label="停车费"/>
      <el-table-column prop="lateRent" label="滞纳金"/>
      <el-table-column prop="groundPoundRent" label="地磅费"/>
      <el-table-column prop="paymentTypeName" sortable label="交易方式" width="100"/>
      <el-table-column prop="payTypeName" sortable label="交易类型" width="100"/>
      <el-table-column prop="isVertify"  sortable label="审核状态" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.isVertify==0?'审核中':scope.row.isVertify==1?'审核失败':'审核通过' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款信息">
        <template slot-scope="scope">
          <span style="cursor: pointer;" @click="findReceiptPaymentAccount(scope.row.receiptPaymentAccountId)">查看</span>
        </template>
      </el-table-column>
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
      <el-table-column prop="updateTime" label="修改时间">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- 合计-->
      <el-table-column prop="total" label="合计" >
        <template slot-scope="scope">
          <span>{{ parseFloat(scope.row.houseRent+scope.row.propertyRent+scope.row.waterRent+scope.row.electricityRent+scope.row.sanitationRent+scope.row.lateRent+scope.row.groundPoundRent) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EDIT','PARKPEVENUE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button  v-if="scope.row.isVertify!=2" v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-button  v-if="scope.row.payTypeValue=='PEVENUE_UNDER'&&scope.row.isVertify==2"  v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)">补缴</el-button>
          <el-popover  v-if="scope.row.isVertify!=2"
            v-permission="['ADMIN','PARKPEVENUE_ALL','PARKPEVENUE_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button  size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
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
import { del,getParkPevenueAll,vertify } from '@/api/parkPevenue'
import { parseTime,parseDate } from '@/utils/index'
import eForm from './form'
import accountForm from './accountform'
import store from '@/store'
export default {
  components: { eForm,accountForm },
  mixins: [initData,initDict],
  data() {
    return {
      vertifys:[],//保存审核的集合
      vertifyLoading:false,//审核加载中
      multipleSelection: [],
      dataALL:[], //保存全部导出的数据
      downloadLoading: false,//导出加载
      downloadAllLoading: false,//全部导出加载
      deptList:[],
      deptId:'',
      delLoading: false,
    }
  },
  created() {
    this.$nextTick(() => {
     //将用户的上级部门id带入后台查询
     store.dispatch('GetInfo').then(res => {
       this.deptId=res.deptId
       this.init()
     })
      //取值给部门集合
     this.deptList=JSON.parse(sessionStorage.getItem("depts"))
      this.getDictMap('transaction_mode,pevenue_status')
    })
  },
  methods: {
    parseTime,
    parseDate,
    checkPermission,
    beforeInit() {
     /* this.receiptPaymentAccountList=this.$refs.form.receiptPaymentAccountList */
      this.url = 'api/parkPevenue'
      const sort = 'id,desc'
      const query = this.query
      //获取query搜索的值
      const houseNumber = query.houseNumber
      const startTime = query.createTimeStart
      const endTime = query.createTimeEnd
      const deptId = query.deptId
      const type = query.type
      const linkman = query.linkman
      const isVertify = query.isVertify
      //最高级别查询所有数据
      if(this.deptId==1){
        this.params = { page: this.page, size: this.size, sort: sort}
      }
      else{
         this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId}
      }
      //档口编号
      if (houseNumber) { this.params['houseNumber'] = houseNumber }
      if (deptId) { this.params['deptId'] = deptId }
      if (linkman) {this.params['linkman'] = linkman}
      if (type) {this.params['type'] = type}
      if (isVertify){this.params['isVertify'] = isVertify}
      //转化日期格式
      if (startTime){
        this.params['createTimeStart'] = parseDate(startTime)
      }
      if (endTime){
        this.params['createTimeEnd'] = parseDate(endTime)
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
      this.$refs.form.getReceiptPaymentAccountList()
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getReceiptPaymentAccountList() //查询合同
      _this.dictId= data.paymentType//保存支付类型id
      _this.receiptPaymentAccountId= data.receiptPaymentAccountId//保存收付款信息Id
      _this.tenantinformation.id= data.tenementId //租户id
      _this.tenantinformation.tenementName= data.linkman //租户名称
      _this.archivesmouthsmanagement.id= data.archivesMouthsId //档口id
      _this.archivesmouthsmanagement.houseNumber= data.houseNumber //档口名称
      _this.findbyReceiptPaymentAccount(data.paymentType) //根据支付方式查询账户
      _this.form = {
        id: data.id,
        houseRent: data.houseRent,
        propertyRent: data.propertyRent,
        waterRent: data.waterRent,
        electricityRent:data.electricityRent,
        sanitationRent: data.sanitationRent,
        liquidatedRent: data.liquidatedRent,
        lateRent: data.lateRent,
        startTime:data.startTime,
        endTime:data.endTime,
        groundPoundRent: data.groundPoundRent,
        managementRent:data.managementRent,
        parkingRent:data.parkingRent,
        payType:{
          id:data.payTypeId,
          value:data.payTypeValue
        },
        tenantinformation:{
          id:data.tenementId,
        },
        leaseContract:{
          id:data.leaseContractId
        },
        archivesmouthsmanagement:{
          id:data.archivesMouthsId
        },
        dictDetail:{
          id:data.paymentType
        },
        dept:{
          id:data.deptId
        },
        receiptPaymentAccount: {
          id:data.receiptPaymentAccountId
        },
        isDelete:data.isDelete,
        isVertify:data.isVertify
      }
      _this.dialog = true

    },
   /* //重置
    reset(){
     this.query= {

     }
      this.init()
    }, */
    // 导出
    download() {
      this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['公司名称', '档口编号','租户名称', '房租', '物业费', '水费', '电费', '卫生费', '违约金', '管理费', '停车费', '滞纳金', '地磅费','交易方式','交易类型','审核状态','修改时间','创建时间','合计']
        const filterVal = ['deptName', 'houseNumber','linkman', 'houseRent', 'propertyRent', 'waterRent', 'electricityRent', 'sanitationRent', 'liquidatedRent', 'managementRent', 'parkingRent', 'lateRent','groundPoundRent','paymentTypeName','payTypeName','isVertify','updateTime','createTime','total']
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,  //表头
          data,             //数据
          filename: '园区收入_'+this.parseTime(new Date()) //文件名
        })
      })
       this.downloadLoading = false
    },
    // 全部导出
    downloadAll() {
         const sort = 'id,desc'
         const params = { sort: sort }
         getParkPevenueAll(params).then(res => {
           this.downloadAllLoading = true
           this.dataALL = res.content
           import('@/utils/export2Excel').then(excel => {
             const tHeader = ['公司名称', '档口编号','租户名称', '房租', '物业费', '水费', '电费', '卫生费', '违约金', '管理费', '停车费', '滞纳金', '地磅费','交易方式','交易类型','审核状态','修改时间','创建时间','合计']
             const filterVal = ['deptName', 'houseNumber','linkman', 'houseRent', 'propertyRent', 'waterRent', 'electricityRent', 'sanitationRent', 'liquidatedRent', 'managementRent', 'parkingRent', 'lateRent','groundPoundRent','paymentTypeName','payTypeName','isVertify','updateTime','createTime','total']
             const data = this.formatJson(filterVal, this.dataALL)
             excel.export_json_to_excel({
               header: tHeader,
               data,
               filename: '园区收入_'+this.parseTime(new Date())
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
        if (j === 'createTime' || j === 'updateTime') {
          return parseDate(v[j])
        }
        else if(j==='isVertify') {
          return v[j]==0?'审核中':v[j]==1?'审核失败':'审核通过'
        }
        else if(j==='total') {
          return parseFloat(v['houseRent']+v['propertyRent']+v['waterRent']+v['electricityRent']+v['sanitationRent']+v['lateRent']+v['groundPoundRent'])
        }
         else {
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
           else if (index === 20 ||index === 21 ||index === 19 ||index === 22 ||index === 17 ||index === 1 ||index === 2 ||index === 4 ||index === 3) {
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

<style scoped>

</style>
