import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Sparkles, Heart, Camera, Plus, Trash2, X, Upload, Check, Play, Film, ExternalLink } from 'lucide-react';
import { sound } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

export interface MemoryItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  isCurtainOpen?: boolean;
  objectPosition?: string;
}

interface CollectionsSectionProps {
  onSelectCollection: (item: MemoryItem) => void;
}

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'rose-edit',
    tag: 'FIRST CHAPTER',
    title: 'OUR FIRST DATE',
    subtitle: 'Timeless memory',
    description: 'The best date till now maybe because it was the first time we both felt loved in person unconditionally.',
    imageUrl: '/images/first_date_wa0019.jpg',
    objectPosition: 'center 20%',
    isCurtainOpen: false,
  },
  {
    id: 'blanc-rouge',
    tag: 'PHASE 2',
    title: 'LIVING TOGETHER DAYS',
    subtitle: 'Best days of our lives',
    description: "The moment we decided that we should spend more time together and got too close that we can't be without each other for even one day.",
    imageUrl: '/images/vase_arrangement_1792255669506.jpg',
    isCurtainOpen: false,
  },
  {
    id: 'special-occasions',
    tag: 'PHASE 3',
    title: 'THE DUMP COUPLE',
    subtitle: 'Unlimited madness',
    description: 'Both of us change from adults to babies when we are together in our space and do crazy shit breaking tables doors act like fools and idk how did the table broke do you know shuttu?',
    imageUrl: '/images/phase3_dumb_couple.jpg',
    objectPosition: 'center 25%',
    isCurtainOpen: false,
  },
];

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ onSelectCollection }) => {
  // Load saved memories or use default
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('shuttu_memories_archive');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Update items with latest defaults
          return parsed.map((item: MemoryItem) => {
            if (item.id === 'rose-edit') {
              return {
                ...item,
                tag: 'FIRST CHAPTER',
                title: 'OUR FIRST DATE',
                subtitle: 'Timeless memory',
                description: 'The best date till now maybe because it was the first time we both felt loved in person unconditionally.',
                imageUrl: (item.imageUrl.includes('roses_edit_') || !item.imageUrl.startsWith('data:'))
                  ? '/images/first_date_wa0019.jpg'
                  : item.imageUrl,
                objectPosition: 'center 20%',
              };
            }
            if (item.id === 'blanc-rouge') {
              return {
                ...item,
                tag: 'PHASE 2',
                title: 'LIVING TOGETHER DAYS',
                subtitle: 'Best days of our lives',
                description: "The moment we decided that we should spend more time together and got too close that we can't be without each other for even one day.",
              };
            }
            if (item.id === 'special-occasions') {
              return {
                ...item,
                tag: 'PHASE 3',
                title: 'THE DUMP COUPLE',
                subtitle: 'Unlimited madness',
                description: 'Both of us change from adults to babies when we are together in our space and do crazy shit breaking tables doors act like fools and idk how did the table broke do you know shuttu?',
                imageUrl: (item.imageUrl.includes('luxury_gift_') || !item.imageUrl.startsWith('data:'))
                  ? '/images/phase3_dumb_couple.jpg'
                  : item.imageUrl,
                objectPosition: 'center 25%',
              };
            }
            return item;
          });
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_MEMORIES;
  });

  // Track rope pulling animation per card ID
  const [pullingId, setPullingId] = useState<string | null>(null);

  // Modal for adding a new memory frame
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoTab, setVideoTab] = useState<'both' | 'reel1' | 'reel2' | 'drive'>('both');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const addFileInputRef = useRef<HTMLInputElement>(null);

  // Card photo replacement input ref map
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Save to localStorage whenever memories change
  useEffect(() => {
    try {
      localStorage.setItem('shuttu_memories_archive', JSON.stringify(memories));
    } catch {
      // Ignored
    }
  }, [memories]);

  // Pull Rope to Reveal / Close Velvet Curtain
  const handleRopePull = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playRopeTug();
    setPullingId(id);

    // Spring tension bounce
    setTimeout(() => {
      setPullingId(null);
    }, 450);

    setMemories((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const willOpen = !item.isCurtainOpen;
          if (willOpen) {
            sound.playCurtainOpen();
            // Launch delicate sparkles from rope location
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            confetti({
              particleCount: 18,
              spread: 45,
              origin: {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight,
              },
              colors: ['#D4AF37', '#F7D6D0', '#FFFFFF', '#942534'],
              scalar: 0.8,
              ticks: 70,
            });
          }
          return { ...item, isCurtainOpen: willOpen };
        }
        return item;
      })
    );
  };

  // Replace photo for specific card
  const handlePhotoUploadForCard = (id: string, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const resultUrl = reader.result;
          sound.playHeartChime();
          setMemories((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, imageUrl: resultUrl, isCurtainOpen: true }
                : item
            )
          );
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new custom memory frame
  const handleCreateNewMemory = () => {
    if (!newImageUrl.trim()) return;
    sound.playHeartChime();

    const newMemory: MemoryItem = {
      id: `memory-${Date.now()}`,
      tag: 'OUR STORY',
      title: newTitle.trim() || 'A Precious Memory',
      subtitle: newSubtitle.trim() || 'Captured in Love',
      description: newDescription.trim() || 'A golden moment etched into the eternity of our shared journey.',
      imageUrl: newImageUrl.trim(),
      isCurtainOpen: true, // open initially so she can see her photo!
    };

    setMemories((prev) => [...prev, newMemory]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewDescription('');
    setNewImageUrl('');

    confetti({
      particleCount: 40,
      spread: 70,
      colors: ['#F7D6D0', '#D4AF37', '#FFFFFF'],
    });
  };

  // Reset to original default memories
  const handleResetMemories = () => {
    sound.playHover();
    setMemories(DEFAULT_MEMORIES);
    localStorage.removeItem('shuttu_memories_archive');
  };

  // Delete a memory frame
  const handleDeleteMemory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playHover();
    setMemories((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section
      id="memories"
      style={{
        position: 'relative',
        padding: '120px 0 110px',
        zIndex: 10,
        background: 'radial-gradient(ellipse at 50% 25%, #4a0d18 0%, #2a050d 65%, #180206 100%)',
        borderTop: '1px solid rgba(247, 214, 208, 0.14)',
      }}
    >
      <div className="atelier-container">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          <div>
            <div className="atelier-label" style={{ marginBottom: '14px' }}>
              ✦ MEMORIES ARCHIVE ✦
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-melodrame)',
                fontSize: 'clamp(38px, 4.8vw, 62px)',
                fontWeight: 400,
                lineHeight: 1.15,
                color: '#FFFFFF',
                letterSpacing: '0.01em',
              }}
            >
              Memories that stay with us forever
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14.5px',
                color: 'rgba(247, 214, 208, 0.75)',
                marginTop: '10px',
                fontWeight: 300,
                maxWidth: '560px',
              }}
            >
              Veiled in royal velvet curtains. Pull the golden braided tassel cord on any frame to draw the curtains and reveal the cherished memory.
            </p>
          </div>

          {/* Action Buttons: Add Photo & Reset */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-pill-white"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '12px',
                letterSpacing: '0.1em',
              }}
            >
              <Plus size={15} />
              <span>Add Memory Photo</span>
            </button>

            {memories.length > 3 && (
              <button
                onClick={handleResetMemories}
                className="btn-pill-outline"
                style={{ fontSize: '11px', padding: '10px 18px' }}
                title="Reset to default frames"
              >
                Reset Frames
              </button>
            )}
          </div>
        </div>

        {/* ============================================================
            FRAMES GRID (with Velvet Curtains & Interactive Golden Pull Rope)
           ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '34px',
            marginBottom: '54px',
          }}
          className="collections-grid"
        >
          {memories.map((item) => {
            const isOpen = !!item.isCurtainOpen;
            const isPulling = pullingId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  sound.playHover();
                  onSelectCollection(item);
                }}
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'visible', // allows the rope and tassel to hang organically
                  cursor: 'pointer',
                  aspectRatio: '9 / 15',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.65)',
                  border: '1.5px solid rgba(247, 214, 208, 0.25)',
                  background: '#1a0307',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 32px 75px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 175, 55, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(0, 0, 0, 0.65)';
                }}
              >
                {/* Outer clipping container for the photograph and curtain inside the frame */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    overflow: 'hidden',
                  }}
                >
                  {/* The Photo Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: item.objectPosition || 'center center',
                      display: 'block',
                      transform: isOpen ? 'scale(1.03)' : 'scale(1.0)',
                      transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Dark Vignette Overlay on the Photo */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, rgba(26, 3, 7, 0.15) 0%, rgba(26, 3, 7, 0.3) 50%, rgba(26, 3, 7, 0.94) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* ============================================================
                      VELVET CURTAIN REVEAL OVERLAY (Left & Right Split Curtains)
                     ============================================================ */}
                  {/* Left Curtain Drape */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      width: '50.5%',
                      background: `
                        repeating-linear-gradient(
                          90deg,
                          #220308 0px,
                          #420710 12px,
                          #5c0d1b 24px,
                          #2d040a 36px,
                          #180205 48px
                        )
                      `,
                      boxShadow: 'inset -8px 0 20px rgba(0, 0, 0, 0.7), 4px 0 15px rgba(0, 0, 0, 0.5)',
                      transformOrigin: 'left center',
                      transform: isOpen
                        ? 'translateX(-90%) scaleX(0.18)'
                        : 'translateX(0%) scaleX(1)',
                      transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
                      zIndex: 3,
                    }}
                  />

                  {/* Right Curtain Drape */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      right: 0,
                      width: '50.5%',
                      background: `
                        repeating-linear-gradient(
                          90deg,
                          #180205 0px,
                          #2d040a 12px,
                          #5c0d1b 24px,
                          #420710 36px,
                          #220308 48px
                        )
                      `,
                      boxShadow: 'inset 8px 0 20px rgba(0, 0, 0, 0.7), -4px 0 15px rgba(0, 0, 0, 0.5)',
                      transformOrigin: 'right center',
                      transform: isOpen
                        ? 'translateX(90%) scaleX(0.18)'
                        : 'translateX(0%) scaleX(1)',
                      transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
                      zIndex: 3,
                    }}
                  />

                  {/* Top Golden Pelmet / Fringe Header */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '14px',
                      background: 'linear-gradient(180deg, #D4AF37 0%, #AA771C 100%)',
                      borderBottom: '2px solid #FBF5B7',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.6)',
                      zIndex: 5,
                    }}
                  />

                  {/* Center Velvet Seal Badge when Curtain is Closed */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '46%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(26, 3, 7, 0.88)',
                      backdropFilter: 'blur(8px)',
                      border: '1.5px solid rgba(212, 175, 55, 0.65)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(212, 175, 55, 0.3)',
                      padding: '12px 20px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#F7D6D0',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '11px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      zIndex: 4,
                      opacity: isOpen ? 0 : 1,
                      pointerEvents: 'none',
                      transition: 'opacity 0.5s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Sparkles size={13} color="#FFD700" />
                    <span>PULL ROPE TO REVEAL</span>
                  </div>

                  {/* Card Content at Bottom */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      left: '24px',
                      right: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      zIndex: 6,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '10px',
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: '#F7D6D0',
                          marginBottom: '4px',
                          opacity: 0.9,
                        }}
                      >
                        {item.tag}
                      </div>
                      <h3
                        className="font-serif"
                        style={{
                          fontSize: '24px',
                          fontWeight: 400,
                          color: '#FFFFFF',
                          marginBottom: '4px',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '12px',
                          color: 'rgba(247, 214, 208, 0.8)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.subtitle}
                      </p>
                    </div>

                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.12)',
                        color: '#F7D6D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <ArrowRight size={15} />
                    </div>
                  </div>

                  {/* Top Action Bar: Upload / Change Photo & Delete Custom Frame */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '20px',
                      left: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      zIndex: 7,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Change Photo Button */}
                    <button
                      onClick={() => fileInputRefs.current[item.id]?.click()}
                      title="Change photo for this frame"
                      style={{
                        background: 'rgba(26, 3, 7, 0.75)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(247, 214, 208, 0.35)',
                        borderRadius: '9999px',
                        padding: '6px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#F7D6D0',
                        fontSize: '11px',
                        fontFamily: 'var(--font-sans)',
                        cursor: 'pointer',
                        transition: 'all 0.25s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FFFFFF')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(247, 214, 208, 0.35)')}
                    >
                      <Camera size={13} />
                      <span>Change Photo</span>
                    </button>

                    {/* Hidden file input for this card */}
                    <input
                      ref={(el) => {
                        fileInputRefs.current[item.id] = el;
                      }}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePhotoUploadForCard(item.id, e.target.files[0]);
                        }
                      }}
                    />

                    {/* Delete button if custom frame */}
                    {item.id.startsWith('memory-') && (
                      <button
                        onClick={(e) => handleDeleteMemory(item.id, e)}
                        title="Remove custom memory frame"
                        style={{
                          background: 'rgba(26, 3, 7, 0.75)',
                          border: '1px solid rgba(255, 90, 110, 0.4)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FF8A98',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* ============================================================
                    THE INTERACTIVE GOLDEN BRAIDED ROPE & TASSEL CORD
                   ============================================================ */}
                <div
                  onClick={(e) => handleRopePull(item.id, e)}
                  title={isOpen ? 'Pull rope to close velvet curtains' : 'Pull rope to open velvet curtains'}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '16px',
                    width: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'grab',
                    zIndex: 20,
                    userSelect: 'none',
                    transform: isPulling ? 'translateY(28px)' : 'translateY(0)',
                    transition: isPulling
                      ? 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)'
                      : 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isPulling) {
                      e.currentTarget.style.transform = 'translateY(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPulling) {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {/* Brass Ring Wall Bracket */}
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #FBF5B7 0%, #AA771C 100%)',
                      border: '2px solid #784E10',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.6)',
                      marginBottom: '-3px',
                      zIndex: 2,
                    }}
                  />

                  {/* Braided Golden Rope Line */}
                  <div
                    style={{
                      width: '5px',
                      height: '190px',
                      background: `
                        repeating-linear-gradient(
                          45deg,
                          #FBF5B7 0px,
                          #DAA520 4px,
                          #8A5E14 8px
                        )
                      `,
                      boxShadow: '2px 3px 6px rgba(0, 0, 0, 0.55), inset 0 0 2px rgba(255, 255, 255, 0.4)',
                      borderRadius: '2px',
                    }}
                  />

                  {/* Knot / Spacer Bead */}
                  <div
                    style={{
                      width: '12px',
                      height: '10px',
                      borderRadius: '4px',
                      background: 'linear-gradient(90deg, #AA771C 0%, #FBF5B7 50%, #784E10 100%)',
                      boxShadow: '0 3px 6px rgba(0, 0, 0, 0.5)',
                      marginTop: '-2px',
                    }}
                  />

                  {/* Golden Tassel Bell Cap */}
                  <div
                    style={{
                      width: '20px',
                      height: '14px',
                      borderRadius: '6px 6px 2px 2px',
                      background: 'linear-gradient(180deg, #FBF5B7 0%, #AA771C 100%)',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.6)',
                      marginTop: '1px',
                    }}
                  />

                  {/* Tassel Silk Fringe Threads */}
                  <div
                    style={{
                      width: '22px',
                      height: '38px',
                      background: `
                        repeating-linear-gradient(
                          90deg,
                          #D4AF37 0px,
                          #FBF5B7 2px,
                          #AA771C 4px,
                          #E6CA65 6px
                        )
                      `,
                      borderRadius: '0 0 6px 6px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.7)',
                    }}
                  />

                  {/* Helper Floating Label Pill */}
                  <div
                    style={{
                      marginTop: '6px',
                      background: 'rgba(26, 3, 7, 0.85)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(212, 175, 55, 0.5)',
                      borderRadius: '9999px',
                      padding: '3px 8px',
                      fontSize: '9px',
                      fontFamily: 'var(--font-sans)',
                      color: '#FFD700',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {isOpen ? 'Close ✕' : 'Pull ✦'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA / More Memories Button */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => {
              sound.playClick();
              setIsVideoModalOpen(true);
            }}
            className="btn-pill-white"
            style={{
              padding: '16px 36px',
              fontSize: '13px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(225, 29, 72, 0.35)',
              cursor: 'pointer',
            }}
            onMouseEnter={() => sound.playHover()}
          >
            <Play size={15} fill="#4A0E17" color="#4A0E17" />
            <span>More Memories</span>
            <Sparkles size={14} color="#FFD700" />
          </button>
        </div>
      </div>

      {/* ============================================================
          MODAL: ADD NEW MEMORY FRAME & PHOTO
         ============================================================ */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(18, 2, 5, 0.86)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '36px',
              borderRadius: '24px',
              background: 'rgba(56, 8, 18, 0.94)',
              border: '1.5px solid rgba(247, 214, 208, 0.35)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--color-blush-200)',
                cursor: 'pointer',
                padding: '6px',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div className="atelier-label" style={{ marginBottom: '8px' }}>
                ✦ EXCLUSIVE MEMORIES ✦
              </div>
              <h3 className="editorial-title" style={{ fontSize: '26px', color: '#FFFFFF' }}>
                Add Memory Frame
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(247, 214, 208, 0.7)', marginTop: '4px' }}>
                Add another special moment to your exclusive memories with its own velvet curtain and pull rope.
              </p>
            </div>

            {/* Photo Upload / Drop Area */}
            <div
              onClick={() => addFileInputRef.current?.click()}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 10',
                borderRadius: '16px',
                border: '1.5px dashed rgba(247, 214, 208, 0.4)',
                background: 'rgba(26, 3, 7, 0.65)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '20px',
                overflow: 'hidden',
              }}
            >
              {newImageUrl ? (
                <img
                  src={newImageUrl}
                  alt="New Memory Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <>
                  <Upload size={28} color="#F7D6D0" />
                  <span style={{ fontSize: '13px', fontFamily: 'var(--font-sans)', color: '#FFF' }}>
                    Click to select photo from device
                  </span>
                  <span style={{ fontSize: '11px', color: 'rgba(247, 214, 208, 0.6)' }}>
                    JPG, PNG, or WEBP
                  </span>
                </>
              )}
            </div>

            <input
              ref={addFileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') {
                      setNewImageUrl(reader.result);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            {/* Title & Subtitle Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#F7D6D0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Memory Title:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Our Starlit Walk"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(26, 3, 7, 0.7)',
                    border: '1px solid rgba(247, 214, 208, 0.25)',
                    color: '#FFF',
                    fontSize: '13px',
                    marginTop: '4px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#F7D6D0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Short Subtitle:
                </label>
                <input
                  type="text"
                  placeholder="e.g. October Evening"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(26, 3, 7, 0.7)',
                    border: '1px solid rgba(247, 214, 208, 0.25)',
                    color: '#FFF',
                    fontSize: '13px',
                    marginTop: '4px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#F7D6D0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Or Paste Image URL:
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(26, 3, 7, 0.7)',
                    border: '1px solid rgba(247, 214, 208, 0.25)',
                    color: '#FFF',
                    fontSize: '13px',
                    marginTop: '4px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn-pill-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewMemory}
                className="btn-pill-white"
                disabled={!newImageUrl.trim()}
                style={{
                  flex: 1.2,
                  opacity: !newImageUrl.trim() ? 0.5 : 1,
                  cursor: !newImageUrl.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                <Check size={14} />
                <span>Save to Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          CINEMATIC MODAL: MORE MEMORIES VIDEO
         ============================================================ */}
      {isVideoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(8, 2, 4, 0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: videoTab === 'both' ? '1120px' : '920px',
              padding: '34px 30px',
              borderRadius: '28px',
              background: 'radial-gradient(ellipse at 50% 15%, #420815 0%, #120104 90%)',
              border: '1.5px solid rgba(247, 214, 208, 0.35)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(225, 29, 72, 0.22)',
              position: 'relative',
              maxHeight: '94vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              transition: 'max-width 0.3s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(225, 29, 72, 0.5)';
                e.currentTarget.style.transform = 'scale(1.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'scale(1.0)';
              }}
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', paddingRight: '40px', paddingLeft: '40px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.45)',
                  padding: '5px 16px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  color: '#FFD700',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                <Film size={12} color="#FFD700" />
                <span>✦ EXCLUSIVE CINEMA ARCHIVE • PRIVATE MEMORIES ✦</span>
              </div>
              <h3
                className="font-serif"
                style={{
                  fontSize: '34px',
                  color: '#FFFFFF',
                  fontWeight: 400,
                  margin: '4px 0 8px',
                }}
              >
                Our Special Moments
              </h3>
              <p
                style={{
                  fontSize: '13.5px',
                  color: 'rgba(247, 214, 208, 0.8)',
                  fontFamily: 'var(--font-sans)',
                  margin: '0 0 16px',
                  lineHeight: 1.6,
                }}
              >
                Aesthetic memory reels captured with unconditional love, late-night smiles, and unforgettable madness.
              </p>

              {/* View Selector Tabs */}
              <div
                style={{
                  display: 'inline-flex',
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '5px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(247, 214, 208, 0.22)',
                  gap: '6px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <button
                  type="button"
                  onClick={() => setVideoTab('both')}
                  style={{
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    background: videoTab === 'both' ? '#F7D6D0' : 'transparent',
                    color: videoTab === 'both' ? '#2A050D' : 'rgba(247, 214, 208, 0.75)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  ✨ Both Memory Reels
                </button>
                <button
                  type="button"
                  onClick={() => setVideoTab('reel1')}
                  style={{
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    background: videoTab === 'reel1' ? '#F7D6D0' : 'transparent',
                    color: videoTab === 'reel1' ? '#2A050D' : 'rgba(247, 214, 208, 0.75)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  🎬 Reel I (IMG_1572)
                </button>
                <button
                  type="button"
                  onClick={() => setVideoTab('reel2')}
                  style={{
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    background: videoTab === 'reel2' ? '#F7D6D0' : 'transparent',
                    color: videoTab === 'reel2' ? '#2A050D' : 'rgba(247, 214, 208, 0.75)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  🎬 Reel II (IMG_1582)
                </button>
                <button
                  type="button"
                  onClick={() => setVideoTab('drive')}
                  style={{
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '9999px',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    background: videoTab === 'drive' ? '#F7D6D0' : 'transparent',
                    color: videoTab === 'drive' ? '#2A050D' : 'rgba(247, 214, 208, 0.75)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  🌐 Google Drive Film
                </button>
              </div>
            </div>

            {/* Video Content Section */}
            {videoTab === 'both' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '26px',
                  alignItems: 'stretch',
                }}
              >
                {/* Frame 1: IMG_1572 */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '22px',
                    background: 'linear-gradient(145deg, #2a050d 0%, #120205 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.7)',
                    outline: '1px solid rgba(212, 175, 55, 0.25)',
                    outlineOffset: '-7px',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(225, 29, 72, 0.18)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* Corner Ornaments */}
                  <span style={{ position: 'absolute', top: '10px', left: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>
                  <span style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>

                  {/* Frame Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 6px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: '#FFD700',
                        textTransform: 'uppercase',
                      }}
                    >
                      <Film size={11} color="#FFD700" />
                      <span>✦ REEL I ✦</span>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-sans)', color: 'rgba(247, 214, 208, 0.65)', letterSpacing: '0.08em' }}>
                      IMG_1572
                    </span>
                  </div>

                  {/* Video Screen */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      background: '#000000',
                      border: '1px solid rgba(247, 214, 208, 0.25)',
                      boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.9)',
                      minHeight: '340px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      style={{
                        width: '100%',
                        maxHeight: '440px',
                        objectFit: 'contain',
                        display: 'block',
                        background: '#000',
                      }}
                      src="/videos/IMG_1572.webm"
                    />
                  </div>

                  {/* Bottom Engraved Plaque */}
                  <div
                    style={{
                      marginTop: '14px',
                      background: 'linear-gradient(180deg, rgba(50, 8, 16, 0.85) 0%, rgba(24, 3, 7, 0.95) 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      textAlign: 'center',
                    }}
                  >
                    <h4 className="font-serif" style={{ fontSize: '19px', color: '#FFFFFF', margin: '0 0 3px', fontWeight: 400 }}>
                      Sweetest Moments
                    </h4>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(247, 214, 208, 0.75)', margin: 0, lineHeight: 1.5 }}>
                      The quiet smiles, sweet laughter, and soft joy of just being together 💕
                    </p>
                  </div>
                </div>

                {/* Frame 2: IMG_1582 */}
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '22px',
                    background: 'linear-gradient(145deg, #2a050d 0%, #120205 100%)',
                    border: '2px solid rgba(212, 175, 55, 0.7)',
                    outline: '1px solid rgba(212, 175, 55, 0.25)',
                    outlineOffset: '-7px',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(225, 29, 72, 0.18)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* Corner Ornaments */}
                  <span style={{ position: 'absolute', top: '10px', left: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>
                  <span style={{ position: 'absolute', bottom: '10px', left: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', color: '#FFD700', fontSize: '13px', opacity: 0.85 }}>✦</span>

                  {/* Frame Top Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 6px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        border: '1px solid rgba(212, 175, 55, 0.4)',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '10px',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: '#FFD700',
                        textTransform: 'uppercase',
                      }}
                    >
                      <Film size={11} color="#FFD700" />
                      <span>✦ REEL II ✦</span>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-sans)', color: 'rgba(247, 214, 208, 0.65)', letterSpacing: '0.08em' }}>
                      IMG_1582
                    </span>
                  </div>

                  {/* Video Screen */}
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      background: '#000000',
                      border: '1px solid rgba(247, 214, 208, 0.25)',
                      boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.9)',
                      minHeight: '340px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      style={{
                        width: '100%',
                        maxHeight: '440px',
                        objectFit: 'contain',
                        display: 'block',
                        background: '#000',
                      }}
                      src="/videos/IMG_1582.mp4"
                    />
                  </div>

                  {/* Bottom Engraved Plaque */}
                  <div
                    style={{
                      marginTop: '14px',
                      background: 'linear-gradient(180deg, rgba(50, 8, 16, 0.85) 0%, rgba(24, 3, 7, 0.95) 100%)',
                      border: '1px solid rgba(212, 175, 55, 0.35)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      textAlign: 'center',
                    }}
                  >
                    <h4 className="font-serif" style={{ fontSize: '19px', color: '#FFFFFF', margin: '0 0 3px', fontWeight: 400 }}>
                      Unlimited Madness
                    </h4>
                    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: 'rgba(247, 214, 208, 0.75)', margin: 0, lineHeight: 1.5 }}>
                      Both of us changing from adults to babies in our own chaotic, beautiful universe 💕
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Single Reel View: Reel 1 (IMG_1572) */}
            {videoTab === 'reel1' && (
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, #2a050d 0%, #120205 100%)',
                  border: '2px solid rgba(212, 175, 55, 0.75)',
                  outline: '1px solid rgba(212, 175, 55, 0.25)',
                  outlineOffset: '-8px',
                  boxShadow: '0 25px 65px rgba(0, 0, 0, 0.9), 0 0 40px rgba(225, 29, 72, 0.25)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <span style={{ position: 'absolute', top: '12px', left: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>
                <span style={{ position: 'absolute', top: '12px', right: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>
                <span style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>
                <span style={{ position: 'absolute', bottom: '12px', right: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>

                <div
                  style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#000000',
                    border: '1px solid rgba(247, 214, 208, 0.3)',
                    minHeight: '440px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <video
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      maxHeight: '560px',
                      objectFit: 'contain',
                      display: 'block',
                      background: '#000',
                    }}
                    src="/videos/IMG_1572.webm"
                  />
                </div>

                <div
                  style={{
                    marginTop: '18px',
                    background: 'linear-gradient(180deg, rgba(50, 8, 16, 0.9) 0%, rgba(24, 3, 7, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '14px',
                    padding: '14px 20px',
                    textAlign: 'center',
                  }}
                >
                  <h4 className="font-serif" style={{ fontSize: '24px', color: '#FFFFFF', margin: '0 0 4px', fontWeight: 400 }}>
                    Our Sweet Little Moments • Reel I
                  </h4>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(247, 214, 208, 0.8)', margin: 0 }}>
                    The quiet smiles, sweet laughter, and soft joy of just being together 💕 (IMG_1572.webm)
                  </p>
                </div>
              </div>
            )}

            {/* Single Reel View: Reel 2 (IMG_1582) */}
            {videoTab === 'reel2' && (
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  background: 'linear-gradient(145deg, #2a050d 0%, #120205 100%)',
                  border: '2px solid rgba(212, 175, 55, 0.75)',
                  outline: '1px solid rgba(212, 175, 55, 0.25)',
                  outlineOffset: '-8px',
                  boxShadow: '0 25px 65px rgba(0, 0, 0, 0.9), 0 0 40px rgba(225, 29, 72, 0.25)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <span style={{ position: 'absolute', top: '12px', left: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>
                <span style={{ position: 'absolute', top: '12px', right: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>
                <span style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>
                <span style={{ position: 'absolute', bottom: '12px', right: '12px', color: '#FFD700', fontSize: '15px' }}>✦</span>

                <div
                  style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: '#000000',
                    border: '1px solid rgba(247, 214, 208, 0.3)',
                    minHeight: '440px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <video
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      maxHeight: '560px',
                      objectFit: 'contain',
                      display: 'block',
                      background: '#000',
                    }}
                    src="/videos/IMG_1582.mp4"
                  />
                </div>

                <div
                  style={{
                    marginTop: '18px',
                    background: 'linear-gradient(180deg, rgba(50, 8, 16, 0.9) 0%, rgba(24, 3, 7, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: '14px',
                    padding: '14px 20px',
                    textAlign: 'center',
                  }}
                >
                  <h4 className="font-serif" style={{ fontSize: '24px', color: '#FFFFFF', margin: '0 0 4px', fontWeight: 400 }}>
                    Unlimited Madness & Love • Reel II
                  </h4>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'rgba(247, 214, 208, 0.8)', margin: 0 }}>
                    Both of us changing from adults to babies in our own chaotic, beautiful universe 💕
                  </p>
                </div>
              </div>
            )}

            {/* Google Drive Stream Option */}
            {videoTab === 'drive' && (
              <div
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#000000',
                  border: '1.5px solid rgba(212, 175, 55, 0.35)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)',
                  aspectRatio: '16 / 9',
                  minHeight: '460px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <iframe
                  src="https://drive.google.com/file/d/1MTBT3m5IXkbp-SdeeYKUvyVPCnAm9Syz/preview"
                  width="100%"
                  height="100%"
                  style={{
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    minHeight: '460px',
                    display: 'block',
                  }}
                  allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title="More Memories Video"
                />
              </div>
            )}

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '6px',
                borderTop: '1px solid rgba(247, 214, 208, 0.15)',
                fontSize: '12px',
                fontFamily: 'var(--font-sans)',
                color: 'rgba(247, 214, 208, 0.8)',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={14} fill="#FF7B90" color="#FF7B90" />
                <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
                  “Turning every moment together into an extraordinary gallery of memories”
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#FFD700',
                    fontFamily: 'var(--font-sans)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  ✦ Shuttu & Soyabean
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
