'use strict';
define(['js/module.js', 'jquery', 'ngdialog', 'radialIndicator'], function (controllers, $, ngdialog) {
    controllers.controller('pageHomeCtrl', function ($scope, $rootScope, $location) {
        $rootScope.title = "嗷呜宝";
        $scope.$on('$stateChangeSuccess', function () {
            // console.log($location.$$path);
            $scope.path = $location.$$path;
        })

    })
    controllers.controller('controllerHome', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $location, $timeout) {
        $filter('isPath')('main.home');
        $scope.isLogin = $filter('isRegister')().register;
        if ($localStorage.bomb) {
            $scope.bomb = true;
        } else {
            $localStorage.bomb = $scope.bomb;
        }
        if ($scope.isLogin) {
            $scope.user = $filter('isRegister')().user.member;
            $scope.realInfo = $scope.user.mobilephone;
        }
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        // 首页信息
        var obj = {};
        if ($scope.user) { obj.uid = $scope.user.uid; }
        //首页数据
        resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
        //活动参与人数
        // resourceService.queryPost($scope, $filter('getUrl')('getInvestUidCount'), {}, { name: 'getInvestUidCount' });
        // 公告
        resourceService.queryPost($scope, $filter('getUrl')('网站公告'), { proId: 14, pageSize: 3 }, { name: '公告列表' });
        var $dataTable = $('.notice-box ul');
        var height = $('.notice-box div').height();
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case 'index':
                    $scope.index = data.map;
                    $scope.banner = data.map.banner;
                    if (data.map.activity) {
                        $scope.activity = data.map.activity;
                        $scope.investTotal = data.map.investTotal; //活动标人数
                        if ($scope.activity.iphoneLabel.indexOf('iPhone8') > 0) {
                            $scope.activity.iphoneLabelArr = $scope.activity.iphoneLabel.split('iPhone8');
                            $scope.activity.top1 = 'iPhone8';
                        }
                    }
                    $scope.homePageActivity = data.map.homePageActivity;
                    $localStorage.header = $scope.homePageActivity.title;
                    $scope.popActivity = data.map.popActivity;
                    if ($scope.popActivity.imgUrl) {

                        if (!document.cookie) {
                            $scope.bomb = true;
                            document.cookie = "bomb=true";
                        } else {
                            $scope.bomb = false;
                        }
                    }
                    break;
                case '公告列表':
                    if (data.success) {
                        $scope.gglist = data.map.page.rows;
                        if ($scope.gglist.length > 1) {
                            setInterval(function () {
                                $dataTable.animate({ 'margin-top': '-' + height + 'px' }, 1000, function () {
                                    $dataTable.find('li').eq(0).appendTo($dataTable);
                                    $dataTable.css('margin-top', 0);
                                });
                            }, 2000);
                        }
                    }
                    break;
                case 'getInvestUidCount':
                    if (data.success) {
                        $scope.investTotal = data.map.uidCount; //活动标人数
                    }
                    break;
            };
        });
        $scope.close = function () {
            $scope.bomb = false;
        }
        $scope.radius = $('.rem-rule').width();

        // 吸顶式导航
        // if ($(window).scrollTop() > 200) {
        //     console.log(111)
        // }

        $(document).ready(function () {
            $(window).scroll(function () {
                if ($(window).scrollTop() > 200) {
                    // $("#div-logo").animate({ top: '0' });
                    $("#div-logo").css({
                        "top": "0",
                        "position": "fixed",
                        "display": "block"
                    });

                } else {
                    $("#div-logo").css({
                        "top": "-3.15",
                        "position": "absolute",
                        "display": "none"
                    });
                }
            });
        });
    })
})