<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="园区id" >
        <el-input v-model="form.parkId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="档口Id" >
        <el-input v-model="form.archivesMouthsId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="房租" >
        <el-input v-model="form.houseRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物业费" >
        <el-input v-model="form.propertyRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="水电费" >
        <el-input v-model="form.waterElectricityRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="卫生费" >
        <el-input v-model="form.sanitationRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="违约金" >
        <el-input v-model="form.liquidatedRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="滞纳金" >
        <el-input v-model="form.lateRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="地磅费" >
        <el-input v-model="form.groundPoundRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="欠款金额" >
        <el-input v-model="form.arrersRent" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="创建时间" >
        <el-input v-model="form.creaeTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="付款方式" label-width="100px">
        <el-select v-model="paymentTypeId"  placeholder="请选择收付款名称">
          <el-option
            v-for="(item, index) in dicts"
            :key="item.index"
            :label="item.label"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="收付款账户" label-width="100px">
        <el-select v-model="receiptPaymentAccountId"  placeholder="请选择收付款名称">
          <el-option
            v-for="(item, index) in receiptPaymentAccountList"
            :key="item.name"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
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
      paymentTypeId:null,//支付类型下拉框的value值
      receiptPaymentAccountId:null,//下拉框的value值
      receiptPaymentAccountList:[],//查询下拉框的集合
      form: {
        id: '',
        parkId: '',
        receiptPaymentAccountId: '',
        archivesMouthsId: '',
        houseRent: '',
        propertyRent: '',
        waterElectricityRent: '',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
        creaeTime: '',
        dept:{
          id:''
        },
        receiptPaymentAccount: {
          id:''
        },
        archivesmouthsmanagement:{
          id:''
        }
      },
      rules: {
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      //提交时会将下拉选中的value值穿给表单里对应的id带入后台操作
      this.form.receiptPaymentAccount.id = this.receiptPaymentAccountId
       this.form.dictDetail.id = this.paymentTypeId
      this.$refs['form'].validate((valid) => {  //校验表单
        if (valid) {
          if (this.receiptPaymentAccountId === null || this.receiptPaymentAccountId === undefined) {
            this.$message({
              message: '收付款信息不能为空',
              type: 'warning'
            })
          }
          else if  (this.paymentTypeId === null || this.paymentTypeId === undefined) {
            this.$message({
              message: '收付款信息不能为空',
              type: 'warning'
            })
          }
          else {
            this.loading=true;
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          }
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
        receiptPaymentAccountId: '',
        deptId: '',
        archivesMouthsId: '',
        houseRent: '',
        propertyRent: '',
        waterElectricityRent: '',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
        creaeTime: '',
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
      })
    },
  }
}
</script>

<style scoped>

</style>
