Page({
  data: {
    msg: 'hell world',
    hideMsg: false,
  },
  onLoad() {
    console.log('onLoad');
  },
  hide() {
    this.setData({
      hideMsg: true,
    });
  },
});
