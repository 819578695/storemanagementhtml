<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增采购信息' : '编辑采购信息'" width="600px" :close-on-click-modal="false">
    <el-form  ref="form" :model="form" :rules="rules" size="small" label-width="80px">
       <el-divider content-position="left">项目信息</el-divider>
         <el-row>
           <el-col :span="12">
             <el-form-item label="项目名称" label-width="100px" prop="projectName">
                <el-input v-model="form.projectName" style="width: 150px;" />
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="供应商名称" label-width="100px" prop="supplierName">
               <el-input v-model="form.supplierName" style="width: 150px;" />
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="合同总金额" label-width="100px" prop="contractAmount">
               <el-input v-model="form.contractAmount" style="width: 150px;" />
             </el-form-item>
           </el-col>
           <el-col :span="12">
              <el-form-item label="申请金额" label-width="100px" prop="applicationsAmount">
                <el-input v-model="form.applicationsAmount" style="width: 150px;"/>
              </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="12">
             <el-form-item label="合同截止日" label-width="100px" prop="contractEndDate">
                <el-date-picker v-model="form.contractEndDate" type="date" placeholder="选择日期" style="width: 150px;">
                </el-date-picker>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="是否启用" prop="isEnable">
               <el-radio v-model="form.isEnable" label="1">启用</el-radio>
               <el-radio v-model="form.isEnable" label="2">作废</el-radio>
             </el-form-item>
           </el-col>
         </el-row>
         <el-row>
           <el-col :span="24">
             <el-form-item label="采购说明" label-width="100px">
               <el-input type="textarea" rows="5" v-model="form.purchaseDescription"/>
             </el-form-item>
           </el-col>
         </el-row>
         <el-divider content-position="left">合同附件</el-divider>
         <el-row>
           <el-col :span="12">
             <el-form-item label="文件" >
               <el-upload
                 class="avatar-uploader"
                 v-show="imageFrontUrl == ''"
                 name="upfile"
                 drag
                 :headers="headers"
                 :with-credentials=true
                 :action="uploadUrl"
                 :before-upload="beforeUpload"
                 multiple>
                 <i class="el-icon-upload"></i>
                 <div class="el-upload__text">
                 <p v-if="imageFrontFile != ''">文件名称: {{ imageFrontFile.name }}</p>
                 <p v-else>点击或拖拽文件上传</p></div>
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
import { add, edit } from '@/api/procurementInformation'
import { receiptPaymentAccountByDeptId} from '@/api/receiptPaymentAccount'
import store from '@/store'
import { upload } from '@/api/rentContract'
import { getToken } from '@/utils/auth'
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
  	const isMoney = (rule, value, callback) => {
      if (!this.isvalidMoney(value) && value ) {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
    }
    return {
      imageFrontUrl:'', //文件上传路径
      imageFrontFile:'',//接受文件上传的参数
      isShowUploading: false,//文件上传加载中
      headers: {//设置请求头
               'Authorization': 'Bearer '+ getToken()
            },
      uploadUrl:'',//文件上传路径
      receiptPaymentAccountList:[],//查询下拉框的集合
      loading: false,//操作加载
      dialog: false,//模态窗
      form: {    //表单的value值
        projectName: '',
        supplierName: '',
        purchaseDescription: '',
        contractEndDate: '',
        contractAmount: '',
        applicationsAmount: '',
        fileName: '',
        dept:{
          id:''
        },
        isEnable:'1'
      },
      rules: {//表达验证
      	contractAmount: [ { trigger: 'blur', validator: isMoney } ],
      	applicationsAmount: [ { trigger: 'blur', validator: isMoney } ],
        pno: [
          { required: true, message: '请输入项目编号', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        purchaseDescription: [
          { required: true, message: '请输入采购说明', trigger: 'blur' }
        ],
        contractEndDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        applicationsDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
      }
    }
  },
  methods: {
  	isvalidMoney(str){
  		const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      return reg.test(str)
  	},
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
           this.$notify({
             title: '添加成功',
             type: 'success',
             duration: 2500
           })
           this.loading = false
           this.imageFrontFile=''
           this.$parent.init()
         }).catch(err => {
           this.loading = false
           console.log(err.response.data.message)
         })
        })
      },
    doEdit() {
         edit(this.form).then(res => {
           this.loading = true;
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
        projectName: '',
        supplierName: '',
        purchaseDescription: '',
        contractEndDate: '',
        contractAmount: '',
        paymentRatio: '',
        applicationsAmount: '',
        dueDate: '',
        actualPaymentAmount: '',
        actualPaymentDate: '',
        dept:{
          id:''
        },
        isEnable:'1'
      }
      this.clearFile()
    },
    //文件上传
    beforeUpload(file){
      this.loading=true
      this.isShowUploading = true;
      this.imageFrontFile = file;
        let fileName = file.name;
        var fileData = new FormData();
        fileData.append('upfile', file);
        let suffix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
        if (suffix == "jpg" || suffix == "jpeg" || suffix == "png" || suffix == "pdf") {
            //格式正确,判断大小在1M以内
            let fileSize = file.size;
            if (fileSize > 10240 * 10240) {
                //文件太大
                this.imageFrontUrl = '';
                this.$notify.error({
                    title: '文件太大',
                    duration:5,
                    closable: true
                });
                this.loading= false
            } else {
              store.dispatch('GetInfo').then(res => {
                 upload(fileData,'ZR'+res.deptNo+res.username).then(res => {
                   this.form.fileName=res
                   this.imageFrontUrl=res
                   this.isShowUploading=false
                   this.loading= false
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
                     this.loading= false
                 })
               })
            }
        } else {
            this.imageFrontUrl = '';
            this.loading= false
            //格式错误
            this.$notify.error({
                title: '文件格式错误',
                duration:5,
                closable: true
            });
        }
    },
    //清除文件
    clearFile(){
        this.imageFrontUrl = '';
        this.form.fileName = '';
        this.imageFrontFile = '';
    },
  }
}
</script>

<style scoped>

</style>
