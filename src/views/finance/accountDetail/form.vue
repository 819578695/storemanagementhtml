<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
    	<el-form-item label="名称" prop ="name">
      	<el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
    	<el-divider content-position="left">账户信息</el-divider>
    	<el-row>
    		<el-col :span="12">
	    		<el-form-item label="账户名称">
	      		<el-input v-model="form.accountName" style="width: 160px;"/>
	      	</el-form-item>
	      </el-col>
	      <el-col :span="12">
	      	<el-form-item label="账号" prop="accountNum">
		      	<el-input v-model="form.accountNum" style="width: 160px;"/>
		      </el-form-item>
	      </el-col>
	      <el-col :span="12">
	      	<el-form-item label="开户行">
		      	<el-input v-model="form.bankName" style="width: 160px;"/>
		      </el-form-item>
	      </el-col>
      	<el-col :span="12">
	      	<el-form-item label="金额" prop="remaining">
		        <el-input v-model="form.remaining" style="width: 160px;"/>
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
import { add, edit } from '@/api/receiptPaymentAccount'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    init: {
    	type: Function
    }
  },
  data() {
  	const validAccountNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入对应账号'))
      } else {
        callback()
      }
    }
  	const validRemaining = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入金额'))
      } else if (!this.isvalidRemaining(value)) {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
    }
  	const validName = (rule, value, callback) => {
      if (!this.isvalidRemaining(value) && value ) {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
    }
    return {
      loading: false, dialog: false,
      form: {
      	accountName: '',
        accountNum: '',
        bankName: '',
        name: '',
        remaining: '',
        detailId: '',
      },
      rules: {
      	remaining: [ { required: true, trigger: 'blur', validator: validRemaining } ],
      	accountNum: [ { trigger: 'blur', validator: validAccountNum } ],
      	name: [ { required: true, trigger: 'blur', message: "请输入名称(在收入支出页面显示)" } ]
      },
    }
  },
  methods: {
  	isvalidRemaining(str) {
  		//金额保留两位小数
      const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      return reg.test(str)
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
    	if(this.form.name == ''){
    		this.cancel()
    		alert("请填写名称")
    		this.loading = false
    	}else{
	      add(this.form).then(res => {
	        this.resetForm()
	        this.$notify({
	          title: '添加成功',
	          type: 'success',
	          duration: 2500
	        })
	        this.loading = false
	        this.init()
	      }).catch(err => {
	        this.loading = false
	        console.log(err.response.data.message)
	      })
	    }
    },
    doEdit() {
      edit(this.form).then(res => {
      	this.init()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.resetForm()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
      	accountName: '',
        accountNum: '',
        bankName: '',
        name:'',
        remaining:'',
      }
    }
  }
}
</script>

<style scoped>

</style>
