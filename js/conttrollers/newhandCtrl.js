define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('newhandCtrl', function ($scope, $rootScope, resourceService, $filter, $state, $stateParams, $localStorage) {
        $rootScope.title = "新手专享标";
        var user = $filter('isRegister')();
        $filter('isPath')('newhand');
        $('body').scrollTop(0);
        var obj = {};
        obj.pid = $stateParams.pid;
        if (user.register) {
            $scope.isRegister = true;
            obj.uid = user.user.member.uid;
        }
        resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), obj, { name: 'newH' });
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        $scope.gologin = function () {
            $state.go('dl', { returnurl: 'newhand?pid=' + $scope.cp.id });
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'newH':
                    if (data.success) {
                        $localStorage.cp = data.map;
                        $scope.cpObj = data.map;
                        $scope.cp = data.map.info;
                    }
                    break;
            };
        });
    })
})