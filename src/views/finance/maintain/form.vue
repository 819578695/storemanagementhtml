<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="园区名称" >
        <el-select v-model="form.deptId"  placeholder="请选择园区名称" style="width: 370px;">
	        <el-option v-for="item in depts"
	        	:key="item.id"
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
import { add, edit } from '@/api/maintain'
export default {
	created() {
		this.getDepts()
	},
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      depts: [],
      form: {
        id: '',
        deptId: '',
        remaining: '',
        maintainDetail: ''
      },
      rules: {
      }
    }
  },
  methods: {
  	getDepts(){
      this.depts = JSON.parse(sessionStorage.getItem("depts"))
  	},
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
        deptId: '',
        remaining: '',
        maintainDetail: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
