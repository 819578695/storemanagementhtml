<template>
  <div class="app-container">
    <el-dialog ref="contracttable" :append-to-body="true" :visible.sync="dialog" title="合同图片查看" width="1000px">
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column prop="contractNo" label="合同编号"/>
        <el-table-column prop="contractName" label="合同名称"/>
        <el-table-column prop="fileName" label="合同详情">
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
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
export default {
  mixins: [initData, initDict], // 初始化数据
  data() {
    return {
      loading: false,
      dialog: false,
      data: []
    }
  }
}
</script>

<style scoped>

</style>
