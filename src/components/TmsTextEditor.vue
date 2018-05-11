<template>
    <quill-editor
            :options="editorOption"
            ref="myTextEditor"
            class="editor"
            v-model="editorContent">
        <div id="toolbar" slot="toolbar">
      <span class="ql-formats">
        <button type="button" class="ql-bold"></button>
        <button type="button" class="ql-italic"></button>
      </span>
            <span class="ql-formats">
        <select class="ql-size"></select>
      </span>
            <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
            <span class="ql-formats">
        <select class="ql-align"></select>
      </span>
        </div>
    </quill-editor>
</template>

<style lang="scss">
    .text-editor-image-box {
        position: relative;
        top: 5px;
    }

    .ql-editor {

        .ql-size-small {
            font-size: 10px !important;
        }

        .ql-size-large {
            font-size: 14px !important;
        }

        .ql-size-huge {
            font-size: 18px !important;
        }

    }
</style>

<script>

  export default {
    props: {
      content: {
        type: String
      }
    },
    components: {},
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
    }
  };
</script>
