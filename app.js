import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCBAuZgYfHqAYZa2tRQeiqR2kLh8rjLVY",
  authDomain: "charisma20-a7ea6.firebaseapp.com",
  projectId: "charisma20-a7ea6",
  storageBucket: "charisma20-a7ea6.firebasestorage.app",
  messagingSenderId: "874066974213",
  appId: "1:874066974213:web:8c02d7ba12fca73c7d6e6c",
};

const ABILITIES = ["str", "dex", "con", "int", "wis", "cha"];

const CLASS_CONFIG = {
  fighter: {
    hitDie: "d10",
    saves: ["str", "con"],
    skillChoices: 2
  },
  rogue: {
    hitDie: "d8",
    saves: ["dex", "int"],
    skillChoices: 4
  },
  wizard: {
    hitDie: "d6",
    saves: ["int", "wis"],
    skillChoices: 2
  },
  cleric: {
    hitDie: "d8",
    saves: ["wis", "cha"],
    skillChoices: 2
  },
  ranger: {
    hitDie: "d10",
    saves: ["str", "dex"],
    skillChoices: 3
  },
  bard: {
    hitDie: "d8",
    saves: ["dex", "cha"],
    skillChoices: 3
  },
  paladin: {
    hitDie: "d10",
    saves: ["wis", "cha"],
    skillChoices: 2
  },
  barbarian: {
    hitDie: "d12",
    saves: ["str", "con"],
    skillChoices: 2
  }
};

const CLASS_FEATURES = {
  fighter: [
    { level: 1, name: "Fighting Style", desc: "Gain a combat specialty that reflects your training." },
    { level: 1, name: "Second Wind", desc: "Recover a small amount of health once per short rest." },
    { level: 2, name: "Action Surge", desc: "Take one additional action on your turn once per short rest." },
    { level: 3, name: "Martial Archetype", desc: "Choose a combat path or specialty." },
    { level: 5, name: "Extra Attack", desc: "Attack twice when you take the Attack action." }
  ],
  rogue: [
    { level: 1, name: "Sneak Attack", desc: "Deal extra damage when you strike with advantage or an opening." },
    { level: 1, name: "Expertise", desc: "Double proficiency in selected trained skills." },
    { level: 2, name: "Cunning Action", desc: "Take quick movement options as a bonus action." },
    { level: 3, name: "Roguish Archetype", desc: "Choose your criminal or specialist path." },
    { level: 5, name: "Uncanny Dodge", desc: "Reduce damage from an attacker you can react to." }
  ],
  wizard: [
    { level: 1, name: "Spellcasting", desc: "Cast prepared spells using intelligence." },
    { level: 1, name: "Arcane Recovery", desc: "Recover some spell energy after a short rest." },
    { level: 2, name: "Arcane Tradition", desc: "Choose your magical school or discipline." },
    { level: 5, name: "Empowered Casting", desc: "Your spell output becomes more reliable and dangerous." }
  ],
  cleric: [
    { level: 1, name: "Spellcasting", desc: "Cast divine spells using wisdom." },
    { level: 1, name: "Divine Domain", desc: "Choose a divine focus that shapes your gifts." },
    { level: 2, name: "Channel Divinity", desc: "Invoke divine power for special effects." },
    { level: 5, name: "Improved Channeling", desc: "Your divine power becomes more potent." }
  ],
  ranger: [
    { level: 1, name: "Favored Specialty", desc: "Gain training and field advantages tied to your hunting style." },
    { level: 2, name: "Fighting Style", desc: "Choose a combat approach that suits your method." },
    { level: 2, name: "Spellcasting", desc: "Gain limited nature-based magical abilities." },
    { level: 3, name: "Ranger Archetype", desc: "Choose a path that defines your style." },
    { level: 5, name: "Extra Attack", desc: "Attack twice when you take the Attack action." }
  ],
  bard: [
    { level: 1, name: "Bardic Inspiration", desc: "Grant allies a bonus through performance or presence." },
    { level: 1, name: "Spellcasting", desc: "Cast spells through performance and force of personality." },
    { level: 2, name: "Jack of All Trades", desc: "Gain partial proficiency in many things." },
    { level: 3, name: "Bard College", desc: "Choose your artistic or martial tradition." },
    { level: 5, name: "Font of Inspiration", desc: "Recover inspiration more easily." }
  ],
  paladin: [
    { level: 1, name: "Lay on Hands", desc: "Heal wounds through sacred touch." },
    { level: 2, name: "Fighting Style", desc: "Choose a martial discipline." },
    { level: 2, name: "Divine Smite", desc: "Channel sacred force into weapon strikes." },
    { level: 3, name: "Sacred Oath", desc: "Swear an oath that shapes your power." },
    { level: 5, name: "Extra Attack", desc: "Attack twice when you take the Attack action." }
  ],
  barbarian: [
    { level: 1, name: "Rage", desc: "Enter a furious state that boosts offense and resilience." },
    { level: 1, name: "Unarmored Defense", desc: "Rely on physical toughness rather than armor." },
    { level: 2, name: "Reckless Attack", desc: "Attack with greater force at the cost of defense." },
    { level: 2, name: "Danger Sense", desc: "Gain heightened awareness against visible threats." },
    { level: 3, name: "Primal Path", desc: "Choose the source of your fury." },
    { level: 5, name: "Extra Attack", desc: "Attack twice when you take the Attack action." }
  ]
};

