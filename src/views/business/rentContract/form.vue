<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增租入合同' : '编辑租入合同'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-divider content-position="left">合同信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同名称" prop="contractName">
            <el-input v-model="form.contractName" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="起始日期" prop="startDate">
            <el-date-picker :picker-options="pickerOptions0" v-model="form.startDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期" prop="endDate">
            <el-date-picker :picker-options="pickerOptions1" v-model="form.endDate" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="免租期(月)" >
            <el-input v-model="form.rentFreePeriod" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保证金" >
            <el-input v-model="form.deposit" style="width: 170px;" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="付款周期"  prop="payCycle.id">
            <el-select v-model="form.payCycle.id"  placeholder="请选择付款周期" style="width: 170px;">
              <el-option  v-for="(item, index) in dictMap.pay_cycle"
                :key="item.index"
                :label="item.label"
                :value="item.id"
                />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款金额" >
            <el-input v-model="form.payPrice" style="width: 170px;" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="年租金" prop="contractAmount">
            <el-input v-model="form.contractAmount" style="width: 170px;" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"/>
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
          <el-form-item label="备注" >
            <el-input type="textarea" rows="5" v-model="form.remarks"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">合同附件</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="文件名" >
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
import { add, edit ,upload } from '@/api/rentContract'
import store from '@/store'
import { getToken } from '@/utils/auth'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dictMap: {
      type: Object,
      required: true
    }
  },
  created() {
  },
  data() {
    return {
      pickerOptions0: {
          disabledDate: (time) => {
              if (this.form.endDate != "") {
                  return time.getTime() >  new Date(this.form.endDate).getTime();
          }
         }
      },
      pickerOptions1: {
          disabledDate: (time) => {
              return time.getTime() < new Date(this.form.startDate).getTime();//减去一天的时间代表可以选择同一天;
          }
      },
      imageFrontUrl:'', //文件上传路径
      imageFrontFile:'',//接受文件上传的参数
      isShowUploading: false,//文件上传加载中
      headers: {//设置请求头
               'Authorization': 'Bearer '+ getToken()
            },
	    uploadUrl:'',//文件上传路径
      loading: false,
      dialog: false,
      form: {
        id: '',
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        fileName: '',
        remarks: '',
        dept:{
          id:''
        },
        payPrice:'',
        payCycle:{
          id:''
        },
        isEnable:'1'
      },
      rules: {//表达验证
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
        payCycle:
        {
         id: [
            { required: true, message: '请选择周期', trigger: 'change' }
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
        dept:{
          id:''
        },
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        fileName: '',
        remarks: '',
        payPrice:'',
        payCycle:{
          id:''
        },
        isEnable:'1'
      }
      this.clearFile()
    },
    //文件上传
    beforeUpload(file){
      /* if(this.form.contractNo==''){
        //表单判断
        this.$notify.error({
            title: '请先填写合同信息',
            duration:2500,
        });
        return;
      } */
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
            } else {
              store.dispatch('GetInfo').then(res => {
                 upload(fileData,'CG'+res.deptNo+res.username).then(res => {
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
               })
            }
        } else {
            this.imageFrontUrl = '';
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
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
