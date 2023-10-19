/* Main page of the app */
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
        avatarUrlA: '',
        avatarUrlB: '',
        bindOpenid: '',
        openid: '',
    },
    async onShow() {
        if (getApp().globalData.userInfoA._openid) {
            await this.getUserInfoA()
            if (this.data.bindOpenid) {
                await this.getUserInfoB()
            }
        } else {
            await this.getOpenId()
        }
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
        const { nickname, credit, _bindOpenid, avatarUrl } = data
        getApp().globalData.userInfoA = data
        this.setData({
            userA: nickname,
            creditA: credit,
            avatarUrlA: avatarUrl,
            bindOpenid: _bindOpenid
        })
    },
    async getUserInfoB() {
        const data = await this.getUserInfo(this.data.bindOpenid)
        const { nickname, credit, avatarUrl } = data
        getApp().globalData.userInfoB = data
        this.setData({
            userB: nickname,
            creditB: credit,
            avatarUrlB: avatarUrl
        })
    }
})