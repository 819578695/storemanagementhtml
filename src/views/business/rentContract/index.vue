<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dictMap="dictMap"/>
    <el-row :gutter="24">
      <el-col :xs="17" :sm="18" :md="20" :lg="24" :xl="24">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input clearable v-model="query.contractNo"  placeholder="输入合同编号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <dept  v-model="query.deptId" :permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_DEPT']" @deptValue="deptValue"  />
      <el-select  clearable v-model="query.isAudit"  placeholder="请选择审核状态" class="filter-item" style="width: 130px">
        <el-option label="审核中" value="0"/>
        <el-option label="审核失败" value="1" />
        <el-option label="审核通过" value="2"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!-- 审核 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_VERTIFY']"
          class="filter-item"
          :loading="vertifyLoading"
          size="mini"
          type="danger"
          icon="el-icon-s-check"
          @click="vertify">审核</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;" @selection-change="handleSelectionChange">
    	<el-table-column width="55" type="selection"/>
      <!-- <el-table-column prop="id" label="主键"/> -->
      <el-table-column prop="contractNo" label="合同编号"/>
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="contractName" label="合同名称"/>
      <el-table-column prop="startDate" label="起始日期">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="截止日期">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rentFreePeriod" label="免租期"/>
      <el-table-column prop="deposit" label="保证金"/>
      <el-table-column prop="unpaidExpenses" label="未缴费用">
      <template slot-scope="scope">
        <span>{{scope.row.contractAmount-scope.row.paymentedExpenses<0?0:scope.row.contractAmount-scope.row.paymentedExpenses}}</span>
      </template>
      </el-table-column>
      <el-table-column prop="paymentedExpenses" label="已缴费用"/>
      <el-table-column prop="contractAmount" label="年租金"/>
      <el-table-column prop="payCycleName" label="付款周期"/>
      <el-table-column prop="payPrice" label="付款金额"/>
      <el-table-column prop="isEnable" label="是否启用">
        <template slot-scope="scope">
          <span>{{scope.row.isEnable==1?'启用':'作废'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注"/>
      <el-table-column  prop="fileName" label="合同附件">
      <template slot-scope="scope">
         <span slot="reference" :alt="scope.row.fileName" >
           <a v-if="scope.row.fileName!=''" :href="scope.row.fileName" target="_blank">查看</a>
         </span>
        <!-- <el-popover
          placement="left"
          title=""
          trigger="click">
          <i slot="default">
             <!-- <img class="img-responsive" v-if="scope.row.fileName!=null":src="scope.row.fileName">
            <pdf v-if="scope.row.fileName!=null"
                ref="pdf"
                :src="scope.row.fileName">
              </pdf>
            <span v-else> 无附件 </span>
          </i>
        </el-popover>
        <div class="pdf" v-show="fileType === 'pdf'">
            <p class="arrow">
            <span @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">Preview</span>
            {{currentPage}} / {{pageCount}}
            <span @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">Next</span>
            </p>
            <pdf
              :src="scope.row.fileName"
              :page="currentPage"
              @num-pages="pageCount=$event"
              @page-loaded="currentPage=$event"
              @loaded="loadPdfHandler">
            </pdf>
          </div>
          -->
       </template>
      </el-table-column>
      <el-table-column prop="isAudit"  sortable label="审核状态" width="100" >
        <template slot-scope="scope">
          <span>{{ scope.row.isAudit==0?'审核中':scope.row.isAudit==1?'审核失败':'审核通过' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_EDIT','RENTCONTRACT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isAudit!=2"
          	v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_EDIT']" 
          	size="mini" 
          	type="primary" 
          	icon="el-icon-edit" 
          	@click="edit(scope.row)"/>
          <el-popover v-if="scope.row.isAudit!=2"
            v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_DELETE']"
            :ref="scope.row.id"
            placement="right"
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
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del,vertify } from '@/api/rentContract'
import { parseTime,parseDate } from '@/utils/index'
import eForm from './form'
import store from '@/store'
import dept  from '@/components/DeptSelect'

export default {
  components: { eForm,dept},
  mixins: [initData,initDict],
  data() {
    return {
      deptId:'',
      delLoading: false,
      vertifys:[],//保存审核的集合
      vertifyLoading:false,//审核加载中
      multipleSelection: [],//表头多选框
    }
  },
  created() {
    this.$nextTick(() => {
     store.dispatch('GetInfo').then(res => {
       this.deptId=res.deptId
       this.init()
     })
      this.getDictMap('pay_cycle')
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
      this.url = 'api/rentContract'
      const sort = 'id,desc'
      const query = this.query
      const deptId = query.deptId
	  	const contractNo = query.contractNo
			const isAudit = query.isAudit
      //最高级别查询所有数据
      if(this.deptId==1){
        this.params = { page: this.page, size: this.size, sort: sort}
      }
      else{
         this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId}
      }
      if (deptId) { this.params['deptId'] = deptId }
	    if (contractNo) { this.params['contractNo'] = contractNo }
	    if (isAudit){this.params['isAudit'] = isAudit}
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
        deptId: data.deptId,
        contractName: data.contractName,
        startDate: data.startDate,
        endDate: data.endDate,
        rentFreePeriod: data.rentFreePeriod,
        deposit: data.deposit,
        contractAmount: data.contractAmount,
        fileName: data.fileName,
        payPrice:data.payPrice,
        payCycle:{
          id:data.payCycleId
        },
        isEnable:data.isEnable,
        remarks:data.remarks,
        isAudit:data.isAudit
      }
      _this.imageFrontUrl=data.fileName
      _this.dialog = true
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
  }
}
</script>

<style scoped>

</style>
