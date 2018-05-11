<template>
    <div class="index">
    <div class="flex flexend header">
      <div class="cnt"><el-input placeholder="根据用户昵称进行搜索" v-model="params.search"></el-input></div>
      <div class="cnt"><el-button @click="search_s">提交</el-button></div>
    </div>
    <el-table :data="user" border style="width: 100%">
      <el-table-column header-align="center" align="center"  label="用户">
        <template slot-scope="scope">
              <div class="box">
                <img class="user_img" :src="scope.row.headimg" alt="">
                <span>{{scope.row.nickname}}</span>
              </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="num_join" label="参与次数">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="num_win" label="中奖次数">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="num_push" label="信息推送次数">
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="created" label="首次进入时间">
      </el-table-column>
    </el-table>
    <el-pagination style="margin:60px" @size-change="size_change" @current-change="current_change" :current-page="params.page" :page-sizes="[20,50,80,100]" :page-size="params.size" layout="total, sizes, prev, pager, next, jumper" :total="count">
    </el-pagination>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script>
import Util from "@/js/util";
export default {
  data() {
    return {
      user: [],//用户数据
      count:0,//用户的总数量
      params:{
        page: 1,
        size:20,
        search:''
      },
      img_url:this.$store.state.img
    };
  },
  created() {
    this.init()
  },
  methods: {
    // 从服务器活动到用户的信息
    init(){
      this.user = []
        this.$http({url:`${this.$store.state.api}user_list`,params:this.params}).then(function(result) {
        if(result.body.advertising.message == 'success'){
          this.user = result.body.advertising.data;
          this.count = Number(result.body.advertising.count);
        }else{
          this.$message.error(`系统错误`);
        }
        }).catch(function(error){
        this.$message.error(`${error.status}  系统错误`);
      });
    },
    // 关键字搜索
    search_s(){
      this.params.page=1
      this.init()
    },
    // 每页的最大数量发生变化
    size_change(val){
        this.params.size = val
        this.init()
    },
    // 页码发生变化
    current_change(val){
        this.params.page = val
        this.init()
    }
  }
};
</script>
<style scoped>
.user_img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.flex {
  display: flex;
}
.flexend {
  justify-content: flex-end;
}
.header {
  margin: 10px 0;
}
.el-input {
  margin-right: 30px;
}
.cnt {
  margin: 0 10px;
}
.box img{
   /* width: 40%; */
}
.box span{
  width: 60%;
  display: inline-block;
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
</style>



