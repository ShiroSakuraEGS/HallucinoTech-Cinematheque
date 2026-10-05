/**
 * Web Audio ambient sound synthesizer for 致幻技電影館.
 * Operates without external audio files, completely self-contained.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientGain: GainNode | null = null;
  private heartbeatInterval: number | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ambientGain) {
      this.ambientGain.gain.value = this.isMuted ? 0 : 0.15;
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Subtle click for dialogue advancement
   */
  public playTypewriterClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420 + Math.random() * 80, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext may be locked before first touch
    }
  }

  /**
   * Mysterious chime when scanning QR or finding a movie
   */
  public playChime(success: boolean = true) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = success ? [523.25, 659.25, 783.99, 1046.5] : [330, 293.66, 261.63];

      freqs.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.05, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.65);
      });
    } catch {}
  }

  /**
   * Heartbeat thumping sound when player's heart flutters seeing the clerk
   */
  public startHeartbeat() {
    if (this.isMuted) return;
    this.stopHeartbeat();
    this.initCtx();

    const beat = () => {
      if (this.isMuted || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;

        // Double lub-dub sound
        [0, 0.14].forEach((offset, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(idx === 0 ? 58 : 50, now + offset);
          osc.frequency.exponentialRampToValueAtTime(35, now + offset + 0.12);

          gain.gain.setValueAtTime(0.3, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + offset);
          osc.stop(now + offset + 0.18);
        });
      } catch {}
    };

    beat();
    this.heartbeatInterval = window.setInterval(beat, 860);
  }

  public stopHeartbeat() {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Start film projector mechanical hum
   */
  public startProjectorHum() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      if (this.ambientGain) return; // already active

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      // Low frequency hum
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(this.ambientGain);
      osc.start();
    } catch {}
  }

  public stopProjectorHum() {
    if (this.ambientGain) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0, (this.ctx?.currentTime || 0) + 0.5);
        setTimeout(() => {
          this.ambientGain?.disconnect();
          this.ambientGain = null;
        }, 500);
      } catch {
        this.ambientGain = null;
      }
    }
  }
}

export const sound = new SoundSystem();
