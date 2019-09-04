<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog"  :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="档口编号"  prop="archivesmouthsmanagement.id">
              <el-select v-model="form.archivesmouthsmanagement.id"  placeholder="请选择档口编号" >
                <el-option
                  v-for="(item, index) in archivesmouthsmanagementList"
                  :key="item.index"
                  :label="item.housenumber"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="leaseContract.id">
             <el-select v-model="form.leaseContract.id"  placeholder="请选择合同名称">
               <el-option
                 v-for="(item, index) in leaseContractList"
                 :key="item.index"
                 :label="item.contractName"
                 :value="item.id"/>
             </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">费用信息</el-divider>
        <el-row>
          <el-col :span="12">
              <el-form-item label="房租" label-width="100px" >
                <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.houseRent" style="width: 170px;"/>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物业费" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.propertyRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="水费" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.waterRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电费" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.electricityRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="卫生费" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.sanitationRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违约金" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.liquidatedRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="滞纳金" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.lateRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地磅费" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.groundPoundRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="欠款金额" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.arrersRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理费" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.managementRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="停车费" label-width="100px" >
              <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.parkingRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
      <el-divider content-position="left">收款信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款方式" label-width="100px" prop="dictDetail.id">
                <el-select v-model="form.dictDetail.id"  placeholder="请选择支付方式">
                  <el-option
                    v-for="(item, index) in dicts"
                    :key="item.index"
                    :label="item.label"
                    :value="item.id"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款账户" label-width="100px" prop="receiptPaymentAccount.id">
                <el-select v-model="form.receiptPaymentAccount.id"  placeholder="请选择收款名称">
                  <el-option
                    v-for="(item, index) in receiptPaymentAccountList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
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
import { add, edit } from '@/api/parkPevenue'
import store from '@/store'
import { receiptPaymentAccountByDeptId} from '@/api/receiptPaymentAccount'
import { archivesmouthsmanagementByDeptId} from '@/api/archivesmouthsmanagement'
import { leaseContractByDeptId} from '@/api/leaseContract'
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
      loading: false,
      dialog: false,
      leaseContractList:[],
      receiptPaymentAccountList:[],
      archivesmouthsmanagementList:[],//档口的集合
      form: {
        id: '',
        houseRent: '',
        propertyRent: '',
        waterRent: '',
        electricityRent:'',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
        managementRent:'',
        parkingRent:'',
        leaseContract:{
          id:''
        },
        dept:{
          id:''
        },
        receiptPaymentAccount: {
          id:''
        },
        archivesmouthsmanagement:{
          id:''
        },
        dictDetail:{
          id:''
        },
      },
      rules: {
        archivesmouthsmanagement:
        {
         id: [
            { required: true, message: '请选择档口编号', trigger: 'change' }
          ],
        },
        leaseContract:
        {
         id: [
            { required: true, message: '请选择合同名称', trigger: 'change' }
          ],
        },
        dictDetail:
        {
         id: [
            { required: true, message: '请选择支付方式', trigger: 'change' }
          ],
        },
        receiptPaymentAccount:
        {
         id: [
            { required: true, message: '请选择收款账户', trigger: 'change' }
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
        parkId: '',
        houseRent: '',
        propertyRent: '',
        waterRent: '',
        electricityRent:'',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
        managementRent:'',
        parkingRent:'',
        dept:{
          id:''
        },
        leaseContract:{
          id:''
        },
        receiptPaymentAccount: {
          id:''
        },
        archivesmouthsmanagement:{
          id:''
        },
        dictDetail:{
          id:''
        },
      }
    },
    //查询所有的集合
    getReceiptPaymentAccountList() {
      store.dispatch('GetInfo').then(res => {
      	receiptPaymentAccountByDeptId(res.deptId).then(res => {
      	  this.receiptPaymentAccountList = res
      	}).catch(err => {
      	  console.log(err.response.data.message)
      	})
        archivesmouthsmanagementByDeptId(res.deptId).then(res => {
          this.archivesmouthsmanagementList = res
        }).catch(err => {
          console.log(err.response.data.message)
        })
        leaseContractByDeptId(res.deptId).then(res => {
          this.leaseContractList = res
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
