'use strict';
define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('myTyjController', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage) {
        $rootScope.title = '体验金';
        $scope.userOBJ = $filter('isRegister')();
        $filter('isPath')('myTyj');
        if (!$scope.userOBJ.register) {
            $state.go("dl");
            return;
        }
        $scope.active = 0;
        resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
            uid: $scope.userOBJ.user.member.uid,
            status: $scope.active,
            flag: 0
        }, '我的体验金');
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的体验金':
                    if (data.success) {
                        $scope.coupons = data.map.list;
                        $scope.newHandId = data.map.newHandId;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            };
        });
        $scope.onClick = function (num) {
            $scope.active = num;
            resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                uid: $scope.userOBJ.user.member.uid,
                status: $scope.active,
                flag: 0
            }, '我的体验金');
        };
        $scope.toback = function () {
            $filter('跳回上一页')(3);
        };
    });
})
