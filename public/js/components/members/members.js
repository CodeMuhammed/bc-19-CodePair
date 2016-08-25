/**
 * Module to hold the functionality of members list  //{}[]
*/
angular.module('membersComponent' , [])

/**
 * A template-directive for members
*/
.directive('members' , function(){
    return{
       link:function(scope , elem , attrs){
           scope.ref = attrs.ref;
           scope.member = scope.$eval(attrs.member);
       },
       templateUrl:'js/components/members/members.html',
       controller: 'membersController'
    };
})

/**
 * Controller that takes care of the functionality of the component
*/
.controller('membersController' , function($scope , $timeout, fireservice) {
     $timeout(function() {

         //Listens for when membersList is updated on firebase
         fireservice.syncMembers($scope.ref).then(null , null , function(membersList) {
            if(angular.isDefined(membersList)) {
              console.log(membersList);
            }  
         });

         //Register this member on memberlist on firebase
         fireservice.registerMember($scope.member);

     });

});