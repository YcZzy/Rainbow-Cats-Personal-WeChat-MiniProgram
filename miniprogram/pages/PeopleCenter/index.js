const app = getApp()

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({
  data: {
    avatarUrl: getApp().globalData.userInfoA.avatarUrl || defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    nickname: getApp().globalData.userInfoA.nickname || '',
    openid: '',
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
  },
  onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    this.setData({
      avatarUrl,
    })
  },
  change(e) {
    this.setData({
      nickname: e.detail.value,
      openid: getApp().globalData.userInfoA._openid
    })
    console.log(e.detail.value)
  },
  submit() {
    if (!this.data.nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.cloud.uploadFile({
      cloudPath: 'avatar/' + this.data.openid + '.jpg',
      filePath: this.data.avatarUrl
    })
      .then(res => {
        //返回该图片文件路径fileID
        wx.cloud.callFunction({
          name: 'editUserInfo',
          data: {
            list: getApp().globalData.collectionUserList,
            _openid: getApp().globalData.userInfoA._openid,
            nickname: this.data.nickname,
            avatarUrl: res.fileID
          }
        })
      })
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000
    })
  }
})
