<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" title="收付款信息详情" width="500px">
    <el-form ref="accountform" :model="form"  size="small" label-width="100px" prop="prop">
      <el-form-item label="名称" prop="name">
        <el-input disabled v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="收款账户名称" >
        <el-input disabled v-model="form.receiptAccount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item disabled label="收款账号" prop="receiptAccountNum">
        <el-input disabled
        	v-model="form.receiptAccountNum"
        	style="width: 370px;"
        	/>
      </el-form-item>
      <el-form-item label="收款开户行" >
        <el-input disabled v-model="form.receiptBank" style="width: 370px;"/>
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
