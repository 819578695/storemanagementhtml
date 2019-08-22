<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px" prop="prop">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="付款账户名称" >
        <el-input v-model="form.paymentAccount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="付款账号" prop="paymentAccountNum">
        <el-input 
        	v-model="form.paymentAccountNum" 
        	style="width: 370px;" 
        	/>
      </el-form-item>
      <el-form-item label="付款开户行" >
        <el-input v-model="form.paymentBank" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="收款账户名称" >
        <el-input v-model="form.receiptAccount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="收款账号" prop="receiptAccountNum">
        <el-input 
        	v-model="form.receiptAccountNum" 
        	style="width: 370px;" 
        	/>
      </el-form-item>
      <el-form-item label="收款开户行" >
        <el-input v-model="form.receiptBank" style="width: 370px;"/>
      </el-form-item>
      <el-input v-model="form.deptId" type="hidden"/>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/receiptPaymentAccount'
import store from '@/store'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
  	var checknum = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入银行卡号"));
      } else if (!this.accountNum(value)) {//引入methods中封装的检查手机格式的方法
        callback(new Error("请输入正确的银行卡号!"));
      } else {
        callback();
      }
    };
    return {
      loading: false, dialog: false,from: {name:'' ,paymentAccountNum:'' ,receiptAccountNum: '' },
      form: {
        name: '',
        deptId: '',
        paymentAccount: '',
        paymentAccountNum: '',
        paymentBank: '',
        receiptAccount: '',
        receiptAccountNum: '',
        receiptBank: ''
      },
      rules:{
      	name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        paymentAccountNum: [
          { required: true, message: '请输入正确的付款账号', trigger: 'blur' ,validator: checknum}
        ],
        receiptAccountNum: [
          { required: true, message: '请输入正确的收款账号', trigger: 'blur' ,validator: checknum}
        ],
      }
    }
  },
  methods: {
  	accountNum(val) {
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
    	this.$refs['form'].validate((valid) => {
		      this.loading = true
    		if(valid){
		      if (this.isAdd) {
		        this.doAdd()
		      } else this.doEdit()
			  }   
      })
    },
    doAdd() {
    	store.dispatch('GetInfo').then(res => {
    		this.form.deptId = res.deptId
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
        name: '',
        deptId: '',
        paymentAccount: '',
        paymentAccountNum: '',
        paymentBank: '',
        receiptAccount: '',
        receiptAccountNum: '',
        receiptBank: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
