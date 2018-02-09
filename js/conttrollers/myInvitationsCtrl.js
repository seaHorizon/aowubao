define(['jweixin', 'js/module.js'], function (wx, controllers) {
    controllers.controller('myInvitationsCtrl', function ($scope, $rootScope, $interval, $filter, $state, resourceService, isWeixin, signWeChatService) {
        $rootScope.title = "立即邀请好友";

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


    });
})