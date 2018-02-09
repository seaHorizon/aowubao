define(['jweixin', 'js/module.js', 'jquery', 'ngdialog', 'SHR256'], function(wx, controllers, $, ngdialog, SHR256, weixin) {
    controllers.controller('controllerRegister', function($scope, $rootScope, resourceService, $filter, $state, ngDialog, $location, md5, $localStorage, $stateParams, signWeChatService) {
        if ($filter('isRegister')().register) {
            $scope.user = $filter('isRegister')().user.member;
        }
        $rootScope.title = '新用户注册';
        $scope.login = {};
        $scope.isCommon = 0;
        $scope.showDg = false;
        $scope.isRegSucess = false;
        $scope.isExit = false;
        $scope.allRight = false;
        $scope.money = {};
        $localStorage.money = $scope.money;
        $scope.card = {};
        $localStorage.card = $scope.card;
        $scope.tishi = false;
        $scope.tishi1 = false;

        $scope.isGetCode = false;

        $scope.tishikuang = function() {
            $scope.tishi = false;
        };
        $scope.tishikuang1 = function() {
            $scope.tishi1 = false;
        };


        $scope.adc = function() {
            $scope.phonetitle = myForm.mobilephone.value;
            var str = "/^1[3|4|5|7|8][0-9]{9}$/";
            if ($scope.phonetitle.substr(0, 1) != 1 && $scope.phonetitle.substr(0, 1) != '') {
                $scope.isCommon = 1;
            } else if (($scope.phonetitle.length >= 2) && ($scope.phonetitle.substr(1, 1) != 3 && $scope.phonetitle.substr(1, 1) != 4 &&
                    $scope.phonetitle.substr(1, 1) != 5 && $scope.phonetitle.substr(1, 1) != 7 &&
                    $scope.phonetitle.substr(1, 1) != 8 && $scope.phonetitle.substr(1, 1) != '')) {
                $scope.isCommon = 1;
            } else if ($scope.phonetitle.match(str) == null && $scope.phonetitle.length == 11) {
                $scope.isCommon = 1;
            } else if ($scope.phonetitle.length == 0) {
                $scope.isCommon = 0;
            } else {
                $scope.isCommon = 0;
            }
        }

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
                // event.currentTarget.src += '?' + new Date().getTime();
                $('.img-box img')[0].src += '?' + new Date().getTime();
            } else {
                if ($('.img-box img')[0] != undefined) {
                    $('.img-box img')[0].src += '?' + new Date().getTime();
                }
            }
        };
        changeIMG();
        $scope.clickInput = function(event) {
            changePicEvent = event;
            $scope.login.picCode = '';
            changeIMG(changePicEvent);
        };

        $scope.passwordText = false;
        //$scope.isSubMin = false;
        $scope.nowTimer = "60秒";
        var changePicEvent;
        var targetFrom;
        // if ($location.$$search.frompc) { $scope.frompc = $location.$$search.frompc; }
        var isSub = true;
        $scope.isImgCode = true;
        // $scope.zuce = function(tegForm) {
        //     if ($scope.login.recommPhone === undefined) {
        //         delete $scope.login.recommPhone;
        //     };
        //      if ($scope.login.toFrom === undefined) {
        //          delete $scope.login.toFrom;
        //      };
        //     if (tegForm.msg.$valid && tegForm.passWord.$valid&&tegForm.picCode.$valid) {
        //         console.log($scope.passWord)
        //         $scope.login.passWord = $scope.passWord;
        //         console.log($scope.login.passWord);
        //         if ($scope.login.passWord.length > 5) {
        //             if (isSub) {
        //                 isSub = false;
        //                 resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
        //             }
        //         } else {
        //             $rootScope.errorText = '请正确填写以上信息';
        //             $rootScope.maskError = true;
        //         }
        //     }
        $scope.zuce = function(tegForm) {
            $scope.login.checkbox = true;
            if ($scope.login.recommPhone === undefined) {
                delete $scope.login.recommPhone;
            };
            if ($scope.login.toFrom === undefined) {
                delete $scope.login.toFrom;
            };
            if (tegForm.msg.$valid && tegForm.passWord.$valid && tegForm.picCode.$valid) {
                if ($scope.login.passWord.length > 5) {
                    if (isSub) {
                        isSub = false;
                        $localStorage.login = $scope.login;
                        resourceService.queryPost($scope, $filter('getUrl')('zuce'), $scope.login, { name: '注册', tegForm: tegForm });
                    }
                }
            } else {
                $rootScope.errorText = '请正确填写以上信息';
                $rootScope.maskError = true;
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
                    resourceService.queryPost($scope, $filter('getUrl')('getyzm'), {
                        mobilephone: $scope.login.mobilephone,
                        picCode: $scope.login.picCode,
                        isPic: true
                    }, { name: '获取验证码', tegForm: tegForm });
                } else {
                    $scope.login.picCode = '';
                    $scope.isImgCode = true;
                    changeIMG();
                    // $rootScope.errorText = '请输入正确的图形码';
                    // $rootScope.maskError = true;
                }
            }
        };
        /*下一步*/
        $scope.nextStep = function(tegForm) {
                if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                    resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                        mobilephone: $scope.login.mobilephone
                    }, { name: '注册验证手机号', tegForm: tegForm });
                } else {
                    $scope.isCommon = 1;
                    $rootScope.errorText = '请输入正确手机号码';
                    $rootScope.maskError = true;
                }
            }
            /*焦点进入与离开*/
            /* $scope.blurID = function (code, tegForm) {
                 if (!tegForm.mobilephone.$error.required && !tegForm.mobilephone.$error.minlength && !tegForm.mobilephone.$error.pattern) {
                     resourceService.queryPost($scope, $filter('getUrl')('getPhone'), {
                         mobilephone: $scope.login.mobilephone
                     }, { name: '注册验证手机号', tegForm: tegForm });
                 }else{
                     $scope.isCommon = 1;
                     $rootScope.errorText = '请输入正确手机号码';
                     $rootScope.maskError = true;
                 }
                 changeIMG();
             };*/

        /*弹框隐藏*/
        // $scope.hideDg = function() {
        //         $scope.showDg = false;
        //         $scope.login.picCode = '';
        //         // $scope.isSubMin = true;
        //     }
        /*验证码*/
        $scope.isCorrect = function() {
            $scope.showDg = false;
            $scope.isRegSucess = true;
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '获取验证码':
                    if (data.success == true) {
                        $scope.showDg = false;
                        $scope.isRegSucess = true;
                        $scope.isGetCode = true;
                        $filter('60秒倒计时')($scope, 60);
                        $scope.isImgCode = false;
                        $rootScope.errorText = '验证码发送成功';
                        $rootScope.title = '设置密码';
                        $rootScope.maskError = true;
                    } else if (data.errorCode == '1006') {
                        $scope.showDg = true;
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    } else if (data.errorCode == '1005') {
                        $scope.showDg = true;
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    } else if (data.errorCode == '1009') {
                        $scope.showDg = true;
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    } else if (data.errorCode == '1010') {
                        $scope.showDg = true;
                        $rootScope.errorText = data.errorMsg;
                        $rootScope.maskError = true;
                    } else if (data.errorCode == '8999') {
                        $scope.tishi = true;
                    } else if (data.errorCode == '8998') {
                        $scope.tishi1 = true;
                    } else {
                        $scope.showDg = true;
                        $filter('手机短信验证错误')(type.tegForm, data.errorCode);
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {

                        /*$scope.showDg = true;
                        if($scope.hasPhone){
                            $scope.isExit = true;
                        }else{
                            $scope.isExit = false;
                        }*/
                        if (data.map.exists) { //已有用户名
                            //$rootScope.errorText = '此手机已注册';
                            $scope.isExit = true;
                            //$rootScope.maskError = true;
                            $scope.hasPhone = true;

                        } else {
                            $scope.hasPhone = false;
                            $scope.isRegSucess = true;
                            $scope.isExit = false;
                            //$scope.showDg = true;
                        };
                    } else {
                        $filter('danhuangpai')(type.tegForm, data.errorCode);
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

                            $state.go('regSuccess');
                        }
                    } else {
                        $filter('serverZuceError')(type.tegForm, data.errorCode);
                        $scope.passWord = '';
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