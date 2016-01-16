app.filter('peopleFilter', function(){
  return function(objects, searchData){
    var arrayOut = new Array();
    var check = true;
    for(var i = 0; i < objects.length; i++){
      check = true;
      for(var key in searchData){
        if(searchData[key] && (objects[i][key] != searchData[key])){
          check = false;
          break;
        }
      }
      if(check) arrayOut.push(objects[i]);
    }
    return arrayOut;
  };
});

app.filter('commonPublicsFilter', function(){
  return function(objects, userSubscriptions, commonAmount){
    var arrayOut = new Array();
    for(var i = 0; i < objects.length; i++){
      comparePublics(i);
    }
    return arrayOut;

    function comparePublics(index){
      var requireUserObject = VK.Api.call('users.getSubscriptions', {user_id: objects[index].id, extended: 1}, function(r){
        if(!r.response) return;
        var commonFound = 0;
        for(var j = 0; j < r.response.length; j++){
          for(var k = 0; k < userSubscriptions.length; k++){
            if(userSubscriptions[k].gid == r.response[j].gid){
              commonFound++;
              break;
            }
          }
        }
        if(commonFound >= commonAmount) arrayOut.push(objects[index]);
      });
    }
  };
});


app.filter('indexFilter', function(){
  return function(objects, maxIndex){
    var arrayOut = new Array();
    var checked = 0;



    for(var i = indexData[0]; i < indexData[1]; i++){
      arrayOut.push(objects[i]);
    }
    return arrayOut;

    function checkUser(r){

    }
  };
});