<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="门牌号" >
        <el-input v-model="form.housenumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="面积" >
        <el-input v-model="form.acreage" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="定金" >
        <el-input v-model="form.earnest" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同保证金" >
        <el-input v-model="form.contractmoney" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.contacts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="租用类型" >
        <el-input v-model="form.leasetype" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/archivesmouthsmanagement'
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
        housenumber: '',
        acreage: '',
        earnest: '',
        contractmoney: '',
        contacts: '',
        leasetype: '',
        picturetoview: ''
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
        housenumber: '',
        acreage: '',
        earnest: '',
        contractmoney: '',
        contacts: '',
        leasetype: '',
        picturetoview: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
