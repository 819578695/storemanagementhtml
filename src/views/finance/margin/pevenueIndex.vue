<template>
	<div>
		<!--表格渲染-->
	    <el-table
	    	v-loading="loading"
	    	:data="costs"
	    	size="small"
	    	style="width: 100%;"
	    	:summary-method="getSummaries"
	    	show-summary>
	      <el-table-column prop="createTime" label="时间">
	      	<template slot-scope="scope">
	          <span>{{ parseDate(scope.row.createTime) }}</span>
	        </template>
	      </el-table-column>
	      <el-table-column prop="siteRent" label="场地租金"/>
	      <el-table-column prop="waterRent" label="水费"/>
	      <el-table-column prop="electricityRent" label="电费"/>
	      <el-table-column prop="propertyRent" label="物业费"/>
	      <el-table-column prop="taxCost" label="税赋成本"/>
	      <el-table-column prop="otherRent" label="其他费"/>

	    </el-table>
	    <!--分页组件-->
	    <el-pagination
	      :total="total"
	      style="margin-top: 8px;"
	      :current-page="page + 1"
	      layout="total, prev, pager, next, sizes"
	      @size-change="sizeChange"
	      @current-change="financePageChange"/>
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
      createTime: [],
      costs: [],
      costSum:0,
    }
  },
  created() {
  	this.$nextTick(() => {
  	  this.loading = false
   })
  },
  methods: {
  	parseDate,
  	getSummaries(param){
    	const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] ;
          } else {
            sums[index] = 'N/A';
          }
        });
        //计算
        var costSum =0;
      	sums.forEach(item =>{
      		if(!isNaN(item)){
      			costSum = parseFloat(costSum+item)
      		}
      	})
      	this.costSum = costSum
      	this.$emit("costSum",costSum)
        return sums;
      }
    }
  }
</script>

<style scoped>

</style>
