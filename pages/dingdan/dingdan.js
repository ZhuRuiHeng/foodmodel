// pages/dingdan/dingdan.js
//支付
const paymentUrl = require('../../config').paymentUrl;
var app = getApp();
var main_content = []; 
var Zan = require('../../dist/index');
var sign = wx.getStorageSync('sign');
Page(Object.assign({}, Zan.Toast, {
  /**
   * 页面的初始数据
   */
  data: {
      status: "",
      navList:[
        {
          word: "全部",
          status:""
        },
        {
          word: " 待付款",
          status: "payment"
        },
        {
          word: " 待发货",
          status: "deliver"
        },
        {
          word: "待收货",
          status: "receipt"
        },
        {
          word: "已完成",
          status: "finish"
        }
      ],
      page: 1,  //分页
      oid : ''
 },
  

onLoad: function (options) {
  var that = this;
  var nowTime = Date.parse(new Date());
 
  var status = options.status;
  console.log(status);
  that.setData({
    status:status,
    nowTime: nowTime/1000
  })
  console.log('nowTime:', that.datanowTime);
},

// 加载

onShow: function () {
   var sign = wx.getStorageSync('sign');
  var that = this;//在请求数据时setData使用
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  })
  
  console.log("cate_id", that.data.cate_id);
  wx.request({
    url: 'https://shop.playonwechat.com/api/order-list?sign=' + sign + '&operator_id=' + app.data.kid,
    data: {
      status: that.data.status
    },
    header: {
      'content-type': 'application/json'
    },
    method: "GET",
    success: function (res) {
      console.log("订单列表", res);
      // 获取用户名称及发表时间
      var newlists = [];
      var orderList = res.data.data.orderList;
      console.log("orderList", res.data.data.orderList);
      that.setData({
        main_content: orderList,
        len: orderList.length
      })
      wx.hideLoading()
    }
  });
}, 
// 下拉分页
onReachBottom: function () {
  wx.showNavigationBarLoading() //在标题栏中显示加载
  console.log('下拉分页');
  var that = this;
  var oldOrderList = that.data.main_content;
  console.log("oldOrderList:" + oldOrderList);
  var orderList = [];
  var oldPage = that.data.page;
  var reqPage = oldPage + 1;
  console.log('reqPage:', reqPage);
  wx.request({
    url: "https://shop.playonwechat.com/api/order-list?sign=" + sign + '&operator_id=' + app.data.kid,
    data: {
      page: reqPage,
      status: that.data.status
    },
    header: {
      'content-type': 'application/json'
    },
    method: "GET",
    success: function (res) {
      console.log('新res', res);
      var orderList = res.data.data.orderList;
      if (res.data.data.length == 0) return;
      var newContent = oldOrderList.concat(orderList);
      that.setData({
        main_content: newContent,
        page: reqPage
      });
      //console.log("newContent:" + that.data.main_content)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  });
},
// 切换
tapKeyWorld: function (e) {
  wx.showLoading({
    title: '加载中',
  })

  var that = this;
  var word = e.currentTarget.dataset.status;
  //console.log(word);
  
  this.setData({
    status: word
  })
  setTimeout(function () {
    wx.request({
      url: "https://shop.playonwechat.com/api/order-list?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        status: that.data.status
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        // 此处清空全局的数据
       // console.log("数据", res);
        var main_content = [];
        var orderList = res.data.data.orderList;
        that.setData({
          main_content : orderList,
              len : orderList.length
        })
        wx.hideLoading()
      }
    })
  })
},
pintuan: function (event) {
  //console.log(event);
    var that = this;
    var gbid = event.currentTarget.dataset.gbid;
    var gid = event.currentTarget.dataset.gid;
    
    //console.log(gbid);
   // console.log('222',gid);
    that.setData({
      gbid: event.currentTarget.dataset.gbid,
      gid: event.currentTarget.dataset.gid
    })
    wx.navigateTo({
      url: '../pintuanxiangqing/pintuanxiangqing?gbid=' + that.data.gbid + '&gid=' + that.data.gid
    })   
},
  //取消订单
shouhuo: function (event) {
    var that = this;
    var id = event.currentTarget.id;
    that.setData({
      id: event.target.id
    })
   wx.showModal({
      title: '提示',
      content: '请您收到货后点击“确认收货”，否则钱货两空！',
        cancelText:'取消', 
        confirmText: '确认收货',
        success: function (res) {
          //console.log(res);
            if (res.confirm) {
                wx.request({
                  url: "https://shop.playonwechat.com/api/user-confirm-receipt?sign=" + sign + '&operator_id=' + app.data.kid,
                  data: {
                    oid: that.data.id
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  method: "GET",
                  success: function (res) {
                    // 此处清空全局的数据
                    var status = res.data.data.res;
                    if (status == 1){
                      that.showZanToast('确认收货成功');
                    }else{
                      that.showZanToast('确认收货失败');
                    }
                  }
                })
          } else if (res.cancel) {
              that.showZanToast('您取消了确认收货');
          }
        }
    })
  },
}))
