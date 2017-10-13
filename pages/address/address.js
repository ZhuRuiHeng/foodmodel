// pages/address/address.js
var app = getApp();
var sign = wx.getStorageSync('sign');
Page({
  data: {
    items: [
      { value: 'USA', name: '美国', tel: '13287495532', address: '深圳龙岗小镇45栋一楼超能者', checked: 'true' },
      { value: 'CHN', name: '中国', tel: '13287495532', address: '深圳龙岗小镇45栋一楼超能者' },
      { value: 'BRA', name: '巴西', tel: '13287495532', address: '深圳龙岗小镇45栋一楼超能者' },
      { value: 'JPN', name: '日本', tel: '13287495532', address: '深圳龙岗小镇45栋一楼超能者'},
      { value: 'ENG', name: '英国', tel: '13287495532', address: '深圳龙岗小镇45栋一楼超能者'},
      { value: 'FRA', name: '法国', tel: '13287495532', address: '深圳龙岗小镇45栋一楼超能者'},
    ],
    dizhi:''
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    var items = this.data.items;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }

    this.setData({
      items: items
    });
  },
  bianji:function(){
      console.log("222");
      wx.navigateTo({
        url: '../use/use'
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var dizhi = wx.getStorageSync("dizhi");
    console.log('dizhi1:', dizhi);
    that.setData({
      dizhi: dizhi
    })
    console.log("dizhi:", that.data.dizhi);
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