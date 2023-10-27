// pages/index/component/bar/bar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTask: false,
    showProduct: false,
    emoji: "🌈",
    TabCur: 0,
    taskName: '',
    taskTitle: '',
    taskDesc: '',
    taskScore: 1,
    productName: '',
    productDesc: '',
    productTitle: '',
    productScore: 1,
    missionPresets: [{
      name: "无预设",
      title: "",
      desc: "",
    }, {
      name: "早睡早起",
      title: "晚上要早睡，明天早起",
      desc: "熬夜对身体很不好，还是要早点睡觉第二天才能有精神！",
    }, {
      name: "打扫房间",
      title: "清扫房间，整理整理",
      desc: "有一段时间没有打扫房间了，一屋不扫，何以扫天下？",
    }, {
      name: "健康运动",
      title: "做些运动，注意身体",
      desc: "做一些健身运动吧，跳绳，跑步，训练动作什么的。",
    }, {
      name: "戒烟戒酒",
      title: "烟酒不解真愁",
      desc: "维持一段时间不喝酒，不抽烟，保持健康生活！",
    }, {
      name: "请客吃饭",
      title: "请客吃点好的",
      desc: "好吃的有很多，我可以让你尝到其中之一，好好享受吧！",
    }, {
      name: "买小礼物",
      title: "整点小礼物",
      desc: "买点小礼物，像泡泡马特什么的。",
    }, {
      name: "洗碗洗碟",
      title: "这碗碟我洗了",
      desc: "有我洗碗洗碟子，有你吃饭无它事。",
    }, {
      name: "帮拿东西",
      title: "帮拿一天东西",
      desc: "有了我，你再也不需要移动了。拿外卖，拿零食，开空调，开电视，在所不辞。",
    }, {
      name: "制作饭菜",
      title: "这道美食由我完成",
      desc: "做点可口的饭菜，或者专门被指定的美食。我这个大厨，随便下，都好吃。",
    }],
    marketPresets: [
      {
        name: "无预设",
        title: "",
        desc: "",
      }, {
        name: "薯片",
        title: "美味薯片",
        desc: "诱人的零食，夜宵绝佳伴侣，咔嘣脆！凭此商品可以向对方索要薯片。",
      }, {
        name: "奶茶券",
        title: "奶茶权限",
        desc: "凭此券可以向对方索要一杯奶茶。",
      }, {
        name: "夜宵券",
        title: "夜宵放开闸",
        desc: "凭此券可以让自己在夜里狂野干饭。",
      }, {
        name: "洗碗券",
        title: "洗碗券",
        desc: "凭此券可以让对方洗碗一次！若都有洗碗券则互相抵消。",
      }, {
        name: "做家务",
        title: "家务券",
        desc: "凭此券可以让对方做一次轻型家务，比如扔垃圾，打扫一个的房间，领一天外卖什么的。",
      }, {
        name: "不赖床",
        title: "早起券",
        desc: "凭此券可以让对方早起床一次。熬夜对身体很不好，还是要早点睡觉第二天才能有精神！",
      }, {
        name: "做运动",
        title: "减肥券",
        desc: "凭此券可以逼迫对方做一次运动，以此来达到减肥维持健康的目的。",
      }, {
        name: "给饭吃",
        title: "饭票",
        desc: "凭此券可以让对方做一次或请一次饭，具体视情况而定。",
      }, {
        name: "买小礼物",
        title: "小礼物盒",
        desc: "凭此券可以让对方买点小礼物，像泡泡马特什么的。",
      }, {
        name: "跑腿",
        title: "跑腿召唤",
        desc: "凭此券可以让对方跑腿一天，拿外卖，拿零食，开空调，开电视，在所不辞。",
      }
    ]
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id
    })
  },
  onChangeTaskScore(event) {
    this.setData({
      taskScore: event.detail
    })
  },
  onChangeProductScore(event) {
    this.setData({
      productScore: event.detail
    })
  },
  onChangeTask(event) {
    const { picker, value, index } = event.detail;
    const { name, desc, title } = value || {};
    this.setData({
      taskName: name,
      taskDesc: desc,
      taskTitle: title,
    })
  },
  onChangeProduct(event) {
    const { picker, value, index } = event.detail;
    const { name, desc, title } = value || {};
    this.setData({
      productName: name,
      productDesc: desc,
      productTitle: title,
    })
  },
  showTaskPopup() {
    this.setData({ showTask: true });
  },
  onCloseTask() {
    this.setData({ showTask: false });
  },
  showProductPopup() {
    this.setData({ showProduct: true });
  },
  onCloseProduct() {
    this.setData({ showProduct: false });
  },
  submit() {
    const { TabCur, taskTitle, taskDesc, taskName, taskScore, productTitle, productDesc, productName, productScore, emoji } = this.data;
    // 发布任务
    if (TabCur == 0) {
      if (taskName == '') {
        wx.showToast({
          title: '请选择任务',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.showLoading({
        title: 'loading~',
      })
      wx.cloud.callFunction({
        name: 'addElement',
        data: {
          list: getApp().globalData.collectionMissionList,
          title: taskTitle,
          desc: taskDesc,
          credit: taskScore,
          isFinish: false,
          star: false,
          emoji: emoji,
          creator: getApp().globalData.userInfoA.nickname,
          bg_color: getApp().globalData.userInfoA.sex === 0 ? 'blue' : 'pink'
        }
      }).then(res => {
        wx.hideLoading()
        if (res.result.errMsg == 'collection.add:ok') {
          wx.switchTab({ url: '/pages/Mission/index' })
        }
      })
    } else {
      if (productName == '') {
        wx.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.cloud.callFunction({
        name: 'addElement',
        data: {
          list: getApp().globalData.collectionMarketList,
          title: productTitle,
          desc: productDesc,
          credit: productScore,
          emoji: emoji,
          creator: getApp().globalData.userInfoA.nickname,
        }
      })
      // wx.navigateTo({
      //   url: `/pages/PublishProduct/index?title=${productTitle}&desc=${productDesc}&name=${productName}`,
      // })
    }
  },
  jumpPageChoise(e) {
    // try {
    //   wx.setStorageSync('emoji', this.data.emoji)
    // } catch (e) {}wxb056275c9cf496b8
    wx.navigateTo({
      url: '/pages/Publish/choiseEmoji/choiseEmoji',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    this.setData({
      emoji: wx.getStorageSync('emoji') || "🌈",
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})