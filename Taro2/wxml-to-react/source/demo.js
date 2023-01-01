import { showToast } from './utils';

Page({
  data: {
    msg: 'hell world',
    hideMsg: false,
  },
  onReady() {
    showToast(this.data.msg);
  },
  hide() {
    this.setData({
      hideMsg: true,
    });
  },
});
