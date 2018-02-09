define(['js/module.js'],function(controllers){
	//活动--双节
	controllers.controller('midAutumnActivityCtrl',function($scope,$rootScope){
        $rootScope.title="双节畅享加息-嗷呜宝";
        $scope.displayApple=false;
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
		$scope.displayA = function () {
			if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
				$scope.displayApple=true;
			} else {
				$scope.displayApple=false;
			}
		};
        $scope.displayA();
	})
	//活动--99重阳节
	controllers.controller('99ActivityCtrl',function($scope,$rootScope,$stateParams,$state ){
		$rootScope.title="久久重阳-嗷呜宝";
		$scope.displayApple=false;
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
		$scope.displayA = function () {
			if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
				$scope.displayApple=true;
			} else {
				$scope.displayApple=false;
			}
		};
		$scope.displayA();
		$scope.InvestClick=function(){
			if ($stateParams.wap) {
				$state.go('main.bankBillList');
			}
			else {
				window.location.href="aowb://page=2?";
			}
		}
	})

	//活动--双11
	controllers.controller('double11Ctrl',function($scope,$rootScope,$stateParams,$localStorage,resourceService,$filter,$state,ngDialog){
		$scope.displayApple=false;
		$scope.userInfo={
			login:false,
			lsjlShow:false,
			xymShow:false,
			double11Show:false,
			pert:{'left': '26%'},
			interval:null,
		}
		resourceService.queryPost($scope, $filter('getUrl')('activity_double11'), {}, 'activity_double11');
		//活动人数
		// resourceService.queryPost($scope, $filter('getUrl')('getInvestUidCount'), {}, 'getInvestUidCount');
		resourceService.queryPost($scope, $filter('getUrl')('activity_HistoryRecord'), {pageSize:100,pageOn:1}, 'activity_HistoryRecord');
		$rootScope.title="双十一狂欢 豪送iPhone8";
		$filter('isPath')('double11Activity');
		if($localStorage.user||$stateParams.uid){
			$scope.userInfo.login=true;
		}
		$rootScope.displayA($scope);
		$scope.InvestClick=function(id,type,atid){
			if ($stateParams.wap) {
				$state.go('cpDetail', {pid:id,type:type,atid:atid});
			}
			else {
				window.location.href="aowb://page=9?pid="+id+"&ptype="+type+"&atid="+atid;
			}
		}
		$scope.historyWiningClick=function(){
			$scope.userInfo.lsjlShow=true;
			$scope.userInfo.xymShow=false;
		}
		$scope.LuckCodeClick=function(){
			$scope.userInfo.lsjlShow=false;
			$scope.userInfo.xymShow=true;
		}
		$scope.deubleCloseClick=function(){
			$scope.userInfo.lsjlShow=false;
			$scope.userInfo.xymShow=false;
		}
		$scope.$on('resourceService.QUERY_POST_MYEVENT', function (event, data, type) {
			switch (type) {
				case 'activity_double11':
					if (data.success) {
						$scope.productData = data.map.result;
						if($scope.productData.pert){
							$scope.pert={'left': ($scope.productData.pert-1)+'%'};
						}
						if(data.map.investList){
							if(data.map.investList.length>0){
								$scope.investList=data.map.investList;
							}
							else{
								$scope.investList=[];
								$scope.userInfo.double11Show = true;
							}
						}else{
							$scope.investList=[];
							$scope.userInfo.double11Show = true;
						}
						// $scope.totalDate=data.map;
						//活动参与人数
						$scope.investTotal=data.map.investTotal;
						if($localStorage.user){
							resourceService.queryPost($scope, $filter('getUrl')('activity_MyLuckCode'), {id:$scope.productData.id,uid:$localStorage.user.member.uid}, 'activity_MyLuckCode');
						}else if($stateParams.uid){
							resourceService.queryPost($scope, $filter('getUrl')('activity_MyLuckCode'), {id:$scope.productData.id,uid:$stateParams.uid}, 'activity_MyLuckCode');
						}
					} else {
						$filter('服务器信息')(data.errorCode, $scope, 'y');
					}
					break;
				case 'activity_HistoryRecord':
					if (data.success) {
						$scope.history=data.map.history;
					} else {
						$filter('服务器信息')(data.errorCode, $scope, 'y')
					}
					break;
				case 'activity_MyLuckCode':
					if (data.success) {
						if(data.map.luckAmount==0){
							$scope.LuckCodes=[];
						}else{
							if(data.map.luckCodes){
								$scope.LuckCodes=data.map.luckCodes.split(',');
							}
						}
					} else {
						$filter('服务器信息')(data.errorCode, $scope, 'y')
					}
					break;
				case 'getInvestUidCount':
					if(data.success){
						$scope.investTotal=data.map.uidCount;//活动标人数
					}
					break;
			};
		});
		$scope.checkLast=function($last){
			if(!$scope.userInfo.interval){
				var $list = $('.div_tableHeight .tableList');
				if($scope.investList.length>5&&$('.div_tableHeight .tableList').length>0){
					$scope.userInfo.interval=setInterval(function() {
						$list.animate({'margin-top':'-1.5rem'},500,function() {
							$list.find('tr').eq(0).appendTo($list);
							$list.css('margin-top',0);
						});
					}, 3000);
				}
			}
			if($last) {
				$scope.userInfo.double11Show = true;
			}
		}
		//错误框提示
		$scope.onClick = function () {
			ngDialog.closeAll();
		};
	})
});