<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm"  :title="isAdd ? '新增园区收入' : '编辑园区收入'" width="600px"  :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-divider content-position="left">基本信息</el-divider>
        <el-row>
            <el-col :span="24">
            <el-form-item label="合同名称" prop="leaseContract.id">
             <el-select :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2" v-model="form.leaseContract" value-key="id" filterable placeholder="请选择合同名称" @change="findByContractName" style="width: 100%;">
               <el-option  style="width: 600px;"
                 v-for="(item, index) in leaseContractList"
                 :key="item.index"
                 :label="item.contractName"
                 :value="item">
                <span style="float: left">{{ item.contractName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">
                {{ item.houseNumber }}&nbsp;&nbsp;&nbsp;
                {{ item.tenementName }}
                </span>
               </el-option>
             </el-select>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="档口编号">
              <el-select  :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2"  v-model="form.archivesmouthsmanagement.id"  placeholder="请选择档口编号" >
                <el-option
                  :label="archivesmouthsmanagement.houseNumber"
                  :value="archivesmouthsmanagement.id"
                  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租户信息">
              <el-select :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2" v-model="form.tenantinformation.id"  placeholder="请选择租户信息" >
                <el-option
                  :label="tenantinformation.tenementName"
                  :value="tenantinformation.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">费用信息</el-divider>
        <el-row>
          <el-col :span="12">
              <el-form-item label="房租" label-width="100px" prop="houseRent">
                <el-input  max="22" :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.houseRent==null||form.houseRent==0)" v-model="form.houseRent" style="width: 170px;"/>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物业费" label-width="100px" prop="propertyRent">
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.propertyRent==null||form.propertyRent==0)" v-model="form.propertyRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="水费" label-width="100px" prop="waterRent">
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.waterRent==null||form.waterRent==0)" v-model="form.waterRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电费" label-width="100px" prop="electricityRent" >
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.electricityRent==null||form.electricityRent==0)" v-model="form.electricityRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="卫生费" label-width="100px" prop="sanitationRent">
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.sanitationRent==null||form.sanitationRent==0)" v-model="form.sanitationRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="违约金" label-width="100px" prop="liquidatedRent" >
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.liquidatedRent==null||form.liquidatedRent==0)" v-model="form.liquidatedRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="滞纳金" label-width="100px" prop="lateRent" >
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.lateRent==null||form.lateRent==0)" v-model="form.lateRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地磅费" label-width="100px" prop="groundPoundRent" >
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.groundPoundRent==null||form.groundPoundRent==0)" v-model="form.groundPoundRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="停车费" label-width="100px" prop="parkingRent">
               <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.parkingRent==null||form.parkingRent==0)" v-model="form.parkingRent" style="width: 170px;"/>
             </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理费" label-width="100px" prop="managementRent">
              <el-input :disabled="(form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2)&&(form.managementRent==null||form.managementRent==0)" v-model="form.managementRent" style="width: 170px;"/>
            </el-form-item>
          </el-col>
        </el-row>
      <el-divider content-position="left">收款信息</el-divider>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开始日期" >
                <el-date-picker :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2" :picker-options="pickerOptionsStart" v-model="form.startTime" type="date" placeholder="选择日期" style="width: 170px;" >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止日期" >
                <el-date-picker :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2" @change="findByContractRentFreeDate" :picker-options="pickerOptionsEnd" v-model="form.endTime" type="date" placeholder="选择日期" style="width: 170px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <!-- 收款方式 组件-->
