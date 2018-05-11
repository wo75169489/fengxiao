<template>
    <el-upload
            :class="className || 'avatar-uploader'"
            action="http://media.mockuai.com/upload.php"
            name="file"
            :multiple="true"
            :http-request="upload"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload">
        <slot>
      <span v-show="!progressShow">
          <div title="点击更改" class="upload-preview-box" v-if="imgSrc" :style="{backgroundImage: `url(${imgSrc})`}">
            <i class="el-icon-circle-close-outline" @click.stop.prevent="removeImage"></i>
          </div>
          <i title="点击上传" v-else class="el-icon-plus avatar-uploader-icon">上传图片</i>
      </span>
            <el-row v-show="progressShow" class="progress-el">
                <el-progress type="circle" class="progress" :percentage="percentage" :width="50"></el-progress>
            </el-row>
            <div slot="tip" class="el-upload__tip" v-html="tip" v-if="tip"></div>
        </slot>
    </el-upload>
</template>

<style lang="scss">
    .avatar-uploader {
        font-size: 0px;
        .el-upload {
            width: 120px !important;
            height: 120px !important;
            display: flex;
            margin-right: 10px;
            overflow: initial !important;
            position: relative;
            .progress-el {
                position: absolute;
                top: 28px;
                left: 35px;
                .progress {
                    width: 50px;
                    height: 50px;
                    background-color: transparent;
                }
            }
        }
        .el-upload__tip {
            display: inline-block;
            line-height: 24px;
            font-size: 14px;
            color: #C5C5C5;
            vertical-align: bottom;
        }
    }

    .avatar-uploader-icon {
        width: 120px;
        height: 120px !important;
        line-height: 120px !important;
    }

    .upload-preview-box {
        width: 118px !important;
        height: 118px !important;
        position: relative;
        .el-icon-circle-close-outline {
            position: absolute;
            right: -8px;
            top: -8px;
            font-size: 20px;
            background: #FFFFFF;
            cursor: pointer;
            border-radius: 50%;
        }
    }
</style>

<script>
  const content_type = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png'
  }
  export default {
    props: ["uploadedImg", "tip", "className", "currentIndex", "defaultImg"],
    data() {
      return {
        imgSrc: null,
        percentage: 0,
        uploadSetting: null,
        progressShow: false,
        allowType: ['jpg','jpeg','png']
      };
    },
    created() {
    },
    mounted() {
      this.imgSrc = this.uploadedImg;
    },
    watch: {
      uploadedImg(val) {
        this.imgSrc = val;
      }
    },

    methods: {
      beforeUpload(file) {
        let allowContentType = this.getContentType();
        if (allowContentType.indexOf(file.type) === -1) {
          this.$message.error(`上传的图片只能是 ${this.allowType.join('，')} 格式!`);
          return false;
        }
      },
      handleSuccess(res, file) {
        var ossUrl = res.data.url;
        this.imgSrc = URL.createObjectURL(file.raw);
        this.percentage = 100;
        this.progressShow = false;
        this.$emit("uploaded", ossUrl, this.currentIndex);
      },
      upload(uploadSetting) {
        let self = this;
        this.progressShow = true;
        this.percentage = 0;
        this.imgSrc = '';
        lib.api.file({
          api: "wdzg/b/file/image/upload",
          progress: function (event) {
            var loaded = event.loaded;
            var tot = event.total;
            // 文件上传完成了，服务端还是未返回，所以把进度条最多设成99%，请求完成后再设置成100%
            if (loaded === tot) {
              self.percentage = 99;
            } else {
              self.percentage = Math.floor(100 * loaded / tot);
            }
          },
          data: {
            name: uploadSetting.file.name,
            file: uploadSetting.file
          },
          success: uploadSetting.onSuccess,
          error: uploadSetting.onError
        });
      },
      getContentType() {
        let allowContentType = [];
        Object.keys(content_type).map((key) => {
          this.allowType.map((val) => {
            if (key === val) {
              allowContentType.push(content_type[key])
            }
          })
        })
        return allowContentType;
      },
      removeImage() {
        if (this.defaultImg) {
          this.imgSrc = this.defaultImg;
        } else {
          this.imgSrc = '';
        }
        this.$emit("uploaded", this.imgSrc, this.currentIndex);
      }
    }
  };
</script>
