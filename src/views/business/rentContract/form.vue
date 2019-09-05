<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-divider content-position="left">合同信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同编号" prop="contractNo">
            <el-input v-model="form.contractNo" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="form.contractName" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="起止日期" prop="startDate">
            <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期" prop="endDate">
            <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="免租期" >
            <el-input v-model="form.rentFreePeriod" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保证金" >
            <el-input v-model="form.deposit" style="width: 170px;" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="form.contractAmount" style="width: 170px;" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件名" >
            <el-input v-model="form.fileName" style="width: 170px;"/>
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
import { add, edit } from '@/api/rentContract'
import store from '@/store'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        id: '',
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        fileName: '',
        contractNo: '',
        dept:{
          id:''
        },
      },
      rules: {//表达验证
        contractNo: [
          { required: true, message: '请输入合同编号', trigger: 'blur' }
        ],
        contractName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' }
        ],
        startDate: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { type: 'date', required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        contractAmount: [
          { required: true, message: '请输入总金额', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {  //校验表单
        if (valid) {
           this.loading=true;
        if (this.isAdd) {
          this.doAdd()
        } else this.doEdit()
        } else {
          return false
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
        dept:{
          id:''
        },
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        fileName: '',
        contractNo: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