const QUINT_FEATURES = [
  { level: 1, name: "Manifestation", desc: "Your Quintessence appears and can act as an extension of your will." },
  { level: 1, name: "Linked Senses", desc: "You can perceive through your Quintessence while it is active." },
  { level: 2, name: "Combat Echo", desc: "Your Quintessence gains improved timing and response in combat." },
  { level: 3, name: "Signature Expression", desc: "Develop a unique technique or defining manifestation trait." },
  { level: 5, name: "Accelerated Assault", desc: "Your Quintessence gains stronger offensive sequencing." },
  { level: 7, name: "Extended Presence", desc: "Its effective operational range or duration improves." },
  { level: 9, name: "Refined Precision", desc: "Your Quintessence becomes more accurate and controlled." },
  { level: 11, name: "Overdrive", desc: "Unlock a high-output state for decisive moments." },
  { level: 13, name: "Awakened Form", desc: "Its presence evolves into a stronger expression." },
  { level: 15, name: "Dominion", desc: "Your Quintessence exerts stronger control over its field." },
  { level: 17, name: "Transcendent Manifestation", desc: "Your Quintessence reaches an exceptional state of power." }
];

const ARMOR_CONFIG = {
  none: 10,
  light: 11,
  medium: 13,
  heavy: 16
};

const SAVING_THROWS = [
  { key: "str", label: "Strength" },
  { key: "dex", label: "Dexterity" },
  { key: "con", label: "Constitution" },
  { key: "int", label: "Intelligence" },
  { key: "wis", label: "Wisdom" },
  { key: "cha", label: "Charisma" }
];

const SKILLS = [
  { key: "acrobatics", label: "Acrobatics", ability: "dex" },
  { key: "animalHandling", label: "Animal Handling", ability: "wis" },
  { key: "arcana", label: "Arcana", ability: "int" },
  { key: "athletics", label: "Athletics", ability: "str" },
  { key: "deception", label: "Deception", ability: "cha" },
  { key: "history", label: "History", ability: "int" },
  { key: "insight", label: "Insight", ability: "wis" },
  { key: "intimidation", label: "Intimidation", ability: "cha" },
  { key: "investigation", label: "Investigation", ability: "int" },
  { key: "medicine", label: "Medicine", ability: "wis" },
  { key: "nature", label: "Nature", ability: "int" },
  { key: "perception", label: "Perception", ability: "wis" },
  { key: "performance", label: "Performance", ability: "cha" },
  { key: "persuasion", label: "Persuasion", ability: "cha" },
  { key: "religion", label: "Religion", ability: "int" },
  { key: "sleightOfHand", label: "Sleight of Hand", ability: "dex" },
  { key: "stealth", label: "Stealth", ability: "dex" },
  { key: "survival", label: "Survival", ability: "wis" }
];

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loginView = document.getElementById("loginView");
const appView = document.getElementById("appView");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const loginError = document.getElementById("loginError");
const saveStatus = document.getElementById("saveStatus");

