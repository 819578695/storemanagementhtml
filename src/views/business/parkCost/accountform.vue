<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" title="付款信息详情" width="500px">
    <el-form ref="accountform" :model="form"  size="small" label-width="100px" prop="prop">
      <el-form-item label="名称">
        <el-input disabled v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="账户名称">
        <el-input disabled v-model="form.accountName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item disabled label="账号">
        <el-input disabled
        	v-model="form.accountNum"
        	style="width: 370px;"
        	/>
      </el-form-item>
      <el-form-item label="开户行" >
        <el-input disabled v-model="form.bankName" style="width: 370px;"/>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

export default {
  props: {
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
      },
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    }
  }
}
</script>

<style scoped>

</style>
