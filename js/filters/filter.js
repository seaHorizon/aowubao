/* 
 * @Author: anchen
 * @Date:   2016-01-12 20:39:33
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-01-12 21:50:31
 */

'use strict';
define(['app'], function(app) {

    app
    /*当前登录状态*/
        .filter('isRegister', function($localStorage, $filter, $state) {

            return function(certification) {
                var obj = {};
                obj.register = false;
                obj.user = {};
                if ($localStorage.user != undefined) {
                    obj.register = true;
                    if (certification != undefined) { $localStorage.user.certification = certification; };
                    if ($localStorage.user.certification == undefined) {
                        $localStorage.user.userName = '亲爱的用户';
                    } else {
                        $localStorage.user.userName = $localStorage.user.realName;
                    }
                    obj.user = $localStorage.user;
                } else {
                    obj.register = false;
                    obj.user.userName = '亲爱的用户';
                }
                return obj;
            }
        })
        /*浏览记录*/
        .filter('isPath', function($localStorage, $filter, $state) {

            return function(url, param) {
                $localStorage.pathUrl.push(url);
            }
        })
        /*跳回上一页*/
        .filter('跳回上一页', function($localStorage, $state) {
            return function(number) {
                var num = 1;
                if (number != undefined) {
                    num = number;
                };
                if ($localStorage.pathUrl != undefined) {
                    if ($localStorage.pathUrl.length > 0) {
                        if ($localStorage.pathUrl[$localStorage.pathUrl.length - num] == undefined) {
                            delete $localStorage.userForm;
                            $state.go('main.home');
                        } else if ($localStorage.cp != undefined) {
                            // else{
                            if ($localStorage.active != undefined) {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { pid: $localStorage.cp.info.id, wap: true, active: $localStorage.active, type: $localStorage.cp.info.type });
                            } else {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { pid: $localStorage.cp.info.id, wap: true, type: $localStorage.cp.info.type });
                            }
                            // }
                        } else {
                            if ($localStorage.active != undefined) {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { wap: true, active: $localStorage.active });
                            } else {
                                $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num], { wap: true });
                            }
                            // $state.go($localStorage.pathUrl[$localStorage.pathUrl.length - num],{wap:true});
                        }
                        for (var i = 0; i < num; i++) {
                            $localStorage.pathUrl.pop();
                        }
                    } else {
                        delete $localStorage.userForm;
                        $state.go('main.home');
                    }
                } else {
                    delete $localStorage.userForm;
                    $state.go('main.home');
                    $localStorage.pathUrl = [];
                }
            }
        })
        /*清空缓存*/
        .filter('清空缓存', function($localStorage) {
            return function() {
                $localStorage.pathUrl = [];
                delete $localStorage.user;
            }
        })
        /*显示密码*/
        .filter('isShowPw', function() {
            return function(bool) {
                var classPw = {};
                if (bool) { classPw.type = 'text'; } else { classPw.type = 'passWord'; };
                return classPw;
            }
        })
        /*性别*/
        .filter('sex', function() {
            return function(type) {
                var x = {};
                if (type == 1) { x = '先生'; } else { x = '女士'; };
                return x;
            }
        })
        /*倒计时*/
        .filter('60秒倒计时', function($timeout) {
            return function(scope, timeNum) {
                // scope.nowTimer = '获取验证码';
                var timer;
                var isError = false;
                var nowTimer = timeNum;
                if (scope.isSubMin) {
                    setTimerOut();
                }

                function setTimerOut() {
                    scope.isSubMin = false;
                    timer = $timeout(function() {
                        if (nowTimer <= 0) {
                            if (isError) {
                                scope.nowTimer = '获取验证码';
                            } else {
                                scope.nowTimer = '重发';
                            }
                            scope.disabledPhoneBtn = false;
                            scope.isSubMin = true;
                            // if (scope.changeIMG != undefined) {
                            //     scope.changeIMG();
                            // };

                        } else {
                            scope.isSubMin = false;
                            nowTimer -= 1;
                            scope.nowTimer = nowTimer + '秒 ';
                            setTimerOut();
                        }
                    }, 1000);
                };
                scope.stop = function() {
                    nowTimer = 0;
                    isError = true;
                };
            }
        })

    /*错误信息----------------------------------------------*/

    .filter('serverZuceError', function($rootScope) { //手机
            return function(form, name) {
                var error = {
                    1001: "短信验证码为空",
                    1002: "短信验证码错误",
                    1003: "手机号错误",
                    1004: "图片验证码错误",
                    1005: "密码格式6-18位字母数字混合",
                    1006: "未勾选注册协议",
                    1007: "手机号已注册",
                    1008: "推荐人不存在",
                    1009: "尊敬的用户，由于您注册太过于频繁，请您3小时后再尝试！",
                    1010: "尊敬的用户，今日注册已达上线，请明日再试！"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        .filter('danhuangpai', function($rootScope) { //手机
            return function(form, name) {
                var error = {
                    1009: "尊敬的用户，由于您注册太过于频繁，请您3小时后再尝试！",
                    1010: "尊敬的用户，今日注册已达上线，请明日再试！"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        /*错误信息----------------------------------------------*/

    .filter('手机短信验证错误', function($rootScope) { //手机
            return function(form, name) {
                var error = {
                    1001: "短信验证码为空",
                    1002: "当天短信发送超过限制",
                    1003: "短信发送失败",
                    8888: "频繁操作",
                    8999: "抱歉！您今日注册短息验证码错误次数已达上限",
                    8998: "抱歉！您输入的错误次数过多，请30分钟后再试"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        /*登录密码验证*/
        .filter('denLuPassWordError', function() {
            return function(code, name) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误"
                };
                code.$valid = false;
                var text = '';
                if (code.$error["serverError"]) {
                    code.$valid = true;
                    delete code.$error.pattern;
                    delete code.$error.required;
                    if (error[name] != undefined) {
                        text = error[name];
                    } else {
                        code.$valid = false;
                    }
                }
                return text;
            }
        })
        /*登录用户名*/
        .filter('denLuUserNameError', function() {
            return function(code, name) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误"
                };
                code.$valid = false;
                var text = '';
                if (code.$error["required"]) {
                    if (code.$dirty) {
                        code.$valid = true;
                    };
                    delete code.$error.serverError;
                    text = '请输入您的手机号';
                } else
                if (code.$error["pattern"]) {
                    code.$valid = true;
                    delete code.$error.serverError;
                    text = '此用户名无效';
                } else
                if (code.$error["minlength"]) {
                    code.$valid = true;
                    delete code.$error.serverError;
                    text = '用户名长度错误';
                } else
                if (code.$error["serverError"]) {
                    code.$valid = true;
                    delete code.$error.pattern;
                    delete code.$error.minlength;
                    delete code.$error.required;
                    if (error[name] != undefined) {
                        text = error[name];
                    } else {
                        code.$valid = false;
                    }
                }
                return text;
            }
        })
        .filter('serverSmsError', function($rootScope) { //短信
            return function(form, name) {
                var error = {
                    1001: "图片验证码不正确",
                    1002: "每个手机号当天只能发送5条",
                    1003: "短信发送失败"
                };
                $rootScope.errorText = error[name];
                $rootScope.maskError = true;
                return error[name];
            }
        })
        .filter('errorMsgDialog', function($rootScope) {
            return function(name, dialog, replenish) {
                var error = {
                    noSelect: "请选需要操作的节点!",
                    noSelectRole: "请在角色列表中选中角色才能分配权限！",
                    delVerify: "确定要删除节点：",
                    loginErro: "登陆失败：",
                    netErro: "网络异常：请检查你的网络！",
                    addOK: "新增成功!",
                    delOK: "删除成功!",
                    updateOK: "修改成功!",
                    czOK: "操作成功!",
                    none: ""
                };
                var errormessage;
                if (replenish !== undefined) {
                    errormessage = error[name] + replenish;
                } else {
                    errormessage = error[name];
                }
                return dialog;
            }
        })
        /*服务器-errorCode*/
        .filter('服务器信息', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                var error = {
                    1001: "账号或密码为空",
                    1002: "验证码错误",
                    1003: "账号或密码错误",
                    9998: "请重新登录",
                    9999: "系统错误，请稍后刷新重试",
                    10001: "当日用户无分享记录",
                    "没有产品！": "没有产品！",
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })

    .filter('实名认证错误信息', function(ngDialog, $filter) {
            return function(code, scope, YorN, msg) {
                var error = {
                    1000: "城市编码不能为空",
                    1001: "真实姓名不能为空",
                    1002: "身份证号不能为空",
                    1003: "银行卡号不能为空",
                    1004: "手机号码不能为空",
                    1005: "短信验证码不能为空",
                    1006: "短信验证码错误",
                    1007: "银行卡类型不符，请更换银行卡后重试",
                    1008: "此卡未开通银联在线支付功能,实名认证失败，请联系发卡银行",
                    1009: "不支持此银行卡的验证",
                    1010: "免费验证次数已用完，请联系客服人员。",
                    1011: "认证失败",
                    1012: "该身份证号已认证",
                    1013: "渠道不能为空",
                    1014: "请核对个人信息",
                    1015: "请核对银行卡信息",
                    1016: "该银行卡bin不支持",
                    1017: "认证失败，系统异常请稍后再试",
                    9998: "您的账号已在其他地方登录，如非本人操作请及时更改登录密码!",
                    9999: "系统错误",
                    test: "网络错误",
                    "320P": "当前用户已经绑定其他银行卡，不能再绑定银行卡！",
                    "321P": "该银行卡已被其他用户绑定！",
                    AX1001: "抱歉！您的年龄未满18岁，不符合条件!",
                    AX1002: "抱歉！您输入的卡号与您选择的银行名称不匹配！",
                    AX1003: "该卡号没有可匹配的银行卡",
                    AX1004: "机构码为空",
                    AX1005: "账户存在资金，不能换绑",
                    AX1006: "提交信息与已绑银行卡信息相同",
                    AX1007: "提交信息与已绑银行卡信息相同"

                };
                scope.msg = {};
                if (msg) {
                    scope.msg.text = msg;
                } else {
                    scope.msg.text = error[code];
                }
                if (YorN == 'y') {
                    scope.msg.btnYes = '确定';
                    scope.msg.title = '提示：';
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('投资错误信息', function(ngDialog, $filter) {
            return function(code, scope, YorN, errorMsg) {
                var error = {
                    1001: "交易密码错误",
                    1002: "产品已募集完",
                    1003: "项目可投资金额不足",
                    1004: "小于起投金额",
                    1005: "非递增金额整数倍",
                    1006: "投资金额大于项目单笔投资限额",
                    1007: "账户可用余额不足",
                    1008: "已投资过产品，不能投资新手产品",
                    1009: "用户不存在",
                    1010: "优惠券不可用",
                    1011: "投资失败,请稍后再试",
                    2001: "交易密码已被锁定",
                    9998: "您的账号已在其他地方登录，如非本人操作请及时更改登录密码!",
                    9999: "系统错误",
                    noInp: "请输入投资金额",
                    noPwd: "请输入交易密码",
                    ok: "投资成功",
                    test: "网络错误"
                };
                scope.msg = {};
                if (error[code]) {
                    scope.msg.text = error[code];
                } else {
                    scope.msg.text = errorMsg;
                }
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    if (error[code]) {
                        scope.msg.text = error[code];
                    } else {
                        scope.msg.text = errorMsg;
                    }
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('实名短信错误信息', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                var error = {
                    1001: "手机号码有误",
                    1002: "当天短信发送超过限制",
                    1003: "短信发送失败",
                    1004: "银行卡尾号不能为空",
                    8888: "频繁操作",
                    ok: '短信发送成功',
                    test: "网络错误"
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('意见反馈信息', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                var error = {
                    ok: '感谢您对我们的支持'
                };
                scope.msg = {};
                scope.msg.text = error[code];
                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = null;
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '提示：';
                    scope.msg.text = error[code];
                    $filter('adviseDialog')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        /*意见反馈提示跳转*/
        .filter('adviseDialog', function(ngDialog, $state) {
            return function(templateurl, scope) {
                ngDialog.open({
                    template: templateurl,
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    preCloseCallback: function() {
                        $state.go('kefu', { wap: true });
                    }
                });
                // return  dialog;
            };
        })
        /*根据用户状态提示跳转页面方向*/
        .filter('提示跳转', function(ngDialog) {
            return function(templateurl, scope) {
                ngDialog.open({
                    template: templateurl,
                    scope: scope,
                    closeByDocument: false,
                    plain: false
                });
                // return  dialog;
            };
        })
        /***********************活动*******************************************/
        .filter('isReceive', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                // var error = {
                //     1001: "账号或密码为空",
                //     1002: "验证码错误",
                //     1003: "账号或密码错误",
                //     9998: "请重新登录",
                //     9999: "系统错误，请稍后刷新重试",
                //     10001: "当日用户无分享记录",
                //     "没有产品！": "没有产品！",
                //     test: "网络错误"
                // };
                // scope.msg = {};
                // scope.msg.text = error[code];

                // if (YorN == 'y') {
                //     scope.msg = {};
                //     scope.msg.btnYes = '确定';
                //     // scope.msg.btnNo='忽略';
                //     scope.msg.title = '通知：';
                //     scope.msg.text = error[code];
                //     $filter('提示跳转')('template/error/dlog.html', scope);
                // } else {
                //     return error[code];
                // }
            };
        })
        .filter('领红包活动', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                var error = {
                    9995: "领取暖冬感恩大礼包活动未开始或已过期",
                    9996: "暖冬感恩大礼包已经领取过",
                    9997: "暖冬感恩大礼包已领完 ",
                    9998: " uid不能为空 ",
                    9999: "系统错误，请稍后刷新重试",
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('双旦兑换', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                var error = {
                    9999: "表示系统错误",
                    9998: "未登录",
                    9997: "请选择要兑换的礼品",
                    9996: "收件人不能为空",
                    9995: "收件人电话为空或不合法",
                    9994: "收件人地址不能为空",
                    9993: "兑换的礼品已兑换完",
                    9992: "活动Code为空"
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('双旦礼品列表', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                var error = {
                    9990: "活动code未空",
                    9999: "系统错误，请稍后刷新重试",
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        .filter('用户收件地址', function(ngDialog, $filter) {
            return function(code, scope, YorN) {
                var error = {
                    9980: " 未登录",
                    9999: "系统错误，请稍后刷新重试",
                };
                scope.msg = {};
                scope.msg.text = error[code];

                if (YorN == 'y') {
                    scope.msg = {};
                    scope.msg.btnYes = '确定';
                    // scope.msg.btnNo='忽略';
                    scope.msg.title = '通知：';
                    scope.msg.text = error[code];
                    $filter('提示跳转')('template/error/dlog.html', scope);
                } else {
                    return error[code];
                }
            };
        })
        // .filter('立即参与', function(ngDialog, $filter) {
        //     return function(code, scope, YorN) {
        //         var error = {
        //             9997: " 请完成首投后再参加活动 ",
        //         };
        //         scope.msg = {};
        //         scope.msg.text = error[code];

    //         if (YorN == 'y') {
    //             scope.msg = {};
    //             scope.msg.btnYes = '确定';
    //             // scope.msg.btnNo='忽略';
    //             scope.msg.title = '通知：';
    //             scope.msg.text = error[code];
    //             $filter('提示跳转')('template/error/dlog.html', scope);
    //         } else {
    //             return error[code];
    //         }
    //     };
    // })
    /***********************换算*******************************************/
    .filter('isNumber2', function($rootScope) {
            return function(num, type, flag) {
                if (num == undefined) {
                    if (flag == undefined) {
                        return 0;
                    }
                } else {
                    if (isNaN(num)) {
                        if (flag == undefined) {
                            return 0;
                        }
                    } else {
                        var num = new Number(num);
                        var num = num.toFixed(4);
                        if (type != undefined) {
                            num = num.substring(0, num.lastIndexOf('.') + 0) // 123456.78
                        } else {
                            num = num.substring(0, num.lastIndexOf('.') + 3) // 123456.78
                        }
                    }

                    $rootScope.shouyi = num;
                    return num;
                }
            };
        })
        .filter('isNumber', function($rootScope) {
            return function(num, type, flag) {
                if (num == undefined) {
                    if (flag == undefined) {
                        return 0;
                    }
                } else {
                    if (isNaN(num)) {
                        if (flag == undefined) {
                            return 0;
                        }
                    } else {
                        var num = new Number(num);
                        var num = num.toFixed(4);
                        if (type != undefined) {
                            num = num.substring(0, num.lastIndexOf('.') + 0) // 123456.78
                        } else {
                            num = num.substring(0, num.lastIndexOf('.') + 3) // 123456.78
                        }
                    }
                    return num;
                }
            };
        })
        // 向下取整
        .filter('numberFloor', function($rootScope) {
            return function(num) {
                num = Math.floor(num);
                return num;
            };
        })
        /***********************换算*******************************************/

    .filter('setProgress', function() {
        return function(num) {
            if (num == undefined) {
                return 0;
            } else {
                if (isNaN(num)) {
                    return 0;
                } else {
                    if (num > 0 && num <= 1) {
                        num = 1;
                    } else if (num >= 99 && num < 100) {
                        num = 99;
                    } else {
                        num = parseInt(num);
                    }
                }
                return num;
            }
        }
    })

    .filter('提现错误信息', function(ngDialog, $filter) {
        return function(msg, scope) {
            var error = {
                'required': "请输入提现金额",
                'pattern': "请输入正确的数值",
                'morethan': "提现金额至少为1元",
                'morethan3': "提现金额至少为3元",
                'withdrawlimit': "提现金额最多为" + scope.cash.funds + "元",
                'maxlimit': "提现金额最多为500,000元"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: false,
                plain: true
            });
            setTimeout(function() {
                ngDialog.closeAll();
            }, 1500);
        };
    })

    .filter('提现申请错误信息', function(ngDialog, $filter) {
        return function(msg) {
            var error = {
                9999: "系统错误",
                1001: "提现金额有误",
                1002: "交易密码不能为空",
                1003: "交易密码错误",
                1004: "余额不足",
                1005: "交易失败，请再次申请",
                1006: "处理中",
                1007: "该笔需要收取手续费",
                1008: "该笔不需要收取手续费",
                1009: "渠道不能为空",
                2002: "投资任意产品后，即可将收益提现哦！"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '（' + msg + '）' + '</p>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
        };
    })

    .filter('充值错误信息', function(ngDialog, $filter) {
        return function(msg, scope) {
            var error = {
                'required': "请输入充值金额",
                'pattern': "请输入正确的数值",
                'more3': "充值金额至少为3元",
                'rechargelimit': "充值金额最多为" + scope.singleQuota + "元"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: false,
                plain: true
            });
            setTimeout(function() {
                ngDialog.closeAll();
            }, 1500);
        };
    })

    .filter('修改交易密码错误信息', function(ngDialog, $filter) {
        return function(msg, scope) {
            var error = {
                'codeRequired': "请输入短信验证码",
                'tpwdRequired': "请输入交易密码",
                'tpwdPattern': "交易密码格式错误"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: false,
                plain: true
            });
            setTimeout(function() {
                ngDialog.closeAll();
            }, 1500);
        };
    })

    .filter('修改登录密码错误信息', function(ngDialog, $filter) {
        return function(msg, scope) {
            var error = {
                'codeRequired': "请输入短信验证码",
                'pwdRequired': "请输入登录密码",
                'pwdPattern': "登录密码格式错误"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: false,
                plain: true
            });
            setTimeout(function() {
                ngDialog.closeAll();
            }, 1500);
        };
    })

    .filter('登录交易密码短信验证码错误信息', function(ngDialog, $filter) {
        return function(msg) {
            var error = {
                9999: "系统错误",
                8888: "频繁操作",
                1001: "手机号码有误",
                1002: "当天短信发送超过限制",
                1003: "短信发送失败",
                8999: "抱歉！您今日注册短息验证码错误次数已达上限",
                8998: "抱歉！您输入的错误次数过多，请30分钟后再试"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: false,
                plain: true
            });
        };
    })

    .filter('重置交易密码错误信息', function(ngDialog, $filter) {
        return function(msg, scope) {
            var error = {
                9999: "系统错误",
                1001: "验证码错误",
                1002: "密码为空",
                1003: "交易密码不合法"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
            scope.isSubmit = false;
        };
    })

    .filter('重置登录密码错误信息', function(ngDialog, $filter) {
        return function(msg, scope) {
            var error = {
                9999: "系统错误",
                1001: "验证码错误",
                1002: "密码为空",
                1003: "登录密码不合法",
                8999: "抱歉！您今日注册短息验证码错误次数已达上限",
                8998: "抱歉！您输入的错误次数过多，请30分钟后再试"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
            scope.isSubmit = false;
        };
    })

    .filter('重置密码成功', function(ngDialog, $filter, $state) {
            return function(msg, scope) {
                ngDialog.open({
                    template: '<p class="success-msg">' + msg + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function() {
                    ngDialog.closeAll();
                    $state.go('dl');
                }, 1500);
            };
        })
        .filter('重置交易密码成功', function(ngDialog, $filter, $state) {
            return function(msg, scope) {
                ngDialog.open({
                    template: '<p class="success-msg">' + msg + '</p>',
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                scope.isSubmit = false;
                setTimeout(function() {
                    ngDialog.closeAll();
                    $filter('跳回上一页')();
                }, 1500);
            };
        })

    .filter('创建订单错误信息', function(ngDialog, $filter) {
        return function(msg) {
            var error = {
                9999: "系统错误",
                1001: "金额有误",
                1002: "系统错误，请稍后重试",
                1003: "超过限额，请修改金额后重试"
            };
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '</p>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
        };
    })

    .filter('投资交易密码错误信息', function(ngDialog, $state, $localStorage) {
        return function(scope) {
            scope.closeDialog = function() {
                ngDialog.closeAll();
            };
            ngDialog.open({
                template: '<div class="recharge-dialog forget"><div class="title">提示</div><p>连续输错三次，您的交易密码已被锁定！请一小时后再试，或点击忘记密码</p><div class="btns"><span ng-click="closeDialog()">稍后再试</span><span class="right" ng-click="closeDialog()" ui-sref="resetTradePwd({firstset:false})">忘记密码</span></div></div>',
                className: 'recharge-dialog-wrap ngdialog-theme-default',
                scope: scope,
                showClose: false,
                closeByDocument: false,
                plain: true
            });
        };
    })

    .filter('充值验证码error信息', function(ngDialog, $filter) {
            return function(msg) {
                var error = {
                    9999: "系统错误",
                    8888: "频繁操作",
                    1002: "短信发送失败"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })
        .filter('登陆错误信息', function(ngDialog, $filter) {
            return function(msg) {
                var error = {
                    1001: "账号或密码为空",
                    1003: "账号或密码错误",
                    "AX1002": "抱歉！你未满18岁，账号已被注销"
                };
                ngDialog.open({
                    template: '<p class="error-msg">' + error[msg] + '</p>',
                    showClose: false,
                    closeByDocument: true,
                    plain: true
                });
            };
        })

    .filter('认证充值错误信息', function(ngDialog, $filter, $state) {
        return function(msg, scope) {

            var error = {
                "0000": "成功",
                "0001": "失败",
                "0020": "手机号信息非法",
                "0021": "订单号重复",
                "0030": "报文内容信息非法",
                "100000": "交易请求频率过高,请稍后再试",
                "100004": "报文格式错误",
                "100005": "交易要素缺失或者无效",
                "100010": "无效金额",
                "100011": "账户名称不符",
                "100012": "证件错误",
                "100013": "借记账户错误",
                "100014": "协议号不存在",
                "100015": "认证失败-持卡人身份信息、卡信息或手机信息错误",
                "100016": "发卡行交易权限受限，详情请咨询您的发卡行[1000061]",
                "100017": "余额不足",
                "100018": "余额不足交易次数超过单日限制，请确认账户余额充足后次日再发起",
                "100019": "当月余额不足交易次数已超上限",
                "100020": "交易不予承兑",
                "100021": "卡类型必须为借记卡",
                "100029": "交易金额超限",
                "10002A": "流水号不得为空",
                "10002B": "版本号错误",
                "100030": "超出交易次数限制",
                "100039": "不支持该业务或无交易权限",
                "100040": "未开通银联在线支付服务或认证支付功能",
                "100041": "无效商户或商户状态不正常",
                "100042": "手机号错误",
                "100043": "输入的密码、有效期或CVN2有误，交易失败",
                "100044": "密码输入次数超限",
                "100045": "未开通网银或手机银行",
                "100046": "交易不予承兑",
                "100048": "贷记卡卡号错误",
                "100049": "帐号户名或证件不符",
                "100050": "当月还款次数超限",
                "10013": "该卡已过期",
                "1002": "手机号码格式不对",
                "10029": "金额超限",
                "1003": "无效商户",
                "1004": "无签约信息，不能发起扣款",
                "1005": "暂不支持的银行卡",
                "1007": "户名不得为空",
                "1008": "短信发送过于频繁，请稍后再试",
                "1010": "错误次数超限，请核对卡信息稍后再试",
                "1011": "错误次数超限",
                "1014": "无效卡号（无此号）",
                "1029": "交易金额超限",
                "1030": "格式错误",
                "1031": "该银行卡号不支持快捷支付签约",
                "1033": "过期的卡 | 签约流水号重复",
                "1034": "签约流水号不存在",
                "1040": "请求的功能尚不支持",
                "1042": "转入卡号或户名错误",
                "1051": "余额不足",
                "1055": "密码错误",
                "1059": "风控系统校验失败",
                "1061": "超出取款/转账金额限制",
                "1063": "侵犯安全 | 侵犯安全",
                "1075": "密码错误次数超限",
                "1096": "系统异常、失效",
                "10CE": "身份证号或姓名有误",
                "10EC": "交易金额低于业务单笔最小金额",
                "10ET": "余额不足/过期卡/pos明细序号重复",
                "10F6": "不允许使用信用卡",
                "10FC": "借记卡单笔交易金额超限",
                "10FD": "同卡金额超限",
                "10FE": "贷记卡单笔交易金额超限",
                "10L3": "不支持该手机号",
                "10M0": "单张贷记卡当月累计交易金额超限 | 未知风控错误",
                "10M1": "超出借记卡同商户单日交易累计金额限额",
                "10M2": "超出借记卡同商户当月累计金额限制",
                "10SM": "超过金额限制",
                "10XC": "户名或证件号码不符",
                "11V3": "订单失效",
                "11T3": "检索商户基本信息表失败",
                "11L3": "该商户不支持此接口",
                "11M3": "该商户不是快捷支付网关商户",
                "11D3": "无查询结果",
                "11E3": "支付失败",
                "12D3": "微信下单失败",
                "12S5": "未知风控错误",
                "144K": "姓名信息不一致",
                "145K": "身份证信息不一致",
                "16Y4": "只支持4要素验证",
                "17Y4": "只支持5要素验证",
                "200001": "目标方超时",
                "200002": "目标方连接失败",
                "200012": "报文格式错误",
                "200013": "持卡人身份信息或手机号与银行预留不一致，或未开通银联在线功能",
                "200014": "银行卡未开通银联在线功能或为不支持的卡",
                "200015": "卡状态不正常",
                "200016": "无效卡",
                "200017": "银行卡账户余额不足",
                "200023": "银联风险受限",
                "200029": "交易金额超限",
                "200098": "交易超时",
                "2001": "无此账户 | 与发卡行通信超时",
                "24PP": "通道超时",
                "3201": "清分记账失败",
                "322P": "无效的协议号！",
                "32PP": "该卡已经绑定协议，不能重复绑定！",
                "320P": "当前用户已绑定其他协议卡，不能使用非协议卡操作！",
                "321P": "同一商户下，不能使用其他用户绑定的协议卡操作！",
                "35CA": "姓名格式错",
                "35CB": "卡号格式错",
                "35CC": "身份证号格式错",
                "35CD": "手机号格式错",
                "5077": "无此订单",
                "5098": "通讯异常",
                "5138": "系统异常",
                "5178": "解支付密码失败",
                "5185": "订单已支付",
                "5188": "订单已失效",
                "5190": "超单笔限额",
                "51B3": "订单支付中，请勿重复支付",
                "5353": "接收FAS报文出现异常",
                "5505": "不支持的银行卡",
                "5594": "超单月限额",
                "55AC": "请从手机端进行支付",
                "5878": "验证要素不足，不支持验证",
                "8010": "获取验证码失败",
                "80AX": "身份证号码长度应该为15位或18位",
                "8110": "验证码验证次数超限",
                "8143": "验证码失效或错误",
                "8210": "验证码发送次数超限",
                "9999": "证件号必须为15或者18位",
                "9788": "一日内验证失败次数已达5次，不允许再进行验证",
                "999992": "参数信息配置有误 | 交易渠道未设置",
                "999993": "重复交易 | 重复交易",
                "999997": "验签失败",
                "999998": "交易错误",
                "999999": "交易状态不明，请查询发卡行",
                "P000": "支付处理中",
                "ax9999": "服务器出问题啦!请联系客服处理",
                "ax6666": "验证码未输入或格式不对!",
                "ax6661": "认证充值超时"

            };

            // var error = {
            //     9999: "系统错误",
            //     1001: "充值金额有误",
            //     1002: "验证码不能为空",
            //     1003: "验证码错误",
            //     1004: "处理中",
            //     1005: "系统错误，请稍后重试",
            //     1006: "超出单卡号累计交易次数限制",
            //     1007: "超出银行授信额度",
            //     1008: "超过用户在银行设置的限额",
            //     1009: "持卡人身份证验证失败",
            //     1010: "对不起，您累计交易支付金额超出单笔限额",
            //     1011: "对不起，您累计交易支付金额超出当日限额",
            //     1012: "对不起，您累计交易支付金额超出当月限额",
            //     1013: "非法用户号",
            //     1014: "该卡暂不支持支付，请更换其他银行卡重试",
            //     1015: "该卡暂不支持支付，请稍后再试",
            //     1016: "交易超时",
            //     1017: "交易金额不能大于最大限额",
            //     1018: "交易金额不能低于最小限额",
            //     1019: "交易金额超过渠道当月限额",
            //     1020: "交易金额为空",
            //     1021: "交易金额有误错误",
            //     1022: "交易失败，风险受限",
            //     1023: "交易失败，详情请咨询您的发卡行",
            //     1024: "金额格式有误",
            //     1025: "仅支持个人银行卡支付",
            //     1026: "您的银行卡不支持该业务，请与发卡行联系",
            //     1027: "请核对个人身份证信息",
            //     1028: "请核对您的订单号",
            //     1029: "请核对您的个人信息",
            //     1030: "请核对您的银行卡信息",
            //     1031: "请核对您的银行信息",
            //     1032: "请核对您的银行预留手机号",
            //     1033: "未开通无卡支付或交易超过限额，详情请咨询您的发卡行",
            //     1034: "信息错误，请核对",
            //     1035: "银行户名不能为空",
            //     1036: "银行卡未开通银联在线支付，请向银行咨询",
            //     1037: "银行名称无效",
            //     1038: "银行系统繁忙，交易失败，请稍后再提交",
            //     1039: "银行账号不能为空",
            //     1040: "余额不足",
            //     1041: "证件号错误，请核实",
            //     1042: "证件号码不能为空",
            //     1043: "证件类型与卡号不符",
            //     1044: "银行账户余额不足"
            // };
            // ngDialog.closeAll();
            ngDialog.open({
                template: '<p class="error-msg">' + error[msg] + '（' + msg + '）' + '</p>',
                showClose: false,
                closeByDocument: true,
                plain: true
            });
            // setTimeout(function () {
            //     ngDialog.closeAll();
            //     $state.go('recharge', null, {
            //         reload: true
            //     });
            // }, 1500);
        };
    })

    .filter('充值成功', function(ngDialog, $filter, $state, $localStorage) {
            return function(scope, type) {
                ngDialog.closeAll();
                var msg = '';
                if (type == 'ing') {
                    msg = '<p class="success-msg">充值处理中，请稍后查询处理结果</p>';
                } else {
                    msg = '<h3 class="success-msg">充值成功</h3><main>您已成功充值' + $filter('currency')(scope.successAmount, '') + '元<br>预计将在10分钟内到账，请耐心等待。</main>';
                }
                ngDialog.open({
                    template: msg,
                    showClose: false,
                    closeByDocument: false,
                    plain: true
                });
                setTimeout(function() {
                    ngDialog.closeAll();
                    if (scope.changcheng2 == true) {
                        $state.go('changcheng2');
                    } else if ($localStorage.cp != undefined) {
                        if ($localStorage.cp.prize != undefined) {
                            $state.go('tjsinvestment', { wap: true, pid: $localStorage.cp.info.id });
                        } else {
                            $state.go('investment');
                        }
                    } else {
                        $state.go('main.myaccountHome');
                    }

                }, 1500);
            };
        })
        .filter('isCPtradeType', function() {
            return function(tradeType) {
                var t = {
                    1: "充值",
                    2: "提现",
                    3: "投资",
                    4: "活动",
                    5: "提现手续费",
                    6: "回款",
                    7: "体验金"
                };
                return t[tradeType];
            };
        })
        .filter('isBankType', function() {
            return function(tradeType) {
                var t = {
                    1: "中国工商银行",
                    2: "中国农业银行",
                    3: "中国建设银行",
                    4: "中国银行",
                    5: "中国邮政储蓄银行",
                    6: "招商银行",
                    7: "兴业银行",
                    8: "中国光大银行",
                    9: "广发银行",
                    10: "平安银行",
                    11: "中国民生银行",
                    12: "浦发银行",
                    13: "中信银行",
                    14: "上海银行",
                    15: "北京银行",
                    16: "交通银行",
                    17: "兰州银行",
                    18: "华夏银行"
                };
                return t[tradeType];
            };
        })
        .filter('isCPstatus', function() {
            return function(status) {
                var t = {
                    1: "处理中",
                    2: "失败",
                    3: "成功",
                    4: "募集中",
                    5: "待续投"
                };
                return t[status];
            };
        })
        .filter('time-out', function($rootScope, $interval) {
            return function(status) {
                $scope.timer = interval(function() {}, 1000);
            };
        })
        // 单选
        .filter('isBool', function($rootScope, $interval) {
            return function(bool) {
                // console.log(bool);
                if (bool) {
                    bool = false;
                } else {
                    bool = true;
                }
                return bool;
            };
        })
        /*×××××××××××××××××××××××××× over ×××××××××××××××××××××××××××××××*/

    //  倒计时弹窗
    .filter('倒计时弹窗', function(ngDialog) {
        return function(scope) {
            ngDialog.open({
                template: '../../template/dialog/countdown-dialog.html',
                className: 'special-dialog-wrap ngdialog-theme-default',
                scope: scope,
                closeByDocument: false,
                plain: false,
                showClose: false
            });
        };
    })

    //  幸运码弹窗
    .filter('幸运码弹窗', function(ngDialog, $timeout) {
            return function(scope) {
                ngDialog.open({
                    template: '../../template/dialog/special-code-dialog.html',
                    className: 'special-dialog-wrap ngdialog-theme-default',
                    scope: scope,
                    closeByDocument: false,
                    plain: false,
                    showClose: false
                });
                $timeout(function() {
                    $('.goToApp').attr('href', 'aowb://page=9?pid=' + scope.product.id + '&ptype=' + scope.product.type + '&atid=1');
                })
            };
        })
        .filter('prizeStatus', function() {
            return function(code) {
                var map = {
                    0: '未开奖',
                    1: '未中奖',
                    2: '已中奖'
                };
                if (code >= 0 && map[code]) { return map[code] };
                return '无数据';
            }
        })
        //手机号码隐藏
        .filter('phonesub', function() {
            return function(str, str2) {
                return str ? str.substring(0, 3) + str2 + str.substring(7) : '';
            }
        })
        .filter('percent', function() {
            return function(str) {
                var r = /^[1-9]?[0-9]*\.[1-9]*$/;
                var t = r.test(str);
                if (str < 1) {
                    return str * 10 + "‰";
                } else {
                    if (!t) {
                        str = parseInt(str);
                    }
                    return str + "%";
                }
            }
        })
        .filter('currency2', function() {
            return function(str) {
                if (str) {
                    str += "";
                    if (str.indexOf('.') != -1 && str.length - 1 - str.indexOf('.') > 2) {
                        str = str.toFixed(2);
                    } else if (str.indexOf('.') != -1 && str.length - 1 - str.indexOf('.') < 2) {
                        str += "0";
                    } else if (str.indexOf('.') == -1) {
                        str += ".00";
                    }
                    return str;
                } else {
                    return "-";
                }
            }
        })
        .filter('stringsub', function() {
            return function(str, num) {
                if (str) {
                    var len = 0,
                        str2 = "";
                    for (var i = 0; i < str.length; i++) {
                        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                            len += 2;
                        } else {
                            len++;
                        }
                        if (len > num) {
                            str2 = str.substring(0, i - 1) + "...";
                            break;
                        } else {
                            str2 = str;
                        }
                    }
                    return str2;
                } else {
                    return "";
                }
            }
        })
        .filter('asHtml', function($sce) {
            return function(data) {
                return $sce.trustAsHtml(data);
            }
        })
        .filter('getdate', function() {
            return function(date, i) {
                return new Date(new Date(date).getTime() + (86400000 * i));
            }
        })
});