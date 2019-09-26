<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-divider content-position="left">合同信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同编号" prop="contractNo">
            <el-input v-model="form.contractNo" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="form.contractName" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="起止日期" prop="startDate">
            <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期" prop="endDate">
            <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="免租期" >
            <el-input v-model="form.rentFreePeriod" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保证金" >
            <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.deposit" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="免租开始日期" prop="rentFreeStartTime">
            <el-date-picker v-model="form.rentFreeStartTime" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="免租截止日期" prop="rentFreeEndTime">
            <el-date-picker v-model="form.rentFreeEndTime" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="form.contractAmount" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">其他信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="租户信息" prop="tenantinformation.id">
            <el-select v-model="form.tenantinformation.id"  placeholder="请选择租户信息" style="width: 170px;">
              <el-option
                v-for="(item, index) in tenantinformationList"
                :key="item.index"
                :label="item.linkman"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="档口编号" prop="archivesmouthsmanagement.id">
            <el-select v-model="form.archivesmouthsmanagement.id"  placeholder="请选择档口编号" style="width: 170px;">
              <el-option
                v-for="(item, index) in archivesmouthsmanagementList"
                :key="item.index"
                :label="item.housenumber"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">合同附件</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同附件" >
          <el-upload
          class="upload-demo"
          v-show="imageFrontUrl == null"
            name="upfile"
            drag
            :headers="headers"
            :with-credentials=true
            :action="uploadUrl"
            :before-upload="beforeUpload"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text"><p v-if="imageFrontFile !== null">文件名称: {{ imageFrontFile.name }}</p>
            <p v-else>点击或拖拽文件上传</p></div>
          </el-upload>
           <div class="text-xs-center" v-show="imageFrontUrl != null">
              <img :src="imageFrontUrl" />
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
import { add, edit} from '@/api/leaseContract'
import store from '@/store'
import { findByDeptIdAndTenementNameIsNull,archivesmouthsmanagementByDeptId} from '@/api/archivesmouthsmanagement'
import { tenantinformationByDeptId} from '@/api/tenantinformation'
import { getToken } from '@/utils/auth'
import { upload } from '@/api/rentContract'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      imageFrontUrl:null, //文件上传路径
      imageFrontFile: null,//文件上传
      isShowUploading: false,//文件上传加载中
      headers: {//设置请求头
               'Authorization': 'Bearer '+ getToken()
            },
      uploadUrl:'',//文件上传路径
      archivesmouthsmanagementList:[],//档口的集合
      tenantinformationList:[],//租户信息集合
      loading: false,
      dialog: false,
      form: {
        id: '',
        contractNo: '',
        tenantinformation: {
          id:''
        },
        dept:{
          id:''
        },
        archivesmouthsmanagement:{
          id:''
        },
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        rentFreeStartTime:'',
        rentFreeEndTime:'',
        fileName: ''
      },
      rules: {
        contractNo: [
          { required: true, message: '请输入合同编号', trigger: 'blur' }
        ],
        contractName: [
          { required: true, message: '请输入合同名称', trigger: 'blur' }
        ],
        startDate: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { type: 'date', required: true, message: '请选择截止日期', trigger: 'change' }
        ],
        contractAmount: [
          { required: true, message: '请输入总金额', trigger: 'blur' }
        ],
        archivesmouthsmanagement:
        {
         id: [
            { required: true, message: '请选择档口编号', trigger: 'change' }
          ],
        },
        tenantinformation:
        {
         id: [
            { required: true, message: '请选择租户信息', trigger: 'change' }
          ],
        },
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
     this.$refs['form'].validate((valid) => {  //校验表单
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
          this.clearFile()
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
        contractNo: '',
         tenantinformation: {
           id:''
         },
         dept:{
           id:''
         },
         archivesmouthsmanagement:{
           id:''
         },
        rentFreeStartTime:'',
        rentFreeEndTime:'',
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        fileName: ''
      }
    },
    //查询所有的集合
    getReceiptPaymentAccountList() {
      store.dispatch('GetInfo').then(res => {
      	tenantinformationByDeptId(res.deptId).then(res => {
      	  this.tenantinformationList = res
      	}).catch(err => {
      	  console.log(err.response.data.message)
      	})
        findByDeptIdAndTenementNameIsNull(res.deptId).then(res => {
          this.archivesmouthsmanagementList = res
        }).catch(err => {
          console.log(err.response.data.message)
        })
      })
    },
    //查询所有的集合
    getByDeptIdAndTenementNameIsNotNullList() {
      store.dispatch('GetInfo').then(res => {
      	tenantinformationByDeptId(res.deptId).then(res => {
      	  this.tenantinformationList = res
      	}).catch(err => {
      	  console.log(err.response.data.message)
      	})
        archivesmouthsmanagementByDeptId(res.deptId).then(res => {
          this.archivesmouthsmanagementList = res
        }).catch(err => {
          console.log(err.response.data.message)
        })
      })
    },
      //文件上传
      beforeUpload(file){
         if(this.form.contractNo==''){
           //表单判断
           this.$notify.error({
               title: '请先填写合同信息',
               duration:2500,
           });
           return;
         }
        this.isShowUploading = true;
        this.imageFrontFile = file;
          let fileName = file.name;
          var fileData = new FormData();
          fileData.append('upfile', file);
          let suffix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
            if (suffix == "jpg" || suffix == "jpeg" || suffix == "png" || suffix == "pdf") {
                //格式正确,判断大小在1M以内
                let fileSize = file.size;
                if (fileSize > 1024 * 1024) {
                    //文件太大
                    this.imageFrontUrl = null;
                    this.$notify.error({
                        title: '文件太大',
                        duration:2500,
                        closable: true
                    });
                } else {
                    upload(fileData,this.form.contractNo).then(res => {
                      this.form.fileName=res
                      this.imageFrontUrl=res
                      this.isShowUploading=false
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
                }
            } else {
                this.imageFrontUrl = null;
                //格式错误
                this.$notify.error({
                    title: '文件格式错误',
                    duration:2500,
                    closable: true
                });
            }
      },
      //清除文件
      clearFile(){
          this.imageFrontUrl = null;
          this.form.fileName = null;
          this.imageFrontFile = null;
      },
  }
}
</script>

<style scoped>

</style>
