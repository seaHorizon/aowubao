define(['jweixin', 'js/module.js'], function(wx, controllers) {
    controllers.controller('double12Ctrl', function($scope, $rootScope, $filter, $state, $location, resourceService, isWeixin, $localStorage, $stateParams, signWeChatService) {
        // signWeChatService();
        $rootScope.title = '嗨翻双十二';
        $scope.mask = false;
        $scope.first = false;
        $('body').scrollTop(0);
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        if ($stateParams.wap) {
            $scope.isLogin = $filter('isRegister')().register;
            $scope.wap = $stateParams.wap;
            if ($scope.isLogin) {
                $scope.isEntry = true;
                $scope.ftype = 2;
                $scope.user = $filter('isRegister')().user;
                $scope.uid = $scope.user.member.uid;
                $scope.shareUrl = 'https://m.aowubao.com/friendreg1?recommCode=' + $scope.user.member.recommCodes;
                // 发送请求判断用户是否参与过
                resourceService.queryPost($scope, $filter('getUrl')('isJoin'), { uid: $scope.uid }, { name: 'isJoin' });
            } else {
                $scope.isEntry = false;
                $scope.ftype = 1;
            }

            //对接app
        } else if ($stateParams.uid) {
            // app已登录
            $scope.uid = $stateParams.uid;
            $scope.ftype = 2;
            $scope.isEntry = true;
            resourceService.queryPost($scope, $filter('getUrl')('isJoin'), { uid: $scope.uid }, { name: 'isJoin' });
        } else {
            $scope.ftype = 1;
        }

        $scope.$on('resourceService.QUERY_POST_MYEVENT', function(event, data, type) {
            switch (type.name) {
                case 'isJoin':
                    if (data.success) {
                        // 如果已参与
                        $scope.isJoin = data.map.isJoin;
                        $scope.amount = data.map.amount;
                    }
                    break;
                    // case '立即参与':
                case '立即参与':
                    if (data.success) {
                        $scope.mask = true;
                    } else {
                        if (data.errorCode == 9997) {
                            $scope.first = true;
                        }
                    }
                    break;
            }
        });
        //立即参与
        $scope.partake = function() {
                if ($stateParams.wap) {
                    resourceService.queryPost($scope, $filter('getUrl')('立即参与'), { uid: $scope.uid }, { name: '立即参与' });
                } else {
                    $scope.uid = $stateParams.uid;
                    resourceService.queryPost($scope, $filter('getUrl')('立即参与'), { uid: $scope.uid }, { name: '立即参与' });
                }



            }
            //立即登录
        $scope.lijidenglu = function() {
                if ($stateParams.wap) {
                    $state.go('dl', { returnurl: 'double12Activity' });
                } else {
                    window.location.href = "aowb://page=4?";
                }
            }
            //立即投资
        $scope.investment = function() {
                if ($stateParams.wap) {
                    $state.go("main.bankBillList");
                } else {
                    window.location.href = "aowb://page=2?";
                }
            }
            //继续投资
        $scope.jixutouzi = function() {
                if ($stateParams.wap) {
                    $state.go("main.bankBillList");
                } else {
                    window.location.href = "aowb://page=2?";
                }
            }
            //关闭弹框
        $scope.close = function() {
            $scope.mask = false;
        }
        $scope.close1 = function() {
            $scope.first = false;
        }
        $scope.close2 = function() {
                $scope.second = false;
            }
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
                        'title': '嗨翻双十二  豪礼送送送！',
                        'description': '小米MIX2、小米空气净化器Pro等壕礼任性送！',
                        'url': 'https://m.aowubao.com/friendreg1',
                        'picUrl': '/images/activity/double12/share.png',
                        'shareflag': ''
                    });
                } else if ($stateParams.channel == 2) {
                    android.startFunction(
                        'https://m.aowubao.com/friendreg1',
                        'https://m.aowubao.com/images/activity/double12/share.png',
                        '嗨翻双十二  豪礼送送送！',
                        '小米MIX2、小米空气净化器Pro等壕礼任性送！',
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
        if ($scope.user && $scope.user.member.mobilephone) {
            linkstr = '&recommCode=' + $scope.user.member.mobilephone;
        }
        wx.ready(function() {
            wx.onMenuShareTimeline({
                title: '邀请好友投资，享18元返现！', // 分享标题
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareAppMessage({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQQ({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareWeibo({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
                success: function() {
                    alert('分享成功！');
                },
                cancel: function() {
                    alert('您取消了分享！');
                }
            });
            wx.onMenuShareQZone({
                title: '邀请好友投资，享18元返现！', // 分享标题
                desc: '邀请好友人数越多返现越多，奖励无上限！', // 分享描述
                link: 'https://m.aowubao.com/friendreg?wap=true' + linkstr, // 分享链接
                imgUrl: 'https://m.aowubao.com/images/activity/inviteFriend1/share.png', // 分享图标
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