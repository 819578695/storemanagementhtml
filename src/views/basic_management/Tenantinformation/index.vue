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
    <eForm ref="form" :is-add="isAdd" :dicts="dicts" />
    <!--表单组件-->
    <eFormxq ref="eFormxq"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="companyname" label="公司名称"/>
      <el-table-column prop="logisticsline" label="租用用途"/>
      <el-table-column prop="linkman" label="联系人">
        <template slot-scope="scope">
          <span style="margin-left: 10px;color: #409EFF;cursor : pointer;" @click="adduser(scope.row.id)">{{ scope.row.linkman }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话"/>
      <el-table-column prop="amountinarear" label="欠款金额"/>
      <el-table-column prop="thecontractdetails" label="合同详情">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="click">
            <i slot="default">
              <img v-if="scope.row.thecontractdetails!=null" :src="scope.row.thecontractdetails">
              <span v-else> 无附件 </span>
            </i>
            <span slot="reference" :alt="scope.row.thecontractdetails" style="cursor: pointer;">查看</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tenementdate" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.tenementdate) }}</span>
        </template>
      </el-table-column>
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
import { del, gettenantinformationAll, particulars } from '@/api/tenantinformation'
import { parseTime, parseDate } from '@/utils/index'
import initDict from '@/mixins/initDict'
import store from '@/store'
import eForm from './form'
import eFormxq from './formxq'

export default {
  components: { eForm, eFormxq },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      dataALL: [], // 保存全部导出的数据
      downloadLoading: false, // 导出加载
      downloadAllLoading: false, // 全部导出加载
      deptId: '',
      queryTypeOptions: [
        { key: 'linkman', display_name: '联系人' },
        /* { key: 'roomnumber', display_name: '门牌号' }, */
        { key: 'phone', display_name: '联系电话' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      // 将用户的上级部门id带入后台查询
      store.dispatch('GetInfo').then(res => {
        this.deptId = res.deptId
        this.init()
      })
      this.getDict('stall_type')
    })
  },
  methods: {
    parseDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/tenantinformation'
      const sort = 'id,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const deptId = query.deptId
      // 最高级别查询所有数据
      if (this.deptId === 1) {
        this.params = { page: this.page, size: this.size, sort: sort }
      } else {
        this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      }
      if (type && value) { this.params[type] = value }
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
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        companyname: data.companyname,
        logisticsline: data.logisticsline,
        linkman: data.linkman,
        phone: data.phone,
        dept: {
          id: data.deptId
        }
      }
      _this.dialog = true
    },
    adduser(id) {
      if (id != null || id != '') {
        const _this = this.$refs.eFormxq
        particulars(id).then(res => {
          _this.data = res
          _this.dialogxq = true
          setTimeout(() => {
            _this.loading = false
          }, _this.time)
        }).catch(err => {
          _this.loading = false
        })
      }
      /* this.$refs.formxq.dialogxq = true */
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
      gettenantinformationAll(params).then(res => {
        this.dataALL = res
        this.downloadAllLoading = true
           import('@/utils/export2Excel').then(excel => {
             const tHeader = ['编号', '门牌号', '面积', '定金', '合同保证金', '联系人', '租用类型']
             const filterVal = ['id', 'housenumber', 'acreage', 'earnest', 'contractmoney', 'contacts', 'leasetype']
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
