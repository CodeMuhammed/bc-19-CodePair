/**
 * @description
 *
 * This object provides a utility for producing a source code editor
 * that synchronizes in realtime with firebase and acrross multiple connected
 * Client devices in real-time
 *
 * @param {*} string The namespace to use for this module functions
 * @param {*} array A list of external modules and dependencies of this modlue
 */
angular.module('editorComponent' , [])

/**
 * @description
 *
 * This controls the code editing view of the application
 */
.controller('liveEditorController' , function($scope , $timeout , $state , $stateParams, fireservice , authy , languages) {

  //Holds the version of the current pair coding session
  $scope.pairCode = $stateParams.pairCode;


  //This is the absolute url for collaborating on the app
  $scope.sessionUrl = $state.href($state.current.name, $state.params, {absolute: true});
  $scope.sessionUrl = $scope.sessionUrl.substr(0 , $scope.sessionUrl.indexOf('/live'));

  //List of programming languages supported by the editor
  $scope.languages = languages;
  $scope.activeLang = '';

  //Holds the user
  $scope.user = authy.getUser();

  //Holds the member details that binds with the members directive//{}[]
  $scope.member = {
    role: $scope.pairCode.admin == $scope.user.username ? 'admin' : 'member',
    fullname: $scope.user.fullname,
    writable: true,
    username: $scope.user.username
  };
  //
  $scope.membersRef = $scope.pairCode.membersRef;

  //Sets default active language

  $scope.activeLang = $scope.pairCode.language;

  //{
  $scope.aceLoaded = function(_editor){
    // Editor part
    $scope._session = _editor.getSession();
  };

  //Watches ace editor for changes
  var timeout;
  $scope.aceChanged = function(ace) {
    if(timeout) {
      console.log('here 1');
      $timeout.cancel(timeout);
      timeout = undefined
    }
    else {
      timeout = $timeout(function() {
        console.log('here 2');
        fireservice.updateSnippet($scope.codeSnippet);
        $timeout.cancel(timeout);
        timeout = undefined;
      } , 1000);
    }
  }

  //Synchronize data at the snippet ref
  fireservice.syncSnippet($scope.pairCode.snippetRef , function(updatedVal) {
    if(!angular.isDefined(timeout)) {
      //Holds the codeSnippet that binds with the editor
      console.log(updatedVal);
      $timeout(function() {
        $scope.codeSnippet = updatedVal;
      });

    }
  });

  //*This section handles ui manipulations =================================*//
  //==========================================================================//
  $scope.langMenuVisible = false;

    //
    $scope.togglelangOptionMenu = function() {
      $scope.langMenuVisible = !$scope.langMenuVisible;}

      //
      $scope.setLang = function(lang) {
      $scope.activeLang = lang;
      $scope._session.setMode("ace/mode/" + angular.lowercase(lang))
      $scope.langMenuVisible = false;
    }

    //
    $scope.peerMenuVisible = true;
    $scope.togglePeerMenu = function() {
      $scope.peerMenuVisible = !$scope.peerMenuVisible;
    }

});