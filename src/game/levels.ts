/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Level Definitions with Complete Geometry, Puzzles, and Checkpoints
 */

import { LevelData } from './types.ts';

export const GAME_LEVELS: LevelData[] = [
  // ==========================================
  // LEVEL 1: TAMAN PERMULAAN (BEGINNING GARDEN)
  // ==========================================
  {
    id: 1,
    title: 'Level 1: Taman Permulaan',
    subtitle: 'Tutorial Gerakan, Melompat, & Sakelar Ganda',
    theme: 'garden',
    width: 2000,
    height: 600,
    bubuSpawn: { x: 80, y: 440 },
    duduSpawn: { x: 140, y: 440 },
    objectiveText: 'Kumpulkan 3 Kunci Bunga & Buka Gerbang Bersama',
    hint: 'Tekan [F] / tombol Aksi untuk mengangkat kotak di atas kepala dan lewati celah! Kotak juga bisa ditarik mundur atau didorong ke celah jurang untuk jadi pijakan jembatan!',
    hintSteps: {
      bubu: 'Bubu bisa MENGANGKAT kotak: Dekati kotak lalu tekan tombol Aksi [F]. Bubu bisa melompat sambil membawa kotak! Atau tahan [F] dan jalan mundur untuk MENARIK kotak.',
      dudu: 'Dudu punya lompatan lebih tinggi! Lompat ke dahan pohon atas untuk mengambil Kunci Bunga.',
      puzzle: 'Letakkan balok di atas salah satu sakelar penekan, atau Bubu & Dudu menginjak kedua sakelar bersamaan!',
      chasmTip: 'Ada jurang di depan kotak? Tekan [Aksi] untuk mengangkat kotak di atas kepala, bawa menyeberang jurang, lalu tekan [Aksi] lagi untuk meletakkannya!',
    },
    introStoryId: 'level_1_intro',
    outroStoryId: 'level_1_outro',
    platforms: [
      // Ground floor segments
      { id: 'g1', x: 0, y: 520, width: 600, height: 80, type: 'solid', themeStyle: 'grass' },
      // Chasm bridge bed: when crate falls in, it creates a stepping stone bridge!
      { id: 'chasm_bed1', x: 600, y: 550, width: 80, height: 50, type: 'solid', themeStyle: 'wood' },
      { id: 'g2', x: 680, y: 520, width: 550, height: 80, type: 'solid', themeStyle: 'grass' },
      { id: 'g3', x: 1320, y: 520, width: 680, height: 80, type: 'solid', themeStyle: 'grass' },
      
      // Gap 1 helper platform / step
      { id: 'p_step1', x: 340, y: 440, width: 120, height: 24, type: 'solid', themeStyle: 'grass' },
      // High platform reachable by Dudu's high jump
      { id: 'p_high1', x: 420, y: 320, width: 140, height: 24, type: 'solid', themeStyle: 'wood' },
      { id: 'p_high2', x: 500, y: 220, width: 120, height: 24, type: 'solid', themeStyle: 'wood' },
      // Mid area platforms
      { id: 'p_mid1', x: 740, y: 420, width: 160, height: 24, type: 'solid', themeStyle: 'grass' },
      { id: 'p_mid2', x: 960, y: 340, width: 150, height: 24, type: 'solid', themeStyle: 'wood' },
      // Near exit platforms
      { id: 'p_end1', x: 1400, y: 420, width: 140, height: 24, type: 'solid', themeStyle: 'wood' },
      { id: 'p_end2', x: 1600, y: 340, width: 160, height: 24, type: 'solid', themeStyle: 'grass' },
    ],
    crates: [
      // Wooden crate Bubu can push to jump across or onto switch
      { id: 'c1', x: 260, y: 460, width: 50, height: 50, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'wood' },
      { id: 'c2', x: 800, y: 460, width: 50, height: 50, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'wood' },
    ],
    switches: [
      { id: 'sw1', x: 1040, y: 506, width: 44, height: 14, type: 'pressure', isPressed: false, targetId: 'door1', requiresBoth: true, label: 'A' },
      { id: 'sw2', x: 1140, y: 506, width: 44, height: 14, type: 'pressure', isPressed: false, targetId: 'door1', requiresBoth: true, label: 'B' },
    ],
    doors: [
      { id: 'door1', x: 1240, y: 380, width: 30, height: 140, isOpen: false, openProgress: 0, requiresSwitches: ['sw1', 'sw2'], style: 'wooden' },
    ],
    checkpoints: [
      { id: 'cp1', x: 700, y: 440, width: 40, height: 80, isActivated: false },
    ],
    collectibles: [
      { id: 'k1', x: 530, y: 170, width: 32, height: 32, type: 'flower_key', collected: false, floatOffset: 0 },
      { id: 'k2', x: 1000, y: 290, width: 32, height: 32, type: 'flower_key', collected: false, floatOffset: 1 },
      { id: 'k3', x: 1650, y: 280, width: 32, height: 32, type: 'flower_key', collected: false, floatOffset: 2 },
      { id: 's1', x: 380, y: 390, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 0.5 },
      { id: 's2', x: 840, y: 370, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 1.5 },
      { id: 's3', x: 1720, y: 460, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 2.5 },
    ],
    exitPortal: {
      x: 1840,
      y: 400,
      width: 60,
      height: 120,
      bubuReached: false,
      duduReached: false,
      isUnlocked: true,
    },
  },

  // ==========================================
  // LEVEL 2: HUTAN YANG TERPISAH (SEPARATED FOREST)
  // ==========================================
  {
    id: 2,
    title: 'Level 2: Hutan yang Terpisah',
    subtitle: 'Aliran Sungai, Platform Bergerak, & Kerja Sama Tuas',
    theme: 'forest',
    width: 2400,
    height: 700,
    bubuSpawn: { x: 90, y: 520 },
    duduSpawn: { x: 150, y: 520 },
    objectiveText: 'Sambungkan Jembatan Sungai & Buka Gerbang Hutan',
    hint: 'Dudu melompat ke dahan pohon untuk menarik tuas jembatan. Bubu mengangkat atau menarik kotak ke sakelar gerbang!',
    hintSteps: {
      bubu: 'Angkat atau dorong balok kayu ke atas sakelar gerbang. Tahan Aksi [F] lalu jalan mundur jika ingin menarik balok menjauhi air sungai!',
      dudu: 'Lompat melewati dahan jamur dan pohon tinggi untuk menarik tuas jembatan gantung!',
      puzzle: 'Jembatan akan terhubung saat tuas ditarik, dan gerbang akan terbuka jika sakelar penekan diinjak atau ditindih balok kayu.',
      chasmTip: 'Jika kotak jatuh ke sungai, ia akan otomatis muncul kembali di tempat semula, atau kamu bisa menekan tombol Reset Balok di HUD!',
    },
    introStoryId: 'level_2_intro',
    outroStoryId: 'level_2_outro',
    platforms: [
      // Starting base
      { id: 'l2_g1', x: 0, y: 600, width: 500, height: 100, type: 'solid', themeStyle: 'grass' },
      
      // Moving platform 1 over small swamp
      { 
        id: 'l2_mp1', x: 540, y: 550, width: 110, height: 22, type: 'moving', themeStyle: 'wood',
        startX: 530, targetX: 720, startY: 550, targetY: 550, speed: 1.2, progress: 0, direction: 1
      },
      // Middle forest island
      { id: 'l2_g2', x: 770, y: 600, width: 450, height: 100, type: 'solid', themeStyle: 'grass' },
      // High tree platforms for Dudu
      { id: 'l2_tree1', x: 820, y: 470, width: 120, height: 22, type: 'solid', themeStyle: 'wood' },
      { id: 'l2_tree2', x: 920, y: 340, width: 130, height: 22, type: 'solid', themeStyle: 'wood' },
      { id: 'l2_tree3', x: 1060, y: 240, width: 140, height: 22, type: 'solid', themeStyle: 'wood' },
      // Water bridge (appears when switch is activated)
      { id: 'l2_bridge', x: 1250, y: 600, width: 280, height: 30, type: 'bridge', themeStyle: 'wood', requiresSwitch: 'sw_forest_bridge', visible: false },
      // Far bank
      { id: 'l2_g3', x: 1550, y: 600, width: 850, height: 100, type: 'solid', themeStyle: 'grass' },
      // High platforms before exit
      { id: 'l2_end_p1', x: 1720, y: 490, width: 130, height: 22, type: 'solid', themeStyle: 'wood' },
      { id: 'l2_end_p2', x: 1920, y: 410, width: 140, height: 22, type: 'solid', themeStyle: 'wood' },
      { 
        id: 'l2_mp2', x: 2100, y: 450, width: 110, height: 22, type: 'moving', themeStyle: 'wood',
        startX: 2100, targetX: 2100, startY: 530, targetY: 370, speed: 1.0, progress: 0, direction: 1
      },
    ],
    crates: [
      { id: 'c_forest_1', x: 340, y: 540, width: 55, height: 55, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'wood' },
      { id: 'c_forest_2', x: 1650, y: 540, width: 55, height: 55, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'wood' },
    ],
    switches: [
      // Lever on high tree ledge (reached by Dudu)
      { id: 'sw_forest_bridge', x: 1120, y: 214, width: 36, height: 26, type: 'lever', isPressed: false, targetId: 'l2_bridge', label: 'Jembatan' },
      // Pressure plate near gate
      { id: 'sw_forest_door', x: 1850, y: 586, width: 44, height: 14, type: 'pressure', isPressed: false, targetId: 'door_forest', label: 'Gerbang' },
    ],
    doors: [
      { id: 'door_forest', x: 2020, y: 460, width: 28, height: 140, isOpen: false, openProgress: 0, requiresSwitches: ['sw_forest_door'], style: 'wooden' },
    ],
    checkpoints: [
      { id: 'cp_forest_1', x: 790, y: 520, width: 40, height: 80, isActivated: false },
      { id: 'cp_forest_2', x: 1580, y: 520, width: 40, height: 80, isActivated: false },
    ],
    collectibles: [
      { id: 'f_l2_1', x: 620, y: 480, width: 30, height: 30, type: 'flower', collected: false, floatOffset: 0 },
      { id: 's_l2_1', x: 950, y: 290, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 1 },
      { id: 's_l2_2', x: 1390, y: 540, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 2 },
      { id: 's_l2_3', x: 1970, y: 350, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 0.5 },
    ],
    exitPortal: {
      x: 2260,
      y: 480,
      width: 60,
      height: 120,
      bubuReached: false,
      duduReached: false,
      isUnlocked: true,
    },
  },

  // ==========================================
  // LEVEL 3: GUA KRISTAL (CRYSTAL CAVE)
  // ==========================================
  {
    id: 3,
    title: 'Level 3: Gua Kristal',
    subtitle: 'Kristal Berpendar, Kunci Permata, & Sakelar Berat',
    theme: 'cave',
    width: 2500,
    height: 750,
    bubuSpawn: { x: 80, y: 580 },
    duduSpawn: { x: 140, y: 580 },
    objectiveText: 'Dapatkan Kunci Kristal & Aktifkan Dua Sakelar Gua',
    hint: 'Bubu tarik/dorong balok kristal ke sakelar penekan bawah. Dudu naik lift kristal untuk mengambil Kunci Kristal & tarik tuas atas!',
    hintSteps: {
      bubu: 'Dorong atau angkat balok kristal berat ke sakelar nomor 1. Gunakan balok sebagai pijakan jika perlu melompat lebih tinggi.',
      dudu: 'Naiklah ke lift kristal yang bergerak naik-turun, ambil Kunci Kristal ungu di platform atas, dan tarik tuas nomor 2.',
      puzzle: 'Pintu gerbang kristal terbuka jika Kunci Kristal telah diambil dan kedua sakelar (bawah & atas) sama-sama aktif!',
      chasmTip: 'Dekat dengan jurang kristal? Tahan tombol Aksi [F] dan bergerak mundur untuk MENARIK balok kristal kembali dengan aman.',
    },
    introStoryId: 'level_3_intro',
    outroStoryId: 'level_3_outro',
    platforms: [
      // Floor
      { id: 'l3_g1', x: 0, y: 660, width: 620, height: 90, type: 'solid', themeStyle: 'crystal' },
      { id: 'l3_g2', x: 740, y: 660, width: 700, height: 90, type: 'solid', themeStyle: 'crystal' },
      { id: 'l3_g3', x: 1540, y: 660, width: 960, height: 90, type: 'solid', themeStyle: 'crystal' },
      // Crystal pillars
      { id: 'l3_p1', x: 320, y: 520, width: 140, height: 25, type: 'solid', themeStyle: 'crystal' },
      { id: 'l3_p2', x: 480, y: 400, width: 140, height: 25, type: 'solid', themeStyle: 'crystal' },
      
      // Moving crystal elevator
      { 
        id: 'l3_mp1', x: 650, y: 600, width: 80, height: 20, type: 'moving', themeStyle: 'crystal',
        startX: 650, targetX: 650, startY: 620, targetY: 380, speed: 1.2, progress: 0, direction: 1
      },
      // Mid chamber high platforms
      { id: 'l3_p3', x: 800, y: 380, width: 160, height: 25, type: 'solid', themeStyle: 'crystal' },
      { id: 'l3_p4', x: 1040, y: 460, width: 150, height: 25, type: 'solid', themeStyle: 'crystal' },
      { id: 'l3_p5', x: 1220, y: 340, width: 160, height: 25, type: 'solid', themeStyle: 'crystal' },
      // End chamber
      { id: 'l3_p6', x: 1680, y: 530, width: 140, height: 25, type: 'solid', themeStyle: 'crystal' },
      { id: 'l3_p7', x: 1900, y: 420, width: 160, height: 25, type: 'solid', themeStyle: 'crystal' },
    ],
    crates: [
      { id: 'c_crystal_1', x: 220, y: 600, width: 55, height: 55, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'crystal' },
      { id: 'c_crystal_2', x: 900, y: 600, width: 55, height: 55, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'crystal' },
    ],
    switches: [
      { id: 'sw_crystal_1', x: 1100, y: 646, width: 44, height: 14, type: 'pressure', isPressed: false, targetId: 'door_crystal_1', label: '1' },
      { id: 'sw_crystal_2', x: 1300, y: 314, width: 36, height: 26, type: 'lever', isPressed: false, targetId: 'door_crystal_1', label: '2' },
    ],
    doors: [
      { id: 'door_crystal_1', x: 1460, y: 490, width: 30, height: 170, isOpen: false, openProgress: 0, requiresSwitches: ['sw_crystal_1', 'sw_crystal_2'], requiresKey: 'k_crystal', style: 'crystal' },
    ],
    checkpoints: [
      { id: 'cp_crystal_1', x: 760, y: 580, width: 40, height: 80, isActivated: false },
      { id: 'cp_crystal_2', x: 1560, y: 580, width: 40, height: 80, isActivated: false },
    ],
    collectibles: [
      { id: 'k_crystal', x: 1250, y: 280, width: 32, height: 32, type: 'crystal_key', collected: false, floatOffset: 0 },
      { id: 's_l3_1', x: 520, y: 340, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 1 },
      { id: 's_l3_2', x: 860, y: 320, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 2 },
      { id: 's_l3_3', x: 1950, y: 360, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 0.5 },
    ],
    exitPortal: {
      x: 2340,
      y: 540,
      width: 60,
      height: 120,
      bubuReached: false,
      duduReached: false,
      isUnlocked: true,
    },
  },

  // ==========================================
  // LEVEL 4: BUKIT CAHAYA (HILL OF LIGHT)
  // ==========================================
  {
    id: 4,
    title: 'Level 4: Bukit Cahaya',
    subtitle: 'Hembusan Angin, Platform Melayang, & Lompatan Presisi',
    theme: 'light',
    width: 2700,
    height: 800,
    bubuSpawn: { x: 80, y: 640 },
    duduSpawn: { x: 140, y: 640 },
    objectiveText: 'Manfaatkan Pusaran Angin & Seberangi Puncak Awan',
    hint: 'Masuk ke pusaran angin untuk melayang ke atas bukit! Bubu dorong/angkat balok ke sakelar agar gerbang awan terbuka.',
    hintSteps: {
      bubu: 'Bubu yang berat dapat melayang stabil pada pusaran angin. Dorong atau tarik balok ke pelat penekan untuk membuka jalan.',
      dudu: 'Dudu sangat ringan sehingga akan melayang jauh lebih tinggi di udara! Raih pecahan bintang di langit!',
      puzzle: 'Sakelar penekan cahaya akan membuka pintu kristal di tebing melayang.',
      chasmTip: 'Jika Bubu atau Dudu terpeleset jatuh dari awan, lentera checkpoint akan segera memulihkan posisi kalian tanpa mengulang level!',
    },
    introStoryId: 'level_4_intro',
    outroStoryId: 'level_4_outro',
    platforms: [
      // Starting hill
      { id: 'l4_g1', x: 0, y: 720, width: 550, height: 80, type: 'solid', themeStyle: 'cloud' },
      
      // Floating cloud steps
      { id: 'l4_p1', x: 480, y: 610, width: 130, height: 24, type: 'solid', themeStyle: 'cloud' },
      { id: 'l4_p2', x: 670, y: 490, width: 140, height: 24, type: 'solid', themeStyle: 'cloud' },
      
      // Moving cloud platform
      { 
        id: 'l4_mp1', x: 880, y: 480, width: 120, height: 22, type: 'moving', themeStyle: 'cloud',
        startX: 880, targetX: 1140, startY: 480, targetY: 480, speed: 1.4, progress: 0, direction: 1
      },
      // Mid summit
      { id: 'l4_g2', x: 1220, y: 580, width: 480, height: 220, type: 'solid', themeStyle: 'cloud' },
      { id: 'l4_p3', x: 1350, y: 440, width: 150, height: 24, type: 'solid', themeStyle: 'cloud' },
      { id: 'l4_p4', x: 1520, y: 320, width: 140, height: 24, type: 'solid', themeStyle: 'cloud' },
      // Moving vertical cloud platform
      { 
        id: 'l4_mp2', x: 1750, y: 550, width: 120, height: 22, type: 'moving', themeStyle: 'cloud',
        startX: 1750, targetX: 1750, startY: 550, targetY: 280, speed: 1.5, progress: 0, direction: 1
      },
      // High sky path
      { id: 'l4_p5', x: 1940, y: 380, width: 180, height: 24, type: 'solid', themeStyle: 'cloud' },
      { id: 'l4_p6', x: 2180, y: 470, width: 150, height: 24, type: 'solid', themeStyle: 'cloud' },
      // Final ridge
      { id: 'l4_g3', x: 2360, y: 600, width: 340, height: 200, type: 'solid', themeStyle: 'cloud' },
    ],
    windDrafts: [
      // Upward breeze zone 1
      { id: 'w1', x: 670, y: 220, width: 140, height: 270, forceY: -0.45 },
      // Upward breeze zone 2
      { id: 'w2', x: 1520, y: 100, width: 140, height: 220, forceY: -0.5 },
    ],
    crates: [
      { id: 'c_light_1', x: 300, y: 660, width: 50, height: 50, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'stone' },
      { id: 'c_light_2', x: 1280, y: 520, width: 50, height: 50, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'stone' },
    ],
    switches: [
      { id: 'sw_light_1', x: 1420, y: 566, width: 44, height: 14, type: 'pressure', isPressed: false, targetId: 'door_light', label: 'Cahaya' },
    ],
    doors: [
      { id: 'door_light', x: 2120, y: 340, width: 28, height: 130, isOpen: false, openProgress: 0, requiresSwitches: ['sw_light_1'], style: 'crystal' },
    ],
    checkpoints: [
      { id: 'cp_light_1', x: 1240, y: 500, width: 40, height: 80, isActivated: false },
    ],
    collectibles: [
      { id: 's_l4_1', x: 730, y: 220, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 0 },
      { id: 's_l4_2', x: 1570, y: 120, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 1 },
      { id: 's_l4_3', x: 2240, y: 400, width: 28, height: 28, type: 'star_fragment', collected: false, floatOffset: 2 },
    ],
    exitPortal: {
      x: 2540,
      y: 480,
      width: 60,
      height: 120,
      bubuReached: false,
      duduReached: false,
      isUnlocked: true,
    },
  },

  // ==========================================
  // LEVEL 5: LEMBAH BINTANG (STAR VALLEY - FINAL)
  // ==========================================
  {
    id: 5,
    title: 'Level 5: Lembah Bintang',
    subtitle: 'Pecahan Bintang, Altar Dua Hati, & Akhir Romantis',
    theme: 'star',
    width: 2800,
    height: 850,
    bubuSpawn: { x: 100, y: 680 },
    duduSpawn: { x: 160, y: 680 },
    objectiveText: 'Kumpulkan 3 Pecahan Bintang & Buka Gerbang Hati Bersama',
    hint: 'Kumpulkan 3 Pecahan Bintang dan injak kedua sakelar hati di altar bersamaan untuk membuka Gerbang Hati Abadi!',
    hintSteps: {
      bubu: 'Dorong balok bintang ke pijakan altar dan bersiap berdiri di sakelar hati sebelah kiri.',
      dudu: 'Lompat lincah melewati platform bergerak untuk mengambil pecahan bintang dan bersiap berdiri di sakelar hati sebelah kanan.',
      puzzle: 'Kedua sakelar hati altar harus diinjak Bubu dan Dudu secara bersamaan untuk menyalakan Gerbang Hati Abadi!',
      chasmTip: 'Jangan ragu membantu pasanganmu! Bersama-sama, tidak ada teka-teki yang tidak bisa diselesaikan.',
    },
    introStoryId: 'level_5_intro',
    outroStoryId: 'grand_ending',
    platforms: [
      // Base starry ground
      { id: 'l5_g1', x: 0, y: 760, width: 700, height: 90, type: 'solid', themeStyle: 'star' },
      { id: 'l5_g2', x: 800, y: 760, width: 680, height: 90, type: 'solid', themeStyle: 'star' },
      { id: 'l5_g3', x: 1600, y: 760, width: 1200, height: 90, type: 'solid', themeStyle: 'star' },
      // Starlight tiers
      { id: 'l5_p1', x: 380, y: 640, width: 140, height: 24, type: 'solid', themeStyle: 'star' },
      { id: 'l5_p2', x: 540, y: 520, width: 150, height: 24, type: 'solid', themeStyle: 'star' },
      
      // Moving star platform 1
      { 
        id: 'l5_mp1', x: 720, y: 490, width: 120, height: 22, type: 'moving', themeStyle: 'star',
        startX: 720, targetX: 960, startY: 490, targetY: 490, speed: 1.5, progress: 0, direction: 1
      },
      // High starry plateau
      { id: 'l5_p3', x: 1020, y: 410, width: 220, height: 24, type: 'solid', themeStyle: 'star' },
      { id: 'l5_p4', x: 1280, y: 310, width: 160, height: 24, type: 'solid', themeStyle: 'star' },
      // Moving star platform 2
      { 
        id: 'l5_mp2', x: 1460, y: 450, width: 120, height: 22, type: 'moving', themeStyle: 'star',
        startX: 1460, targetX: 1720, startY: 450, targetY: 340, speed: 1.3, progress: 0, direction: 1
      },
      // Altar of Two Hearts
      { id: 'l5_altar', x: 1840, y: 620, width: 380, height: 140, type: 'solid', themeStyle: 'star' },
      { id: 'l5_gate_platform', x: 2350, y: 620, width: 350, height: 140, type: 'solid', themeStyle: 'star' },
    ],
    crates: [
      { id: 'c_star_1', x: 300, y: 700, width: 55, height: 55, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'crystal' },
      { id: 'c_star_2', x: 1080, y: 350, width: 50, height: 50, vx: 0, vy: 0, isGrounded: false, isHeavy: true, style: 'crystal' },
    ],
    switches: [
      // Dual Heart Altar Switches
      { id: 'sw_star_heart1', x: 1910, y: 606, width: 50, height: 14, type: 'pressure', isPressed: false, targetId: 'door_star_gate', requiresBoth: true, label: 'Bubu' },
      { id: 'sw_star_heart2', x: 2100, y: 606, width: 50, height: 14, type: 'pressure', isPressed: false, targetId: 'door_star_gate', requiresBoth: true, label: 'Dudu' },
    ],
    doors: [
      { id: 'door_star_gate', x: 2260, y: 480, width: 32, height: 140, isOpen: false, openProgress: 0, requiresSwitches: ['sw_star_heart1', 'sw_star_heart2'], style: 'star' },
    ],
    checkpoints: [
      { id: 'cp_star_1', x: 820, y: 680, width: 40, height: 80, isActivated: false },
      { id: 'cp_star_2', x: 1850, y: 540, width: 40, height: 80, isActivated: false },
    ],
    collectibles: [
      { id: 's_l5_1', x: 590, y: 460, width: 32, height: 32, type: 'star_fragment', collected: false, floatOffset: 0 },
      { id: 's_l5_2', x: 1340, y: 250, width: 32, height: 32, type: 'star_fragment', collected: false, floatOffset: 1 },
      { id: 's_l5_3', x: 2010, y: 530, width: 32, height: 32, type: 'star_fragment', collected: false, floatOffset: 2 },
    ],
    exitPortal: {
      x: 2550,
      y: 500,
      width: 70,
      height: 120,
      bubuReached: false,
      duduReached: false,
      isUnlocked: true,
    },
  },
];
