<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="园区名称" prop="basicsPark.id">
       <el-select v-model="form.basicsPark.id"  placeholder="请选择园区">
         <el-option
           v-for="(item, index) in basicsParkList"
           :key="item.index"
           :label="item.garden"
           :value="item.id"/>
       </el-select>
      </el-form-item>
      <el-form-item label="档口编号" label-width="100px" prop="archivesmouthsmanagement.id">
        <el-select v-model="form.archivesmouthsmanagement.id"  placeholder="请选择档口编号">
          <el-option
            v-for="(item, index) in archivesmouthsmanagementList"
            :key="item.index"
            :label="item.housenumber"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="房租" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.houseRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="物业费" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.propertyRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="水电费" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.waterElectricityRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="卫生费" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.sanitationRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="违约金" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.liquidatedRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="滞纳金" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.lateRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="地磅费" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.groundPoundRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="欠款金额" label-width="100px" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.arrersRent" style="width: 170px;"/>
      </el-form-item>
      <el-form-item label="付款方式" label-width="100px" prop="dictDetail.id">
        <el-select v-model="form.dictDetail.id"  placeholder="请选择支付方式">
          <el-option
            v-for="(item, index) in dicts"
            :key="item.index"
            :label="item.label"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="收付款账户" label-width="100px" prop="receiptPaymentAccount.id">
        <el-select v-model="form.receiptPaymentAccount.id"  placeholder="请选择收付款名称">
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
import { archivesmouthsmanagementByDeptId} from '@/api/archivesmouthsmanagement'
import { basicsParkByDeptId} from '@/api/thearchives'
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
      receiptPaymentAccountList:[],
      archivesmouthsmanagementList:[],//档口的集合
      basicsParkList:[],//园区集合
      form: {
        id: '',
        houseRent: '',
        propertyRent: '',
        waterElectricityRent: '',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
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
        basicsPark:{
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
        dictDetail:
        {
         id: [
            { required: true, message: '请选择支付方式', trigger: 'change' }
          ],
        },
        receiptPaymentAccount:
        {
         id: [
            { required: true, message: '请选择收付款账户', trigger: 'change' }
          ],
        },
        basicsPark:
        {
         id: [
            { required: true, message: '请选择园区', trigger: 'change' }
          ],
        }
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
        waterElectricityRent: '',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        arrersRent: '',
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
        basicsPark:{
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
        basicsParkByDeptId(res.deptId).then(res => {
          this.basicsParkList = res
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
