<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="closeDialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="面积(m²)" >
        <el-input v-model="form.area" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="档口/电商楼" prop="dictDetail.id" >
        <el-select v-model="form.dictDetail.id" style="width: 370px;" placeholder="请选择档口类型">
          <el-option
            v-for="(item, index) in dicts"
            :key="item.index"
            :label="item.label"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="房号(门牌号)" >
        <el-input v-model="form.roomnumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="公司名称" >
        <el-input v-model="form.companyname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="物流专线" >
        <el-input v-model="form.logisticsline" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.linkman" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系电话" >
        <el-input v-model="form.phone" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/tenantinformation'

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
      loading: false, dialog: false,
      form: {
        id: '',
        area: '',
        stall: '',
        roomnumber: '',
        companyname: '',
        logisticsline: '',
        linkman: '',
        phone: '',
        dictDetail: {
          id: ''
        }
      },
      rules: {
        dictDetail:
        {
          id: [
            { required: true, message: '请选择档口', trigger: 'change' }
          ]
        }
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
        area: '',
        stall: '',
        roomnumber: '',
        companyname: '',
        logisticsline: '',
        linkman: '',
        phone: '',
        dictDetail: {
          id: ''
        }
      }
    },
    closeDialog() {
      this.resetForm()
    }
  }
}
</script>

<style scoped>

</style>
