var app = angular.module('application', []);

app.controller('appController', ['$scope', function($scope){
  $scope.userData = {userId: '', userSubscriptions: []}; //Инфа о пользователе
  $scope.searchByThisPublics = [{gid: 0, name: ''}]; //По каким пабликам, id и название
  $scope.subscribers = new Array(); //Подписчики каждого паблика из searchByThisPublics (по порядку)
  $scope.usersFound = new Array(); //Все подписчики пабликов
  $scope.publicCompareNumber = 4; //Сколько общих пабликов
  $scope.peopleFilterData = {sex: '', city: 0}; //Поля для фильтра
  $scope.usersLimit = 10; //Сколько видно пользователей в прокрутке
  $scope.loadingProcess = false; //Происходит ли загрузка (для отображения процесса загрузки)
  
  $scope.countries = {countriesList: new Array(), searchByThisCountry: {}};
  $scope.cities = {citiesList: new Array(), searchByThisCity: {title: ''}}; //Объект, хранящий все найденные по строке города (в функции requestCities) и город, по которому ищем сейчас (ниже)
  Object.defineProperty($scope.cities.searchByThisCity, 'cid', {enumerable: true, set: function(value){//Задаём город, по которому ищем сейчас, свойством, чтоб при его изменении менялось значение в объекте фильтра
    $scope.peopleFilterData.city = value;
  }});
  requestCountries(); //Получить список основных стран

  function requestCountries(){ //Получить список основных стран
    VK.Api.call('database.getCountries', {need_all: 0, count: 5}, function(r){
      $scope.$apply(function(){
        if(!r.response) return;
        $scope.countries.countriesList = r.response;
        $scope.changeSearchCountry(1);
      });
    });
  };

  $scope.changeSearchCountry = function changeSearchCountry(index){
    $scope.countries.searchByThisCountry = $scope.countries.countriesList[index];
    $scope.requestCities('', true); //Ищем все основные города новой страны
  };

  $scope.requestCities = function requestCities(str, reset){
    VK.Api.call('database.getCities', {country_id: $scope.countries.searchByThisCountry.cid, q: str, count: 5}, function(r){
      $scope.$apply(function(){
        if(!r.response) return;
        $scope.cities.citiesList = r.response;
        $scope.cities.searchByThisCity.cid = $scope.cities.citiesList[0].cid;
        if(reset) $scope.cities.searchByThisCity.title = $scope.cities.citiesList[0].title;
        $scope.usersLimit = 10;
      });
    });
  };

  $scope.updateUser = function updateUser(){
    if($scope.userData.userId === undefined) return;
    var requireUserObject = VK.Api.call('users.getSubscriptions', {user_id: parseInt($scope.userData.userId), extended: 1}, function(r){
      $scope.$apply(function(){
        if(!r.response) return;
        $scope.userData.userSubscriptions = r.response.slice();
        $scope.searchByThisPublics[0] = $scope.userData.userSubscriptions[0];
      });
    });
    return requireUserObject;
  };

  $scope.makeSearch = function makeSearch(){
    $scope.loadingProcess = true; //Загрузка началась
    var uncheckedPublics = $scope.searchByThisPublics.length;
    for(var i = 0; i < $scope.searchByThisPublics.length; i++){
      $scope.subscribers[i] = new Array;
      getSubscribers($scope.searchByThisPublics[i].gid, $scope.subscribers[i]);
    }
    
    //Получить всех подписчиков
    function getSubscribers(publicId, usersArray){
      var offsetLength = 0;
      VK.Api.call('groups.getMembers', {group_id: publicId, count: 1000, offset: offsetLength, fields: 'sex, photo_200, city', sort: 'id_asc'}, callUserSearch);

      function callUserSearch(r){
        if(!r.response || r.response.users.length == 0){//Все подписчики получены, выходим
          uncheckedPublics--; //Непроверенных пабликов стало на один меньше
          $scope.$apply(function(){if(uncheckedPublics == 0) getComparedSubscribers()}); //Если непроверенных пабликов осталось ноль
          return;
        }
        $scope.$apply(function(){
          for(var i = 0; i < r.response.users.length; i++){
            usersArray.push(r.response.users[i]);
          }
          console.log(usersArray.length);
          offsetLength += 1000;
          VK.Api.call('groups.getMembers', {group_id: publicId, count: 1000, offset: offsetLength, fields: 'sex, photo_200, city', sort: 'id_asc'}, callUserSearch);
        });
      }
    }

    function getComparedSubscribers(){
      var commonUsers = $scope.subscribers[0].slice();
      if($scope.subscribers.length > 1){
        for(var i = 1; i < $scope.subscribers.length; i++){
          commonUsers = intersection_destructive(commonUsers, $scope.subscribers[i], 'uid');
        }
      }
      $scope.loadingProcess = false; //Загрузка закончилась
      return $scope.usersFound = commonUsers.slice();

      function intersection_destructive(a, b, str)
      {
        if(a.length < b.length){
          var buff = a.slice();
          a = b.slice();
          b = buff;
        }
        var arrayOut = new Array();
        for(var i = 0; i < a.length; i++){
          for(var j = 0; j < b.length; j++){
            if(a[i][str] == b[j][str]){
              arrayOut.push(a[i]);
              break;
            }
          }
        }
        return arrayOut;
      }
    }
  };

  $scope.getAllSubscribers = function getAllSubscribers(){

  };

  $scope.changeSearchPublic = function changeSearchPublic(index, parentIndex){
    $scope.searchByThisPublics[parentIndex] = $scope.userData.userSubscriptions[index];
  };

  $scope.showMore = function showMore(){
    $scope.usersLimit += 10;
  };

  $scope.changeSearchCity = function changeSearchCity(index){
    $scope.cities.searchByThisCity.cid = $scope.cities.citiesList[index].cid;
    $scope.cities.searchByThisCity.title = $scope.cities.citiesList[index].title;
  };

  $scope.addPublic = function addPublic(){
    $scope.searchByThisPublics.push({gid: 0, name: ''});
    $scope.subscribers.push(new Array());
  };
}]);