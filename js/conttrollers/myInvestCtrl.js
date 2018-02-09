define([
    'js/module.js'
    , 'framework/jquery-asPieProgress.js'
    , 'framework/rainbow.min.js'
]
    , function (controllers) {
        controllers.controller('myInvestCtrl'
            , ['$scope'
                , '$rootScope'
                , '$filter'
                , '$state'
                , 'resourceService'
                , '$localStorage'
                , function ($scope, $rootScope, $filter, $state, resourceService, $localStorage) {
                    $scope.showPage = false;
                    $rootScope.maskHidde = true;
                    $rootScope.title = "我的投资";
                    $scope.userOBJ = $filter('isRegister')();
                    $filter('isPath')('myInvest');
                    $scope.showMode = 1;
                    $scope.pageSize = 3;//页面大小
                    $scope.one = {
                        request: false,
                        status: 1,
                        beforePage: 2,
                        pageOn: 1,
                        pro: [],
                        isLoad: true
                    };
                    var oneArr = [];
                    $scope.two = {
                        request: false,
                        status: 3,
                        beforePage: 2,
                        pageOn: 1,
                        pro: [],
                        isLoad: true
                    };
                    $scope.three = {
                        request: false,
                        status: 0,
                        beforePage: 2,
                        pageOn: 1,
                        pro: [],
                        isLoad: true
                    };
                    $scope.getData = function (item, proItem) {
                        $scope.member = {
                            uid: $scope.userOBJ.user.member.uid,
                            status: item.status,
                            pageOn: item.pageOn,
                            pageSize: $scope.pageSize
                        };
                        if (item.request == false) {
                            resourceService.queryPost($scope, $filter('getUrl')('我的投资'), $scope.member, { name: '我的投资', item: item });
                            item.request = true;
                        } else {
                            if (item.isLoad) {
                                if (proItem.id == item.pro[item.pro.length - 1].id) {
                                    if (item.beforePage != item.pageOn) {
                                        $scope.member.pageOn = item.beforePage;
                                        resourceService.queryPost($scope, $filter('getUrl')('我的投资'), $scope.member, { name: '我的投资', item: item });
                                        item.isLoad = false;
                                    }
                                }
                            }
                        }
                    };
                    if ($localStorage.jumpList) {
                        var jumpList = $localStorage.jumpList;
                        if (jumpList.tzName == 'myCashed' && jumpList.mbName == 'myInvest') {
                            $scope.showMode = jumpList.showMode;
                            // $scope.pageSize=(jumpList.pageOn-1)*$scope.pageSize;
                            switch (jumpList.showMode) {
                                case 1:
                                    if ($scope.one.request == false) {
                                        $scope.getData($scope.one);
                                    }
                                    break;
                                case 2:
                                    if ($scope.two.request == false) {
                                        $scope.getData($scope.two);
                                    }
                                    break;
                                case 3:
                                    if ($scope.three.request == false) {
                                        $scope.getData($scope.three);
                                    }
                                    break;
                            }
                        }
                        delete $localStorage.jumpList;
                    }
                    else {
                        $scope.getData($scope.one);
                    }

                    $scope.toback = function () {
                        $filter('跳回上一页')(3);
                    };
                    $scope.goCashed = function (item) {
                        $localStorage.jumpList = {
                            // item:item,
                            tzName: 'myInvest',//跳转页面：my-invest（投资列表）
                            mbName: 'myCashed',//目标页面：my-cashed（回款记录）
                            showMode: $scope.showMode,
                        }
                        $state.go("mycashed", { cashedId: item.id, status: item.status });
                    }
                    $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
                        switch (type.name) {
                            case '我的投资':
                                if (data.success) {
                                    type.item.user = data.map;
                                    type.item.pageOn = data.map.page.pageOn;
                                    if (type.item.beforePage == type.item.pageOn) {
                                        type.item.isLoad = true;
                                    }
                                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                                        type.item.beforePage = data.map.page.pageOn + 1;
                                        for (var i = 0; i < data.map.page.rows.length; i++) {
                                            type.item.pro.push(data.map.page.rows[i]);
                                        }
                                    } else {
                                        type.item.isLoad = false;
                                    }
                                    $rootScope.maskHidde = false;
                                } else {
                                    $filter('服务器信息')(data.errorCode, $scope, 'y');
                                    $rootScope.maskHidde = false;
                                }
                                break;
                        }
                    });

                    $scope.upDownClick = function (event) {
                        var $this = $(event.currentTarget),
                            $thisCon = $this.parents('.con');
                        if ($thisCon.hasClass('active')) {
                            $thisCon.removeClass('active');
                        } else {
                            $thisCon.addClass('active');
                        }
                    };

                    $scope.changeMode = function (type) {
                        var $triggerAct = $('.trigger-wrap .active');
                        switch (type) {
                            case 1:
                                $scope.showMode = 1;
                                if ($scope.one.request == false) {
                                    $rootScope.maskHidde = true;
                                    $scope.getData($scope.one);
                                }
                                break;
                            case 2:
                                $scope.showMode = 2;
                                if ($scope.two.request == false) {
                                    $rootScope.maskHidde = true;
                                    $scope.getData($scope.two);
                                }
                                break;
                            case 3:
                                $scope.showMode = 3;
                                if ($scope.three.request == false) {
                                    $rootScope.maskHidde = true;
                                    $scope.getData($scope.three);
                                }
                                break;
                        }
                    };

                    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                        $scope.showPage = true;
                        $rootScope.maskHidde = false;
                    });

                }
            ]);
    })