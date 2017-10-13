// pages/friends/friends.js
var sign = wx.getStorageSync('sign');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendList : [],
    active : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: "https://shop.playonwechat.com/api/friend-list?sign=" + sign + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log('res:',res)
          var friendList = res.data.data.friendList;

          that.setData({
             friendList: friendList
          })
          wx.hideLoading()
        }
    })
  },
  // 切换
  tapKeyWorld: function (e) {
      wx.showLoading({
        title: '加载中',
      })
      var that = this;
      var order = e.currentTarget.dataset.order;
      var active = e.currentTarget.dataset.active;
      console.log(order);
      this.setData({
        order: order,
        active: active
      })
      wx.request({
        url: "https://shop.playonwechat.com/api/friend-list?sign=" + sign + '&operator_id=' + app.data.kid,
        data:{
          order: order
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          //console.log('res:', res)
          var friendList = res.data.data.friendList;

          that.setData({
            friendList: friendList
          })
          wx.hideLoading()
        }
      })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})