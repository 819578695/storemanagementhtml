<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <dept  v-model="query.deptId" :permission="['ADMIN','PARKCOST_ALL','PARKCOST_DEPT']" @deptValue="deptValue"  />

      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','BASICSPARK_ALL','BASICSPARK_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <contracttable ref="contracttable" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="deptName" label="园区"/>
      <el-table-column prop="dateOfEstablishment" label="成立时间">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.dateOfEstablishment) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="物业公司名称"/>
      <el-table-column prop="openingTime" label="开园时间">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.openingTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="occupiedArea" label="占用面积"/>
      <el-table-column prop="floorSpace" label="占地面积"/>
      <el-table-column prop="coveredArea" label="建筑面积"/>
      <el-table-column prop="usableArea" label="可使用面积"/>
      <el-table-column prop="theContractInformation" label="合同信息">
        <template slot-scope="scope">
          <span style="margin-left: 10px;color: #409EFF;cursor : pointer;" @click="detailsBargain(scope.row.deptId)">查看</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="图片上传">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            title=""
            trigger="click">
            <i slot="default"><img :src="scope.row.fileName"></i>
            <img slot="reference" :src="scope.row.fileName" :alt="scope.row.fileName" class="el-avatar">
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="parkdate" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.parkdate) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','BASICSPARK_ALL','BASICSPARK_EDIT','BASICSPARK_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','BASICSPARK_ALL','BASICSPARK_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','BASICSPARK_ALL','BASICSPARK_DELETE']"
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
import initDict from '@/mixins/initDict'
import { del, basicsParkContract } from '@/api/thearchives'
import { parseDate } from '@/utils/index'
import store from '@/store'
import eForm from './form'
import contracttable from './contracttable'
import dept  from '@/components/DeptSelect'
export default {
  components: { eForm, contracttable,dept },
  mixins: [initData, initDict],
  data() {
    return {
      delLoading: false,
      deptId: '',
      queryTypeOptions: [
        { key: 'companyName', display_name: '物业公司名称' }
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
      this.url = 'api/basicsPark'
      const sort = 'id,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const deptId = query.deptId
      if (this.deptId == 1) {
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
        deptId: data.deptId,
        dateOfEstablishment: data.dateOfEstablishment,
        companyName: data.companyName,
        openingTime: data.openingTime,
        occupiedArea: data.occupiedArea,
        floorSpace: data.floorSpace,
        coveredArea: data.coveredArea,
        usableArea: data.usableArea,
        theContractInformation: data.theContractInformation,
        fileName: data.fileName,
      }
      _this.imageFrontUrl=data.fileName
      _this.dialog = true
    },
    // 查看合同详情
    detailsBargain(deptId) {
      if (deptId != null || deptId != '') {
        const _this = this.$refs.contracttable
        basicsParkContract(deptId).then(res => {
          _this.data = res
          /* _this.procurementId = deptId */
          _this.dialog = true
          setTimeout(() => {
            _this.loading = false
          }, _this.time)
        }).catch(err => {
          _this.loading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
