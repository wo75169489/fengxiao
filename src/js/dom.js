function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  } else {
    let classNameList = el.className.split(' ');
    classNameList.push(className);
    el.className = classNameList.join(' ');
  }
}

function removeClass(el, className){
  if (hasClass(el, className)) {
    let classNameList = el.className.split(' ').filter((val) => {
      return val !== className;
    });
    el.className = classNameList.join(' ');
  }else{
    return;
  }
}

function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className)
}

export{
  addClass,
  removeClass,
  hasClass
}