const userPhoto = document.getElementById("userPhoto");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

let currentUser = null;

function getProficiencyBonusFromLevel(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

function modFromScore(score) {
  return Math.floor((Number(score) - 10) / 2);
}

function formatMod(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function setStatus(message = "", type = "") {
  saveStatus.textContent = message;
  saveStatus.className = `status ${type}`.trim();
}

function buildSavingThrows() {
  const wrap = document.getElementById("savingThrows");
  wrap.innerHTML = "";

  SAVING_THROWS.forEach((item) => {
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `
      <input type="checkbox" data-save id="saveProf-${item.key}">
      <div>${item.label}</div>
      <div class="list-value" id="saveVal-${item.key}">+0</div>
    `;
    wrap.appendChild(row);
  });
}

function buildSkills() {
  const wrap = document.getElementById("skillsList");
  wrap.innerHTML = "";

  SKILLS.forEach((item) => {
    const row = document.createElement("div");
    row.className = "list-row";
    row.innerHTML = `
      <input type="checkbox" data-save id="skillProf-${item.key}">
      <div>${item.label}</div>
      <div class="list-value" id="skillVal-${item.key}">+0</div>
    `;
    wrap.appendChild(row);
  });
}

function getAbilityMods() {
  return {
    str: Number(document.getElementById("mod-str")?.textContent || 0),
    dex: Number(document.getElementById("mod-dex")?.textContent || 0),
    con: Number(document.getElementById("mod-con")?.textContent || 0),
    int: Number(document.getElementById("mod-int")?.textContent || 0),
    wis: Number(document.getElementById("mod-wis")?.textContent || 0),
    cha: Number(document.getElementById("mod-cha")?.textContent || 0)
  };
}

function getPointPoolRemaining() {
  const mods = getAbilityMods();
  const spent = Object.values(mods).reduce((sum, value) => sum + value, 0);
  return 4 - spent;
}

function updatePointPool() {
  const el = document.getElementById("pointPool");
  if (!el) return;
  el.textContent = getPointPoolRemaining();
}

function changeModifier(ability, delta) {
  const el = document.getElementById(`mod-${ability}`);
  if (!el) return;

  const current = Number(el.textContent || 0);
  const next = current + delta;

  if (next < -1 || next > 2) return;

  const remaining = getPointPoolRemaining();
  if (delta > 0 && remaining <= 0) return;

  el.textContent = next;
  recalcSheet();
}

function updateClassRules() {
  const classEl = document.getElementById("classSelect");
  const levelEl = document.getElementById("level");
  const charHitDiceEl = document.getElementById("charHitDice");
  const pbEl = document.getElementById("proficiencyBonus");

  if (!classEl || !levelEl || !charHitDiceEl || !pbEl) return;

  const classKey = classEl.value;
  const level = Number(levelEl.value || 1);
  const config = CLASS_CONFIG[classKey];

  if (!config) return;

  charHitDiceEl.value = `${level}${config.hitDie}`;
  pbEl.value = getProficiencyBonusFromLevel(level);

  SAVING_THROWS.forEach((item) => {
    const box = document.getElementById(`saveProf-${item.key}`);
    if (!box) return;

    const isProficient = config.saves.includes(item.key);
    box.checked = isProficient;
    box.disabled = true;
  });

  enforceSkillLimit();
  updateFeatureSections();
}

function enforceSkillLimit() {
  const classEl = document.getElementById("classSelect");
  if (!classEl) return;

  const classKey = classEl.value;
  const config = CLASS_CONFIG[classKey];
  if (!config) return;

  const maxSkills = config.skillChoices;

  const boxes = SKILLS
    .map((item) => document.getElementById(`skillProf-${item.key}`))
    .filter(Boolean);

  const checked = boxes.filter((box) => box.checked);

  if (checked.length > maxSkills) {
    checked[checked.length - 1].checked = false;
  }

  const newChecked = boxes.filter((box) => box.checked);

  boxes.forEach((box) => {
    box.disabled = !box.checked && newChecked.length >= maxSkills;
  });
}

function renderFeatureList(containerId, features, level) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const unlocked = features.filter((feature) => level >= feature.level);

  if (unlocked.length === 0) {
    container.innerHTML = `<div class="feature-item"><div class="feature-item-desc">No features available yet.</div></div>`;
    return;
  }

  container.innerHTML = unlocked
    .map(
      (feature) => `
        <div class="feature-item">
          <div class="feature-item-title">${feature.name}</div>
          <div class="feature-item-level">Level ${feature.level}</div>
          <div class="feature-item-desc">${feature.desc}</div>
        </div>
      `
    )
    .join("");
}

function updateFeatureSections() {
  const classEl = document.getElementById("classSelect");
  const levelEl = document.getElementById("level");

  if (!classEl || !levelEl) return;

  const classKey = classEl.value;
  const level = Number(levelEl.value || 1);

  renderFeatureList(
    "charFeatures",
    CLASS_FEATURES[classKey] || [],
    level
  );

  renderFeatureList(
    "quintFeatures",
    QUINT_FEATURES,
    level
  );
}

function recalcSheet() {
  updatePointPool();

  const mods = getAbilityMods();
  const profEl = document.getElementById("proficiencyBonus");
  const prof = Number(profEl?.value || 2);

  SAVING_THROWS.forEach((item) => {
    const profBox = document.getElementById(`saveProf-${item.key}`);
    const valEl = document.getElementById(`saveVal-${item.key}`);
    if (!profBox || !valEl) return;

    const total = mods[item.key] + (profBox.checked ? prof : 0);
    valEl.textContent = formatMod(total);
  });

  SKILLS.forEach((item) => {
    const profBox = document.getElementById(`skillProf-${item.key}`);
    const valEl = document.getElementById(`skillVal-${item.key}`);
    if (!profBox || !valEl) return;

    const total = mods[item.ability] + (profBox.checked ? prof : 0);
    valEl.textContent = formatMod(total);
  });

  const charArmorTypeEl = document.getElementById("charArmorType");
  const charArmorClassEl = document.getElementById("charArmorClass");
  const charInitiativeEl = document.getElementById("charInitiative");
  const charPassiveEl = document.getElementById("charPassivePerception");

  if (charArmorTypeEl && charArmorClassEl) {
    const armorType = charArmorTypeEl.value;
    const armorBase = ARMOR_CONFIG[armorType] ?? 10;

    let armorClass = armorBase;
    if (armorType === "light") armorClass += mods.dex;
    else if (armorType === "medium") armorClass += Math.min(mods.dex, 2);
    else if (armorType === "none") armorClass += mods.dex;

    charArmorClassEl.value = armorClass;
  }

  if (charInitiativeEl) charInitiativeEl.value = mods.dex;
  if (charPassiveEl) charPassiveEl.value = 10 + mods.wis;

  const quintArmorTypeEl = document.getElementById("quintArmorType");
  const quintArmorClassEl = document.getElementById("quintArmorClass");
  const quintInitiativeEl = document.getElementById("quintInitiative");
  const quintPassiveEl = document.getElementById("quintPassivePerception");
  const quintAttackBonusEl = document.getElementById("quintAttackBonus");

  if (quintArmorTypeEl && quintArmorClassEl) {
    const armorType = quintArmorTypeEl.value;
    const armorBase = ARMOR_CONFIG[armorType] ?? 10;

    let armorClass = armorBase;
    if (armorType === "light") armorClass += mods.dex;
    else if (armorType === "medium") armorClass += Math.min(mods.dex, 2);
    else if (armorType === "none") armorClass += mods.dex;

    quintArmorClassEl.value = armorClass;
  }

  if (quintInitiativeEl) quintInitiativeEl.value = mods.dex;
  if (quintPassiveEl) quintPassiveEl.value = 10 + mods.wis;
  if (quintAttackBonusEl) quintAttackBonusEl.value = prof + mods.dex;

  updateClassRules();
}

function storageKey() {
  return currentUser ? `dnd-sheet-${currentUser.uid}` : null;
}

function collectData() {
  const data = {};

  document.querySelectorAll("[data-save]").forEach((el) => {
    data[el.id] = el.type === "checkbox" ? el.checked : el.value;
  });

  return data;
}

function applyData(data) {
  document.querySelectorAll("[data-save]").forEach((el) => {
    if (!(el.id in data)) return;

    if (el.type === "checkbox") {
      el.checked = Boolean(data[el.id]);
    } else {
      el.value = data[el.id];
    }
  });

  recalcSheet();
}

function saveLocal() {
  const key = storageKey();
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(collectData()));
  setStatus("Saved locally.", "ok");
}

