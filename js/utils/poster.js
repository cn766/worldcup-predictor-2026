// 分享海报生成工具
const Poster = {
  // 使用Canvas绘制海报
  generate(championTeam) {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 海报尺寸：750 x 1334 (2x分辨率，实际显示375x667)
        const W = 750;
        const H = 1334;
        canvas.width = W;
        canvas.height = H;

        // 背景渐变
        const gradient = ctx.createLinearGradient(0, 0, 0, H);
        gradient.addColorStop(0, '#1a1040');
        gradient.addColorStop(0.5, '#0d1638');
        gradient.addColorStop(1, '#0a0e27');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // 装饰光晕
        const glow = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.6);
        glow.addColorStop(0, 'rgba(255,215,0,0.06)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);

        // 标题
        ctx.fillStyle = '#8890b5';
        ctx.font = 'bold 28px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆 2026 世界杯 · 我的冠军预测', W / 2, 100);

        // 国旗（大号emoji需要特殊处理）
        ctx.font = '120px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(championTeam.flag || '🏆', W / 2, 300);

        // 冠军名（金色渐变文字）
        const nameGradient = ctx.createLinearGradient(0, 380, 0, 460);
        nameGradient.addColorStop(0, '#ffd700');
        nameGradient.addColorStop(1, '#ff8c00');
        ctx.fillStyle = nameGradient;
        ctx.font = 'bold 64px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(championTeam.name || '', W / 2, 460);

        // 副标题
        ctx.fillStyle = '#8890b5';
        ctx.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('48支球队，104场比赛，我的选择是' + (championTeam.name || ''), W / 2, 520);
        ctx.fillText('你也来预测你的冠军 →', W / 2, 560);

        // 装饰线
        ctx.strokeStyle = 'rgba(255,107,53,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(W * 0.2, 620);
        ctx.lineTo(W * 0.8, 620);
        ctx.stroke();

        // 预测看点
        ctx.fillStyle = '#e8e8f0';
        ctx.font = '24px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';

        // 显示小组预测摘要
        let y = 680;
        const groups = getGroupKeys();
        const previewGroups = groups.slice(0, 6);

        ctx.fillStyle = '#8890b5';
        ctx.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.fillText('小组出线预测', W / 2, y);
        y += 50;

        previewGroups.forEach(g => {
          const first = getTeam(g, 0);
          const second = getTeam(g, 1);
          if (first && second) {
            ctx.fillStyle = '#e8e8f0';
            ctx.font = '20px "PingFang SC", "Microsoft YaHei", sans-serif';
            ctx.fillText(`${g}组: ${first.flag} ${first.name} / ${second.flag} ${second.name}`, W / 2, y);
            y += 40;
          }
        });

        // 底部品牌区域
        const footerY = H - 120;
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, footerY, W, 120);

        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '18px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('来自 世界杯预测器', W / 2, footerY + 40);
        ctx.fillText('扫码体验，选出你的冠军', W / 2, footerY + 72);

        // 导出为data URL
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        reject(e);
      }
    });
  },

  // 使用html2canvas作为备选方案（需要html2canvas库）
  generateFromElement(element) {
    return new Promise((resolve, reject) => {
      if (typeof html2canvas === 'undefined') {
        reject(new Error('html2canvas 未加载'));
        return;
      }
      html2canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#0a0e27'
      }).then(canvas => {
        resolve(canvas.toDataURL('image/png'));
      }).catch(reject);
    });
  },

  // 下载图片
  download(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename || 'worldcup-prediction.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // 复制到剪贴板（仅支持PNG blob）
  async copyToClipboard(dataUrl) {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      return true;
    } catch (e) {
      return false;
    }
  }
};
