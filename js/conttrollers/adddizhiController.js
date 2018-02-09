/*新增收获地址 lee*/
define([
    'js/module.js'
    , 'ngdialog'
    , 'framework/jquery-asPieProgress.js'
    , 'framework/rainbow.min.js'
]
    , function (controllers, ngdialog) {
        controllers.controller('adddizhiController', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', '$localStorage', '$anchorScroll', '$http', '$timeout'
            , function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, $http, $timeout) {
                $rootScope.title = "新增收货地址";
                // 定义一个空对象保存表单的内容
                $scope.userInfo = {};
                var el = document.getElementById('onoffswitch');
                el.checked = true;
                //返回上一级
                $scope.toback = function () {
                    $state.go('dizhi', {});
                };

                //滑动按钮
                // $(document).ready(function () {
                //     $("#onoffswitch").on('click', function () {
                //         clickSwitch()
                //     });

                //     var clickSwitch = function () {
                //         if ($("#onoffswitch").is(':checked')) {
                //             console.log("在ON的状态下");
                //         } else {
                //             console.log("在OFF的状态下");
                //         }
                //     };
                // });

                //判断是否登陆
                $scope.isLogin = $filter('isRegister')().register;
                if ($scope.isLogin) {

                    $scope.user = $filter('isRegister')().user;
                    $scope.user.uid = $scope.user.member.uid;
                    $scope.userInfo.uid = $scope.user.uid;
                    // resourceService.queryPost($scope, $filter('getUrl')('我的地址'), { uid: $scope.user.uid }, { name: '我的地址' });
                }
                //监听事件
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type.name) {
                        case '保存地址':
                            if (data.success) {
                                $state.go('dizhi', {});
                            }
                            break;
                    }
                })


                //保存地址
                $scope.receive = function (userInfo) {
                    if (userInfo.name == undefined || userInfo.name == "") {
                        $scope.reminding = true;
                        $timeout(function () {
                            $scope.reminding = false;
                        }, 1000)
                    } else if (userInfo.phone == undefined || userInfo.phone == "") {
                        $scope.reminding1 = true;
                        $timeout(function () {
                            $scope.reminding1 = false;
                        }, 1000)
                    } else if (userInfo.address == undefined || userInfo.address == "") {
                        $scope.reminding2 = true;
                        $timeout(function () {
                            $scope.reminding2 = false;
                        }, 1000)
                    }
                    else {
                        if ($("#onoffswitch").is(':checked')) {
                            userInfo.status = '1';
                        } else {
                            userInfo.status = '0';
                        }
                        resourceService.queryPost($scope, $filter('getUrl')('保存地址'), userInfo, { name: '保存地址' });
                    }
                }
            }
        ])
    })

