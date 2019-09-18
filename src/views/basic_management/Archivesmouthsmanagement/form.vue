<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :before-close="resetForm" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="门牌号" >
        <el-input v-model="form.housenumber" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="面积(m²)" >
        <el-input v-model="form.acreage" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="定金" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.earnest" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="合同保证金" >
        <el-input onkeyup="this.value=this.value.replace(/^(\d*\.?\d{0,2}).*/,'$1')" v-model="form.contractmoney" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="联系人" >
        <el-input v-model="form.contacts" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="租用类型" prop="dictDetail.id" >
        <el-select v-model="form.dictDetail.id" style="width: 370px;" placeholder="请选择档口类型">
          <el-option
            v-for="(item, index) in dicts"
            :key="item.index"
            :label="item.label"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <!--上传图片-->
      <el-upload
        :before-remove="handleBeforeRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :headers="headers"
        :action="basicsParksc"
        class="upload-demo"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, del } from '@/api/archivesmouthsmanagement'
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
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
      url: '',
      loading: false, dialog: false,
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      form: {
        id: '',
        housenumber: '',
        acreage: '',
        earnest: '',
        contractmoney: '',
        contacts: '',
        leasetype: '',
        picturetoview: '',
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
  computed: {
    ...mapGetters([
      'basicsParksc'
    ])
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.form.picturetoview = this.url
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
      this.dialogVisible = false
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
        housenumber: '',
        acreage: '',
        earnest: '',
        contractmoney: '',
        contacts: '',
        leasetype: '',
        picturetoview: '',
        dictDetail: {
          id: ''
        }
      }
    },
    handleSuccess(response, file) {
      this.url = file.response.data[0]
      const uid = file.uid
      const id = response.id
      this.pictures.push({ uid, id })
    },
    // 监听上传失败
    handleError(e, file) {
      alert('111')
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    handleBeforeRemove(file) {
      for (let i = 0; i < this.pictures.length; i++) {
        if (this.pictures[i].uid === file.uid) {
          del(this.pictures[i].id).then(res => {})
          return true
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
