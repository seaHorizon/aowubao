/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

'use strict';
define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('couponController'
        , ['$scope', 'resourceService', '$filter', '$state', '$rootScope', '$localStorage', '$location', '$stateParams', '$timeout', '$interval'
            , function ($scope, resourceService, $filter, $state, $rootScope, $localStorage
                , $location, $stateParams, $timeout, $interval) {
                $rootScope.title = '可用的红包';
                $scope.myId = $location.$$search.cpid;
                $scope.coupons = $localStorage.coupons;
                $scope.amt = $stateParams.amt;
                $scope.onClick = function (item) {
                    if (item.enableAmount <= $scope.amt || $scope.amt == null) {
                        $localStorage.coupon = item;
                        $state.go('investment', { cpid: item.id, amt: $stateParams.amt });
                    }
                };

                resourceService.queryPost($scope, $filter('getUrl')('活动不支持优惠券'), {}, '活动不支持优惠券');
                $scope.youhui = true;
                $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                    switch (type) {
                        case '活动不支持优惠券':
                            if (data.success) {
                                $scope.youhui = data.map.useFavourable;
                            }
                            break;

                    };
                });
                $interval(function () {
                    $scope.youhui = true;
                }, 2500);
            }
        ]);
})
