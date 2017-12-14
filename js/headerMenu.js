;(function (){
  var toggleMenuBtn = document.getElementById('toggleMenuBtn');
  var navbarMenu = document.getElementById('navbarMenu');
  var active = false;
  toggleMenuBtn.addEventListener('click', function (e){
    navbarMenu.style.display = active ? '' : 'block';
    active = !active;
  });
})();