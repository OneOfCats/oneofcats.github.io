document.addEventListener('click', clickListen);
document.addEventListener('keypress', keypressListen);

function clickListen(event){
  var targ = event.target;
  while(!targ.hasAttribute('data-toggle') && !targ.hasAttribute('data-toggle') && !targ.hasAttribute('scroll-up')){
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
  if(targ.hasAttribute('scroll-up')){
    var elemScrollTo = targ.getAttribute('scroll-up') || targ.parentNode;
    elemScrollTo.scrollIntoView(top);
  }
  if(targ.hasAttribute('inactive')){
    event.preventDefault();
  }
  return;
}

function keypressListen(event){
  if(event.keyCode != "T".charCodeAt(0)) return;
  var elems = document.querySelectorAll('[data-toggle-key]');
  for(var i = 0; i < elems.length; i++){
    elems[i].classList.toggle(elems[i].getAttribute('data-toggle-key'));
  }
}