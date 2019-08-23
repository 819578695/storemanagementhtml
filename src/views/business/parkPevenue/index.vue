<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
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
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="parkId" label="园区id"/>
      <el-table-column prop="receiptPaymentAccountId" label="收付款信息"/>
      <el-table-column prop="deptId" label="部门id"/>
      <el-table-column prop="houseNumber" label="档口编号"/>
      <el-table-column prop="houseRent" label="房租"/>
      <el-table-column prop="propertyRent" label="物业费"/>
      <el-table-column prop="waterElectricityRent" label="水电费"/>
      <el-table-column prop="sanitationRent" label="卫生费"/>
      <el-table-column prop="liquidatedRent" label="违约金"/>
      <el-table-column prop="lateRent" label="滞纳金"/>
      <el-table-column prop="groundPoundRent" label="地磅费"/>
      <el-table-column prop="arrersRent" label="欠款金额"/>
      <el-table-column prop="creaeTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creaeTime) }}</span>
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
import { del } from '@/api/parkPevenue'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/parkPevenue'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
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
        parkId: data.parkId,
        receiptPaymentAccountId: data.receiptPaymentAccountId,
        deptId: data.deptId,
        archivesMouthsId: data.archivesMouthsId,
        houseRent: data.houseRent,
        propertyRent: data.propertyRent,
        waterElectricityRent: data.waterElectricityRent,
        sanitationRent: data.sanitationRent,
        liquidatedRent: data.liquidatedRent,
        lateRent: data.lateRent,
        groundPoundRent: data.groundPoundRent,
        arrersRent: data.arrersRent,
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
