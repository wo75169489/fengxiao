function excludeNull(obj) {
  let newobj={};
  $.extend(true,newobj,obj)
  for(let key in newobj) {
    if(newobj[key] === null || (typeof newobj[key] === 'string' && newobj[key].length == 0)) {
      delete newobj[key];
    }
  }
  return newobj;
}
function updata(oldobj,newobj){
  for(let key in oldobj){
    if(newobj.hasOwnProperty(key)){
      if(typeof newobj[key]!="object"){
        oldobj[key]=newobj[key];
      }else{
        let child={};
        $.extend(true,child, newobj[key]);
        oldobj[key]=child;
      }
    }
  }
}
// 处理 Oct 26, 2017 11:55:47 AM
function formatDate(str) {
  const date = new Date(str);
  const y = date.getFullYear();
  const m = date.getMonth() + 1<=9?('0'+date.getMonth() + 1):date.getMonth() + 1;
  const d = date.getDate()<=9?('0'+date.getDate()):date.getDate();
  const h = date.getHours()<=9?('0'+date.getHours()):date.getHours();
  const min = date.getMinutes()<=9?('0'+date.getMinutes()):date.getMinutes();
  const s = date.getSeconds()<=9?('0'+date.getSeconds()):date.getSeconds();

  return `${[y, m, d].join('-')} ${[h, min, s].join(':')}`;
}
export {
  excludeNull,
  updata,
  formatDate,
};
