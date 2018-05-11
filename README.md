# 本恒科技后台管理模板


## 安装依赖
# install dependencies
npm install
##基础路径

// 添加侧边栏

src/config/sidebar.json

// 添加路由

src/router/page.js

##运行
# serve with hot reload at localhost:8080

// 线上环境
npm run dev


// 线上环境
npm run build

windows下运行说明
1，clone下工程直接执行 npm install 会报错，要首先执行 npm install cnpm -g --registry=https://registry.npm.taobao.org
安装cnpm工具
2，通过cnpm命令：cnpm install --save-dev gulp-sass 
3，安装成功后执行 npm install 》》npm run dev


##新增组件说明（持续更新）
#upload组件（基于element,vue-cropper）
//  methods

chooseImg                  图片剪裁结束后的回调  参数为(url,file),url为剪裁后的图片地址,file为剪裁后的图片,需要以FormData格式上传



// props

width                      图片剪裁工具的宽
height                     图片剪裁工具的高
imgUrl                     默认图片
#form组件（基于element,wangEditer）
// 表单组件 包含富文本编辑框


