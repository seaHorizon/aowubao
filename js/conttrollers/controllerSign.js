/* 
 * @Author: lee
 * @Date:   2016-01-10 23:29:04
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-01-12 21:49:52
 */

'use strict';

define([
    'js/module.js', 'ngdialog'
], function (controllers, ngdialog) {

    controllers.controller('controllerSign1', ['$scope', '$rootScope', 'resourceService', '$filter', '$state', 'md5', '$localStorage', '$stateParams', '$location', 'ngDialog', function ($scope, $rootScope, resourceService, $filter, $state, md5, $localStorage, $stateParams, $location) {
        if ($location.$$search.toFrom != undefined || $location.$$search.recommCode != undefined || $location.$$search.tid != undefined) {
            $localStorage.webFormPath = $location.$$search;
        };
        $rootScope.title = '用户登录';
        $scope.userLogin = {};
        $scope.sbmit = function (tegForm) {
            resourceService.queryPost($scope, $filter('getUrl')('login'), $scope.userLogin, { name: 'login', tegForm: tegForm });
        }
        if ($filter('isRegister')().user && $filter('isRegister')().user.member && $filter('isRegister')().user.member.uid) {
            // if ($stateParams.returnurl) {
            //     $state.go($stateParams.returnurl, { wap: true });
            // } else {
            //     $state.go("main.myaccountHome");
            // }
            if ($state.params.returnurl) {
                if ($state.params.returnurl.indexOf('?') != -1) {
                    var router = $state.params.returnurl.split('?')[0];
                    var params = $state.params.returnurl.split('?')[1];
                    var obj = {};
                    var array = params.split("&");
                    if (array.length > 1) {
                        for (var i = 0; i < array.length; i++) {
                            obj[array[i].split("=")[0]] = array[i].split("=")[1];
                        }
                    } else {
                        obj[array[0].split("=")[0]] = array[0].split("=")[1];
                    }
                    obj.wap = true;
                    $state.go(router, obj);
                } else {
                    $state.go($state.params.returnurl, { wap: true });
                }
            } else {
                $state.go("main.myaccountHome");
            }
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
            switch (type.name) {
                case 'login':
                    if (data.success) {
                        $localStorage.user = data.map;
                        // if ($localStorage.specialLogin == true) {
                        //     // $rootScope.$emit('loginSuccess',true);
                        //     $state.go('special',{wap:true});
                        // } else {
                        if ($state.params.returnurl) {
                            if ($state.params.returnurl.indexOf('?') != -1) {
                                var router = $state.params.returnurl.split('?')[0];
                                var params = $state.params.returnurl.split('?')[1];
                                var obj = {};
                                var array = params.split("&");
                                if (array.length > 1) {
                                    for (var i = 0; i < array.length; i++) {
                                        obj[array[i].split("=")[0]] = array[i].split("=")[1];
                                    }
                                } else {
                                    obj[array[0].split("=")[0]] = array[0].split("=")[1];
                                }
                                obj.wap = true;
                                $state.go(router, obj);
                            } else {
                                $state.go($state.params.returnurl, { wap: true });
                            }
                        } else {
                            $state.go("main.myaccountHome");
                        }
                        // }
                    } else {
                        $filter('登陆错误信息')(data.errorCode, $scope, 'y')
                        $scope.userLogin.mobilephone = null;
                        $scope.userLogin.passWord = null;
                    }
                    break;
                case '注册验证手机号':
                    if (data.success) {
                        if (!data.map.exists && $scope.userLogin.mobilephone != undefined) { //已有用户名
                            $rootScope.errorText = '此手机尚未注册';
                            $rootScope.maskError = true;
                        } else {
                            $state.go('resetPwd', { mobilePhone: $scope.userLogin.mobilephone, forget: true });
                        }
                    }
                    break;
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')();
        };
        $scope.showPassword = function (passwordTextBool) {
            if (passwordTextBool) {
                $scope.passwordText = false;
            } else {
                $scope.passwordText = true;
            }
        }

        $scope.forgetPwd = function (tegForm) {
            if (tegForm.userName.$invalid && tegForm.userName.$viewValue != undefined && tegForm.userName.$viewValue != '') {
                $rootScope.errorText = '手机号输入有误';
                $rootScope.maskError = true;
            } else if (tegForm.userName.$viewValue == undefined || tegForm.userName.$viewValue == '') {
                $rootScope.errorText = '手机号不能为空';
                $rootScope.maskError = true;
            } else {
                resourceService.queryPost($scope, $filter('getUrl')('getPhone'), $scope.userLogin, { name: '注册验证手机号', tegForm: tegForm });
            }

        }
    }])

    // 关于我们
    controllers.controller('GYWMCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', function ($scope, $rootScope, resourceService, $http, $filter, $state) {
        $rootScope.title = $scope.title = '关于嗷呜';
        $scope.wap = getUrlParam('wap');
        $filter('isPath')('GYWM');
        $scope.toback = function () {
            // $filter('跳回上一页')(2);
            $state.go('main.more', {});
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
        $scope.goto = function (url) {
            switch (url) {
                case '公司介绍':
                    if ($scope.wap == 'true') {
                        $state.go('GSJS', { wap: true });
                    } else {
                        $state.go('GSJS');
                    }
                    break;
                case '历程回顾':
                    if ($scope.wap == 'true') {
                        $state.go('LCHG', { wap: true });
                    } else {
                        $state.go('LCHG');
                    }
                    break;
                case '股东介绍':
                    if ($scope.wap == 'true') {
                        $state.go('GDJS', { wap: true });
                    } else {
                        $state.go('GDJS');
                    }
                    break;
                case '管理团队':
                    if ($scope.wap == 'true') {
                        $state.go('GLTD', { wap: true });
                    } else {
                        $state.go('GLTD');
                    }
                    break;
                case '公司资质':
                    if ($scope.wap == 'true') {
                        $state.go('GSZZ', { wap: true });
                    } else {
                        $state.go('GSZZ');
                    }
                    break;
                case '多重保障':
                    if ($scope.wap == 'true') {
                        $state.go('YYYZ', { wap: true });
                    } else {
                        $state.go('YYYZ');
                    }
                    break;
                case '网站公告':
                    if ($scope.wap == 'true') {
                        $state.go('WZGG', { wap: true });
                    } else {
                        $state.go('WZGG');
                    }
                    break;
                case '媒体报道':
                    if ($scope.wap == 'true') {
                        $state.go('MTBD', { wap: true });
                    } else {
                        $state.go('WZGG');
                    }
                    break;
            };
        }
    }])
    // 公司介绍
    controllers.controller('GSJSCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '走进嗷呜';
        $scope.wap = getUrlParam('wap');
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    }])
    // 历程回顾
    controllers.controller('LCHGCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '历程回顾';
        $scope.wap = getUrlParam('wap');
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    }])
    // 股东介绍
    controllers.controller('GDJSCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '股东介绍';
        $scope.wap = getUrlParam('wap');
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    }])
    // 管理团队
    controllers.controller('GLTDCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '管理团队';
        $scope.wap = getUrlParam('wap');
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    }])
    // 公司资质
    controllers.controller('GSZZCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '公司资质';
        $scope.wap = getUrlParam('wap');
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    }])
    // 多重保障
    controllers.controller('YYYZCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $rootScope.title = $scope.title = '多重保障';
        $scope.wap = getUrlParam('wap');
        $scope.page = 1;
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    }])

    // 股权结构
    controllers.controller('GQJGCtrl', ['$scope', '$rootScope', 'resourceService', '$http', '$filter', '$state', '$stateParams', function ($scope, $rootScope, resourceService, $http, $filter, $state, $stateParams) {
        $scope.wap = getUrlParam('wap');
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    }])
    // 网站公告
    controllers.controller('WZGGCtrl', function ($scope, resourceService, $filter, $state, $rootScope) {
        $scope.wap = getUrlParam('wap');
        $rootScope.title = $scope.title = '网站公告';
        $filter('isPath')('WZGG');
        $scope.toback = function () {
            $filter('跳回上一页')(2);
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
        var isLoad = true;
        var pageOn = 1;
        $scope.ggList = [];
        $scope.loadMore = function (item) {
            if (item.id == $scope.ggList[$scope.ggList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10,
                            proId: 14
                        };
                        resourceService.queryPost($scope, $filter('getUrl')('网站公告'), obj, { name: '公告列表' });
                        isLoad = false;
                    }
                };
            };
        };
        var objs = {};
        objs.proId = 14;
        resourceService.queryPost($scope, $filter('getUrl')('网站公告'), objs, { name: '公告列表' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '公告列表':
                    $scope.page = data.map.page;
                    if (pageOn == $scope.page.pageOn) {
                        isLoad = true;
                    }
                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                        pageOn = $scope.page.pageOn + 1;
                        for (var i = 0; i < data.map.page.rows.length; i++) {
                            $scope.ggList.push(data.map.page.rows[i]);
                        }
                    } else {
                        isLoad = false;
                    }
                    break;
            };
        });
        $scope.goto = function (id) {
            if ($scope.wap == 'true') {
                $state.go('GGXQ', { wap: true, artiId: id });
            } else {
                $state.go('GGXQ', { artiId: id });
            }
        }
    })
    // 网站公告子页面
    controllers.controller('GGXQCtrl', function ($scope, resourceService, $filter, $stateParams, $state, $rootScope) {
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        $scope.from = $stateParams.from;
        $rootScope.title = $scope.title = '网站公告';
        $('body').scrollTop(0);
        var obj = {};
        console.log($stateParams);
        if ($stateParams.from == 'kfr') {
            obj.openDayId = $stateParams.artiId;
            resourceService.queryPost($scope, $filter('getUrl')('getOpenDayArticleDetail'), obj, { name: '活动详情' });
        } else {
            obj.artiId = $stateParams.artiId;
            resourceService.queryPost($scope, $filter('getUrl')('公告详情'), obj, { name: '公告详情' });
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '公告详情':
                    $scope.ggxq = data.map.sysArticle;
                    break;
                case '活动详情':
                    $scope.ggxq = data.map.sysArticle;
                    break;
            };
        });
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };
        // $scope.goBack = function () {
        //     if ($stateParams.from == 'home') {
        //         $state.go('main.home');
        //     }
        //     else {
        //         $state.go('WZGG', { wap: true });
        //     }
        // }
    })
    // 媒体报道
    controllers.controller('MTBDCtrl', function ($scope, resourceService, $filter, $state, $rootScope) {
        $scope.wap = getUrlParam('wap');
        $rootScope.title = $scope.title = '媒体报道';
        $filter('isPath')('WZGG');
        $scope.toback = function () {
            $state.go('GYWM', { wap: true });
        };

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
        var isLoad = true;
        var pageOn = 1;
        $scope.ggList = [];
        $scope.loadMore = function (item) {
            if (item.id == $scope.ggList[$scope.ggList.length - 1].id) {
                if (isLoad) {
                    if (pageOn != $scope.page.pageOn) {
                        var obj = {
                            pageOn: pageOn,
                            pageSize: 10,
                            proId: 1
                        };
                        resourceService.queryPost($scope, $filter('getUrl')('媒体报道'), obj, { name: '媒体列表' });
                        isLoad = false;
                    }
                };
            };
        };
        var objs = {};
        objs.proId = 1;
        resourceService.queryPost($scope, $filter('getUrl')('媒体报道'), objs, { name: '媒体列表' });
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '媒体列表':
                    $scope.page = data.map.page;
                    if (pageOn == $scope.page.pageOn) {
                        isLoad = true;
                    }
                    if (data.map.page.pageOn <= data.map.page.totalPage) {
                        pageOn = $scope.page.pageOn + 1;
                        for (var i = 0; i < data.map.page.rows.length; i++) {
                            $scope.ggList.push(data.map.page.rows[i]);
                        }
                    } else {
                        isLoad = false;
                    }
                    break;
            };
        });
        $scope.goto = function (id) {
            if ($scope.wap == 'true') {
                $state.go('MTBDS', { wap: true, artiId: id });
            } else {
                $state.go('MTBD', { artiId: id });
            }
        }
    })
    // 媒体报道子页面
    controllers.controller('MTBDSCtrl', function ($scope, resourceService, $filter, $stateParams, $state, $rootScope) {
        if ($stateParams.wap) {
            $scope.wap = $stateParams.wap;
        }
        $scope.from = $stateParams.from;
        $rootScope.title = $scope.title = '详情';
        $('body').scrollTop(0);
        var obj = {};
        console.log($stateParams);
        if ($stateParams.from == 'kfr') {
            obj.openDayId = $stateParams.artiId;
            resourceService.queryPost($scope, $filter('getUrl')('getOpenDayArticleDetail'), obj, { name: '活动详情' });
        } else {
            obj.artiId = $stateParams.artiId;
            resourceService.queryPost($scope, $filter('getUrl')('公告详情'), obj, { name: '公告详情' });
        }
        $scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, eObj) {
            switch (eObj.name) {
                case '公告详情':
                    $scope.ggxq = data.map.sysArticle;
                    break;
                case '活动详情':
                    $scope.ggxq = data.map.sysArticle;
                    break;
            };
        });
        $scope.toback = function () {
            $state.go('MTBD', { wap: true });
        };
        // $scope.goBack = function () {
        //     if ($stateParams.from == 'home') {
        //         $state.go('main.home');
        //     }
        //     else {
        //         $state.go('WZGG', { wap: true });
        //     }
        // }
    })
    controllers.controller('couponPromptCtrl', function ($scope, resourceService, $filter, $stateParams, $state, $rootScope) {
        $scope.wap = getUrlParam('wap');
        $scope.from = $stateParams.from;
        $rootScope.title = $scope.title = '优惠券温馨提示';

        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
        $scope.toback = function () {
            $filter('跳回上一页')(1);
        };
    })
    // controllers.controller('KFZXCtrl', function ($scope, resourceService, $filter, $stateParams, $state, $rootScope) {
    //     $scope.wap = getUrlParam('wap');

    // })
})