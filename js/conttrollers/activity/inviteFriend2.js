define(['jweixin', 'js/module.js'], function(wx, controllers) {
    controllers.controller('inviteFriend2', function($rootScope, $scope, $filter, $state, $location, resourceService, isWeixin, $localStorage, $stateParams, signWeChatService) {
        // signWeChatService();
        $rootScope.title = '邀请好友';
        $('body').scrollTop(0);
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
            if ($filter('isRegister')().register == true) {
                $scope.ftype = 2;
                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;
                $scope.shareUrl = 'https://m.aowubao.com/friendreg2?recommCode=' + $scope.user.member.recommCodes;
            } else {
                $scope.ftype = 1;
            }
        } else if ($stateParams.uid) {
            $scope.uid = $stateParams.uid;
            $scope.ftype = 2;
        } else {
            $scope.ftype = 1;
        }
        if ($scope.uid) {
            resourceService.queryPost($scope, $filter('getUrl')('myInvitation'), { uid: $scope.uid, pageSize: 100 }, { name: 'myInvitation' });
        }
        // resourceService.queryPost($scope, $filter('getUrl')('邀请好友三重礼top10'), {}, { name: '邀请好友三重礼top10' });

        // 活动规则
        $scope.showRule = function(i) {
            $('.rule-box').fadeIn(200);
        };
        $scope.closeRule = function() {
            $('.rule-box').fadeOut(200);
        };

        $scope.myInvitation = function() {
            if ($stateParams.wap) {
                $state.go("myInvitation");
            } else {
                window.location.href = "aowb://page=901?";
            }
        }

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case '邀请好友列表':
                    $scope.rewards = data.map.rewards || 0;
                    break;
                case '邀请好友三重礼top10':
                    // data.map.top = [
                    //     {rownum:1,mobilePhone:'139****1234',amount:8000},
                    //     {rownum:2,mobilePhone:'139****1234',amount:7000},
                    //     {rownum:3,mobilePhone:'139****1234',amount:6000},
                    //     {rownum:4,mobilePhone:'139****1234',amount:5000},
                    //     {rownum:5,mobilePhone:'139****1234',amount:4000},
                    //     {rownum:6,mobilePhone:'139****1234',amount:3000},
                    //     {rownum:7,mobilePhone:'139****1234',amount:2000},
                    //     {rownum:8,mobilePhone:'139****1234',amount:1000},
                    //     {rownum:9,mobilePhone:'139****1234',amount:800},
                    //     {rownum:10,mobilePhone:'139****1234',amount:80},
                    // ]
                    $scope.repeatInvestList = data.map.top;
                    $scope.data = data.map.activity;
                    if ($scope.uid) {
                        resourceService.queryPost($scope, $filter('getUrl')('getActivityFriendStatistics'), {
                            uid: $scope.uid
                        }, { name: '邀请好友列表' });
                    }
                    break;
                case 'myInvitation':
                    if (data.success) {
                        $scope.data = data.map;
                        $scope.inviteList = data.map.page.rows;
                    } else {
                        $filter('服务器信息')(data.errorCode, $scope, 'y');
                    }
                    break;
            }
        });
        // 邀请弹框
        $scope.lijiyaoqing = function() {
            if ($stateParams.wap) {
                if (isWeixin()) {
                    $('.activity-firend-boxweixin').fadeIn(200);
                } else {
                    $('.activity-firend-boxh5').fadeIn(200);
                }
            } else {
                if ($stateParams.channel == 1) {
                    window.webkit.messageHandlers.ShareMethod.postMessage({
                        'title': '人脉变钱脉，邀请好友一起赚！',
                        'description': '邀请好友得奖励，邀请人数越多，赚的越多！',
                        'url': 'https://m.aowubao.com/friendreg2',
                        'picUrl': '/images/activity/inviteFriend2/share.png',
                        'shareflag': ''
                    });
                } else if ($stateParams.channel == 2) {
                    android.startFunction(
                        'https://m.aowubao.com/friendreg2',
                        'https://m.aowubao.com/images/activity/inviteFriend2/share.png',
                        '人脉变钱脉，邀请好友一起赚！',
                        '邀请好友得奖励，邀请人数越多，赚的越多！',
                        ''
                    );
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
            /*$timeout(function(){
                $('.activity-firend-boxh5').fadeOut(200);
                $scope.isCopy = false;
            },1000);*/
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
            //分享到朋友圈
            wx.onMenuShareTimeline({
                title: '人脉变钱脉，邀请好友一起赚！', // 分享标题
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend2/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            //分享给朋友
            wx.onMenuShareAppMessage({
                title: '人脉变钱脉，邀请好友一起赚！！', // 分享标题
                desc: '邀请好友得奖励，邀请人数越多，赚的越多！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend2/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            //分享到QQ
            wx.onMenuShareQQ({
                title: '人脉变钱脉，邀请好友一起赚！', // 分享标题
                desc: '邀请好友得奖励，邀请人数越多，赚的越多！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend2/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            //分享到腾讯微博
            wx.onMenuShareWeibo({
                title: '人脉变钱脉，邀请好友一起赚！', // 分享标题
                desc: '邀请好友得奖励，邀请人数越多，赚的越多！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend2/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '人脉变钱脉，邀请好友一起赚！', // 分享标题
                desc: '邀请好友得奖励，邀请人数越多，赚的越多！', // 分享描述
                link: 'https://m.aowubao.com/friendreg2?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend2/share.png', // 分享图标
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
    })
})