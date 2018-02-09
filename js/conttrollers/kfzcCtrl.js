define(['js/module.js', 'jquery'], function (controllers, $) {
    controllers.controller('kfzcCtrl', function ($scope, $stateParams, $filter, $state, $sce) {

        $scope.toback = function () {
            // $filter('跳回上一页')();
            $state.go('kefu', { wap: true });
        };

        $scope.slideToggle = function (e) {
            $(e.currentTarget).parent().siblings("p").stop().slideToggle(200);

            if ($(e.currentTarget).hasClass('slideDown')) {
                $(e.currentTarget).removeClass('slideDown')
            } else { $(e.currentTarget).addClass('slideDown') }
        };
    });
})