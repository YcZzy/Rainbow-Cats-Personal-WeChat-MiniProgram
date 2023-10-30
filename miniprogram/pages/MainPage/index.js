/* Main page of the app */
import Toast from '@vant/weapp/toast/toast';
Page({
    //允许接收服务通知
    async requestSubscribeMessage() {
        const templateId = 'R5sHALA7TKs6jCyH_kwNr9l8vVfWKCU5cXQnFKWlwfA'//填入你自己想要的模板ID，记得复制粘贴全，我自己因为网页没开全，结果浪费半小时
        wx.requestSubscribeMessage({
            //tmplIds: [templateId,templateId2,templateId3],
            tmplIds: [templateId],
            success: (res) => {
                //if (res[templateId] === 'accept'&&res[templateId2] === 'accept'&&res[templateId3] === 'accept') {
                if (res[templateId] === 'accept') {
                    this.setData({
                        requestSubscribeMessageResult: '成功',
                    })
                } else {
                    this.setData({
                        requestSubscribeMessageResult: `失败（${res[templateId]}）`,
                    })
                }
            },
            fail: (err) => {
                this.setData({
                    requestSubscribeMessageResult: `失败（${JSON.stringify(err)}）`,
                })
            },
        })
    },
    data: {
        creditA: 0,
        creditB: 0,
        userA: '',
        userB: '',
        sexA: '',
        sexB: '',
        avatarUrlA: '',
        avatarUrlB: '',
        bindOpenid: '',
        openid: '',
        showShare: false,
        options: [
            { name: '微信', icon: 'wechat', openType: 'share' }
        ],
        Headlines: [],
        tts: '',
        tomorrow: '',
        showGuide: false,
        guideData: [
            { selector: '.shareIcon', tips: '邀请好朋友来一起做任务～' },
        ],
    },
    getTomorrow() {
        wx.request({
            url: 'https://timor.tech/api/holiday/tts/tomorrow?timestamp=' + new Date().getTime(),
            success(res) {
                const { code, tts } = res.data || {};
                if (code === 0) {
                    Toast(tts);
                }
            }
        })
    },
    //获取页面大小
    async getScreenSize() {
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    screenWidth: res.windowWidth,
                    screenHeight: res.windowHeight
                })
            }
        })
    },
    getHeadlines() {
        const _this = this
        wx.request({
            url: 'https://timor.tech/api/holiday/tts?timestamp=' + new Date().getTime(),
            success(res) {
                const { code, tts } = res.data || {};
                if (code === 0) {
                    _this.setData({
                        tts,
                        Headlines: [
                            {
                                id: 0,
                                title: tts
                            }
                        ]
                    })
                }
            }
        })
    },
    async onShow() {
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 0
            })
        }
        this.getScreenSize()
        this.getHeadlines()
        await this.getUserInfoA()
        await this.getUserInfoB()
    },
    async getOpenId() {
        const res = await wx.cloud.callFunction({ name: 'getOpenId' })
        getApp().globalData.userInfoA._openid = res.result
        this.setData({
            openid: res.result
        })
    },
    async getUserInfo(openid) {
        const res = await wx.cloud.callFunction({ name: 'getElementByOpenId', data: { list: getApp().globalData.collectionUserList, _openid: openid } })
        return res.result.data[0]
    },
    async getUserInfoA() {
        const data = await this.getUserInfo(getApp().globalData.userInfoA._openid)
        if (!data) {
            return
        }
        const { nickname, credit, _bindOpenid, avatarUrl, sex } = data
        getApp().globalData.userInfoA = data
        this.setData({
            userA: nickname,
            creditA: credit,
            sexA: sex,
            avatarUrlA: avatarUrl,
            bindOpenid: _bindOpenid
        })
    },
    async getUserInfoB(id) {
        const data = await this.getUserInfo(id || this.data.bindOpenid)
        if (!data) {
            return
        }
        const { nickname, credit, avatarUrl, sex } = data
        getApp().globalData.userInfoB = data
        this.setData({
            userB: nickname,
            creditB: credit,
            sexB: sex,
            avatarUrlB: avatarUrl
        })
    },
    // 判断是否是新用户
    async isNewUser() {
        const res = await wx.cloud.callFunction({ name: 'getElementByOpenId', data: { list: getApp().globalData.collectionUserList, _openid: this.data.openid } })
        if (res.result.data.length === 0) {
            return true
        } else {
            return false
        }
    },

    async onLoad(options) {
        await this.getOpenId()
        const isNewUser = await this.isNewUser()
        if (isNewUser) {
            // 注册新用户
            await wx.cloud.callFunction({ name: 'addUserInfo', data: { list: getApp().globalData.collectionUserList } })
        }
        await this.getUserInfoA()
        // 绑定用户
        if (options.bindOpenid && !this.data.bindOpenid) {
            await wx.cloud.callFunction({ name: 'editUserBindId', data: { list: getApp().globalData.collectionUserList, _openid: this.data.openid, _bindOpenid: options.bindOpenid } })
            await wx.cloud.callFunction({ name: 'editUserBindId', data: { list: getApp().globalData.collectionUserList, _openid: options.bindOpenid, _bindOpenid: this.data.openid } })
            await this.getUserInfoA()
            await this.getUserInfoB()
        }
        // 获取自己的信息
        await this.getUserInfoA()
        await this.getUserInfoB()
        if (!this.data.userB) {
            this.setData({
                showGuide: true
            })
        }
    },
    //分享

    onClick(event) {
        this.setData({ showShare: true });
    },

    onClose() {
        this.setData({ showShare: false });
    },
    onSelect(event) {
        Toast(event.detail.name);
        this.onClose();
    },
    onShareAppMessage() {
        return {
            title: this.data.userA +'邀请你加入my team 一起做任务吧！',
            path: '/pages/MainPage/index?bindOpenid=' + this.data.openid
        };
    },
})