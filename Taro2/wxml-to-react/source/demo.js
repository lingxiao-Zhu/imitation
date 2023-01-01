import { showToast } from './utils';

Page({
  data: {
    msg: 'hell world',
    hideMsg: false,
  },
  onReady() {
    showToast();
  },
  hide() {
    this.setData({
      hideMsg: true,
    });
  },
});
