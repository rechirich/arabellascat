// backgrounds.js - Background scenes matching user's exact uploaded pixel art graphics

const BACKGROUNDS = {
  // Scene 1 & Evening: Modern 2-Story Cluster House Front
  frontHouseMorning: () => ({
    type: 'image',
    src: 'assets/house_front.jpg',
    location: 'Rumah Cluster 2-Lantai'
  }),

  frontHouseNight: () => ({
    type: 'image',
    src: 'assets/house_front.jpg',
    location: 'Rumah Cluster (Malam Hari)'
  }),

  // Scene 2A & 6 & 10: Floor 2 Bedroom (Morning wake-up, change clothes, bedtime)
  bedroomFloor2: () => ({
    type: 'image',
    src: 'assets/bedroom.jpg',
    location: 'Kamar Tidur (Lantai 2)'
  }),

  // Scene 2B: Floor 2 Bathroom (Shower, water heater, purple bucket, bath)
  bathroomFloor2: () => ({
    type: 'image',
    src: 'assets/bathroom.jpg',
    location: 'Kamar Mandi (Lantai 2)'
  }),

  // Scene 3: Dressing / Wardrobe
  dressingRoom: () => ({
    type: 'image',
    src: 'assets/bedroom.jpg',
    location: 'Kamar Arabella (Ganti Seragam)'
  }),

  // Scene 4: Kindergarten School KB-TK Permata Hati
  schoolMorning: () => ({
    type: 'image',
    src: 'assets/school.jpg',
    location: 'KB-TK Permata Hati'
  }),

  school: () => ({
    type: 'image',
    src: 'assets/school.jpg',
    location: 'KB-TK Permata Hati'
  }),

  // Scene 5: Indomaret Minimarket
  minimarket: () => ({
    type: 'image',
    src: 'assets/minimarket.jpg',
    location: 'Indomaret Minimarket'
  }),

  // Scene 7: Front Terrace Cat Feeding (Calico & Grey cats)
  frontTerraceCats: () => ({
    type: 'image',
    src: 'assets/terrace_cats.jpg',
    location: 'Teras Rumah Cluster'
  }),

  terraceCats: () => ({
    type: 'image',
    src: 'assets/terrace_cats.jpg',
    location: 'Teras Rumah Cluster'
  }),

  // Scene 8: Kitchen with Dining Table (Lunch with Bu Gun)
  diningRoom: () => ({
    type: 'image',
    src: 'assets/kitchen_dining.jpg',
    location: 'Dapur & Meja Makan'
  }),

  // Scene 9 & 10: Living Room with TV & Sofa (Nap time & Family welcome)
  livingRoomTv: () => ({
    type: 'image',
    src: 'assets/living_room_tv.jpg',
    location: 'Ruang Keluarga Depan TV'
  }),

  dressingRoomFloor1: () => ({
    type: 'image',
    src: 'assets/living_room_tv.jpg',
    location: 'Ruang Keluarga (Lantai 1)'
  }),

  bedroomNight: () => ({
    type: 'image',
    src: 'assets/bedroom.jpg',
    location: 'Kamar Tidur Lantai 2 (Malam)'
  })
};

window.BACKGROUNDS = BACKGROUNDS;
