<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增园区成本' : '编辑园区成本'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row>
        <!-- <el-col :span="12">
          <el-form-item label="档口编号"  prop="archivesmouthsmanagement.id">
            <el-select v-model="form.archivesmouthsmanagement.id"  placeholder="请选择档口编号" >
              <el-option
                v-for="(item, index) in archivesmouthsmanagementList"
                :key="item.index"
                :label="item.housenumber"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="合同名称" prop="rentContract.id">
           <el-select v-model="form.rentContract.id"  placeholder="请选择合同名称" style="width: 170px;">
             <el-option
               v-for="(item, index) in rentContractList"
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
          <el-form-item label="场地租金">
            <el-input v-model="form.siteRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="水费" >
            <el-input v-model="form.waterRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="电费" >
            <el-input v-model="form.electricityRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="物业费" >
            <el-input v-model="form.propertyRent"  onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="税赋成本" >
            <el-input v-model="form.taxCost" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他费用" >
            <el-input v-model="form.otherRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 170px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left">付款信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始日期" prop="startTime">
            <el-date-picker   v-model="form.startTime" type="date" placeholder="选择日期" style="width: 170px;" >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="截止日期" prop="endTime">
            <el-date-picker  :picker-options="pickerOptionsEnd" v-model="form.endTime" type="date" placeholder="选择日期" style="width: 170px;">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 付款方式 组件-->
          <el-form-item label="付款方式"  prop="dictDetail.id" >
            <el-select  v-model="form.dictDetail.id" @change="findbyReceiptPaymentAccount" placeholder="请选择支付方式">
              <el-option
                v-for="(item, index) in dictMap.transaction_mode"
                :key="item.index"
                :label="item.label"
                :value="item.id"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 付款账户 组件-->
         <el-form-item label="收款账户"  prop="receiptPaymentAccount.id">
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
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" >
            <el-input type="textarea" rows="5" v-model="form.costRemarks"></el-input>
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
import { add, edit } from '@/api/parkCost'
import store from '@/store'
import { receiptPaymentAccountByDeptId} from '@/api/receiptPaymentAccount'
import { rentContractByDeptId} from '@/api/rentContract'
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
  data() {
    return {
      pickerOptionsEnd: {
          disabledDate: (time) => {
            if (this.form.startTime != "") {
              return time.getTime() < new Date(this.form.startTime).getTime();//减去一天的时间代表可以选择同一天;
            }
          }
      },
      dictId:'',//用于保存点击修改传过来的支付方式id
      receiptPaymentAccountId:'',//用于保存点击修改传过来的收付款id
      receiptPaymentAccountList:[],
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
        receiptPaymentAccount: {
          id:''
        },
        startTime:'',
        endTime:'',
        costRemarks:''
      },
      rules: {
        dictDetail:
        {
         id: [
            { required: true, message: '请选择支付方式', trigger: 'change' }
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
    //支付的方式联动查询收付款信息
    findbyReceiptPaymentAccount(id) {
      store.dispatch('GetInfo').then(res => {
         receiptPaymentAccountByDeptId(id,res.deptId).then(res => {
           this.receiptPaymentAccountList=res
             //判断账户集合是否有值
           if(this.receiptPaymentAccountList.length>0){
              //如果交易类型被修改 则默认选中第一个账户
              if(this.dictId!=id){
                this.form.receiptPaymentAccount.id=this.receiptPaymentAccountList[0].id
             }
              //否则显示当前默认的账户
             else{
             this.form.receiptPaymentAccount.id=  this.receiptPaymentAccountId
             }
           }
           //如果没有账户则提示账户不存在
           else{
              this.form.receiptPaymentAccount.id=''
           }

         }).catch(err => {
           console.log(err.response.data.message)
         })
       })
    },
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
        this.$parent.init()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
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
        startTime:'',
        endTime:'',
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
        costRemarks:''
      }
    },
    //查询所有的集合
    getReceiptPaymentAccountList() {
      store.dispatch('GetInfo').then(res => {
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
