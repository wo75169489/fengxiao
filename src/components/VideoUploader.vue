<template>
    <div class="video-uploader">
        <el-button size="small" type="primary" id="btn-audio-uploader" v-html="videoUrl ? '更改视频' : '上传视频'"></el-button>
        <h3 class="h3"><strong>{{videoUrl ? waitingTip : ''}}</strong></h3>
        <div class="url">{{videoUrl ? videoUrl.split('/').pop() : ''}}</div>
        <div slot="tip" class="el-upload__tip">{{tip}}</div>
        <el-row v-show="progressShow" class="progress-el">
            <el-progress type="circle" :percentage="percentage" :width="80"></el-progress>
        </el-row>
    </div>
</template>

<style>
    .progress-el {
        text-align: left;
        padding-top: 10px;
    }

    .url{
        color: #5a5e66;
    }

    .h3 {
        display: inline-block;
        padding-left: 10px;
        color: #20a8d8;
    }
</style>

<script>

  import {mapGetters, mapMutations} from 'vuex'

  export default {
    props: {
      videoUrl: {
        type: String,
        default: ''
      },
      tip: {
        type: String,
        default: ''
      },
      maxSize: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        src: '',
        waitingTip: '',
        fileList: [],
        allowType: ['mp4'],
        percentage: 0,
        uploadSetting: null,
        progressShow: false,
        accessid: '',
        accesskey: '',
        host: '',
        policyBase64: '',
        signature: '',
        callbackbody: '',
        key: '',
        expire: 0,
        timestamp: ''
      };
    },
    created() {
    },
    mounted() {
      let that = this;
      var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'btn-audio-uploader',
        multi_selection: false,
        auto_start: false,
        flash_swf_url: '../js/plupload/js/Moxie.swf',
        silverlight_xap_url: '../js/plupload/js/Moxie.xap',
        url: 'http://oss.aliyuncs.com',
        filters: {
          mime_types: [
            {title: "mp4 files", extensions: "mp4"}
          ],
          max_file_size: that.maxSize + 'mb',
          prevent_duplicates: false //不允许选取重复文件
        },

        init: {
          FilesAdded: function (up, files) {
            plupload.each(files, function (file) {
              that.set_upload_param(uploader, file.name, false);
            });
          },

          BeforeUpload: function (up, file) {
            that.percentage = 0;
            that.set_upload_param(up, file.name, true);
          },

          UploadProgress: function (up, file) {
            that.percentage = file.percent;
          },

          FileUploaded: function (up, file, info) {
            var ossUrl = that.host + '/' + that.key;
            that.percentage = 100;
            that.waitingTip = '上传完成！';
            that.progressShow = false;
            that.setMediaUploadStatus(false);
            that.$emit("uploaded", ossUrl);
          },

          Error: function (up, err) {
            if (err.code == -600) {
              let unit = '';
              if (that.maxSize >= 1024) {
                unit = `${that.maxSize / 1024}G`;
              } else {
                unit = `${that.maxSize}MB`;
              }
              that.$message.error(`上传的视频大小不能超过 ${unit}!`);
            }
            else if (err.code == -601) {
              that.$message.error(`上传的视频只能是 ${this.allowType.join(',')} 格式!`);
            }
            else {
              that.$message.error(err.response);
            }
          }
        }
      });
      uploader.init();
    },
    computed: {
      ...mapGetters([
        'mediaUploadStatus'
      ])
    },
    methods: {
      send_request(filename, cb) {
        lib.api.get({
          api: 'wdzg/b/file/upload/auth/get',
          data: {
            filename: filename
          },
          success: (data) => {
            let obj = data.data.file_upload_auth;
            if (obj) {
              cb(obj);
            }
          },
          error: (data) => {
          },
          complete: () => {

          }
        })
      },
      set_upload_param(up, filename, ret) {
        if (ret == false) {
          ret = this.get_signature(filename, up)
        } else {
          this.upload(up);
        }
      },
      get_signature(filename, up) {
        let that = this;
        this.send_request(filename, function (obj) {
          that.host = obj['host']
          that.policyBase64 = obj['policy']
          that.accessid = obj['oss_accesskey_id']
          that.signature = obj['signature']
          that.expire = parseInt(obj['expire'])
          that.callbackbody = obj['callback']
          that.key = obj['filename'];
          that.upload(up);
        })
        return true;
      },
      upload(up) {
        this.new_multipart_params = {
          'key': this.key,
          'policy': this.policyBase64,
          'OSSAccessKeyId': this.accessid,
          'success_action_status': '200', //让服务端返回200,不然，默认会返回204
          'callback': this.callbackbody,
          'signature': this.signature,
        };

        up.setOption({
          'url': this.host,
          'multipart_params': this.new_multipart_params
        });

        this.setMediaUploadStatus(true);

        this.progressShow = true;

        up.start();
      },
      ...mapMutations({
        'setMediaUploadStatus': 'SET_MEDIA_UPLOAD_STATUS'
      })
    }
  };
</script>
