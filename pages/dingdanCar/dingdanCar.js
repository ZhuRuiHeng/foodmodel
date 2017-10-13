// pages/dingdanInform/dingdanInform.js
//支付
const paymentUrl = require('../../config').paymentUrl;
var app = getApp();
var sign = wx.getStorageSync('sign');
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    userMes : ''
  },
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
      console.log(options);
      var that = this;
      //this.nextAddress();
      that.setData({
        totalPrice: options.totalPrice
      })
  },
  
  onShow: function () {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var dizhi = wx.getStorageSync("dizhi");
    var _gouwu = wx.getStorageSync("gouwu");
    console.log("dizhi",dizhi);
    console.log('_gouwu',_gouwu);
    if (dizhi != undefined) {
      that.setData({
        dizhi: dizhi,
        gouwu:_gouwu
      })
     ///////////////
      var gouwu = that.data.gouwu;
      //wx.clearStorage("gouwu");
      console.log('old:', gouwu.length);
      var detailall = "";
      var attributeAll = "";

      for (i = gouwu.length - 1; i > 0; i--) {
        if (gouwu[i] == null) {
          console.log('1111111111',gouwu);
          gouwu.splice(i, 1);
        }
      }
      that.setData({
        gouwu: gouwu
      })
      console.log('new:',that.data.gouwu.length);
       var gouwu = that.data.gouwu;
       console.log('gouwu:', gouwu);
      for (var i = 0; i < gouwu.length; i++) {
        console.log('gouwu[i].gid:', i, gouwu[i].detail, gouwu[i].gid);
        if (gouwu[i] == null){
          gouwu.splice(i, 1);
        }
        if (gouwu[i].detail == ''){
          gouwu[i].detail = 0;
        }   
        detailall += gouwu[i].gid + '-' + gouwu[i].detail + '-' + gouwu[i].number + ';';       
      }
      
      // 截取最后一位字符
      detailall = detailall.substr(0, detailall.length - 1);
      console.log("detailall", detailall);
      that.setData({
        detailall: detailall,
        gouwu:gouwu
      })
     /////////////////
    } else {
      console.log("请选择地址")
    }
  },
  //地址
  nextAddress:function(){
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          that.setData({
              dizhi:res
          })
          wx.setStorageSync('dizhi', res);
          console.log(res);
      },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // switch
  listenerSwitch: function (e) {
     console.log('switch类型开关当前状态-----', e.detail.value);
  },
  //input
  userMesInput: function (e) {
    var that = this;
    
    var userMes = that.data.userMes;
    that.setData({
      userMes: e.detail.value
    })
    console.log(userMes);
  },

  //提交订单
  formSubmit: function (e) {
    var that = this;
    var dizhi = that.data.dizhi;

    if (dizhi.length == 0) {
      // wx.showToast({
      //   title: '请选择收货地址',
      //   image: '../images/false.png'
      // });
      that.showZanToast('请选择收货地址');
    } else {
      wx.request({
        url: 'https://shop.playonwechat.com/api/create-order?sign=' + sign + '&operator_id=' + app.data.kid,
        data: {
          form_id: e.detail.formId,
          receiver: that.data.dizhi.userName,
          message: that.data.userMes,//留言
          receiver_address: that.data.dizhi.provinceName + that.data.dizhi.cityName + that.data.dizhi.countyName + that.data.dizhi.detailInfo,
          receiver_phone: that.data.dizhi.telNumber,
          detail: that.data.detailall
        },
        //detail:"gid -   attribute   - number"
        //detail:" 1  -  1:2,2:4,3:6  - 1"
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          // success
          console.log(res);
          var status = res.data.status;
          if (status == 1) {
            // 调用支付
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              'success': function (res) {
                setTimeout(function () {
                  // 支付成功跳转
                  wx.navigateTo({
                    url: '../dingdan/dingdan?status='
                  })
                }, 300)
              },
              'fail': function (res) {
              }
            })
            // 重置属性
            that.setData({
              attr: "",//属性
              types: "", //类型
              userMes: '',//留言信息
              num: '', //数量
              detail: ''
            })

          } else {
            that.showZanToast('创建订单失败');
          }
        },
        fail: function (res) {
          // fail
          console.log(res)
        },
        complete: function () {
          // complete
        }
      })
    }
  },
  //支付
  requestPayment: function () {
    var self = this
    
    self.setData({
      loading: true
    })
    // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
    // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
    app.getUserOpenId(function (err, openid) {
      if (!err) {
        wx.request({
          url: paymentUrl,
          data: {
            openid
          },
          method: 'POST',
          success: function (res) {
            console.log('unified order success, response is:', res)
            var payargs = res.data.payargs
            wx.requestPayment({
              timeStamp: payargs.timeStamp,
              nonceStr: payargs.nonceStr,
              package: payargs.package,
              signType: payargs.signType,
              paySign: payargs.paySign,
              'success': function (res) {
                setTimeout(function () {
                  // 支付成功跳转
                  wx.navigateTo({
                    url: '../dingdan/dingdan?status='
                  })
                }, 300)
              },
              'fail': function (res) {
              }
            })

            self.setData({
              loading: false
            })
          }
        })
      } else {
        console.log('err:', err)
        self.setData({
          loading: false
        })
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
}))
