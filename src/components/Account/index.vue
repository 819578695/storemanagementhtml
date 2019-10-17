<template>

  <div ref="account">
      <el-form-item label="账户名称" label-width="100px" :prop="accountProp" >
        <el-select @change="findByAccount" v-model="receiptValue"  placeholder="请选择账户名称" >
          <el-option
            v-for="(item, index) in receiptPaymentAccountList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
  </div>
</template>

<script>
  import store from '@/store'
  import { leaseContractByDeptId} from '@/api/leaseContract'
  export default {
    name: 'account',
    props: {
      //表单验证
      accountProp: {
        type : String
      },
      //父组件传过来的集合
      receiptPaymentAccountList:{
        type : Array
      },
      //父组件v-model
      value:{
         type : Number,
         default :null
      },
      isAdd: {
        type: Boolean,
        required: true
      },
    },
    data() {
      return {
        receiptValue:null,
      }
    },
    created() {
    },
    mounted(){
    },
    watch:{
      value: {
          handler(newName, oldName) {
               this.receiptValue = newName
              //this.receiptValue=this.receiptPaymentAccountList[0].id
          },
          // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
          immediate: true
        },
    },
    methods: {
      selectAccount(){

      },
      //下拉会将id传给父组件用于表单验证
      findByAccount(id){
       this.$emit('accountValue', id)//主要是通过$emit方法来实现传参的方式，第一个参数是自定义事件名称，第二个则是要传的数据
      }
    }
  }
  </script>


<style>
</style>
