define(['js/module.js', 'jquery'], function (controllers, $) {
    controllers.controller('kefuCtrl', function ($scope, $stateParams, $filter, $state) {

        $scope.toback = function () {
            // $filter('跳回上一页')();
            $state.go('main.more', {});
        };
        $scope.hide = true;
        $scope.hides = function () {
            $scope.hide = false;
        }
        $scope.hidess = function () {
            $scope.hide = true;
        }

    });
})