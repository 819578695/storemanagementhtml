<template>
  <el-dialog :append-to-body="true" :before-close="closeDialog" :visible.sync="dialog" :title="isAdd ? '新增部门' : '编辑部门'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="编号" prop="deptNo">
        <el-input v-model="form.deptNo" style="width: 370px;"/>
      </el-form-item>
     <!-- <el-form-item v-if="form.pid !== 0" label="状态" prop="enabled">
        <el-radio v-for="item in dicts" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
      </el-form-item> -->
      <el-form-item v-if="form.pid !== 0" style="margin-bottom: 0px;" label="上级部门">
        <treeselect v-model="form.pid" :options="depts" style="width: 370px;" placeholder="选择上级类目" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getDepts , getDeptAll , getDeptAlls } from '@/api/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
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
      loading: false, dialog: false, depts: [],
      form: {
        id: '',
        name: '',
        pid: 1,
        enabled: 'true',
        deptNo:''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        deptNo: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.pid !== undefined) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()

          } else {
            this.$message({
              message: '上级部门不能为空',
              type: 'warning'
            })
          }
        }
      })
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
        this.setSessionDept()
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
        this.setSessionDept()
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
        name: '',
        pid: 1,
        enabled: 'true',
        deptNo:''
      }
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
 		setSessionDept(){
 			getDeptAlls({ enabled: true }).then(res => {
	        //数组转json   取出时json.parse(xxx)
	      	sessionStorage.setItem("depts",JSON.stringify(res))
  		})
 		},
    closeDialog(){
      this.resetForm()
    }
  }
}
</script>

<style scoped>

</style>
