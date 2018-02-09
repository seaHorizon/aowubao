
/* 
* @Author: xyc
* @Date:   2016-01-18 23:29:04
*/

define(['js/module.js'], function (controllers) {
    controllers.controller('moreController', ['$scope', '$filter', '$state', 'resourceService', function ($scope, $filter, $state, resourceService) {
        // resourceService.queryPost($scope, $filter('getUrl')('shouYe'), obj, { name: 'index' });
        $scope.Obj = {
            pageOn: 1,
            pageSize: 10,
        };

        $scope.index = [];
        resourceService.queryPost($scope, $filter('getUrl')('发现活动列表'), $scope.Obj, { name: '发现活动列表' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '发现活动列表':
                    if (data.success) {

                        if ($scope.Obj.pageOn == 1) {
                            $scope.index = data.map.info.rows;
                        } else {
                            for (var i = 0; i < data.map.info.rows.length; i++) {
                                $scope.index.push(data.map.info.rows[i]);
                            }
                        }

                        if ($scope.Obj.pageOn >= data.map.info.totalPage) {

                        } else {
                            //无线滚动
                            $scope.loadMore = function (index) {
                                if (index.length >= $scope.Obj.pageSize * $scope.Obj.pageOn && $(document).scrollTop() > $scope.Obj.pageOn * 1200) {
                                    if ($scope.Obj.pageOn != data.map.info.totalPage) {
                                        $scope.Obj.pageOn++;
                                        resourceService.queryPost($scope, $filter('getUrl')('发现活动列表'), $scope.Obj, { name: '发现活动列表' });
                                    }
                                }
                            };
                        }

                    }
                    break;

            }
        });




    }
    ]);
    controllers.controller('YJFKController', ['$scope', '$filter', '$state', 'resourceService', '$timeout', function ($scope, $filter, $state, resourceService, $timeout) {
        $scope.userOBJ = $filter('isRegister')();
        //监听事件
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {

            switch (type) {
                case '意见反馈':
                    if (data.success) {
                        $filter('意见反馈信息')('ok', $scope, 'y');
                    } else {
                        $filter('意见反馈信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            };
        });

        $scope.len = 0;
        $scope.shuru = function () {
            $scope.len = $("#txt").val().length;
        };
        $scope.toSub = function () {
            if (!$scope.userOBJ.register) {
                $state.go('dl');
            }
            else {
                if ($scope.content == null || $scope.content == "") {
                    $scope.hide = true;
                    $timeout(function () {
                        $scope.hide = false;
                    }, 1000)
                } else {
                    resourceService.queryPost($scope, $filter('getUrl')('意见反馈'), {
                        uid: $scope.userOBJ.user.member.uid,
                        contactInformation: $scope.userOBJ.user.member.mobilephone,
                        content: $scope.content
                    }, '意见反馈');
                    // console.log($scope.content);

                }


            }
        };
    }
    ]);
})