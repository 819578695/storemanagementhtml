<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-divider content-position="left">付款信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="实际付款金额" label-width="100px">
              <el-input v-model="form.actualPaymentAmount" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')"  style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际付款日期" label-width="100px">
              <el-date-picker
                   v-model="form.actualPaymentDate"
                   type="date"
                   placeholder="选择日期"
                   style="width: 150px;"
                   >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="付款比例" label-width="100px">
              <el-input v-model="form.paymentRatio" style="width: 150px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应付日期" label-width="100px">
              <el-date-picker
                   v-model="form.dueDate"
                   type="date"
                   placeholder="选择日期"
                   style="width: 150px;"
                   >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="付款方式" label-width="100px" prop="dictDetail.id">
              <el-select v-model="form.dictDetail.id"  placeholder="请选择收付款名称" style="width: 150px;">
                <el-option
                  v-for="(item, index) in dicts"
                  :key="item.index"
                  :label="item.label"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收付款账户" label-width="100px" prop="receiptPaymentAccount.id">
              <el-select v-model="form.receiptPaymentAccount.id"  placeholder="请选择收付款名称" style="width: 150px;">
                <el-option
                  v-for="(item, index) in receiptPaymentAccountList"
                  :key="item.index"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="付款说明" >
              <el-input type="textarea" rows="5" v-model="form.paymentDescription"></el-input>
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
import { add, edit } from '@/api/procurementPaymentInfo'
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
      loading: false,
      dialog: false,
      receiptPaymentAccountList:[],//查询下拉框的集合
      form: {
        id: '',
        procurementInformation: {
           id:''
         },
        actualPaymentAmount: '',
        actualPaymentDate: '',
        paymentDescription: '',
        paymentRatio: '',
        dueDate: '',
        dictDetail: {
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
        receiptPaymentAccount:
        {
         id: [
            { required: true, message: '请选择收付款账户', trigger: 'change' }
          ],
        },
        actualPaymentDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        dueDate: [
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
      this.loading = true
       if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.findbyProcurementId()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
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
        this.$parent.findbyProcurementId()
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
        procurementInformation: {
          id:''
        },
        actualPaymentAmount: '',
        actualPaymentDate: '',
        paymentType: '',
        receiptPaymentAccountId: '',
        createTime: '',
        paymentDescription: '',
        paymentRatio: '',
        dueDate: '',
        dictDetail: {
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
      })
    },
  }
}
</script>

<style scoped>

</style>
