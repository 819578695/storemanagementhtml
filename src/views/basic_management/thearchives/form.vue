<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="园区" >
        <el-input v-model="form.garden" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="成立时间" >
        <el-date-picker v-model="form.dateOfEstablishment" type="date" placeholder="选择日期" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物业公司名称" >
        <el-input v-model="form.companyName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="开园时间" >
        <el-date-picker v-model="form.openingTime" type="date" placeholder="选择日期" style="width: 370px;"/>
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
      <!--上传图片-->
      <el-upload
        :on-preview="handlePictureCardPreview"
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="headers"
        :action="basicsParksc"
        class="upload-demo"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <!-- <el-dialog :append-to-body="true" :visible.sync="dialogVisible">    :auto-upload="false"
          <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, del } from '@/api/thearchives'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      url: '',
      loading: false, dialog: false,
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      dialogsc: false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      pictures: [],
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
  computed: {
    ...mapGetters([
      'basicsParksc'
    ])
  },
  methods: {
    cancel() {
      this.resetForm()
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialogsc = false
    },
    doSubmit() {
      this.form.imageUpload = this.url
      alert(this.url)
      this.$refs
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialogsc = false
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
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(response, file) {
      this.url = file.response.data[0]
      const uid = file.uid
      const id = response.id
      this.pictures.push({ uid, id })
    },
    // 监听上传失败
    handleError(e, file) {
      alert('111')
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    handleBeforeRemove(file) {
      for (let i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].uid === file.uid) {
          del(this.pictures[i].id).then(res => {})
          return true
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
