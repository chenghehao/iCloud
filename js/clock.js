;(function (){
  var clock = document.getElementById('clock');
  (function getTime(){
    window.requestAnimationFrame(getTime);
    
    var t = new Date();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();
    clock.innerHTML = add0(h) + ':' + add0(m) + ':' + add0(s);
  })();
})();