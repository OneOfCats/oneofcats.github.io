﻿var app = angular.module('application', []);

app.controller('appController', ['$scope', function($scope){
  $scope.searchByThisPublic = '';
  $scope.userData = {userId: '', userSubscriptions: []};
  $scope.usersFound = new Array();
  $scope.publicCompareNumber = 4;
  $scope.peopleFilterData = {sex: ''};

  $scope.updateUser = function updateUser(){
    if($scope.userData.userId === undefined) return;
    var requireUserObject = VK.Api.call('users.getSubscriptions', {user_id: parseInt($scope.userData.userId), extended: 1}, function(r){
      if(!r.response) return;
      $scope.userData.userSubscriptions = r.response.slice();
      $scope.searchByThisPublic = $scope.userData.userSubscriptions[0].name;
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
    var requireUsersSearch = VK.Api.call('groups.getMembers', {group_id: publicId, count: 1000, offset: offsetLength, fields: 'sex, photo_200'}, callUserSearch);
    return requireUsersSearch;

    function callUserSearch(r){
      if(r.response.users.length == 0) return;
      for(var i = 0; i < r.response.users.length; i++){
        $scope.usersFound.push(r.response.users[i]);
      }
      console.log($scope.usersFound.length);
      offsetLength += 1000;
      VK.Api.call('groups.getMembers', {group_id: publicId, count: 1000, offset: offsetLength, fields: 'sex, photo_200'}, callUserSearch);
    }
  };

  $scope.changeSearchPublic = function changeSearchPublic(index){
    $scope.searchByThisPublic = $scope.userData.userSubscriptions[index].name;
  };
}]);

app.filter('peopleFilter', function(){
  return function(objects, searchData){
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
    return arrayOut;
  };
});