<template>
		<el-select :v-permission="permission" @change="findByDept" clearable v-model="deptValue"  placeholder="请选择园区" class="filter-item" style="width: 130px">
		  <el-option
		    v-for="(item, index) in deptList"
		    :key="item.id"
		    :label="item.name"
		    :value="item.id"
		    class="filter-item" @keyup.enter.native="toQuery"
		    />
		</el-select>
</template>

<script>
  import store from '@/store'
  import { getDeptAlls } from '@/api/dept'
  import { leaseContractByDeptId} from '@/api/leaseContract'
  export default {
    name: 'dept',
    props: {
      //权限控制
      permission: {
        type : Array
      },
      //父组件v-model
      value:{
         type : Number,
         default :null
      },
    },
    data() {
      return {
        deptList:[],
        deptValue:null,
      }
    },
    created() {
      //查询部门集合
      getDeptAlls({ enabled: true }).then(res => {
        this.deptList=res
      })
    },
    mounted(){
    },
    watch:{
    },
    methods: {
      //将值传给父组件
      findByDept(id){
        this.$emit('deptValue', id)//主要是通过$emit方法来实现传参的方式，第一个参数是自定义事件名称，第二个则是要传的数据
      },
    }
  }
  </script>


<style>
</style>
