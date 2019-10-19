<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
    	<!-- 日期范围搜索  -->
	    <el-date-picker v-model="query.applicationsDateStart" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>&nbsp;-
	    <el-date-picker v-model="query.applicationsDateEnd" type="date" placeholder="选择日期" style="width: 200px;" class="filter-item"></el-date-picker>
      <!-- 交易类型 -->
      <el-select v-model="query.typeDict" clearable placeholder="交易类型" class="filter-item" style="width: 130px">
        <el-option
		      v-for="(item, index) in typeList"
		      :key="item.id"
		      :label="item.label"
		      :value="item.id">
		    </el-option>
      </el-select>
      <!-- 交易方式 -->
      <el-select v-model="query.tradType" clearable placeholder="交易方式" class="filter-item" style="width: 130px;">
      	<el-option
		      v-for="(item, index) in tradType"
		      :key="item.id"
		      :label="item.label"
		      :value="item.id">
		    </el-option>
      </el-select>
      <!-- 记账类型 -->
      <el-select v-model="query.tallyTypeId" clearable placeholder="收入支出项" class="filter-item" style="width: 130px;">
      	<el-option
      		v-for="(item, index) in tallyTypeList"
      		:key="item.id"
      		:label="item.label"
      		:value="item.id">
      	</el-option>
      </el-select>
      <!-- 部门查询 -->
      <el-select v-model="query.tallyTypeId" clearable placeholder="收入支出项" class="filter-item" style="width: 130px;">
        <el-option
          v-for="(item, index) in tallyTypeList"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!--导出-->
      <div style="display: inline-block;">
        <el-button
          v-permission="['ADMIN','FUNDFLOWING_ALL','FUNDFLOWING_EXPORT']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="download">导出</el-button>
      </div>
      <!-- 全部导出 -->
      <div style="display: inline-block;">
        <el-button
          v-permission="['ADMIN','FUNDFLOWING_ALL','FUNDFLOWING_ExportALL']"
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
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="tradDate" label="交易日期">
        <template slot-scope="scope">
          <span>{{ parseDate(scope.row.tradDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tradTypeLabel" label="交易方式"/>
      <el-table-column prop="money" label="金额"/>
      <el-table-column prop="tallyTypeIdLabel" label="收入支出项"/>
      <el-table-column prop="urrentBalance" label="当前账户余额"/>
      <el-table-column prop="receiptPaymentName" label="收付款人名称"/>
      <el-table-column prop="typeLabel" label="交易类型"/>
      <el-table-column prop="backNum" label="银行账号"/>
      <el-table-column prop="backAccount" label="银行户名"/>
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
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { getFundFlowing } from '@/api/fundFlowing'
import { getDictMap } from '@/api/dictDetail'
import { parseDate } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      tallyTypeList: [],
      typeList: [],
      tradType: [],
      downloadLoading: false,//导出加载
      downloadAllLoading: false,//全部导出加载
      delLoading: false,//删除加载
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getType()
    })
  },
  methods: {
    parseDate,
    checkPermission,
    getType() {
      getDictMap('transaction_type').then(res => {
        this.tallyTypeList = res.transaction_type
      })
      getDictMap('trade_type').then(res => {
      	this.typeList = res.trade_type
      })
      getDictMap('transaction_mode').then(res => {
        this.tradType = res.transaction_mode
      })

    },
    beforeInit() {
      this.url = 'api/fundFlowing'
      const sort = 'id,desc'
      const query = this.query
      const deptId = JSON.parse(sessionStorage.getItem("user")).deptId
      //最高级别查询所有数据
      if(this.deptId==1){
        this.params = { page: this.page, size: this.size, sort: sort,deptId :deptId}
      }
      else{
        this.params = { page: this.page, size: this.size, sort: sort,deptId :deptId}
      }
      //查询的值
      const applicationsDateStart = query.applicationsDateStart
      const applicationsDateEnd = query.applicationsDateEnd
     	//交易方式
     	const tradType = query.tradType
      //交易类型id
      const typeDict = query.typeDict
      //记账类型id
      const tallyTypeId = query.tallyTypeId
      if (typeDict) { this.params['typeDict'] = typeDict }
      if (tallyTypeId) { this.params['tallyTypeId'] = tallyTypeId }
      if (tradType) {this.params['tradType'] = tradType }
      //转化日期格式
      if (applicationsDateStart){
        this.params['tradDateStart'] = parseDate(applicationsDateStart)
      }
      if (applicationsDateEnd){
        this.params['tradDateEnd'] = parseDate(applicationsDateEnd)
      }
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    // 导出
    download() {
       this.downloadLoading = true
      import('@/utils/export2Excel').then(excel => {
        const tHeader = ['交易日期', '交易方式', '金额', '收入支出项', '当前账户余额', '收付款人名称', '交易类型', '银行账号', '银行户名']
        const filterVal = ['tradDate', 'tradTypeLabel', 'money', 'tallyTypeIdLabel', 'urrentBalance', 'receiptPaymentName', 'typeLabel', 'backNum', 'backAccount']
        const data = this.formatJson(filterVal, this.data)
        excel.export_json_to_excel({
          header: tHeader,  //表头
          data,             //数据
          filename: '资金流水' //文件名
        })
        this.downloadLoading = false
      })
    },// 全部导出
    downloadAll() {
     const sort = 'id,desc'
     const query = this.query
     const deptId = JSON.parse(sessionStorage.getItem("user")).deptId
     //查询的值
      const tradDateStart = parseDate(query.applicationsDateStart)
      const tradDateEnd = parseDate(query.applicationsDateEnd)
     const params = { sort: sort, deptId: deptId,tradDateStart: tradDateStart,tradDateEnd: tradDateEnd }
     getFundFlowing(params).then(res => {
       this.downloadAllLoading = true
       this.dataALL = res
       import('@/utils/export2Excel').then(excel => {
				const tHeader = ['园区名称','收入房租', '收入停车费', '收入地磅费', '收入往来款', '收入投资款', '收入水费', '收入电费', '收入其他费用', '收入物业费', '收入赋税成本', '收入违约金', '收入管理费','收入滞纳金','收入卫生费',
							'支出租金','支出水费','支出电费','支出物业费','支出赋税成本','支出其他费用','支出往来款','支出投资款']
        const filterVal = ['deptName','pevenueRentSum', 'parkSum', 'wagonSum', 'contactsSum', 'investmentSum', 'waterSum', 'electricSum', 'otherSum', 'propertySum', 'scotSum', 'penalSum','managementSum',
       'overdueSum','sanitationSum','siteRent','waterRent','electricityRent','propertyRent','taxCost','otherRent','contactsRent','investmentRent']
		    const data = this.formatJson(filterVal, this.dataALL)
		    excel.export_json_to_excel({
		      header: tHeader,
		      data,
		      filename: '资金流水(全)',
		      autoWidth: true

		    })
		    this.downloadAllLoading = false
       })
     })
    },
    //数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'tradDate') {
          return parseDate(v[j])
        }  else {
          return v[j]
        }
      }))
    },
  }
}
</script>

<style scoped>

</style>
