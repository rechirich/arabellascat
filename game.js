// game.js - Core State Machine with Harvest Moon / Stardew Valley Dialogue Template
// Full pixel art character sprites from reference sheets for both dialogue and stage!
// 100% Child-Friendly Touch / Mouse Controls with perfectly calibrated stage positions

class ArabellasCatGame {
  constructor() {
    this.dayCount = 1;
    this.timeStr = '06:00';
    this.daysOfWeek = ['Sabtu', 'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    // Player choices for the current day
    this.currentOutfit = 'pajamas';
    this.chosenShoes = 'pink';
    this.chosenSnacks = [];
    this.chosenHomeClothes = 'pink_flowers';
    this.chosenCatFeeding = 'both';
    this.chosenMeal = 'nasi_telur';
    this.chosenEvening = 'dance';

    // Minigame & UI states
    this.typewriterTimer = null;
    this.isTyping = false;

    // DOM Elements
    this.viewport = document.getElementById('scene-viewport');
    this.mainBg = document.getElementById('main-bg');
    this.stage = document.getElementById('interactive-stage');
    this.dialogueContainer = document.getElementById('dialogue-container');
    this.speakerBustContainer = document.getElementById('speaker-bust-container');
    this.speakerBustImg = document.getElementById('speaker-bust-img');
    this.speakerNameBadge = document.getElementById('speaker-name-badge');
    this.dialogueText = document.getElementById('dialogue-text');
    this.dialogueAction = document.getElementById('dialogue-action');
    this.overlayScreen = document.getElementById('overlay-screen');
    this.fadeBlack = document.getElementById('fade-black');

    // HUD Elements
    this.hudDay = document.getElementById('hud-day');
    this.hudTime = document.getElementById('hud-time');
    this.hudDial = document.getElementById('hud-dial');
    this.hudLocation = document.getElementById('hud-location');
    this.btnMute = document.getElementById('btn-mute');

    // Cleaned High-Resolution Character Busts Map (ZERO dust/dots!)
    this.busts = {
      // Arabella School
      arabel_school_normal: 'assets/characters/arabel_dialogue_school_normal.png',
      arabel_school_happy: 'assets/characters/arabel_dialogue_school_happy.png',
      arabel_school_curious: 'assets/characters/arabel_dialogue_school_curious.png',

      // Arabella Morning / Pajamas / Big High-Res
      arabel_pink_big: 'assets/characters/arabel_dialogue_pink_big.png',
      arabel_pink_happy: 'assets/characters/arabel_dialogue_pink_happy.png',
      arabel_sleep_face: 'assets/characters/arabel_dialogue_sleep_face.png',
      arabel_surprised: 'assets/characters/arabel_dialogue_surprised_face.png',
      arabel_happy_face: 'assets/characters/arabel_dialogue_happy_face.png',
      arabel_pout_face: 'assets/characters/arabel_dialogue_pout_face.png',
      arabel_wink_face: 'assets/characters/arabel_dialogue_wink_face.png',

      // Arabella Outfits
      arabel_red_happy: 'assets/characters/arabel_dialogue_red_happy.png',
      arabel_red_curious: 'assets/characters/arabel_dialogue_red_curious.png',
      arabel_meow_peace: 'assets/characters/arabel_dialogue_meow_peace.png',
      arabel_batik_sit: 'assets/characters/arabel_dialogue_batik_sit.png',

      // Fallback aliases
      arabel_normal: 'assets/characters/arabel_dialogue_school_normal.png',
      arabel_happy: 'assets/characters/arabel_dialogue_school_happy.png',
      arabel_curious: 'assets/characters/arabel_dialogue_school_curious.png',
      arabel_big_pink: 'assets/characters/arabel_dialogue_pink_big.png',

      // Papa
      papa_normal: 'assets/characters/papa_dialogue_normal.png',
      papa_happy: 'assets/characters/papa_dialogue_happy.png',
      papa_phone: 'assets/characters/papa_dialogue_phone.png',

      // Mama
      mama_normal: 'assets/characters/mama_dialogue_normal.png',
      mama_happy: 'assets/characters/mama_dialogue_happy.png',
      mama_waving: 'assets/characters/mama_dialogue_waving.png',

      // Bu Gun
      bugun_thinking: 'assets/characters/bugun_dialogue_thinking.png',
      bugun_waving: 'assets/characters/bugun_dialogue_waving.png',
      bugun_welcome: 'assets/characters/bugun_dialogue_welcome.png'
    };

    this.init();
  }

  getArabelBust(emotion = 'happy') {
    if (this.currentOutfit === 'school') {
      if (emotion === 'curious' || emotion === 'thinking') return 'arabel_school_curious';
      if (emotion === 'happy') return 'arabel_school_happy';
      return 'arabel_school_normal';
    }
    if (this.chosenHomeClothes === 'red_flowers') {
      if (emotion === 'curious' || emotion === 'thinking') return 'arabel_red_curious';
      return 'arabel_red_happy';
    }
    if (this.chosenHomeClothes === 'black_cat') {
      if (emotion === 'happy') return 'arabel_meow_peace';
      if (emotion === 'curious') return 'arabel_surprised';
      return 'arabel_happy_face';
    }
    if (this.chosenHomeClothes === 'daster_batik') {
      if (emotion === 'eating' || emotion === 'happy' || emotion === 'curious') return 'arabel_batik_sit';
      return 'arabel_happy_face';
    }
    if (emotion === 'sleepy') return 'arabel_sleep_face';
    if (emotion === 'happy') return 'arabel_pink_happy';
    if (emotion === 'curious') return 'arabel_surprised';
    return 'arabel_pink_big';
  }

  init() {
    // Sound mute toggle
    if (this.btnMute) {
      this.btnMute.addEventListener('click', () => {
        const isMuted = window.soundEngine.toggleMute();
        this.btnMute.innerHTML = isMuted ? '🔇 Bisu' : '🔊 Musik';
      });
    }

    // Touch / Click on dialogue box to finish typewriter or trigger action
    if (this.dialogueContainer) {
      this.dialogueContainer.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
          if (this.isTyping) {
            this.finishTypewriterImmediately();
          } else if (this.currentOnAction) {
            window.soundEngine.playTap();
            this.currentOnAction();
          }
        }
      });
    }

    this.showTitleScreen();
  }

  updateHud(time, locationTag = 'Rumah Cluster 2-Lantai', isNight = false) {
    this.timeStr = time;
    const dayName = this.daysOfWeek[(this.dayCount - 1) % this.daysOfWeek.length];
    if (this.hudDay) this.hudDay.innerText = `${dayName} (Hari ${this.dayCount})`;
    if (this.hudTime) this.hudTime.innerText = this.timeStr;
    if (this.hudDial) {
      this.hudDial.innerText = isNight ? '🌙' : '☀️';
      this.hudDial.style.background = isNight ? '#0c2461' : '#74b9ff';
    }
    if (this.hudLocation) this.hudLocation.innerText = locationTag;
  }

  // Harvest Moon / Stardew Dialogue Box with Large Clean Half-Body Character Bust
  setDialogue(speaker, text, bustKey, actionBtnText = 'Lanjut ➡', onAction = null) {
    this.dialogueContainer.style.display = 'flex';
    this.speakerNameBadge.innerText = speaker;

    let resolvedKey = bustKey;
    if (speaker === 'Arabella') {
      if (bustKey === 'arabel_happy' || bustKey === 'happy') resolvedKey = this.getArabelBust('happy');
      else if (bustKey === 'arabel_curious' || bustKey === 'curious') resolvedKey = this.getArabelBust('curious');
      else if (bustKey === 'arabel_sleepy' || bustKey === 'sleepy') resolvedKey = this.getArabelBust('sleepy');
      else if (bustKey === 'arabel_normal') resolvedKey = this.getArabelBust('normal');
      else if (!this.busts[bustKey]) resolvedKey = this.getArabelBust('happy');
    }

    // Set Character Bust Image
    if (this.busts[resolvedKey]) {
      this.speakerBustContainer.innerHTML = `<img id="speaker-bust-img" src="${this.busts[resolvedKey]}" class="pixel-art" alt="${speaker}" />`;
    } else if (bustKey === 'calico_cat') {
      this.speakerBustContainer.innerHTML = `<div style="width: 220px; height: 180px; margin-bottom: 20px;">${window.SPRITES.characters.calicoCat()}</div>`;
    } else if (bustKey === 'grey_cat') {
      this.speakerBustContainer.innerHTML = `<div style="width: 220px; height: 180px; margin-bottom: 20px;">${window.SPRITES.characters.greyCat()}</div>`;
    } else {
      this.speakerBustContainer.innerHTML = `<img id="speaker-bust-img" src="assets/characters/arabel_dialogue_pink_big.png" class="pixel-art" alt="${speaker}" />`;
    }

    this.dialogueAction.innerHTML = '';
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);

    this.fullText = text;
    this.dialogueText.textContent = '';
    this.isTyping = true;
    let idx = 0;

    this.typewriterTimer = setInterval(() => {
      if (idx < text.length) {
        idx++;
        this.dialogueText.textContent = text.slice(0, idx);
        if (idx % 3 === 0) window.soundEngine.playTone(340, 'sine', 0.03, 0.04, 0.001);
      } else {
        clearInterval(this.typewriterTimer);
        this.isTyping = false;
        this.showDialogueButton(actionBtnText, onAction);
      }
    }, 18);

    this.currentOnAction = onAction;
    this.currentActionText = actionBtnText;
  }

  finishTypewriterImmediately() {
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.dialogueText.textContent = this.fullText;
    this.isTyping = false;
    this.showDialogueButton(this.currentActionText, this.currentOnAction);
  }

  showDialogueButton(btnText, onAction) {
    if (!btnText || !onAction) return;
    this.dialogueAction.innerHTML = `
      <button class="stardew-btn" id="btn-dialogue-action">${btnText}</button>
      <span class="stardew-heart-indicator" id="dialogue-heart">❤️</span>
    `;

    const btn = document.getElementById('btn-dialogue-action');
    if (btn) {
      btn.onclick = (e) => {
        e.stopPropagation();
        window.soundEngine.playTap();
        onAction();
      };
    }

    const heart = document.getElementById('dialogue-heart');
    if (heart) {
      heart.onclick = (e) => {
        e.stopPropagation();
        window.soundEngine.playTap();
        onAction();
      };
    }
  }

  hideDialogue() {
    this.dialogueContainer.style.display = 'none';
  }

  setSceneBackground(bgData) {
    if (bgData.type === 'image') {
      this.mainBg.style.backgroundImage = `url('${bgData.src}')`;
      this.mainBg.innerHTML = '';
    } else {
      this.mainBg.style.backgroundImage = 'none';
      this.mainBg.innerHTML = bgData.html;
    }
    if (bgData.location && this.hudLocation) {
      this.hudLocation.innerText = bgData.location;
    }
  }

  fadeTransition(callback) {
    this.fadeBlack.classList.add('active');
    setTimeout(() => {
      callback();
      setTimeout(() => {
        this.fadeBlack.classList.remove('active');
      }, 350);
    }, 600);
  }

  // ==========================================
  // TITLE SCREEN
  // ==========================================
  showTitleScreen() {
    this.overlayScreen.classList.remove('hidden');
    this.overlayScreen.innerHTML = `
      <div style="width: 170px; height: 170px; margin-bottom: 10px;">
        <img src="assets/characters/arabel_dialogue_pink_big.png" style="width: 100%; height: 100%; object-fit: contain; image-rendering: pixelated;" alt="Arabella" />
      </div>
      <h1 class="pixel-title">Arabella's Cat</h1>
      <p class="pixel-subtitle">Petualangan Keseharian Arabella & Kucing Imut</p>

      <div style="display: flex; gap: 24px; margin-bottom: 24px;">
        <div style="width: 75px; height: 55px;">${window.SPRITES.characters.calicoCat()}</div>
        <div style="width: 75px; height: 55px;">${window.SPRITES.characters.greyCat()}</div>
      </div>

      <button id="btn-start" class="stardew-btn gold" style="font-size: 28px; padding: 14px 40px;">
        ▶ MULAI BERMAIN
      </button>
      <p style="margin-top: 14px; color: #ffeaa7; font-size: 20px;">
        🎮 100% Ramah Anak: Sentuh layar di iPad / klik mouse di PC!
      </p>
    `;

    document.getElementById('btn-start').onclick = () => {
      window.soundEngine.playTap();
      window.soundEngine.playBgm('morning');
      this.overlayScreen.classList.add('hidden');
      this.startDay();
    };
  }

  // ==========================================
  // DAY START LOOP
  // ==========================================
  startDay() {
    this.updateHud('06:00', 'Rumah Cluster 2-Lantai', false);
    this.currentOutfit = 'pajamas';
    this.chosenSnacks = [];
    this.scene1_PapaAntarMama();
  }

  // ==========================================
  // SCENE 1: PUKUL 06:00 PAGI - PAPA MENGANTAR MAMA (RUMAH CLUSTER)
  // Stage position: bottom: 175px (stands proudly on driveway pavement)
  // ==========================================
  scene1_PapaAntarMama() {
    this.updateHud('06:00', 'Rumah Cluster 2-Lantai', false);
    window.soundEngine.playBgm('morning');
    this.setSceneBackground(window.BACKGROUNDS.frontHouseMorning());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 175px; left: 360px; width: 180px; height: 115px; z-index: 12;">
        ${window.SPRITES.characters.motorcycle()}
      </div>
      <div style="position: absolute; bottom: 175px; left: 540px; z-index: 14;">
        ${window.SPRITES.characters.papa('phone')}
      </div>
      <div style="position: absolute; bottom: 175px; left: 690px; z-index: 14;">
        ${window.SPRITES.characters.mama('stand')}
      </div>
    `;

    this.setDialogue(
      'Mama',
      'Papa, Mama berangkat kerja dulu ya. Jam 6 pagi harus sudah jalan agar tidak terlambat ke kantor.',
      'mama_normal',
      'Iya Mama, Papa Antar Naik Motor 🛵',
      () => {
        this.setDialogue(
          'Papa',
          'Iya Mama sayang, ayo naik motor matic. Papa antar sampai depan stasiun ya!',
          'papa_happy',
          'Berangkat Antar Mama 🛵',
          () => {
            window.soundEngine.playMotor();
            this.stage.innerHTML = `
              <div id="motor-depart" style="position: absolute; bottom: 175px; left: 450px; width: 220px; height: 200px; z-index: 15; transition: transform 2.2s ease-in;">
                <div style="position: absolute; width: 180px; height: 115px; bottom: 0; left: 0;">
                  ${window.SPRITES.characters.motorcycle()}
                </div>
                <div style="position: absolute; bottom: 50px; left: 55px;">
                  ${window.SPRITES.characters.papa('walk')}
                </div>
              </div>
            `;

            setTimeout(() => {
              const m = document.getElementById('motor-depart');
              if (m) m.style.transform = 'translateX(-700px)';
            }, 100);

            setTimeout(() => {
              this.stage.innerHTML = `
                <div style="position: absolute; bottom: 175px; left: 560px; z-index: 14;">
                  ${window.SPRITES.characters.papa('stand')}
                </div>
              `;
              this.setDialogue(
                'Papa',
                'Alhamdulillah sudah antar Mama. Sekarang pukul 06:15, saatnya Papa naik ke lantai 2 bangunkan Arabel untuk mandi di bak mandi!',
                'papa_phone',
                'Naik ke Lantai 2 ➡',
                () => this.scene2_BangunkanArabel()
              );
            }, 2400);
          }
        );
      }
    );
  }

  // ==========================================
  // SCENE 2: LANTAI 2 - BANGUNKAN ARABELLA (KAMAR TIDUR LANTAI 2)
  // Stage position: Arabella on the bed mattress, Papa standing beside bed
  // ==========================================
  scene2_BangunkanArabel() {
    this.updateHud('06:15', 'Kamar Arabella (Lantai 2)', false);
    this.setSceneBackground(window.BACKGROUNDS.bedroomFloor2());

    this.stage.innerHTML = `
      <div id="arabel-bed" style="position: absolute; bottom: 275px; left: 240px; cursor: pointer; z-index: 20;">
        <img src="assets/characters/arabel_stage_sleeping.png" class="pixel-art stage-character-img" style="height: 160px;" alt="Arabella Tidur" />
        <div class="sleep-z" style="top: -25px; right: 10px;">Zzz...</div>
      </div>
      <div style="position: absolute; bottom: 180px; left: 560px; z-index: 18;">
        ${window.SPRITES.characters.papa('stand')}
      </div>
      <div style="position: absolute; top: 80px; left: 230px; background: #ffeaa7; padding: 8px 18px; border: 3px solid #78350f; border-radius: 10px; font-weight: bold; font-size: 22px; z-index: 25; box-shadow: 0 4px 0 #3e1f08;">
        👆 Sentuh Arabel untuk bangun!
      </div>
    `;

    this.setDialogue(
      'Papa',
      'Arabel sayang... bangun yuk nak, sudah pagi. Saatnya kita mandi air hangat di bak mandi lantai 2!',
      'papa_happy',
      null,
      null
    );

    const arabelBed = document.getElementById('arabel-bed');
    arabelBed.onclick = () => {
      window.soundEngine.playTap();
      window.soundEngine.playSparkle();

      this.setDialogue(
        'Arabella',
        'Hoaaam... Selamat pagi Papa! Arabel bangun dan siap mandi air hangat di bak mandi!',
        'arabel_happy',
        'Pergi ke Kamar Mandi Lantai 2 🛁',
        () => this.scene2_BakMandi()
      );
    };
  }

  // ==========================================
  // SCENE 2B: KAMAR MANDI LANTAI 2 - MANDI DI BAK MANDI
  // Stage position: Arabella by the purple bucket, rubber duck & bubbles floating
  // ==========================================
  scene2_BakMandi() {
    this.updateHud('06:25', 'Kamar Mandi (Lantai 2)', false);
    window.soundEngine.playSplash();
    this.setSceneBackground(window.BACKGROUNDS.bathroomFloor2());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 360px; z-index: 22;">
        <img src="assets/characters/arabel_stage_pink.png" class="pixel-art stage-character-img" style="height: 220px;" alt="Arabella Mandi" />
      </div>

      <div class="rubber-duck" id="rubber-duck" style="bottom: 195px; left: 550px; width: 70px; height: 55px; z-index: 25;">
        <svg viewBox="0 0 48 40" width="100%" height="100%">
          <ellipse cx="22" cy="24" rx="16" ry="12" fill="#f1c40f" />
          <circle cx="32" cy="14" r="10" fill="#f1c40f" />
          <polygon points="38,16 48,16 42,12" fill="#e67e22" />
          <circle cx="34" cy="11" r="2" fill="#000" />
        </svg>
      </div>

      <div class="soap-bubble" style="bottom: 260px; left: 340px;" onclick="window.game.popBubble(this)">🫧</div>
      <div class="soap-bubble" style="bottom: 330px; left: 450px;" onclick="window.game.popBubble(this)">🫧</div>
      <div class="soap-bubble" style="bottom: 270px; left: 620px;" onclick="window.game.popBubble(this)">🫧</div>
      <div class="soap-bubble" style="bottom: 370px; left: 540px;" onclick="window.game.popBubble(this)">🫧</div>
    `;

    document.getElementById('rubber-duck').onclick = () => {
      window.soundEngine.playDuckQuack();
      const heart = document.createElement('div');
      heart.className = 'heart-emote';
      heart.innerText = '💛 Kwek!';
      heart.style.left = '560px';
      heart.style.bottom = '260px';
      this.stage.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
    };

    this.setDialogue(
      'Arabella',
      'Byur byur! Segarnya berendam air hangat berbusa! Ada bebek karet kwek-kwek dan gelembung sabun yang bisa diletuskan!',
      'arabel_happy',
      'Selesai Mandi & Turun ke Lantai 1 🧼',
      () => this.scene3_PakaiBajuDanSepatu()
    );
  }

  popBubble(elem) {
    window.soundEngine.playBubblePop();
    elem.style.transform = 'scale(1.6)';
    elem.style.opacity = '0';
    setTimeout(() => elem.remove(), 200);
  }

  // ==========================================
  // SCENE 3: LANTAI 1 - PAKAI SERAGAM & PILIH SEPATU
  // Stage position: Papa at 400px, Arabella at 560px, bottom: 180px (full height!)
  // ==========================================
  scene3_PakaiBajuDanSepatu() {
    this.updateHud('06:45', 'Ruang Ganti (Lantai 1)', false);
    this.setSceneBackground(window.BACKGROUNDS.dressingRoomFloor1());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 400px; z-index: 14;">
        ${window.SPRITES.characters.papa('stand')}
      </div>
      <div id="arabel-sprite" style="position: absolute; bottom: 180px; left: 560px; z-index: 14;">
        ${window.SPRITES.characters.arabella('pajamas', this.chosenShoes)}
      </div>

      <div id="school-dress-action" style="position: absolute; top: 60px; right: 50px; background: #fff3cd; border: 4px solid #78350f; border-radius: 12px; padding: 16px; width: 340px; text-align: center; box-shadow: 0 6px 0 #3e2723; z-index: 25;">
        <h3 style="font-size: 22px; color: #b33939; margin-bottom: 8px;">Pakaian Sekolah</h3>
        <p style="font-size: 18px; margin-bottom: 12px; color: #333;">Atasan kotak-kotak biru muda & rok biru muda</p>
        <button id="btn-wear-uniform" class="stardew-btn gold" style="width: 100%; justify-content: center; font-size: 22px; padding: 10px 16px;">
          👗 Ambil & Pakai Seragam
        </button>
      </div>
    `;

    this.setDialogue(
      'Papa',
      'Kita sudah di lantai 1. Ayo Arabel ambil seragam sekolahnya dan pakai yang rapi!',
      'papa_normal',
      null,
      null
    );

    document.getElementById('btn-wear-uniform').onclick = () => {
      window.soundEngine.playSparkle();
      this.currentOutfit = 'school';
      const dressPanel = document.getElementById('school-dress-action');
      if (dressPanel) dressPanel.style.display = 'none';

      const arabelElem = document.getElementById('arabel-sprite');
      if (arabelElem) {
        arabelElem.innerHTML = window.SPRITES.characters.arabella('school', this.chosenShoes);
      }

      this.setDialogue(
        'Arabella',
        'Lihat Papa! Seragam kotak-kotak biru muda dan rok biru mudaku sudah terpasang cantik!',
        'arabel_happy',
        'Pilih Sepatu Sekolah 👟',
        () => this.scene3_PilihSepatu()
      );
    };
  }

  scene3_PilihSepatu() {
    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 360px; z-index: 14;">
        ${window.SPRITES.characters.papa('stand')}
      </div>
      <div id="arabel-sprite" style="position: absolute; bottom: 180px; left: 510px; z-index: 14;">
        ${window.SPRITES.characters.arabella('school', this.chosenShoes)}
      </div>

      <div class="selection-grid grid-3" style="position: absolute; top: 50px; right: 40px; width: 460px; z-index: 25;">
        <div class="select-card shoe-card ${this.chosenShoes === 'pink' ? 'selected' : ''}" data-color="pink" onclick="window.game.selectShoe('pink')">
          <div class="badge-check">✓</div>
          <div class="card-icon">${window.SPRITES.items.shoe('pink')}</div>
          <div class="card-title">Sepatu Pink</div>
        </div>
        <div class="select-card shoe-card ${this.chosenShoes === 'putih' ? 'selected' : ''}" data-color="putih" onclick="window.game.selectShoe('putih')">
          <div class="badge-check">✓</div>
          <div class="card-icon">${window.SPRITES.items.shoe('putih')}</div>
          <div class="card-title">Sepatu Putih</div>
        </div>
        <div class="select-card shoe-card ${this.chosenShoes === 'biru' ? 'selected' : ''}" data-color="biru" onclick="window.game.selectShoe('biru')">
          <div class="badge-check">✓</div>
          <div class="card-icon">${window.SPRITES.items.shoe('biru')}</div>
          <div class="card-title">Sepatu Biru</div>
        </div>
      </div>
    `;

    this.setDialogue(
      'Arabella',
      'Hmm... sepatu warna apa yang paling cocok untuk hari ini ya? Pink manis, putih bersih, atau biru keren?',
      'arabel_curious',
      'Siap Berangkat Sekolah ➡',
      () => this.scene4_BerangkatSekolah()
    );
  }

  selectShoe(color) {
    window.soundEngine.playTap();
    window.soundEngine.playSparkle();
    this.chosenShoes = color;

    // Instantly update selected visual states
    document.querySelectorAll('.shoe-card').forEach(c => {
      c.classList.toggle('selected', c.getAttribute('data-color') === color);
    });

    const shoeNames = { pink: 'Pink Manis', putih: 'Putih Bersih', biru: 'Biru Keren' };
    const name = shoeNames[color] || color;

    // Instantly show next button and cute dialogue without typewriter delay
    if (this.typewriterTimer) clearInterval(this.typewriterTimer);
    this.isTyping = false;
    this.fullText = `Arabel memilih Sepatu ${name}! Cantik sekali dan siap berangkat sekolah!`;
    this.dialogueText.textContent = this.fullText;
    this.showDialogueButton('Siap Berangkat Sekolah ➡', () => this.scene4_BerangkatSekolah());
  }

  // ==========================================
  // SCENE 4: BERANGKAT SEKOLAH DIANTAR PAPA (KB-TK PERMATA HATI)
  // Stage position: Motorcycle with Papa & Arabella in front of school gate
  // ==========================================
  scene4_BerangkatSekolah() {
    this.updateHud('07:30', 'KB-TK Permata Hati', false);
    window.soundEngine.playMotor();
    this.setSceneBackground(window.BACKGROUNDS.school());

    this.stage.innerHTML = `
      <div id="school-motor" style="position: absolute; bottom: 180px; left: 460px; width: 250px; height: 210px; z-index: 15;">
        <div style="position: absolute; width: 190px; height: 120px; bottom: 0; left: 0;">
          ${window.SPRITES.characters.motorcycle()}
        </div>
        <div style="position: absolute; bottom: 50px; left: 75px;">
          ${window.SPRITES.characters.papa('stand')}
        </div>
        <div style="position: absolute; bottom: 40px; left: 15px;">
          ${window.SPRITES.characters.arabella('school', this.chosenShoes)}
        </div>
      </div>
    `;

    this.setDialogue(
      'Arabella',
      'Brum brum! Sampai di KB-TK Permata Hati! Daa Papa, Arabel masuk kelas belajar dan bermain dulu ya!',
      'arabel_happy',
      'Belajar & Bermain Gembira 🎒',
      () => {
        this.fadeTransition(() => {
          this.scene5_DijemputBuGunMinimarket();
        });
      }
    );
  }

  // ==========================================
  // SCENE 5: DIJEMPUT BU GUN & MAMPIR KE MINI MARKET (INDOMARET - KOTA)
  // ==========================================
  scene5_DijemputBuGunMinimarket() {
    this.updateHud('11:30', 'KB-TK Permata Hati', false);
    this.setSceneBackground(window.BACKGROUNDS.school());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 460px; z-index: 15;">
        ${window.SPRITES.characters.buGun('stand')}
      </div>
      <div style="position: absolute; bottom: 180px; left: 630px; z-index: 15;">
        ${window.SPRITES.characters.arabella('school', this.chosenShoes, 'walk')}
      </div>
    `;

    this.setDialogue(
      'Bu Gun',
      'Halo non Arabel yang pintar! Bu Gun sudah jemput. Yuk kita pulang, tapi kita mampir mini market dulu ya beli jajanan!',
      'bugun_waving',
      'Mampir ke Mini Market 🛒',
      () => {
        this.fadeTransition(() => {
          this.scene5_InsideMinimarket();
        });
      }
    );
  }

  scene5_InsideMinimarket() {
    this.updateHud('11:45', 'Indomaret - Kota', false);
    window.soundEngine.playBgm('shop');
    this.setSceneBackground(window.BACKGROUNDS.minimarket());
    this.chosenSnacks = [];

    this.renderMinimarketStage();

    this.setDialogue(
      'Bu Gun',
      'Wah, minimarketnya lengkap sekali! Non Arabel boleh pilih 2 dari 6 jajanan kesukaan ya!',
      'bugun_welcome',
      null,
      null
    );
  }

  renderMinimarketStage() {
    const snacks = [
      { id: 'yogurt', name: 'Yogurt Cimory', icon: window.SPRITES.items.minimarket.yogurt() },
      { id: 'tehkotak', name: 'Teh Kotak', icon: window.SPRITES.items.minimarket.tehkotak() },
      { id: 'mieinstan', name: 'Mie Instan Pop Mie', icon: window.SPRITES.items.minimarket.mieinstan() },
      { id: 'permen', name: 'Permen Yupi', icon: window.SPRITES.items.minimarket.permen() },
      { id: 'snack', name: 'Snack French Fries', icon: window.SPRITES.items.minimarket.snack() },
      { id: 'eskrim', name: 'Es Krim Paddle Pop', icon: window.SPRITES.items.minimarket.eskrim() }
    ];

    const isComplete = this.chosenSnacks.length === 2;

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 330px; z-index: 14;">
        ${window.SPRITES.characters.buGun('stand')}
      </div>
      <div style="position: absolute; bottom: 180px; left: 470px; z-index: 14;">
        ${window.SPRITES.characters.arabella('school', this.chosenShoes)}
      </div>

      <div style="position: absolute; top: 25px; left: 630px; right: 30px; display: flex; flex-direction: column; align-items: center; z-index: 25;">
        <div style="background: rgba(38, 22, 12, 0.94); color: #fff; padding: 6px 18px; border-radius: 8px; font-size: 20px; margin-bottom: 8px; border: 3px solid #f39c12; text-align: center; width: 100%;">
          Pilih 2 Jajanan (${this.chosenSnacks.length}/2): <strong style="color: #2ecc71;">${this.chosenSnacks.map(s => this.getSnackName(s)).join(', ') || 'Belum ada'}</strong>
        </div>

        <div class="selection-grid grid-minimarket" style="width: 100%;">
          ${snacks.map(item => `
            <div class="select-card ${this.chosenSnacks.includes(item.id) ? 'selected' : ''}" onclick="window.game.toggleSnack('${item.id}')">
              <div class="badge-check">✓</div>
              <div class="card-icon">${item.icon}</div>
              <div class="card-title">${item.name}</div>
            </div>
          `).join('')}
        </div>

        ${isComplete ? `
          <button id="btn-pay-minimarket" class="stardew-btn gold" style="margin-top: 12px; font-size: 22px; width: 100%; justify-content: center;">
            🛒 Bayar di Kasir & Pulang ke Rumah
          </button>
        ` : ''}
      </div>
    `;

    if (!isComplete && this.chosenSnacks.length === 1) {
      this.setDialogue(
        'Arabella',
        'Wah, banyak sekali jajanannya! Satu lagi Arabel bingung pilih yang mana ya...',
        'arabel_curious',
        null,
        null
      );
    }

    if (isComplete) {
      document.getElementById('btn-pay-minimarket').onclick = () => {
        window.soundEngine.playChaChing();
        this.setDialogue(
          'Bu Gun',
          `Bagus sekali! Jajanan ${this.getSnackName(this.chosenSnacks[0])} dan ${this.getSnackName(this.chosenSnacks[1])} sudah dibayar di kasir. Sekarang kita pulang ke rumah ya!`,
          'bugun_waving',
          'Pulang ke Rumah 🏡',
          () => {
            this.fadeTransition(() => {
              this.scene6_SampaiRumahGantiBaju();
            });
          }
        );
      };
    }
  }

  getSnackName(id) {
    const map = {
      yogurt: 'Yogurt Cimory',
      tehkotak: 'Teh Kotak',
      mieinstan: 'Mie Instan Pop Mie',
      permen: 'Permen Yupi Neon Stix',
      snack: 'Snack French Fries',
      eskrim: 'Es Krim Paddle Pop'
    };
    return map[id] || id;
  }

  toggleSnack(id) {
    window.soundEngine.playTap();
    if (this.chosenSnacks.includes(id)) {
      this.chosenSnacks = this.chosenSnacks.filter(s => s !== id);
    } else {
      if (this.chosenSnacks.length < 2) {
        this.chosenSnacks.push(id);
      } else {
        this.chosenSnacks[1] = id;
      }
    }
    this.renderMinimarketStage();
  }

  // ==========================================
  // SCENE 6: SAMPAI RUMAH & MEMILIH PAKAIAN GANTI (6 PILIHAN BAJU)
  // ==========================================
  scene6_SampaiRumahGantiBaju() {
    this.updateHud('12:30', 'Ruang Ganti (Lantai 1)', false);
    window.soundEngine.playBgm('home');
    this.setSceneBackground(window.BACKGROUNDS.dressingRoomFloor1());

    this.renderClothesStage();

    this.setDialogue(
      'Bu Gun',
      'Alhamdulillah sudah sampai rumah. Ayo non Arabel ganti seragam sekolahnya dengan baju rumah yang adem dan nyaman!',
      'bugun_thinking',
      null,
      null
    );
  }

  renderClothesStage() {
    const clothesList = [
      { id: 'pink_flowers', name: 'Pink Bunga-Bunga', icon: window.SPRITES.items.homeClothes.pink_flowers() },
      { id: 'red_flowers', name: 'Merah Bunga-Bunga', icon: window.SPRITES.items.homeClothes.red_flowers() },
      { id: 'mancity', name: 'Jersey Man City', icon: window.SPRITES.items.homeClothes.mancity() },
      { id: 'daster_batik', name: 'Daster Batik', icon: window.SPRITES.items.homeClothes.daster_batik() },
      { id: 'kutang_putih', name: 'Kaus Kutang Putih', icon: window.SPRITES.items.homeClothes.kutang_putih() },
      { id: 'black_cat', name: 'Kaus Hitam Kucing', icon: window.SPRITES.items.homeClothes.black_cat() }
    ];

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 340px; z-index: 14;">
        ${window.SPRITES.characters.buGun('stand')}
      </div>
      <div id="arabel-sprite" style="position: absolute; bottom: 180px; left: 490px; z-index: 14;">
        ${window.SPRITES.characters.arabella(this.chosenHomeClothes, this.chosenShoes)}
      </div>

      <div style="position: absolute; top: 25px; left: 640px; right: 30px; display: flex; flex-direction: column; align-items: center; z-index: 25;">
        <div class="selection-grid grid-6" style="width: 100%;">
          ${clothesList.map(c => `
            <div class="select-card ${this.chosenHomeClothes === c.id ? 'selected' : ''}" onclick="window.game.selectHomeClothes('${c.id}')">
              <div class="badge-check">✓</div>
              <div class="card-icon">${c.icon}</div>
              <div class="card-title">${c.name}</div>
            </div>
          `).join('')}
        </div>

        <button id="btn-done-clothes" class="stardew-btn gold" style="margin-top: 14px; font-size: 22px; width: 100%; justify-content: center;">
          Lanjut ke Depan Rumah ➡
        </button>
      </div>
    `;

    document.getElementById('btn-done-clothes').onclick = () => {
      window.soundEngine.playTap();
      this.currentOutfit = this.chosenHomeClothes;
      this.scene7_BeriMakanKucing();
    };
  }

  selectHomeClothes(id) {
    window.soundEngine.playTap();
    window.soundEngine.playSparkle();
    this.chosenHomeClothes = id;
    this.currentOutfit = id;
    this.renderClothesStage();

    this.setDialogue(
      'Arabella',
      `Hore! Baju ${this.getClothesName(id)} nyaman dan adem sekali untuk santai di rumah!`,
      'arabel_happy',
      'Lanjut ke Depan Rumah ➡',
      () => this.scene7_BeriMakanKucing()
    );
  }

  getClothesName(id) {
    const map = {
      pink_flowers: 'Pink Bunga-Bunga',
      red_flowers: 'Merah Bunga-Bunga',
      mancity: 'Kaos Biru Muda Jersey Manchester City',
      daster_batik: 'Daster Batik',
      kutang_putih: 'Kaus Kutang Putih',
      black_cat: 'Kaus Hitam Gambar Kucing'
    };
    return map[id] || id;
  }

  // ==========================================
  // SCENE 7: MEMBERI MAKAN KUCING DI DEPAN RUMAH (TERAS RUMAH CLUSTER)
  // Stage position: Arabella stands in center, Mimi & Milo eat from bowls
  // ==========================================
  scene7_BeriMakanKucing() {
    this.updateHud('13:30', 'Teras Rumah Cluster', false);
    window.soundEngine.playMeow(true);
    this.setSceneBackground(window.BACKGROUNDS.terraceCats());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 520px; z-index: 14;">
        ${window.SPRITES.characters.arabella(this.chosenHomeClothes, this.chosenShoes)}
      </div>

      <div style="position: absolute; top: 35px; left: 50%; transform: translateX(-50%); width: 620px; background: rgba(38, 22, 12, 0.94); border: 4px solid #f39c12; border-radius: 12px; padding: 14px 20px; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.85); z-index: 25;">
        <h3 style="color: #ffeaa7; font-size: 24px; margin-bottom: 12px;">Pilih Kucing yang Mau Diberi Makan:</h3>
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button class="stardew-btn" onclick="window.game.feedCats('calico')">
            🐱 Kembang Telon Saja 🐟
          </button>
          <button class="stardew-btn secondary" onclick="window.game.feedCats('grey')">
            🐱 Abu-Abu Saja 🐟
          </button>
          <button class="stardew-btn gold" onclick="window.game.feedCats('both')">
            🐱🐱 Beri Makan KEDUANYA! 🐟🐟
          </button>
        </div>
      </div>

      <div id="treat-calico" style="position: absolute; bottom: 185px; left: 720px; display: none; z-index: 15;">
        <div style="width: 65px; height: 45px;">${window.SPRITES.items.catFoodBowl(true)}</div>
      </div>
      <div id="treat-grey" style="position: absolute; bottom: 185px; left: 360px; display: none; z-index: 15;">
        <div style="width: 65px; height: 45px;">${window.SPRITES.items.catFoodBowl(true)}</div>
      </div>
    `;

    this.setDialogue(
      'Bu Gun',
      'Lihat non Arabel, ada 2 kucing lucu di teras depan! Kucing betina kembang telon dan kucing jantan abu-abu. Ayo beri makan biskuit ikan yang sudah Bu Gun siapkan!',
      'bugun_welcome',
      null,
      null
    );
  }

  feedCats(choice) {
    this.chosenCatFeeding = choice;
    window.soundEngine.playEat();

    const calicoTreat = document.getElementById('treat-calico');
    const greyTreat = document.getElementById('treat-grey');

    if (choice === 'calico') {
      window.soundEngine.playMeow(true);
      if (calicoTreat) calicoTreat.style.display = 'block';
      this.spawnHeartEmote(740, 240);

      this.setDialogue(
        'Kucing Kembang Telon',
        'Meooow~ Nyam nyam! Mimi si kucing kembang telon lahap sekali memakan biskuit ikannya!',
        'calico_cat',
        'Masuk ke Ruang Makan 🍽️',
        () => this.scene8_ArabellaMakan()
      );
    } else if (choice === 'grey') {
      window.soundEngine.playMeow(false);
      if (greyTreat) greyTreat.style.display = 'block';
      this.spawnHeartEmote(380, 240);

      this.setDialogue(
        'Kucing Abu-Abu',
        'Purrr... Meoong! Milo si kucing jantan abu-abu sangat senang dan kenyang diberi biskuit ikan!',
        'grey_cat',
        'Masuk ke Ruang Makan 🍽️',
        () => this.scene8_ArabellaMakan()
      );
    } else {
      window.soundEngine.playMeow(true);
      setTimeout(() => window.soundEngine.playMeow(false), 300);
      if (calicoTreat) calicoTreat.style.display = 'block';
      if (greyTreat) greyTreat.style.display = 'block';
      this.spawnHeartEmote(740, 240);
      this.spawnHeartEmote(380, 240);

      this.setDialogue(
        'Arabella',
        'Hahaha Mimi dan Milo kedua kucing makan bersama dengan sangat lahap! Gemas sekali melihat ekornya bergoyang!',
        'arabel_happy',
        'Masuk ke Ruang Makan 🍽️',
        () => this.scene8_ArabellaMakan()
      );
    }
  }

  spawnHeartEmote(x, y) {
    const h = document.createElement('div');
    h.className = 'heart-emote';
    h.innerHTML = '💖';
    h.style.left = `${x}px`;
    h.style.bottom = `${y}px`;
    this.stage.appendChild(h);
    setTimeout(() => h.remove(), 1600);
  }

  // ==========================================
  // SCENE 8: ARABELLA LAPAR & MEMILIH 1 DARI 3 MAKANAN (DAPUR & MEJA MAKAN)
  // Stage position: Bu Gun by kitchen counter, Arabella sitting at dining table
  // ==========================================
  scene8_ArabellaMakan() {
    this.updateHud('14:30', 'Ruang Makan', false);
    window.soundEngine.playBgm('home');
    this.setSceneBackground(window.BACKGROUNDS.diningRoom());

    const meals = [
      { id: 'nasi_telur', name: 'Nasi Telur Dadar & Saus', icon: window.SPRITES.items.meals.nasi_telur() },
      { id: 'pasta_keju', name: 'Pasta Keju', icon: window.SPRITES.items.meals.pasta_keju() },
      { id: 'mie_goreng', name: 'Mie Goreng', icon: window.SPRITES.items.meals.mie_goreng() }
    ];

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 380px; z-index: 14;">
        ${window.SPRITES.characters.buGun('stand')}
      </div>
      <div id="arabel-eating" style="position: absolute; bottom: 200px; left: 740px; z-index: 14;">
        ${window.SPRITES.characters.arabella(this.chosenHomeClothes, this.chosenShoes, 'sit')}
      </div>

      <div class="selection-grid grid-3" style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); width: 500px; z-index: 25;">
        ${meals.map(m => `
          <div class="select-card ${this.chosenMeal === m.id ? 'selected' : ''}" onclick="window.game.selectMeal('${m.id}')">
            <div class="badge-check">✓</div>
            <div class="card-icon">${m.icon}</div>
            <div class="card-title">${m.name}</div>
          </div>
        `).join('')}
      </div>
    `;

    this.setDialogue(
      'Arabella',
      'Krucuk krucuk... perut Arabel juga lapar nih! Bu Gun, Arabel bingung mau makan apa ya?',
      'arabel_curious',
      null,
      null
    );
  }

  selectMeal(mealId) {
    window.soundEngine.playTap();
    window.soundEngine.playEat();
    this.chosenMeal = mealId;

    const mealNames = {
      nasi_telur: 'Nasi Telur Dadar dengan Saus',
      pasta_keju: 'Pasta Keju Creamy',
      mie_goreng: 'Mie Goreng Spesial'
    };

    this.setDialogue(
      'Arabella',
      `Nyam nyam nyam! ${mealNames[mealId]} buatan Bu Gun enak sekali! Arabel kenyang dan senang!`,
      'arabel_happy',
      'Perut Kenyang & Bersantai ➡',
      () => this.scene9_TidurDepanTv()
    );
  }

  // ==========================================
  // SCENE 9: TERTIDUR DI DEPAN TV (SOFA RUANG KELUARGA)
  // Stage position: Arabella lies comfortably ON THE SOFA
  // ==========================================
  scene9_TidurDepanTv() {
    this.updateHud('15:30', 'Ruang Tamu Depan TV', false);
    window.soundEngine.playSnore();
    this.setSceneBackground(window.BACKGROUNDS.livingRoomTv());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 275px; left: 320px; z-index: 15;">
        <img src="assets/characters/arabel_stage_sleeping.png" class="pixel-art stage-character-img" style="height: 160px;" alt="Arabella Tidur" />
        <div class="sleep-z" style="top: -25px; right: 20px;">Zzz...</div>
      </div>
    `;

    this.setDialogue(
      'Arabella',
      'Hoaaam... perut kenyang... TV-nya seru tapi mataku berat sekali... Zzz...',
      'arabel_sleepy',
      'Waktu Berlalu Menuju Malam ➡',
      () => {
        this.fadeTransition(() => {
          this.scene10_PapaMamaPulang();
        });
      }
    );
  }

  // ==========================================
  // SCENE 10: PAPA MAMA PULANG BERSAMA & PILIHAN 3 KEGIATAN MALAM
  // Stage position: Papa at 380px, Mama at 510px, Arabella at 670px
  // ==========================================
  scene10_PapaMamaPulang() {
    this.updateHud('18:30', 'Ruang Tamu (Lantai 1)', true);
    window.soundEngine.playBgm('home');
    this.setSceneBackground(window.BACKGROUNDS.livingRoomTv());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 180px; left: 380px; z-index: 14;">
        ${window.SPRITES.characters.papa('stand')}
      </div>
      <div style="position: absolute; bottom: 180px; left: 510px; z-index: 14;">
        ${window.SPRITES.characters.mama('stand')}
      </div>
      <div id="arabel-wake" style="position: absolute; bottom: 180px; left: 670px; z-index: 14;">
        ${window.SPRITES.characters.arabella(this.chosenHomeClothes, this.chosenShoes)}
      </div>

      <div class="selection-grid grid-3" style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); width: 640px; z-index: 25;">
        <div class="select-card" onclick="window.game.selectEvening('ipad')">
          <div class="card-icon" style="font-size: 38px;">📱</div>
          <div class="card-title">Bermain iPad di Lantai 2</div>
        </div>
        <div class="select-card" onclick="window.game.selectEvening('dance')">
          <div class="card-icon" style="font-size: 38px;">💃</div>
          <div class="card-title">Joget dengan Mama & Papa</div>
        </div>
        <div class="select-card" onclick="window.game.selectEvening('sleep')">
          <div class="card-icon" style="font-size: 38px;">🛏️</div>
          <div class="card-title">Tidur bersama Mama & Papa</div>
        </div>
      </div>
    `;

    this.setDialogue(
      'Mama',
      'Assalamu\'alaikum! Halo bidadari kecil kami, Mama dan Papa sudah pulang kerja! Arabel mau beraktivitas apa malam ini?',
      'mama_waving',
      null,
      null
    );
  }

  selectEvening(choice) {
    this.chosenEvening = choice;
    window.soundEngine.playTap();

    if (choice === 'ipad') {
      this.playEveningIpad();
    } else if (choice === 'dance') {
      this.playEveningDance();
    } else {
      this.playEveningSleepTogether();
    }
  }

  playEveningIpad() {
    this.updateHud('19:15', 'Kamar Lantai 2 (Malam)', true);
    window.soundEngine.playBgm('morning');
    this.setSceneBackground(window.BACKGROUNDS.bedroomNight());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 275px; left: 280px; z-index: 15;">
        ${window.SPRITES.characters.arabella(this.chosenHomeClothes, this.chosenShoes, 'sit')}
        <div style="position: absolute; bottom: 45px; left: -10px; width: 48px; height: 36px; background: #34495e; border: 2px solid #fff; border-radius: 4px; box-shadow: 0 0 15px #00d2d3; display: flex; justify-content: center; align-items: center; font-size: 18px;">
          🎮
        </div>
      </div>
    `;

    this.setDialogue(
      'Arabella',
      'Asyik! Arabel naik ke lantai 2 dan bermain game seru di iPad di atas kasur yang empuk!',
      'arabel_happy',
      'Main iPad Selesai ➡',
      () => {
        window.soundEngine.playSnore();
        this.stage.innerHTML = `
          <div style="position: absolute; bottom: 280px; left: 260px; z-index: 15;">
            <img src="assets/characters/arabel_stage_sleeping.png" class="pixel-art stage-character-img" style="height: 160px;" alt="Arabella Tidur" />
            <div class="sleep-z" style="top: -20px; right: 0;">Zzz...</div>
          </div>
        `;
        this.setDialogue(
          'Arabella',
          'Hoaaam... mataku sudah berat... iPad-nya ditaruh di nakas, saatnya Arabel tidur pulas diselimuti...',
          'arabel_sleepy',
          'Tidur Nyenyak Malam Ini 🌙',
          () => this.scene11_FadeOutAndSummary()
        );
      }
    );
  }

  playEveningDance() {
    this.updateHud('19:15', 'Kamar Lantai 2 (Malam)', true);
    window.soundEngine.playBgm('dance');
    this.setSceneBackground(window.BACKGROUNDS.bedroomNight());

    this.stage.innerHTML = `
      <div class="dancing" style="position: absolute; bottom: 180px; left: 380px; z-index: 15;">
        ${window.SPRITES.characters.papa('stand')}
      </div>
      <div class="dancing" style="position: absolute; bottom: 180px; left: 530px; z-index: 16; animation-delay: 0.15s;">
        <img src="assets/characters/arabel_stage_mancity.png" class="pixel-art stage-character-img" style="height: 235px;" alt="Arabella Joget" />
      </div>
      <div class="dancing" style="position: absolute; bottom: 180px; left: 680px; z-index: 15; animation-delay: 0.3s;">
        ${window.SPRITES.characters.mama('stand')}
      </div>

      <div style="position: absolute; top: 110px; left: 500px; font-size: 36px; animation: floatBubble 2s infinite;">🎵</div>
      <div style="position: absolute; top: 90px; left: 620px; font-size: 36px; animation: floatBubble 2.5s infinite;">🎶</div>
    `;

    this.setDialogue(
      'Arabella',
      'Hahaha seru sekali berjoget gembira bersama Mama dan Papa di lantai 2! Goyang ke kiri dan ke kanan!',
      'arabel_happy',
      'Joget Selesai ➡',
      () => {
        window.soundEngine.playBgm('night');
        window.soundEngine.playSnore();
        this.stage.innerHTML = `
          <div style="position: absolute; bottom: 280px; left: 260px; z-index: 15;">
            <img src="assets/characters/arabel_stage_sleeping.png" class="pixel-art stage-character-img" style="height: 160px;" alt="Arabella Tidur" />
            <div class="sleep-z" style="top: -20px; right: 0;">Zzz...</div>
          </div>
        `;
        this.setDialogue(
          'Arabella',
          'Hoaaam... capek berjoget tapi sangat bahagia... sekarang Arabel tidur pulas di kasur...',
          'arabel_normal',
          'Tidur Nyenyak Malam Ini 🌙',
          () => this.scene11_FadeOutAndSummary()
        );
      }
    );
  }

  playEveningSleepTogether() {
    this.updateHud('19:30', 'Kamar Lantai 2 (Malam)', true);
    window.soundEngine.playBgm('night');
    window.soundEngine.playSnore();
    this.setSceneBackground(window.BACKGROUNDS.bedroomNight());

    this.stage.innerHTML = `
      <div style="position: absolute; bottom: 260px; left: 170px; z-index: 14; opacity: 0.95;">
        ${window.SPRITES.characters.papa('stand')}
      </div>
      <div style="position: absolute; bottom: 280px; left: 300px; z-index: 16;">
        <img src="assets/characters/arabel_stage_sleeping.png" class="pixel-art stage-character-img" style="height: 160px;" alt="Arabella Tidur" />
        <div class="sleep-z" style="top: -20px; right: 0;">Zzz...</div>
      </div>
      <div style="position: absolute; bottom: 260px; left: 450px; z-index: 14; opacity: 0.95;">
        ${window.SPRITES.characters.mama('stand')}
      </div>
    `;

    this.setDialogue(
      'Mama & Papa',
      'Mimpi indah bidadari kecil kami... Tidur yang nyenyak bersama Mama dan Papa...',
      'mama_happy',
      'Tidur Nyenyak Malam Ini 🌙',
      () => this.scene11_FadeOutAndSummary()
    );
  }

  // ==========================================
  // SCENE 11: FADE OUT MENGHITAM & SUMMARY HARI (CONTINUE LOOP)
  // ==========================================
  scene11_FadeOutAndSummary() {
    this.hideDialogue();
    window.soundEngine.stopBgm();
    window.soundEngine.playJingle();

    this.fadeTransition(() => {
      this.overlayScreen.classList.remove('hidden');

      const eveningNames = {
        ipad: 'Bermain iPad di Lantai 2',
        dance: 'Berjoget dengan Mama & Papa',
        sleep: 'Tidur bersama Mama & Papa'
      };

      const catNames = {
        calico: 'Kucing Kembang Telon (Mimi)',
        grey: 'Kucing Abu-Abu (Milo)',
        both: 'Kedua Kucing (Mimi & Milo)'
      };

      this.overlayScreen.innerHTML = `
        <div class="summary-box">
          <div class="summary-title">🌟 RANGKUMAN HARI KE-${this.dayCount} 🌟</div>
          
          <div class="summary-item">
            <span>👟 Sepatu Sekolah:</span>
            <strong>${this.chosenShoes.toUpperCase()}</strong>
          </div>
          <div class="summary-item">
            <span>🛒 Jajanan Minimarket:</span>
            <strong>${this.chosenSnacks.map(s => this.getSnackName(s)).join(' & ')}</strong>
          </div>
          <div class="summary-item">
            <span>👗 Baju Santai Rumah:</span>
            <strong>${this.getClothesName(this.chosenHomeClothes)}</strong>
          </div>
          <div class="summary-item">
            <span>🐱 Kucing Kesayangan:</span>
            <strong>${catNames[this.chosenCatFeeding]}</strong>
          </div>
          <div class="summary-item">
            <span>🍽️ Menu Makanan:</span>
            <strong>${this.chosenMeal === 'nasi_telur' ? 'Nasi Telur Dadar Saus' : this.chosenMeal === 'pasta_keju' ? 'Pasta Keju' : 'Mie Goreng'}</strong>
          </div>
          <div class="summary-item">
            <span>🌙 Kegiatan Malam:</span>
            <strong>${eveningNames[this.chosenEvening]}</strong>
          </div>
        </div>

        <button id="btn-next-day" class="stardew-btn gold" style="font-size: 26px; padding: 14px 38px;">
          ☀️ Mulai Hari Berikutnya (Hari ke-${this.dayCount + 1}) ➡
        </button>
      `;

      document.getElementById('btn-next-day').onclick = () => {
        window.soundEngine.playTap();
        this.dayCount++;
        this.overlayScreen.classList.add('hidden');
        this.fadeTransition(() => {
          this.startDay();
        });
      };
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new ArabellasCatGame();
});
