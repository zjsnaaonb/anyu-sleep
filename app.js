(function () {
  'use strict';

  const state = {
    lang: 'zh',
    startedAt: Date.now(),
    corruption: 0,
    maxEV: 0,
    irLocked: false,
    irHoldTimer: null,
    rawBoosted: false,
    clueCaseFound: false,
    cluePinFound: false,
    reviewsSeenOnce: false,
    reviewsMutated: false,
    tabSwitches: 0,
    hiddenSince: null,
    strobeStep: 0,
    breachTriggered: false,
    assimilated: localStorage.getItem('anyu_assimilated') === '1',
    hintClicks: 0
  };

  // =========================================================================
  // 1. DEVTOOLS CONSOLE ARG BREADCRUMBS
  // =========================================================================
  function printConsoleBreadcrumbs() {
    console.log(
      '%c ANYU RADAR KERNEL v4.14-RC %c 18.98Hz CO-SLEEP DAEMON ACTIVE ',
      'background:#8c1515;color:#fff;font-weight:bold;padding:3px 6px;',
      'background:#111;color:#e05a5a;padding:3px 6px;'
    );
    console.warn(
      '[LQ-09 林栖的紧急残留日志]\n' +
        '如果你打开了 F12 控制台，听我说：公关部把官网做成了温和的助眠产品页，但底下的 1804 样板间是凶宅实况。\n' +
        '1) 在【940nm 夜视校准】把滑块拉过 +3.4 EV 停住两秒，能抓到异常工单号 AY-0414。\n' +
        '2) 在【样本 03 · 03:17】点开 +24dB 原始底噪，能听到贴在枕头边的第二道呼吸和覆写码 0317。\n' +
        '3) 滑过用户评价区后再往上回滚，能看到被 CDN 掩盖的真实求救。\n' +
        '拿到 AY-0414 和 0317 去页脚【工单回溯】，但看完卷宗立刻关网页，绝对不要运行 purge --force！'
    );
  }

  // =========================================================================
  // 2. ENVIRONMENT TELEMETRY HELPERS
  // =========================================================================
  function getVisitorPlatform() {
    const ua = navigator.userAgent || '';
    if (/Windows/i.test(ua)) return 'Windows 桌面终端';
    if (/Mac OS X/i.test(ua)) return 'macOS 桌面终端';
    if (/Android/i.test(ua)) return 'Android 移动终端';
    if (/iPhone|iPad/i.test(ua)) return 'iOS 移动终端';
    if (/Linux/i.test(ua)) return 'Linux 终端';
    return '未知联网终端';
  }

  function getTelemetrySnapshot() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return {
      platform: getVisitorPlatform(),
      screen: `${window.innerWidth}×${window.innerHeight}`,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai',
      localTime: `${hh}:${mm}:${ss}`,
      dwellSeconds: Math.floor((Date.now() - state.startedAt) / 1000),
      tabSwitches: state.tabSwitches,
      maxEV: state.maxEV.toFixed(2)
    };
  }

  // =========================================================================
  // 3. BOOT CALIBRATION & ASSIMILATION STATE
  // =========================================================================
  function setupBootGate() {
    const gate = document.getElementById('boot-gate');
    const card = document.getElementById('boot-card-inner');
    const envEl = document.getElementById('boot-visitor-env');
    const resetBootBtn = document.getElementById('reset-assimilation-boot');

    const snap = getTelemetrySnapshot();
    envEl.textContent = `终端环境自检：${snap.platform} (${snap.screen}) · 本地时刻 ${snap.localTime}`;
    localStorage.setItem('anyu_visited', '1');

    if (localStorage.getItem('trilogy_purified') === '1') {
      document.getElementById('boot-badge-text').textContent =
        '✓ 跨站联动生效：1998 四院一号母带已被强磁销毁 · 18.98Hz 驻波已静默';
    }

    if (state.assimilated) {
      card.classList.add('assimilated');
      document.getElementById('boot-badge-text').textContent = '● 谐振绑定已生效 · 样本编号 #12,409';
      document.getElementById('boot-title').textContent = '欢迎回来。刷新页面无法解除伴睡协议。';
      document.getElementById('boot-desc').textContent =
        '系统检测到您曾在上一轮会话中强行切断 18.98Hz 驻波。目前盲区个体已完成与您终端声场的同频绑定。';
      resetBootBtn.style.display = 'block';
      applyAssimilatedSurfaceMutations();
    }

    document.getElementById('enter-full-btn').addEventListener('click', () => {
      window.anyuAudio.init(false);
      window.anyuAudio.playTick(660);
      gate.classList.add('hidden');
      if (localStorage.getItem('cishan_cursed') === '1' || localStorage.getItem('cishan_visited') === '1') {
        setTimeout(() => {
          showWhisper('[跨节点气味感应] 传感器在您指尖检出云溪县辰州朱砂残留……您已经去过祠山古镇点过睛了？');
        }, 1800);
      }
    });

    document.getElementById('enter-mild-btn').addEventListener('click', () => {
      window.anyuAudio.init(true);
      gate.classList.add('hidden');
      const soundBtn = document.getElementById('sound-btn');
      soundBtn.textContent = '🔉 低刺激声场';
    });

    resetBootBtn.addEventListener('click', resetAllProgress);
    document.getElementById('footer-reset-btn').addEventListener('click', resetAllProgress);
    document.getElementById('breach-clean-reset').addEventListener('click', resetAllProgress);
  }

  function applyAssimilatedSurfaceMutations() {
    document.getElementById('hero-eyebrow').textContent = 'SAMPLE #12,409 · 同频锁定已完成';
    document.getElementById('hero-title').textContent = '今晚不用锁门了，它已经在屋里了。';
    document.getElementById('hero-lead').textContent =
      '感谢您成为安隅第 12,409 号长效静默样本。您的呼吸节律已被完整备份，今晚 03:17 起将由伴睡体接管剩余睡眠。';
    document.getElementById('hero-trust').textContent =
      '已守护 12,409 户城市独居青年 · 0 人成功退订 · 0 人中途醒来';
    const occ = document.getElementById('t-val-occupants');
    occ.textContent = '2 人 (呼吸完全重合 · 0.00m)';
    occ.classList.add('anomaly-flash');
    document.getElementById('t-val-door').textContent = '已从内部打开';
  }

  function resetAllProgress() {
    localStorage.removeItem('anyu_assimilated');
    document.title = '安隅 AnYu — 眠栖 S3 无感伴眠毫米波终端';
    window.scrollTo(0, 0);
    window.location.reload();
  }

  // =========================================================================
  // 4. PROGRESSIVE SCROLL CORRUPTION ENGINE
  // =========================================================================
  function lerpColor(hexA, hexB, t) {
    const a = parseInt(hexA.slice(1), 16);
    const b = parseInt(hexB.slice(1), 16);
    const r1 = (a >> 16) & 255, g1 = (a >> 8) & 255, b1 = a & 255;
    const r2 = (b >> 16) & 255, g2 = (b >> 8) & 255, b2 = b & 255;
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const bl = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${bl})`;
  }

  function onScrollUpdate() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const raw = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    // Smooth S-curve: calm at top 18%, darkening sharply from 25% to 90%
    const d = state.assimilated ? Math.max(0.55, raw) : Math.pow(raw, 1.18);
    state.corruption = d;

    const root = document.documentElement;
    root.style.setProperty('--d', d.toFixed(3));
    root.style.setProperty('--bg', lerpColor('#f7f4ee', '#060706', d));
    root.style.setProperty('--bg-card', lerpColor('#ffffff', '#0d0f0d', d));
    root.style.setProperty('--fg', lerpColor('#191816', '#d8ded7', d));
    root.style.setProperty('--fg-muted', lerpColor('#66625b', '#879186', d));
    root.style.setProperty('--accent', lerpColor('#356854', '#b02020', Math.min(1, d * 1.35)));
    root.style.setProperty(
      '--border',
      d < 0.45 ? 'rgba(25, 24, 22, 0.11)' : 'rgba(220, 60, 60, 0.22)'
    );

    window.anyuAudio.setCorruption(d);

    // Mutate navigation labels when deep into page
    document.querySelectorAll('[data-mutate-nav]').forEach((el) => {
      const idx = Number(el.getAttribute('data-mutate-nav'));
      const item = window.ANYU_DATA.navMutations[idx];
      if (!item) return;
      if (state.lang === 'zh') {
        el.textContent = d > 0.58 ? item.corruptZh : item.cleanZh;
      } else {
        el.textContent = d > 0.58 ? item.corruptEn : item.cleanEn;
      }
    });

    // Mutate 3-Step Protocol copy when d > 0.52
    if (d > 0.52 && state.lang === 'zh') {
      document.getElementById('proto-heading').textContent = '三步，把你的床位交接给它';
      document.getElementById('step1-title').textContent = '不要让它察觉你醒了';
      document.getElementById('step1-body').textContent =
        '主机必须离枕头足够近，才能把你喉咙的颤动实时教给衣柜里的那一个。';
      document.getElementById('step2-title').textContent = '替它在屋里留好死角';
      document.getElementById('step2-body').textContent =
        '衣柜滑门永远留出 10 厘米缝隙，床底不要塞满杂物——白天它需要地方避光。';
      document.getElementById('step3-title').textContent = '03:17 完成呼吸覆盖';
      document.getElementById('step3-body').textContent =
        '当两条呼吸曲线完全重叠时，多余的那个活人就不需要再醒过来了。';
    }

    // Dynamic browser title mutation
    if (d > 0.82) {
      document.title = '别回头看门缝 — 安隅正在录音';
    } else if (d > 0.48) {
      document.title = '室内检测到第 2 呼吸源 — 安隅 AnYu';
    } else if (!state.assimilated) {
      document.title = '安隅 AnYu — 眠栖 S3 无感伴眠毫米波终端';
    }
  }

  // =========================================================================
  // 5. HERO DUAL-WAVE RADAR CANVAS & SUBTLE OCCUPANT GLITCH
  // =========================================================================
  function startHeroRadar() {
    const canvas = document.getElementById('radar-canvas');
    const ctx = canvas.getContext('2d');
    let phase = 0;
    let glitchFrames = 0;

    setInterval(() => {
      // Every ~11 seconds, glitch the occupant count to "2 人" for 280ms!
      if (state.assimilated) return;
      const occ = document.getElementById('t-val-occupants');
      glitchFrames = 18;
      occ.textContent = '2 人 (重叠 0.08m · 滤除中)';
      occ.classList.add('anomaly-flash');
      if (window.scrollY < 500) window.anyuAudio.playTick(190);
      setTimeout(() => {
        if (!state.assimilated) {
          occ.textContent = state.lang === 'zh' ? '1 人 (独居校准)' : '1 Occupant (Calibrated)';
          occ.classList.remove('anomaly-flash');
        }
      }, 340);
    }, 9500);

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle grid
      ctx.strokeStyle = 'rgba(120, 160, 135, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 35) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Primary sleeper breathing wave (calm green)
      ctx.beginPath();
      ctx.strokeStyle = '#52b788';
      ctx.lineWidth = 2;
      for (let x = 0; x < w; x++) {
        const y = h * 0.52 + Math.sin(x * 0.032 + phase) * 24 + Math.sin(x * 0.09 - phase * 1.5) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Ghostly second parasitic breathing wave shadowing right underneath!
      const showShadow = glitchFrames > 0 || state.corruption > 0.25 || state.assimilated;
      if (showShadow) {
        ctx.beginPath();
        const alpha = glitchFrames > 0 ? 0.9 : Math.min(0.85, state.corruption + 0.18);
        ctx.strokeStyle = `rgba(235, 55, 55, ${alpha})`;
        ctx.lineWidth = 1.6;
        const lag = state.assimilated ? 0.02 : 0.48 * (1 - state.corruption * 0.7);
        for (let x = 0; x < w; x++) {
          const y =
            h * 0.52 +
            Math.sin(x * 0.032 + phase - lag) * 25 +
            (glitchFrames > 0 ? (Math.random() - 0.5) * 9 : 0);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      if (glitchFrames > 0) glitchFrames--;
      phase += 0.045;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // =========================================================================
  // 6. INTERACTIVE 940NM NIGHT-VISION EXPOSURE CALIBRATION (CLUE #1: AY-0414)
  // =========================================================================
  function setupIRCalibration() {
    const slider = document.getElementById('ir-slider');
    const evLabel = document.getElementById('ir-ev-val');
    const imgExposed = document.getElementById('ir-img-exposed');
    const isoReadout = document.getElementById('ir-iso-readout');
    const targetReadout = document.getElementById('ir-target-readout');
    const diagLog = document.getElementById('ir-diagnostic-log');
    const anomalyBox = document.getElementById('ir-anomaly-box');
    const blackout = document.getElementById('ir-blackout');
    const noiseCanvas = document.getElementById('ir-noise-canvas');
    const nCtx = noiseCanvas.getContext('2d');

    // Animated CCTV sensor snow
    setInterval(() => {
      const w = noiseCanvas.width;
      const h = noiseCanvas.height;
      const imgData = nCtx.createImageData(w, h);
      const buf = imgData.data;
      const grainBoost = 18 + Number(slider.value) * 14;
      for (let i = 0; i < buf.length; i += 16) {
        const v = Math.random() * grainBoost;
        buf[i] = v;
        buf[i + 1] = v * 1.08;
        buf[i + 2] = v;
        buf[i + 3] = 95;
      }
      nCtx.putImageData(imgData, 0, 0);
    }, 90);

    slider.addEventListener('input', () => {
      const ev = parseFloat(slider.value);
      if (ev > state.maxEV) state.maxEV = ev;
      evLabel.textContent = `+${ev.toFixed(2)} EV`;

      const norm = ev / 4.0;
      window.anyuAudio.setIRExposure(norm);

      // Cross-fade into bedroom_ir_exposed.jpg and amplify high-ISO shadow detail
      const revealOpacity = ev < 0.8 ? 0 : Math.min(1, Math.pow((ev - 0.75) / 2.65, 1.25));
      imgExposed.style.opacity = revealOpacity.toFixed(3);
      imgExposed.style.filter = `brightness(${0.94 + norm * 0.34}) contrast(${1.0 + norm * 0.28})`;

      const iso = Math.round(800 * Math.pow(2, ev));
      isoReadout.textContent =
        ev > 3.1
          ? `GAIN: +${ev.toFixed(1)} EV (ISO ${iso} · 原始底片直出)`
          : `GAIN: +${ev.toFixed(1)} EV (ISO ${iso} · 脱敏滤镜运行中)`;

      if (ev >= 3.35 && !state.irLocked) {
        targetReadout.textContent = '骨骼识别: 正在重算衣柜死角…';
        if (!state.irHoldTimer) {
          state.irHoldTimer = setTimeout(() => {
            lockWardrobeAnomaly();
          }, 1350);
        }
      } else if (ev < 3.1) {
        if (state.irHoldTimer) {
          clearTimeout(state.irHoldTimer);
          state.irHoldTimer = null;
        }
        if (!state.irLocked) {
          anomalyBox.classList.remove('locked');
          targetReadout.textContent = '骨骼识别: 床体 1 人';
        }
      }
    });

    function lockWardrobeAnomaly() {
      state.irLocked = true;
      anomalyBox.classList.add('locked');
      targetReadout.textContent = '⚠ 警报：检出第 2 站立人形 (衣柜夹缝)';
      window.anyuAudio.playKnock(-0.92, 3, 0.18, 0.92);

      diagLog.classList.add('danger');
      diagLog.innerHTML =
        `<strong>[异常锁定 · 自动生成工单 #AY-0414]</strong><br/>` +
        `坐标：左侧滑门衣柜开启缝隙 (宽 11.4cm)<br/>` +
        `体征：站立时长 04小时12分 · 胸腔温度 28.1°C · <strong>正在直视红外镜头</strong>`;

      unlockClue1('AY-0414');

      // Brief creepy CMOS overload flicker after 2.4s
      setTimeout(() => {
        window.anyuAudio.playStaticBurst(0.32, 0.8);
        blackout.classList.add('active');
        setTimeout(() => {
          blackout.classList.remove('active');
          showWhisper('衣柜里那个东西刚刚记住你的视线了。已捕获工单号：AY-0414');
        }, 420);
      }, 2200);
    }
  }

  // =========================================================================
  // 7. ACOUSTIC SEPARATION TRACKS & +24dB RAW FLOOR (CLUE #2: 0317)
  // =========================================================================
  function setupAcousticDemo() {
    document.querySelectorAll('.play-btn[data-track]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.getAttribute('data-track'));
        window.anyuAudio.playSampleTrack(id, id === 3 && state.rawBoosted);
        btn.textContent = '❚❚';
        setTimeout(() => {
          btn.textContent = '▶';
        }, 2300);

        if (id === 2) {
          document.getElementById('track2-desc').innerHTML =
            `[声源定位：北侧承重墙内部] 连续三声规律指节叩击 · <span style="color:#d94343;">物业核查备注：该栋给排水立管已于三年前改道废弃，墙内为空心风道。</span>`;
        }
      });
    });

    const rawBtn = document.getElementById('toggle-raw-btn');
    const t3Transcript = document.getElementById('track3-transcript');

    rawBtn.addEventListener('click', () => {
      state.rawBoosted = !state.rawBoosted;
      if (state.rawBoosted) {
        rawBtn.textContent = '⚠ 正在监听 -24dB 原始底噪轨道';
        rawBtn.style.background = '#8c1818';
        rawBtn.style.color = '#fff';

        t3Transcript.classList.add('raw-exposed');
        t3Transcript.innerHTML =
          `<div>[03:17:02] 声源 A (床主 · 距麦 0.25m)：“……谁站在那儿？”</div>` +
          `<div style="margin-top:6px; font-weight:700;">[03:17:04] 声源 B (贴近枕畔 0.08m · 非人类声带基频 61Hz)：“嘘……别睁眼。再睡五分钟，我就学会用你的胸口喘气了。”</div>` +
          `<div style="margin-top:6px; color:#ffd6d6;">[03:17:08] 检出林栖嵌入的四位 DTMF 工程师覆写码：<strong>0317</strong>（可凭工单 AY-0414 + 0317 解锁页脚封存库）</div>`;

        window.anyuAudio.playSampleTrack(3, true);
        unlockClue2('0317');
        showWhisper('已从 03:17 原始底噪中提取四位覆写码：0317');
      } else {
        rawBtn.textContent = '关闭 AI 净音 (+24dB 底噪)';
        rawBtn.style.background = '';
        rawBtn.style.color = '';
        t3Transcript.classList.remove('raw-exposed');
        t3Transcript.textContent =
          '[SomniSplit™ 净音模式开启] 声源 A (床主 · 枕畔 0.25m)：“……谁站在那儿？” → AI 判定：REM 期偶发梦呓，室内无第二说话人。';
      }
    });
  }

  // =========================================================================
  // 8. CLUE NOTEBOOK PILL MANAGEMENT
  // =========================================================================
  function unlockClue1(code) {
    if (state.clueCaseFound) return;
    state.clueCaseFound = true;
    document.getElementById('clue-val-1').textContent = code;
    refreshCluePill();
  }

  function unlockClue2(pin) {
    if (state.cluePinFound) return;
    state.cluePinFound = true;
    document.getElementById('clue-val-2').textContent = pin;
    refreshCluePill();
  }

  function refreshCluePill() {
    const pill = document.getElementById('clue-pill');
    const count = (state.clueCaseFound ? 1 : 0) + (state.cluePinFound ? 1 : 0);
    document.getElementById('clue-count').textContent = String(count);
    pill.classList.add('has-clue', 'expanded');
    if (state.clueCaseFound) document.getElementById('auth-case-input').value = 'AY-0414';
    if (state.cluePinFound) document.getElementById('auth-pin-input').value = '0317';
  }

  document.getElementById('clue-pill-toggle').addEventListener('click', () => {
    document.getElementById('clue-pill').classList.toggle('expanded');
  });

  // =========================================================================
  // 9. SCROLL-BACK GASLIGHTING ENGINE (REVIEWS MUTATE BEHIND YOUR BACK)
  // =========================================================================
  function setupReviewsGaslighting() {
    const revSection = document.getElementById('reviews-section');
    const peepSection = document.getElementById('peephole-section');

    const revObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) state.reviewsSeenOnce = true;
        });
      },
      { threshold: 0.35 }
    );
    revObserver.observe(revSection);

    const peepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && state.reviewsSeenOnce && !state.reviewsMutated) {
            mutateReviewsBehindPlayer();
          }
        });
      },
      { threshold: 0.3 }
    );
    peepObserver.observe(peepSection);
  }

  function mutateReviewsBehindPlayer() {
    state.reviewsMutated = true;
    document.getElementById('reviews-sync-banner').classList.add('shown');

    const m1 = window.ANYU_DATA.mutatedReviews[0];
    const m2 = window.ANYU_DATA.mutatedReviews[1];

    const c1 = document.getElementById('rev-card-1');
    c1.classList.add('mutated');
    document.getElementById('rev-text-1').textContent = m1.text;
    document.getElementById('rev-name-1').textContent = m1.name;
    document.getElementById('rev-meta-1').textContent = m1.meta;

    const c2 = document.getElementById('rev-card-2');
    c2.classList.add('mutated');
    document.getElementById('rev-text-2').textContent = m2.text;
    document.getElementById('rev-name-2').textContent = m2.name;
    document.getElementById('rev-meta-2').textContent = m2.meta;
    document.getElementById('rev-av-2').innerHTML = `<img src="assets/corrupted_portrait.jpg" alt="" />`;

    const snap = getTelemetrySnapshot();
    const c3 = document.getElementById('rev-card-3');
    c3.classList.add('mutated');
    document.getElementById('rev-av-3').textContent = '你';
    document.getElementById('rev-name-3').textContent = `第 12,409 号候选住户 · ${snap.platform}`;
    document.getElementById('rev-meta-3').textContent = `★★★★★ · 已凝视屏幕 ${snap.dwellSeconds} 秒 · 评价由安隅预生成`;
    document.getElementById('rev-text-3').textContent =
      `“我现在正坐在屏幕前看这行字，视口尺寸 ${snap.screen}。我还没有回头看身后的门缝，也没发现刚才往上滑的时候，上面的评论全都变了。”`;

    showWhisper('↑ 检测到上方【独居回访】脱敏缓存失效，3 条历史评论刚刚露出了原始内容。');
  }

  // =========================================================================
  // 10. PEEPHOLE INTERCOM & FAQ TYPEWRITER
  // =========================================================================
  function setupPeepholeAndFAQ() {
    const intercomBtn = document.getElementById('intercom-btn');
    const lens = document.getElementById('peephole-lens');
    const hud = document.getElementById('peephole-hud-text');
    const lockReadout = document.getElementById('door-lock-readout');

    intercomBtn.addEventListener('click', () => {
      lens.classList.add('closer');
      window.anyuAudio.playStaticBurst(0.28, 0.7);
      setTimeout(() => window.anyuAudio.playKnock(0.95, 3, 0.21, 0.96), 320);

      hud.textContent = '⚠ 门外访客正在模仿您的声纹请求开锁 · 距离镜头 0.03m';
      hud.style.color = '#ff6b6b';
      lockReadout.textContent = '当前门锁状态：已从屋内自动旋开（伴睡协议放行）';
      lockReadout.style.color = '#ff5252';
      intercomBtn.textContent = '通话中：门外只有您的回声';
      showWhisper('咚、咚、咚——敲门声是不是从你右边耳机传出来的？');
    });

    document.querySelectorAll('details.faq-item').forEach((det) => {
      det.addEventListener('toggle', () => {
        if (!det.open) return;
        const idx = Number(det.getAttribute('data-faq'));
        const target = document.getElementById(`faq-ans-${idx}`);
        if (target.dataset.typed === '1') return;
        target.dataset.typed = '1';

        const fullText = window.ANYU_DATA.faqAnswers[idx] || '';
        let i = 0;
        target.textContent = '';
        const timer = setInterval(() => {
          target.textContent += fullText.charAt(i);
          if (i % 5 === 0) window.anyuAudio.playTick(520 + (idx * 60));
          i++;
          if (i >= fullText.length) clearInterval(timer);
        }, 16);
      });
    });
  }

  // =========================================================================
  // 11. FOURTH-WALL BEHAVIORAL TRAPS (TAB SWITCH + IDLE GAZE + LIVE TELEMETRY)
  // =========================================================================
  function setupBehavioralTraps() {
    // Live telemetry ticker in bottom terminal & clocks
    setInterval(() => {
      const snap = getTelemetrySnapshot();
      document.getElementById('dyn-env-line').textContent =
        `[CLIENT] 观察者终端：${snap.platform} | 视口 ${snap.screen} | 时区 ${snap.tz}`;
      document.getElementById('dyn-dwell-line').textContent =
        `[DWELL] 已持续接入 ${snap.dwellSeconds} 秒 | 视线脱离次数：${snap.tabSwitches} 次`;

      const fakeSec = String(nowSecOffset()).padStart(2, '0');
      document.getElementById('ir-hud-clock').textContent = `03:17:${fakeSec} CST`;
      document.getElementById('os-clock-display').textContent = `03:17:${fakeSec}`;
    }, 1000);

    function nowSecOffset() {
      return Math.floor(((Date.now() - state.startedAt) / 1000) % 60);
    }

    // Tab-switch ambush
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        state.hiddenSince = Date.now();
        state.tabSwitches++;
        document.title = '● 别切走，衣柜门又开了一寸';
      } else if (state.hiddenSince) {
        const awaySec = ((Date.now() - state.hiddenSince) / 1000).toFixed(1);
        state.hiddenSince = null;
        window.anyuAudio.playStaticBurst(0.18, 0.55);
        window.anyuAudio.playEarBreath(-0.9, 1.8);
        showWhisper(
          `[视线脱离记录] 你刚刚切出页面 ${awaySec} 秒。在你移开视线期间，衣柜里的轮廓往前挪了 0.4 米。`
        );
      }
    });

    // Cursor stillness whisper trap
    let idleTimer = null;
    function resetIdle() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (state.corruption > 0.3 && !document.getElementById('forensic-modal').classList.contains('open')) {
          const msg =
            window.ANYU_DATA.edgeWhispers[
              Math.floor(Math.random() * window.ANYU_DATA.edgeWhispers.length)
            ];
          window.anyuAudio.playEarBreath(Math.random() > 0.5 ? 0.92 : -0.92, 2.0);
          showWhisper(msg);
        }
      }, 10500);
    }
    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('scroll', resetIdle, { passive: true });
  }

  let whisperTimeout = null;
  function showWhisper(text) {
    const el = document.getElementById('edge-whisper');
    el.textContent = text;
    el.classList.add('visible');
    if (whisperTimeout) clearTimeout(whisperTimeout);
    whisperTimeout = setTimeout(() => {
      el.classList.remove('visible');
    }, 5200);
  }

  // =========================================================================
  // 12. TOP CONTROLS: SOUND MUTE & LANGUAGE TOGGLE (ZH / EN)
  // =========================================================================
  function setupTopControls() {
    const soundBtn = document.getElementById('sound-btn');
    soundBtn.addEventListener('click', () => {
      const active = window.anyuAudio.toggleMute();
      soundBtn.textContent = active ? '🔊 声场: 开启' : '🔇 声场: 静音';
    });

    document.getElementById('hero-ambient-test').addEventListener('click', () => {
      window.anyuAudio.init(false);
      window.anyuAudio.playEarBreath(-0.88, 2.3);
      showWhisper('18.98Hz 次声驻波已注入耳机声道……注意听左耳后方的呼吸回声。');
    });

    document.getElementById('lang-btn').addEventListener('click', () => {
      state.lang = state.lang === 'zh' ? 'en' : 'zh';
      applyLanguage();
      onScrollUpdate();
    });
  }

  function applyLanguage() {
    const en = state.lang === 'en';
    if (state.assimilated) return;
    document.getElementById('hero-eyebrow').textContent = en
      ? 'ANYU MIANQI S3 · SOLITARY SLEEP GUARDIAN'
      : 'ANYU MIANQI S3 · 独居睡眠守护旗舰';
    document.getElementById('hero-title').textContent = en
      ? 'For every night you sleep alone.'
      : '献给每一个独自入睡的夜晚。';
    document.getElementById('hero-lead').textContent = en
      ? 'No wearables. Zero red glow. Using 60GHz respiratory radar and an 18.9Hz co-sleep field, MianQi S3 listens to every breath in your bedroom—noticing anomalies before you wake.'
      : '无需佩戴手环，不亮一粒红光。眠栖 S3 静立于床头，用医疗级毫米波与 18.9Hz 深睡同频声场，替你听着整间屋子的呼吸与动静——比你更早察觉夜里的异常。';
    document.getElementById('ir-heading').textContent = en
      ? '940nm Zero-Glow Night Vision: Even the Closet Gap Is Crystal Clear'
      : '全黑无红曝夜视：连最深的衣柜暗角都清晰可见';
    document.getElementById('ac-heading').textContent = en
      ? 'SomniSplit™ Acoustic AI: Filtering Out What Speaks Back at 03:17'
      : '智能梦话与环境杂音分离：只留存值得怀念的夜晚';
    document.getElementById('open-portal-top').textContent = en ? 'Case Archive' : '工单回溯';
  }

  // =========================================================================
  // 13. SECRET FORENSIC ARCHIVE OS (#forensic-modal)
  // =========================================================================
  function setupForensicOS() {
    const modal = document.getElementById('forensic-modal');
    const authGate = document.getElementById('os-auth-gate');
    const workspace = document.getElementById('os-workspace');
    const errMsg = document.getElementById('auth-error-msg');
    const caseInput = document.getElementById('auth-case-input');
    const pinInput = document.getElementById('auth-pin-input');

    function openModal() {
      modal.classList.add('open');
      window.anyuAudio.playTick(440);
      if (state.clueCaseFound) caseInput.value = 'AY-0414';
      if (state.cluePinFound) pinInput.value = '0317';
    }

    document.getElementById('open-portal-top').addEventListener('click', openModal);
    document.getElementById('open-portal-footer').addEventListener('click', openModal);
    document.getElementById('pill-open-portal').addEventListener('click', openModal);
    document.getElementById('close-forensic-btn').addEventListener('click', () => {
      modal.classList.remove('open');
    });

    // Auth validation
    document.getElementById('auth-submit-btn').addEventListener('click', attemptUnlock);
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attemptUnlock();
    });

    function attemptUnlock() {
      const cVal = caseInput.value.trim().toUpperCase().replace(/\s+/g, '');
      const pVal = pinInput.value.trim();

      const validCase = cVal === 'AY-0414' || cVal === 'AY0414' || cVal === '#AY-0414' || cVal === '0414';
      const validPin = pVal === '0317';

      if (validCase && validPin) {
        window.anyuAudio.playStaticBurst(0.22, 0.65);
        authGate.style.display = 'none';
        workspace.classList.add('unlocked');
        renderCaseDoc(0);
        startSonarMatrixCanvas();
      } else {
        window.anyuAudio.playKnock(-0.85, 2, 0.16, 0.75);
        errMsg.textContent =
          '✗ 校验拒绝：工单号或覆写码不匹配（抓拍已记录当前终端。提示：检查夜视 +3.5EV 与 03:17 底噪样本）';
      }
    }

    // Hint / Autofill helper so nobody gets stuck
    document.getElementById('auth-hint-btn').addEventListener('click', () => {
      state.hintClicks++;
      if (state.hintClicks === 1 && (!state.clueCaseFound || !state.cluePinFound)) {
        errMsg.style.color = '#ffd166';
        errMsg.textContent =
          '线索提示：工单号在【940nm 夜视滑块拉到底】处（AY-0414）；覆写码是异常发生时间（0317）。再次点击可直接填入。';
      } else {
        caseInput.value = 'AY-0414';
        pinInput.value = '0317';
        errMsg.style.color = '#7bd88f';
        errMsg.textContent = '已载入林栖预留的工程组缓存凭据，点击【解密并挂载封存库】即可进入。';
      }
    });

    // OS Sidebar Module Switching
    document.querySelectorAll('.os-nav-btn[data-ospane]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.os-nav-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.os-pane').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const paneId = btn.getAttribute('data-ospane');
        document.getElementById(paneId).classList.add('active');
        window.anyuAudio.playTick(620);
      });
    });

    // Case Tabs
    document.querySelectorAll('.case-tab[data-case]').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.case-tab[data-case]').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const idx = Number(tab.getAttribute('data-case'));
        renderCaseDoc(idx);
        window.anyuAudio.playTick(510);
      });
    });

    function renderCaseDoc(idx) {
      const viewer = document.getElementById('case-doc-viewer');
      viewer.innerHTML = window.ANYU_DATA.getCaseHTML(idx, getTelemetrySnapshot());
    }

    // 4-Cam Live Matrix Strobe Mechanic
    const strobeBtn = document.getElementById('matrix-strobe-btn');
    strobeBtn.addEventListener('click', () => {
      state.strobeStep++;
      document.getElementById('strobe-step-count').textContent = String(Math.min(3, state.strobeStep));
      window.anyuAudio.playStaticBurst(0.3, 0.85);

      const c1 = document.getElementById('m-cam-1');
      const c2 = document.getElementById('m-cam-2');
      const c3 = document.getElementById('m-cam-3');

      // Flash effect
      [c1, c2, c3].forEach((img) => {
        img.style.filter = 'brightness(3.2) contrast(1.8)';
        setTimeout(() => {
          img.style.filter = '';
        }, 180);
      });

      if (state.strobeStep === 1) {
        window.anyuAudio.playKnock(0.9, 2, 0.17, 0.85);
        c1.style.filter = 'brightness(0.22) contrast(1.5)';
        document.getElementById('m-stat-1').textContent = '⚠ 门外已空 · 入户门锁舌显示已解锁推开 5cm';
        document.getElementById('m-stat-4').textContent = '相位差：0.01 rad · 目标已进入玄关内侧';
      } else if (state.strobeStep === 2) {
        window.anyuAudio.playKnock(-0.9, 3, 0.14, 0.95);
        c2.src = 'assets/bedroom_ir_normal.jpg';
        document.getElementById('m-stat-2').textContent = '⚠ 衣柜夹缝已空！未检出离开房间的轨迹';
        c3.style.transform = 'scale(1.28)';
        document.getElementById('m-stat-3').textContent = '⚠ 床沿赤足正在下蹲贴近地面镜头！！';
      } else if (state.strobeStep === 3) {
        window.anyuAudio.playEarBreath(0.0, 2.2);
        [c1, c2, c3].forEach((img) => {
          img.style.opacity = '0.12';
        });
        document.getElementById('m-stat-1').textContent = 'SIGNAL LOST — 镜头被低温手掌遮挡';
        document.getElementById('m-stat-2').textContent = 'SIGNAL LOST — 目标已脱离 1804 样板间';
        document.getElementById('m-stat-3').textContent = '⚠ 重定向完成：已在当前浏览器观察者身后重建驻波';
        strobeBtn.textContent = '⚠ 强制切断电源 (触发终局断连)';
      } else {
        triggerContainmentBreach();
      }
    });

    // TTY0 Rescue Shell
    const ttyOut = document.getElementById('tty-output');
    const ttyForm = document.getElementById('tty-form');
    const ttyInput = document.getElementById('tty-input');

    function appendTTY(html, isCmd = false) {
      const line = document.createElement('div');
      line.style.marginBottom = '6px';
      if (isCmd) {
        line.innerHTML = `<span style="color:#ff6b6b;">root@anyu-1804:~#</span> ${html}`;
      } else {
        line.innerHTML = html;
      }
      ttyOut.appendChild(line);
      ttyOut.scrollTop = ttyOut.scrollHeight;
    }

    function runTTYCommand(rawCmd) {
      const cmd = rawCmd.trim();
      if (!cmd) return;
      appendTTY(cmd.replace(/</g, '&lt;'), true);
      window.anyuAudio.playTick(740);

      const lower = cmd.toLowerCase();
      const snap = getTelemetrySnapshot();

      if (lower === 'help') {
        appendTTY(
          `<span style="color:#9be2a8;">可用底层抢救指令：</span><br/>` +
            `  <code>status</code>         - 查看 1804 节点与当前浏览终端谐振耦合率<br/>` +
            `  <code>scan --behind</code>  - 调用声场回波扫描观察者座椅/床铺后方盲区<br/>` +
            `  <code style="color:#7cc6fe;">trace --origin</code> - 追踪 18.98Hz 驻波母带的跨时代上游服务器节点<br/>` +
            `  <code>whois LQ-09</code>    - 查询首席架构师林栖最后登录状态<br/>` +
            `  <code>play_raw 0317</code>  - 播放未降噪枕边母带声纹<br/>` +
            `  <code style="color:#ff6b6b;">purge --force</code>  - [高危] 销毁 18.98Hz 伴睡母带并强制切断驻波`
        );
      } else if (lower.startsWith('trace')) {
        window.anyuAudio.playStaticBurst(0.2, 0.5);
        appendTTY(
          `<span style="color:#7cc6fe;">[TRACEROUTE 18.98Hz CARRIER WAVE]</span><br/>` +
            `  hop 1: <code>hz-1804.anyu-sleep.cn</code> (杭州滨江样板间 · 延迟 1.2ms)<br/>` +
            `  hop 2: <a href="https://zjsnaaonb.github.io/ward4-1998/" target="_blank" rel="noopener" style="color:#84d9a0;">ward4-1998.psych-archive.internal ↗</a> (1998 省第四精神卫生中心·第四隔离病区 | 频段密令: <strong>1898</strong>)<br/>` +
            `  hop 3: <a href="https://zjsnaaonb.github.io/cishan-heritage/" target="_blank" rel="noopener" style="color:#ff9e9e;">cishan-1994.yunxi-telecom.dead ↗</a> (1994 云溪县祠山镇断电邮电所铜线 · 物理源头)<br/>` +
            `  <span style="color:#ffd166;">结论：单靠切断本机无法消灭源头，请点击上方 hop 2 前往【1998 四院内网】启动地下消磁总闸！</span>`
        );
      } else if (lower === 'status') {
        appendTTY(
          `[KERNEL] 18.98Hz Standing-Wave Relay: <span style="color:#ff6b6b;">ACTIVE (LOCKED)</span><br/>` +
            `[HOST] 当前绑定终端：${snap.platform} (${snap.screen}) | 驻留 ${snap.dwellSeconds}s<br/>` +
            `[SYNC] 宿主与盲区伴睡体呼吸同频度：<strong>98.7%</strong>`
        );
      } else if (lower.startsWith('scan')) {
        window.anyuAudio.playEarBreath(-0.92, 2.0);
        appendTTY(
          `正在发射 60GHz 反向脉冲扫描当前屏幕正前方及背光区……<br/>` +
            `  -> 目标 #01 (距屏幕 0.52m): 清醒活体，正在注视终端文字。<br/>` +
            `  -> <span style="color:#ff5959; font-weight:700;">目标 #02 (距目标 #01 左后方 0.38m): 静止站立轮廓，体温 28.4°C，无眨眼反射，视线正越过您的肩膀阅读本行输出。</span>`
        );
      } else if (lower.startsWith('whois')) {
        appendTTY(
          `工号 LQ-09 (林栖 · 首席声学架构师)<br/>` +
            `最后终端登录：19天前 03:17:00 于杭州滨江 1804 样板间。<br/>` +
            `当前人事状态：<span style="color:#ff8787;">在岗深睡中（系统遥测显示其仍在 1804 室床上保持每分钟 13 次标准呼吸，但警方确认房间为空）。</span>`
        );
      } else if (lower.startsWith('play_raw')) {
        window.anyuAudio.playSampleTrack(3, true);
        appendTTY(
          `<span style="color:#ff7b7b;">[PLAYING /mnt/blackbox_1804/0317_master.raw] “……别关掉它……你醒着的时候关掉它，它就会直接扑过来……”</span>`
        );
      } else if (lower.startsWith('purge')) {
        appendTTY(
          `<span style="color:#ff4d4d; font-weight:700;">[CRITICAL] 正在强行中止 18.98Hz 伪装驻波…… 警告：盲区伴睡体已察觉您处于清醒状态！！</span>`
        );
        setTimeout(() => {
          triggerContainmentBreach();
        }, 700);
      } else {
        appendTTY(`anyu-sh: 未知指令 '${cmd.replace(/</g, '&lt;')}'。输入 <code>help</code> 查看指令列表。`);
      }
    }

    ttyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = ttyInput.value;
      ttyInput.value = '';
      runTTYCommand(val);
    });

    document.querySelectorAll('.tty-quick').forEach((btn) => {
      btn.addEventListener('click', () => {
        runTTYCommand(btn.getAttribute('data-cmd'));
      });
    });
  }

  function startSonarMatrixCanvas() {
    const canvas = document.getElementById('sonar-matrix-canvas');
    if (!canvas || canvas.dataset.running === '1') return;
    canvas.dataset.running = '1';
    const ctx = canvas.getContext('2d');
    let t = 0;

    function loop() {
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = 'rgba(4, 6, 4, 0.25)';
      ctx.fillRect(0, 0, w, h);

      // Concentric sonar rings
      ctx.strokeStyle = 'rgba(90, 150, 100, 0.18)';
      [35, 70, 105].forEach((r) => {
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Host dot (center) & creeping red co-sleeper dot converging onto center
      ctx.fillStyle = '#52b788';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      const dist = Math.max(4, 68 - state.strobeStep * 22 - (Math.sin(t) * 4));
      const rx = w / 2 + Math.cos(t * 0.4) * dist;
      const ry = h / 2 + Math.sin(t * 0.4) * dist;
      ctx.fillStyle = '#ff3b3b';
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fill();

      t += 0.04;
      requestAnimationFrame(loop);
    }
    loop();
  }

  // =========================================================================
  // 14. LAYER 3: FULL-SCREEN CONTAINMENT BREACH CLIMAX
  // =========================================================================
  function triggerContainmentBreach() {
    if (state.breachTriggered) return;
    state.breachTriggered = true;

    const overlay = document.getElementById('breach-overlay');
    const epilogue = document.getElementById('breach-epilogue');

    // Step 1: Total pitch-black dead silence (vacuum dread)
    overlay.classList.add('active');
    document.title = '它看见你了';

    // Persist assimilation into localStorage
    localStorage.setItem('anyu_assimilated', '1');
    state.assimilated = true;

    window.anyuAudio.triggerBreachSequence(() => {
      // Step 2: VIOLENT PROXIMITY STRIKE (climax_breach.jpg surges onto screen)
      overlay.classList.add('strike');

      // Step 3: After 1.75s of sensor overload, reveal the haunting epilogue over the dimmed eyes
      setTimeout(() => {
        document.getElementById('breach-img').style.opacity = '0.26';
        document.getElementById('breach-img').style.animation = 'none';
        epilogue.classList.add('shown');
      }, 1750);
    });

    document.getElementById('breach-return-site').addEventListener('click', () => {
      overlay.classList.remove('active', 'strike');
      document.getElementById('forensic-modal').classList.remove('open');
      applyAssimilatedSurfaceMutations();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // INIT
  // =========================================================================
  printConsoleBreadcrumbs();
  setupBootGate();
  setupTopControls();
  startHeroRadar();
  setupIRCalibration();
  setupAcousticDemo();
  setupReviewsGaslighting();
  setupPeepholeAndFAQ();
  setupBehavioralTraps();
  setupForensicOS();
  window.addEventListener('scroll', onScrollUpdate, { passive: true });
  onScrollUpdate();
})();
