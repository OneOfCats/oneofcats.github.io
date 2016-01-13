document.addEventListener('click', clickListen);

function clickListen(event){
  var targ = event.target;
  while(!targ.hasAttribute('data-toggle') && !targ.hasAttribute('data-toggle')){
    if(targ.tagName == "INPUT" || targ.tagName == "SELECT" || targ.tagName == "TEXTAREA" || targ.tagName == "A") return;
    if(targ == document.body){
      var toggles = document.querySelectorAll('[data-toggle]');
      for(var i = 0; i < toggles.length; i++){
        toggles[i].classList.remove(toggles[i].getAttribute('data-toggle'));;
      }
      return;
    }
    targ = targ.parentNode;
  }
  if(targ.hasAttribute('data-toggle')){
    targ.classList.toggle(targ.getAttribute('data-toggle'));
  }
  return
}