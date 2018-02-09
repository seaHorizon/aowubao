define(['js/module.js'], function (controllers) {
    controllers.controller('rechargeConfirmController', function ($scope, $filter, $state, $interval, $rootScope, resourceService, ngDialog, $stateParams, $localStorage, postcallService) {
        $rootScope.title = "充值";
        var user = $filter('isRegister')();
        $scope.isSubMin = true;
        $scope.nowTimer = "获取验证码";
        $scope.userForm = {};
        $scope.amount = $stateParams.amount;
        // $scope.userForm.amt = $stateParams.amt;
        $scope.cangetyzm = true;
        $scope.hasgetyzm = false;
        var user = $filter('isRegister')();
        $scope.getyzm = function (reCreate) {
            if (reCreate == 1) {//判断是否点击
                if ($scope.nowTimer == '重试') {
                    $scope.isSubMin = true;
                }
            }
            // if(reCreate==1){
            // resourceService.queryPost($scope, $filter('getUrl')('创建订单'), {
            //     amount: $scope.amount,
            //     uid: $scope.userForm.uid
            // }, { name: '创建订单' });
            // }
            // else{
            if ($scope.isSubMin == true && $scope.cangetyzm == true) {
                $scope.cangetyzm = false;
                resourceService.queryPost($scope, $filter('getUrl')('充值验证码'), {
                    uid: $scope.userForm.uid,
                    type: 1,
                    payNum: $stateParams.payNum
                }, { name: '充值验证码' });
            }
            // }
        };
        if (user.register != true) {
            $state.go('dl', { returnurl: 'recharge' });
            return;
        }
        else {
            $scope.userForm.uid = user.user.member.uid;
            $scope.userForm.payNum = $stateParams.payNum;
            resourceService.queryPost($scope, $filter('getUrl')('充值index'), { uid: $scope.userForm.uid }, { name: '充值index' });
            $scope.getyzm();
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '充值index':
                    if (data.success) {
                        $scope.recharge = data.map;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '充值验证码':
                    if (data.success) {
                        $filter('60秒倒计时')($scope, 60);
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                        $scope.isSubMin = false;
                        $scope.cangetyzm = true;
                        // $scope.userForm.order = data.map.order;
                        $scope.hasgetyzm = true;
                    }
                    else {
                        $scope.cangetyzm = true;
                        if (data.errorMsg) {
                            $rootScope.errorText = data.errorMsg;
                        } else {
                            $rootScope.errorText = "验证码发送失败";
                        }
                        $rootScope.maskError = true;
                    }
                    break;
                case '充值':
                    if (data.success) {
                        ngDialog.open({
                            template: '<p class="error-msg">充值成功！</p>',
                            showClose: false,
                            closeByDocument: false,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                            $state.go('main.myaccountHome');
                            // $filter('跳回上一页')(2);
                        }, 2000);
                    }
                    else if (!data.errorMsg) {
                        $rootScope.errorText = '充值失败（' + data.errorCode + '）';
                        $rootScope.maskError = true;
                    }
                    else {
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    }
                    break;
                case '创建订单':
                    if (data.success) {
                        $state.go('rechargeConfirm', {
                            amount: $stateParams.amount,
                            payNum: data.map.payNum
                        });
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            };
        });
        $scope.submitForm = function (valid) {
            if (!valid) {
                return;
            }
            if ($scope.hasgetyzm == false) {
                $rootScope.errorText = '请先获取验证码';
                $rootScope.maskError = true;
            }
            else {
                resourceService.queryPost($scope, $filter('getUrl')('充值'), $scope.userForm, { name: '充值' });
            }
        };
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
    });
})