// audio.js - Web Audio API procedural sound & cozy music synthesizer
// 100% offline, zero external asset dependencies, works on iPad Safari & PC browsers.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.currentBgm = null;
    this.bgmTimer = null;
    this.tempo = 110;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBgm();
    }
    return this.muted;
  }

  // Helper tone player
  playTone(freq, type = 'sine', duration = 0.2, gainStart = 0.15, gainEnd = 0.001, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(gainStart, t);
    gain.gain.exponentialRampToValueAtTime(gainEnd, t + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  // --- SOUND EFFECTS ---

  playTap() {
    this.playTone(520, 'sine', 0.08, 0.2, 0.01);
    this.playTone(780, 'triangle', 0.1, 0.15, 0.01, 0.04);
  }

  playMeow(isCalico = true) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(1400, t + 0.15);
    filter.frequency.linearRampToValueAtTime(600, t + 0.45);

    const baseFreq = isCalico ? 580 : 440; // Calico higher, grey boy lower
    osc.frequency.setValueAtTime(baseFreq * 0.85, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, t + 0.45);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  playMotor() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Motor engine rumble
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.04);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, t);
    filter.frequency.linearRampToValueAtTime(260, t + 0.5);
    filter.frequency.linearRampToValueAtTime(150, t + 1.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.4);
    gain.gain.linearRampToValueAtTime(0.001, t + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
  }

  playSplash() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    this.playTone(320, 'sine', 0.25, 0.2, 0.01);
    this.playTone(480, 'sine', 0.2, 0.15, 0.01, 0.05);
    this.playTone(650, 'triangle', 0.15, 0.1, 0.01, 0.1);
  }

  playBubblePop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = 400 + Math.random() * 300;
    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  playDuckQuack() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, t);
    filter.Q.value = 4.0;

    osc.frequency.setValueAtTime(320, t);
    osc.frequency.linearRampToValueAtTime(240, t + 0.18);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  playSparkle() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, idx) => {
      this.playTone(f, 'triangle', 0.25, 0.12, 0.001, idx * 0.07);
    });
  }

  playChaChing() {
    this.playTone(987.77, 'sine', 0.15, 0.18, 0.01, 0);
    this.playTone(1318.51, 'triangle', 0.4, 0.22, 0.001, 0.1);
  }

  playEat() {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(280 + Math.random() * 80, 'triangle', 0.08, 0.18, 0.01);
      }, i * 110);
    }
  }

  playSnore() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.linearRampToValueAtTime(180, t + 0.6);
    osc.frequency.linearRampToValueAtTime(130, t + 1.2);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 1.3);
  }

  playJingle() {
    // Happy day complete jingle
    const notes = [
      { f: 523.25, d: 0.15, t: 0 },
      { f: 659.25, d: 0.15, t: 0.15 },
      { f: 783.99, d: 0.15, t: 0.3 },
      { f: 1046.5, d: 0.45, t: 0.45 }
    ];
    notes.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, 0.22, 0.001, n.t);
    });
  }

  // --- PROCEDURAL BACKGROUND MUSIC (Cozy & Stardew-like) ---

  playBgm(themeName) {
    if (this.currentBgm === themeName && this.bgmTimer) return;
    this.stopBgm();
    this.currentBgm = themeName;
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    let step = 0;
    let melody = [];
    let speed = 240; // ms per step

    if (themeName === 'morning' || themeName === 'home') {
      // Warm acoustic Stardew sunrise melody (C major / G major pentatonic)
      melody = [
        523.25, 0, 659.25, 0, 783.99, 659.25, 523.25, 0,
        587.33, 0, 659.25, 783.99, 880.00, 0, 783.99, 0,
        659.25, 0, 783.99, 0, 1046.5, 880.00, 783.99, 0,
        587.33, 659.25, 587.33, 0, 523.25, 0, 0, 0
      ];
      speed = 280;
    } else if (themeName === 'shop') {
      // Upbeat cheerful market shopping tune
      melody = [
        659.25, 783.99, 659.25, 523.25, 587.33, 0, 587.33, 659.25,
        587.33, 440.00, 523.25, 0, 659.25, 783.99, 880.00, 987.77,
        1046.5, 0, 880.00, 783.99, 659.25, 0, 587.33, 523.25
      ];
      speed = 220;
    } else if (themeName === 'dance') {
      // Fun upbeat disco party tune for Papa, Mama & Arabella!
      melody = [
        440, 523.25, 659.25, 523.25, 783.99, 783.99, 659.25, 0,
        440, 523.25, 659.25, 523.25, 880.00, 880.00, 783.99, 0,
        987.77, 880.00, 783.99, 659.25, 783.99, 659.25, 587.33, 523.25
      ];
      speed = 180;
    } else if (themeName === 'night' || themeName === 'lullaby') {
      // Gentle night lullaby
      melody = [
        392.00, 0, 523.25, 0, 659.25, 0, 587.33, 0,
        523.25, 0, 392.00, 0, 440.00, 0, 523.25, 0,
        587.33, 0, 659.25, 0, 523.25, 0, 0, 0
      ];
      speed = 360;
    }

    const playStep = () => {
      if (this.muted || !this.currentBgm) return;
      const freq = melody[step % melody.length];
      if (freq > 0) {
        const type = themeName === 'dance' ? 'square' : 'triangle';
        const vol = themeName === 'dance' ? 0.08 : 0.05;
        this.playTone(freq, type, speed / 1000 * 0.85, vol, 0.001);
      }
      step++;
    };

    playStep();
    this.bgmTimer = setInterval(playStep, speed);
  }

  stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.currentBgm = null;
  }
}

window.soundEngine = new SoundEngine();
