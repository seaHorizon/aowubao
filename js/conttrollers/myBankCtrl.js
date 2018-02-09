define([
    'js/module.js'
]
    , function (controllers) {
        controllers.controller('myBankCtrl'
            , ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$interval', function ($scope, $rootScope, $filter, $state, resourceService, $interval) {
                $scope.hide = false;
                $scope.show = false;
                $scope.shows = false;
                $rootScope.title = "我的银行卡";
                $scope.userOBJ = $filter('isRegister')();

                resourceService.queryPost($scope, $filter('getUrl')('我的银行卡'), {
                    uid: $scope.userOBJ.user.member.uid
                }, '我的银行卡');
                resourceService.queryPost($scope, $filter('getUrl')('能不能换绑卡'), {
                    uid: $scope.userOBJ.user.member.uid
                }, '能不能换绑卡');

                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type) {
                        case '我的银行卡':
                            if (data.success) {
                                $scope.user = data.map;
                            } else {
                                $filter('服务器信息')(data.errorCode, $scope, 'y');
                            }
                            break;
                        case '能不能换绑卡':
                            if (data.success) {
                                $scope.canChangeBank = data.map.canChangeBank;
                            }
                            break;
                    };
                });

                $scope.toback = function () {
                    $filter('跳回上一页')();
                };

                //是否确认换卡
                $scope.isdelete = function () {
                    $scope.hide = true;
                }


                //不能换绑提示换卡
                $scope.isdeletes = function () {
                    $scope.show = true;

                    $interval.cancel($scope.timer);
                    $scope.timer = $interval(function () {
                        $scope.show = false;
                    }, 2500);
                }
                //一天只能换一次
                $scope.isdeletess = function () {
                    $scope.shows = true;

                    $interval.cancel($scope.timer);
                    $scope.timer = $interval(function () {
                        $scope.shows = false;
                    }, 2500);
                }


            }
            ]);
    })