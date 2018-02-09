define(['jweixin', 'js/module.js'], function (wx, controllers) {
    controllers.controller('myInvitationCtrl', function ($scope, $rootScope, $interval, $filter, $state, resourceService, isWeixin, signWeChatService) {
        // signWeChatService();
        $('body').scrollTop(0);
        $rootScope.title = "我的邀请";
        $scope.userOBJ = $filter('isRegister')();

        // resourceService.queryPost($scope, $filter('getUrl')('myInvitation'), { uid: $scope.userOBJ.user.member.uid, pageSize: 100 }, 'myInvitation');

        // resourceService.queryPost($scope, $filter('getUrl')('myInvitation'), { uid: $scope.userOBJ.user.member.uid, pageSize: 100 }, 'myInvitation');

        resourceService.queryPost($scope, $filter('getUrl')('myInvitation'), { uid: $scope.userOBJ.user.member.uid, pageSize: 100, pageOn: 1 }, 'myInvitation');

        // 分享相关
        $scope.share = function () {
            if (isWeixin()) {
                $('.activity-firend-boxweixin').fadeIn(150);
            } else {
                $('.fixed-box').fadeIn(200);
            }
        };
        $scope.closeshareweixin = function () {
            $('.activity-firend-boxweixin').fadeOut(150);
        };
        $scope.closeshare = function () {
            $('.fixed-box').fadeOut(200);
        };
        $scope.default = function (event) {
            event.stopPropagation();
        };
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type) {
                case 'myInvitation':
                    if (data.success) {
                        $scope.data = data.map;
                        $scope.inviteList = data.map.page.rows;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };
        // 温馨提示
        var timer = $interval(function () {
            // $scope.wxts = false;
            $('.wxts').fadeToggle();
            $interval.cancel(timer);
        }, 3000);

        var linkstr = "";
        if ($scope.user && $scope.user.member.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.member.mobilephone;
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '邀请好友投资，享18元返现！', // 分享标题
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
                    alert('您取消了分享！');
                }
            });
        })
    });
})