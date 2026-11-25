/**
 * AnYu (安隅) Psychoacoustic Web Audio Horror Engine
 * Zero external audio dependencies — pure procedural synthesis:
 * - 18.98Hz infrasound + 58Hz standing-wave room dread drone
 * - Binaural stereo-panned wooden knocks (hard left / hard right ear)
 * - Formant-filtered close-mic whisper & ragged breathing synthesis
 * - 940nm CMOS night-vision coil whine (11.4kHz) & tape hiss
 * - DTMF 0-3-1-7 forensic tone encoder
 * - Multi-stage Containment Breach stinger & heartbeat flatline
 */
class PsychoAcousticEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.compressor = null;
    this.droneGain = null;
    this.subOsc = null;
    this.humOsc = null;
    this.whineOsc = null;
    this.whineGain = null;
    this.noiseBuffer = null;
    this.enabled = false;
    this.lowScareMode = false;
    this.corruption = 0;
    this.heartbeatTimer = null;
  }

  init(lowScare = false) {
    this.lowScareMode = lowScare;
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.enabled = true;
      return;
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -14;
    this.compressor.knee.value = 12;
    this.compressor.ratio.value = 6;
    this.compressor.connect(this.ctx.destination);

    this.master = this.ctx.createGain();
    this.master.gain.value = lowScare ? 0.42 : 0.88;
    this.master.connect(this.compressor);

    // Pre-build 4 seconds of pink-ish/brown-ish noise buffer for realistic room/breath/static textures
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * 4;
    this.noiseBuffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.045;
      b6 = white * 0.115926;
    }

    // Continuous 18.98 Hz Infrasound + 57.5 Hz Standing Wave Room Hum + Dark Detuned 113 Hz
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.value = 0.02;
    this.droneGain.connect(this.master);

    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.value = 18.98; // Classic "ghost frequency" sub-bass pressure
    const subGain = this.ctx.createGain();
    subGain.gain.value = 0.65;
    this.subOsc.connect(subGain);
    subGain.connect(this.droneGain);
    this.subOsc.start();

    this.humOsc = this.ctx.createOscillator();
    this.humOsc.type = 'triangle';
    this.humOsc.frequency.value = 57.5;
    const humFilter = this.ctx.createBiquadFilter();
    humFilter.type = 'lowpass';
    humFilter.frequency.value = 120;
    const humGain = this.ctx.createGain();
    humGain.gain.value = 0.25;
    this.humOsc.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(this.droneGain);
    this.humOsc.start();

    this.eerieOsc = this.ctx.createOscillator();
    this.eerieOsc.type = 'sawtooth';
    this.eerieOsc.frequency.value = 111.3; // Slight tritone/beating dissonance
    const eerieFilter = this.ctx.createBiquadFilter();
    eerieFilter.type = 'bandpass';
    eerieFilter.frequency.value = 210;
    eerieFilter.Q.value = 6;
    this.eerieGain = this.ctx.createGain();
    this.eerieGain.gain.value = 0.0;
    this.eerieOsc.connect(eerieFilter);
    eerieFilter.connect(this.eerieGain);
    this.eerieGain.connect(this.droneGain);
    this.eerieOsc.start();

    // Night-vision CMOS high-frequency sensor whine (controlled dynamically by IR exposure slider)
    this.whineOsc = this.ctx.createOscillator();
    this.whineOsc.type = 'sine';
    this.whineOsc.frequency.value = 9840;
    this.whineGain = this.ctx.createGain();
    this.whineGain.gain.value = 0.0;
    this.whineOsc.connect(this.whineGain);
    this.whineGain.connect(this.master);
    this.whineOsc.start();

    // Subtle room air floor
    const roomAir = this.ctx.createBufferSource();
    roomAir.buffer = this.noiseBuffer;
    roomAir.loop = true;
    const airFilter = this.ctx.createBiquadFilter();
    airFilter.type = 'lowpass';
    airFilter.frequency.value = 340;
    this.airGain = this.ctx.createGain();
    this.airGain.gain.value = 0.06;
    roomAir.connect(airFilter);
    airFilter.connect(this.airGain);
    this.airGain.connect(this.master);
    roomAir.start();

    this.enabled = true;
  }

  toggleMute() {
    if (!this.ctx) {
      this.init(false);
      return true;
    }
    this.enabled = !this.enabled;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.linearRampToValueAtTime(
      this.enabled ? (this.lowScareMode ? 0.42 : 0.88) : 0.0,
      now + 0.15
    );
    return this.enabled;
  }

  setCorruption(level) {
    this.corruption = Math.max(0, Math.min(1, level));
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    // Escalate standing-wave room pressure as user scrolls deeper into darkness
    const targetDrone = 0.025 + this.corruption * 0.24;
    this.droneGain.gain.setTargetAtTime(targetDrone, now, 0.25);
    this.eerieGain.gain.setTargetAtTime(Math.max(0, (this.corruption - 0.35) * 0.22), now, 0.3);
    this.airGain.gain.setTargetAtTime(0.05 + this.corruption * 0.14, now, 0.3);
  }

  setIRExposure(evNormalized) {
    // evNormalized: 0.0 -> 1.0
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const whineVol = Math.pow(evNormalized, 2.2) * (this.lowScareMode ? 0.015 : 0.045);
    this.whineGain.gain.setTargetAtTime(whineVol, now, 0.08);
    this.whineOsc.frequency.setTargetAtTime(9400 + evNormalized * 1900, now, 0.1);
  }

  /**
   * Realistic 3-tap hollow wooden door / wall / wardrobe knock panned sharply left or right
   * pan: -0.95 (left ear) to +0.95 (right ear)
   */
  playKnock(pan = -0.9, count = 3, spacing = 0.24, intensity = 0.85) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const outNode = panner || this.master;
    if (panner) {
      panner.pan.value = Math.max(-1, Math.min(1, pan));
      panner.connect(this.master);
    }

    for (let i = 0; i < count; i++) {
      const t = now + i * (spacing + (Math.random() * 0.03 - 0.015));
      // Wooden body resonance thump
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(145 + (i % 2) * 12, t);
      osc.frequency.exponentialRampToValueAtTime(46, t + 0.095);

      const knockGain = this.ctx.createGain();
      const vol = intensity * (this.lowScareMode ? 0.45 : 0.95) * (0.85 + i * 0.08);
      knockGain.gain.setValueAtTime(0.0001, t);
      knockGain.gain.linearRampToValueAtTime(vol, t + 0.004);
      knockGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

      osc.connect(knockGain);
      knockGain.connect(outNode);
      osc.start(t);
      osc.stop(t + 0.16);

      // Knuckle transient click
      const clickSrc = this.ctx.createBufferSource();
      clickSrc.buffer = this.noiseBuffer;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 680;
      bp.Q.value = 3.2;
      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(vol * 0.7, t);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      clickSrc.connect(bp);
      bp.connect(clickGain);
      clickGain.connect(outNode);
      clickSrc.start(t, Math.random() * 2, 0.05);
    }
  }

  /**
   * Close-mic ragged whisper / vocal-tract breath right beside one ear
   */
  playEarBreath(pan = 0.92, duration = 2.4) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    // Formant filters simulating whispered human vocal tract right against microphone
    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(520, now);
    f1.frequency.linearRampToValueAtTime(760, now + duration * 0.45);
    f1.frequency.linearRampToValueAtTime(430, now + duration);
    f1.Q.value = 4.5;

    const f2 = this.ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(1650, now);
    f2.frequency.linearRampToValueAtTime(2150, now + duration * 0.6);
    f2.Q.value = 5.5;

    const env = this.ctx.createGain();
    const peak = this.lowScareMode ? 0.32 : 0.72;
    env.gain.setValueAtTime(0.0001, now);
    // Inhale... pause... long close exhale
    env.gain.linearRampToValueAtTime(peak * 0.55, now + 0.32);
    env.gain.linearRampToValueAtTime(0.02, now + 0.58);
    env.gain.linearRampToValueAtTime(peak, now + 0.88);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(pan, now);
      panner.pan.linearRampToValueAtTime(pan * 0.5, now + duration);
      panner.connect(this.master);
    }
    const dest = panner || this.master;

    src.connect(f1);
    src.connect(f2);
    f1.connect(env);
    f2.connect(env);
    env.connect(dest);

    src.start(now);
    src.stop(now + duration + 0.05);
  }

  /**
   * Short glitch / CCTV frame-drop static burst
   */
  playStaticBurst(duration = 0.16, intensity = 0.5) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 950;

    const g = this.ctx.createGain();
    const v = intensity * (this.lowScareMode ? 0.25 : 0.65);
    g.gain.setValueAtTime(v, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(hp);
    hp.connect(g);
    g.connect(this.master);
    src.start(now, Math.random() * 2, duration);
  }

  /**
   * Play DTMF keypad tones for forensic code (e.g. "0317")
   */
  playDTMFSequence(digits = '0317') {
    if (!this.ctx || !this.enabled) return;
    const map = {
      '0': [941, 1336],
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477]
    };
    const now = this.ctx.currentTime;
    digits.split('').forEach((d, idx) => {
      const freqs = map[d];
      if (!freqs) return;
      const t = now + idx * 0.34;
      freqs.forEach((f) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.01);
        g.gain.setValueAtTime(0.09, t + 0.16);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.21);
        osc.connect(g);
        g.connect(this.master);
        osc.start(t);
        osc.stop(t + 0.23);
      });
    });
  }

  /**
   * Play the 3 acoustic demo tracks on the public product page
   */
  playSampleTrack(trackId, boosted = false) {
    if (!this.ctx) this.init(false);
    if (!this.enabled) return;
    const now = this.ctx.currentTime;

    if (trackId === 1) {
      // Soft bedding rustle & calm sleeper breath
      this.playEarBreath(0.0, 1.9);
    } else if (trackId === 2) {
      // Hollow metallic pipe resonance + distant muffled 3-knocks inside wall
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(92, now);
      osc.frequency.linearRampToValueAtTime(88, now + 2.5);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.18, now + 0.4);
      g.gain.exponentialRampToValueAtTime(0.001, now + 2.6);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 2.7);
      setTimeout(() => this.playKnock(-0.65, 3, 0.38, 0.35), 650);
    } else if (trackId === 3) {
      if (!boosted) {
        // Normal denoised track: faint solitary breathing
        this.playEarBreath(-0.15, 1.8);
      } else {
        // +24dB RAW FLOOR BOOST: Heavy tape hiss + close right-ear whisper breath + creepy vocal click + DTMF 0317!
        this.playStaticBurst(0.28, 0.55);
        this.playEarBreath(0.94, 3.1);
        setTimeout(() => this.playEarBreath(-0.94, 2.2), 1100);
        setTimeout(() => this.playDTMFSequence('0317'), 1650);
      }
    }
  }

  /**
   * Subtle UI terminal tick
   */
  playTick(pitch = 880) {
    if (!this.ctx || !this.enabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = pitch;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.035, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  /**
   * FULL CONTAINMENT BREACH SEQUENCE:
   * 1. Dead silence vacuum drop (the most terrifying beat in horror)
   * 2. Rapid stereo knock creeping from left -> right -> directly behind
   * 3. Visceral discordant sensor-overload stinger + flatline monitor tone
   */
  triggerBreachSequence(onStrikeCallback) {
    if (!this.ctx) this.init(false);
    const now = this.ctx ? this.ctx.currentTime : 0;

    if (this.ctx && this.enabled) {
      // Phase 1: Drop all room drones into eerie dead vacuum silence
      this.droneGain.gain.cancelScheduledValues(now);
      this.droneGain.gain.linearRampToValueAtTime(0.0, now + 0.08);
      this.airGain.gain.linearRampToValueAtTime(0.0, now + 0.08);
    }

    // Phase 2: Left ear knock... Right ear knock... Close center pound
    setTimeout(() => this.playKnock(-0.96, 2, 0.19, 0.9), 550);
    setTimeout(() => this.playKnock(0.96, 2, 0.16, 1.0), 1150);
    setTimeout(() => this.playEarBreath(0.0, 0.85), 1550);

    // Phase 3: THE STRIKE
    setTimeout(() => {
      if (typeof onStrikeCallback === 'function') onStrikeCallback();
      if (!this.ctx || !this.enabled) return;

      const t = this.ctx.currentTime;
      const peakScale = this.lowScareMode ? 0.35 : 0.95;

      // Visceral dissonant cluster shriek + sub-bass slam
      const freqs = [42, 83.5, 297, 622.25, 1318.5, 2793];
      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = idx < 2 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(f, t);
        osc.frequency.linearRampToValueAtTime(f * (idx % 2 === 0 ? 0.86 : 1.14), t + 1.65);

        const g = this.ctx.createGain();
        const v = (idx < 2 ? 0.38 : 0.14) * peakScale;
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(v, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.85);

        osc.connect(g);
        g.connect(this.master);
        osc.start(t);
        osc.stop(t + 1.9);
      });

      this.playStaticBurst(1.4, 0.95);

      // Post-strike medical flatline / 18.9Hz lock tone
      const flat = this.ctx.createOscillator();
      flat.type = 'sine';
      flat.frequency.value = 987.77; // Cold medical monitor B5 flatline
      const fg = this.ctx.createGain();
      fg.gain.setValueAtTime(0.0001, t + 1.4);
      fg.gain.linearRampToValueAtTime(0.11 * peakScale, t + 1.65);
      fg.gain.exponentialRampToValueAtTime(0.0001, t + 5.8);
      flat.connect(fg);
      fg.connect(this.master);
      flat.start(t + 1.4);
      flat.stop(t + 5.9);

      // Restore heavy dark drone afterward
      this.droneGain.gain.setTargetAtTime(0.22, t + 2.0, 0.8);
    }, 2050);
  }
}

window.anyuAudio = new PsychoAcousticEngine();
