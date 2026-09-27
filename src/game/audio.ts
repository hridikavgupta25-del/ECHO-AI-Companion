class GameAudio {
  private ctx: AudioContext | null = null;
  private enabled = true;

  private getCtx(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        this.ctx = new Ctor();
      } catch {
        return null;
      }
    }
    return this.ctx;
  }

  resume() {
    const ctx = this.getCtx();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.08,
    delay = 0,
  ) {
    const ctx = this.getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + delay + duration,
    );

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  }

  private sweep(
    fromFreq: number,
    toFreq: number,
    duration: number,
    type: OscillatorType = "sine",
    volume = 0.08,
  ) {
    const ctx = this.getCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(fromFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      toFreq,
      ctx.currentTime + duration,
    );

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  playHover() {
    this.tone(900, 0.04, "sine", 0.02);
  }

  playClick() {
    this.tone(600, 0.06, "triangle", 0.05);
    this.tone(880, 0.05, "sine", 0.03, 0.02);
  }

  playSelect() {
    this.tone(440, 0.08, "triangle", 0.06);
    this.tone(660, 0.06, "sine", 0.04, 0.03);
  }

  playScan() {
    this.sweep(200, 600, 0.4, "sawtooth", 0.04);
    this.tone(400, 0.3, "sine", 0.02, 0.1);
  }

  playPowerUp() {
    this.sweep(80, 400, 0.8, "sawtooth", 0.07);
    this.tone(200, 0.6, "sine", 0.05, 0.15);
    this.tone(400, 0.5, "sine", 0.04, 0.25);
    this.tone(800, 0.4, "sine", 0.03, 0.35);
  }

  playMemoryUpdate() {
    this.tone(523.25, 0.3, "sine", 0.06);
    this.tone(659.25, 0.3, "sine", 0.06, 0.12);
    this.tone(783.99, 0.5, "sine", 0.06, 0.24);
  }

  playTransition() {
    this.sweep(300, 800, 0.3, "sine", 0.04);
  }
}

export const gameAudio = new GameAudio();
