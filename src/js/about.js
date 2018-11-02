var input = document.querySelector("input[type='text']");
var navBox = document.querySelector("nav");
var navUl = document.querySelector("ul");
var navPos = 0;

// 输入内容时请求接口
var inputFlag = true;
// input 输入时事件
input.oninput = function(){
  // event.stopPropagation();  // 阻止事件冒泡
  if(!inputFlag){
    return false;
  }

  if(this.value != ""){
    navBox.style.display = "block";
    var xhr = new XMLHttpRequest;
    xhr.open("GET", "/search/?q="+this.value);
    xhr.send();
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        if(xhr.status == 200){
          navUl.innerHTML = "";
          var data = JSON.parse(xhr.responseText);
          var lang = (location.pathname=="/zh-Hans/") ? "zh-Hans" : "en";
          for(var i=0;i<data.hints.length;i++){
            var dataHints = data.hints[i];
            var url = "/cookbook/?lang=" + lang + "&id=" + dataHints[i][1];
            navUl.innerHTML += '<li><a href="'+url+'">'+dataHints[0]+'<em>'+dataHints[2]+'</em></a></li>';
            var navList = navUl.querySelectorAll("li");
            // 事件注册
            navPos = 0;
            console.log(navPos)
            handleSelectSuggest(navList,navPos);
            mouseoverEventHandler(navList);
            keydownEventHandler(navList);
            mousewheelEventHandler(navList);
            bodyEvent(navList);
          }
        }else{
          navUl.innerHTML = '<ul><li><a href="#">暂无搜索结果</a></li></ul>';
          inputFlag = false;
          setTimeout(function(){
            inputFlag = true;
          },200); // 阻止输入太快请求次数
        }
      }
    }
  }else{
    // 输入框为空时 下拉列表隐藏
    navBox.style.display = "none";
  }
}

// input 点击事件
input.onclick = function(event){
  event.stopPropagation();   // 阻止事件冒泡
  this.placeholder = "";
  navBox.style.display = "block";
}

// 清除和添加样式
function handleSelectSuggest(element,pos){
  // 清除样式
  for(var i=0;i<element.length;i++){
    var item = element[i].querySelector("a").style;
    item.background = "#fff";
    item.color = "#666";
  }

  // 添加样式
  var navitem = element[pos].querySelector("a").style;
  navitem.background = "rgb(28, 172, 244)";
  navitem.color = "#fff";
}

// 键盘事件上下键改变样式和下标
function keyDown(element){
  var e = event || window.event || arguments.callee.caller.arguments[0];
  // 键盘上
  if(e && e.keyCode == 38){ // 键盘上
    if(navPos != 0){
      console.log("shang")
      navPos--;
      handleSelectSuggest(element,navPos);
    }
  }
  // 键盘下
  if(e && e.keyCode == 40){ // 键盘下
    if(navPos < element.length-1){
      console.log("xia")
      navPos++;
      handleSelectSuggest(element,navPos);
    }
  }
  // 回车跳转页面
  if(e && e.keyCode == 13){  // 回车
    window.location = element[navPos].querySelector("a").href;
  }
}

// 键盘事件（上下键）
function keydownEventHandler(element){
  // input 键盘事件
  input.onkeydown = function(event){
    keyDown(element);
  }
  // navBox 增加键盘事件
  navBox.onkeydown = function(){
    keyDown(element);
  }
}

// 鼠标滚轮、触摸板改变样式和下标
var wheelFlag = true;
function wheelEvent(element){
  if(!wheelFlag){
    return false;
  }

  var e = event || window.event || arguments.callee.caller.arguments[0];
  if(e && e.wheelDelta > 10){  // 往上滑
    if(navPos > 0){
      navPos--;
      handleSelectSuggest(element,navPos);
    }
  }

  if(e && e.wheelDelta < -10){ // 往下滑
    if(navPos < element.length-1){
      navPos++;
      handleSelectSuggest(element,navPos);
    }
  }
  wheelFlag = false;
  setTimeout(function(){
    wheelFlag = true;
  },300) // 阻止滚轮、触模版滑动过快
}

// 滚轮、触发模版事件
function mousewheelEventHandler(element){
  // input 添加滚轮、触发模版事件
  input.onwheel = function(event){
    wheelEvent(element)
  }
  // navBox 添加滚轮、触发模版事件
  navBox.onwheel = function(event){
    wheelEvent(element)
  }
}

// 鼠标滑过事件（改变列表样式和下标）
function mouseoverEventHandler(element){
  for(var i=0;i<element.length;i++){
    var item = element[i];
    item.index = i;
    element[i].onmouseover = function(){
      navPos = this.index;
      handleSelectSuggest(element,navPos)
    }
  }
}

// 点击其它地方下拉消失

function bodyEvent(element){
  document.body.onclick = function(){
    input.placeholder = "开发者的日常菜谱 ...";   // 点击 body 元素区域 input框的 placeholder 提示语恢复
    navBox.style.display = "none";
    navPos = 0;
    handleSelectSuggest(element,navPos);
  }
}