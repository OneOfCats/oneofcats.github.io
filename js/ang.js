var app = angular.module('application', []);

app.controller('appController', ['$scope', function($scope){
  $scope.searchByThisPublic = ''; //По какому паблику искать, название
  $scope.userData = {userId: '', userSubscriptions: []}; //Инфа о пользователе
  $scope.usersFound = new Array(); //Все подписчики паблика
  $scope.publicCompareNumber = 4; //Сколько общих пабликов
  $scope.peopleFilterData = {sex: '', city: 0}; //Поля для фильтра
  $scope.usersLimit = 10; //Сколько видно пользователей в прокрутке
  $scope.usersFilteredAmount = 0; //Окончательное кол-во отфильтрованных подписчиков
  $scope.allCities = new Array(); //Все id городов найденных подписчиков
  $scope.allCitiesNames = new Array(); //Все названия городов
  $scope.countries = {countriesList: new Array(), searchByThisCountry: {}};
  getAllCountries($scope.countries.countriesList); //Получить список основных стран
  $scope.cities = {citiesList: new Array(), searchByThisCity: {title: ''}}; //Объект, хранящий все найденные по строке города (в функции requestCities) и город, по которому ищем сейчас (ниже)
  Object.defineProperty($scope.cities.searchByThisCity, 'cid', {writable: true, enumerable: true, set: function(value){//Задаём город, по которому ищем сейчас, свойством, чтоб при его изменении менялось значение в объекте фильтра
    $scope.peopleFilterData.city = value;
  }});

  function getAllCountries(){ //Получить список основных стран
    VK.Api.call('database.getCountries', {need_all: 0, count: 5}, function(r){
      $scope.$apply(function(){
        if(!r.response) return;
        $scope.countries.countriesList = r.response;
        $scope.countries.searchByThisCountry = $scope.countries.countriesList[0];
      });
    });
  };

  $scope.changeSearchCountry = function changeSearchCountry(index){
    $scope.countries.searchByThisCountry = $scope.countries.countriesList[index];
  };

  $scope.requestCities = function requestCities(str){
    VK.Api.call('database.getCities', {country_id: $scope.countries.searchByThisCountry.cid, q: str, count: 5}, function(r){
      $scope.$apply(function(){
        if(!r.response) return;
        $scope.cities.citiesList = r.response;
      });
    });
  };

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
      for(var i = 0; i < $scope.usersFound.length; i++){
        if($scope.allCities.indexOf($scope.usersFound[i].city) != -1) continue;
        $scope.allCities.push($scope.usersFound[i].city);
      }
      VK.Api.call('database.getCitiesById', {city_ids: $scope.allCities}, function(r){
        $scope.$apply(function(){
          for(var i = 0; i < r.response.length; i++){
            $scope.allCitiesNames.push(r.response[i].name);
          }
          $scope.searchByThisCity.cid = $scope.allCities[0];
          $scope.searchByThisCity.title = $scope.allCitiesNames[0];
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
    $scope.cities.searchByThisCity.cid = $scope.cities.citiesList[index].cid;
    $scope.cities.searchByThisCity.title = $scope.cities.citiesList[index].title;
  };
}]);