define([
    'js/module.js'
], function(controllers) {
    controllers.controller('pwdCtrl', ['$scope', '$rootScope', '$filter', '$state', 'resourceService', '$interval', '$stateParams', function($scope, $rootScope, $filter, $state, resourceService, $interval, $stateParams) {
        $rootScope.title = "重置登录密码";
        $scope.userOBJ = $filter('isRegister')();
        $scope.isGetCode = false;
        $scope.times = 60;
        $scope.isSubmit = false;
        $scope.showCode = false;
        $scope.first = true;
        $scope.red = true;
        $scope.mobilePhone = $stateParams.mobilePhone
        $scope.toback = function() {
            $filter('跳回上一页')();
        };
        if ($stateParams.forget == 'false') {
            $scope.forget = false;
        } else if ($stateParams.forget == 'true') {
            $scope.forget = true;
        }

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type) {
                case '登录密码重置短信验证码':
                    if (data.success) {
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                        $scope.timer = $interval(function() {
                            if ($scope.times == 1) {
                                $interval.cancel($scope.timer);
                                $scope.isGetCode = false;
                                $scope.times = 60;
                                return;
                            }
                            $scope.times--;
                        }, 1000);
                    } else {
                        $filter('登录交易密码短信验证码错误信息')(data.errorCode);
                        $scope.isGetCode = false;
                    }
                    break;
                case '设置登录密码':
                    if (data.success) {
                        $filter('重置密码成功')('重置登录密码成功', $scope);
                    } else {
                        $filter('重置交易密码错误信息')(data.errorCode, $scope)
                    }
                    break;
            };
        });
        $scope.changeRed = function() {
                $scope.red = true;
                $scope.secPwd.pwd = '';
            }
            // $scope.getCode();
            // $scope.getCode = function() {
            //     if ($scope.isGetCode) {
            //         return;
            //     }
        var obj = {};
        if ($scope.userOBJ.register) { //登录了
            if ($scope.forget == false) {
                obj = {
                    uid: $scope.userOBJ.user.member.uid,
                    type: 1
                };
            } else if ($scope.forget == true) {
                obj = {

                    mobilephone: $scope.userOBJ.user.member.mobilephone,
                    type: 1
                };
            }
        } else { //没登录
            obj = {

                mobilephone: $scope.mobilePhone,
                type: 1
            };
        }
        resourceService.queryPost($scope, $filter('getUrl')('登录密码重置短信验证码'), obj, '登录密码重置短信验证码');
        $scope.isGetCode = true;
        // };

        $scope.setInput = function(name) {
            switch (name) {
                case 'code':
                    if ($scope.pwdSetForm.code.$error.required) {
                        $filter('修改登录密码错误信息')('codeRequired', $scope);
                    }
                    break;
                case 'pwd':
                    if ($scope.pwdSetForm.pwd.$error.pattern) {
                        $filter('修改登录密码错误信息')('pwdPattern', $scope);
                    } else if ($scope.pwdSetForm.pwd.$error.required) {
                        $filter('修改登录密码错误信息')('pwdRequired', $scope);
                    }
                    break;
                case 'repwd':
                    if ($scope.pwdSetForm.repwd.$error.pattern) {
                        $filter('修改登录密码错误信息')('pwdPattern', $scope);
                    } else if ($scope.pwdSetForm.repwd.$error.required) {
                        $filter('修改登录密码错误信息')('pwdRequired', $scope);
                    }
                    break;
            }
        };
        //下一步
        $scope.nextStep = function(tegForm) {
            $scope.first = false;
            $scope.smsCode = tegForm.code.$viewValue;
        }
        $scope.red = function() {
                $scope.red = true;
            }
            // 提交表单
        $scope.submitForm = function(valid) {
            if ($scope.pwd.pwd == $scope.secPwd.pwd) {
                if (!valid || $scope.isSubmit) {
                    return;
                }
                $scope.isSubmit = true;
                var obj = {};
                if ($scope.userOBJ.register) { //登录了
                    if ($scope.forget == false) {
                        obj = {
                            pwd: $scope.pwd.pwd,
                            smsCode: $scope.smsCode,
                            uid: $scope.userOBJ.user.member.uid
                        };
                    } else if ($scope.forget == true) {
                        obj = {
                            pwd: $scope.pwd.pwd,
                            smsCode: $scope.smsCode,
                            mobilephone: $scope.userOBJ.user.member.mobilephone,
                        };
                    }
                } else { //没登录
                    obj = {
                        mobilephone: $scope.mobilePhone,
                        pwd: $scope.pwd.pwd,
                        smsCode: $scope.smsCode
                    };
                }

                resourceService.queryPost($scope, $filter('getUrl')('设置登录密码'), obj, '设置登录密码');
            } else {
                $scope.red = false;
            }
        };

        $scope.toback = function() {
            $filter('跳回上一页')();
        };

    }]);
})