<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="门牌号" >
        <el-input v-model="form.housenumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="面积(m²)" >
        <el-input v-model="form.acreage" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="定金" >
        <el-input v-model="form.earnest" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同保证金" >
        <el-input v-model="form.contractmoney" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.contacts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="租用类型" prop="dictDetail.id" >
        <el-select v-model="form.dictDetail.id" style="width: 370px;" placeholder="请选择档口类型">
          <el-option
            v-for="(item, index) in dicts"
            :key="item.index"
            :label="item.label"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <!--上传图片-->
      <el-form-item label="文件名" label-width="100px">
        <el-upload
          v-show="imageFrontUrl == ''"
          :headers="headers"
          :with-credentials="true"
          :action="uploadUrl"
          :before-upload="beforeUpload"
          class="avatar-uploader"
          name="upfile"
          drag
          multiple>
          <i class="el-icon-upload"/>
          <div class="el-upload__text">
            <p v-if="imageFrontFile != ''">图片名称: {{ imageFrontFile.name }}</p>
          <p v-else>点击或拖拽图片上传</p></div>
        </el-upload>
        <div v-show="imageFrontUrl != ''" class="text-xs-center">
          <p v-if="imageFrontFile != ''"><i class="el-icon-folder"/> {{ imageFrontFile.name }}&nbsp;&nbsp;<i class="el-icon-circle-check" style="color: green;"/> </p>
          <!-- <img class="avatar" :src="imageFrontUrl" /> -->
          <el-button outline @click="clearFile">清除</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, uploadPictureExamine } from '@/api/archivesmouthsmanagement'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dicts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      url: '',
      loading: false, dialog: false,
      imageFrontUrl: '', // 文件上传路径
      imageFrontFile: '', // 接受文件上传的参数
      isShowUploading: false, // 文件上传加载中
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      uploadUrl: '', // 文件上传路径
      form: {
        id: '',
        housenumber: '',
        acreage: '',
        earnest: '',
        contractmoney: '',
        contacts: '',
        leasetype: '',
        picturetoview: '',
        dictDetail: {
          id: ''
        },
        dept: {
          id: ''
        }
      },
      rules: {
        dictDetail:
        {
          id: [
            { required: true, message: '请选择档口', trigger: 'change' }
          ]
        }
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
    },
    doSubmit() {
      this.$refs
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
      /* this.dialogVisible = false */
    },
    doAdd() {
      store.dispatch('GetInfo').then(res => {
        this.form.dept.id = res.deptId
        add(this.form).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.imageFrontFile = ''
          this.$parent.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
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
        dictDetail: {
          id: ''
        },
        dept: {
          id: ''
        }
      }
    },
    beforeUpload(file) {
      this.isShowUploading = true
      this.imageFrontFile = file
      const fileName = file.name
      var fileData = new FormData()
      fileData.append('upfile', file)
      const suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase()
      if (suffix == 'jpg' || suffix == 'jpeg' || suffix == 'png' || suffix == 'pdf') {
        // 格式正确,判断大小在1M以内
        const fileSize = file.size
        if (fileSize > 1024 * 1024) {
          // 文件太大
          this.imageFrontUrl = ''
          this.$notify.error({
            title: '文件太大',
            duration: 5,
            closable: true
          })
        } else {
          store.dispatch('GetInfo').then(res => {
            uploadPictureExamine(fileData, 'ZR' + res.deptNo + res.username).then(res => {
              this.form.picturetoview = res
              this.imageFrontUrl = res
              this.isShowUploading = false
              this.$notify({
                title: '上传成功',
                type: 'success',
                duration: 2500
              })
            }).catch(err => {
              this.$notify({
                title: '上传失败',
                type: 'error',
                duration: 2500
              })
            })
          })
        }
      } else {
        this.imageFrontUrl = ''
        // 格式错误
        this.$notify.error({
          title: '文件格式错误',
          duration: 5,
          closable: true
        })
      }
    },
    // 清除文件
    clearFile() {
      this.imageFrontUrl = ''
      this.form.picturetoview = ''
      this.imageFrontFile = ''
    }
  }
}
</script>

<style scoped>
</style>
