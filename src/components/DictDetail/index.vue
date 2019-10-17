<template>

  <div ref="dictDetail">
      <el-form-item label="付款方式" label-width="100px"  >
        <el-select v-model="dictDetailValue" @change="findbyReceiptPaymentAccount" placeholder="请选择支付方式" >
          <el-option
            v-for="(item, index) in dictMap.transaction_mode"
            :key="item.index"
            :label="item.label"
            :value="item.id"
            />
        </el-select>
      </el-form-item>
  </div>
</template>

<script>
  import { add, edit,payBack } from '@/api/parkPevenue'
  import store from '@/store'
  import { receiptPaymentAccountByDeptId} from '@/api/receiptPaymentAccount'
  import { leaseContractByDeptId} from '@/api/leaseContract'
  export default {
    name: 'dictDetail',
    props: {
      //接收 付款方式集合
      dictMap: {
        type: Object,
        required: true
      },
      //付款方式的验证
      dictDetailProp: {
        type : String
      },
      //付款方式v-model
      value:{
        type: Number,
        default :null
      },
      isAdd: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        user:{
          deptId:''
        },
        dictDetailValue:null,
      }
    },
    mounted(){
     
    },
    watch: {
      //监听页面传值变化
          value: {
              handler(newName, oldName) {
                  if(this.isAdd==false){
                    if(newName!=null){
                      this.dictDetailValue=newName
                      this.findbyReceiptPaymentAccount(this.dictDetailValue)
                    }
                  }
              },
              // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
              immediate: true
            },
      },
    created() {

    },
    methods: {
      selectDictDetail(){
        this.dictDetailValue=this.dictMap.transaction_mode[0].id
        this.findbyReceiptPaymentAccount(this.dictDetailValue)
      },
      //支付的方式联动查询收付款信息
      findbyReceiptPaymentAccount(id) {
           receiptPaymentAccountByDeptId(id,JSON.parse(sessionStorage.getItem("user")).deptId).then(res => {
             //将查询的付款账户集合和账户详情的value值传给父组件
             this.$emit('findbyAccount', res,this.dictDetailValue)//主要是通过$emit方法来实现传参的方式，第一个参数是自定义事件名称，第二个则是要传的数据
           }).catch(err => {
             console.log(err.response.data.message)
           })
      },
    }
  }
  </script>


<style>
</style>
