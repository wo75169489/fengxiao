<template>
   <div>
    <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" accept="image/png, image/jpeg" :show-file-list="false"
    list-type="picture-card"
      :before-upload="img">
      <img v-if="imgU || imgUrl" :src="imgU || imgUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="isShow" center>
      <vueCropper ref="cropper" :img="cropper.img" :autoCrop="cropper.autoCrop" :autoCropWidth="cropper.autoCropWidth" :autoCropHeight="cropper.autoCropHeight"
        :fixedBox="cropper.fixedBox" style="height:500px;margin:20px 0" :outputType="cropper.type">
      </vueCropper>
      <el-button @click="finish(cropperImgUrl,cropperImgUpload)">生成图片</el-button>
      <el-button @click="isShow = false">取消</el-button>
    </el-dialog>
   </div>
</template>
<script>
import vueCropper from "vue-cropper";
export default {
  name: "imgUpload",
  components: {
    vueCropper
  },
  props: {
    width:{
      type: Number,
      default: 360
    },
    height:{
      type: Number,
      default: 180
    },
    imgUrl:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      isShow: false,
      cropperImgUrl: '',
      cropperImgUpload: '',
      cropper: {
        img: "",
        autoCrop: true,
        autoCropWidth: 360,
        autoCropHeight: 180,
        fixedBox: true,
        type: "png"
      },
      imgUpload: '',
      imgU:''
    };
  },
  methods: {
    img(file) {
      this.cropper.img = URL.createObjectURL(file);
      this.cropperImgUrl = this.propurl || "imgU";
      this.cropperImgUpload = this.propupload || "imgUpload";
      this.cropper.autoCropWidth = this.width,
      this.cropper.autoCropHeight = this.height,
      this.isShow = true;
      return false;
    },
    finish(url, upload) {
      this.$refs.cropper.getCropBlob(data => {
        this[url] = URL.createObjectURL(data);
        // this[upload] = data
        this.$emit('chooseImg',URL.createObjectURL(data),data)
        this.isShow = false;
      });
    }
  }
};
</script>
<style scoped>
.avatar{
  width: 100%;
  height:100%;
}
</style>
