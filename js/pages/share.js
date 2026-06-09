// 分享页面
const SharePage = {
  posterDataUrl: null,

  render() {
    const container = document.getElementById('screen-share');
    const champ = State.champion ? resolveTeam(State.champion) : null;
    if (!champ) return;

    container.innerHTML = `
      <h2 style="text-align:center;font-size:16px;margin:12px 0;">${i18n.shareTitle}</h2>
      <div class="poster-preview" id="poster-content">
        <div class="poster-title">${i18n.sharePosterTitle}</div>
        <div class="poster-champion">${champ.flag}</div>
        <div class="poster-name">${champ.name}</div>
        <div class="poster-subtitle">${i18n.sharePosterSubtitle}${champ.name}！</div>
        <div class="poster-cta">${i18n.sharePosterCTA}</div>
        <div class="poster-watermark">${i18n.shareWatermark}</div>
      </div>
      <div class="share-actions">
        <button class="share-btn" onclick="SharePage.doShare('wechat')">
          <span class="share-icon">💬</span>${i18n.shareWechat}
        </button>
        <button class="share-btn" onclick="SharePage.doShare('moments')">
          <span class="share-icon">🟢</span>${i18n.shareMoments}
        </button>
        <button class="share-btn" onclick="SharePage.doShare('save')">
          <span class="share-icon">💾</span>${i18n.shareSave}
        </button>
        <button class="share-btn" onclick="SharePage.doShare('link')">
          <span class="share-icon">🔗</span>${i18n.shareLink}
        </button>
      </div>
      <button class="btn btn-outline" onclick="App.showResult()" style="margin-top:16px;">← 返回</button>
    `;

    // 异步生成真正的海报
    this.generatePoster(champ);
  },

  async generatePoster(champ) {
    try {
      const dataUrl = await Poster.generate(champ);
      this.posterDataUrl = dataUrl;
    } catch (e) {
      console.warn('海报生成失败，使用HTML预览:', e.message);
    }
  },

  doShare(type) {
    Analytics.share(type);
    let msg = '';
    switch (type) {
      case 'wechat': msg = i18n.shareWechatMsg; break;
      case 'moments': msg = i18n.shareMomentsMsg; break;
      case 'save':
        if (this.posterDataUrl) {
          Poster.download(this.posterDataUrl, 'worldcup-prediction.png');
          msg = i18n.shareSaveMsg;
        } else {
          msg = '海报生成中，请稍后再试';
        }
        break;
      case 'link':
        const url = window.location.href;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            App.showToast(i18n.shareLinkMsg);
          }).catch(() => {
            App.showToast('复制失败，请手动复制链接');
          });
        } else {
          App.showToast('请手动复制浏览器地址栏链接');
        }
        return;
    }
    App.showToast(msg);
  }
};
