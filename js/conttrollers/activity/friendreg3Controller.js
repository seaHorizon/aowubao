define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function(wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('friendreg3Controller', function($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, signWeChatService) {
        if ($filter('isRegister')().register) {
            $scope.user = $filter('isRegister')().user.member;
        }
        $rootScope.title = '新用户注册';
        $scope.login = {};
        $scope.money = {};
        $localStorage.money = $scope.money;
        $scope.card = {};
        $localStorage.card = $scope.card;


        if ($localStorage.webFormPath != undefined) {
            if ($localStorage.webFormPath.recommCode != undefined) {
                $scope.login.recommPhone = $localStorage.webFormPath.recommCode;
            };
            if ($localStorage.webFormPath.toFrom != undefined) {
                $scope.login.toFrom = $localStorage.webFormPath.toFrom;
            };
            if ($localStorage.webFormPath.tid != undefined) {
                $scope.login.tid = $localStorage.webFormPath.tid;
            };
        };
        $scope.webFormPath = $localStorage.webFormPath;
        if ($location.$$search) { $scope.webFormPath = $location.$$search; }

        if ($scope.webFormPath.toFrom != undefined) {
            $scope.login.toFrom = $scope.webFormPath.toFrom;
        }
        if ($scope.webFormPath.recommCode != undefined) {
            $scope.login.recommPhone = $scope.webFormPath.recommCode;
        }
        if ($scope.webFormPath.tid != undefined) {
            $scope.login.tid = $scope.webFormPath.tid;
        }
        if ($stateParams.myToFrom != '' && $stateParams.myToFrom != null) {
            $scope.login.toFrom = $stateParams.myToFrom;
        }
        if ($stateParams.maskType != '' || $stateParams.maskType != undefined) {
            $localStorage.maskType = $stateParams.maskType;
        }
        // 图形验证码
        var changeIMG = function(event) { //换图片验证码
            if (event != undefined) {
                event.currentTarget.src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[0] != undefined) {
                    $('.img-box img')[0].src += '?' + new Date().getTime();
                }
            }
        };
        changeIMG();
        $scope.clickInput = function(event) {
            changePicEvent = event;
            changeIMG(changePicEvent);
        };
        $scope.passwordText = false;
        $scope.isSubMin = false;
        $scope.nowTimer = "获取验证码";
        var changePicEvent;
        var targetFrom;
        if ($location.$$search.frompc) { $scope.frompc = $location.$$search.frompc; }
        var isSub = true;
        $scope.isImgCode = true;
        $scope.zuce = function(tegForm) {
            $scope.login.checkbox = true;
            if ($scope.login.recommPhone === undefined) {
                delete $scope.login.recommPhone;
            };
            if ($scope.login.toFrom === undefined) {
                delete $scope.login.toFrom;
            };
            if (tegForm.$valid) {
                if ($scope.login.passWord.length > 5) {
                    if (isSub) {
                        isSub = false;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                if (tegForm.mobilephone.$error.required == true) {
                    $rootScope.errorText = '请输入需验证的手机号码';
                    $rootScope.maskError = true;
                } else if (tegForm.mobilephone.$valid == false) {
                    $rootScope.errorText = '请输入正确的手机号码';
                    $rootScope.maskError = true;
                } else if (tegForm.picCode.$error.required == true) {
                    $rootScope.errorText = '请输入图形码';
                    $rootScope.maskError = true;
                } else if (tegForm.picCode.$valid == false) {
                    $rootScope.errorText = '请输入正确的图形码';
                    $rootScope.maskError = true;
                } else if (tegForm.picCode.$error.required == true) {
                    $rootScope.errorText = '请输入验证码';
                    $rootScope.maskError = true;
                } else if (tegForm.smsCode.$valid == false) {
                    $rootScope.errorText = '请输入正确的验证码';
                    $rootScope.maskError = true;
                } else if (tegForm.passWord.$error.required == true) {
                    $rootScope.errorText = '密码不能为空';
                    $rootScope.maskError = true;
                } else if (tegForm.passWord.$valid == false) {
                    $rootScope.errorText = '请输入正确的密码';
                    $rootScope.maskError = true;
                } else {
                    $rootScope.errorText = '请正确填写以上信息';
                    $rootScope.maskError = true;
                }
            }

        }
        $scope.showPassword = function(passwordTextBool) {
            if (passwordTextBool) {
                $scope.passwordText = false;
            } else {
                $scope.passwordText = true;
            }
        }
        $scope.isSubMin = true;
        $scope.hasPhone = false;
        $scope.getyzm = function(tegForm) {
            targetFrom = tegForm;
            if ($scope.isSubMin == true) {
                if ($scope.isImgCode == true) {
                    if (tegForm.mobilephone.$error.required == true) {
                        $rootScope.errorText = '请输入需验证的手机号码';
                        $rootScope.maskError = true;
                    } else if (tegForm.mobilephone.$valid == false) {
                        $rootScope.errorText = '请输入正确的手机号码';
                        $rootScope.maskError = true;
                    } else if ($scope.hasPhone == true) {
                        $rootScope.errorText = '此手机已注册';
                        $rootScope.maskError = true;
                    } else if (tegForm.picCode.$error.required == true) {
                        $rootScope.errorText = '请输入图形码';
                        $rootScope.maskError = true;
                    } else if (tegForm.picCode.$valid == false) {
                        $rootScope.errorText = '请输入正确的图形码';
                        $rootScope.maskError = true;
                    } else {
                        resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                            mobilephone: $scope.login.mobilephone,
                            picCode: $scope.login.picCode,
                            isPic: true
                        }, { name: '获取验证码', tegForm: tegForm });
                    }
                } else {
                    $scope.login.picCode = '';
                    $scope.isImgCode = true;
                    changeIMG();
                    $rootScope.errorText = '请重新输入图形码';
                    $rootScope.maskError = true;
                }
            }
        };
        /*焦点进入与离开*/
        $scope.blurID = function(code, tegForm) {
            if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                    mobilephone: $scope.login.mobilephone
                }, { name: '注册验证手机号', tegForm: tegForm });
            };
            changeIMG();
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success == true) {
                        $filter('60秒倒计时')($scope, 120);
                        $scope.isImgCode = false;
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.maskError = true;
                    } else if (data.errorCode == '1006') {
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    } else {
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (data.map.exists) { //已有用户名
                            $rootScope.errorText = '此手机已注册';
                            $rootScope.maskError = true;
                            $scope.hasPhone = true;
                        } else {
                            $scope.hasPhone = false;
                        };
                    }
                    break;
                case '注册':
                    isSub = true;
                    if (data.success) {
                        $localStorage.user = data.map;
                        if ($stateParams.toWhere) {
                            $state.go($stateParams.toWhere, { wap: true });
                        } else {
                            if (data.map.tip_realverifyed_send_total) {
                                $localStorage.money.cash = data.map.tip_realverifyed_send_total.tip_back_total_cash;
                                $localStorage.money.experience = data.map.tip_realverifyed_send_total.tip_back_total_experience;
                                $localStorage.money.redPacket = data.map.tip_realverifyed_send_total.tip_back_total_redPacket;
                            } else {
                                $scope.banka = false;
                            }

                            if (data.map.register_send_total) {
                                $localStorage.card.cash = data.map.register_send_total.back_total_cash;
                                $localStorage.card.experience = data.map.register_send_total.back_total_experience;
                                $localStorage.card.redPacket = data.map.register_send_total.back_total_redPacket;
                            }

                            $state.go('regSuccess1');
                        }
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.login.passWord = '';
                    };
                    break;
            };
        });
    })


    controllers.controller('controllerSetPassword', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'ngDialog', function($scope, $rootScope, resourceService, $filter, $state, ngDialog) {
        $scope.toHome = function() {
            resourceService.queryPost($scope, $filter('getUrl')('setpassword'), {
                'mobilephone': localStorage.phone,
                'uid': localStorage.userid
            }, '设置交易密码');
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            if (type == '设置交易密码') {
                if (data.result == "0") {
                    $filter('errorMsgDialog')('none', ngDialog, '失败');
                } else if (data.result == "error01") {
                    $filter('errorMsgDialog')('none', ngDialog, '手机号码为空');

                } else if (data.result == "error02") {
                    $filter('errorMsgDialog')('none', ngDialog, '登陆用户不存在');

                } else if (data.result == "1") {
                    $filter('errorMsgDialog')('none', ngDialog, '成功');
                    $state.go('home');
                }
            }
        });
    }])
})