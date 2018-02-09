define(['js/module.js'], function (controllers) {
    controllers.controller('getcashCtrl', function ($scope, $filter, $state, $rootScope, resourceService, ngDialog, postcallService, $stateParams) {
        $rootScope.title = "我要提现";
        $scope.repairing = false;
        $scope.userOBJ = $filter('isRegister')();
        if ($scope.userOBJ.register != true) {
            $state.go('dl');
            return;
        }

        $filter('isPath')('getCash');
        $scope.isSubmit = false;
        $scope.cash = {};
        resourceService.queryPost($scope, $filter('getUrl')('提现'), {
            uid: $scope.userOBJ.user.member.uid
        }, '提现');
        /*  resourceService.queryPost($scope, $filter('getUrl')('我的信息'), {
             uid: $scope.userOBJ.user.member.uid
         }, '我的信息'); */
        // 提交表单
        $scope.submitForm = function (valid) {
            if (!valid || $scope.isSubmit) {
                return;
            }
            if ($scope.cashForm.cash.$error.required) {
                $filter('提现错误信息')('required', $scope);
            } else if ($scope.cash.amount < 1 && $scope.cash.isChargeFlag == 0) {
                $filter('提现错误信息')('morethan', $scope);
            } else if ($scope.cash.amount < 3 && $scope.cash.isChargeFlag != 0) {
                $filter('提现错误信息')('morethan3', $scope);
            } else if ($scope.cash.amount > $scope.cash.funds && $scope.cash.funds <= 500000) {
                $filter('提现错误信息')('withdrawlimit', $scope);
            } else if ($scope.cash.amount > 500000) {
                $filter('提现错误信息')('maxlimit', $scope);
            } else {
                $scope.isSubmit = true;
                resourceService.queryPost($scope, $filter('getUrl')('提现申请'), {
                    amount: $scope.cash.amount,
                    tpw: $scope.cash.tradepwd,
                    isChargeFlag: $scope.cash.isChargeFlag,
                    uid: $scope.userOBJ.user.member.uid
                }, '提现申请');
            }
        };

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '我的信息':
                    if (data.success) {
                        $scope.user = data.map;

                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
                case '提现':
                    if (data.success) {
                        $scope.cash = data.map;
                        if (data.map.repairing == 1) {
                            $scope.repairing = true;
                        }
                        $scope.fuiou_balance = data.map.fuiou_balance;
                        $scope.funds = data.map.funds;
                        if (data.map.isChargeFlag) {
                            $scope.cash.cost = 2;
                        } else {
                            $scope.cash.cost = 0;
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '提现申请':
                    if (data.success) {
                        ngDialog.open({
                            template: '<p class="success-msg">您已成功提现' + $filter('currency')(data.map.amount, '') + '元</p>',
                            showClose: false,
                            closeByDocument: false,
                            plain: true
                        });
                        setTimeout(function () {
                            ngDialog.closeAll();
                            $state.go('main.myaccountHome');
                        }, 2000);
                    } else {
                        if (data.errorCode == '2001') {
                            $filter('投资交易密码错误信息')($scope);
                        } else if (data.errorCode == '1006') {
                            ngDialog.open({
                                template: '<p class="error-msg">处理中</p>',
                                showClose: false,
                                closeByDocument: false,
                                plain: true
                            });
                            setTimeout(function () {
                                ngDialog.closeAll();
                                $state.go('main.myaccountHome');
                            }, 2000);
                        } else {
                            $filter('提现申请错误信息')(data.errorCode, $scope, 'y');
                        }
                        $scope.isSubmit = false;
                    }
                    break;
            };
        });

        $scope.getAllFlag = false;
        var $circlebtn = $('.circlebtn'),
            $circlei = $('i', $circlebtn),
            circleLeft = $circlebtn.width() - $circlei.width();
        $scope.setAll = function () {
            if ($scope.getAllFlag == false) {
                $scope.cash.amount = $filter('isNumber2')($scope.cash.funds, undefined, 1);
                $circlei.animate({ left: circleLeft }, 200, function () {
                    $scope.getAllFlag = true;
                    $circlei.css({ left: 'auto', right: '-1px' });
                    $circlei.css({ 'border-color': '#ff6400' });
                    $circlebtn.css({ 'background': '#ff6400', 'border-color': '#ff6400' });
                });
            } else if ($scope.getAllFlag == true) {
                $scope.cash.amount = '';
                $circlebtn.css({ 'background': '#d2d2d2', 'border-color': '#d2d2d2' });
                $circlei.css({ 'border-color': '#d2d2d2', 'left': circleLeft, 'right': 'auto' });
                $circlei.animate({ left: '-1px' }, 200, function () {
                    $scope.getAllFlag = false;
                    $circlei.css({ left: '-1px', right: 'auto' });
                });
            }
        };

        // onblur将金额保留两位小数
        $scope.setAmount = function (event) {
            if ($scope.getAllFlag == true && $scope.cash.amount < $scope.funds) {
                $circlebtn.css({ 'background': '#d2d2d2', 'border-color': '#d2d2d2' });
                $circlei.css({ 'border-color': '#d2d2d2', 'left': circleLeft, 'right': 'auto' });
                $circlei.animate({ left: '-1px' }, 200, function () {
                    $scope.getAllFlag = false;
                    $circlei.css({ left: '-1px', right: 'auto' });
                });
            } else if ($scope.getAllFlag == false && $scope.cash.amount == $scope.funds) {
                $circlei.animate({ left: circleLeft }, 200, function () {
                    $scope.getAllFlag = true;
                    $circlei.css({ left: 'auto', right: '-1px' });
                    $circlei.css({ 'border-color': '#ff6400' });
                    $circlebtn.css({ 'background': '#ff6400', 'border-color': '#ff6400' });
                });
            }
            $scope.cash.amount = $filter('isNumber2')($scope.cash.amount, undefined, 1);
        };
        $scope.toback = function () {
            $filter('跳回上一页')(3);
        };
        $scope.onClick = function () {
            ngDialog.closeAll();
        };


        // 关闭
        $scope.shutdown = function () {
            $state.go('main.myaccountHome');
        }
    });
})