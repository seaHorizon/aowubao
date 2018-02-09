define(['jweixin', 'js/module.js', 'ngdialog', 'radialIndicator'], function (wx, controllers, ngdialog, LuckyCard) {
    controllers.controller('controllerCpList', function ($scope, $rootScope, resourceService, $filter, $state, $localStorage, $anchorScroll, isWeixin, $timeout) {
        $rootScope.title = "我要投资";
        delete $localStorage.coupon;
        $filter('isPath')('main.bankBillList');
        $scope.pageSize = 10;
        $scope.Obj = {
            deadline: '',
            pageOn: 1,
            pageSize: $scope.pageSize,
            type: 2,
            status: 5,
            tzName: '', //跳转页面：列表分类
            mbName: '', //目标页面：cpDetail
            scrollTop: $(window).scrollTop(), //滚动条高度
        }
        if ($localStorage.ListObj) {
            var ListObj = $localStorage.ListObj;
            delete $localStorage.ListObj;
            if (ListObj.tzName == 'cpD' && ListObj.mbName == 'cpL') {
                $scope.Obj = ListObj;
                $scope.Obj.pageSize = (ListObj.pageOn - 1) * ListObj.pageSize;
                $scope.Obj.pageOn = 1;
            }
        }
        resourceService.queryPost($scope, $filter('getUrl')('cplist'), $scope.Obj, { name: '产品列表' });
        var isLoad = true;
        $scope.cpList = [];
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
            $scope.page = data.map.page;
            switch (eObj.name) {
                case '产品列表':

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
                case '产品列表1':

                    if ($scope.Obj.pageOn == $scope.page.pageOn) {
                        isLoad = true;
                    }
                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                        $scope.Obj.pageOn = $scope.page.pageOn + 1;
                        $scope.cpList = data.map.page.rows;
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
            $localStorage.ListObj.tzName = 'cpL', //跳转页面：列表分类
                $localStorage.ListObj.mbName = 'cpD', //目标页面：cpDetail
                $localStorage.ListObj.scrollTop = $(window).scrollTop();
            $state.go('cpDetail', { pid: pId });
        };
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            if ($scope.Obj.tzName == 'cpD' && $scope.Obj.mbName == 'cpL') {
                $scope.page.pageOn = $scope.Obj.pageSize / $scope.pageSize;
                $scope.Obj.pageOn = $scope.page.pageOn + 1;
                $scope.Obj.pageSize = $scope.pageSize;
                $scope.Obj.tzName = '';
                $scope.Obj.mbName = '';
                $(window).scrollTop($scope.Obj.scrollTop);

            }
        });


        $scope.active = 0;
        $scope.onClick = function (num) {
            $scope.Obj.pageOn = 1;
            $scope.active = num;
            if (num == 1) {
                $scope.Obj.deadline = "15";
            } else if (num == 2) {
                $scope.Obj.deadline = "30";
            } else if (num == 3) {
                $scope.Obj.deadline = "60";
            } else if (num == 4) {
                $scope.Obj.deadline = "180";
            } else {
                $scope.Obj.deadline = "";
            }
            $scope.cpList = '';
            resourceService.queryPost($scope, $filter('getUrl')('cplist'), $scope.Obj, { name: '产品列表1' });
        };


        // $scope.$on('surplusTime', function (surplusTime) {
        //     console.log(surplusTime)
        // });


    })
})