var app = angular.module('application', []);

app.controller('appController', ['$scope', function($scope){
  $scope.searchByThisPublic = {id: 0, name: ''}; //По какому паблику искать, название
  $scope.userData = {userId: '', userSubscriptions: []}; //Инфа о пользователе
  $scope.usersFound = new Array(); //Все подписчики паблика
  $scope.publicCompareNumber = 4; //Сколько общих пабликов
  $scope.peopleFilterData = {sex: '', city: 0}; //Поля для фильтра
  $scope.usersLimit = 10; //Сколько видно пользователей в прокрутке
  $scope.allCities = new Array(); //Все id городов найденных подписчиков
  $scope.allCitiesNames = new Array(); //Все названия городов
  $scope.countries = {countriesList: new Array(), searchByThisCountry: {}};
  $scope.cities = {citiesList: new Array(), searchByThisCity: {title: ''}}; //Объект, хранящий все найденные по строке города (в функции requestCities) и город, по которому ищем сейчас (ниже)
  Object.defineProperty($scope.cities.searchByThisCity, 'cid', {enumerable: true, set: function(value){//Задаём город, по которому ищем сейчас, свойством, чтоб при его изменении менялось значение в объекте фильтра
    $scope.peopleFilterData.city = value;
  }});
  getAllCountries(); //Получить список основных стран

  function getAllCountries(){ //Получить список основных стран
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
    $scope.cities.searchByThisCity.title = ''; //Сбрасываем город для поиска
    $scope.requestCities(''); //Ищем все основные города новой страны
  };

  $scope.requestCities = function requestCities(str){
    VK.Api.call('database.getCities', {country_id: $scope.countries.searchByThisCountry.cid, q: str, count: 5}, function(r){
      $scope.$apply(function(){
        if(!r.response) return;
        $scope.cities.citiesList = r.response;
        $scope.cities.searchByThisCity.cid = $scope.cities.citiesList[0].cid;
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
        $scope.searchByThisPublic = $scope.userData.userSubscriptions[0];
      });
    });
    return requireUserObject;
  };

  $scope.makeSearch = function makeSearch(){
    $scope.usersFound = new Array();
    var offsetLength = 0;
    //Получить всех подписчиков
    var requireUsersSearch = VK.Api.call('groups.getMembers', {group_id: $scope.searchByThisPublic.gid, count: 1000, offset: offsetLength, fields: 'sex, photo_200, city'}, callUserSearch);
    return requireUsersSearch;

    function callUserSearch(r){
      if(!r.response || r.response.users.length == 0) return;//Все подписчики получены, выходим
      $scope.$apply(function(){
        for(var i = 0; i < r.response.users.length; i++){
          $scope.usersFound.push(r.response.users[i]);
        }
        console.log($scope.usersFound.length);
        offsetLength += 1000;
        VK.Api.call('groups.getMembers', {group_id: publicId, count: 1000, offset: offsetLength, fields: 'sex, photo_200, city'}, callUserSearch);
      });
    }
  };



  $scope.changeSearchPublic = function changeSearchPublic(index){
    $scope.searchByThisPublic = $scope.userData.userSubscriptions[index];
  };

  $scope.showMore = function showMore(){
    $scope.usersLimit += 10;
  };

  $scope.changeSearchCity = function changeSearchCity(index){
    $scope.cities.searchByThisCity.cid = $scope.cities.citiesList[index].cid;
    $scope.cities.searchByThisCity.title = $scope.cities.citiesList[index].title;
  };
}]);