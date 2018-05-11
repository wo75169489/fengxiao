const tmsMixin = {
  methods: {
    // 检查页面是否被修改
    checkModuleListAdd(item) {
      let flag = true;
      if (this.pageData && this.pageData.module_list) {
        this.pageData.module_list.map((val) => {
          if (val.module_code === 'bottom_nav' && item.module_code === 'bottom_nav') {
            this.$message.error('一个页面只能有一个底部导航');
            flag = false;
          }
          if (val.module_code === 'top_nav' && item.module_code === 'top_nav') {
            this.$message.error('一个页面只能有一个顶部导航');
            flag = false;
          }
          if (val.module_code === 'form' && item.module_code === 'form') {
            this.$message.error('一个页面只能有一个表单');
            flag = false;
          }
        })
      }
      return flag;
    }
  }
}

const orderListMixin = {
  methods: {
    // 获取优惠信息
    getDiscountInfo(order) {
      let txt = '', discount_amount = '';
      if (order.discount_amount) {
        discount_amount = order.discount_amount / 100;
        if (order.discount_list) {
          order.discount_list.map((val, index) => {
            txt += index === 1 ? '，' : '';
            txt += val.discount_type === 1 ? '会员' : '红包';
            txt += '￥' + (val.discount_amount / 100);
          });
          txt = `￥${discount_amount} (${txt})`;
        } else {
          txt += '￥0';
        }
      } else {
        txt += '￥0';
      }
      return txt;
    }
  }
}

export {
  orderListMixin,
  tmsMixin
}