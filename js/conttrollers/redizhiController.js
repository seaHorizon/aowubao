/*新增收获地址 lee*/
define([
    'js/module.js'
    , 'ngdialog'
    , 'framework/jquery-asPieProgress.js'
    , 'framework/rainbow.min.js'
]
    , function (controllers, ngdialog) {
        controllers.controller('redizhiController', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', '$localStorage', '$anchorScroll', '$http', '$timeout'
            , function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, $http, $timeout) {
                $rootScope.title = "修改收货地址";
                $scope.addressInfo = $rootScope.editAddInfo;

                //返回上一级
                $scope.toback = function () {
                    $state.go('dizhi', {});
                };

                //判断 滑动按钮是否开启
                // if ($scope.addressInfo.status == true) {
                //     var el = document.getElementById('onoffswitch');
                //     el.checked = true;
                // }

                //滑动按钮
                // $(document).ready(function () {
                //     $("#onoffswitch").on('click', function () {
                //         clickSwitch();

                //     });

                //     var clickSwitch = function () {
                //         if ($("#onoffswitch").is(':checked')) {
                //             console.log("在ON的状态下");
                //         } else {
                //             console.log("在OFF的状态下");
                //         }
                //     };
                // });

                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;



                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type.name) {
                        case '修改地址':
                            if (data.success) {
                                $state.go('dizhi', {});
                            }
                            break;
                    }
                })
                $scope.user = $filter('isRegister')().user;
                $scope.user.uid = $scope.user.member.uid;


                $scope.receive = function (userInfo) {
                    userInfo.uid = $scope.user.uid;
                    console.log(userInfo.name);
                    console.log(userInfo.phone);
                    console.log(userInfo.address);

                    if (userInfo.name == undefined || userInfo.name == "") {
                        $scope.reminding = true;
                        //  console.log("请输入收货人姓名。");
                        $timeout(function () {
                            $scope.reminding = false;
                        }, 1000)

                    } else if (userInfo.phone == undefined || userInfo.phone == "") {
                        $scope.reminding1 = true;
                        //console.log("请正确输入手机号码输入。");
                        $timeout(function () {
                            $scope.reminding1 = false;
                        }, 1000)
                    } else if (userInfo.address == undefined || userInfo.address == "") {
                        $scope.reminding2 = true;
                        //console.log("请输入详细地址，不少于5个字。");
                        $timeout(function () {
                            $scope.reminding2 = false;
                        }, 1000)
                    } else {
                        // if ($("#onoffswitch").is(':checked')) {
                        //console.log("在ON的状态下");
                        // userInfo.status = '1';
                        // } else {
                        //console.log("在Off的状态下");
                        // userInfo.status = '0';
                        // }
                        //console.log(userInfo.status)
                        // console.log(4)
                        resourceService.queryPost($scope, $filter('getUrl')('修改地址'), userInfo, { name: '修改地址' });

                    }
                }

            }
        ])
    })

