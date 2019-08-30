<template >
  <el-dialog :append-to-body="true" :visible.sync="dialogxq" :before-close="closeDialog" width="500px" title="详情">
    <el-form ref="formxq" :model="form" :rules="rules" :inline="true" size="small" label-width="80px">
      <p>开票信息(选项)</p>
      <el-form-item label="税号:" >
        <label>444</label>
      </el-form-item>
      <el-form-item label="开户行:" label-width="200px" >
        <label>555</label>
      </el-form-item>
      <el-form-item label="开户账号:" >
        <label>666</label>
      </el-form-item>
      <el-form-item label="联系地址:" label-width="200px" >
        <label>777</label>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="cancel">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {

  },
  data() {
    return {
      loading: false,
      dialogxq: false,
      form: {

      },
      rules: {
      }
    }
  },
  computed: {

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
    resetForm() {
      this.dialogxq = false
      this.$refs['formxq'].resetFields()
      this.form = {
        phone: ''
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
