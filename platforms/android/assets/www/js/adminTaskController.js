/**
 * Created by evfandroid on 7/21/2018.
 */

var AppContoller = angular.module('adminTaskController', []);

AppContoller
  .controller(
  "adminTaskController",['$scope','$state','$mdSidenav','adminservice','$ionicPopup','$http','$rootScope','utils',
    function($scope,$state,$mdSidenav,adminservice,$ionicPopup,$http,$rootScope,utils) {
    $scope.tasksData="";
    $scope.imagePathS3="";
    $scope.subjectData="";
    $scope.classData="";

    $scope.goToBack=function(){
      $state.go('admin');
    }
    $scope.isOpenRightAddTask = function(){
      $mdSidenav('rightAddTask').toggle()
        .then(function () {

        });
    };

    $scope.cancelAddTask = function(){
      $mdSidenav('rightAddTask').close()
        .then(function () {

        });
    };

    $scope.saveTaskInformation=function(){
    if($scope.imagePathS3!=""){
     var request={
            "taskTitle":this.title,//"English HW",
            "taskDescription":this.discription,//"Fill in the blanks chapter 1",
            "schoolCode":"SC1",
            "classCode":this.class,//"CC1",
            "subjectCode":this.subject,//"ENG",
            "sequence":"1",
            "startDate":this.startdays,//"2018-07-22 10:00:00",
            "endDate":this.enddays,//"2018-07-22 12:00:00"
            "linkUrl":$scope.imagePathS3[0]
          }
          adminservice.saveTaskInfo(request).then(function(result){


                         $scope.cancelAddTask();
                         $scope.init();
                         $scope.imagePathS3="";


          })
    }else{
     alert("Please Upload File Than Submit.");
    }

    }

    // A confirm dialog
    $scope.showConfirm = function(taskcode) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Confirmation',
        template: 'Are you sure you want to delete task?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          $scope.deleteTask(taskcode);
        } else {
          console.log('You are not sure');
        }
      });
    };

    $scope.deleteTask=function(taskCode){
      var request={
        "taskCode":taskCode
      }
      adminservice.deleteTaskInfo(request).then(function(result){
        $scope.init();
      })
    }

     $scope.uploadFile=function(){
                       var formData = new FormData();
                       var f = document.getElementById('file').files[0];
                       formData.append("document", f);
                          var request = {
                              method: 'POST',
                              url: $rootScope.MAINURL+'upload/file',
                              data: formData,
                              headers: {
                                  'Content-Type': undefined
                              }
                          };
                          // SEND THE FILES.
                          $http(request)
                              .success(function (d) {
                                  alert("File Successfully Uploaded.");
                                  $scope.imagePathS3=d;
                              })
                              .error(function () {
                              });
                              }





    $scope.init=function(){
      adminservice.showAllTasks().then(function(result){
        $scope.tasksData=result.data;
      })
    }

    $scope.getSubjectAndClass=function(){
           adminservice.getSubjectAndClass().then(function(result){
          var dataAll= utils.getClassSubject(result.data);
              $scope.subjectData=dataAll[0];
               $scope.classData=dataAll[1];
           })
    }


    $scope.init();
     $scope.getSubjectAndClass();


  }]);
