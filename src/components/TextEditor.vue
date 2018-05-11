<template>
    <quill-editor
            :options="editorOption"
            ref="myTextEditor"
            class="editor"
            v-model="editorContent" @change="onEditorChange($event)">
        <div id="toolbar" slot="toolbar">
      <span class="ql-formats">
        <button type="button" class="ql-bold"></button>
        <button type="button" class="ql-italic"></button>
        <button type="button" class="ql-underline"></button>
        <button type="button" class="ql-strike"></button>
      </span>
            <span class="ql-formats">
        <button type="button" class="ql-list" value="ordered"></button>
        <button type="button" class="ql-list" value="bullet"></button>
      </span>
            <span class="ql-formats">
        <button type="button" class="ql-indent" value="-1"></button>
        <button type="button" class="ql-indent" value="+1"></button>
      </span>
            <span class="ql-formats">
        <select class="ql-size"></select>
      </span>
            <span class="ql-formats">
        <select class="ql-header"></select>
      </span>
            <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
            <span class="ql-formats">
        <select class="ql-align"></select>
      </span>
            <span class="ql-formats">
        <image-uploader
                v-on:uploaded="handleUpload"
                className="upload-image-btn-box">
          <i class="fa fa-image"></i>
        </image-uploader>
      </span>
            <!--<span class="ql-formats">-->
        <!--<video-uploader-->
                <!--v-on:uploaded="handleUploadVideo"-->
                <!--:allowType="mediaConfig.videoAllowType"-->
                <!--:tip="mediaConfig.videoTip"-->
                <!--:maxSize="mediaConfig.videoMaxSize"-->
                <!--:fileListShow="false"-->
                <!--className="upload-image-btn-box">-->
          <!--<i class="fa fa-video-camera"></i>-->
        <!--</video-uploader>-->
      <!--</span>-->
        </div>
    </quill-editor>
</template>

<style scoped>
    .text-editor-image-box {
        position: relative;
        top: 5px;
    }
</style>

<script>
  import ImageUploader from "./ImageUploader.vue";
  import VideoUploader from "./VideoUploader.vue";

  export default {
    props: {
      content: {
        type: String
      }
    },
    components: {
      ImageUploader,
      VideoUploader
    },
    data() {
      return {
        editorOption: {
          modules: {
            // 参考 http://quilljs.com/docs/formats/#embeds
            toolbar: "#toolbar"
          },
          placeholder: "请输入内容..."
        },
        theme: "snow",
        editorContent: this.content,
        uploadData: {
          // 默认上传参数
          biz_code: "wudizhangguiadmin001",
          user_id: "9999999",
          parent_id: 0
        },
        mediaConfig: {
          videoTip: '格式要求：MP4，大小不超过500M',
          videoAllowType: ['mp4'],
          videoMaxSize: 500
        }
      };
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quill;
      }
    },
    watch: {
      content: function (val) {
        this.editorContent = val;
      },
      editorContent: function (val) {
        this.$emit("contentUpdated", val);
      }
    },
    methods: {
      handleUpload(src) {
        var range = this.editor.getSelection(true);
        var length = range.index;
        this.editor.insertEmbed(length, "image", src);
      },
      handleUploadVideo(src) {
        var range = this.editor.getSelection(true);
        var length = range.index;
        // 把视频也插到图片标签里面
        this.editor.insertEmbed(length, "image", 'https://wdzg-file-pre.oss-cn-hangzhou.aliyuncs.com/open_file2018011814155280305044109.png?video=' + src);
      },

      // 自定义上传
      upload(uploadSetting) {
        lib.api.file({
          api: "wdzg/b/file/image/upload",
          data: {
            name: uploadSetting.file.name,
            file: uploadSetting.file
          },
          success: uploadSetting.onSuccess,
          error: uploadSetting.onError
        });
      },

      onEditorChange({quill, html, text}) {
//        console.log('editor change!', quill, html, text);
//        if(html !== undefined){
//          // 把图片里面包含视频的换成视频标签
//          let txt = html.replace(/<img src="(.*?\.png)\?video=(.*?\.mp4)">/g, "<video width='720' height='400' poster='$1' controls><source src='$2'></video>");
//          console.log(html);
//          console.log(txt);
//          this.editorContent = txt;
//        }
      }
    }
  };
</script>
