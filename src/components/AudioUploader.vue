<template>
  <el-upload
    action="http://media.mockuai.com/upload.php"
    name="file"
    :http-request="upload"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-remove="remove"
    :before-upload="beforeUpload">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只支持mp3、wma格式的音乐，最大不超过10M</div>
  </el-upload>
</template>

<script>
  export default {
    props: ['uploadedAudio'],
    data() {
      return {
        audioFile: null,
      };
    },
    created() {},
    mounted() {
      this.audioFile = this.uploadedImg;
    },
    watch: {
      uploadedAudio(val) {
        this.audioFile = val;
      }
    },
    methods: {
      reupload() {
        return true;
      },
      beforeUpload(file) {
        var ismp3OrWma = false;
        if(file.type == 'audio/mp3' || file.type == 'audio/m4a' || file.type == 'audio/aac' || file.type == 'audio/wav'){
          ismp3OrWma = true;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!ismp3OrWma) {
          this.$message.error('上传音频只能是 m4a, aac, mp3, wav 格式!');
        }
        if (!isLt10M) {
          this.$message.error('上传音频大小不能超过 10MB!');
        }
        return ismp3OrWma && isLt10M;
      },
      handleSuccess(res, file) {
        debugger;
        var ossUrl = res.data.url;
        this.audioFile = URL.createObjectURL(file.raw);

        this.$emit("uploaded", ossUrl);
      },
      remove() {
        this.$emit("uploaded", '');
      },
      upload(uploadSetting) {
        lib.api.file({
          api: "wdzg/b/file/audio/upload",
          data: {
            name: uploadSetting.file.name,
            file: uploadSetting.file
          },
          success: uploadSetting.onSuccess,
          error: uploadSetting.onError
        });
      }
    }
  };
</script>
