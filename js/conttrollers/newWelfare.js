define(['jweixin', 'js/module.js'], function(wx, controllers) {
    controllers.controller('newWelfare', function($scope, $filter, $state, $location, resourceService, isWeixin, $localStorage, $stateParams, signWeChatService) {
        $scope.lijizhuce = function() {
            if ($stateParams.wap) {
                $state.go('zhuce');
            } else {
                window.location.href = "aowb://page=7?";
            }
        }

    })
})