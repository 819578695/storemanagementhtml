<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="交易方式" >
        <el-select v-model="form.tradType.id"  placeholder="请选择交易方式" style="width: 370px;" >
          <el-option
            v-for="(item, index) in tradType"
	      		:key="item.id"
	      		:label="item.label"
	      		:value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="余额" >
        <el-input v-model="form.remaining" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/maintarinDetail'
export default {
	created() {
		this.getType()
	},
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
    	tradType: [],
      loading: false, dialog: false,
      form: {
      	id: '',
      	tradType: {id:''},
        maintainId: '',
        remaining: '',
        transactionDate: new Date()
      },
      rules: {
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
    	this.form.maintainId = this.maintainId
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
        tradType: {id:''},
        maintainId: '',
        remaining: '',
        transactionDate: ''
      }
    },
    getType(){
    	this.tradType = this.$parent.tradType
    }
  }
}
</script>

<style scoped>

</style>
