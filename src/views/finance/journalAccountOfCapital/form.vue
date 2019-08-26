<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="交易日期" >
        <el-date-picker v-model="form.tradDate" type="date" placeholder="选择日期" style="width: 370px;">
         </el-date-picker>
      </el-form-item>
      <el-form-item label="金额" prop = "money">
        <el-input v-model="form.money" style="width: 370px;"/>
      </el-form-item>
      <!--
      	作者：mingkun_niu@126.com
      	时间：2019-08-23
      	描述：当前账户余额应为计算得出的结果
      -->
      <el-form-item label="当前账户余额" >
        <el-input v-model="form.urrentBalance" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="收付款人名称" >
        <el-input v-model="form.receiptPaymentName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="记账类型" >
        <el-select v-model="form.tallyTypeId"  placeholder="请选择记账类型" style="width: 370px;">
	        <el-option 
	      		v-for="(item, index) in tallyTypeList" 
	      		:key="item.id" 
	      		:lable="item.id" 
	      		:value="item.label">
	      	</el-option>
      	</el-select>
      </el-form-item>
      <el-form-item label="交易类型" >
      	<el-select v-model="form.tradTypeId"  placeholder="请选择交易类型" style="width: 370px;">
          <el-option
            v-for="(item, index) in tradTypeList" 
	      		:key="item.id" 
	      		:lable="item.id" 
	      		:value="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" >
      	<el-select v-model="form.type" placeholder="请选择" style="width: 370px;">
			    <el-option
			      v-for="item in types"
			      :key="item.key"
			      :label="item.value"
			      :value="item.value">
			    </el-option>
			  </el-select>
      </el-form-item>
      <el-form-item label="银行账号" >
        <el-input v-model="form.backNum" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="银行户名" >
        <el-input v-model="form.backAccount" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/journalAccountOfCapital'
import { getDictMap } from '@/api/dictDetail'
export default {
	created() {
		this.getTallyType()
	},
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
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
    	tallyTypeList:[],//记账类型
    	tradTypeList: [],//交易类型
    	types: [
				{ key: '0', value: '收入'},
		    { key: '1', value: '支出'}
      ],
      loading: false, dialog: false,from: {money:''},
      form: {
        id: '',
        tradDate: '',
        tradTypeId: '',
        money: '',
        tallyTypeId: '',
        urrentBalance: '',
        receiptPaymentName: '',
        type: '',
        backNum: '',
        backAccount: ''
      },
      rules: {
      	money: [
      		 { required: true, trigger: 'blur', validator: moneyNum}
      	]
      }
    }
  },
  methods: {
  	getTallyType() {
      getDictMap('transaction_mode').then(res => {
        this.tradTypeList = res.transaction_mode
      }).catch(err => {
        console.log(err.response.data.message)
      });
      getDictMap('account_type').then(res => {
        this.tallyTypeList = res.account_type
      }).catch(err => {
        console.log(err.response.data.message)
      })
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
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
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
        tradTypeId: '',
        money: '',
        tallyTypeId: '',
        urrentBalance: '',
        receiptPaymentName: '',
        type: '',
        backNum: '',
        backAccount: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
