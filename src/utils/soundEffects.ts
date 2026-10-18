// Web Audio API synthesized sound generator for high-fashion boutique experience

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Elegant bell / crystal chime on unlocking
  public playUnlockChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.9);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Soft romantic subtle heart click chime
  public playHeartChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.3); // E6

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Ignored
    }
  }

  // Gentle soft error buzz / tap
  public playError() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Ignored
    }
  }

  // Soft click / hover sound
  public playHover() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignored
    }
  }

  // Soft tactile button click sound
  public playClick() {
    this.playHeartChime();
  }

  // Tactile scratch friction sound
  private lastScratchTime = 0;
  public playScratch() {
    if (this.isMuted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastScratchTime < 45) return; // Throttle sound
    this.lastScratchTime = nowMs;

    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800 + Math.random() * 600;
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Triumphant luxury win fanfare for prize reveal
  public playWinFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Joyful luxury ascending arpeggio: C5, E5, G5, C6, D6, E6, G6
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1174.66, 1318.51, 1567.98];

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.14, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 1.7);
      });
    } catch {
      // Ignored
    }
  }

  // Tactile rope pull snap
  public playRopeTug() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignored
    }
  }

  // Silky velvet curtain swoosh and chime
  public playCurtainOpen() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Soft gentle chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.4); // B5

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch {
      // Ignored
    }
  }

  // Romantic Celesta / Music Box "Happy Birthday" melody
  private bdayOscillators: { stop: () => void }[] = [];
  public stopHappyBirthday() {
    this.bdayOscillators.forEach((o) => {
      try {
        o.stop();
      } catch {
        // Ignored
      }
    });
    this.bdayOscillators = [];
  }

  public playHappyBirthday() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      this.stopHappyBirthday();

      const ctx = this.ctx;
      const now = ctx.currentTime + 0.08;

      // Helper to synthesize a luxury music-box / crystal celesta note with harmonics
      const playBellNote = (freq: number, startTime: number, duration: number, vol = 0.12) => {
        // Fundamental tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, startTime);

        gain1.gain.setValueAtTime(0, startTime);
        gain1.gain.linearRampToValueAtTime(vol, startTime + 0.015);
        gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(startTime);
        osc1.stop(startTime + duration + 0.05);

        // Warm Celesta Octave Harmonic
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, startTime);

        gain2.gain.setValueAtTime(0, startTime);
        gain2.gain.linearRampToValueAtTime(vol * 0.42, startTime + 0.012);
        gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(startTime);
        osc2.stop(startTime + duration + 0.05);

        this.bdayOscillators.push({
          stop: () => {
            try {
              osc1.stop();
              osc2.stop();
            } catch {}
          },
        });
      };

      // Notes in F Major (Sweet, warm romantic tone)
      const C4 = 261.63;
      const D4 = 293.66;
      const E4 = 329.63;
      const F4 = 349.23;
      const G4 = 392.00;
      const A4 = 440.00;
      const Bb4 = 466.16;
      const C5 = 523.25;

      const beat = 0.44; // beat length in seconds
      const melody: [number, number, number, number[]?][] = [
        // Phrase 1: "Hap-py Birth-day to you"
        [C4, 0 * beat, 0.38],
        [C4, 0.75 * beat, 0.38],
        [D4, 1.5 * beat, 0.6],
        [C4, 2.5 * beat, 0.6],
        [F4, 3.5 * beat, 0.65],
        [E4, 4.5 * beat, 1.5, [174.61, 220.0, 261.63]], // F chord bass resonance

        // Phrase 2: "Hap-py Birth-day to you"
        [C4, 6.5 * beat, 0.38],
        [C4, 7.25 * beat, 0.38],
        [D4, 8.0 * beat, 0.6],
        [C4, 9.0 * beat, 0.6],
        [G4, 10.0 * beat, 0.65],
        [F4, 11.0 * beat, 1.5, [130.81, 196.0, 261.63]], // C chord bass

        // Phrase 3: "Hap-py Birth-day dear Shut-tu"
        [C4, 13.0 * beat, 0.38],
        [C4, 13.75 * beat, 0.38],
        [C5, 14.5 * beat, 0.8],
        [A4, 15.5 * beat, 0.6],
        [F4, 16.5 * beat, 0.6],
        [E4, 17.5 * beat, 0.6],
        [D4, 18.5 * beat, 1.3, [116.54, 174.61, 233.08]], // Bb chord bass

        // Phrase 4: "Hap-py Birth-day to you!"
        [Bb4, 20.25 * beat, 0.38],
        [Bb4, 21.0 * beat, 0.38],
        [A4, 21.75 * beat, 0.7],
        [F4, 22.75 * beat, 0.7],
        [G4, 23.75 * beat, 0.7],
        [F4, 24.75 * beat, 2.8, [87.31, 130.81, 174.61, 261.63, 349.23]], // Grand finale arpeggiated chime chord
      ];

      melody.forEach(([freq, offset, dur, chord]) => {
        playBellNote(freq, now + offset, dur, 0.14);
        if (chord && chord.length > 0) {
          chord.forEach((chFreq, i) => {
            playBellNote(chFreq, now + offset + i * 0.04, dur + 0.45, 0.07);
          });
        }
      });
    } catch {
      // Ignored
    }
  }
}

export const sound = new SoundEffectsManager();
