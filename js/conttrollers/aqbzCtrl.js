define(['js/module.js', 'jquery'], function (controllers, $) {
    controllers.controller('aqbzCtrl', function ($scope, $stateParams, $filter, $state) {
        $scope.title = "安全保障";
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        $scope.toback = function () {
            // $filter('跳回上一页')();
            $state.go('main.more', {});
        };
        $scope.showFile = false;
        $scope.showMore = function (e) {
            var elm = $(e.currentTarget);
            var padding = parseInt(elm.siblings().css("padding-bottom")) + parseInt(elm.parent().css("padding-bottom"));
            var parent = elm.parent().parent();
            $scope.height = parent.height();
            var h = parseInt(elm.siblings().find("p").height());
            parent.css({ height: h + padding }).siblings(".aqbzContent-box").height($scope.height).find(".more").show();
            elm.hide();
        }
        var $win = $(window);
        $win.on('load resize scroll', function () {
            $('.aqbzcheck-wrap').height()
            $('.aqbzcheck-box').height($win.height()).width($win.width());
            $('.aqbzcheck-box img').css('max-height', $win.height()).css('max-width', $win.width());
        });
    });
})