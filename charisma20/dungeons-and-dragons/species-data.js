const C20_IMG = "/charisma20/dungeons-and-dragons/images/species/";

const C20_SPECIES = [
  /* ---------- Core Species (Player's Handbook 2024) ---------- */
  { slug:"aasimar", name:"Aasimar", color:"#d8b84a", group:"core",
    tag:"Touched by the Divine",
    blurb:"Aasimar are mortals who carry a spark of the Upper Planes within their souls.",
    traits:["Celestial Resistance","Darkvision","Healing Hands","Light Bearer","Celestial Revelation"] },

  { slug:"dragonborn", name:"Dragonborn", color:"#b8452f", group:"core",
    tag:"Blood of Dragons",
    blurb:"The ancestors of dragonborn hatched from the eggs of chromatic and metallic dragons.",
    traits:["Draconic Ancestry","Breath Weapon","Damage Resistance","Darkvision","Draconic Flight"] },

  { slug:"dwarf", name:"Dwarf", color:"#a8703a", group:"core",
    tag:"Forged in Stone",
    blurb:"Dwarves were raised from the earth in the elder days by a deity of the forge.",
    traits:["Darkvision","Dwarven Resilience","Dwarven Toughness","Stonecunning"] },

  { slug:"elf", name:"Elf", color:"#3f9a6b", group:"core",
    tag:"Children of the Fey",
    blurb:"The elves’ curiosity led many of them to explore other planes of existence.",
    traits:["Darkvision","Elven Lineage","Fey Ancestry","Keen Senses","Trance"] },

  { slug:"gnome", name:"Gnome", color:"#c9783a", group:"core",
    tag:"Born of Wonder",
    blurb:"Gnomes are magical folk created by gods of invention, illusions, and life underground.",
    traits:["Darkvision","Gnomish Cunning","Gnomish Lineage"] },

  { slug:"goliath", name:"Goliath", color:"#6b8fa8", group:"core",
    tag:"Blood of Giants",
    blurb:"Goliaths are distant descendants of giants and seek heights above those reached by their ancestors.",
    traits:["Giant Ancestry","Large Form","Powerful Build"] },

  { slug:"halfling", name:"Halfling", color:"#8aa84a", group:"core",
    tag:"Smallfolk's Fortune",
    blurb:"Halflings possess a brave and adventurous spirit that leads them on journeys of discovery.",
    traits:["Brave","Halfling Nimbleness","Luck","Naturally Stealthy"] },

  { slug:"human", name:"Human", color:"#7a8fb8", group:"core",
    tag:"Heirs of Ambition",
    blurb:"Found throughout the multiverse, humans are as varied as they are numerous.",
    traits:["Resourceful","Skillful","Versatile"] },

  { slug:"orc", name:"Orc", color:"#5f7a3a", group:"core",
    tag:"Sons of Resilience",
    blurb:"Orcs are equipped with gifts to help them wander great plains, vast caverns, and churning seas.",
    traits:["Adrenaline Rush","Darkvision","Relentless Endurance"] },

  { slug:"tiefling", name:"Tiefling", color:"#a8337a", group:"core",
    tag:"Touched by the Hells",
    blurb:"Tieflings are either born in the Lower Planes or have fiendish ancestors who originated there.",
    traits:["Darkvision","Fiendish Legacy","Otherworldly Presence"] },

  /* ---------- Ossyran Classics (The World of Ossyra 2026) ---------- */
  { slug:"aelyasari", name:"Aelyasari", color:"#fff9e4", group:"ossyran",
    tag:"Descendants of the Sisters",
    blurb:"Aelyasari are direct descendants of the offspring of the Sisters, bearing their spark and their gifts.",
    traits:["Darkvision", "Celestial Wings", "Divine Insight", "Aelyasari Heritage"]},
  
  { slug:"malverin", name:"Malverin", color:"#c50c7b", group:"ossyran",
    tag:"Legacy of the Sins",
    blurb:"The Malverin are mortals descended from devils, bearing an infernal heritage that may manifest in their appearance, abilities, and supernatural nature.",
    traits:["Sinful Clarity","Devil Sight","Infernal Resistance", "Infernal Manifestation", "Infernal Guise"]},

  { slug:"dreamer", name:"Dreamer", color:"#d0ff00", group:"ossyran",
    tag:"Artificial Life",
    blurb:"Dreamers are manufactured bodies inhabited by copied, transferred, or reconstructed minds. Unlike ordinary constructs, they possess genuine consciousness, memories, emotions, and individual identities.",
    traits:["Constructed Frame", "Synthetic Rest", "Assigned Function", "Fleeting Dreams", "Long Death Immunity"]},

  /* ---------- Official Third Party Species (Eberron: Forge of the Artificer 2025) ---------- */
  // { slug:"example", name:"Example", color:"#4a8ad0", group:"thirdparty",
  //   label:"Optional source override",
  //   tag:"Short tagline.", blurb:"One or two sentences.",
  //   traits:["Trait One","Trait Two"] },
];
