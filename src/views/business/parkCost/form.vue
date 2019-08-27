<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="园区id" prop="parkId">
        <el-input v-model="form.parkId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="场地租金" prop="siteRent">
        <el-input v-model="form.siteRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="水费" prop="waterRent">
        <el-input v-model="form.waterRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="电费" prop="electricityRent">
        <el-input v-model="form.electricityRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物业费" prop="propertyRent">
        <el-input v-model="form.propertyRent"  onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="税赋成本" prop="taxCost">
        <el-input v-model="form.taxCost" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="其他费用" prop="otherRent">
        <el-input v-model="form.otherRent" onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-select v-model="paymentTypeId"  placeholder="请选择收付款名称">
          <el-option
            v-for="(item, index) in dicts"
            :key="item.index"
            :label="item.label"
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
      paymentTypeId:null,//支付类型下拉框的value值
      loading: false,
       dialog: false,
      form: {
        id: '',
        parkId: '',
        siteRent: '',
        waterRent: '',
        electricityRent: '',
        propertyRent: '',
        taxCost: '',
        otherRent: '',
        dictDetail: {
          id:''
        },
        dept:{
          id:''
        }
      },
      rules: {
        siteRent: [
          { required: true, message: '请输入租金', trigger: 'blur' }
        ],
        waterRent: [
          { required: true, message: '请输入水费', trigger: 'blur' }
        ],
        electricityRent: [
          { required: true, message: '请输入电费', trigger: 'blur' }
        ],
        propertyRent: [
          { required: true, message: '请输入物业费', trigger: 'blur' }
        ],
        taxCost: [
          { required: true, message: '请输入税赋成本', trigger: 'blur' }
        ],
        otherRent: [
          { required: true, message: '请输入其他费用', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.dictDetail.id = this.paymentTypeId
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.paymentTypeId === null || this.paymentTypeId === undefined) {
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
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
