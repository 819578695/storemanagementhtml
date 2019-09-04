<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="园区名称" prop="basicsPark.id">
       <el-select v-model="form.basicsPark.id"  placeholder="请选择园区">
         <el-option
           v-for="(item, index) in basicsParkList"
           :key="item.index"
           :label="item.garden"
           :value="item.id"/>
       </el-select>
      </el-form-item>
      <el-form-item label="合同名称" prop="rentContract.id">
       <el-select v-model="form.rentContract.id"  placeholder="请选择合同名称">
         <el-option
           v-for="(item, index) in rentContractList"
           :key="item.index"
           :label="item.contractName"
           :value="item.id"/>
       </el-select>
      </el-form-item>
      <el-form-item label="场地租金">
        <el-input v-model="form.siteRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="水费" >
        <el-input v-model="form.waterRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="电费" >
        <el-input v-model="form.electricityRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物业费" >
        <el-input v-model="form.propertyRent"  onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="税赋成本" >
        <el-input v-model="form.taxCost" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="其他费用" >
        <el-input v-model="form.otherRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="付款方式" prop="dictDetail.id">
        <el-select v-model="form.dictDetail.id"  placeholder="请选择付款方式" >
          <el-option
            v-for="(item, index) in dicts"
            :key="item.index"
            :label="item.label"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="收付款账户" label-width="100px" prop="receiptPaymentAccount.id">
        <el-select v-model="form.receiptPaymentAccount.id"  placeholder="请选择付款名称">
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
import { add, edit } from '@/api/parkCost'
import store from '@/store'
import { basicsParkByDeptId} from '@/api/thearchives'
import { receiptPaymentAccountByDeptId} from '@/api/receiptPaymentAccount'
import { rentContractByDeptId} from '@/api/rentContract'
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
      receiptPaymentAccountList:[],
      basicsParkList:[],//园区集合
      rentContractList:[],//合同
      loading: false,
       dialog: false,
      form: {
        id: '',
        siteRent: '',
        waterRent: '',
        electricityRent: '',
        propertyRent: '',
        taxCost: '',
        otherRent: '',
        rentContract:{
          id:''
        },
        dictDetail: {
          id:''
        },
        dept:{
          id:''
        },
        basicsPark:{
          id:''
        },
        receiptPaymentAccount: {
          id:''
        },
      },
      rules: {
        dictDetail:
        {
         id: [
            { required: true, message: '请选择支付方式', trigger: 'change' }
          ],
        },
        basicsPark:
        {
         id: [
            { required: true, message: '请选择园区', trigger: 'change' }
          ],
        },
        rentContract:
        {
         id: [
            { required: true, message: '请选择合同名称', trigger: 'change' }
          ],
        },
        receiptPaymentAccount:
        {
         id: [
            { required: true, message: '请选择付款账户', trigger: 'change' }
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
        basicsPark:{
           id:''
         },
         rentContract:{
           id:''
         },
        siteRent: '',
        waterRent: '',
        electricityRent: '',
        propertyRent: '',
        taxCost: '',
        otherRent: '',
        createTime: '',
        dictDetail: {
          id:''
        },
        dept:{
          id:''
        },
        receiptPaymentAccount: {
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
        basicsParkByDeptId(res.deptId).then(res => {
          this.basicsParkList = res
        }).catch(err => {
          console.log(err.response.data.message)
        })
        rentContractByDeptId(res.deptId).then(res => {
          this.rentContractList = res
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
