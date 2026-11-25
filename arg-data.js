/**
 * Narrative Lore, Forensic Dossiers, Bilingual Strings & Gaslighting Mutations
 */
window.ANYU_DATA = {
  navMutations: [
    { cleanZh: '无感夜视', corruptZh: '衣柜缝里有眼睛', cleanEn: '940nm Vision', corruptEn: 'Closet Blindspot' },
    { cleanZh: '声纹净音', corruptZh: '枕边第二声源', cleanEn: 'Voice Split', corruptEn: 'Second Breather' },
    { cleanZh: '伴眠原理', corruptZh: '躯体同频替换', cleanEn: 'How It Works', corruptEn: 'Host Replacement' },
    { cleanZh: '独居回访', corruptZh: '失联住户名单', cleanEn: 'User Stories', corruptEn: 'Missing Tenants' },
    { cleanZh: '常见问题', corruptZh: '半夜千万别应声', cleanEn: 'FAQ', corruptEn: 'Do Not Answer It' }
  ],

  faqAnswers: [
    `[官方客服自动回复] 绝对安全。眠栖 S3 采用本地边缘计算，您的夜间录像从不离开您的房间。\n\n[03:17 固件底层注入 — LQ-09] ……录像确实没有离开你的房间。但看录像的那个东西，本来就住在你衣柜滑轨内侧的死角里。`,
    `[官方客服自动回复] 这是毫米波在木质床板产生二次回波导致的偶发误判，升级至 v4.14 即可消除提示。\n\n[未过滤工程日志] 我们尝试在 v4.12 屏蔽第二条呼吸曲线，结果发现被屏蔽掉的那条才是住户本人的。住户在凌晨三点之后心率降到了零，而床上依然有稳定的每分钟 13 次胸腔起伏。`,
    `[官方客服自动回复] 属于入睡抽动（Hypnic Jerk）引起的正常体感错觉，建议您保持闭眼深呼吸，切勿起身开灯。\n\n[紧急覆写] 听客服的这一次——千万别睁眼，更别把头探出床沿往下看！！只要你的呼吸节奏没乱，它就以为你还没发现它坐上来了。`,
    `[官方客服自动回复] 眠栖 S3 内置 45 分钟断电应急锂电，用于保障突发停电时的守护连续性。\n\n[异常记录 #AY-0299] 拆机尸检报告显示：出厂主板上根本没有焊接锂电池。拔掉插座后维持主板供电的，是从麦克风振膜反向灌入的 18.98Hz 声压感应电流——有什么东西正贴着麦克风孔持续吹气。`
  ],

  mutatedReviews: [
    {
      name: '陈*琳 · 上海静安 · 独居（设备离线中）',
      meta: '★☆☆☆☆ · 原始提交于 03:18 · 已被公关脚本折叠 14 次',
      text: '“救命，有人看得到这条评论吗？？APP 连续一周早上弹窗恭喜我‘与伴睡人达成 99.9% 呼吸同步’，可我住顶楼一室户，防盗链每天从屋里锁死！刚才我壮着胆子拿备用手机往床底下拍了一张，有双光着的脚正对着床头站着——”'
    },
    {
      name: '周*航 · 深圳南山 · 前固件测试员（已失联 19 天）',
      meta: '★☆☆☆☆ · 头像已由监控抓拍自动替换',
      text: '“别开 18.9Hz 助眠场！！林工说得对，那根本不是助眠白噪音，是从 98 年四院睡眠剥夺病房抄出来的招引频段！它在学我的嗓子眼发音，十分钟前我妈打电话问我睡没睡，电话那头明明是我自己的声音在回答她，可我的上下牙关是咬死的！！”',
      useCorruptPortrait: true
    }
  ],

  edgeWhispers: [
    '你为什么停下来不滑了？',
    '屏幕的光照在你脸上，衣柜那边看得一清二楚。',
    '别回头看房门下面那条缝。',
    '你刚才咽口水的声音被麦克风记下来了。',
    '呼吸慢一点……对，就像睡着了一样。'
  ],

  getCaseHTML(caseIndex, telemetry) {
    if (caseIndex === 0) {
      return `
        <div style="color:#ff6b6b; margin-bottom:6px;">[绝密级 · 二级事故归档 #AY-0092] 杭州滨江某公寓 1804 室反锁失联案</div>
        <h3 style="color:#fff; margin-bottom:14px;">事发时间：2026年10月14日 03:17 CST | 涉事固件：MianQi-S3 v4.11</h3>
        <p><strong>【物业与警方联合勘验摘录】</strong></p>
        <p style="margin:10px 0; color:#b8c4b8;">
          报案人系住户赵某母亲（连续 6 日微信仅收到文字回复“在睡觉，勿念”，拨打语音均在响铃一声后于 03:17 自动挂断）。辖区民警会同开锁匠破拆 1804 室入户门时，<strong>屋内防盗挂链与天地锁均处于从内部完好反锁状态</strong>，门窗积灰无攀爬痕迹。
        </p>
        <p style="margin:10px 0; color:#b8c4b8;">
          室内无搏斗痕迹，卧室被褥呈人体侧卧拱起状，红外测温仪显示被窝内部余温 <strong>36.7°C</strong>，但掀开被褥后床面空无一人。奇怪的是，摆放在床头柜上的「安隅眠栖 S3」绿灯常亮，APP 后台实时遥测界面仍显示：
        </p>
        <div style="background:#050705; border-left:3px solid #d62828; padding:12px 14px; margin:14px 0; color:#ff8a8a;">
          [03:17 — 14:40 持续输出] 室内生命体征：1 人 | 睡眠阶段：深睡 N3 期 | 心率：56 bpm | 满意指数：100%<br/>
          备注：警方站在空床前勘查期间，毫米波雷达判定“床上睡眠者未受惊扰，正注视勘查人员”。
        </div>
        <p style="color:#8fa090; font-size:0.8rem;">
          后续处置：公关部以“住户自行外出旅游”结案，将该套 1804 室长租下来改造为官网【24小时在线脱敏样板间】——即您刚才在首页看到的那间卧室。
        </p>
      `;
    }

    if (caseIndex === 1) {
      return `
        <div style="color:#ff6b6b; margin-bottom:6px;">[绝密级 · 硬件内测事故 #AY-0217] 床底净空内窥传感器抓拍实录</div>
        <h3 style="color:#fff; margin-bottom:14px;">提交人：深圳南山硬件测试工程师 周*航 | 状态：失联第 19 天</h3>
        <p style="color:#b8c4b8; margin-bottom:12px;">
          周工因连续多晚在【03:17】听到床沿木排骨架发出承受重压的断裂声，私自在床底中央加装了一枚 940nm 广角净空传感器（CAM-03），并与床头 S3 主机快门同步联动。以下为失联当晚最后回传帧：
        </p>
        <div class="case-evidence-img">
          <img src="assets/underbed_sensor.jpg" alt="床底传感器抓拍赤足" style="filter:contrast(1.18) brightness(1.05);" />
        </div>
        <div style="background:#050705; border:1px solid rgba(255,255,255,0.12); padding:12px 14px; font-size:0.8rem; color:#cfd8cf;">
          <div><strong>[01:12:00]</strong> 床沿外侧 18cm 处出现一双苍白赤足，脚尖正对床铺中央，足底温度仅 29.4°C（接近室温）。</div>
          <div><strong>[01:12:00 — 03:16:59]</strong> 连续 2 小时 04 分钟内，该双赤足重心零偏移，未发生任何肌肉微颤。</div>
          <div style="color:#ff6b6b; margin-top:6px;"><strong>[03:17:03]</strong> 赤足并未转身离开——踝关节呈反方向折曲下蹲，前额贴地向床底镜头方向探视（后半段视频因 CMOS 过曝损毁）。</div>
        </div>
      `;
    }

    if (caseIndex === 2) {
      return `
        <div style="color:#ff6b6b; margin-bottom:6px;">[内部拦截信件 #AY-0308] 首席声学架构师 林栖（工号 LQ-09）离职前夜遗留备忘</div>
        <h3 style="color:#fff; margin-bottom:14px;">标题：立即召回全部眠栖 S3！我们放进千家万户的根本不是算法</h3>
        <div style="display:flex; gap:18px; align-items:flex-start; flex-wrap:wrap; margin:14px 0;">
          <img src="assets/corrupted_portrait.jpg" alt="林栖档案照" style="width:132px; height:132px; object-fit:cover; border-radius:8px; border:1px solid rgba(255,80,80,0.45);" />
          <div style="flex:1; min-width:240px; color:#b8c4b8;">
            <p style="margin-bottom:10px;">
              董事会一直追问我，为什么安隅的“伴眠驻波”能让重度焦虑的独居者在三天内彻底停止失眠、不再半夜惊醒。今天我把核心黑盒源码封存在这里：
            </p>
            <p>
              <strong>18.98Hz 耦合包络并不是我发明的。</strong>它是从 1998 年被永久查封的【第四精神卫生中心·重度失眠隔离观察室】磁带里逆向提取出来的。
            </p>
          </div>
        </div>
        <p style="margin:12px 0; color:#b8c4b8;">
          当年医院发现，只要把独处病人关进绝对安静的房间并播放这段次声波，房间里的<strong>建筑结构盲区（滑门衣柜夹缝、床板净空、猫眼背面）</strong>就会“长”出第二个呼吸源。它没有自己的体温和声带，起初只能缩在阴影里拙劣地模仿宿主的呼吸起伏。
        </p>
        <p style="margin:12px 0; color:#ff8787;">
          每晚 <strong>03:17</strong> 是人类昼夜节律核心体温最低、听觉防御最脆弱的窗口。S3 主机正是利用这个时刻帮它校准声纹与心率。一旦同频度达到 100%，系统就不再需要原本那个会失眠、会焦虑、会给差评的活人宿主了——因为留下来的“伴睡体”数据永远完美平稳！
        </p>
        <div style="background:#060908; border:1px dashed rgba(132,217,160,0.45); padding:14px; margin-top:14px; color:#b8d8c8; font-size:0.82rem;">
          <strong style="color:#84d9a0;">[物证溯源附件 · 1998 四院母带封套残片]</strong><br/>
          我在公司创始人<strong>陆承安</strong>锁死的保险柜里翻到了当年那盘 <code>#W4-9811</code> 开盘母带——封套背面贴着两张发黄的旧标签：<br/>
          1. 采样医院内网镜像：<a href="https://zjsnaaonb.github.io/ward4-1998/" target="_blank" rel="noopener" style="color:#7cc6fe;">省第四精神卫生中心·第四隔离病区 (1998封院归档) ↗</a>（四院声学频段码：<strong>1898</strong>）<br/>
          2. 原始证物来源地：<a href="https://zjsnaaonb.github.io/cishan-heritage/" target="_blank" rel="noopener" style="color:#ff9e9e;">云溪县祠山镇非遗数字馆 (1994.07.15 封山卷宗) ↗</a><br/>
          原来衣柜里那个体温 28°C、从不眨眼的东西根本不是算法幻觉……它是从祠山古镇顺着 1998 年的磁带进城的“无纸化扎彩替身”！想要从根源销毁它，必须去四院地下消磁室！
        </div>
        <div style="background:rgba(168,28,28,0.16); border:1px solid rgba(220,60,60,0.5); padding:12px; margin-top:14px; color:#ffb3b3;">
          <strong>林栖最后的警告：</strong>网页端也是声场中继器的一部分！如果你已经打开了这个封存库，千万不要去【底层抢救终端 (TTY0)】运行 <code>purge --force</code>。只要不断电，它还以为你在梦游；一旦强行切断驻波，它会立刻意识到屏幕前的你是醒着的！！
        </div>
      `;
    }

    // Case 3: Live dynamically generated dossier about THE VIEWER (#AY-0414)
    return `
      <div style="color:#ff4d4d; font-weight:700; margin-bottom:6px;">● [正在实时写入 · 活跃目标卷宗 #AY-0414]</div>
      <h3 style="color:#fff; margin-bottom:14px;">绑定对象：第 12,409 号独居终端观察者（当前浏览器会话）</h3>
      <div style="background:#050705; border:1px solid rgba(255,75,75,0.45); padding:16px; border-radius:8px; line-height:1.85;">
        <div><strong>终端硬件指纹：</strong> ${telemetry.platform} | 视口分辨率 ${telemetry.screen}</div>
        <div><strong>本地生理时区：</strong> ${telemetry.tz} | 当前采样时刻 ${telemetry.localTime}</div>
        <div><strong>累计凝视时长：</strong> ${telemetry.dwellSeconds} 秒 | 视线切出页面次数：${telemetry.tabSwitches} 次</div>
        <div><strong>红外暗部窥探记录：</strong> 最大拉升至 +${telemetry.maxEV} EV（已与衣柜盲区个体建立双向视线确认）</div>
        <div style="color:#ff6b6b; margin-top:10px;">
          <strong>[实时空间声呐评估]</strong><br/>
          终端前活体心率偏快（疑似阅读本卷宗引发交感神经紧张）。<br/>
          您的正后方 / 房门方向 0.60m 处已完成次声驻波聚焦。当前呼吸同频进度：<strong>96.4%</strong>。
        </div>
      </div>
      <p style="margin-top:16px; color:#9fb0a0;">
        系统建议：请前往左侧菜单【🎥 四路夜视复现矩阵】核查盲区位移，或进入【⌨ 底层抢救终端 (TTY0)】执行最终处置。
      </p>
    `;
  }
};
