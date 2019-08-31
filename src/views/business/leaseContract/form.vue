<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="合同编号" >
        <el-input v-model="form.contractNo" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="租户id" prop="tenantinformation.id">
        <el-select v-model="form.tenantinformation.id"  placeholder="请选择租户信息">
          <el-option
            v-for="(item, index) in tenantinformationList"
            :key="item.index"
            :label="item.linkman"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="档口编号" prop="archivesmouthsmanagement.id">
        <el-select v-model="form.archivesmouthsmanagement.id"  placeholder="请选择档口编号">
          <el-option
            v-for="(item, index) in archivesmouthsmanagementList"
            :key="item.index"
            :label="item.housenumber"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="合同名称" >
        <el-input v-model="form.contractName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="起止日期" >
        <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="截止日期" >
        <el-date-picker v-model="form.endDate" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="免租期" >
        <el-input v-model="form.rentFreePeriod" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="保证金" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.deposit" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同总金额" >
        <el-input v-model="form.contractAmount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="文件名" >
        <el-input v-model="form.fileName" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/leaseContract'
import store from '@/store'
import { archivesmouthsmanagementByDeptId} from '@/api/archivesmouthsmanagement'
import { tenantinformationByDeptId} from '@/api/tenantinformation'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      archivesmouthsmanagementList:[],//档口的集合
      tenantinformationList:[],//租户信息集合
      loading: false, dialog: false,
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
        fileName: ''
      },
      rules: {
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
        archivesmouthsmanagementByDeptId(res.deptId).then(res => {
          this.archivesmouthsmanagementList = res
        }).catch(err => {
          console.log(err.response.data.message)
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