<!--             <dictDetail ref="dictDetail"  :is-add="isAdd" :dictMap="dictMap" v-model="form.dictDetail.id"  @findbyAccount="findbyAccount(arguments)" />
 -->              <el-form-item label="收款方式" label-width="100px" prop="dictDetail.id" >
                <el-select :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2"  v-model="form.dictDetail.id" @change="findbyReceiptPaymentAccount" placeholder="请选择支付方式">
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
<!--             <account ref="account" :is-add="isAdd"  v-model="form.receiptPaymentAccount.id" accountProp="receiptPaymentAccount.id" :receiptPaymentAccountList="receiptPaymentAccountList" @accountValue="accountValue" />
 -->          <el-form-item label="收款账户" label-width="100px" prop="receiptPaymentAccount.id">
                <el-select :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2" v-model="form.receiptPaymentAccount.id"  placeholder="请选择收款名称">
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
            <el-col :span="12">
              <el-form-item label="类型" label-width="100px" prop="payType.id">
                <el-select :disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2" v-model="form.payType.id"  placeholder="请选择类型">
                  <el-option  v-for="(item, index) in dictMap.pevenue_status"
                    :key="item.index"
                    :label="item.label"
                    :value="item.id"
                    :disabled="item.value=='PEVENUE_PAYBACK'"
                    />
                </el-select>
              </el-form-item>
            </el-col>
            <el-form-item label="收款时间" label-width="100px" prop="">
            	<el-date-picker 
            		:disabled="form.payType.value=='PEVENUE_UNDER'&&form.isVertify==2" 
            		v-model="form.paymentTime" 
            		type="date" 
            		placeholder="选择日期" 
            		style="width: 170px;" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" >
                <el-input type="textarea" rows="5" v-model="form.pevenueaRemarks"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col :span="4" v-if="!isAdd&&form.payType.value=='PEVENUE_UNDER'" >
          <el-button  style="text-align: left;" :loading="paybackloading" type="success" @click="doPayback">补缴</el-button>
        </el-col>
        <el-col :span="20" v-if="(form.payType.value!='PEVENUE_PAYBACK'||form.payType.value!='PEVENUE_UNDER')&&form.isVertify!=2">
          <el-button type="text" @click="cancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit,payBack } from '@/api/parkPevenue'
