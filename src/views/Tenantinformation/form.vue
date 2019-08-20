<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="closeDialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="面积(m²)" >
        <el-input v-model="form.area" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="档口/电商楼" >
        <el-input v-model="form.stall" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="房号(门牌号)" >
        <el-input v-model="form.roomnumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="公司名称" >
        <el-input v-model="form.companyname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物流专线" >
        <el-input v-model="form.logisticsline" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.linkman" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系电话" >
        <el-input v-model="form.phone" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <!-- 上传 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button
        v-permission="['ADMIN','PICTURE_ALL','PICTURE_UPLOAD']"
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="dialogsc = true">上传图片</el-button>
    </div>
    <!--上传图片-->
    <el-dialog :visible.sync="dialogsc" append-to-body width="600px" @close="doSubmitsc">
      <el-upload
        :on-preview="handlePictureCardPreview"
        :before-upload="handleBeforeUpload"
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="headers"
        :file-list="fileList"
        :action="imagesUploadApi"
        list-type="picture-card">
        <i class="el-icon-plus"/>
      </el-upload>
      <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
        <img :src="dialogImageUrl" width="100%" alt="">
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="doSubmitsc">确认</el-button>
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/tenantinformation'
import { getToken } from '@/utils/auth'
import { del } from '@/api/picture'
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
        area: '',
        stall: '',
        roomnumber: '',
        companyname: '',
        logisticsline: '',
        linkman: '',
        phone: ''
      },
      rules: {
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi'
    ])
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
        area: '',
        stall: '',
        roomnumber: '',
        companyname: '',
        logisticsline: '',
        linkman: '',
        phone: ''
      }
    },
    handleSuccess(response, file, fileList) {
      const uid = file.uid
      const id = response.id
      this.pictures.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
      for (let i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].uid === file.uid) {
          del(this.pictures[i].id).then(res => {})
          return true
        }
      }
    },
    handleBeforeUpload(file) {
      alert('1111')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 刷新列表数据
    doSubmitsc() {
      this.fileList = []
      this.dialogVisible = false
      this.dialogImageUrl = ''
      this.dialogsc = false
      this.init()
    },
    // 监听上传失败
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    closeDialog() {
      this.resetForm()
    }
  }
}
</script>

<style scoped>

</style>
