<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" title="收付款信息详情" width="500px">
    <el-form ref="accountform" :model="form"  size="small" label-width="100px" prop="prop">
      <el-form-item label="名称" >
        <el-input disabled v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="付款账户名称" >
        <el-input disabled v-model="form.paymentAccount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item disabled label="付款账号" >
        <el-input disabled
        	v-model="form.paymentAccountNum"
        	style="width: 370px;"
        	/>
      </el-form-item>
      <el-form-item label="付款开户行" >
        <el-input disabled v-model="form.paymentBank" style="width: 370px;"/>
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
