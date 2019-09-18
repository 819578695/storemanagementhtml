<template>
  <div  :style="{height:height,width:width}">
    <!--表格渲染-->
    <span>档口出租情况</span>
    <el-table height="250" v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="contractName" label="合同名称"/>
      <el-table-column prop="houseNumber" label="档口编号"/>
      <el-table-column prop="tenementName" label="租户名称"/>
      <el-table-column prop="deptName" label="部门名称"/>
      <el-table-column prop="endDate" label="截止日期" width="100">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.endDate) }}</span>
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
import { parseDate } from '@/utils/index'
import store from '@/store'

export default {
  mixins: [initData],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
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
    })
  },
  methods: {
    parseDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/leaseContract'
      const sort = 'endDate,desc'
      const query = this.query
      //最高级别查询所有数据
      if(this.deptId==1){
        this.params = { page: this.page, size: this.size, sort: sort}
      }
      else{
         this.params = { page: this.page, size: this.size, sort: sort ,deptId:this.deptId}
      }
      return true
    },

  }
}
</script>
