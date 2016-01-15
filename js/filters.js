app.filter('peopleFilter', function(){
  return function(objects, searchData, usersFilteredAmount){
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
    usersFilteredAmount = arrayOut.length;
    return arrayOut;
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

app.filter('commonPublicsFilter', function(){
  return function(objects, amount){
    var arrayOut = new Array();
    for(var i = 0; i < objects.length; i++){

    }

    function comparePublics(r){
      var requireUserObject = VK.Api.call('users.getSubscriptions', {user_id: parseInt($scope.userData.userId), extended: 1}, function(r){
        if(!r.response) return;
        $scope.userData.userSubscriptions = r.response.slice();
        $scope.searchByThisPublic = $scope.userData.userSubscriptions[0].name;
      });
    }
  };
});