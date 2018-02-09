'use strict';
define(['js/module.js', 'jquery', 'ngdialog'], function (controllers, $, ngdialog) {
    controllers.controller('certificationsCtrl', function ($scope, resourceService, $filter, $http, $state, $rootScope, $localStorage, ngDialog) {
        resourceService.getJsonServer($scope, '/data/ProvinceAndCity.json', {}, '静态文本_菜单');





        $scope.selectedItem = {};
        $scope.$on('resourceService_GET_JSON.MYEVENT', function (event, data, type) {
            switch (type) {
                case "静态文本_菜单":
                    $scope.cityList = data.result;
                    break;
            }
        });
        $rootScope.title = "实名变更";
        $scope.nowTimer = "获取验证码";
        var user = $filter('isRegister')().user;
        if (!user.member.uid) {
            $state.go('dl');
            return;
        } else if (user.realName == true) {
            $state.go('main.myaccountHome');
            return;
        } else {
            $scope.userForm = {};
            $scope.userForm.uid = user.member.uid;
            $scope.userForm.type = 1;
        }

        $scope.hide = true;

        resourceService.queryPost($scope, $filter('getUrl')('银行限额列表'), {}, '银行限额列表');

        $scope.canSendYzm = true;
        $scope.canSubmit = true;
        $scope.isSubMin = true;

        $scope.money = {};
        $localStorage.money = $scope.money;

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case '信息认证':
                    if (data.success) {
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                        $filter('60秒倒计时')($scope, 60);
                    } else {
                        $filter('实名短信错误信息')(data.errorCode, $scope, 'y');
                    }
                    $scope.canSendYzm = true;
                    break;
                case '银行限额列表':
                    if (data.success) {
                        $scope.yinhang = data.map.bankQuotaList;
                        for (var i = 0; i < $scope.yinhang.length; i++) {
                            $scope.yinhang[i].isSelected = false;
                        }
                    }
                    break;
                case '实名认证':
                    if (data.success) {
                        $filter('isRegister')(data.map);
                        $localStorage.money.cash = data.map.realverifyed_send_total.back_total_cash;
                        $localStorage.money.experience = data.map.realverifyed_send_total.back_total_experience;
                        $localStorage.money.redPacket = data.map.realverifyed_send_total.back_total_redPacket;
                        $state.go('certificationSuccess');
                    } else {
                        $filter('实名认证错误信息')(data.errorCode, $scope, 'y', data.errorMsg);
                    }
                    $scope.canSubmit = true;
                    break;

                case '换绑卡':
                    if (data.success) {
                        $state.go('myBank');
                    } else {
                        $filter('实名认证错误信息')(data.errorCode, $scope, 'y', data.errorMsg);
                    }
                    $scope.canSubmit = true;
                    break;

            };
        });
        $scope.toback = function () {
            // $filter('跳回上一页')();
            $state.go('main.myaccountHome');
        };
        $scope.onClick = function () {
            ngDialog.closeAll();
        };
        $scope.sendYzm = function (myForm) {

            // console.log(myForm.selectedItem);
            if ($scope.canSendYzm != true || $scope.isSubMin != true) {
                return;
            }
            if (myForm.phone.$valid == false) {
                $rootScope.errorText = '请输入正确的手机号码';
                $rootScope.maskError = true;
            } else if (myForm.realName.$error.required == true) {
                $rootScope.errorText = '请输入真实姓名';
                $rootScope.maskError = true;
            } else if (myForm.idCards.$valid == false) {
                $rootScope.errorText = '请输入正确的身份证号码';
                $rootScope.maskError = true;
            } else if (myForm.bankNum.$valid == false) {
                $rootScope.errorText = '请输入正确的银行卡号码';
                $rootScope.maskError = true;
            } else if (myForm.select_province.$error.required == true || myForm.cityCode.$error.required == true) {
                $rootScope.errorText = '请选择开户所在地';
                $rootScope.maskError = true;
            } else {
                $scope.canSendYzm = false;
                resourceService.queryPost($scope, $filter('getUrl')('信息认证'), {
                    uid: user.member.uid,
                    mobilePhone: $scope.userForm.phone,
                    bankNum: $filter('limitTo')($scope.userForm.bankNum, -4),
                    type: 1,
                }, '信息认证');
            }
        }
        $scope.submit = function () {
            if ($scope.canSubmit != true) {
                return;
            }
            $scope.userForm.insCd = $scope.selectedItem.insCd;
            $scope.userForm.type = 2;
            $scope.canSubmit = false;
            resourceService.queryPost($scope, $filter('getUrl')('换绑卡'), $scope.userForm, '换绑卡');







        }
        $scope.changeProvince = function () {
            $scope.userForm.cityCode = undefined;
        }
        $scope.bankList = [
            { code: '0102', bankName: '中国工商银行' },
            { code: '0103', bankName: '中国农业银行' },
            { code: '0104', bankName: '中国银行' },
            { code: '0105', bankName: '中国建设银行' },
            { code: '0301', bankName: '交通银行' },
            { code: '0302', bankName: '中信银行' },
            { code: '0303', bankName: '中国光大银行' },
            { code: '0304', bankName: '华夏银行' },
            { code: '0305', bankName: '中国民生银行' },
            { code: '0306', bankName: '广东发展银行' },
            { code: '0307', bankName: '平安银行股份有限公司' },
            { code: '0308', bankName: '招商银行' },
            { code: '0309', bankName: '兴业银行' },
            { code: '0310', bankName: '上海浦东发展银行' },
            { code: '0403', bankName: '中国邮政储蓄银行股份有限公司' },
        ];

        // 选择银行
        $scope.hides = function () {
            $scope.hide = false;
        };
        $scope.show = function () {
            $scope.hide = true;
        };


        $scope.xianshi = false;

        //选中银行执行事件
        $scope.xuanzhong = function (list) {
            list.isSelected = true;
            if (list.repairing == 0) {
                $scope.selectedItem = list;
            }
            for (var i = 0; i < $scope.yinhang.length; i++) {
                if (list.id != $scope.yinhang[i].id) {
                    $scope.yinhang[i].isSelected = false;
                }
                if (list.repairing == 0) {
                    $scope.hide = true;

                } else {
                    $scope.hide = false;
                    list.isSelected = false;
                }
            }
        }
        $scope.user = $filter('isRegister')().user;
        $scope.userForm.realName = $scope.user.member.realName;
        $scope.userForm.idCards = $scope.user.member.idCards;



    });
})