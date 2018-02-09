define(['jweixin', 'js/module.js', 'ngdialog', 'radialIndicator'], function (wx, controllers, ngdialog, LuckyCard) {
    controllers.controller('ListCategoryCtrl', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, isWeixin, $timeout) {
        $rootScope.title = "我要投资";
        delete $localStorage.coupon;
        $filter('isPath')('main.investsListCategory');
        $scope.pageSize = 10;
        $scope.Obj = {
            uid: '',
            pageOn: 1,
            pageSize: $scope.pageSize,
            type: 2,
            status: 6,
            selectStatu: true,
            tzName: '',//跳转页面：列表分类
            mbName: '',//目标页面：cpDetail
            scrollTop: $(window).scrollTop(),//滚动条高度
        }

        if ($filter('isRegister')().register == true) {
            $scope.user = $filter('isRegister')().user;
            $scope.Obj.uid = $scope.user.member.uid;
        }


        if ($localStorage.ListObj) {
            var ListObj = $localStorage.ListObj;
            delete $localStorage.ListObj;
            if (ListObj.tzName == 'cpD' && ListObj.mbName == 'lc') {
                $scope.Obj = ListObj;
                $scope.Obj.pageSize = (ListObj.pageOn - 1) * ListObj.pageSize;
                $scope.Obj.pageOn = 1;
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), $scope.Obj, { name: '产品列表' });
        var isLoad = true;
        $scope.cpList = [];
        //切换（待还款/已还款）
        $scope.clickTab = function (statuV) {
            if ($scope.Obj.status != statuV) {
                $scope.Obj.status = statuV;
                $scope.Obj.selectStatu = !$scope.Obj.selectStatu;
                $scope.cpList = [];
                resourceService.queryPost($scope, $filter('getUrl')('cplist'), $scope.Obj, { name: '产品列表' });
                $scope.Obj.pageOn = 1;
            }
        };

        $scope.clickTab(6);
        //无线滚动
        $scope.loadMore = function (item) {
            if (item.id == $scope.cpList[$scope.cpList.length - 1].id) {
                if (isLoad) {
                    if ($scope.Obj.pageOn != $scope.page.pageOn) {
                        resourceService.queryPost($scope, $filter('getUrl')('cplist'), $scope.Obj, { name: '产品列表' });
                        isLoad = false;
                    }
                };
            };
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '产品列表':
                    $scope.page = data.map.page;
                    if ($scope.Obj.pageOn == $scope.page.pageOn) {
                        isLoad = true;
                    }
                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                        $scope.Obj.pageOn = $scope.page.pageOn + 1;
                        for (var i = 0; i < data.map.page.rows.length; i++) {
                            $scope.cpList.push(data.map.page.rows[i]);
                        }
                    } else {
                        isLoad = false;
                    }
                    break;
                case 'goinvestment':
                    if (data.success) {
                        $localStorage.cp = data.map;
                        $state.go('investment');
                    }
                    break;
            };
        });
        $scope.radius = $('.rem-rule').width();
        //跳转详情
        $scope.cpDetailGo = function (pId) {
            $localStorage.ListObj = $scope.Obj;
            $localStorage.ListObj.tzName = 'lc',//跳转页面：列表分类
                $localStorage.ListObj.mbName = 'cpD',//目标页面：cpDetail
                $localStorage.ListObj.scrollTop = $(window).scrollTop();
            $state.go('cpDetail', { pid: pId });
        };
        //返回
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            if ($scope.Obj.tzName == 'cpD' && $scope.Obj.mbName == 'lc') {
                $scope.page.pageOn = $scope.Obj.pageSize / $scope.pageSize;
                $scope.Obj.pageOn = $scope.page.pageOn + 1;
                $scope.Obj.pageSize = $scope.pageSize;
                $scope.Obj.tzName = '';
                $scope.Obj.mbName = '';
                $(window).scrollTop($scope.Obj.scrollTop);

            }
        });

    })
        .directive('onFinishRender', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit('ngRepeatFinished');
                        });
                    }
                }
            }
        });
})

