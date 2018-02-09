'use strict';
define(['js/module.js', 'jquery'], function (controllers, $) {
    controllers.controller('investmentController', function ($scope, resourceService, $filter, $state, $rootScope, $localStorage, $stateParams, postcallService, ngDialog) {
        $scope.submitBool = true;
        $rootScope.title = '产品投资';
        $filter('isPath')('investment');
        var user = $filter('isRegister')().user;
        if ($filter('isRegister')().register != true) {
            $state.go('dl', { returnurl: 'investment' });
            return;
        }
        $scope.cpCoupon = {};
        if ($stateParams.amt != null) {
            $scope.amount = $stateParams.amt * 1;
        };
        $scope.cpCoupon.type = 0;
        if ($stateParams.pid) {
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                'pid': $stateParams.pid,
                'uid': user.member.uid
            }, '产品详情');
        }
        else {
            $scope.cp = $localStorage.cp;
            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                'pid': $scope.cp.info.id,
                'uid': user.member.uid
            }, '产品详情');
        }
        $scope.playSound = true;
        $scope.userTypes = {};
        $scope.userTypes.passWord = '';
        $scope.showMask = false;
        $scope.cpCoupon.id = '';

      

        $scope.delCoupon = function () {
            $scope.cpCoupon = { type: 0, id: null };
        };
        if ($scope.amount >= 5000) {
            $scope.select = true;
        }
        else {
            $scope.select = false;
        }
        $scope.changeSelect = function () {
            if ($scope.select == false) {
                $scope.amount = 5000;
            }
            else if ($scope.amount >= 5000) {
                $scope.amount = '';
            }
            $scope.select = !$scope.select;
        }
        $scope.onChange = function () {
            $rootScope.amt = $scope.amount * 1;
            if($scope.amount > $scope.cp.info.surplusAmount){      
                $scope.amount = $scope.cp.info.surplusAmount;
            }

            if ($scope.amount >= 5000) {
                $scope.select = true;
            }
            else {
                $scope.select = false;
            }
        };
        $scope.agreeclick = function () {
            $scope.playSound = !$scope.playSound;
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '用户状态':
                    if (data.success) {
                        $scope.userTypes = data.map;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '产品详情':
                    if (data.success) {
                        data.map.specialRate = parseFloat(data.map.specialRate);
                        $localStorage.cp = $scope.cp = data.map;
                        if ($scope.cp.info.type != 3) {
                            $scope.placeholder = $scope.cp.info.leastaAmount + '元起投，' + $scope.cp.info.increasAmount + '元递增';
                            $('#amountinput').attr('placeholder', $scope.placeholder);
                        }
                        else {
                            $scope.placeholder = $scope.cp.info.leastaAmount + '元起投，限额' + $scope.cp.info.maxAmount + '元';
                            $('#amountinput').attr('placeholder', $scope.placeholder);
                        }
                        if ($scope.cp.info.type == 1) { $scope.playSound = true; }
                        if ($filter('isRegister')().user.member != undefined) {
                            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                                'uid': $filter('isRegister')().user.member.uid
                            }, '用户状态');
                            resourceService.queryPost($scope, $filter('getUrl')('cpDetail'), {
                                'uid': $filter('isRegister')().user.member.uid,
                                'pid': $scope.cp.info.id
                            }, '账户余额');
                            if ($scope.cp.info.repayType != 3 && $scope.cp.info.repayType != 4 && $scope.cp.info.type != 3) {
                                resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                                    'uid': $filter('isRegister')().user.member.uid,
                                    'pid': $scope.cp.info.id
                                }, '产品可用优惠券');
                            }
                        } else {
                            resourceService.queryPost($scope, $filter('getUrl')('判断用户状态'), {
                            }, '用户状态');
                            if ($scope.cp.info.repayType != 3 && $scope.cp.info.repayType != 4 && $scope.cp.info.type != 3) {
                                resourceService.queryPost($scope, $filter('getUrl')('产品可用优惠券'), {
                                    'pid': $scope.cp.info.id
                                }, '产品可用优惠券');
                            };
                        };
                    }
                    break;
                case '账户余额':
                    $scope.balance = data.map.balance;
                    if ($scope.cp.info.establish != undefined) {
                        var date3 = $scope.cp.info.establish - Date.parse(new Date());
                        var day = Math.floor(date3 / (24 * 3600 * 1000));
                        var hh = Math.floor(date3 / (3600 * 1000));
                        if (day > 0) {
                            $scope.nowTimer = day + '天';
                            // $scope.isFinish = true;
                        }
                        else if (day == 0 && hh > 1) {
                            $scope.nowTimer = hh + '小时';
                            // $scope.isFinish = true;
                            $scope.isBuTimer = true;
                        }
                        else if (day == 0 && hh < 1) {
                            $scope.nowTimer = '1小时内'
                            // $scope.isFinish = true;
                        }
                        else if (hh < 0) {
                            if ($scope.cp.info.type == 1) {
                                $scope.nowTimer = '无限制';
                            }
                            else {
                                $scope.nowTimer = '已结束';
                            }
                            $scope.isFinish = true;
                        }
                    } else {
                        $scope.nowTimer = '已结束';
                        $scope.isFinish = true;
                    };
                    break;
                case '产品可用优惠券':
                    var couponAmount = {};
                    couponAmount.amount = 0;
                    if (data.success) {
                        $localStorage.coupons = $scope.cop = data.map.list;
                        if ($stateParams.cpid != undefined && $scope.cop.length > 0) {
                            for (var i = 0; i < $scope.cop.length; i++) {
                                if ($scope.cop[i].id == $stateParams.cpid) {
                                    $scope.cpCoupon = $scope.cop[i];
                                }
                            };
                        }
                        else if ($localStorage.fromJY != undefined && $scope.cop.length > 0) {//设置密码回来后回填
                            for (var i = 0; i < $scope.cop.length; i++) {
                                if ($scope.cop[i].id == $localStorage.fromJY.cpid) {
                                    $scope.cpCoupon = $scope.cop[i];
                                }
                            };
                            $scope.amount = $localStorage.fromJY.amount;
                            $scope.cp.info.id = $localStorage.fromJY.cpInfoId;
                            if ($scope.amount >= 5000) {
                                $scope.select = true;
                            }
                            else {
                                $scope.select = false;
                            }
                            delete $localStorage.fromJY;
                        }
                        else {
                            $scope.cpCoupon.type = 0;
                        };

                        if (!$stateParams.pid) {
                            for (var j = 0; j < $scope.cop.length; j++) {
                                if ($scope.cop[j].pid && !$localStorage.coupon) {
                                    $scope.cpCoupon = $scope.cop[j];
                                }
                            }
                        }
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y')
                    }
                    break;
                case '购买产品':
                    if (data.success) {
                        $scope.successData = $scope.cp;
                        $scope.successData.shouyi = $rootScope.shouyi;
                        $scope.successData.investAmount = $scope.amount;
                        $scope.successData.coupon = $scope.cpCoupon ? $scope.cpCoupon : 0;
                        $scope.successData.raisedRates = $scope.cpCoupon.raisedRates;
                        $scope.successData.multiple = $scope.cpCoupon.multiple;
                        $scope.successData.investTime = data.map.investTime;
                        $scope.successData.isRepeats = data.map.isRepeats;
                        $scope.successData.luckCodeCount = data.map.luckCodeCount;
                        $scope.successData.luckCodes = data.map.luckCodes;
                        $scope.successData.activityURL = data.map.activityURL;
                        $scope.successData.jumpURL = data.map.jumpURL;
                        $localStorage.successData = $scope.successData;
                        $state.go('investSuccess');
                    } else {
                        if (data.errorCode == '2001') {
                            $filter('投资交易密码错误信息')($scope);
                        }
                        else {
                            $filter('投资错误信息')(data.errorCode, $scope, 'y', data.errorMsg);
                        }
                    }
                    break;
            };
        });
        $scope.closeLayer = function () {
            $('.invest-balance-layer').fadeOut(200);
        }
        $scope.tobuy = function () {
            if ($scope.amount != '' && $scope.amount != undefined && $('#myPwd').val() != '') {
                if ($scope.cpCoupon.enableAmount > $scope.amount) {
                    ngDialog.open({
                        template: '<p class="error-msg">投资金额小于使用红包的最小限额！</p>',
                        showClose: false,
                        closeByDocument: true,
                        plain: true
                    });
                    return;
                }
                resourceService.queryPost($scope, $filter('getUrl')('购买产品'), {
                    'pid': $scope.cp.info.id,
                    'tpwd': $scope.userTypes.passWord,
                    'amount': $scope.amount,
                    'uid': $filter('isRegister')().user.member.uid,
                    'fid': $scope.cpCoupon.id
                }, '购买产品');
            } else {
                if ($scope.amount == '' || $scope.amount == undefined) {
                    $filter('投资错误信息')('noInp', $scope, 'y');
                } else if ($('#myPwd').val() == '') {
                    $filter('投资错误信息')('noPwd', $scope, 'y');
                }
            };
        }
        $scope.onClick = function (name) {
            switch (name) {
                case '去设置交易密码':
                    $localStorage.fromJY = {};
                    $localStorage.fromJY.amount = $scope.amount;
                    $localStorage.fromJY.cpid = $scope.cpCoupon.id;
                    $localStorage.fromJY.cpInfoId = $scope.cp.info.id;

                    $state.go('resetTradePwd', { firstset: true });
                    break;
            };
        };
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
    });
})
