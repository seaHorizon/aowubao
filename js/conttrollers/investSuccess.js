define(['js/module.js'], function(controllers) {
    controllers.controller('investSuccess', function($scope, $rootScope, $filter, $state, resourceService, $localStorage, $stateParams, $http) {
        $rootScope.title = "投资成功";
        $scope.data = {};
        $scope.user = $filter('isRegister')().user.member;
        if (!$scope.user) { $state.go('dl'); return; }
        // if($stateParams.success){
        //     if($stateParams.success=='success'){
        //         $localStorage.successData.investTime = $stateParams.investTime;
        //         $localStorage.successData.isRepeats = $stateParams.isRepeats;
        //         $localStorage.successData.luckCodeCount = $stateParams.luckCodeCount;
        //         $localStorage.successData.luckCodes = $stateParams.luckCodes;
        //         $localStorage.successData.activityURL = $stateParams.activityURL;
        //         $localStorage.successData.jumpURL = $stateParams.jumpURL;
        //     }
        // }
        if ($localStorage.successData) {
            $scope.data = $localStorage.successData;
        }
        delete $localStorage.successData;
        if ($scope.data.coupon && $scope.data.coupon.type) {
            if ($scope.data.coupon.type == 1) {
                $scope.couponText = '返现券 ' + $scope.data.coupon.amount + "元";
            } else if ($scope.data.coupon.type == 2) {
                $scope.couponText = '加息券 ' + $scope.data.coupon.raisedRates + "%";
            } else if ($scope.data.coupon.type == 4) {
                $scope.couponText = '翻倍券 ' + $scope.data.coupon.multiple + "倍";
            }
        }

        $http({
            method: 'GET',
            url: '/index/getActivityByCode.do',
            params: {
                code: 17
            }
        }).then(function successCallback(response) {
            $scope.imgUrl = response.data.map.activity.imgUrl;
            $scope.location = response.data.map.activity.location;
        }, function errorCallback(response) {
            // 请求失败执行代码
        });


        $scope.closeyaoqing = function() {
            $('.yaoqinghaoyou').fadeOut(200);
        };
        // $scope.showCancel=function(){
        //     $scope.cancelShow=true;
        // };
        $scope.closeCancel = function() {
            $scope.cancelShow = false;
        };
    });
})