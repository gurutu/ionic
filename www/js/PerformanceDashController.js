/**
 * Created by evfandroid on 7/21/2018.
 */
var AppContoller = angular.module('PerformanceDashController', []);

AppContoller
  .controller(
  "PerformanceDashController",['$scope','$mdSidenav', '$state',
'$rootScope','$stateParams','studentTask','performnanceList','store',
   function($scope,$mdSidenav,$state,$rootScope,$stateParams,studentTask,performnanceList,store)
{

    $scope.show="";
    $scope.completed=0;
    $scope.start=0;
    $scope.inprogress=0;
    $scope.totalTask=0;
    $scope.selectFilter="";

   console.log($stateParams);
     $scope.goToBack = function(){
        $state.go('teacherDash',{"teacherId": store.get('userdata').id});
     };
      $scope.sideNavAssignTask = function(taskCode){
           $mdSidenav('sideAssignTask').toggle()
             .then(function () {
                var request = {
                      "taskCode":taskCode,
                       "teacherId":store.get('userdata').id
                       };

performnanceList.performnanceListStudent(request).then(function(results)
{
                    if(results.status=="200") {
                      console.log("=============Selected Class TaskList================");
                      console.log(results.data);
                     $scope.studentListOfPer = results.data;
                      $scope.completed=0;
                         $scope.start=0;
                         $scope.inprogress=0;
                         $scope.totalTask=0;
                     for(var i=0;i<results.data.length;i++){
                     var status=results.data[i].status;
                             $scope.totalTask= $scope.totalTask+1;
                           if(status=='Assigned'||status=='Assigned'){
                                    $scope.start=$scope.start+1;
                           }else if(status=='In Progress'||status=='In progress'){
                                  $scope.inprogress=$scope.inprogress+1;;
                           }else if(status=='completed'||status=='Completed'){
                                     $scope.completed=$scope.completed+1;
                           }
                     }
                    }
                 });
             });
         };

       $scope.selectValue=function(val){
          if(val==undefined||$scope.selectFilter==""||$scope.selectFilter=='select'){
          return true;
          }
           if(val.toUpperCase() === $scope.selectFilter.toUpperCase()){
           return true;
           }
           return false;
       }


       $scope.cancelNavAssignTask = function(){
         $mdSidenav('sideAssignTask').close()
           .then(function () {

           });
       };
       $scope.filterByStatus = function(tasklist){
         $mdSidenav('filterByStatus').toggle()
           .then(function () {
           var uniqueNames = [];
            $.each(tasklist, function(i, el){
                if($.inArray(el.status, uniqueNames) === -1)
uniqueNames.push(el.status);
            });
              console.log("=============Unique status================");
              console.log(uniqueNames);
              $scope.uniqueStatus=uniqueNames;
           });
       };

        $scope.init=function(){
            var request = {
                "classCode":$stateParams.classSel
                 };
            studentTask.studentALLTaskList(request).then(function(results) {
              if(results.status=="200") {
                console.log("=============Selected Class TaskList================");
                console.log(results.data);
               $scope.performanceTaskList = results.data;
              }
           });
         }
         $scope.init();
  }]);
