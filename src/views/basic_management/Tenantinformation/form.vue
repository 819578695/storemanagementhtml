<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="closeDialog" :title="isAdd ? '新增租户信息' : '编辑租户信息'" width="600px" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司名称" >
            <el-input v-model="form.companyname" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租用用途" >
            <el-input v-model="form.logisticsline" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" prop="linkman">
            <el-input v-model="form.linkman" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" style="width: 170px;"/>
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
import { add, edit } from '@/api/tenantinformation'
import store from '@/store'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
  	const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
  	const validLinkman = (rule, value, callback) => {
  		if(!value){
  			callback(new Error('请输入联系人名称'))
  		} else if(!this.validLinkman(value)){
  			callback(new Error('请输入正确的联系人名称'))
  		} else {
        callback()
      }
  	}
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        companyname: '',
        logisticsline: '',
        linkman: '',
        phone: null,
        dept: {
          id: ''
        },
        dictDetail: {
          id: ''
        }
      },
      rules: {
        dictDetail:
        {
          id: [
            { required: true, message: '请选择档口', trigger: 'change' }
          ]
        },
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ],
        linkman: [ { required: true, trigger: 'blur', validator: validLinkman} ]
      }
    }
  },
  methods: {
  	isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      return reg.test(str)
    },
    validLinkman(str){
    	const reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
    	return reg.test(str)
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
    		if(valid){
    			this.loading = true
		      if (this.isAdd) {
		        this.doAdd()
		      } else this.doEdit()
			  }   
      })
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
        companyname: '',
        logisticsline: '',
        linkman: '',
        phone: null,
        dept: {
          id: ''
        },
        dictDetail: {
          id: ''
        }
      }
    },
    closeDialog() {
      this.resetForm()
    }
  }
}
</script>

<style scoped>

</style>
