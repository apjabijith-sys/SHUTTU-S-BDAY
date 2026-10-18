import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Music,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Film,
  ExternalLink,
  Disc,
  Upload,
  Check,
  Radio,
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  badge: string;
  caption: string;
  audioPath?: string;
  youtubeQuery: string;
  spotifyQuery: string;
  notes: number[]; // frequencies for synthesized acoustic melody
}

const SONGS: Song[] = [
  {
    id: 'adhyam-thammil',
    title: 'Adhyam Thammil',
    artist: 'Sooraj Santhosh & Anne Amie • Ifthi',
    album: 'June • Romantic Classic',
    badge: '✦ OUR FAVOURITE SONG ✦',
    caption: 'The melody of us. Every lyric, every gentle rhythm feels like it was written about the way my heart beats whenever you are near.',
    audioPath: '/audio/adhyam_thammil.mp3',
    youtubeQuery: 'Aadyam Thammil song June Ifthi Sooraj Santhosh',
    spotifyQuery: 'Aadyam Thammil',
    notes: [349.23, 440.0, 523.25, 659.25, 523.25, 440.0, 392.0, 493.88], // Fmaj7 melodic pattern
  },
  {
    id: 'aradhike',
    title: 'Aaradhike',
    artist: 'Sooraj Santhosh & Madhuvanti Narayan • Rex Vijayan',
    album: 'Ambili • Dreamy Love',
    badge: '✦ PURE MAGIC ✦',
    caption: 'Floating on clouds. When this song plays, the entire universe dissolves away, leaving only your sparkling eyes in focus.',
    audioPath: '/audio/aradhike.mp3',
    youtubeQuery: 'Aaradhike song Ambili Soubin Shahir',
    spotifyQuery: 'Aaradhike',
    notes: [392.0, 440.0, 493.88, 587.33, 659.25, 587.33, 493.88, 440.0], // Ethereal Ambili vibes
  },
  {
    id: 'arz-kiya-hai',
    title: 'Arz Kiya Hai',
    artist: 'Anuv Jain & Lost Stories',
    album: 'Coke Studio Bharat • Soulful Poetry',
    badge: '✦ SOULFUL DEVOTION ✦',
    caption: 'An intimate confession of love. A poetic serenade whispering what my heart feels for you every single waking second.',
    audioPath: '/audio/arz_kiya_hai.mp3',
    youtubeQuery: 'Anuv Jain Lost Stories Arz Kiya Hai Coke Studio Bharat',
    spotifyQuery: 'Arz Kiya Hai Anuv Jain',
    notes: [329.63, 392.0, 493.88, 587.33, 493.88, 392.0, 329.63, 293.66], // Soulful minor 9th
  },
  {
    id: 'mayajalame',
    title: 'Mayajaalame',
    artist: 'Sooraj Santhosh • Justin Prabhakaran',
    album: 'Sarvam Maya • Nivin Pauly',
    badge: '✦ THE SONG WHEN I MISS YOU ✦',
    caption: 'The song when I miss you. Whenever distance pulls us apart, this melody becomes my refuge until I can hold you in my arms again.',
    audioPath: '/audio/mayajalame.mp3',
    youtubeQuery: 'Mayajaalame Sarvam Maya Nivin Pauly Sooraj Santhosh',
    spotifyQuery: 'Mayajaalame',
    notes: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23], // Nostalgic cadence
  },
];

const formatTime = (secs: number) => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const mins = Math.floor(secs / 60);
  const remaining = Math.floor(secs % 60);
  return `${mins}:${remaining.toString().padStart(2, '0')}`;
};

