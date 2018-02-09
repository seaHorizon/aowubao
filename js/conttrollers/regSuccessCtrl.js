define(['js/module.js'], function(controllers) {
    controllers.controller('regSuccessCtrl', function($scope, resourceService, $filter, $rootScope, $state, $localStorage) {
        $rootScope.title = '嗷呜宝';
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

        $scope.money = $localStorage.money;
        $scope.card = $localStorage.card;
        $scope.banka = true;

        function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
        // $scope.downloadclick = function() {
        //     if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
        //         // window.location.href = "https://itunes.apple.com/us/app/ju-sheng-cai-fu/id1171321616?mt=8";
        //         window.location.href = "https://itunes.apple.com/app/id1276104896?mt=8";
        //     } else if (browser.versions.android) {
        //         // window.location.href="http://sj.qq.com/myapp/detail.htm?apkName=com.awb.awb_app";
        //         // window.location.href = "http://m.aowubao.com/awb_app.apk";
        //         window.location.href = "https://m.aowubao.com/awb_app_liqui.apk";
        //         // window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.jscf.js_app";
        //     } else {
        //         // window.location.href="http://sj.qq.com/myapp/detail.htm?apkName=com.awb.awb_app";
        //         window.location.href = "https://m.aowubao.com/awb_app_liqui.apk";
        //     }
        // };


        if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
            $("#button1").attr("disabled", false);
            $("#button2").attr("disabled", true);
        } else if (browser.versions.android) {
            $("#button2").attr("disabled", false);
            $("#button1").attr("disabled", true);
        } else {
            $("#button2").attr("disabled", false);
        }


        $scope.downloadclick1 = function() {

            if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                window.location.href = "https://itunes.apple.com/app/id1276104896?mt=8";
            } else if (browser.versions.android) {
                return false;
            } else {
                return false;
            }
        }

        $scope.downloadclick2 = function() {

            if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
                return false;
            } else if (browser.versions.android) {
                window.location.href = "https://m.aowubao.com/awb_app_liqui.apk";
            } else {
                window.location.href = "https://m.aowubao.com/awb_app_liqui.apk";
            }
        }
        $scope.nextStep = function() {
            $state.go('certification', { identification: 1 });
        }


    });
})