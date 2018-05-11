<template>
    <div>
        <el-form :model="data" label-width="80px" ref="form" label-position="left">
            <el-form-item label="标题"  :rules="[{ required: true, message: '必填项不能为空', trigger: 'blur'},
            {min:1, max:50, message:'长度不得超过50个字符', trigger:'blur'}]" prop="title">
                <el-input v-model="data.title"></el-input>
            </el-form-item>
            <el-form-item label="内容" :rules="[{ required: true, message: '必填项不能为空', trigger: 'blur'},
            {min:1, max:30000, message:'长度不得超过30000个字符', trigger:'blur'}]" prop="content">
                <div id="editorElem">
                </div>
            </el-form-item>
            <slot name="img">
                 
            </slot>
            <slot name="number">
                 
            </slot>
            <slot name="price">
                 
            </slot>
            <slot name="submit">
                 
            </slot>
        </el-form>
    </div>
</template>
<style>
.w-e-text-container{
        z-index: 900 !important;
        
    }
    .w-e-menu{
        z-index: 905 !important;
    }
</style>
<script>
import E from "wangeditor";
export default {
  props: {
    data:{
      type: Object,
      default:()=>{},
    }
  },
  data() {
    return {
       show:true,
    //    loading:this.$route.query.id?true:false
    };
  },
  mounted() {
    this.editor = new E("#editorElem");
    this.editor.customConfig.onchange = html => {
    //   this.editorContent = html;
    };
    this.editor.customConfig.menus = [
    'head',  // 标题
    'bold',  // 粗体
    'fontSize',  // 字号
    'fontName',  // 字体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    'image',  // 插入图片
    'table',  // 表格
    'video',  // 插入视频
    'code',  // 插入代码
    ]
    this.editor.customConfig.uploadImgServer = '/formValue/uploadWangEditorImg'
    this.editor.customConfig.uploadFileName = 'file'
    this.editor.create()  
    this.$watch("value", function () {
    if(this.value&&this.show&&this.$route.query.id){
          this.editor.txt.html(this.value)
          this.show = false
      }
    })
    this.$watch("data", function () {
    //   if(this.loading == true){
    //       this.loading = false
    //   }
    })
    this.editor.change = ()=>{
        this.data.content = this.editor.txt.html()
    }
  },
  computed:{
      value:function(){
          return this.data.content
      }
  }
};
</script>
