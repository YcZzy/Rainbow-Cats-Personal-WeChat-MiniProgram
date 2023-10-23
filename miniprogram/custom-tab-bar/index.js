Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    "list": [{
      "pagePath": "/pages/MainPage/index",
      "icon": "cuIcon-homefill",
      "text": "首页"
    }, {
      "pagePath": "/pages/Mission/index",
      "icon": "cuIcon-similar",
      "text": "任务"
    }, {
      "pagePath": "/pages/Publish/index",
      "icon": "cuIcon-homefill",
      "text": "发布"
    }, {
      "pagePath": "/pages/Market/index",

      "icon": "cuIcon-cart",
      "text": "商城"
    }, {
      "pagePath": "/pages/PeopleCenter/index",

      "icon": "cuIcon-my",
      "text": "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log(url)
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})