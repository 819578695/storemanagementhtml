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
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="garden" label="园区"/>
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
      <el-table-column prop="theContractInformation" label="合同信息"/>
      <el-table-column prop="imageUpload" label="图片上传">
        <template slot-scope="scope">
          <!-- <a :href="scope.row.imageUpload" style="color: #42b983" target="_blank"><img :src="scope.row.imageUpload" alt="点击打开" class="el-avatar"></a> -->
		  <el-popover
		    placement="right"
		    title=""
		    trigger="click">
		    <i slot="default"><img :src="scope.row.imageUpload"></i>
		    <img slot="reference" :src="scope.row.imageUpload" :alt="scope.row.imageUpload" class="el-avatar">
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
import { del } from '@/api/thearchives'
import { parseDate } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'garden', display_name: '园区' },
        { key: 'companyName', display_name: '物业公司名称' }
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
    checkPermission,
    beforeInit() {
      this.url = 'api/basicsPark'
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
        garden: data.garden,
        dateOfEstablishment: data.dateOfEstablishment,
        companyName: data.companyName,
        openingTime: data.openingTime,
        occupiedArea: data.occupiedArea,
        floorSpace: data.floorSpace,
        coveredArea: data.coveredArea,
        usableArea: data.usableArea,
        theContractInformation: data.theContractInformation,
        imageUpload: data.imageUpload
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