function loadLocal() {
  const key = storageKey();
  if (!key) return;

  const raw = localStorage.getItem(key);
  if (!raw) {
    recalcSheet();
    return;
  }

  try {
    applyData(JSON.parse(raw));
    setStatus("Loaded saved sheet.", "ok");
  } catch (error) {
    console.error(error);
    setStatus("Could not load saved sheet.", "error");
  }
}

function resetForm() {
  document.querySelectorAll("[data-save]").forEach((el) => {
    if (el.type === "checkbox") {
      el.checked = false;
      return;
    }

    if (el.type === "number") {
      if (el.id === "level") el.value = 1;
      else if (el.id === "charArmorClass") el.value = 10;
      else if (el.id === "charInitiative") el.value = 0;
      else if (el.id === "charPassivePerception") el.value = 10;
      else if (el.id === "quintArmorClass") el.value = 10;
      else if (el.id === "quintInitiative") el.value = 0;
      else if (el.id === "quintPassivePerception") el.value = 10;
      else if (el.id === "quintAttackBonus") el.value = 0;
      else el.value = 0;
      return;
    }

    if (el.tagName === "SELECT") {
      el.selectedIndex = 0;
      return;
    }

    el.value = "";
  });

  ABILITIES.forEach((ability) => {
    const el = document.getElementById(`mod-${ability}`);
    if (el) el.textContent = "0";
  });

  updateClassRules();
  recalcSheet();
  setStatus("Reset complete. Press Save to keep it.", "");
}

loginBtn.addEventListener("click", async () => {
  loginError.textContent = "";
  loginBtn.disabled = true;

  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error(error);
    loginError.textContent = error.message || "Login failed.";
  } finally {
    loginBtn.disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    setStatus("Logout failed.", "error");
  }
});

saveBtn.addEventListener("click", saveLocal);
resetBtn.addEventListener("click", resetForm);

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-save]")) {
    recalcSheet();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-save]")) {
    recalcSheet();
  }
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-mod-change]");
  if (!button) return;

  const [ability, deltaText] = button.dataset.modChange.split(":");
  changeModifier(ability, Number(deltaText));
});

buildSavingThrows();
buildSkills();
updateClassRules();
updateFeatureSections();
recalcSheet();

onAuthStateChanged(auth, (user) => {
  currentUser = user;

  if (user) {
    loginView.classList.add("hidden");
    appView.classList.remove("hidden");

    userPhoto.src = user.photoURL || "";
    userName.textContent = user.displayName || "User";
    userEmail.textContent = user.email || "";

    loadLocal();
  } else {
    appView.classList.add("hidden");
    loginView.classList.remove("hidden");
    setStatus("");
  }
});