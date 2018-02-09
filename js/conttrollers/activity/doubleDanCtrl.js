define(['jweixin', 'js/module.js'], function(wx, controllers) {
    controllers.controller('doubleDanCtrl', function($scope, $rootScope, $filter, $state, $location, resourceService, $interval, isWeixin, $http, $localStorage, $stateParams, signWeChatService) {
        // signWeChatService();
        $rootScope.title = '喜迎双旦 享收益拿好礼';
        $scope.isJoin = false;
        $scope.isEntry = false;
        $scope.record = true;
        $scope.usedImformation = false;
        $scope.activityIng = true;
        $('body').scrollTop(0);
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        if ($stateParams.wap) {
            $scope.isLogin = $filter('isRegister')().register;
            $scope.wap = $stateParams.wap;
            if ($scope.isLogin) {
                $scope.isEntry = true;
                $scope.phoneNumber = $filter('isRegister')().user.member.mobilephone;
                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;
                $scope.shareUrl = 'https://m.aowubao.com/doubleDanActivity?wap=true&recommCode=' + $scope.user.member.recommCodes;
                // 发送请求礼品列表接口

                resourceService.queryPost($scope, $filter('getUrl')('我的活动统计'), { uid: $scope.uid }, { name: '我的活动统计' });
                resourceService.queryPost($scope, $filter('getUrl')('兑奖记录'), {}, { name: '用户兑奖记录' });
                resourceService.queryPost($scope, $filter('getUrl')('收件地址'), { uid: $scope.uid, }, { name: '收件地址' });
            } else {
                $scope.isEntry = false;
            }
            //对接app
        } else if ($stateParams.uid) {
            // app已登录
            $scope.uid = $stateParams.uid;
            $scope.version = $stateParams.version;
            $scope.token = $stateParams.token;
            $scope.channel = $stateParams.channel;
            $scope.isEntry = true;
            resourceService.queryPost($scope, $filter('getUrl')('我的活动统计'), {
                uid: $scope.uid,
                version: $scope.version,
                token: $scope.token,
                channel: $scope.channel
            }, { name: '我的活动统计' });
            resourceService.queryPost($scope, $filter('getUrl')('收件地址'), {
                uid: $scope.uid,
                version: $scope.version,
                token: $scope.token,
                channel: $scope.channel
            }, { name: '收件地址' });
        } else {
            $scope.isEntry = false;
        }

        //用户兑奖记录
        resourceService.queryPost($scope, $filter('getUrl')('兑奖记录'), {}, { name: '用户兑奖记录' });
        //礼品列表
        $http({
            method: 'GET',
            url: '/member/getActivityGift.do',
            params: {
                activityCode: '1218A'
            }
        }).then(function successCallback(response) {
            for (var i = 0; i < response.data.map.gifts.length; i++) {
                if (response.data.map.gifts[i].surplusQuantity <= 0) {
                    $scope.gloomy = true;
                }
            }
            $scope.activityIng = response.data.map.activityIng;
        }, function errorCallback(response) {
            // 请求失败执行代码
        });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
                switch (type.name) {
                    case '我的活动统计':
                        if (data.success) {
                            $scope.totalAmount = data.map.total_amount;
                            $scope.usedAmount = data.map.used_amount;
                            $scope.surplusAmount = $scope.totalAmount - $scope.usedAmount;
                        }
                        break;
                    case '用户兑奖记录':
                        if (data.success) {
                            $scope.crashList = data.map.list;
                            $scope.activityCode = $scope.crashList[0].activityCode;
                            var $list = $('.wraps');
                            if ($scope.crashList.length > 6) {
                                $interval.cancel($scope.timer); //清除定时器
                                $scope.timer = $interval(function() {
                                    $list.animate({ 'margin-top': '-2.2rem' }, 500, function() {
                                        $list.find('.contents2').eq(0).appendTo($list);
                                        $list.css('margin-top', 0);
                                    });
                                }, 3000);
                            }
                        }
                        break;
                    case '我的兑奖记录':
                        if (data.success) {
                            $scope.crashList = data.map.list;
                            if (!$scope.crashList) {
                                $scope.invest = true;
                            }
                        }
                        break;
                    case '礼品兑换':
                        if (data.success) {
                            $scope.usedImformation = false;
                            $scope.isSuccess = true;
                            if ($stateParams.wap) {
                                resourceService.queryPost($scope, $filter('getUrl')('收件地址'), { uid: $scope.uid, }, { name: '收件地址' });
                            }
                            if ($stateParams.uid) {
                                resourceService.queryPost($scope, $filter('getUrl')('收件地址'), {
                                    uid: $scope.uid,
                                    version: $scope.version,
                                    token: $scope.token,
                                    channel: $scope.channel
                                }, { name: '收件地址' });
                            }
                        }
                        break;
                    case '收件地址':
                        if (data.success) {
                            $scope.addrId = data.map.addressInfo[0].id;
                        }
                        break;
                }
            })
            //立即登录
        $scope.lijidenglu = function() {

                if ($stateParams.wap) {
                    $state.go('dl', { returnurl: 'doubleDanActivity' });
                } else {
                    window.location.href = "aowb://page=4?";
                }
            }
            //立即兑换
        $scope.duihuan = function(num) {
                if ($stateParams.wap) {
                    if ($scope.isLogin) {
                        switch (num) {
                            case 0:
                                if ($scope.surplusAmount >= 5000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[0].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[0].investAmount;
                                    $scope.giftName = response.data.map.gifts[0].giftName;
                                    $scope.giftType = response.data.map.gifts[0].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 1:
                                if ($scope.surplusAmount >= 20000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[1].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[1].investAmount;
                                    $scope.giftName = response.data.map.gifts[1].giftName;
                                    $scope.giftType = response.data.map.gifts[1].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 2:
                                if ($scope.surplusAmount >= 80000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;

                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[2].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[2].investAmount;
                                    $scope.giftName = response.data.map.gifts[2].giftName;
                                    $scope.giftType = response.data.map.gifts[2].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 3:
                                if ($scope.surplusAmount >= 30000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[3].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[3].investAmount;
                                    $scope.giftName = response.data.map.gifts[3].giftName;
                                    $scope.giftType = response.data.map.gifts[3].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 4:
                                if ($scope.surplusAmount >= 50000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;

                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[4].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[4].investAmount;
                                    $scope.giftName = response.data.map.gifts[4].giftName;
                                    $scope.giftType = response.data.map.gifts[4].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 5:
                                if ($scope.surplusAmount >= 10000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息

                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[5].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[5].investAmount;
                                    $scope.giftName = response.data.map.gifts[5].giftName;
                                    $scope.giftType = response.data.map.gifts[5].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 6:
                                if ($scope.surplusAmount >= 1000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[6].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[6].investAmount;
                                    $scope.giftName = response.data.map.gifts[6].giftName;
                                    $scope.giftType = response.data.map.gifts[6].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                        }
                    } else {
                        $scope.isJoin = true;
                    }
                } else {
                    if ($stateParams.uid) {
                        switch (num) {
                            case 0:
                                if ($scope.surplusAmount >= 5000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[0].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[0].investAmount;
                                    $scope.giftName = response.data.map.gifts[0].giftName;
                                    $scope.giftType = response.data.map.gifts[0].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });;
                                break;
                            case 1:
                                if ($scope.surplusAmount >= 20000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[1].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[1].investAmount;
                                    $scope.giftName = response.data.map.gifts[1].giftName;
                                    $scope.giftType = response.data.map.gifts[1].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 2:
                                if ($scope.surplusAmount >= 80000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[2].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[2].investAmount;
                                    $scope.giftName = response.data.map.gifts[2].giftName;
                                    $scope.giftType = response.data.map.gifts[2].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 3:
                                if ($scope.surplusAmount >= 30000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[3].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[3].investAmount;
                                    $scope.giftName = response.data.map.gifts[3].giftName;
                                    $scope.giftType = response.data.map.gifts[3].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 4:
                                if ($scope.surplusAmount >= 50000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;

                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[4].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[4].investAmount;
                                    $scope.giftName = response.data.map.gifts[4].giftName;
                                    $scope.giftType = response.data.map.gifts[4].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 5:
                                if ($scope.surplusAmount >= 10000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息
                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[5].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[5].investAmount;
                                    $scope.giftName = response.data.map.gifts[5].giftName;
                                    $scope.giftType = response.data.map.gifts[5].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                            case 6:

                                if ($scope.surplusAmount >= 1000) {
                                    $scope.isConfirm = true;
                                    $scope.gid = num + 1;
                                } else {
                                    $scope.isAchieve = true;
                                }
                                $http({
                                    method: 'GET',
                                    url: '/member/getActivityGift.do',
                                    params: {
                                        activityCode: '1218A'
                                    }
                                }).then(function successCallback(response) {
                                    // 请求成功执行代码
                                    // 礼品信息

                                    $scope.giftList = response.data.map.gifts;
                                    $scope.investDeadline = response.data.map.gifts[6].investDeadline;
                                    $scope.investAmount = response.data.map.gifts[6].investAmount;
                                    $scope.giftName = response.data.map.gifts[6].giftName;
                                    $scope.giftType = response.data.map.gifts[6].giftType;
                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                                break;
                        }
                    } else {
                        $scope.isJoin = true;
                    }
                }
            }
            //立即投资
        $scope.lijitouzi = function() {
            if ($stateParams.wap) {
                if ($scope.isLogin) {
                    $state.go("main.bankBillList", { activeCode: $scope.activeCode });
                } else {
                    $scope.isJoin = true;
                }
            } else {
                if ($stateParams.uid) {
                    window.location.href = "aowb://page=2?";
                } else {
                    $scope.isJoin = true;
                }
            }
        }
        $scope.back = function() {
            $scope.isConfirm = false;
        }
        $scope.toBack = function() {
            $scope.isJoin = false;
        }
        $scope.recording1 = function() {
            $scope.record = true;
            resourceService.queryPost($scope, $filter('getUrl')('兑奖记录'), {}, { name: '用户兑奖记录' });
        }
        $scope.recording2 = function() {
                $scope.record = false;
                resourceService.queryPost($scope, $filter('getUrl')('兑奖记录'), { uid: $scope.uid }, { name: '我的兑奖记录' });
            }
            // 关闭领取成功
        $scope.close1 = function() {
                $scope.isSuccess = false;
                if ($stateParams.wap) {
                    resourceService.queryPost($scope, $filter('getUrl')('我的活动统计'), { uid: $scope.uid }, { name: '我的活动统计' });
                }
                if ($stateParams.uid) {
                    resourceService.queryPost($scope, $filter('getUrl')('我的活动统计'), {
                        uid: $scope.uid,
                        version: $scope.version,
                        token: $scope.token,
                        channel: $scope.channel
                    }, { name: '我的活动统计' });
                }

                if ($scope.record) {
                    resourceService.queryPost($scope, $filter('getUrl')('兑奖记录'), {}, { name: '用户兑奖记录' });
                } else {
                    resourceService.queryPost($scope, $filter('getUrl')('兑奖记录'), { uid: $scope.uid }, { name: '我的兑奖记录' });
                }
                $http({
                    method: 'GET',
                    url: '/member/getActivityGift.do',
                    params: {
                        activityCode: '1218A'
                    }
                }).then(function successCallback(response) {
                    for (var i = 0; i < response.data.map.gifts.length; i++) {
                        if (response.data.map.gifts[i].surplusQuantity <= 0) {
                            $scope.gloomy = true;
                        }
                    }
                    $scope.activityIng = response.data.map.activityIng;
                }, function errorCallback(response) {
                    // 请求失败执行代码
                });

            }
            //关闭未达到领取条件
        $scope.close2 = function() {
                $scope.isAchieve = false;
            }
            //确定兑换
        $scope.confirm = function() {
                if ($stateParams.wap) {
                    if (!$scope.addrId && $scope.giftType == 2) {
                        $scope.usedImformation = true;
                    } else {
                        resourceService.queryPost($scope, $filter('getUrl')('收件地址'), { uid: $scope.uid, }, { name: '收件地址' });
                        resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                            uid: $scope.uid,
                            gid: $scope.gid,
                            activityCode: '1218A',
                            id: $scope.addrId
                        }, { name: '礼品兑换' });

                    }
                }
                if ($stateParams.uid) {
                    if (!$scope.addrId && $scope.giftType == 2) {
                        $scope.usedImformation = true;
                    } else {
                        resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                            uid: $scope.uid,
                            gid: $scope.gid,
                            activityCode: '1218A',
                            id: $scope.addrId,
                            version: $scope.version,
                            token: $scope.token,
                            channel: $scope.channel
                        }, { name: '礼品兑换' });

                    }
                }
                $scope.isConfirm = false;

            }
            //确定领取
        $scope.receive = function(tegForm) {

            if (tegForm.$valid) {
                if ($stateParams.wap) {
                    // resourceService.queryPost($scope, $filter('getUrl')('收件地址'), { uid: $scope.uid, }, { name: '收件地址' });
                    if ($scope.addrId) {
                        resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                            uid: $scope.uid,
                            gid: $scope.gid,
                            activityCode: '1218A',
                            id: $scope.addrId
                        }, { name: '礼品兑换' });

                    } else {
                        resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                            uid: $scope.uid,
                            gid: $scope.gid,
                            activityCode: '1218A',
                            realname: $scope.login.name,
                            mobilePhone: $scope.login.mobilephone,
                            addr: $scope.login.address
                        }, { name: '礼品兑换' });

                    }
                }
                if ($stateParams.uid) {
                    // resourceService.queryPost($scope, $filter('getUrl')('收件地址'), {
                    //     uid: $scope.uid,
                    //     version: $scope.version,
                    //     token: $scope.token,
                    //     channel: $scope.channel
                    // }, { name: '收件地址' });
                    if ($scope.addrId) {
                        resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                            uid: $scope.uid,
                            gid: $scope.gid,
                            activityCode: '1218A',
                            id: $scope.addrId,
                            version: $scope.version,
                            token: $scope.token,
                            channel: $scope.channel
                        }, { name: '礼品兑换' });

                    } else {
                        resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                            uid: $scope.uid,
                            gid: $scope.gid,
                            activityCode: '1218A',
                            realname: $scope.login.name,
                            mobilePhone: $scope.login.mobilephone,
                            addr: $scope.login.address,
                            version: $scope.version,
                            token: $scope.token,
                            channel: $scope.channel
                        }, { name: '礼品兑换' });
                    }
                }

            } else {
                // if (tegForm.mobilephone.$valid == false) {
                //     $rootScope.errorText = '请输入正确的手机号码';
                //     $rootScope.maskError = true;
                // } else {
                //     $rootScope.errorText = '请正确填写以上信息';
                //     $rootScope.maskError = true;
                // }
            }
        }
        $scope.cancel = function() {
                $scope.usedImformation = false;
            }
            // 邀请弹框
        $scope.lijiyaoqing = function() {
            if ($stateParams.wap) {
                if ($scope.isLogin) {
                    if (isWeixin()) {
                        $('.activity-firend-boxweixin').fadeIn(200);
                    } else {
                        $('.activity-firend-boxh5').fadeIn(200);
                    }
                } else {
                    // $state.go('dl', { returnurl: 'doubleDanActivity' });
                    $scope.isJoin = true;
                }

            } else {
                if ($stateParams.uid) {
                    if ($stateParams.channel == 1) {
                        window.webkit.messageHandlers.ShareMethod.postMessage({
                            'title': '喜迎双旦，享收益拿好礼',
                            'description': '喜迎双旦，投资即享高额收益，再拿免费好礼',
                            'url': 'https://m.aowubao.com/doubleDanActivity',
                            'picUrl': '/images/activity/doubleDan/share.png',
                            'shareflag': ''
                        });
                    } else if ($stateParams.channel == 2) {
                        android.startFunction(
                            'https://m.aowubao.com/doubleDanActivity',
                            'https://m.aowubao.com/images/activity/doubleDan/share.png',
                            '喜迎双旦，享收益拿好礼',
                            '喜迎双旦，投资即享高额收益，再拿免费好礼',
                            ''
                        );
                    }
                } else {
                    // window.location.href = "aowb://page=4?";
                    $scope.isJoin = true;
                }

            }
        };
        $scope.copyShare = function() {
            var e = document.getElementById("shareurl"); //对象是contents 
            e.select(); //选择对象 
            document.execCommand("Copy");
            $scope.isCopy = true;
            if (IsPC()) {
                $scope.isCopytext = '链接已复制';
            } else {
                $scope.isCopytext = '长按文字全选复制链接';
            }
        };
        $scope.closeshareh5 = function() {
            $('.activity-firend-boxh5').fadeOut(200);
        }
        $scope.default = function(e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function() {
            $('.activity-firend-boxweixin').fadeOut(200);
        };
        // 分享相关
        var linkstr = "";
        if ($scope.user && $scope.user.member.recommCodes) {
            linkstr = '&recommCode=' + $scope.user.member.recommCodes;
        }
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: '喜迎双旦，享收益拿好礼！', // 分享标题
                link: 'https://m.aowubao.com/doubleDanActivity?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/doubleDan/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '喜迎双旦，享收益拿好礼！', // 分享标题
                desc: '喜迎双旦，投资即享高额收益，再拿免费好礼！', // 分享描述
                link: 'https://m.aowubao.com/doubleDanActivity?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/doubleDan/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '喜迎双旦，享收益拿好礼！', // 分享标题
                desc: '喜迎双旦，投资即享高额收益，再拿免费好礼！', // 分享描述
                link: 'https://m.aowubao.com/doubleDanActivity?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/doubleDan/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '喜迎双旦，享收益拿好礼！', // 分享标题
                desc: '喜迎双旦，投资即享高额收益，再拿免费好礼！', // 分享描述
                link: 'https://m.aowubao.com/doubleDanActivity?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/doubleDan/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '喜迎双旦，享收益拿好礼！', // 分享标题
                desc: '喜迎双旦，投资即享高额收益，再拿免费好礼！', // 分享描述
                link: 'https://m.aowubao.com/doubleDanActivity?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/doubleDan/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
        })

        function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        };
        var browser = {
            versions: function() {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            }(),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }

        function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
        var ver = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (Array.isArray(ver)) {
            ver = parseInt(ver[1], 10);
            $(".info-content").css({ "position": "absolute", "top": "30rem", "left": "50%", "transform": "translateX(-50%)" });
            $(".information").css({ "position": "absolute" });


            var contentHeight1 = $('.info-content').css('top');
            var contentHeight = $('.info-content').css('top').replace("px", "") * 1;
            var bodyHeight = 1250;
            // console.log(contentHeight);
            $(window).bind('scroll', function() {

                var contentHeight = $(window).scrollTop()

                // newHeight = contentHeight + offset;
                contentHeight1 = contentHeight + 'px';
                if (contentHeight > bodyHeight) {

                    $('.info-content').css({ 'position': 'absolute', 'bottom': "1250px" });
                } else {
                    //设置输入框位置使其紧贴输入框
                    $('.info-content').css({ 'position': 'absolute', 'top': contentHeight1 });

                }

            });

        }
        // var contentHeight = $('.info-content').css('top');
        // $(window).bind('scroll', function() {
        //     var newHeight = $('.info-content').css('top');
        //     //表示此时有软键盘存在，输入框浮在页面上了
        //     if ((newHeight - contentHeight) > 0) {

        //         //页面滑动后，输入框需跟随移动的距离
        //         var offset = newHeight - contentHeight;

        //         contentHeight = contentHeight + offset;

        //         //设置输入框位置使其紧贴输入框
        //         $('.info-content').css({ 'position': 'absolute', 'top': contentHeight });
        //     }
        // });
        // }


    })
})