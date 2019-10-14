<template>
	<div>
		<!--表格渲染-->
	    <el-table
	    	v-loading="loading"
	    	:data= "pevenueIndexData"
	    	size="small"
	    	style="width: 100%;"
	    	:summary-method="getSummaries"
	    	show-summary>
			<el-table-column prop = "tallyLabe" label = "支出类型"/>
			<el-table-column prop = "money" label = "金额"/>
	    </el-table>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import { parseDate } from '@/utils/index'
export default {
  mixins: [initData],
  props: {
  	pevenueIndexData: {
  		type: Array,
	  	required: true
  	}
  } ,
  data() {
    return {
      delLoading: false,
      createTime: [],
      data: [],
      costSum:0,
      look:false,
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
