<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="合同编号" >
        <el-input v-model="form.contractNo" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="租户id" >
        <el-input v-model="form.tenementId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="部门id" >
        <el-input v-model="form.deptId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="档口id" >
        <el-input v-model="form.stallId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同名称" >
        <el-input v-model="form.contractName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="起止日期" >
        <el-input v-model="form.startDate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="截止日期" >
        <el-input v-model="form.endDate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="免租期" >
        <el-input v-model="form.rentFreePeriod" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="保证金" >
        <el-input v-model="form.deposit" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="未缴费用" >
        <el-input v-model="form.unpaidExpenses" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="已缴费用" >
        <el-input v-model="form.paymentedExpenses" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同总金额" >
        <el-input v-model="form.contractAmount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="文件名" >
        <el-input v-model="form.fileName" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/leaseContract'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        contractNo: '',
        tenementId: '',
        deptId: '',
        stallId: '',
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        unpaidExpenses: '',
        paymentedExpenses: '',
        contractAmount: '',
        fileName: ''
      },
      rules: {
      }
    }
  },
  methods: {
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
        contractNo: '',
        tenementId: '',
        deptId: '',
        stallId: '',
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        unpaidExpenses: '',
        paymentedExpenses: '',
        contractAmount: '',
        fileName: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
