<template>
	<div>
		<!--表格渲染-->
	    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
	      <el-table-column prop="siteRent" label="场地租金"/>
	      <el-table-column prop="waterRent" label="水费"/>
	      <el-table-column prop="electricityRent" label="电费"/>
	      <el-table-column prop="propertyRent" label="物业费"/>
	      <el-table-column prop="taxCost" label="税赋成本"/>
	      <el-table-column prop="otherRent" label="其他费"/>
	      <el-table-column prop="createTime" label="时间">
	      	<template slot-scope="scope">
	          <span>{{ parseDate(scope.row.createTime) }}</span>
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
	</div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseDate } from '@/utils/index'
export default {
  components: {  },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      createTime: []
    }
  },
  created() {
  	this.$nextTick(() => {
  	  this.loading = false
      this.init()
   })
  },
  methods: {
  	parseDate,
  	getType(){
  	  this.init()
  	},
    beforeInit() {
      this.url = 'api/parkCost'
      const sort = 'id,desc'
   	  return true
      this.params = { page: this.page, size: this.size}
    }
  }
}
</script>

<style scoped>

</style>