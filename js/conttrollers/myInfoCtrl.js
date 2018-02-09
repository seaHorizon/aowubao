define([
    'js/module.js'
]
    , function (controllers) {
        controllers.controller('myInfoCtrl'
            , ['$scope'
                , '$rootScope'
                , '$filter'
                , '$state'
                , 'resourceService'
                , function ($scope, $rootScope, $filter, $state, resourceService) {
                    $rootScope.title = "我的信息";
                    $scope.userOBJ = $filter('isRegister')();
                    $scope.userMobilePhone = $scope.userOBJ.user.member.mobilephone;
                    $filter('isPath')('myInfo');

                    resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
                        uid: $scope.userOBJ.user.member.uid
                    }, '我的信息');

                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type) {
                            case '我的信息':
                                if (data.success) {
                                    $scope.user = data.map;
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y');
                                }
                                break;
                        };
                    });

                    $scope.toback = function () {
                        $filter('跳回上一页')(3);
                    };

                    $scope.out = function (argument) {
                        switch (argument) {
                            case 'out':
                                $filter('清空缓存')();
                                $state.go('main.home');
                                break;
                        };
                    };

                }
            ]);
    })