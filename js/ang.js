var app = angular.module('application', []);

app.controller('appController', ['$scope', function($scope){
  $scope.searchByThisPublic = ''; //По какому паблику искать, название
  $scope.userData = {userId: '', userSubscriptions: []}; //Инфа о пользователе
  $scope.usersFound = new Array(); //Все подписчики паблика
  $scope.publicCompareNumber = 4; //Сколько общих пабликов
  $scope.peopleFilterData = {sex: '', city: ''}; //Поля для фильтра
  $scope.usersLimit = 10; //Сколько видно пользователей в прокрутке
  $scope.usersFilteredAmount = 0; //Окончательное кол-во отфильтрованных подписчиков
  $scope.allCities = new Array(); //Все id городов найденных подписчиков
  $scope.allCitiesNames = new Array(); //Все названия городов
  $scope.searchByThisCity = {id: 0, name: ''};


  $scope.updateUser = function updateUser(){
    if($scope.userData.userId === undefined) return;
    var requireUserObject = VK.Api.call('users.getSubscriptions', {user_id: parseInt($scope.userData.userId), extended: 1}, function(r){
      $scope.$apply(function(){
        if(!r.response) return;
        $scope.userData.userSubscriptions = r.response.slice();
        $scope.searchByThisPublic = $scope.userData.userSubscriptions[0].name;
      });
    });
    return requireUserObject;
  };

  $scope.makeSearch = function makeSearch(){
    $scope.usersFound = new Array();
    var publicId;
    for(var i = 0; i < $scope.userData.userSubscriptions.length; i++){
      if($scope.userData.userSubscriptions[i].name == $scope.searchByThisPublic){
        publicId = $scope.userData.userSubscriptions[i].gid;
        break;
      }
    }
    var offsetLength = 1;
    //Получить всех подписчиков
    var requireUsersSearch = VK.Api.call('groups.getMembers', {group_id: publicId, count: 1000, offset: offsetLength, fields: 'sex, photo_200, city'}, callUserSearch);
    return requireUsersSearch;

    function callUserSearch(r){
      if(!r.response || r.response.users.length == 0){ //Когда все подписчики получены, получить список названий городов
        parseCities();
        return;
      }
      $scope.$apply(function(){
        for(var i = 0; i < r.response.users.length; i++){
          $scope.usersFound.push(r.response.users[i]);
        }
        console.log($scope.usersFound.length);
        offsetLength += 1000;
        VK.Api.call('groups.getMembers', {group_id: publicId, count: 1000, offset: offsetLength, fields: 'sex, photo_200, city'}, callUserSearch);
      });
    }

    function parseCities(){ //Получение названий городов
      $scope.$apply(function(){
        VK.Api.call('database.getCitiesById', {city_ids: $scope.allCities}, function(r){
          for(var i = 0; i < r.response.length; i++){
            $scope.allCitiesNames.push(r.response[i].name);
          }
          $scope.searchByThisCity = {id: $scope.allCities[0], name: $scope.allCitiesNames[0]};
        });
      });
    }
  };



  $scope.changeSearchPublic = function changeSearchPublic(index){
    $scope.searchByThisPublic = $scope.userData.userSubscriptions[index].name;
  };

  $scope.showMore = function showMore(){
    $scope.usersLimit += 10;
  };

  $scope.changeSearchCity = function changeSearchCity(index){
    $scope.searchByThisCity.id = $scope.allCities[index];
    $scope.searchByThisCity.name = $scope.allCitiesNames[index];
  };
}]);

app.filter('peopleFilter', function(){
  return function(objects, searchData, usersFilteredAmount){
    var arrayOut = new Array();
    var check = true;
    for(var i = 0; i < objects.length; i++){
      check = true;
      for(var key in searchData){
        if(searchData[key] && objects[i][key] != searchData[key]){
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