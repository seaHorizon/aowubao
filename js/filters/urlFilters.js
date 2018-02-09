'use strict';
define(['app'], function (app) {
    app.filter('getUrl', function () {
        return function (name) {
            var base = '/'
            var urls = {
                // 首页
                "shouYe": base + "index/index.dos",
                // 注册
                "getyzm": base + "register/sendRegMsg.dos",
                "getPhone": base + "register/existMobilePhone.dos",
                "zuce": base + "register/reg.dos",
                // 我的帐户
                "myacc": base + "accountIndex/info.dos",
                "我的资产": base + "accountIndex/myFunds.dos",
                "站内信": base + "messageCenter/getMessage.dos",
                "我的投资": base + "investCenter/productList.dos",
                "我的明细": base + "assetRecord/index.dos",
                "我的信息": base + "memberSetting/index.dos",
                "我的银行卡": base + "memberSetting/myBankInfo.dos",
                "我的消息": base + "messageCenter/getMessage.dos",
                "我的红包": base + "activity/index.dos",
                "信息认证": base + "memberSetting/sendBankMsg.dos",
                "实名认证": base + "memberSetting/bankInfoVerify.dos",
                "充值index": base + "recharge/index.dos",
                "创建订单": base + "recharge/createPayOrder.dos",
                "充值验证码": base + "recharge/sendRechargeSms.dos",
                "充值": base + "recharge/goPay.dos",
                "提现": base + "withdrawals/index.dos",
                "提现申请": base + "withdrawals/addWithdrawals.dos",
                "换绑卡": base + "memberSetting/bankInfoVerify.do",
                "能不能换绑卡": base + "memberSetting/myBankInfo.do",
                // 登录
                "login": base + "login/doLogin.dos",
                "短信验证": base + "memberSetting/sendForgetTpwdCode.dos",
                "完成设置交易密码提交": base + "memberSetting/updateTpwdBySms.dos",
                "判断用户状态": base + "memberSetting/index.dos",

                /*产品*/
                "cplist": base + "product/list.dos",
                "cpDetail": base + "product/detail.dos",
                "cpPicAndInvest": base + "product/detail_info.dos",
                "产品可用优惠券": base + "activity/usable.dos",
                "购买产品": base + "product/invest.dos",

                "交易密码重置短信验证码": base + "memberSetting/sendForgetTpwdCode.dos",
                "设置交易密码": base + "memberSetting/updateTpwdBySms.dos",

                "登录密码重置短信验证码": base + "memberSetting/forgetPwdSmsCode.dos",
                "设置登录密码": base + "memberSetting/updateLoginPassWord.dos",
                "意见反馈": base + "system/feedback.dos",
                "银行限额列表": base + "recharge/getBankQuotaList.dos",
                '回款记录': base + "investCenter/repayInfoDetail.dos",
                'getActivityFriendConfigAll': base + 'activity/getActivityFriendConfigAll.dos',
                'getActivityFriendConfig': base + 'activity/getActivityFriendConfig.dos',
                'getActivityFriendStatistics': base + 'activity/getActivityFriendStatistics.dos',
                'getTheRewards': base + 'assetRecord/getTheRewards.dos',
                'getPromoteRedelivery': base + 'member/getPromoteRedelivery.dos',
                'getUse': base + 'member/getUse.dos',
                'myInvitation': base + 'activity/myInvitation.dos',
                // 活动不支持优惠券
                '活动不支持优惠券': base + 'index/checkActivityAllotUseFavourable.do',
                // 关于我们
                '网站公告': base + 'aboutus/newsInformationList.dos',
                '公告详情': base + 'aboutus/newsDetails.dos',
                '媒体报道': base + 'aboutus/newsInformationList.dos',
                '媒体详情': base + 'aboutus/newsDetails.dos',
                // 体验标
                '体验标详情': base + 'product/experienceDetail.dos',
                '体验标投资': base + 'product/experienceInvest.dos',
                // 邀请好友三重礼top10
                '邀请好友三重礼top10': base + 'activity/getRankingList.dos',
                // 我的邀请页面
                '我的邀请': base + 'activity/firstInvestList.dos',
                // 总注册人数
                '总注册人数': base + 'member/selectDrmembercount.dos',
                //活动(双十一活动标的 产品详情)
                'activity_double11': base + 'product/getNewActivityProduct.dos',
                //活动(双十一活动--我的幸运码)
                'activity_MyLuckCode': base + 'product/getMyLuckCodes.dos',
                //活动(双十一活动--历史中奖记录)
                'activity_HistoryRecord': base + 'activity/getActivityPrizeResult.dos',
                //参与人数
                'getInvestUidCount': base + 'activity/getInvestUidCount.do',
                //领红包活动
                "领红包活动": base + 'activity/getThanksgivingGift.do',
                //是否领取红包
                "isReceive": base + 'activity/checkIsReceiveGift.do',
                //是否参与
                "isJoin": base + 'activity/giveHaoGift.do',
                //立即参与
                "立即参与": base + 'activity/joinActivity.do',
                //活动（双旦活动 + 兑换接口）
                "礼品兑换": base + 'activity/getGift.do',
                //活动（双旦活动 + 礼品列表）
                "礼品列表": base + 'member/getActivityGift.do',
                //活动（双旦活动 + 用户收件地址）
                "收件地址": base + 'member/getMemberAddress.do',
                //我的活动统计
                "我的活动统计": base + 'activity/getActivityInvestedAmount.do',
                //兑奖记录
                "兑奖记录": base + 'activity/getActivityGiftGetedList.do',
                //我的地址
                "我的地址": base + 'member/getMemberAddress.do',
                //保存地址
                "保存地址": base + 'member/insertMemberAddress.do',
                //删除地址
                "删除地址": base + 'member/deleteMemberAddress.do ',
                //修改地址
                "修改地址": base + 'member/updateMemberAddress.do',
                //修改默认地址
                "修改默认地址": base + 'member/ updateMemberDefaultAddress.do',
                //新年活动-兑奖记录
                "新年兑奖记录": base + 'activity/getCommonActivityGiftGetedList.do',
                //新年活动-我的活动统计
                "新年我的活动统计": base + 'activity/getCommonActivityInvestedAmount.do',
                //财富榜
                "财富榜": base + 'activity/getCommonActivityTopList.do',
                //发现中心活动列表
                "发现活动列表": base + 'find/activity.do',
            };
            return urls[name];
        }
    })
});