import store from '@/store'
import { leaseContractByDeptId} from '@/api/leaseContract'
import { receiptPaymentAccountByDeptId} from '@/api/receiptPaymentAccount'
/* import  account  from '@/components/Account'
import  dictDetail  from '@/components/DictDetail' */
export default {
 /* components: { account,dictDetail }, *///注册组件
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    dictMap: {
      type: Object,
      required: true
    },
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
      dictId:'',//用于保存点击修改传过来的支付方式id
      receiptPaymentAccountId:'',//用于保存点击修改传过来的收付款id
      receiptPaymentAccountList:[],//保存付款账户的集合
      rentFreeStartTime:'',
      rentFreeEndTime:'',
      pickerOptionsStart: {},//控制开始时间禁用
      pickerOptionsEnd: {},//控制结束时间禁用
      loading: false,
      paybackloading:false,
      dialog: false,
      leaseContractList:[], //合同集合
      tenantinformation:{}, // 租户信息
      archivesmouthsmanagement:{},//档口
      form: {
        id: '',
        houseRent: '',
        propertyRent: '',
        waterRent: '',
        startTime:'',
        endTime:'',
        paymentTime:'',
        electricityRent:'',
        sanitationRent: '',
        liquidatedRent: '',
        lateRent: '',
        groundPoundRent: '',
        managementRent:'',
        parkingRent:'',
        leaseContract:{
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
        tenantinformation:{
          id:''
        },
        dictDetail:{
          id:''
        },
        payType:{
          id:'',
          value:''
        },
        isDelete:'0',
        isVertify:0,
        pevenueaRemarks:''
      },
      rules: {
      	houseRent: [ { trigger: 'blur', validator: isMoney } ],
      	propertyRent: [ { trigger: 'blur', validator: isMoney } ],
      	waterRent: [ { trigger: 'blur', validator: isMoney } ],
      	electricityRent: [ { trigger: 'blur', validator: isMoney } ],
      	sanitationRent: [ { trigger: 'blur', validator: isMoney } ],
      	liquidatedRent: [ { trigger: 'blur', validator: isMoney } ],
      	lateRent: [ { trigger: 'blur', validator: isMoney } ],
      	groundPoundRent: [ { trigger: 'blur', validator: isMoney } ],
      	parkingRent: [ { trigger: 'blur', validator: isMoney } ],
      	managementRent: [ { trigger: 'blur', validator: isMoney } ],
        leaseContract:
        {
         id: [
            { required: true, message: '请选择合同名称', trigger: 'change' }
          ],
        },
        receiptPaymentAccount:
        {
         id: [
            { required: true, message: '请选择收款账户', trigger: 'change' }
          ],
        },
        payType:{
         id: [
             { required: true, message: '请选择类型', trigger: 'change' }
          ],
        },
        dictDetail:{
          id: [
              { required: true, message: '请选择支付方式', trigger: 'change' }
           ]
        },
        startTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
      }
    }
  },
  mounted(){
  },
  methods: {
  	isvalidMoney(str){
  		const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      return reg.test(str)
  	},
    /* accountValue(value){
      this.form.receiptPaymentAccount.id = value
    },
    findbyAccount(arr){
      this.receiptPaymentAccountList = arr[0]
      this.form.dictDetail.id =  arr[1]
      if(this.receiptPaymentAccountList.length>0){
          if(this.dictId==this.form.dictDetail.id){
              this.$refs.account.receiptValue=this.receiptPaymentAccountId
          }
          else{
            this.$refs.account.receiptValue=this.receiptPaymentAccountList[0].id
          }
       }
       else{
          this.$refs.account.receiptValue = null
       }
      }, */
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
        //所选择的缴费日期在免租期中则提示
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
    doPayback(){
      //只有欠款才能进行补缴
      if(this.form.payType.value=='PEVENUE_UNDER'){
         this.paybackloading = true
          payBack(this.form).then(res => {
            this.resetForm()
            if(res.payTypeValue=='PEVENUE_PAYBACK'){
              this.$notify({
                title: '补缴成功,您当前无欠款',
                type: 'success',
                duration: 2500
              })
            }
            else{
              this.$notify({
                dangerouslyUseHTMLString: true,
                title:'补缴成功',
                message: "当前欠款<strong style='color:red;'>"+parseFloat(res.houseRent+res.propertyRent+res.waterRent+res.electricityRent+res.sanitationRent+res.lateRent+res.groundPoundRent)+'</strong>',
                type: 'warning',
                duration: 2500
              })
            }
            this.paybackloading = false
            this.$parent.init()
          }).catch(err => {
            this.paybackloading = false
            console.log(err.response.data.message)
          })
      }
      else{
        this.$notify({
          title: '只有欠款才能补缴',
          type: 'error',
          duration: 2500
        })
      }
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
//      this.$refs.dictDetail.selectDictDetail()
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
        managementRent:'',
        parkingRent:'',
        dept:{
          id:''
        },
        leaseContract:{
        },
        tenantinformation:{
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
        payType:{
          id:'',
          value:''
        },
        isDelete:'0',
        isVertify:0,
        startTime:'',
        endTime:'',
        paymentTime:'',
        remark:''
      }
    },
    //查询合同集合
    getReceiptPaymentAccountList() {
      store.dispatch('GetInfo').then(res => {
        leaseContractByDeptId(res.deptId).then(res => {
          this.leaseContractList = res
        }).catch(err => {
          console.log(err.response.data.message)
        })
      })
    },
    //合同联动查询
    findByContractName(item){
      if(item.stallId!=null){
         this.archivesmouthsmanagement.id = item.stallId
         this.form.archivesmouthsmanagement.id = item.stallId
         this.archivesmouthsmanagement.houseNumber = item.houseNumber
      }
      if(item.tenementId!=null){
         this.tenantinformation.id = item.tenementId
         this.form.tenantinformation.id = item.tenementId
         this.tenantinformation.tenementName = item.tenementName
      }
      this.form.startTime=''
      this.form.endTime=''
      this.dateProcessing(item.startDate,item.endDate)
      if(item.rentFreeStartTime!=''&&item.rentFreeEndTime!=''){
        this.rentFreeStartTime=item.rentFreeStartTime
        this.rentFreeEndTime=item.rentFreeEndTime
      }
    },
    //根据合同时间限定收入的时间
    dateProcessing(startDate,endDate){
        this.pickerOptionsStart = Object.assign({},this.pickerOptionsStart,{
          disabledDate:(date)=>{
            return (date.getTime() + 24 * 3600 ) < startDate||(date.getTime() + 24 * 3600 ) > endDate
          }
        }),
         this.pickerOptionsEnd = Object.assign({},this.pickerOptionsEnd,{
           disabledDate:(date)=>{
             //如果开始日期为空,结束日期不得小于合同的开始日期
             if(this.form.startTime==''){
               return (date.getTime() + 24 * 3600 ) > endDate|| (date.getTime() + 24 * 3600 ) < startDate
             }
             //否则结日期小于已经选择的日期
             return (date.getTime() + 24 * 3600 ) > endDate|| (date.getTime() + 24 * 3600 ) < this.form.startTime
           }
         })
      },
      //提示所缴的日期是否为免租期
      findByContractRentFreeDate(){
         const rentFreeStartTime = this.rentFreeStartTime
         const rentFreeEndTime = this.rentFreeEndTime
        if(rentFreeStartTime&&rentFreeEndTime){
          if(this.form.startTime.getTime()>=rentFreeStartTime&&this.form.endTime.getTime() <=rentFreeEndTime){
            this.$notify({
              title: '警告',
              message: '您选择的日期为免租期',
              type: 'warning'
            });
          }
        }
      },
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
  }
}
</script>

<style scoped>

</style>
