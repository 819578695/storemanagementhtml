<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
    	<el-row>
    		<el-col :span="12">
    			<el-form-item label="原账户" >
		        	<el-cascader
		        		ref="myOriginId"
		        		placeholder="请选择账户名称"
							  :options="options"
							  v-model="form.originId"
							  :show-all-levels="false"
							  filterable
							/>
      		</el-form-item>
    		</el-col>
    		
    		<el-col :span="12">
    			<el-form-item label="目标账户" >
		          <el-cascader
		          	ref ="myTargetId"
		        		placeholder="请选择账户名称"
							  :options="options"
							  v-model="form.targetId"
							  :show-all-levels="false"
							  filterable
							/>
      		</el-form-item>
    		</el-col>
    	</el-row>
      
      <el-form-item label="金额" >
        <el-input v-model="form.remaining" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doAdd">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addDetail } from '@/api/maintarinDetail'
import { findByDept } from '@/api/receiptPaymentAccount'
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
    return {
      loading: false, dialog: false,
      form: {
      	deptId: '',
      	originId: '',
      	targetId: '',
      	remaining: ''
      },
      rules: {
      },
      options:[],
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doAdd() {
      addDetail(this.form).then(res => {
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
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
      	deptId: '',
      	originId: '',
      	targetId: '',
      	remaining: ''
      }
    },
    getFundFlowing(deptId){
    	this.form.deptId = deptId
    	findByDept(deptId).then(res => {
    		this.options = res
    	})
    },
  }
}
</script>

<style scoped>

</style>
