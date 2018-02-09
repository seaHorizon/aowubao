define(['jweixin', 'js/module.js'], function (wx, controllers) {
    controllers.controller('myInvitationssCtrl', function ($scope, $rootScope, $interval, $filter, $state, resourceService, isWeixin, signWeChatService, $http) {
        $rootScope.title = "邀请记录";

        $scope.user = $filter('isRegister')().user;
        $scope.mobilephone = $scope.user.member.mobilephone;
        $scope.recommCode = $scope.user.member.recommCodes;

        $scope.toback = function () {
            $state.go('myInvitation', { wap: true });
        };
        // 复制并打开链接
        $scope.cpoyFin = false;
        $scope.copy = function () {
            $('#mycopy').select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            // alert("已复制好，可贴粘。");
        };
        $scope.copyNow = function () {
            $('#copyTxt').select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
        };
        $scope.obj = {
            pageSize: 10,
            pageOn: 1,
        };

        $scope.isLogin = $filter('isRegister')().register;
        if ($scope.isLogin) {
            $scope.user = $filter('isRegister')().user;
            $scope.uid = $scope.user.member.uid;
            $http({
                method: 'GET',
                url: 'activity/myInvitationRecord.do',
                params: {
                    token: $scope.user.token,
                    uid: $scope.uid,
                    pageSize: $scope.obj.pageSize,
                    pageOn: $scope.obj.pageOn,
                }
            }).then(function successCallback(response) {

                // 请求成功执行代码
                $scope.map = response.data.map;
                $scope.list = response.data.map.page.rows;





                if ($scope.obj.pageOn >= $scope.map.page.totalPage) {

                } else {
                    $scope.loadMore = function (list) {

                        // console.log($(document).scrollTop());
                        if (list.length >= $scope.obj.pageSize * $scope.obj.pageOn) {
                            if ($scope.obj.pageOn != $scope.map.page.totalPage) {
                                $scope.obj.pageOn++;
                                $http({
                                    method: 'GET',
                                    url: 'activity/myInvitationRecord.do',
                                    params: {
                                        token: $scope.user.token,
                                        uid: $scope.uid,
                                        pageSize: $scope.obj.pageSize,
                                        pageOn: $scope.obj.pageOn,
                                    }
                                }).then(function successCallback(response) {

                                    if ($scope.obj.pageOn == 1) {
                                        $scope.list = response.data.map.page.rows;
                                    } else {
                                        for (var i = 0; i < response.data.map.page.rows.length; i++) {
                                            $scope.list.push(response.data.map.page.rows[i]);
                                        }
                                    }

                                }, function errorCallback(response) {
                                    // 请求失败执行代码
                                });
                            }
                        }
                    }

                }
                // 无限滚动


            }, function errorCallback(response) {
                // 请求失败执行代码
            });
        }




    });
})
