<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增出租合同' : '编辑出租合同'" width="600px">
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
          <el-form-item label="起始日期" prop="startDate" >
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
          <el-form-item label="免租开始日期" prop="rentFreeStartTime">
            <el-date-picker :picker-options="pickerOptionsStartFree" v-model="form.rentFreeStartTime" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="免租截止日期" prop="rentFreeEndTime">
            <el-date-picker :picker-options="pickerOptionsEndFree" v-model="form.rentFreeEndTime" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
         <el-form-item label="年租金" prop="contractAmount">
           <el-input v-model="form.contractAmount" style="width: 170px;"/>
         </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="保证金" prop="deposit" >
            <el-input v-model="form.deposit" style="width: 170px;"/>
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
          <el-form-item label="付款金额" prop="payPrice" >
            <el-input v-model="form.payPrice" style="width: 170px;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
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
      <el-divider content-position="left">其他信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="租户信息" prop="tenantinformation.id">
            <el-select v-model="form.tenantinformation"  value-key="id" placeholder="请选择租户信息" style="width: 170px;">
              <el-option
                v-for="(item, index) in tenantinformationList"
                :key="item.index"
                :label="item.linkman"
                :value="item"/>
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
                :value="item.id"
                :disabled="item.tenementName!=null"
                />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">合同附件</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同附件" >
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
            <div class="el-upload__text"><p v-if="imageFrontFile != ''">文件名称: {{ imageFrontFile.name }}</p>
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
    },
    dictMap: {
      type: Object,
      required: true
    }
  },
  computed: {
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
      pickerOptionsStartFree: {
          disabledDate: (time) => {
              if (this.form.endDate != "") {
                  return time.getTime() <  new Date(this.form.startDate).getTime()||time.getTime() > new Date(this.form.endDate).getTime();
            }
         }
      },
      pickerOptionsEndFree: {
          disabledDate: (time) => {
              return time.getTime() < new Date(this.form.rentFreeStartTime).getTime()||time.getTime() > new Date(this.form.endDate).getTime() ;//减去一天的时间代表可以选择同一天;
          }
      },
      imageFrontUrl:'', //文件上传路径
      imageFrontFile: '',//文件上传
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
        tenantinformation: {
        },
        dept:{
          id:''
        },
        archivesmouthsmanagement:{
          id:'',
          houseNumber:''
        },
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        rentFreeStartTime:'',
        rentFreeEndTime:'',
        fileName: '',
        payPrice:'',
        payCycle:{
          id:''
        },
         isEnable:'1',
         remarks: '',
      },
      rules: {
      	deposit: [ { trigger: 'blur', validator: isMoney } ],
      	contractAmount: [ {trigger: 'blur', validator: isMoney } ],
      	payPrice: [ {trigger: 'blur', validator: isMoney} ],
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
         tenantinformation: {
         },
         dept:{
           id:''
         },
         archivesmouthsmanagement:{
           id:'',
           houseNumber:''
         },
        rentFreeStartTime:'',
        rentFreeEndTime:'',
        contractName: '',
        startDate: '',
        endDate: '',
        rentFreePeriod: '',
        deposit: '',
        contractAmount: '',
        fileName: '',
        payPrice:'',
        payCycle:{
          id:''
        },
        isEnable:'1',
        remarks: '',
      }
      this.clearFile()
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
        this.isShowUploading = true
        this.loading=true
        this.imageFrontFile = file
         let fileName = file.name
          this.$store.dispatch('addOldFileName', file.name)//赋值
          var fileData = new FormData()
          fileData.append('upfile', file)
          let suffix = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
            if (suffix == "jpg" || suffix == "jpeg" || suffix == "png" || suffix == "pdf") {
                //格式正确,判断大小在1M以内
                let fileSize = file.size
                if (fileSize > 10240 * 10240) {
                    //文件太大
                    this.imageFrontUrl = ''
                    this.$notify.error({
                        title: '文件太大',
                        duration:2500,
                        closable: true
                    });
                    this.loading= false
                } else {
                  store.dispatch('GetInfo').then(res => {
                    upload(fileData,'CZ'+res.deptNo+res.username).then(res => {
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
                this.imageFrontUrl = ''
                this.loading= false
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
          this.imageFrontUrl = ''
          this.form.fileName = ''
          this.imageFrontFile = ''
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
