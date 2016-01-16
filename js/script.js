document.addEventListener('click', clickListen);
document.addEventListener('keypress', keypressListen);

function clickListen(event){
  var targ = event.target;
  var input = event.target.tagName == "INPUT" || event.target.tagName == "SELECT" || event.target.tagName == "TEXTAREA" || event.target.tagName == "A";
  while(!targ.hasAttribute('data-toggle') && !targ.hasAttribute('scroll-up') && targ != document.body){
    targ = targ.parentNode;
  }

  var toggles = []; var list = document.querySelectorAll('[data-toggle]'); //Сброс всех открытых списков
  for (var i = 0, ref = toggles.length = list.length; i < ref; i++) {
   toggles[i] = list[i];
  }
  if(toggles.indexOf(targ) != -1){ //Не сбрасывать элемент, с которым сейчас взаимодействуем
    toggles.splice(toggles.indexOf(targ), 1);
  }
  for(var i = 0; i < toggles.length; i++){
    toggles[i].classList.remove(toggles[i].getAttribute('data-toggle'));;
  }
  if(targ == document.body) return;

  if(targ.hasAttribute('data-toggle')){ //Выбор действия в зависиомсти от атрибута кликнутого элемента
    if(input){
      targ.classList.add(targ.getAttribute('data-toggle'));
    }else{
      targ.classList.toggle(targ.getAttribute('data-toggle'));
    }
  }
  if(targ.hasAttribute('scroll-up')){
    var elemScrollTo = targ.getAttribute('scroll-up') || targ.parentNode;
    elemScrollTo.scrollIntoView(top);
  }
  if(targ.hasAttribute('inactive')){
    event.preventDefault();
  }
}

function keypressListen(event){
  if(event.keyCode != "T".charCodeAt(0)) return;
  var elems = document.querySelectorAll('[data-toggle-key]');
  for(var i = 0; i < elems.length; i++){
    elems[i].classList.toggle(elems[i].getAttribute('data-toggle-key'));
  }
}