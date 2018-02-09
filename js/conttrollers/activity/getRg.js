define(['jweixin', 'js/module.js'], function (wx, controllers) {
    controllers.controller('getRg', function ($scope, $filter, $state, $location, resourceService, isWeixin, $localStorage, $stateParams, signWeChatService) {
        // signWeChatService();
        $('body').scrollTop(0);
        $scope.zhezhaoceng = false;


        if ($scope.uid) {
            resourceService.queryPost($scope, $filter('getUrl')('isReceive'), { uid: $scope.uid }, { name: 'isReceive' });
        }

        $scope.receive = function () {
            if (!$scope.isLogin) {
                alert("123");
                $state.go('dl', { returnurl: 'getRg' });
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('领红包活动'), { uid: $scope.uid }, { name: '领红包活动' });
            }
        }
        $scope.returnRg = function () {
            $scope.zhezhaoceng = false;
        }





        if ($scope.uid) {
            resourceService.queryPost($scope, $filter('getUrl')('isReceive'), { uid: $scope.uid }, { name: 'isReceive' });
        }

        $scope.receive = function () {
            if (!$scope.isLogin) {
                $state.go('dl', { returnurl: 'getRg' });
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('领红包活动'), { uid: $scope.uid }, { name: '领红包活动' });
            }
        }
        $scope.returnRg = function () {
            $scope.zhezhaoceng = false;
        }




        $scope.isLogin = false;

        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        if ($stateParams.wap) {
            $scope.isLogin = $filter('isRegister')().register;
            $scope.wap = $stateParams.wap;
            if ($scope.isLogin) {
                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;
                resourceService.queryPost($scope, $filter('getUrl')('isReceive'), { uid: $scope.uid }, { name: 'isReceive' });
            }
            //登陆过了
        } else if ($stateParams.uid) {
            $scope.uid = $stateParams.uid;

            $scope.isRecieved = false;
            $scope.zhezhaoceng = false;
            $scope.isLogin = $filter('isRegister')().register;
            if ($scope.isLogin) {
                resourceService.queryPost($scope, $filter('getUrl')('isReceive'), { uid: $scope.uid }, { name: 'isReceive' });
                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;

            } else {
                $scope.receive = function () {
                    if (!$scope.isLogin) {
                        alert(1);
                        $state.go('dl', { returnurl: 'getRg' });
                    } else {
                        alert(2);
                        resourceService.queryPost($scope, $filter('getUrl')('领红包活动'), { uid: $scope.uid }, { name: '领红包活动' });
                    }
                }
            }


            $scope.isRecieved = false;
            $scope.zhezhaoceng = false;
            $scope.isLogin = $filter('isRegister')().register;
            if ($scope.isLogin) {
                resourceService.queryPost($scope, $filter('getUrl')('isReceive'), { uid: $scope.uid }, { name: 'isReceive' });
                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;

            } else {
                $scope.receive = function () {
                    if (!$scope.isLogin) {
                        alert(1);
                        $state.go('dl', { returnurl: 'getRg' });
                    } else {
                        alert(2);
                        resourceService.queryPost($scope, $filter('getUrl')('领红包活动'), { uid: $scope.uid }, { name: '领红包活动' });
                    }
                }
            }


            //isRecieved  是否领取
            //isLogin  是否登陆
            $scope.isLogin = true;
            //判断是否已经领取过红包
            resourceService.queryPost($scope, $filter('getUrl')('isReceive'), { uid: $scope.uid }, { name: 'isReceive' });
            //点击领取红包

        }
        // 活动规则
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case '领红包活动':
                    if (data.success) {
                        $scope.zhezhaoceng = true;
                        $scope.isRecieved = true;
                    }
                    break;
                case 'isReceive':
                    if (data.success) {
                        $scope.isRecieved = false;
                    } else {
                        if (!data.success && data.errorCode == '9996') {
                            $scope.isRecieved = true;
                        }
                    }
                    break;
            }
        });

        // console.log($scope.success)
        // if ($scope.success == true) {
        //     $scope.isLogin = true;
        // }

        $scope.receive = function () {

            if (!$scope.isLogin) {
                if ($scope.wap) {

                    $state.go('dl', { returnurl: 'getRg' });
                } else {
                    window.location.href = "aowb://page=4?";
                }

            } else {
                resourceService.queryPost($scope, $filter('getUrl')('领红包活动'), { uid: $scope.uid }, { name: '领红包活动' });
            }
        }
        $scope.returnRg = function () {
            $scope.zhezhaoceng = false;
        }
        // 邀请弹框
        $scope.lijiyaoqing = function () {
            if ($stateParams.wap) {
                if (isWeixin()) {
                    $('.activity-firend-boxweixin').fadeIn(200);
                } else {
                    $('.activity-firend-boxh5').fadeIn(200);
                }
            } else {
                if ($stateParams.channel == 1) {
                    window.webkit.messageHandlers.ShareMethod.postMessage({
                        'title': '邀请好友投资，享18元返现！',
                        'description': '邀请好友人数越多返现越多，奖励无上限！',
                        'url': 'https://m.aowubao.com/friendreg',
                        'picUrl': 'https://m.aowubao.com/images/activity/inviteFriend1/share.png',
                        'shareflag': ''
                    });
                } else if ($stateParams.channel == 2) {
                    android.startFunction(
                        'https://m.aowubao.com/friendreg',
                        'https://m.aowubao.com/images/activity/inviteFriend1/share.png',
                        '邀请好友投资，享18元返现！',
                        '邀请好友人数越多返现越多，奖励无上限！',
                        ''
                    );
                }
            }
        };
        $scope.copyShare = function () {
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
        $scope.closeshareh5 = function () {
            $('.activity-firend-boxh5').fadeOut(200);
        }
        $scope.default = function (e) {
            e.stopPropagation();
        }
        $scope.closeshareweixin = function () {
            $('.activity-firend-boxweixin').fadeOut(200);
        };
        // 分享相关
        var linkstr = "";
        if ($scope.user && $scope.user.member.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.member.mobilephone;
        }
        wx.ready(function () {
            wx.onMenuShareTimeline({
                title: '邀请好友投资，享18元返现！', // 分享标题
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
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
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
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
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
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
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
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
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function () {
                    alert('分享成功！');
                },
                cancel: function () {
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
            versions: function () {
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