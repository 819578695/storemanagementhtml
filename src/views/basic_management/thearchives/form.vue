<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增园区档案' : '编辑园区档案'" width="700px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="成立时间" label-width="120px">
            <el-date-picker v-model="form.dateOfEstablishment" type="date" placeholder="选择日期" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物业公司名称" prop="companyName" label-width="120px">
            <el-input v-model="form.companyName" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开园时间" label-width="120px">
            <el-date-picker v-model="form.openingTime" type="date" placeholder="选择日期" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="占用面积" label-width="120px" prop ="occupiedArea">
            <el-input v-model="form.occupiedArea" style="width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="占地面积" label-width="120px" prop ="floorSpace">
            <el-input v-model="form.floorSpace" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="建筑面积" label-width="120px" prop ="coveredArea">
            <el-input v-model="form.coveredArea" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="可使用面积" label-width="120px" prop ="usableArea">
            <el-input v-model="form.usableArea" style="width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">展示图片</el-divider>
      <el-row>
        <el-col :span="12">
          <!--上传图片-->
          <el-form-item label="图片名" label-width="100px">
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
import { add, edit, uploadPicture } from '@/api/thearchives'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
  	const isnumber = (rule, value, callback) => {
      if (!this.isvalidNumber(value) && value ) {
        callback(new Error('请输入正确的面积'))
      } else {
        callback()
      }
    }
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
      fileList: [],
      pictures: [],
      form: {
        id: '',
        /* garden: '', */
        dateOfEstablishment: '',
        companyName: '',
        openingTime: '',
        occupiedArea: '',
        floorSpace: '',
        coveredArea: '',
        usableArea: '',
        theContractInformation: '',
        fileName: '',
        dept: {
          id: ''
        }
      },
      rules: {
        companyName:{
            required: true, message: '请输入物业公司名称', trigger: 'blur'
        },
        occupiedArea: [ { trigger: 'blur', validator: isnumber } ],
        floorSpace: [ {trigger: 'blur', validator: isnumber} ],
        coveredArea: [ {trigger: 'blur', validator: isnumber} ],
        usableArea: [ {trigger: 'blur', validator: isnumber} ],
      }
    }
  },
  computed: {
    ...mapGetters([
      'basicsParksc'
    ])
  },
  methods: {
  	isvalidNumber(str){
  		const reg = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/
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
        /* garden: '', */
        dateOfEstablishment: '',
        companyName: '',
        openingTime: '',
        occupiedArea: '',
        floorSpace: '',
        coveredArea: '',
        usableArea: '',
        theContractInformation: '',
        dept: {
          id: ''
        }
      }
      this.clearFile()
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
        if (fileSize > 10240 * 10240) {
          // 文件太大
          this.imageFrontUrl = ''
          this.$notify.error({
            title: '文件太大',
            duration: 5,
            closable: true
          })
        } else {
          store.dispatch('GetInfo').then(res => {
            uploadPicture(fileData, 'ZR' + res.deptNo + res.username).then(res => {
              this.form.fileName = res
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
      this.form.fileName = ''
      this.imageFrontFile = ''
    }
  }
}
</script>

<style scoped>

</style>
