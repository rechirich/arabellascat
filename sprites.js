// sprites.js - Pixel-art Assets from User's Reference Sheets
// Clean PNG sprites for stage characters, portraits, and items

const SPRITES = {
  // Full-body characters for interactive scenes (LARGE & PROPORTIONAL)
  characters: {
    arabella: (outfit = 'school', shoes = 'pink', pose = 'stand') => {
      let imgSrc = 'assets/characters/arabel_stage_school.png';
      let h = '220px';

      if (pose === 'sleep' || outfit === 'sleeping') {
        imgSrc = 'assets/characters/arabel_stage_sleeping.png';
        h = '165px';
      } else if (pose === 'sit') {
        if (outfit === 'daster_batik') {
          imgSrc = 'assets/characters/arabel_stage_daster_sit.png';
          h = '220px';
        } else if (outfit === 'black_cat') {
          imgSrc = 'assets/characters/arabel_stage_blackcat_sit.png';
          h = '210px';
        } else {
          imgSrc = 'assets/characters/arabel_stage_pink.png';
          h = '210px';
        }
      } else if (pose === 'walk' && outfit === 'school') {
        imgSrc = 'assets/characters/arabel_stage_school_walk.png';
        h = '220px';
      } else if (outfit === 'mancity') {
        imgSrc = 'assets/characters/arabel_stage_mancity.png';
        h = '235px';
      } else if (outfit === 'daster_batik') {
        imgSrc = 'assets/characters/arabel_stage_daster.png';
        h = '230px';
      } else if (outfit === 'black_cat') {
        imgSrc = 'assets/characters/arabel_stage_blackcat.png';
        h = '230px';
      } else if (outfit === 'red_flowers') {
        imgSrc = 'assets/characters/arabel_stage_red.png';
        h = '220px';
      } else if (outfit === 'pink_flowers' || outfit === 'pajamas' || outfit === 'bath' || outfit === 'kutang_putih') {
        imgSrc = 'assets/characters/arabel_stage_pink.png';
        h = '220px';
      } else {
        imgSrc = 'assets/characters/arabel_stage_school.png';
        h = '220px';
      }

      return `<img src="${imgSrc}" class="pixel-art stage-character-img" style="height: ${h}; max-width: 100%; object-fit: contain; pointer-events: none;" alt="Arabella" />`;
    },

    papa: (pose = 'stand') => {
      let imgSrc = 'assets/characters/papa_stage_standing.png';
      let h = '275px';
      if (pose === 'walk') {
        imgSrc = 'assets/characters/papa_stage_walking.png';
        h = '260px';
      } else if (pose === 'phone') {
        imgSrc = 'assets/characters/papa_dialogue_phone.png';
        h = '260px';
      }
      return `<img src="${imgSrc}" class="pixel-art stage-character-img" style="height: ${h}; max-width: 100%; object-fit: contain; pointer-events: none;" alt="Papa" />`;
    },

    mama: (pose = 'stand') => {
      let imgSrc = 'assets/characters/mama_stage_standing.png';
      let h = '265px';
      if (pose === 'sit') {
        imgSrc = 'assets/characters/mama_stage_sitting.png';
        h = '235px';
      }
      return `<img src="${imgSrc}" class="pixel-art stage-character-img" style="height: ${h}; max-width: 100%; object-fit: contain; pointer-events: none;" alt="Mama" />`;
    },

    buGun: (pose = 'stand') => {
      let imgSrc = 'assets/characters/bugun_stage_standing.png';
      let h = '265px';
      if (pose === 'walk') {
        imgSrc = 'assets/characters/bugun_stage_walking.png';
        h = '250px';
      }
      return `<img src="${imgSrc}" class="pixel-art stage-character-img" style="height: ${h}; max-width: 100%; object-fit: contain; pointer-events: none;" alt="Bu Gun" />`;
    },

    // Motorcycle (Papa's motor matic)
    motorcycle: () => `
      <svg viewBox="0 0 100 64" width="100%" height="100%" shape-rendering="crispEdges">
        <circle cx="22" cy="46" r="14" fill="#2c3e50" />
        <circle cx="22" cy="46" r="8" fill="#95a5a6" />
        <circle cx="22" cy="46" r="3" fill="#2c3e50" />
        <circle cx="78" cy="46" r="14" fill="#2c3e50" />
        <circle cx="78" cy="46" r="8" fill="#95a5a6" />
        <circle cx="78" cy="46" r="3" fill="#2c3e50" />
        <rect x="32" y="36" width="36" height="12" fill="#2c3e50" rx="3" />
        <path d="M 68 48 L 74 24 L 62 24 L 56 36 Z" fill="#e74c3c" />
        <rect x="34" y="24" width="28" height="8" fill="#2d3436" rx="4" />
        <polygon points="74,24 82,18 78,16 70,22" fill="#e74c3c" />
        <circle cx="82" cy="18" r="5" fill="#f1c40f" />
        <rect x="70" y="14" width="10" height="3" fill="#34495e" />
        <rect x="24" y="44" width="22" height="4" fill="#bdc3c7" />
        <rect x="18" y="43" width="8" height="6" fill="#7f8c8d" />
      </svg>
    `,

    // Calico Cat (Mimi)
    calicoCat: (state = 'sit') => `
      <svg viewBox="0 0 56 46" width="100%" height="100%" shape-rendering="crispEdges">
        <ellipse cx="28" cy="42" rx="18" ry="3" fill="#1e272e" opacity="0.3" />
        <path d="M 44 32 Q 54 22 50 14" stroke="#e67e22" stroke-width="4" stroke-linecap="round" fill="none" />
        <ellipse cx="28" cy="28" rx="16" ry="12" fill="#ffffff" />
        <path d="M 22 18 Q 30 18 32 26 Q 22 32 18 24 Z" fill="#e67e22" />
        <path d="M 32 20 Q 40 22 38 32 Q 32 32 32 24 Z" fill="#2c3e50" />
        <circle cx="16" cy="18" r="10" fill="#ffffff" />
        <polygon points="10,12 14,4 18,10" fill="#e67e22" />
        <polygon points="18,10 22,4 24,12" fill="#2c3e50" />
        <rect x="12" y="15" width="2" height="3" fill="#27ae60" />
        <rect x="18" y="15" width="2" height="3" fill="#27ae60" />
        <polygon points="15,20 14,19 16,19" fill="#ff9999" />
        <rect x="16" y="24" width="8" height="3" fill="#e74c3c" />
        <circle cx="20" cy="26" r="2" fill="#f1c40f" />
        <rect x="18" y="34" width="4" height="8" fill="#ffffff" />
        <rect x="26" y="34" width="4" height="8" fill="#ffffff" />
        <rect x="36" y="34" width="4" height="8" fill="#ffffff" />
      </svg>
    `,

    // Grey Cat (Milo)
    greyCat: (state = 'sit') => `
      <svg viewBox="0 0 56 46" width="100%" height="100%" shape-rendering="crispEdges">
        <ellipse cx="28" cy="42" rx="18" ry="3" fill="#1e272e" opacity="0.3" />
        <path d="M 44 32 Q 54 18 48 10" stroke="#7f8c8d" stroke-width="4" stroke-linecap="round" fill="none" />
        <ellipse cx="28" cy="28" rx="16" ry="12" fill="#95a5a6" />
        <circle cx="16" cy="18" r="10" fill="#95a5a6" />
        <polygon points="10,12 14,4 18,10" fill="#7f8c8d" />
        <polygon points="18,10 22,4 24,12" fill="#7f8c8d" />
        <rect x="12" y="15" width="2" height="3" fill="#f39c12" />
        <rect x="18" y="15" width="2" height="3" fill="#f39c12" />
        <polygon points="15,20 14,19 16,19" fill="#ff9999" />
        <rect x="16" y="24" width="8" height="3" fill="#3498db" />
        <circle cx="20" cy="26" r="2" fill="#f1c40f" />
        <rect x="18" y="34" width="4" height="8" fill="#95a5a6" />
        <rect x="26" y="34" width="4" height="8" fill="#95a5a6" />
        <rect x="36" y="34" width="4" height="8" fill="#95a5a6" />
      </svg>
    `
  },

  // Interactive items, shoes, home clothes, meals, and snacks
  items: {
    // Scene 3: School Shoes (Pink, Putih, Biru)
    shoe: (color = 'pink') => {
      const colors = {
        pink: '#ff7675',
        putih: '#ffffff',
        biru: '#74b9ff'
      };
      const fill = colors[color] || '#ff7675';
      return `
        <svg viewBox="0 0 54 40" width="100%" height="100%" shape-rendering="crispEdges">
          <ellipse cx="27" cy="34" rx="20" ry="4" fill="#1e272e" opacity="0.3" />
          <path d="M 8 28 L 12 14 L 24 14 L 30 22 L 44 22 L 46 30 L 6 30 Z" fill="${fill}" stroke="#2d3436" stroke-width="2" rx="4" />
          <circle cx="18" cy="20" r="3" fill="#ffffff" />
          <line x1="22" y1="18" x2="30" y2="18" stroke="#ffffff" stroke-width="3" />
          <rect x="6" y="28" width="40" height="4" fill="#dfe6e9" stroke="#2d3436" stroke-width="1" />
        </svg>
      `;
    },

    // Scene 6: 6 Pilihan Pakaian Rumah
    homeClothes: {
      pink_flowers: () => `<img src="assets/characters/arabel_stage_pink.png" class="item-crop-img" style="object-fit: contain; padding: 4px;" alt="Pink Bunga" />`,
      red_flowers: () => `<img src="assets/characters/arabel_stage_red.png" class="item-crop-img" style="object-fit: contain; padding: 4px;" alt="Merah Bunga" />`,
      mancity: () => `<img src="assets/characters/arabel_stage_mancity.png" class="item-crop-img" style="object-fit: contain; padding: 4px;" alt="Jersey Man City" />`,
      daster_batik: () => `<img src="assets/characters/arabel_stage_daster.png" class="item-crop-img" style="object-fit: contain; padding: 4px;" alt="Daster Batik" />`,
      kutang_putih: () => `<img src="assets/characters/arabel_stage_pink.png" class="item-crop-img" style="object-fit: contain; padding: 4px;" alt="Kutang Putih" />`,
      black_cat: () => `<img src="assets/characters/arabel_stage_blackcat.png" class="item-crop-img" style="object-fit: contain; padding: 4px;" alt="Kaus Hitam Kucing" />`
    },

    // Scene 7: Cat Food Bowl
    catFoodBowl: (filled = true) => `
      <svg viewBox="0 0 54 36" width="100%" height="100%" shape-rendering="crispEdges">
        <ellipse cx="27" cy="28" rx="22" ry="6" fill="#c0392b" stroke="#78281f" stroke-width="2" />
        ${filled ? '<ellipse cx="27" cy="24" rx="17" ry="5" fill="#d35400" /><circle cx="23" cy="23" r="2.5" fill="#f39c12" /><circle cx="31" cy="24" r="2.5" fill="#f39c12" />' : ''}
        <path d="M 5 20 Q 27 14 49 20 L 44 28 Q 27 33 10 28 Z" fill="#e74c3c" />
        <circle cx="27" cy="21" r="3.5" fill="#ffffff" />
      </svg>
    `,

    // Scene 5: Minimarket Items (from user's stock photo)
    snacks: {
      es_krim: () => `<img src="assets/items/es_krim.jpg" class="item-crop-img" alt="Es Krim Paddle Pop" />`,
      yogurt: () => `<img src="assets/items/yogurt.jpg" class="item-crop-img" alt="Yogurt Cimory" />`,
      snack: () => `<img src="assets/items/snack.jpg" class="item-crop-img" alt="Snack French Fries" />`,
      permen: () => `<img src="assets/items/permen.jpg" class="item-crop-img" alt="Permen Yupi Neon Stix" />`,
      mie_instan: () => `<img src="assets/items/mie_instan.jpg" class="item-crop-img" alt="Mie Instan Pop Mie" />`,
      teh_kotak: () => `<img src="assets/items/teh_kotak.jpg" class="item-crop-img" alt="Teh Kotak" />`
    },
    minimarket: {
      eskrim: () => `<img src="assets/items/es_krim.jpg" class="item-crop-img" alt="Es Krim Paddle Pop" />`,
      yogurt: () => `<img src="assets/items/yogurt.jpg" class="item-crop-img" alt="Yogurt Cimory" />`,
      snack: () => `<img src="assets/items/snack.jpg" class="item-crop-img" alt="Snack French Fries" />`,
      permen: () => `<img src="assets/items/permen.jpg" class="item-crop-img" alt="Permen Yupi Neon Stix" />`,
      mieinstan: () => `<img src="assets/items/mie_instan.jpg" class="item-crop-img" alt="Mie Instan Pop Mie" />`,
      tehkotak: () => `<img src="assets/items/teh_kotak.jpg" class="item-crop-img" alt="Teh Kotak" />`
    },

    // Scene 8: Meals
    meals: {
      nasi_telur: () => `
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <ellipse cx="32" cy="46" rx="28" ry="12" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="3" />
          <ellipse cx="28" cy="42" rx="16" ry="7" fill="#ffffff" />
          <ellipse cx="36" cy="38" rx="14" ry="8" fill="#f39c12" stroke="#d35400" stroke-width="2" />
          <circle cx="34" cy="36" r="4" fill="#f1c40f" />
          <path d="M 24 38 Q 30 32 38 42" stroke="#c0392b" stroke-width="3" fill="none" stroke-linecap="round" />
        </svg>
      `,
      pasta_keju: () => `
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <ellipse cx="32" cy="46" rx="28" ry="12" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="3" />
          <ellipse cx="32" cy="40" rx="18" ry="8" fill="#f1c40f" />
          <path d="M 20 40 Q 32 30 44 40" stroke="#f39c12" stroke-width="4" fill="none" />
          <path d="M 22 36 Q 32 44 42 36" stroke="#ffffff" stroke-width="3" fill="none" />
          <circle cx="28" cy="36" r="3" fill="#e74c3c" />
          <circle cx="36" cy="40" r="3" fill="#2ecc71" />
        </svg>
      `,
      mie_goreng: () => `
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <ellipse cx="32" cy="46" rx="28" ry="12" fill="#2c3e50" stroke="#1a252f" stroke-width="3" />
          <ellipse cx="32" cy="40" rx="20" ry="9" fill="#d35400" />
          <path d="M 18 38 Q 32 30 46 38" stroke="#f39c12" stroke-width="3" fill="none" />
          <path d="M 20 42 Q 32 48 44 42" stroke="#f1c40f" stroke-width="3" fill="none" />
          <circle cx="38" cy="36" r="5" fill="#f1c40f" stroke="#ffffff" stroke-width="2" />
          <rect x="22" y="34" width="6" height="4" fill="#e74c3c" rx="1" />
          <rect x="26" y="42" width="6" height="3" fill="#2ecc71" rx="1" />
        </svg>
      `
    }
  }
};

window.SPRITES = SPRITES;
