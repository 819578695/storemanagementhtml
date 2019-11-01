<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
    	<el-divider content-position="left">费用信息</el-divider>
	    	<el-row>
	    		<el-col :span="12">
	    			<el-form-item label="交易日期" prop ="tradDate" >
			        <el-date-picker v-model="form.tradDate" type="date" placeholder="选择日期" style="width: 180px;">
			         </el-date-picker>
			      </el-form-item>
	    		</el-col>	
	    		<el-col :span="12">
	    			<el-form-item label="金额" prop = "money">
			        <el-input v-model="form.money" />
			      </el-form-item>
	    		</el-col>
	    	</el-row>
	    	<el-row>
	    		<el-col :span="12">
	    			<el-form-item label="收入支出项" prop = "tallyType">
			        <el-select v-model="form.tallyType.id"  placeholder="请选择支出类型" >
				        <el-option v-for="item in tallyType"
				        	:key="item.key"
				        	:label="item.value"
				        	:value="item.key"/>
			      	</el-select>
			      </el-form-item>
			    </el-col>
			    <el-col :span="12">
			    	<el-form-item label="交易方式" prop = "tradTypeId">
			      	<el-select v-model="form.tradType.id"  placeholder="请选择交易类型" >
			          <el-option
			            v-for="(item, index) in tradType"
				      		:key="item.id"
				      		:label="item.label"
				      		:value="item.id"/>
			        </el-select>
			      </el-form-item>
			    </el-col>
	    	</el-row>
	    	<el-row>
	    		<el-col :span="12">
	    			<el-form-item label="交易类型" prop="typeDict">
			      	<el-select v-model="form.typeDict.id" placeholder="请选择" >
						    <el-option
						      v-for="(item, index) in typeList"
						      :key="item.id"
						      :label="item.label"
						      :value="item.id">
						    </el-option>
						  </el-select>
			      </el-form-item>
	    		</el-col>
	    	</el-row>
      	<el-row>
      		<el-form-item label="账户总余额" >
						<span>{{money}}</span>
		      </el-form-item>
      	</el-row>
      <el-divider content-position="left">基本信息</el-divider>
      	<el-row>
      		<el-col :span="12">
      			<el-form-item label="收付款人" prop= "receiptPaymentName" label-width="100px" >
			        <el-input v-model="form.receiptPaymentName" />
			      </el-form-item>
      		</el-col>
      	</el-row>
	      <el-row>
	      	<el-col :span="12">
	      		<el-form-item label="银行户名" label-width="100px">
			        <el-input v-model="form.backAccount" />
			      </el-form-item>
	      	</el-col>
	      	<el-col :span="12">
	      		<el-form-item label="银行账号" label-width="100px">
			        <el-input v-model="form.backNum" />
			      </el-form-item>
	      	</el-col>
	      </el-row>
      	
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/fundFlowing'
import { getDictMap } from '@/api/dictDetail'
import { getMoney } from '@/api/maintarinDetail'
import store from '@/store'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
  },
  data() {
  	//验证
  	var moneyNum = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入金额"));
      } else if (!this.moneyNum(value)) {//引入methods中封装的检查格式的方法
        callback(new Error("请输入正确的金额!"));
      } else {
        callback();
      }
    };
    return {
    	//收入支出指定只能为往来款-投资款
    	tallyType:[
        { key: '23', value: '往来款'},
        { key: '24', value: '投资款'}
    	],
    	tradType: [],//交易方式
    	typeList: [],
      loading: false, dialog: false,
      money: '',
      form: {
      	id:'',
        tradDate: '',
        tradType: {id:''},
        money: '',
        tallyType: {id:''},
        receiptPaymentName: '',
        typeDict: {id:''},
        backNum: '',
        backAccount: '',
        dept: {id: ''}
      },
      rules: {
      	money: [{ required: true, trigger: 'blur', validator: moneyNum}],
      	tradDate: [{required: true, trigger: 'blur', message: "请输入日期"}],
      	receiptPaymentName:[{required: true, trigger: 'blur', message:'请输入收付款人名称'}],
      	tallyType:[{required: true, trigger: 'blur', message:'请选择收支项'}],
      	tradTypeId:[{required: true, trigger: 'blur', message:'请选择交易方式'}],
      	typeDict:[{required: true, trigger: 'blur', message:'请选择交易类型'}]
      }
    }
  },
  methods: {
		getTallyType() {
      this.typeList = this.$parent.typeList
      this.tradType = this.$parent.tradType
    },
  	moneyNum(val) {
      if ( !/^\d*$/.test(val)) {
        return false;
      } else {
        return true;
      }
	  },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
    	this.typeList = this.$parent.typeList
      this.tradType = this.$parent.tradType
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
    	store.dispatch('GetInfo').then(res => {
    		this.form.dept.id = res.deptId
	      add(this.form).then(res => {
	        this.resetForm()
	        this.$notify({
	          title: '添加成功',
	          type: 'success',
	          duration: 2500
	        })
	        this.loading = false
	        this.$parent.init()
	      }).catch(err => {
	        this.loading = false
	        console.log(err.response.data.message)
	      })
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        tradDate: '',
        tradType: {id:''},
        money: '',
        tallyType: {id:''} ,
        urrentBalance: '',
        receiptPaymentName: '',
        typeDict: {id:''},
        backNum: '',
        backAccount: ''
      }
    },
    getMoney(){
    	const params = { deptId :JSON.parse(sessionStorage.getItem("user")).deptId, }
			getMoney(params).then(res=>{
    		this.money = res
    	})
    }
  }
}
</script>

<style scoped>

</style>
