/*我的地址 lee*/
define([
    'js/module.js'
    , 'ngdialog'
    , 'framework/jquery-asPieProgress.js'
    , 'framework/rainbow.min.js'
]
    , function (controllers, ngdialog) {
        controllers.controller('dizhiController', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', '$localStorage', '$anchorScroll', '$http'
            , function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, $http) {
                $rootScope.title = "收货地址管理";
                $scope.toback = function () {
                    $filter('跳回上一页')(2);
                };

                $scope.isLogin = $filter('isRegister')().register;
                $scope.hide = false;
                $scope.addressId = '';
                //加载数据
                if ($scope.isLogin) {
                    $scope.user = $filter('isRegister')().user;
                    $scope.uid = $scope.user.member.uid;
                    resourceService.queryPost($scope, $filter('getUrl')('我的地址'), { uid: $scope.uid }, { name: '我的地址' });
                }

                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type.name) {
                        case '我的地址':
                            if (data.success) {
                                $scope.index = data.map;

                            }
                            break;
                        case '删除地址':
                            if (data.success) {
                                $scope.hide = false;
                                resourceService.queryPost($scope, $filter('getUrl')('我的地址'), { uid: $scope.uid }, { name: '我的地址' });
                            }
                            break;
                        case '修改默认地址':
                            if (data.success) {
                                resourceService.queryPost($scope, $filter('getUrl')('我的地址'), { uid: $scope.uid }, { name: '我的地址' });
                            }
                            break;
                    }
                });


                //是否确认删除
                $scope.isdelete = function (id) {
                    $scope.addressId = id;
                    $scope.hide = true;

                }
                //删除地址
                $scope.delete = function () {
                    resourceService.queryPost($scope, $filter('getUrl')('删除地址'), { uid: $scope.uid, id: $scope.addressId }, { name: '删除地址' });
                }
                // 修改地址
                $scope.editAddress = function (item) {
                    $rootScope.editAddInfo = item;
                    $state.go('redizhi');
                }
                //设置默认地址
                $scope.setDefaltAdd = function (item) {
                    resourceService.queryPost($scope, $filter('getUrl')('修改默认地址'), { uid: $scope.uid, id: item.id }, { name: '修改默认地址' });
                }
            }
        ])

    })

