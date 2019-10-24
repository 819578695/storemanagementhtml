<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索-->
     <el-input clearable v-model="query.contacts"  placeholder="输入联系人" style="width: 130px;"  class="filter-item" />
     <el-input clearable v-model="query.housenumber"  placeholder="输入档口编号" style="width: 130px;"  class="filter-item" />
     <dept  v-model="query.deptId" :permission="['ADMIN','ARCHIVESMOUTHSMANAGEMENT_ALL','ARCHIVESMOUTHSMANAGEMENT_DEPT']" @deptValue="deptValue"  />
     <el-select clearable v-model="query.stallType"  placeholder="请选择类型" class="filter-item" style="width:130px;">
       <el-option
        v-for="(item, index) in dicts"
          :key="item.index"
          :label="item.label"
          :value="item.id"
         class="filter-item" @keyup.enter.native="toQuery"
         />
     </el-select>
      <!--已租/未租-->
      <el-select v-model="query.ifRent" clearable placeholder="是否租出" class="filter-item" style="width: 130px">
        <el-option
		      v-for="(item, index) in ifRent"
		      :key="item.key"
		      :label="item.label"
		      :value="item.key">
		    </el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增-->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','ARCHIVESMOUTHSMANAGEMENT_ALL','ARCHIVESMOUTHSMANAGEMENT_ALL_SELECT']"
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
    <!-- 表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!-- 表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="housenumber" label="门牌号"/>
      <el-table-column prop="acreage" label="面积"/>
      <el-table-column prop="earnest" label="定金"/>
      <el-table-column prop="contractmoney" label="合同保证金"/>
      <el-table-column prop="contacts" label="联系人"/>
      <el-table-column prop="stalltypeName" label="租用类型"/>
      <el-table-column prop="picturetoview" label="图片查看">
        <template slot-scope="scope">
          <!-- <i slot="default"><img :src="scope.row.picturetoview" alt="点击打开" class="el-avatar"></i>
          <el-dialog :visible.sync="dialogVisible">
            <img :src="scope.row.picturetoview" width="100%" alt="">
          </el-dialog> -->
          <el-popover
            placement="right"
            title=""
            trigger="click">
            <i slot="default"><img :src="scope.row.picturetoview"></i>
            <img slot="reference" :src="scope.row.picturetoview" :alt="scope.row.picturetoview" class="el-avatar">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="tenementName" label="租户名称"/>
      <el-table-column :show-overflow-tooltip="true" prop="stalldate" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.stalldate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','ARCHIVESMOUTHSMANAGEMENT_ALL','ARCHIVESMOUTHSMANAGEMENT_EDIT','ARCHIVESMOUTHSMANAGEMENT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','ARCHIVESMOUTHSMANAGEMENT_ALL','ARCHIVESMOUTHSMANAGEMENT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover v-permission="['ADMIN','ARCHIVESMOUTHSMANAGEMENT_ALL','ARCHIVESMOUTHSMANAGEMENT_DELETE']" :ref="scope.row.id" placement="top" width="180">
            <p>确认删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" size="mini" type="primary" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total="total" :current-page="page + 1" style="margin-top: 8px;" layout="total, prev, pager, next, sizes" @size-change="sizeChange" @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del, getarchivesmouthsmanagementAll } from '@/api/archivesmouthsmanagement'
import { parseDate } from '@/utils/index'
import store from '@/store'
import eForm from './form'
import dept  from '@/components/DeptSelect'

export default {
  components: { eForm ,dept},
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      dataALL: [], // 保存全部导出的数据
      downloadLoading: false, // 导出加载
      downloadAllLoading: false, // 全部导出加载
      dialogVisible: false,
      deptId: '',
      ifRent: [
      {key:'Y', label: '已出租'},
      {key:'N', label: '未出租'},
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
    deptValue(value){
      this.query.deptId=value
    },
    parseDate,
    checkPermission,
    beforeInit() {
      this.url = 'api/archivesmouthsmanagement'
      const sort = 'id,desc'
      // 最高级别查询所有数据
      if (this.deptId == 1) {
        this.params = { page: this.page, size: this.size, sort: sort }
      } else {
        this.params = { page: this.page, size: this.size, sort: sort, deptId: this.deptId }
      }
      const query = this.query
      const contacts = query.contacts
      const housenumber = query.housenumber
      const stallType = query.stallType
      const deptId = query.deptId
      const ifRent = query.ifRent
      if (contacts) { this.params['contacts'] = contacts }
      if (deptId) { this.params['deptId'] = deptId }
      if (housenumber) {this.params['housenumber'] = housenumber}
      if (stallType) {this.params['stallType'] = stallType}
      if (ifRent){ this.params['tenementName'] = ifRent }
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
      this.$refs.form.imageFrontFile=''
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        id: data.id,
        housenumber: data.housenumber,
        acreage: data.acreage,
        earnest: data.earnest,
        contractmoney: data.contractmoney,
        contacts: data.contacts,
        leasetype: data.leasetype,
        picturetoview: data.picturetoview,
        dept: {
          id: data.deptId
        },
        dictDetail: {
          id: data.stalltype
        },
      }
      _this.imageFrontUrl=data.picturetoview
      _this.dialog = true
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
      getarchivesmouthsmanagementAll(params).then(res => {
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
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
    }
  }
}

</script>

<style scoped>
</style>
