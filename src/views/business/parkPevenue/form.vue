<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="园区id" >
        <el-input v-model="form.parkId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="收付款信息" >
        <el-input v-model="form.receiptPaymentAccountId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="部门id" >
        <el-input v-model="form.deptId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="档口Id" >
        <el-input v-model="form.archivesMouthsId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="房租" >
        <el-input v-model="form.houseRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物业费" >
        <el-input v-model="form.propertyRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="水电费" >
        <el-input v-model="form.waterElectricityRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="卫生费" >
        <el-input v-model="form.sanitationRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="违约金" >
        <el-input v-model="form.liquidatedRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="滞纳金" >
        <el-input v-model="form.lateRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="地磅费" >
        <el-input v-model="form.groundPoundRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="欠款金额" >
        <el-input v-model="form.arrersRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建时间" >
        <el-input v-model="form.creaeTime" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/parkPevenue'
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
        parkId: '',
        receiptPaymentAccountId: '',
        deptId: '',
        archivesMouthsId: '',
        houseRent: '',
        propertyRent: '',
        waterElectricityRent: '',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
        creaeTime: ''
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
        parkId: '',
        receiptPaymentAccountId: '',
        deptId: '',
        archivesMouthsId: '',
        houseRent: '',
        propertyRent: '',
        waterElectricityRent: '',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
        creaeTime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
