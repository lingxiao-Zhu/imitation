class PopUpInfo extends HTMLElement {
  constructor() {
    super();
    // 创建一个shadow root
    const shadow = this.attachShadow({ mode: 'open' });
    // 创建一个span
    var wrapper = document.createElement('span');
    wrapper.setAttribute('class', 'wrapper');

    var icon = document.createElement('span');
    icon.setAttribute('class', 'icon');
    icon.setAttribute('tabindex', 0);

    var info = document.createElement('span');
    info.setAttribute('class', 'info');

    // 获取text属性上的内容，并添加到一个span标签内
    var text = this.getAttribute('text');
    info.textContent = text;

    // 插入 icon
    let imgUrl;
    if (this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img');
    } else {
      imgUrl = 'img/default.png';
    }
    var img = document.createElement('img');
    img.src = imgUrl;
    icon.appendChild(img);
  }
}
