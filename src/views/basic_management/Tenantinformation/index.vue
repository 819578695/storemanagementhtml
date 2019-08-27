<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','TENANTINFORMATION_ALL','TENANTINFORMATION_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          v-permission="['ADMIN']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
      <!-- 导出 -->
      <div style="display: inline-block;">
        <el-button
          v-permission="['ADMIN']"
          :loading="downloadAllLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="downloadAll">全部导出</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表单组件-->
    <eFormxq ref="formxq"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="area" label="面积(m²)"/>
      <el-table-column prop="stall" label="档口/电商楼">
        <template slot-scope="scope">
          <span style="margin-left: 10px;color: #409EFF;cursor : pointer;" @click="adduser(scope.row.id)">{{ scope.row.stall }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roomnumber" label="房号(门牌号)"/>
      <el-table-column prop="companyname" label="公司名称"/>
      <el-table-column prop="logisticsline" label="物流专线"/>
      <el-table-column prop="linkman" label="联系人"/>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="amountinarear" label="欠款金额"/>
      <el-table-column prop="thecontractdetails" label="合同详情"/>
      <el-table-column v-if="checkPermission(['ADMIN','TENANTINFORMATION_ALL','TENANTINFORMATION_EDIT','TENANTINFORMATION_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','TENANTINFORMATION_ALL','TENANTINFORMATION_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','TENANTINFORMATION_ALL','TENANTINFORMATION_DELETE']"
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
import { del } from '@/api/tenantinformation'
import tenantinformation from '@/api/tenantinformation'
import { parseTime } from '@/utils/index'
import eForm from './form'
import eFormxq from './formxq'

export default {
  components: { eForm, eFormxq },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      dataALL: [], // 保存全部导出的数据
      downloadLoading: false, // 导出加载
      downloadAllLoading: false, // 全部导出加载
      queryTypeOptions: [
        { key: 'roomnumber', display_name: '门牌号' },
        { key: 'linkman', display_name: '联系人' },
        { key: 'phone', display_name: '联系电话' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/tenantinformation'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
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
        area: data.area,
        stall: data.stall,
        roomnumber: data.roomnumber,
        companyname: data.companyname,
        logisticsline: data.logisticsline,
        linkman: data.linkman,
        phone: data.phone
      }
      _this.dialog = true
    },
    adduser(id) {
      this.$refs.formxq.dialogxq = true
    },
    // 导出
    download() {
      this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['编号', '门牌号', '面积', '定金', '合同保证金', '联系人', '租用类型']
        const filterVal = ['id', 'housenumber', 'acreage', 'earnest', 'contractmoney', 'contacts', 'leasetype']
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader, // 表头
          data, // 数据
          filename: 'table-list' // 文件名
        })
        this.downloadLoading = false
      })
    },
    // 全部导出
    downloadAll() {
      const sort = 'id,desc'
      const params = { sort: sort }
      tenantinformation(params).then(res => {
        this.dataALL = res
        this.downloaddAllLoading = true
           import('@/utils/export2Excel').then(excel => {
             const tHeader = ['编号', '门牌号', '面积', '定金', '合同保证金', '联系人', '租用类型']
             const filterVal = ['id', 'housenumber', 'acreage', 'earnest', 'contractmoney', 'contacts', 'leasetype']
             const data = this.formatJson(filterVal, this.dataALL)
             excel.export_json_to_excel({
               header: tHeader,
               data,
               filename: 'table-list'
             })
             this.downloaddAllLoading = false
           })
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createTime' || j === 'lastPasswordResetTime') {
          return parseTime(v[j])
        } else if (j === 'enabled') {
          return parseTime(v[j]) ? '启用' : '禁用'
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>

</style>
