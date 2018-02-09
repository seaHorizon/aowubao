define(['jweixin', 'js/module.js'], function(wx, controllers) {
    controllers.controller('welcomeNewYear', function($scope, $rootScope, $filter, $state, $location, resourceService, $interval, isWeixin, $http, $localStorage, $stateParams, signWeChatService) {
        // signWeChatService();
        $rootScope.title = $localStorage.header;
        $scope.isJoin = false;
        $scope.isEntry = false;
        $scope.record = true;
        $scope.usedImformation = false;
        $scope.activityIng = true;
        $scope.showRule = false;
        $scope.showBtn = false;
        $scope.activityGift = [];
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
                $scope.shareUrl = 'https://m.aowubao.com/welcomeNewYear?wap=true&recommCode=' + $scope.user.member.recommCodes;
                // 发送请求礼品列表接口
                //礼品列表
                var oneMessageProductList = [];
                var oneMessageMoneyList = [];
                var oneMessageProductList1 = [];
                var oneMessageMoneyList1 = [];
                var oneMessageProductList2 = [];
                var oneMessageMoneyList2 = [];
                $http({
                    method: 'GET',
                    url: '/member/getActivityGift.do',
                    params: {
                        uid: $scope.uid,
                        activityCode: '0109k'
                    }
                }).then(function successCallback(response) {
                    $scope.activityGift = response.data.map.gifts;
                    for (var i = 0; i < response.data.map.gifts.length; i++) {
                        // $scope.activityGift[i].showInfo = false;
                        oneMessageProductList.push($scope.activityGift[i].description.split("|")[0].split(",")[0]);
                        oneMessageMoneyList.push($scope.activityGift[i].description.split("|")[0].split(",")[1]);
                        oneMessageProductList1.push($scope.activityGift[i].description.split("|")[1].split(",")[0]);
                        oneMessageMoneyList1.push($scope.activityGift[i].description.split("|")[1].split(",")[1]);
                        oneMessageProductList2.push($scope.activityGift[i].description.split("|")[2].split(",")[0]);
                        oneMessageMoneyList2.push($scope.activityGift[i].description.split("|")[2].split(",")[1]);
                        if (response.data.map.gifts[i].surplusQuantity <= 0) {
                            $scope.gloomy = true;
                        }
                    }
                    for (var i = 0; i < $scope.activityGift.length; i++) {
                        $scope.activityGift[i].oneMessageProductList = oneMessageProductList;
                        $scope.activityGift[i].oneMessageMoneyList = oneMessageMoneyList;
                        $scope.activityGift[i].oneMessageProductList1 = oneMessageProductList1;
                        $scope.activityGift[i].oneMessageMoneyList1 = oneMessageMoneyList1;
                        $scope.activityGift[i].oneMessageProductList2 = oneMessageProductList2;
                        $scope.activityGift[i].oneMessageMoneyList2 = oneMessageMoneyList2;
                    }
                    $scope.activityIng = response.data.map.activityIng;
                    console.log($scope.activityGift)
                }, function errorCallback(response) {
                    // 请求失败执行代码
                });
                resourceService.queryPost($scope, $filter('getUrl')('新年我的活动统计'), {
                    uid: $scope.uid,
                    activityCode: "0109k"
                }, { name: '我的活动统计' });
            } else {
                $scope.isEntry = false;
                getActivityGift();
            }
            //对接app
        } else if ($stateParams.uid) {
            // app已登录
            $scope.uid = $stateParams.uid;
            $scope.version = $stateParams.version;
            $scope.token = $stateParams.token;
            $scope.channel = $stateParams.channel;
            $scope.isEntry = true;


            var oneMessageProductList = [];
            var oneMessageMoneyList = [];
            var oneMessageProductList1 = [];
            var oneMessageMoneyList1 = [];
            var oneMessageProductList2 = [];
            var oneMessageMoneyList2 = [];
            $http({
                method: 'GET',
                url: '/member/getActivityGift.do',
                params: {
                    uid: $scope.uid,
                    activityCode: '0109k',
                    version: $scope.version,
                    token: $scope.token,
                    channel: $scope.channel
                }
            }).then(function successCallback(response) {
                $scope.activityGift = response.data.map.gifts;
                for (var i = 0; i < response.data.map.gifts.length; i++) {
                    // $scope.activityGift[i].showInfo = false;
                    oneMessageProductList.push($scope.activityGift[i].description.split("|")[0].split(",")[0]);
                    oneMessageMoneyList.push($scope.activityGift[i].description.split("|")[0].split(",")[1]);
                    oneMessageProductList1.push($scope.activityGift[i].description.split("|")[1].split(",")[0]);
                    oneMessageMoneyList1.push($scope.activityGift[i].description.split("|")[1].split(",")[1]);
                    oneMessageProductList2.push($scope.activityGift[i].description.split("|")[2].split(",")[0]);
                    oneMessageMoneyList2.push($scope.activityGift[i].description.split("|")[2].split(",")[1]);
                    if (response.data.map.gifts[i].surplusQuantity <= 0) {
                        $scope.gloomy = true;
                    }
                }
                for (var i = 0; i < $scope.activityGift.length; i++) {
                    $scope.activityGift[i].oneMessageProductList = oneMessageProductList;
                    $scope.activityGift[i].oneMessageMoneyList = oneMessageMoneyList;
                    $scope.activityGift[i].oneMessageProductList1 = oneMessageProductList1;
                    $scope.activityGift[i].oneMessageMoneyList1 = oneMessageMoneyList1;
                    $scope.activityGift[i].oneMessageProductList2 = oneMessageProductList2;
                    $scope.activityGift[i].oneMessageMoneyList2 = oneMessageMoneyList2;
                }
                $scope.activityIng = response.data.map.activityIng;
                console.log($scope.activityGift)
            }, function errorCallback(response) {
                // 请求失败执行代码
            });


            resourceService.queryPost($scope, $filter('getUrl')('新年我的活动统计'), {
                uid: $scope.uid,
                activityCode: '0109k',
                version: $scope.version,
                token: $scope.token,
                channel: $scope.channel
            }, { name: '我的活动统计' });
        } else {
            $scope.isEntry = false;
            var oneMessageProductList = [];
            var oneMessageMoneyList = [];
            var oneMessageProductList1 = [];
            var oneMessageMoneyList1 = [];
            var oneMessageProductList2 = [];
            var oneMessageMoneyList2 = [];
            $http({
                method: 'GET',
                url: '/member/getActivityGift.do',
                params: {
                    activityCode: '0109k'
                }
            }).then(function successCallback(response) {
                $scope.activityGift = response.data.map.gifts;
                for (var i = 0; i < response.data.map.gifts.length; i++) {
                    // $scope.activityGift[i].showInfo = false;
                    oneMessageProductList.push($scope.activityGift[i].description.split("|")[0].split(",")[0]);
                    oneMessageMoneyList.push($scope.activityGift[i].description.split("|")[0].split(",")[1]);
                    oneMessageProductList1.push($scope.activityGift[i].description.split("|")[1].split(",")[0]);
                    oneMessageMoneyList1.push($scope.activityGift[i].description.split("|")[1].split(",")[1]);
                    oneMessageProductList2.push($scope.activityGift[i].description.split("|")[2].split(",")[0]);
                    oneMessageMoneyList2.push($scope.activityGift[i].description.split("|")[2].split(",")[1]);
                    if (response.data.map.gifts[i].surplusQuantity <= 0) {
                        $scope.gloomy = true;
                    }
                }
                for (var i = 0; i < $scope.activityGift.length; i++) {
                    $scope.activityGift[i].oneMessageProductList = oneMessageProductList;
                    $scope.activityGift[i].oneMessageMoneyList = oneMessageMoneyList;
                    $scope.activityGift[i].oneMessageProductList1 = oneMessageProductList1;
                    $scope.activityGift[i].oneMessageMoneyList1 = oneMessageMoneyList1;
                    $scope.activityGift[i].oneMessageProductList2 = oneMessageProductList2;
                    $scope.activityGift[i].oneMessageMoneyList2 = oneMessageMoneyList2;
                }
                $scope.activityIng = response.data.map.activityIng;
                console.log($scope.activityGift)
            }, function errorCallback(response) {
                // 请求失败执行代码
            });
        }
        //用户兑奖记录
        resourceService.queryPost($scope, $filter('getUrl')('新年兑奖记录'), {
            activityCode: '0109k'
        }, { name: '用户兑奖记录' });

        //礼品列表
        function getActivityGift() {
            var oneMessageProductList = [];
            var oneMessageMoneyList = [];
            var oneMessageProductList1 = [];
            var oneMessageMoneyList1 = [];
            var oneMessageProductList2 = [];
            var oneMessageMoneyList2 = [];
            $http({
                method: 'GET',
                url: '/member/getActivityGift.do',
                params: {
                    activityCode: '0109k'
                }
            }).then(function successCallback(response) {
                $scope.activityGift = response.data.map.gifts;
                for (var i = 0; i < response.data.map.gifts.length; i++) {
                    // $scope.activityGift[i].showInfo = false;
                    oneMessageProductList.push($scope.activityGift[i].description.split("|")[0].split(",")[0]);
                    oneMessageMoneyList.push($scope.activityGift[i].description.split("|")[0].split(",")[1]);
                    oneMessageProductList1.push($scope.activityGift[i].description.split("|")[1].split(",")[0]);
                    oneMessageMoneyList1.push($scope.activityGift[i].description.split("|")[1].split(",")[1]);
                    oneMessageProductList2.push($scope.activityGift[i].description.split("|")[2].split(",")[0]);
                    oneMessageMoneyList2.push($scope.activityGift[i].description.split("|")[2].split(",")[1]);
                    if (response.data.map.gifts[i].surplusQuantity <= 0) {
                        $scope.gloomy = true;
                    }
                }
                for (var i = 0; i < $scope.activityGift.length; i++) {
                    $scope.activityGift[i].oneMessageProductList = oneMessageProductList;
                    $scope.activityGift[i].oneMessageMoneyList = oneMessageMoneyList;
                    $scope.activityGift[i].oneMessageProductList1 = oneMessageProductList1;
                    $scope.activityGift[i].oneMessageMoneyList1 = oneMessageMoneyList1;
                    $scope.activityGift[i].oneMessageProductList2 = oneMessageProductList2;
                    $scope.activityGift[i].oneMessageMoneyList2 = oneMessageMoneyList2;
                }
                $scope.activityIng = response.data.map.activityIng;
                console.log($scope.activityGift)
            }, function errorCallback(response) {
                // 请求失败执行代码
            });

        }
        //财富榜
        resourceService.queryPost($scope, $filter('getUrl')('财富榜'), {
            activityCode: '0109k'
        }, { name: '财富榜' });

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
                                    $list.animate({ 'margin-top': '-1.8rem' }, 500, function() {
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

                            if ($scope.crashList.length <= 0) {
                                $scope.invest = true;
                            }
                        }
                        break;
                    case '礼品兑换':
                        if (data.success) {
                            $scope.isSuccess = true;
                        }
                        break;
                    case '财富榜':
                        if (data.success) {
                            $scope.wealthList = data.map.top_list;
                        }
                        break;
                }
            })
            //立即登录
        $scope.lijidenglu = function() {
                if ($stateParams.wap) {
                    $state.go('dl', { returnurl: 'welcomeNewYear' });
                } else {
                    window.location.href = "aowb://page=4?";
                }
            }
            //立即兑换
        $scope.lijiduihuan1 = function(item) {
                if ($stateParams.wap) {
                    if ($scope.isLogin) {
                        if ($scope.surplusAmount >= item.investAmount) {
                            $scope.isConfirm = true;
                            $scope.gid = item.id;
                        } else {
                            $scope.isAchieve = true;
                        }
                        $scope.giftName = item.giftName;
                    } else {
                        $scope.isJoin = true;
                    }
                } else {
                    if ($stateParams.uid) {
                        if ($scope.surplusAmount >= item.investAmount) {
                            $scope.isConfirm = true;
                            $scope.gid = item.id;
                        } else {
                            $scope.isAchieve = true;
                        }
                        $scope.giftName = item.giftName;
                    } else {
                        $scope.isJoin = true;
                    }
                }
            }
            // $scope.lijiduihuan = function(num) {
            //         if ($stateParams.wap) {
            //             if ($scope.isLogin) {
            //                 switch (num) {
            //                     case 0:
            //                         if ($scope.surplusAmount >= 248000) {
            //                             $scope.isConfirm = true;
            //                             $scope.gid = num + 8;
            //                         } else {
            //                             $scope.isAchieve = true;
            //                         }
            //                         $scope.giftName = $scope.activityGift[0].giftName;
            //                         break;
            //                     case 1:
            //                         if ($scope.surplusAmount >= 150000) {
            //                             $scope.isConfirm = true;
            //                             $scope.gid = num + 8;
            //                         } else {
            //                             $scope.isAchieve = true;
            //                         }
            //                         $scope.giftName = $scope.activityGift[1].giftName;
            //                         break;
            //                     case 2:
            //                         if ($scope.surplusAmount >= 80000) {
            //                             $scope.isConfirm = true;
            //                             $scope.gid = num + 8;

        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[2].giftName;
        //                         break;
        //                     case 3:
        //                         if ($scope.surplusAmount >= 50000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 8;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[3].giftName;
        //                         break;
        //                     case 4:
        //                         if ($scope.surplusAmount >= 22000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 8;

        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[4].giftName;
        //                         break;
        //                     case 5:
        //                         if ($scope.surplusAmount >= 8000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 8;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[5].giftName;
        //                         break;
        //                     case 6:
        //                         if ($scope.surplusAmount >= 4800) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 8;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[6].giftName;
        //                         break;
        //                     case 7:
        //                         if ($scope.surplusAmount >= 1500) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 8;
        //                         } else {

        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[7].giftName;
        //                         break;
        //                 }
        //             } else {
        //                 $scope.isJoin = true;
        //             }
        //         } else {
        //             if ($stateParams.uid) {
        //                 switch (num) {
        //                     case 0:
        //                         if ($scope.surplusAmount >= 248000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[0].giftName;
        //                         break;
        //                     case 1:
        //                         if ($scope.surplusAmount >= 150000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[1].giftName;
        //                         break;
        //                     case 2:
        //                         if ($scope.surplusAmount >= 80000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[2].giftName;
        //                         break;
        //                     case 3:
        //                         if ($scope.surplusAmount >= 50000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[3].giftName;
        //                         break;
        //                     case 4:
        //                         if ($scope.surplusAmount >= 22000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;

        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[4].giftName;
        //                         break;
        //                     case 5:
        //                         if ($scope.surplusAmount >= 8000) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[5].giftName;
        //                         break;
        //                     case 6:
        //                         if ($scope.surplusAmount >= 4800) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[6].giftName;
        //                         break;
        //                     case 7:
        //                         if ($scope.surplusAmount >= 1500) {
        //                             $scope.isConfirm = true;
        //                             $scope.gid = num + 1;
        //                         } else {
        //                             $scope.isAchieve = true;
        //                         }
        //                         $scope.giftName = $scope.activityGift[7].giftName;
        //                         break;
        //                 }
        //             } else {
        //                 $scope.isJoin = true;
        //             }
        //         }
        //     }
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
            resourceService.queryPost($scope, $filter('getUrl')('新年兑奖记录'), {
                activityCode: '0109k'
            }, { name: '用户兑奖记录' });
        }
        $scope.recording2 = function() {
                $scope.record = false;
                resourceService.queryPost($scope, $filter('getUrl')('新年兑奖记录'), {
                    uid: $scope.uid,
                    activityCode: '0109k'
                }, { name: '我的兑奖记录' });
            }
            // 关闭领取成功
        $scope.close1 = function() {
                $scope.isSuccess = false;
                if ($stateParams.wap) {
                    resourceService.queryPost($scope, $filter('getUrl')('新年我的活动统计'), {
                        uid: $scope.uid,
                        activityCode: '0109k'
                    }, { name: '我的活动统计' });
                }
                if ($stateParams.uid) {
                    resourceService.queryPost($scope, $filter('getUrl')('新年我的活动统计'), {
                        uid: $scope.uid,
                        activityCode: '0109k',
                        version: $scope.version,
                        token: $scope.token,
                        channel: $scope.channel
                    }, { name: '我的活动统计' });
                }

                if ($scope.record) {
                    resourceService.queryPost($scope, $filter('getUrl')('新年兑奖记录'), {
                        activityCode: '0109k'
                    }, { name: '用户兑奖记录' });
                } else {
                    resourceService.queryPost($scope, $filter('getUrl')('新年兑奖记录'), {
                        uid: $scope.uid,
                        activityCode: '0109k'
                    }, { name: '我的兑奖记录' });
                }
                $http({
                    method: 'GET',
                    url: '/member/getActivityGift.do',
                    params: {
                        uid: $scope.uid,
                        activityCode: '0109k'
                    }
                }).then(function successCallback(response) {
                    $scope.activityGift = response.data.map.gifts;
                    var oneMessageProductList = [];
                    var oneMessageMoneyList = [];
                    var oneMessageProductList1 = [];
                    var oneMessageMoneyList1 = [];
                    var oneMessageProductList2 = [];
                    var oneMessageMoneyList2 = [];
                    $http({
                        method: 'GET',
                        url: '/member/getActivityGift.do',
                        params: {
                            activityCode: '0109k'
                        }
                    }).then(function successCallback(response) {
                        // $scope.activityGift = response.data.map.gifts;
                        for (var i = 0; i < response.data.map.gifts.length; i++) {
                            // $scope.activityGift[i].showInfo = false;
                            oneMessageProductList.push($scope.activityGift[i].description.split("|")[0].split(",")[0]);
                            oneMessageMoneyList.push($scope.activityGift[i].description.split("|")[0].split(",")[1]);
                            oneMessageProductList1.push($scope.activityGift[i].description.split("|")[1].split(",")[0]);
                            oneMessageMoneyList1.push($scope.activityGift[i].description.split("|")[1].split(",")[1]);
                            oneMessageProductList2.push($scope.activityGift[i].description.split("|")[2].split(",")[0]);
                            oneMessageMoneyList2.push($scope.activityGift[i].description.split("|")[2].split(",")[1]);
                            if (response.data.map.gifts[i].surplusQuantity <= 0) {
                                $scope.gloomy = true;
                            }
                        }
                        for (var i = 0; i < $scope.activityGift.length; i++) {
                            $scope.activityGift[i].oneMessageProductList = oneMessageProductList;
                            $scope.activityGift[i].oneMessageMoneyList = oneMessageMoneyList;
                            $scope.activityGift[i].oneMessageProductList1 = oneMessageProductList1;
                            $scope.activityGift[i].oneMessageMoneyList1 = oneMessageMoneyList1;
                            $scope.activityGift[i].oneMessageProductList2 = oneMessageProductList2;
                            $scope.activityGift[i].oneMessageMoneyList2 = oneMessageMoneyList2;
                        }
                        $scope.activityIng = response.data.map.activityIng;
                        console.log($scope.activityGift)
                    }, function errorCallback(response) {
                        // 请求失败执行代码
                    });
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
                    resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                        uid: $scope.uid,
                        gid: $scope.gid,
                        activityCode: '0109k',
                    }, { name: '礼品兑换' });
                }
                if ($stateParams.uid) {
                    resourceService.queryPost($scope, $filter('getUrl')('礼品兑换'), {
                        uid: $stateParams.uid,
                        gid: $scope.gid,
                        activityCode: '0109k',
                        version: $scope.version,
                        token: $scope.token,
                        channel: $scope.channel
                    }, { name: '礼品兑换' });
                }
                $scope.isConfirm = false;
            }
            //未达到兑换条件 我知道了 关闭
        $scope.cancel = function() {
                $scope.isAchieve = false;
            }
            //活动规则
        $scope.activityRule = function() {
                $scope.showRule = true;
            }
            //关闭活动规则
        $scope.closeRule = function() {
                $scope.showRule = false;
            }
            //财富值
        $scope.showWealthValue = function(item) {
            item.showInfo = true;
        }
        $scope.hideWealthValue = function(item) {
                item.showInfo = false;
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
                    $scope.isJoin = true;
                }

            } else {
                if ($stateParams.uid) {
                    if ($stateParams.channel == 1) {
                        window.webkit.messageHandlers.ShareMethod.postMessage({
                            'title': '喜庆迎新年，豪送新年大礼包！',
                            'description': '喜庆新年，投资兑新年好礼，还可冲击排行榜，赢更多好礼！',
                            'url': 'https://m.aowubao.com/welcomeNewYear',
                            'picUrl': '/images/activity/newYear/share.png',
                            'shareflag': ''
                        });
                    } else if ($stateParams.channel == 2) {
                        android.startFunction(
                            'https://m.aowubao.com/welcomeNewYear',
                            'https://m.aowubao.com/images/activity/newYear/share.png',
                            '喜庆迎新年，豪送新年大礼包',
                            '喜庆新年，投资兑新年好礼，还可冲击排行榜，赢更多好礼',
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

        function default1(e) {
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
            e.preventDefault();
        }
        $('.ruleBox').on('touchmove', default1);


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
                title: '喜庆迎新年，豪送新年大礼包！', // 分享标题
                link: 'https://m.aowubao.com/welcomeNewYear?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/newYear/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '喜庆迎新年，豪送新年大礼包！', // 分享标题
                desc: '喜庆新年，投资兑新年好礼，还可冲击排行榜，赢更多好礼！', // 分享描述
                link: 'https://m.aowubao.com/welcomeNewYear?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/newYear/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '喜庆迎新年，豪送新年大礼包！', // 分享标题
                desc: '喜庆新年，投资兑新年好礼，还可冲击排行榜，赢更多好礼！', // 分享描述
                link: 'https://m.aowubao.com/welcomeNewYear?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/newYear/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '喜庆迎新年，豪送新年大礼包！', // 分享标题
                desc: '喜庆新年，投资兑新年好礼，还可冲击排行榜，赢更多好礼！', // 分享描述
                link: 'https://m.aowubao.com/welcomeNewYear?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/newYear/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '喜庆迎新年，豪送新年大礼包！', // 分享标题
                desc: '喜庆新年，投资兑新年好礼，还可冲击排行榜，赢更多好礼！', // 分享描述
                link: 'https://m.aowubao.com/welcomeNewYear?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/newYear/share.png', // 分享图标
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
        // if (Array.isArray(ver)) {
        //     ver = parseInt(ver[1], 10);
        //     // $(".activity-firend-boxh5").css({ "position": "absolute", "top": "30rem", "left": "50%", "transform": "translateX(-50%)" });
        //     $(".activity-firend-boxh5").css({ "position": "absolute" });


        //     // var contentHeight1 = $('.info-content').css('top');
        //     // var contentHeight = $('.info-content').css('top').replace("px", "") * 1;
        //     // var bodyHeight = 1250;
        //     // // console.log(contentHeight);
        //     // $(window).bind('scroll', function() {

        //     //     var contentHeight = $(window).scrollTop()

        //     //     // newHeight = contentHeight + offset;
        //     //     contentHeight1 = contentHeight + 'px';
        //     //     if (contentHeight > bodyHeight) {

        //     //         $('.info-content').css({ 'position': 'absolute', 'bottom': "1250px" });
        //     //     } else {
        //     //         //设置输入框位置使其紧贴输入框
        //     //         $('.info-content').css({ 'position': 'absolute', 'top': contentHeight1 });

        //     //     }

        //     // });

        // }
    })
})