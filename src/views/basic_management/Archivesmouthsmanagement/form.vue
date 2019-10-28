<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增档口信息' : '编辑档口信息'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="门牌号" prop="housenumber">
            <el-input v-model="form.housenumber" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面积(m²)" prop="acreage">
            <el-input v-model.number="form.acreage" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="定金" >
            <el-input v-model="form.earnest" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同保证金" >
            <el-input v-model="form.contractmoney" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="form.contacts" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="租用类型" prop="dictDetail.id" >
            <el-select v-model="form.dictDetail.id" style="width: 170px;" placeholder="请选择档口类型">
              <el-option
                v-for="(item, index) in dicts"
                :key="item.index"
                :label="item.label"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">图片附件</el-divider>
      <el-row>
        <el-col :span="12">
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
            <div v-if="imageFrontUrl != ''">
              <a  :href="imageFrontUrl" target="_blank" style="font-size: 20px;"><i class="el-icon-folder"></i>
              </a>{{ imageFrontFile.name }}&nbsp;&nbsp;<i class="el-icon-circle-check" style="color: green;">
              </i>
              <!-- <img class="avatar" :src="imageFrontUrl" /> -->
              <el-button outline  @click="clearFile">清除</el-button>
             </div>
          </el-form-item>
        </el-col>
      </el-row>
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
        housenumber: '',
        acreage: '',
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
      	acreage:{  type: 'number', message: '请输入数字' } ,
        housenumber:{
          required: true, message: '请输入门牌号', trigger: 'blur'
        },
        contacts:{
          required: true, message: '请输入联系人', trigger: 'blur'
        },
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
  	isvalidAcreage(str){
  		let reg = /^(\d+\.\d{1,4}|\d+)$/
  		return reg.test(str)
  	},
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
        this.loading=true;
        if (this.isAdd) {
          this.doAdd()
        } else this.doEdit()
        } else {
          return false
        }
      })
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
      this.clearFile()
    },
    beforeUpload(file) {
      this.isShowUploading = true
      this.loading=true
      this.imageFrontFile = file
      const fileName = file.name
      var fileData = new FormData()
      fileData.append('upfile', file)
      const suffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase()
      if (suffix == 'jpg' || suffix == 'jpeg' || suffix == 'png' || suffix == 'pdf') {
        // 格式正确,判断大小在1M以内
        const fileSize = file.size
        if (fileSize > 10240 * 10240) {
          // 文件太大
          this.imageFrontUrl = ''
          this.$notify.error({
            title: '文件太大',
            duration: 5,
            closable: true
          })
          this.loading= false
        } else {
          store.dispatch('GetInfo').then(res => {
            uploadPictureExamine(fileData, 'ZR' + res.deptNo + res.username).then(res => {
              this.form.picturetoview = res
              this.imageFrontUrl = res
              this.loading = false
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
              this.loading = false
            })
          })
        }
      } else {
        this.imageFrontUrl = ''
        this.loading= false
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
