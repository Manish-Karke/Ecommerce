const fs = require('fs');
function load(src, callback) {
  let script = document.createElement("script");

  script.src = src;
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Script load error for ${src}`));

  document.head.append(script);
}

load("https://www.facebook.com/fb",(err,script)=>{
  if(err)
  {
    console.error(err);
  }else{
    console.log("secipt loaded", script.src)
  }
})
