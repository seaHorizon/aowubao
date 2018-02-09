define(['js/module.js'], function (controllers) {
    controllers.controller('rechargeController', function ($scope, $filter, $state, $interval, $rootScope, resourceService, ngDialog, $stateParams, $localStorage, postcallService) {
        $rootScope.title = "充值";
        $scope.repairing = false;
        $filter('isPath')('recharge');
        var user = $filter('isRegister')();
        if (user.register != true) {
            $state.go('dl', { returnurl: 'recharge' });
            return;
        }
        else {
            $scope.userForm = {};
            $scope.userForm.amount = '';
            $scope.userForm.uid = user.user.member.uid;
            resourceService.queryPost($scope, $filter('getUrl')('充值index'), $scope.userForm, { name: '充值index' });
        }
        // if ($stateParams.from == 'home' && $localStorage.cp) {
        //     delete $localStorage.cp;
        // }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '充值index':
                    if (data.success) {
                        $scope.recharge = data.map;
                        if (data.map.repairing == 1) {
                            $scope.repairing = true;
                        }
                        $scope.singleQuota = data.map.singleQuota;
                        if (data.map.sysArticleList) {
                            if (data.map.sysArticleList.length > 0) {
                                $scope.message = data.map.sysArticleList[0].summaryContents;
                            }
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '创建订单':
                    if (data.success) {
                        $state.go('rechargeConfirm', {
                            amount: $scope.userForm.amount,
                            payNum: data.map.payNum
                        });
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            };
        });
        // onblur将金额保留两位小数
        $scope.setAmount = function (tegForm) {
            if (tegForm.amount.$error.pattern) {
                $filter('充值错误信息')('pattern', $scope);
            } else if (tegForm.amount.$error.more3) {
                $filter('充值错误信息')('more3', $scope);
            } else if (tegForm.amount.$error.rechargelimit) {
                $filter('充值错误信息')('rechargelimit', $scope);
            } else if (tegForm.amount.$error.required) {
                $filter('充值错误信息')('required', $scope);
            }
            else {
                $scope.amount = $filter('isNumber2')($scope.amount, undefined, 1);
            }
        };

        // 提交表单
        $scope.submitForm = function (valid) {
            if (!valid) {
                return;
            }
            $scope.userForm.amount = parseFloat($scope.amount);
            // console.log($scope.userForm.amount)
            resourceService.queryPost($scope, $filter('getUrl')('创建订单'), $scope.userForm, { name: '创建订单' });
        };
        $scope.toback = function () {
            // $filter('跳回上一页')(3);
            $state.go('main.myaccountHome');
        };


        // 关闭
        $scope.shutdown = function () {
            $state.go('main.myaccountHome');
        }

    });
})