<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-date-picker v-model="query.parkDateStart" type="date" placeholder="选择日期"/>&nbsp;-
      <el-date-picker v-model="query.parkDateEnd" type="date" placeholder="选择日期"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <!-- <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','BASICSCLIENT_ALL','BASICSCLIENT_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div> -->
    </div>
    <!--表单组件-->
    <!-- <eForm ref="form" :is-add="isAdd"/> -->
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="name" label="客户姓名"/>
      <el-table-column prop="phone" label="客户电话"/>
      <el-table-column prop="parkDate" label="创建时间">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.parkDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','BASICSCLIENT_ALL','BASICSCLIENT_EDIT','BASICSCLIENT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <!-- <el-button v-permission="['ADMIN','BASICSCLIENT_ALL','BASICSCLIENT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/> -->
          <el-popover
            v-permission="['ADMIN','BASICSCLIENT_ALL','BASICSCLIENT_DELETE']"
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
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/basicsClient'
import { parseTime, parseDate } from '@/utils/index'
/* import eForm from './form' */
export default {
  /* components: { eForm }, */
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'parkDate', display_name: '创建时间' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseDate,
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/basicsClient'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      const parkDateStart = query.parkDateStart
      const parkDateEnd = query.parkDateEnd
      // 转化日期格式
      if (parkDateStart) {
        this.params['parkDateStart'] = parseDate(parkDateStart)
      }
      if (parkDateEnd) {
        this.params['parkDateEnd'] = parseDate(parkDateEnd)
      }
      if (type && value) { this.params[type] = value }
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
    }
    /* add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    }, */
    /* edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        startDate: data.startDate,
        endDate: data.endDate,
        parkDate: data.parkDate
      }
      _this.dialog = true
    } */
  }
}
</script>

<style scoped>

</style>
