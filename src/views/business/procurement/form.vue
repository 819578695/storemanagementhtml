<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增采购信息' : '编辑采购信息'" width="600px">
    <el-form  ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="项目编号" label-width="100px" prop="pno">
        <el-input v-model="form.pno" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="项目名称" label-width="100px" prop="projectName">
        <el-input v-model="form.projectName" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="供应商名称" label-width="100px" prop="supplierName">
        <el-input v-model="form.supplierName"  style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="采购说明" label-width="100px">
        <el-input v-model="form.purchaseDescription" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="合同截止日" label-width="100px" prop="contractEndDate">
         <el-date-picker v-model="form.contractEndDate" type="date" placeholder="选择日期">
         </el-date-picker>
      </el-form-item>
      <el-form-item label="合同总金额" label-width="100px">
        <el-input v-model="form.contractAmount" style="width: 270px;" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"/>
      </el-form-item>
      <el-form-item label="付款比例" label-width="100px">
        <el-input v-model="form.paymentRatio" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="申请金额" label-width="100px">
        <el-input v-model="form.applicationsAmount" style="width: 270px;"/>
      </el-form-item>
      <el-form-item label="申请日期" label-width="100px" prop="applicationsDate">
        <el-date-picker
             v-model="form.applicationsDate"
             type="date"
             placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="应付日期" label-width="100px" prop="dueDate">
        <el-date-picker
             v-model="form.dueDate"
             type="date"
             placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="实际付款金额" label-width="100px">
        <el-input v-model="form.actualPaymentAmount" style="width: 270px;" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"/>
      </el-form-item>
      <el-form-item label="实际付款日期" label-width="100px">
        <el-date-picker
             v-model="form.actualPaymentDate"
             type="date"
             placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="付款方式" label-width="100px" prop="dictDetail.id">
        <el-select v-model="form.dictDetail.id"  placeholder="请选择收付款名称">
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
            :key="item.index"
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
import { add, edit } from '@/api/procurementInformation'
import { receiptPaymentAccountByDeptId} from '@/api/receiptPaymentAccount'
import store from '@/store'
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
      receiptPaymentAccountList:[],//查询下拉框的集合
      loading: false,//操作加载
      dialog: false,//模态窗
      form: {    //表单的value值
        pno: '',
        projectName: '',
        supplierName: '',
        purchaseDescription: '',
        contractEndDate: '',
        contractAmount: '',
        paymentRatio: '',
        applicationsAmount: '',
        applicationsDate: '',
        dueDate: '',
        actualPaymentAmount: '',
        actualPaymentDate: '',
        dictDetail: {
          id:''
        },
        receiptPaymentAccount: {
          id:''
        },
      },
      rules: {//表达验证
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
        contractEndDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        dueDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        applicationsDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        actualPaymentDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
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
        if (this.isAdd) {
          this.doAdd()
        } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
        add(this.form).then(res => {
            this.loading = true;
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
        pno: '',
        projectName: '',
        supplierName: '',
        purchaseDescription: '',
        contractEndDate: '',
        contractAmount: '',
        paymentRatio: '',
        applicationsAmount: '',
        applicationsDate: '',
        dueDate: '',
        actualPaymentAmount: '',
        actualPaymentDate: '',
        dictDetail: {
          id:''
        },
        receiptPaymentAccount: {
          id:''
        }
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
