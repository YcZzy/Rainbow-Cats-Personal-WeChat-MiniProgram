Page({
  data: {
    bg_color: "pink",
    emoji: "🌈",
    date: "2021-01-01",
    _openidA: getApp().globalData.userInfoA._openid,
    _openidB: getApp().globalData.userInfoB._openid,
    option1: [
      { text: '全部任务', value: 'allDataList' },
      { text: '已完成的', value: 'finishedMissions' },
      { text: '未完成的', value: 'unfinishedMissions' },
      { text: '我发布的', value: 'myMissions' },
      { text: 'ta发布的', value: 'taMissions' },
      { text: '我收藏的', value: 'starMissions' },
    ],
    option2: [
      { text: '默认排序', value: 'defaultSort' },
      { text: '时间排序', value: 'timeSort' },
      { text: '积分排序', value: 'scoreSort' },
    ],
    value1: 'allDataList',
    value2: 'defaultSort',
    allStatusData: {},
    loading: true
  },
  changeStatus(value) {
    this.setData({ value1: value.detail });
  },
  //页面加载时运行
  async onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    // 获取任务
    await wx.cloud.callFunction({ name: 'getList', data: { list: getApp().globalData.collectionMissionList } }).then(data => {
      // 分别找到data.result.data中的已完成，未完成，我发布的，ta发布的，我收藏的任务 并保存到本地
      const allDataList = data.result.data;
      const allStatusData = {
        allDataList: allDataList,
        finishedMissions: [],
        unfinishedMissions: [],
        myMissions: [],
        taMissions: [],
        starMissions: [],
        loading: false
      }
      allDataList.forEach(element => {
        if (element._openid === this.data._openidA) {
          allStatusData.myMissions.push(element)
        } else {
          allStatusData.taMissions.push(element)
          if (element.isFinish === true) {
            allStatusData.finishedMissions.push(element)
          }
          if (element.isFinish === false) {
            allStatusData.unfinishedMissions.push(element)
          }
          if (element.star === true) {
            allStatusData.starMissions.push(element)
          }
        }
      })
      this.setData({
        allStatusData
      })
    })
  },

  //转到任务详情
  async toDetailPage(element, isUpper) {
    const id = element.currentTarget.dataset.id
    const item = element.currentTarget.dataset.item
    wx.navigateTo({ url: '../MissionDetail/index?id=' + id + '&item=' + JSON.stringify(item) })
  },

  //设置搜索
  onSearch(element) {
    this.setData({
      search: element.detail.value
    })

    this.filterMission()
  },

  //将任务划分为：完成，未完成 
  // status 0-全部  1-已完成  2-未完成  3-我发布的  4-ta发布的  5-我收藏的
  // sort 0-时间排序  1-积分排序
  // openid相等的为我发布的 3-我发布的
  // openid不相等的为ta发布的  1-已完成  2-未完成  4-ta发布的  5-我收藏的
  // 我发布一个新任务 存 openid 2-未完成
  // filterMission() {
  //   let missionList = []
  //   if (this.data.search != "") {
  //     for (let i in this.data.allMissions) {
  //       if (this.data.allMissions[i].title.match(this.data.search) != null) {
  //         missionList.push(this.data.allMissions[i])
  //       }
  //     }
  //   } else {
  //     missionList = this.data.allMissions
  //   }

  //   this.setData({
  //     unfinishedMissions: missionList.filter(item => item.available === true),
  //     finishedMissions: missionList.filter(item => item.available === false),
  //   })
  // },


  //完成任务
  async finishMission(element) {
    //根据序号获得触发切换事件的待办
    const missionIndex = element.currentTarget.dataset.index
    const mission = this.data.unfinishedMissions[missionIndex]

    await wx.cloud.callFunction({ name: 'getOpenId' }).then(async openid => {
      if (mission._openid != openid.result) {
        //完成对方任务，奖金打入对方账号
        await wx.cloud.callFunction({ name: 'editAvailable', data: { _id: mission._id, value: false, list: getApp().globalData.collectionMissionList } })
        await wx.cloud.callFunction({ name: 'editCredit', data: { _openid: mission._openid, value: mission.credit, list: getApp().globalData.collectionUserList } })

        //触发显示更新
        mission.available = false
        this.filterMission()

        //显示提示
        wx.showToast({
          title: '任务完成',
          icon: 'success',
          duration: 2000
        })

      } else {
        wx.showToast({
          title: '不能完成自己的任务',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
})