Page({
  // 保存商品的 _id 和详细信息
  data: {
    _id: '',
    item: null,
    dateStr: '',
    timeStr: '',
    creditPercent: 0,
    from: '',
    to: '',
    maxCredit: getApp().globalData.maxCredit,
    list: getApp().globalData.collectionMarketList,
    isCanDelete: false
  },

  onLoad(options) {
    // 保存上一页传来的 _id 字段，用于查询商品
    if (options.id !== undefined) {
      this.setData({
        _id: options.id,
        item: JSON.parse(options.item)
      })
    }
  },

  getDate(dateStr) {
    const milliseconds = Date.parse(dateStr)
    const date = new Date()
    date.setTime(milliseconds)
    return date
  },
  deleteList() {
    const _this = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: res => {
        if (res.confirm) {
          console.log(_this.data.item._id)
          wx.cloud.callFunction({
            name: 'deleteElement',
            data: {
              list: getApp().globalData.collectionMissionList,
              _id: _this.data.item._id
            }
          }).then(res => {
            if (res.result.stats.removed === 1) {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            }
            wx.navigateBack({
              delta: 1
            })
          })
        }
      }
    })
  },
  async finishMission() {
    const _this = this
    await wx.cloud.callFunction({ name: 'editAvailable', data: { _id: _this.data.item._id, value: true, list: getApp().globalData.collectionMissionList } })
    // 给自己增加积分
    await wx.cloud.callFunction({ name: 'editCredit', data: { _openid: getApp().globalData.userInfoA._openid, value: _this.data.item.credit, list: getApp().globalData.collectionUserList } })
    //显示提示
    wx.showToast({
      title: '任务完成',
      icon: 'success',
      duration: 2000
    })
    wx.navigateBack({
      delta: 1
    })
  },
  async starMission() {
    const _this = this
    await wx.cloud.callFunction({ name: 'editStar', data: { _id: _this.data.item._id, value: true, list: getApp().globalData.collectionMissionList } })
    //显示提示
    wx.showToast({
      title: '收藏成功',
      icon: 'success',
      duration: 2000
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 根据 _id 值查询并显示商品
  async onShow() {
    const item = this.data.item
    if (this.data._id.length > 0) {
      this.setData({
        item: item,
        dateStr: this.getDate(item.date).toDateString(),
        timeStr: this.getDate(item.date).toTimeString(),
        creditPercent: (item.credit / getApp().globalData.maxCredit) * 100,
        isCanDelete: item._openid === getApp().globalData.userInfoA._openid
      })
      // await wx.cloud.callFunction({name: 'getElementById', data: this.data}).then(data => {
      //   // 将商品保存到本地，更新显示
      //   this.setData({
      //     item: item,
      //     dateStr: this.getDate(item.date).toDateString(),
      //     timeStr: this.getDate(item.date).toTimeString(),
      //     creditPercent: (item.credit / getApp().globalData.maxCredit) * 100,
      //   })

      //   //确定商品关系并保存到本地
      //   if(this.data.item._openid === getApp().globalData._openidA){
      //     this.setData({
      //       from: getApp().globalData.userA,
      //       to: getApp().globalData.userB,
      //     })
      //   }else if(this.data.item._openid === getApp().globalData._openidB){
      //     this.setData({
      //       from: getApp().globalData.userB,
      //       to: getApp().globalData.userA,
      //     })
      //   }
      // })
    }
  },
})