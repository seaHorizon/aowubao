define(['js/module.js'], function(controllers) {
    controllers.controller('tyjSuccessController', ['$scope', '$rootScope', '$filter', '$state', 'resourceService','$localStorage', function($scope, $rootScope, $filter, $state, resourceService,$localStorage) {
        $rootScope.title = "投资成功";
        $scope.data={};
        $scope.user = $filter('isRegister')().user.member;
        if(!$scope.user){$state.go('dl');return;}
        if($localStorage.tyjSuccessData){
            $scope.data=$localStorage.tyjSuccessData;
        }
        delete $localStorage.tyjSuccessData;
    }]);
})
