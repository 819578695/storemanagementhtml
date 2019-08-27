<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="园区" >
        <el-input v-model="form.garden" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="成立时间" >
        <el-input v-model="form.dateOfEstablishment" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物业公司名称" >
        <el-input v-model="form.companyName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开园时间" >
        <el-input v-model="form.openingTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="占用面积" >
        <el-input v-model="form.occupiedArea" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="占地面积" >
        <el-input v-model="form.floorSpace" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="建筑面积" >
        <el-input v-model="form.coveredArea" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="可使用面积" >
        <el-input v-model="form.usableArea" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同信息" >
        <el-input v-model="form.theContractInformation" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="图片上传" >
        <el-input v-model="form.imageUpload" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/basicsPark'
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
        garden: '',
        dateOfEstablishment: '',
        companyName: '',
        openingTime: '',
        occupiedArea: '',
        floorSpace: '',
        coveredArea: '',
        usableArea: '',
        theContractInformation: '',
        imageUpload: ''
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
        garden: '',
        dateOfEstablishment: '',
        companyName: '',
        openingTime: '',
        occupiedArea: '',
        floorSpace: '',
        coveredArea: '',
        usableArea: '',
        theContractInformation: '',
        imageUpload: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