export const FavouritesSection: React.FC = () => {
  // Active song index
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [customAudioUrls, setCustomAudioUrls] = useState<{ [key: string]: string }>({});
  const [visualizerBars, setVisualizerBars] = useState<number[]>([
    25, 40, 65, 80, 50, 90, 70, 35, 60, 85, 45, 95, 75, 40, 60, 30,
  ]);

  // Active filter tab
  const [activeTab, setActiveTab] = useState<'all' | 'songs' | 'movies' | 'characters'>('all');

  // Audio elements & synthesis
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSong = SONGS[currentSongIndex];

  // Synthesize acoustic romantic chord arpeggios when no external file is loaded
  const startSynthesizer = (song: Song) => {
    stopSynthesizer();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      let noteIdx = 0;
      const playNextNote = () => {
        if (!audioCtxRef.current || isMuted) return;
        const now = audioCtxRef.current.currentTime;
        const freq = song.notes[noteIdx % song.notes.length];
        noteIdx++;

        // Warm sine + subtle harmonics
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc.start(now);
        osc.stop(now + 1.45);
      };

      playNextNote();
      synthTimerRef.current = setInterval(playNextNote, 600);
    } catch {
      // Audio autoplay handled
    }
  };

  const stopSynthesizer = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  // Play a specific track with real MP3 audio
  const playTrack = (song: Song) => {
    const audioSrc = customAudioUrls[song.id] || song.audioPath;
    if (audioRef.current && audioSrc) {
      const currentSrc = audioRef.current.getAttribute('src');
      if (currentSrc !== audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Audio play error, falling back to synth:', err);
          setIsPlaying(true);
          startSynthesizer(song);
        });
    } else {
      setIsPlaying(true);
      startSynthesizer(song);
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    sound.playHover();
    if (isPlaying) {
      setIsPlaying(false);
      stopSynthesizer();
      if (audioRef.current) audioRef.current.pause();
    } else {
      sound.playHeartChime();

      // Launch golden sparkles on first play
      confetti({
        particleCount: 22,
        spread: 55,
        colors: ['#D4AF37', '#F7D6D0', '#FFFFFF', '#942534'],
        scalar: 0.8,
      });

      playTrack(activeSong);
    }
  };

  // Handle Song Switch
  const switchSong = (index: number) => {
    sound.playHover();
    stopSynthesizer();
    if (audioRef.current) audioRef.current.pause();
    setCurrentSongIndex(index);
    setProgress(0);
    setCurrentTime(0);

    if (isPlaying) {
      playTrack(SONGS[index]);
    }
  };

  // Handle Card Click or Card Play Button Click
  const handleCardClick = (idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playHover();
    if (currentSongIndex === idx) {
      if (isPlaying) {
        setIsPlaying(false);
        stopSynthesizer();
        if (audioRef.current) audioRef.current.pause();
      } else {
        sound.playHeartChime();
        confetti({
          particleCount: 20,
          spread: 50,
          colors: ['#D4AF37', '#F7D6D0', '#FFFFFF'],
          scalar: 0.8,
        });
        playTrack(SONGS[idx]);
      }
    } else {
      stopSynthesizer();
      if (audioRef.current) audioRef.current.pause();
      setCurrentSongIndex(idx);
      setProgress(0);
      setCurrentTime(0);
      sound.playHeartChime();
      playTrack(SONGS[idx]);
    }
  };

  // Audio animation visualizer tick
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const updateVisualizer = () => {
        setVisualizerBars((prev) =>
          prev.map(() => Math.floor(Math.random() * 75) + 20)
        );
        animId = requestAnimationFrame(updateVisualizer);
      };
      animId = requestAnimationFrame(updateVisualizer);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSynthesizer();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Handle custom audio file upload
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCustomAudioUrls((prev) => ({ ...prev, [activeSong.id]: url }));
      sound.playHeartChime();

      if (audioRef.current) {
        audioRef.current.src = url;
        if (isPlaying) audioRef.current.play();
      }

      confetti({
        particleCount: 25,
        spread: 60,
        colors: ['#F7D6D0', '#D4AF37'],
      });
    }
  };

  return (
    <section
      id="favourites"
      style={{
        position: 'relative',
        padding: '120px 0 110px',
        zIndex: 10,
        background: 'radial-gradient(ellipse at 50% 20%, #430c17 0%, #22040b 55%, #130104 100%)',
        borderTop: '1px solid rgba(247, 214, 208, 0.14)',
        borderBottom: '1px solid rgba(247, 214, 208, 0.14)',
        overflow: 'hidden',
      }}
    >
      {/* Real HTML5 Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            if (audioRef.current.duration) {
              setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
            }
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
          const nextIndex = (currentSongIndex + 1) % SONGS.length;
          setCurrentSongIndex(nextIndex);
          setProgress(0);
          setCurrentTime(0);
          playTrack(SONGS[nextIndex]);
        }}
      />


      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(247, 214, 208, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="atelier-container">
        {/* ============================================================
            SECTION HEADER
           ============================================================ */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px' }}>
          <div
            className="atelier-label"
            style={{
              marginBottom: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={13} color="#FFD700" />
            <span>✦ OUR LITTLE UNIVERSE ✦</span>
            <Sparkles size={13} color="#FFD700" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-melodrame)',
              fontSize: 'clamp(40px, 5.2vw, 68px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '0.01em',
              marginBottom: '16px',
            }}
          >
            The Things We Adore
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '15px',
              color: 'rgba(247, 214, 208, 0.82)',
              fontWeight: 300,
              lineHeight: 1.7,
            }}
          >
            The intimate melodies that score our love story, the films that touch our hearts, and the iconic characters that embody our wild and cute souls.
          </p>

          {/* Filter Pills */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '32px',
              padding: '6px',
              borderRadius: '9999px',
              background: 'rgba(26, 3, 7, 0.65)',
              border: '1px solid rgba(247, 214, 208, 0.22)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {[
              { id: 'all', label: 'All Treasures' },
              { id: 'songs', label: '🎵 Soundtrack' },
              { id: 'movies', label: '🎬 Movies' },
              { id: 'characters', label: '✨ Characters' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playHover();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                style={{
                  background:
                    activeTab === tab.id
                      ? 'linear-gradient(135deg, #F7D6D0 0%, #FFFFFF 100%)'
                      : 'transparent',
                  color: activeTab === tab.id ? '#2A040B' : 'rgba(247, 214, 208, 0.8)',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow:
                    activeTab === tab.id ? '0 4px 15px rgba(247, 214, 208, 0.3)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================
            PART 1: OUR SOUNDTRACK (INTERACTIVE LUXURY VINYL PLAYER)
           ============================================================ */}
        {(activeTab === 'all' || activeTab === 'songs') && (
          <div style={{ marginBottom: '80px' }}>
            {/* Subsection Subheader */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700',
                }}
              >
                <Music size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--color-blush-200)',
                    opacity: 0.9,
                  }}
                >
                  ✦ PART I • OUR FAVOURITE SONGS ✦
                </span>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '28px',
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  Our Intimate Soundtrack
                </h3>
              </div>
            </div>

            {/* The Master Vinyl Player Deck */}
            <div
              className="glass-panel"
              style={{
                borderRadius: '30px',
                padding: '44px 38px',
                background: 'rgba(42, 5, 13, 0.72)',
                border: '1.5px solid rgba(247, 214, 208, 0.28)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
                gap: '48px',
                alignItems: 'center',
                marginBottom: '30px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left Column: Realistic Spinning Golden Vinyl Disc */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '20px 0',
                }}
              >
                {/* Turntable Platter Ambient Glow */}
                <div
                  style={{
                    position: 'absolute',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: isPlaying
                      ? 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(247, 214, 208, 0.1) 45%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
                    transition: 'all 0.8s ease',
                    filter: 'blur(20px)',
                  }}
                />

                {/* The Vinyl Disc */}
                <div
                  style={{
                    position: 'relative',
                    width: 'min(300px, 78vw)',
                    height: 'min(300px, 78vw)',
                    borderRadius: '50%',
                    background: `
                      radial-gradient(circle at 50% 50%, #150205 0%, #0d0103 100%)
                    `,
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 0 6px rgba(212, 175, 55, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: isPlaying ? 'spinVinyl 4s linear infinite' : 'none',
                    transition: 'transform 0.5s ease',
                  }}
                >
                  {/* Vinyl Grooves (Realistic Circular Ring Lines) */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '16px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      boxShadow: `
                        inset 0 0 0 12px rgba(255, 255, 255, 0.02),
                        inset 0 0 0 24px rgba(255, 255, 255, 0.03),
                        inset 0 0 0 38px rgba(255, 255, 255, 0.02),
                        inset 0 0 0 54px rgba(255, 255, 255, 0.035),
                        inset 0 0 0 70px rgba(255, 255, 255, 0.02),
                        inset 0 0 0 88px rgba(255, 255, 255, 0.03)
                      `,
                    }}
                  />

                  {/* Vinyl Center Red-Gold Label */}
                  <div
                    style={{
                      width: '104px',
                      height: '104px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #851624 0%, #4a0711 75%, #2a0309 100%)',
                      border: '2px solid #D4AF37',
                      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(212, 175, 55, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      padding: '8px',
                      position: 'relative',
                    }}
                  >
                    {/* Spindle hole */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#0a0103',
                        border: '1px solid rgba(212, 175, 55, 0.6)',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.8)',
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '7px',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        color: '#FFD700',
                        textTransform: 'uppercase',
                        marginTop: '22px',
                      }}
                    >
                      SHUTTU & SOYABEAN
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '9px',
                        color: '#FFFFFF',
                        fontStyle: 'italic',
                        marginTop: '1px',
                        maxWidth: '85px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {activeSong.title}
                    </span>
                  </div>
                </div>

                {/* Live Equalizer Visualizer Bars */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '4px',
                    height: '36px',
                    marginTop: '28px',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    background: 'rgba(26, 3, 7, 0.6)',
                    border: '1px solid rgba(247, 214, 208, 0.18)',
                  }}
                >
                  {visualizerBars.map((height, i) => (
                    <div
                      key={i}
                      style={{
                        width: '3.5px',
                        height: isPlaying ? `${height}%` : '20%',
                        background: isPlaying
                          ? 'linear-gradient(180deg, #FFD700 0%, #F7D6D0 100%)'
                          : 'rgba(247, 214, 208, 0.25)',
                        borderRadius: '9999px',
                        transition: 'height 0.12s ease',
                      }}
                    />
                  ))}
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '10px',
                      color: isPlaying ? '#FFD700' : 'rgba(247, 214, 208, 0.5)',
                      letterSpacing: '0.12em',
                      marginLeft: '8px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {isPlaying ? 'PLAYING MELODY' : 'PAUSED'}
                  </span>
                </div>
              </div>

              {/* Right Column: Song Details & Master Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: 'rgba(212, 175, 55, 0.16)',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                    color: '#FFD700',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    width: 'fit-content',
                    marginBottom: '16px',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
                  }}
                >
                  <Sparkles size={13} color="#FFD700" />
                  <span>{activeSong.badge}</span>
                </div>

                <h3
                  className="font-serif"
                  style={{
                    fontSize: 'clamp(32px, 3.8vw, 46px)',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    margin: '0 0 6px',
                    lineHeight: 1.15,
                  }}
                >
                  {activeSong.title}
                </h3>

                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    color: 'var(--color-blush-200)',
                    marginBottom: '6px',
                    fontWeight: 500,
                  }}
                >
                  {activeSong.artist}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    color: 'rgba(247, 214, 208, 0.6)',
                    letterSpacing: '0.04em',
                    marginBottom: '22px',
                  }}
                >
                  {activeSong.album}
                </div>

                {/* Emotional Caption Callout */}
                <blockquote
                  style={{
                    margin: '0 0 26px',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: 'rgba(26, 3, 7, 0.6)',
                    borderLeft: '3px solid #D4AF37',
                    border: '1px solid rgba(247, 214, 208, 0.16)',
                    borderLeftWidth: '3px',
                    borderLeftColor: '#D4AF37',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '15px',
                    lineHeight: 1.6,
                    color: 'rgba(251, 247, 245, 0.9)',
                  }}
                >
                  “{activeSong.caption}”
                </blockquote>

                {/* Progress Scrubber */}
                <div style={{ marginBottom: '22px' }}>
                  <div
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newPct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                      setProgress(newPct);
                      if (audioRef.current && audioRef.current.duration) {
                        audioRef.current.currentTime = (newPct / 100) * audioRef.current.duration;
                        setCurrentTime(audioRef.current.currentTime);
                      }
                    }}
                    style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #F7D6D0 0%, #D4AF37 100%)',
                        borderRadius: '9999px',
                        boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: 'rgba(247, 214, 208, 0.55)',
                      marginTop: '6px',
                    }}
                  >
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 180)}</span>
                  </div>
                </div>

                {/* Primary Transport Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    marginBottom: '24px',
                  }}
                >
                  {/* Prev */}
                  <button
                    onClick={() =>
                      switchSong((currentSongIndex - 1 + SONGS.length) % SONGS.length)
                    }
                    className="btn-pill-outline"
                    style={{ width: '42px', height: '42px', padding: 0 }}
                    title="Previous Song"
                  >
                    <SkipBack size={16} />
                  </button>

                  {/* Play / Pause Main Button */}
                  <button
                    onClick={togglePlay}
                    style={{
                      height: '52px',
                      padding: '0 32px',
                      borderRadius: '9999px',
                      background: isPlaying
                        ? 'linear-gradient(135deg, #D4AF37 0%, #F5D77F 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F7D6D0 100%)',
                      color: '#2A040B',
                      border: 'none',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: isPlaying
                        ? '0 6px 25px rgba(212, 175, 55, 0.5)'
                        : '0 6px 25px rgba(247, 214, 208, 0.4)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {isPlaying ? <Pause size={18} fill="#2A040B" /> : <Play size={18} fill="#2A040B" />}
                    <span>{isPlaying ? 'Pause Melody' : 'Play Song'}</span>
                  </button>

                  {/* Next */}
                  <button
                    onClick={() => switchSong((currentSongIndex + 1) % SONGS.length)}
                    className="btn-pill-outline"
                    style={{ width: '42px', height: '42px', padding: 0 }}
                    title="Next Song"
                  >
                    <SkipForward size={16} />
                  </button>

                  {/* Mute toggle */}
                  <button
                    onClick={() => {
                      const nextMute = !isMuted;
                      setIsMuted(nextMute);
                      if (nextMute) stopSynthesizer();
                      else if (isPlaying) startSynthesizer(activeSong);
                    }}
                    className="btn-pill-outline"
                    style={{ width: '42px', height: '42px', padding: 0 }}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>

                {/* Secondary Actions: Upload Audio & Open YouTube */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(247, 214, 208, 0.12)',
                  }}
                >
                  {/* YouTube link */}
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      activeSong.youtubeQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: 'rgba(247, 214, 208, 0.85)',
                      textDecoration: 'none',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(247, 214, 208, 0.2)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(247, 214, 208, 0.85)';
                      e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.2)';
                    }}
                  >
                    <span>Full Track on YouTube</span>
                    <ExternalLink size={12} />
                  </a>

                  {/* Upload custom MP3 file */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: '#FFD700',
                      background: 'rgba(212, 175, 55, 0.12)',
                      padding: '8px 14px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Upload size={12} />
                    <span>
                      {customAudioUrls[activeSong.id] ? 'Audio Loaded ✓' : 'Attach MP3 File'}
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    style={{ display: 'none' }}
                    onChange={handleAudioUpload}
                  />
                </div>
              </div>
            </div>

            {/* Quick Track Selection Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px',
              }}
            >
              {SONGS.map((song, idx) => {
                const isSelected = currentSongIndex === idx;
                const isThisPlaying = isSelected && isPlaying;
                return (
                  <div
                    key={song.id}
                    onClick={() => handleCardClick(idx)}
                    style={{
                      padding: '20px',
                      borderRadius: '20px',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(74, 14, 23, 0.85) 0%, rgba(42, 5, 13, 0.95) 100%)'
                        : 'rgba(26, 3, 7, 0.55)',
                      border: isSelected
                        ? '1.5px solid rgba(212, 175, 55, 0.65)'
                        : '1px solid rgba(247, 214, 208, 0.16)',
                      boxShadow: isSelected
                        ? '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.2)'
                        : '0 4px 20px rgba(0, 0, 0, 0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.16)';
                      }
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-sans)',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: isSelected ? '#FFD700' : 'rgba(247, 214, 208, 0.6)',
                          fontWeight: 700,
                        }}
                      >
                        TRACK 0{idx + 1}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isThisPlaying ? (
                          <Radio size={14} color="#FFD700" className="animate-pulse" />
                        ) : (
                          <Disc size={14} color="rgba(247, 214, 208, 0.4)" />
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleCardClick(idx, e)}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isThisPlaying
                              ? 'linear-gradient(135deg, #D4AF37 0%, #F5D77F 100%)'
                              : 'rgba(255, 255, 255, 0.12)',
                            border: isThisPlaying ? 'none' : '1px solid rgba(247, 214, 208, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isThisPlaying ? '#2A040B' : '#FFFFFF',
                            transition: 'all 0.2s ease',
                          }}
                          title={isThisPlaying ? `Pause ${song.title}` : `Play ${song.title}`}
                        >
                          {isThisPlaying ? (
                            <Pause size={13} fill="#2A040B" />
                          ) : (
                            <Play size={13} fill={isSelected ? '#FFD700' : '#FFFFFF'} style={{ marginLeft: '2px' }} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div
                      className="font-serif"
                      style={{
                        fontSize: '18px',
                        color: '#FFFFFF',
                        fontWeight: 400,
                        marginBottom: '4px',
                      }}
                    >
                      {song.title}
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(247, 214, 208, 0.7)',
                        fontFamily: 'var(--font-sans)',
                        marginBottom: '8px',
                      }}
                    >
                      {song.artist.split('&')[0]}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '6px',
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(247, 214, 208, 0.1)',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          color: isThisPlaying ? '#FFD700' : 'rgba(247, 214, 208, 0.55)',
                          fontFamily: 'var(--font-sans)',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {isThisPlaying ? '♫ Playing Now' : '▶ MP3 Audio'}
                      </span>

                      {song.id === 'mayajalame' && (
                        <span
                          style={{
                            fontSize: '10.5px',
                            color: '#FFD700',
                            fontStyle: 'italic',
                            fontFamily: 'var(--font-serif)',
                          }}
                        >
                          “Miss you song”
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================
            PART 2: OUR FAVOURITE MOVIES (OK JAANU & 96)
           ============================================================ */}
        {(activeTab === 'all' || activeTab === 'movies') && (
          <div style={{ marginBottom: '80px' }}>
            {/* Subsection Subheader */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700',
                }}
              >
                <Film size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--color-blush-200)',
                    opacity: 0.9,
                  }}
                >
                  ✦ PART II • CINEMATIC TREASURES ✦
                </span>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '28px',
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  Our Favourite Movies
                </h3>
              </div>
            </div>

            {/* Side-by-side Luxury Framed Cinema Posters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
              }}
            >
              {/* Shuttu's Pick: OK JAANU */}
              <div
                className="glass-panel"
                style={{
                  borderRadius: '26px',
                  background: 'rgba(42, 5, 13, 0.8)',
                  border: '1.5px solid rgba(247, 214, 208, 0.28)',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow =
                    '0 32px 75px rgba(0, 0, 0, 0.85), 0 0 30px rgba(247, 214, 208, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.7)';
                }}
              >
                {/* Poster Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9 / 15.5',
                    overflow: 'hidden',
                    background: '#120205',
                  }}
                >
                  <img
                    src="/images/favourites/ok_jaanu_poster.jpg"
                    alt="Ok Jaanu Movie Poster"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.8s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                  />

                  {/* Ribbon Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '18px',
                      background: 'rgba(26, 3, 7, 0.88)',
                      backdropFilter: 'blur(8px)',
                      border: '1.5px solid rgba(212, 175, 55, 0.7)',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: '#FFD700',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    👑 SHUTTU'S FAVOURITE
                  </div>

                  {/* Gradient Bottom Fade */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 60%, rgba(26, 3, 7, 0.95) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Details Footer */}
                <div style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#F7D6D0',
                      opacity: 0.85,
                      marginBottom: '4px',
                    }}
                  >
                    ROMANTIC COMEDY • BOLLYWOOD
                  </div>

                  <h4
                    className="font-serif"
                    style={{
                      fontSize: '30px',
                      color: '#FFFFFF',
                      fontWeight: 400,
                      margin: '0 0 8px',
                    }}
                  >
                    OK Jaanu
                  </h4>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'rgba(247, 214, 208, 0.8)',
                      lineHeight: 1.7,
                      fontWeight: 300,
                      marginBottom: '18px',
                      flexGrow: 1,
                    }}
                  >
                    Carefree laughs, Mumbai monsoons, and discovering that love isn’t about rules—it’s about having the most fun with your person. Just like us acting crazy and smiling through life together.
                  </p>

                  <div
                    style={{
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(247, 214, 208, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: 'rgba(247, 214, 208, 0.65)',
                    }}
                  >
                    <span>Aditya & Shraddha • A.R. Rahman</span>
                    <Heart size={14} fill="#FF7B90" color="#FF7B90" />
                  </div>
                </div>
              </div>

              {/* Soyabean's Pick: 96 */}
              <div
                className="glass-panel"
                style={{
                  borderRadius: '26px',
                  background: 'rgba(42, 5, 13, 0.8)',
                  border: '1.5px solid rgba(247, 214, 208, 0.28)',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow =
                    '0 32px 75px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.7)';
                }}
              >
                {/* Poster Container */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9 / 15.5',
                    overflow: 'hidden',
                    background: '#120205',
                  }}
                >
                  <img
                    src="/images/favourites/movie_96_poster.jpg"
                    alt="'96 Movie Poster"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.8s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                  />

                  {/* Ribbon Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      left: '18px',
                      background: 'rgba(26, 3, 7, 0.88)',
                      backdropFilter: 'blur(8px)',
                      border: '1.5px solid rgba(212, 175, 55, 0.7)',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      color: '#FFD700',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    ⭐ SOYABEAN'S FAVOURITE
                  </div>

                  {/* Gradient Bottom Fade */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 60%, rgba(26, 3, 7, 0.95) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                </div>

                {/* Details Footer */}
                <div style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#F7D6D0',
                      opacity: 0.85,
                      marginBottom: '4px',
                    }}
                  >
                    TIMELESS ROMANCE • TAMIL CLASSIC
                  </div>

                  <h4
                    className="font-serif"
                    style={{
                      fontSize: '30px',
                      color: '#FFFFFF',
                      fontWeight: 400,
                      margin: '0 0 8px',
                    }}
                  >
                    '96
                  </h4>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      color: 'rgba(247, 214, 208, 0.8)',
                      lineHeight: 1.7,
                      fontWeight: 300,
                      marginBottom: '18px',
                      flexGrow: 1,
                    }}
                  >
                    The purest form of unconditional love. Ram and Jaanu’s unspoken bond, quiet nostalgia, and the kind of soul-deep devotion that stays unchanged across an entire lifetime.
                  </p>

                  <div
                    style={{
                      paddingTop: '16px',
                      borderTop: '1px solid rgba(247, 214, 208, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      color: 'rgba(247, 214, 208, 0.65)',
                    }}
                  >
                    <span>Vijay Sethupathi & Trisha • Govind Vasantha</span>
                    <Heart size={14} fill="#FFD700" color="#FFD700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            PART 3: OUR FAVOURITE CHARACTERS (HELLO KITTY & SPIDER-MAN)
           ============================================================ */}
        {(activeTab === 'all' || activeTab === 'characters') && (
          <div>
            {/* Subsection Subheader */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFD700',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--color-blush-200)',
                    opacity: 0.9,
                  }}
                >
                  ✦ PART III • THE DYNAMIC DUO ✦
                </span>
                <h3
                  className="font-serif"
                  style={{
                    fontSize: '28px',
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: 0,
                  }}
                >
                  Our Favourite Characters
                </h3>
              </div>
            </div>

            {/* Character Showcase Duo Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '36px',
                alignItems: 'stretch',
              }}
            >
              {/* Shuttu's Favourite: Hello Kitty */}
              <div
                className="glass-panel"
                style={{
                  borderRadius: '26px',
                  padding: '38px 32px',
                  background: 'radial-gradient(ellipse at 50% 25%, #5a101d 0%, #2a050d 80%)',
                  border: '1.5px solid rgba(255, 180, 195, 0.4)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 140, 165, 0.15)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow =
                    '0 32px 75px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 140, 165, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 140, 165, 0.15)';
                }}
              >
                {/* Floating Heart Accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    color: '#FFB8C6',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <Heart size={12} fill="#FFB8C6" />
                  <span>Shuttu's Muse</span>
                </div>

                {/* Character Render Container */}
                <div
                  style={{
                    width: '210px',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px 0 24px',
                    position: 'relative',
                  }}
                >
                  {/* Soft blush halo */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '20px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255, 180, 195, 0.35) 0%, transparent 70%)',
                      filter: 'blur(16px)',
                    }}
                  />
                  <img
                    src="/images/favourites/hello_kitty_hoodie.png"
                    alt="Hello Kitty in Hoodie"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.6))',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08) rotate(-3deg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0) rotate(0deg)')}
                  />
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#FFB8C6',
                    fontWeight: 700,
                    marginBottom: '6px',
                  }}
                >
                  ✦ THE SWEETEST CUTIE ✦
                </div>

                <h4
                  className="font-serif"
                  style={{
                    fontSize: '32px',
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: '0 0 12px',
                  }}
                >
                  Hello Kitty
                </h4>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    color: 'rgba(251, 247, 245, 0.85)',
                    lineHeight: 1.7,
                    fontWeight: 300,
                    maxWidth: '420px',
                    margin: '0 auto 18px',
                  }}
                >
                  Sweet, cute, and full of pure love! Just like Shuttu with her adorable smiles, heart of gold, and delicate charm that melts Soyabean every single day.
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 180, 195, 0.25)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-sans)',
                    color: '#FFB8C6',
                  }}
                >
                  “Cute bows, endless cuddles & sweet smiles”
                </div>
              </div>

              {/* Soyabean's Favourite: Spider-Man */}
              <div
                className="glass-panel"
                style={{
                  borderRadius: '26px',
                  padding: '38px 32px',
                  background: 'radial-gradient(ellipse at 50% 25%, #2a0b12 0%, #100205 80%)',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.12)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow =
                    '0 32px 75px rgba(0, 0, 0, 0.85), 0 0 40px rgba(212, 175, 55, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(212, 175, 55, 0.12)';
                }}
              >
                {/* Floating Badge Accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    color: '#FFD700',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <Sparkles size={12} color="#FFD700" />
                  <span>Soyabean's Hero</span>
                </div>

                {/* Character Render Container */}
                <div
                  style={{
                    width: '210px',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px 0 24px',
                    position: 'relative',
                  }}
                >
                  {/* Subtle golden hero glow */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: '20px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(225, 29, 72, 0.3) 0%, transparent 70%)',
                      filter: 'blur(16px)',
                    }}
                  />
                  <img
                    src="/images/favourites/spiderman_chibi.png"
                    alt="Spider-Man"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.7))',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08) rotate(3deg)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0) rotate(0deg)')}
                  />
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#FFD700',
                    fontWeight: 700,
                    marginBottom: '6px',
                  }}
                >
                  ✦ YOUR NUMBER ONE HERO ✦
                </div>

                <h4
                  className="font-serif"
                  style={{
                    fontSize: '32px',
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: '0 0 12px',
                  }}
                >
                  Spider-Man
                </h4>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13.5px',
                    color: 'rgba(251, 247, 245, 0.85)',
                    lineHeight: 1.7,
                    fontWeight: 300,
                    maxWidth: '420px',
                    margin: '0 auto 18px',
                  }}
                >
                  Loyal, goofy, fiercely protective, and ready to sling webs across city skylines to save his favourite girl. With great love comes lifelong devotion!
                </p>

                <div
                  style={{
                    marginTop: 'auto',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-sans)',
                    color: '#FFD700',
                  }}
                >
                  “Your personal friendly neighbourhood protector”
                </div>
              </div>
            </div>

            {/* ============================================================
                FEATURED COMBINED SHOWCASE: THE UPSIDE-DOWN KISS
               ============================================================ */}
            <div
              className="glass-panel"
              style={{
                marginTop: '44px',
                borderRadius: '28px',
                padding: '38px 34px',
                background: 'radial-gradient(ellipse at 50% 20%, #4a0c18 0%, #180307 80%)',
                border: '1.5px solid rgba(255, 180, 195, 0.45)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75), 0 0 40px rgba(225, 29, 72, 0.18)',
                display: 'grid',
                gridTemplateColumns: 'minmax(260px, 340px) 1fr',
                gap: '40px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Ambient Glows */}
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '260px',
                  height: '260px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '10%',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 140, 165, 0.18) 0%, transparent 70%)',
                  filter: 'blur(35px)',
                  pointerEvents: 'none',
                }}
              />

              {/* Left: Combined Transparent Art */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '10px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '10px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 182, 193, 0.3) 0%, transparent 70%)',
                    filter: 'blur(22px)',
                  }}
                />
                <img
                  src="/images/favourites/kitty_spiderman_duo.png"
                  alt="Hello Kitty kissing Spider-Man"
                  style={{
                    maxHeight: '320px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.75))',
                    transition: 'transform 0.5s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06) rotate(1.5deg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0) rotate(0deg)')}
                />
              </div>

              {/* Right: Romantic Narrative */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: 'rgba(255, 184, 198, 0.18)',
                      border: '1px solid rgba(255, 184, 198, 0.5)',
                      padding: '5px 14px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      color: '#FFB8C6',
                      textTransform: 'uppercase',
                    }}
                  >
                    ✦ THE ICONIC DUO ✦
                  </span>
                  <span
                    style={{
                      background: 'rgba(212, 175, 55, 0.16)',
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      padding: '5px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#FFD700',
                      textTransform: 'uppercase',
                    }}
                  >
                    SHUTTU & SOYABEAN
                  </span>
                </div>

                <h4
                  className="font-serif"
                  style={{
                    fontSize: '34px',
                    color: '#FFFFFF',
                    fontWeight: 400,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  Two Babies. One Shared Brain Cell.
                </h4>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '17px',
                    fontStyle: 'italic',
                    color: '#F7D6D0',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  “Somewhere between being soulmates and absolute idiots, we found our favourite way to be ourselves.”
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: 'rgba(251, 247, 245, 0.88)',
                    lineHeight: 1.8,
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  Unlimited madness, broken-table energy, goofy late-night laughter, and a love that never asks either of us to grow up. Because every Spider-Man needs his sweet Hello Kitty, and every Hello Kitty deserves her loyal, friendly neighbourhood protector. Two little troublemakers, one ridiculously beautiful love story, and a lifetime of being unserious together.
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '10px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(247, 214, 208, 0.25)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-sans)',
                      color: '#FFFFFF',
                    }}
                  >
                    <Heart size={14} fill="#FF7B90" color="#FF7B90" />
                    <span>Forever In Love & Unlimited Madness 💕</span>
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-sans)',
                      color: '#FFD700',
                    }}
                  >
                    <Sparkles size={13} color="#FFD700" />
                    <span>October 19</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spinVinyl {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 900px) {
          .glass-panel {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};
