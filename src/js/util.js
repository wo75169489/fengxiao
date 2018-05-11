export default {
  // 补全数字, 不够 2 位用 0 补全
  formatNumber(number) {
    return number< 10 ? '0' + number : number;
  },

  // 处理 Oct 26, 2017 11:55:47 AM
  // todo 增加 format 定制
  formatDate(str, onlyDate) {
    if (!str) {
      return '';
    }

    var date;
    // 兼容 safari
    if (str.match && str.match(/\d+\-\d+\-\d+ \d+:\d+:\d+/)) {
      date = this.newDate(str);
    } else {
      date = new Date(str);
    }

    var y = date.getFullYear();
    var m = this.formatNumber(date.getMonth() + 1);
    var d = this.formatNumber(date.getDate());
    var h = this.formatNumber(date.getHours());
    var min = this.formatNumber(date.getMinutes());
    var s = this.formatNumber(date.getSeconds());

    if (onlyDate) {
      return `${[y, m, d].join('-')}`;
    } else {
      return `${[y, m, d].join('-')} ${[h, min, s].join(':')}`;
    }
  },

  // dateString 的格式是 xxxx-xx-xx hh:mm:ss
  newDate(dateString) {
    if (dateString.replace) {
      // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
      return new Date(dateString.replace(' ', '\T').concat('.000+08:00'));
    } else {
      return new Date(dateString);
    }
  },
  excludeNull(obj) {
    for(let key in obj) {
      if(obj[key] === null || (typeof obj[key] === 'string' && obj[key].length == 0)) {
        delete obj[key];
      }
    }
  },

  // 分转成元
  //小数位为0直接显示整数，有一位显示一位，有多位显示两位


  filterPrice(data) {
    if(data){
      var yuan = Number(data/100);
      var fixed0 = yuan.toFixed(0);
      var fixed1 = yuan.toFixed(1);
      var fixed2 = yuan.toFixed(2);

      if(Number(fixed0)==Number(fixed1) && Number(fixed1)==Number(fixed2)){
        return fixed0;
      }else if(Number(fixed0)!=Number(fixed1) && Number(fixed1)==Number(fixed2)){
        return fixed1;
      }else{
        return fixed2;
      }
    }else{
      return 0;
    }
  },
  // 元转成分
  filterPriceToFen(data) {
    if (data) {
      return Number(data*100).toFixed(0);
    } else {
      return 0;
    }
  },

  // 截取部分字符，多出部分 ...
  subString(str, length) {
    if (!str) return '';

    if (str.length > length) {
      return str.substr(0, length) + '...';
    } else {
      return str;
    }
  },

  toTTContent(str) {
    return str.replace(new RegExp('<br>','gi'), '\n');
  },
  toHtmlContent(str) {
    return str.replace(new RegExp('\n','gi'), '<br>');
  },

  // 获取第几日的时间，今日GetDateStr(0)，昨日GetDateStr(-1)，前天GetDateStr(-2)
  GetDateStr(AddDayCount, onlyDate) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    var y = dd.getFullYear();
    var m = this.formatNumber(dd.getMonth()+1);
    var d = this.formatNumber(dd.getDate());
    var h = this.formatNumber(dd.getHours());
    var min = this.formatNumber(dd.getMinutes());
    var s = this.formatNumber(dd.getSeconds());
    if (onlyDate) {
      return `${[y, m, d].join('-')}`;
    } else {
      return `${[y, m, d].join('-')} ${[h, min, s].join(':')}`;
    }
  },

  // 获取第几月的时间，今日GetDateStr(0)，昨日GetDateStr(-1)，前天GetDateStr(-2)
  GetMonthStr(AddDayCount, onlyDate) {
    var dd = new Date();
    dd.setMonth(dd.getMonth() + AddDayCount);
    var y = dd.getFullYear();
    var m = this.formatNumber(dd.getMonth()+1);
    var d = this.formatNumber(dd.getDate());
    var h = this.formatNumber(dd.getHours());
    var min = this.formatNumber(dd.getMinutes());
    var s = this.formatNumber(dd.getSeconds());
    if (onlyDate) {
      return `${[y, m, d].join('-')}`;
    } else {
      return `${[y, m, d].join('-')} ${[h, min, s].join(':')}`;
    }
  }
};
