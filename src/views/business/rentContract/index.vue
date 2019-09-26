<template>
  <div class="app-container">
    <!--工具栏-->
    <div >
      <!-- 搜索 -->
      <el-input clearable v-model="query.contractNo"  placeholder="输入合同编号" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_DEPT']" clearable v-model="query.deptId"  placeholder="请选择园区" class="filter-item">
        <el-option
          v-for="(item, index) in deptList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          class="filter-item" @keyup.enter.native="toQuery"
          />
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
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <!-- <el-table-column prop="id" label="主键"/> -->
      <el-table-column prop="contractNo" label="合同编号"/>
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="contractName" label="合同名称"/>
      <el-table-column prop="startDate" label="起止日期">
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
      <el-table-column prop="contractAmount" label="合同总金额"/>
      <el-table-column  prop="fileName" label="合同附件">
      <template slot-scope="scope">
        <el-popover
          placement="right"
          title=""
          trigger="click">
          <i slot="default">
            <img v-if="scope.row.fileName!=null":src="scope.row.fileName">
            <span v-else> 无附件 </span>
          </i>
          <span slot="reference" style="cursor: pointer;" :alt="scope.row.fileName">查看</span>
        </el-popover>
       </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_EDIT','RENTCONTRACT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','RENTCONTRACT_ALL','RENTCONTRACT_DELETE']"
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
import { del } from '@/api/rentContract'
import { parseTime,parseDate } from '@/utils/index'
import eForm from './form'
import store from '@/store'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      deptId:'',
      delLoading: false,
      deptList:[],
    }
  },
  created() {
    this.$nextTick(() => {
     store.dispatch('GetInfo').then(res => {
       this.deptId=res.deptId
       this.init()
     })
      this.deptList=JSON.parse(sessionStorage.getItem("depts"))
    })
  },
  methods: {
    parseTime,
    parseDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/rentContract'
      const sort = 'id,desc'
      const query = this.query
      const deptId = query.deptId
      //最高级别查询所有数据
      if(this.deptId==1){
        this.params = { page: this.page, size: this.size, sort: sort}
      }
      else{
         this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId}
      }
      if (deptId) { this.params['deptId'] = deptId }
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
      this.$refs.form.imageFrontFile=null
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
        contractNo: data.contractNo,
      }
      _this.imageFrontUrl=data.fileName
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
