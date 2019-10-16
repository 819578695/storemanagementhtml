<template >
  <div class="app-container">
    <el-dialog ref="eFormxq" :append-to-body="true" :visible.sync="dialogxq" width="1000px" title="详情">
      <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
        <el-table-column prop="roomnumber" label="房号(门牌号)"/>
        <el-table-column prop="stalltypeName" label="档口/电商楼"/>
        <el-table-column prop="area" label="面积(m²)"/>
        <el-table-column prop="pastdue" label="是否启用"/>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'

export default {
  mixins: [initData, initDict],
  data() {
    return {
      loading: false,
      dialogxq: false,
      leasecontractId: '',
      data: []
    }
  }
}

</script>

<style scoped>

</style>
