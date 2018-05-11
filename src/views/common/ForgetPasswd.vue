<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-body">
                <h1 style="margin-bottom: 20px;">小程序商家后台</h1>
                <p class="text-muted"></p>
                <div class="input-group mb-3">
                  <span class="input-group-addon"><i class="icon-username"></i>
                  </span>
                  <input v-model="userName" id="username" class="form-control" :class="nameError && 'is-invalid'" placeholder="手机号">
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-addon"><i class="icon-password"></i>
                  </span>
                  <input v-model="password" id="password" type="password" class="form-control" :class="passwordError && 'is-invalid'" placeholder="新密码">
                </div>
                <div class="input-group mb-4">
                  <input v-model="verifyCode" class="form-control" :class="verifyError && 'is-invalid'" placeholder="短信验证码">

                  <el-button size="small" type="primary" v-if="!sending" class="btn-send-code" @click="sendCode">发送短信验证码</el-button>
                  <countdown v-else
                             :time="30000"
                             tag="button"
                             v-on:countdownend="onCountdownEnd"
                             ref="countdown"
                             disabled="disabled"
                             class="el-button el-button--small el-button--primary btn-send-code">
                    <template slot-scope="props">{{ props.seconds }} 秒后重新发送</template>
                  </countdown>

                </div>
                <div class="input-group mb-4">
                  <el-button size="small" type="primary" id="login" @click="reset">重置密码</el-button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  #login{
    width: 100%;
  }
  .btn-send-code{
    margin-left: 10px !important;
    width: 110px !important;
    padding: 0 !important;
  }
  .input-group-addon{
    padding: 10px 15px;
    background: #FFFFFF;
  }
</style>

<script>
  import countdown from '@xkeshi/vue-countdown'
  export default {
    name: 'Login',
    data() {
      return {
        userName: null,
        password: null,
        verifyCode: null,
        nameError: false,
        passwordError: false,
        verifyError: false,
        sending: false,
      }
    },
    computed: {
      requestData: function () {
        return {
          mobile: this.userName,
          password: this.password,
          verify_code: this.verifyCode
        }
      }
    },
    components: {
      countdown
    },
    mounted(){

    },

    watch: {
      userName: function () {
        this.nameError = false;
      },
      password: function () {
        this.passwordError = false;
      },
      verifyCode: function () {
        this.verifyError = false;
      }
    },

    methods: {
      sendCode() {
        lib.api.post({
          api: 'wdzg/common/verify_code/send',
          data: {
            scene: 2,
            type: 1,
            mobile: this.requestData.mobile
          },
          success: () => {
            this.sending = true;
          },
          error: () => {
            this.$message.error('短信发送失败，请重试');
            this.sending = false;
          }
        })
      },

      onCountdownEnd() {
        this.sending = false;
      },

      // 重置密码
      reset() {
        if (this.isAjax) return;
        this.isAjax = true;

        let validated = this._validate();
        let that = this;
        if (validated.success) {
          lib.api.post({
            api: 'wdzg/b/user/password/reset',
            ssl: true,
            data: this.requestData,
            success(data) {
              lib.login.login(data);
            },
            error(data) {
              if (data && data.msg) {
                that.$message.error(data.msg);
              } else {
                that.$message.error('系统开小差了, 请稍后重试!');
              }
            },
            complete() {
              that.isAjax = false;
            }
          });
        } else {
          this.$message.error(validated.msg);
          this.isAjax = false;
        }
      },

      // 判断逻辑
      _validate() {
        // 校验
        if (!this.userName) {
          this.nameError = true;
          return {
            success: false,
            msg: '手机号不能为空'
          }
        }
        if (!/^[0-9]{11}$/.test(this.userName)) {
          this.nameError = true;
          return {
            success: false,
            msg: '手机号格式不正确'
          }
        }
        if(!this.password){
          this.passwordError = true;
          return {
            success: false,
            msg: '密码不能为空'
          }
        }
        if (!this.verifyCode) {
          this.verifyError = true;
          return {
            success: false,
            msg: '验证码不能为空'
          }
        }
        if (!this.verifyCode) {
          this.verifyError = true;
          return {
            success: false,
            msg: '验证码不能为空'
          }
        }
        if (!/^[0-9]{6}$/.test(this.verifyCode)) {
          this.verifyError = true;
          return {
            success: false,
            msg: '请输入6位数的验证码'
          }
        }

        return {
          success: true
        };
      }
    }
  }
</script>

