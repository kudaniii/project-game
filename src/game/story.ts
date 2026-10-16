/**
 * Bubu & Dudu: Two Hearts, One Adventure
 * Story and Dialogue System
 */

import { StoryScene } from './types.ts';

export const STORY_SCENES: Record<string, StoryScene> = {
  // --- PROLOGUE ---
  prologue: {
    id: 'prologue',
    title: 'Peta Menuju Lembah Bintang',
    lines: [
      {
        speaker: 'narrator',
        text: 'Di sebuah rumah pohon yang hangat di pinggir Hutan Clover, Bubu si beruang dan Dudu si kelinci sedang menikmati teh madu...',
      },
      {
        speaker: 'bubu',
        emotion: 'curious',
        text: 'Dudu, lihat apa yang kutemukan di loteng lemari tua! Ini gulungan peta berbintang berkilau!',
      },
      {
        speaker: 'dudu',
        emotion: 'happy',
        text: 'Wah! Itu peta dongeng ke Lembah Bintang! Konon, siapa pun yang sampai ke sana bersama pujaan hatinya, doanya akan abadi!',
      },
      {
        speaker: 'bubu',
        emotion: 'determined',
        text: 'Jalan ke sana penuh teka-teki dan jurang yang tinggi... Tapi kalau kita selalu bersama dan saling tolong, kita pasti bisa!',
      },
      {
        speaker: 'dudu',
        emotion: 'love',
        text: 'Tentu saja, Bubu! Pegang tanganku kuat-kuat. Petualangan dua hati kita dimulai sekarang!',
      },
    ],
  },

  // --- LEVEL 1 ---
  level_1_intro: {
    id: 'level_1_intro',
    title: 'Level 1: Taman Permulaan',
    lines: [
      {
        speaker: 'bubu',
        emotion: 'happy',
        text: 'Kita sudah sampai di Taman Permulaan! Rumputnya empuk sekali, Dudu.',
      },
      {
        speaker: 'dudu',
        emotion: 'curious',
        text: 'Lihat, pintu taman terkunci dengan simbol bunga! Kita harus mengumpulkan 3 Kunci Bunga dan menginjak sakelar ganda!',
      },
      {
        speaker: 'bubu',
        emotion: 'determined',
        text: 'Aku bisa membantumu dengan mendorong atau mengangkat balok kayu ini. Ayo jalan bersama!',
      },
    ],
  },
  level_1_outro: {
    id: 'level_1_outro',
    title: 'Taman Permulaan Selesai',
    lines: [
      {
        speaker: 'dudu',
        emotion: 'happy',
        text: 'Hore! Pintu tamannya terbuka! Kerja sama kita hebat sekali, Bubu!',
      },
      {
        speaker: 'bubu',
        emotion: 'love',
        text: 'Semua jadi mudah kalau ada kamu di sampingku, Dudu. Yuk, lanjut ke hutan berikutnya!',
      },
    ],
  },

  // --- LEVEL 2 ---
  level_2_intro: {
    id: 'level_2_intro',
    title: 'Level 2: Hutan yang Terpisah',
    lines: [
      {
        speaker: 'dudu',
        emotion: 'surprised',
        text: 'Uwaah! Ada aliran sungai deras yang memisahkan jalan kita!',
      },
      {
        speaker: 'bubu',
        emotion: 'determined',
        text: 'Tenang, Dudu! Ada kotak kayu besar di sini. Tubuhku yang kuat bisa mendorongnya ke sungai untuk jadi jembatan!',
      },
      {
        speaker: 'dudu',
        emotion: 'happy',
        text: 'Dan aku akan melompat tinggi ke dahan jamur untuk menarik tuas jembatan gantung! Semangat, Bubu!',
      },
    ],
  },
  level_2_outro: {
    id: 'level_2_outro',
    title: 'Jembatan Hutan Terhubung',
    lines: [
      {
        speaker: 'bubu',
        emotion: 'happy',
        text: 'Huft, berat juga batangnya... Tapi melihat senyumanmu, rasa lelahku langsung hilang!',
      },
      {
        speaker: 'dudu',
        emotion: 'love',
        text: 'Ini aku petikkan buah beri manis untukmu, Bubu beruangku yang paling kuat!',
      },
    ],
  },

  // --- LEVEL 3 ---
  level_3_intro: {
    id: 'level_3_intro',
    title: 'Level 3: Gua Kristal',
    lines: [
      {
        speaker: 'dudu',
        emotion: 'shy',
        text: 'Brrr... Di dalam gua kristal ini agak dingin dan remang-remang, Bubu...',
      },
      {
        speaker: 'bubu',
        emotion: 'love',
        text: 'Jangan takut, Dudu kelinci manis. Aku di sini! Lihat, kristal-kristal ini memancarkan cahaya ungu dan biru yang indah saat kita dekat.',
      },
      {
        speaker: 'dudu',
        emotion: 'curious',
        text: 'Pintu gerbang kristal butuh Kunci Kristal bercahaya. Ada sakelar berat di atas sana!',
      },
      {
        speaker: 'bubu',
        emotion: 'determined',
        text: 'Aku dorong balok kristal ini jadi pijakan untukmu melompat ke atas. Satu, dua, tiga, dorooong!',
      },
    ],
  },
  level_3_outro: {
    id: 'level_3_outro',
    title: 'Cahaya Gua Kristal',
    lines: [
      {
        speaker: 'dudu',
        emotion: 'happy',
        text: 'Kunci kristalnya pas sekali! Gua ini jadi bersinar terang benderang seperti hatiku saat bersamamu.',
      },
      {
        speaker: 'bubu',
        emotion: 'shy',
        text: 'E-eh... Dudu bisa saja bikin pipiku merah seperti buah stroberi...',
      },
    ],
  },

  // --- LEVEL 4 ---
  level_4_intro: {
    id: 'level_4_intro',
    title: 'Level 4: Bukit Cahaya',
    lines: [
      {
        speaker: 'bubu',
        emotion: 'surprised',
        text: 'Wah! Angin di Bukit Cahaya ini kencang sekali! Ada hembusan angin ke atas!',
      },
      {
        speaker: 'dudu',
        emotion: 'happy',
        text: 'Tubuhku yang ringan bisa melayang tinggi dengan hembusan angin ini! Wuuush!',
      },
      {
        speaker: 'bubu',
        emotion: 'determined',
        text: 'Hati-hati ya! Platform awan di atas terus bergerak. Aku akan menginjak sakelar penahan agar platformnya stabil untukmu!',
      },
      {
        speaker: 'dudu',
        emotion: 'love',
        text: 'Siap, kapten Bubu! Puncaknya sudah dekat, kita sebentar lagi sampai ke Lembah Bintang!',
      },
    ],
  },
  level_4_outro: {
    id: 'level_4_outro',
    title: 'Puncak Bukit Terlampaui',
    lines: [
      {
        speaker: 'dudu',
        emotion: 'happy',
        text: 'Lompatan tadi seru sekali! Terima kasih sudah selalu menjaga dan menahan pijakanku, Bubu.',
      },
      {
        speaker: 'bubu',
        emotion: 'love',
        text: 'Apapun untukmu, Dudu. Lihat ke depan sana... Langitnya mulai dipenuhi taburan bintang!',
      },
    ],
  },

  // --- LEVEL 5 ---
  level_5_intro: {
    id: 'level_5_intro',
    title: 'Level 5: Lembah Bintang',
    lines: [
      {
        speaker: 'narrator',
        text: 'Mereka akhirnya tiba di Lembah Bintang... Hamparan aurora pastel dan bintang jatuh menghiasi langit malam yang damai.',
      },
      {
        speaker: 'dudu',
        emotion: 'surprised',
        text: 'Indah sekali, Bubu! Ini tempat paling indah di seluruh dunia!',
      },
      {
        speaker: 'bubu',
        emotion: 'happy',
        text: 'Ada Gerbang Hati Abadi di ujung lembah! Tapi kita harus mengumpulkan 3 Pecahan Bintang dan mengaktifkan altar bersama!',
      },
      {
        speaker: 'dudu',
        emotion: 'love',
        text: 'Tantangan terakhir kita berdua. Mari kita selesaikan ini bergandengan tangan!',
      },
    ],
  },

  // --- EPILOGUE & GRAND ENDING ---
  grand_ending: {
    id: 'grand_ending',
    title: 'Dua Hati, Satu Petualangan',
    lines: [
      {
        speaker: 'narrator',
        text: 'Saat Bubu dan Dudu bersama-sama menyentuh Gerbang Hati, cahaya keemasan lembut menyinari seluruh Lembah Bintang.',
      },
      {
        speaker: 'bubu',
        emotion: 'shy',
        text: 'Dudu... Sebenarnya selama perjalanan ini, ada satu hal yang ingin kuberikan kepadamu...',
      },
      {
        speaker: 'narrator',
        text: 'Bubu merogoh kantong kecilnya dan mengeluarkan mahkota bunga melati bertabur permata bintang yang ia rajut sendiri.',
      },
      {
        speaker: 'dudu',
        emotion: 'surprised',
        text: 'B-Bubu... Ini untukku? Cantik sekali!',
      },
      {
        speaker: 'bubu',
        emotion: 'love',
        text: 'Peta ini memang membawa kita ke Lembah Bintang yang ajaib... Tapi petualangan paling berharga bagiku adalah setiap detik yang kuhabiskan bersamamu.',
      },
      {
        speaker: 'dudu',
        emotion: 'love',
        text: 'Bubu... *memeluk erat Bubu* Aku juga sangat menyayangimu! Mau berjanji untuk selalu bertualang bersama selamanya?',
      },
      {
        speaker: 'bubu',
        emotion: 'happy',
        text: 'Janji beruang! Dua hati, satu petualangan selamanya!',
      },
      {
        speaker: 'narrator',
        text: 'Di bawah kilau bintang malam yang hangat, Bubu dan Dudu duduk berdampingan, mengetahui bahwa cinta dan kerja sama mereka dapat mengatasi rintangan apa pun.',
      },
    ],
  },
};
