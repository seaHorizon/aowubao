define(['js/module.js', 'jquery', 'ngdialog'], function(controllers, $, ngdialog) {
    'use strict';
    controllers.controller('accountHomeCtrl', function($scope, resourceService, $filter, $state, $rootScope, $localStorage, ngDialog) {
        $rootScope.title = "我的账户";
        $filter('isPath')('main.myaccountHome');
        $scope.hongbaoShow = false;
        $scope.hongbaoShow2 = false;


        $scope.userOBJ = $filter('isRegister')();
        if ($scope.userOBJ.register) {
            $scope.user = $scope.userOBJ.user.member;
            resourceService.queryPost($scope, $filter('getUrl')('myacc'), {
                uid: $scope.user.uid
            }, '我的账户');
            resourceService.queryPost($scope, $filter('getUrl')('我的红包'), {
                uid: $scope.userOBJ.user.member.uid,
                status: 0,
                flag: 0
            }, '我的体验金');
        } else {
            $state.go('dl');
            return;
        };
        // if ($localStorage.user.bombBox) {
        //     $scope.bombBox = false;
        // } else {
        //     $scope.bombBox = true;
        // }
        ngDialog.closeAll();
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type) {
                case '我的账户':
                    if (data.success) {
                        data.map.isPayment = false;
                        $scope.accunt = data.map;
                        $localStorage.user.member.balance = data.map.balance;
                        $localStorage.user.member.free = data.map.free;
                        $localStorage.user.realName = data.map.realName;
                        $localStorage.user.member.realVerify = data.map.realVerify;
                        $localStorage.user.member.sex = data.map.sex;
                        $localStorage.user.member.unReadMsg = data.map.unReadMsg;
                        $localStorage.user.member.winterest = data.map.winterest;
                        $localStorage.user.member.wprincipal = data.map.wprincipal;
                        $scope.unclaimed = data.map.unclaimed;
                        $scope.rfid = data.map.afid;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '我的体验金':
                    if (data.success) {
                        $scope.coupons = data.map.list;
                        if ($scope.coupons.length > 0) {
                            if ($localStorage.user.bombBox) {
                                $scope.bombBox = false;
                            } else {
                                $scope.bombBox = true;
                                $localStorage.user.bombBox = true;
                            }

                        } else {
                            $localStorage.user.bombBox = false;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
            };

        });


        $filter('isPath')('main.more');
        $scope.out = function(argument) {
            switch (argument) {
                case 'out':
                    $filter('清空缓存')();
                    $state.go('main.home');
                    break;
            };
        };
        $scope.onClick = function(argument) {
            switch (argument) {
                case 'yes':
                    $filter('清空缓存')();
                    $state.go('dl');
                    ngDialog.closeAll();
                    $scope.hongbaoShow = false;
                    $scope.hongbaoShow2 = false;
                    break;
            };
        };


        $scope.eyes = function() {
            $scope.num = !$scope.num;
        };

        $scope.bomb = function() {
            $scope.bombBox = false;

        }
    });
})