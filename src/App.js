import { useState, useEffect, useRef } from "react";

// Ses efektleri
const playSound = (type) => {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "attackLeft" || type === "attackRight") {
      oscillator.frequency.value = 200;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === "damage") {
      oscillator.frequency.value = 150;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.15
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } else if (type === "buff") {
      oscillator.frequency.value = 400;
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (e) {
    // Ses çalmazsa devam et
  }
};

const TIERS = {
  1: [
    {
      name: "🐜",
      nick: "Karınca",
      atk: 2,
      hp: 1,
      cost: 3,
      ability: "faint_buff",
      tier: 1,
    },
    {
      name: "🐟",
      nick: "Balık",
      atk: 2,
      hp: 3,
      cost: 3,
      ability: "none",
      tier: 1,
    },
    {
      name: "🐛",
      nick: "Tırtıl",
      atk: 2,
      hp: 2,
      cost: 3,
      ability: "start_buff",
      tier: 1,
    },
    {
      name: "🦆",
      nick: "Ördek",
      atk: 1,
      hp: 3,
      cost: 3,
      ability: "end_heal_one",
      tier: 1,
    },
    {
      name: "🐷",
      nick: "Domuz",
      atk: 3,
      hp: 1,
      cost: 3,
      ability: "faint_gold",
      tier: 1,
    },
    {
      name: "🐝",
      nick: "Arı",
      atk: 1,
      hp: 2,
      cost: 3,
      ability: "sell_gold",
      tier: 1,
    },
    {
      name: "🦗",
      nick: "Çekirge",
      atk: 2,
      hp: 2,
      cost: 3,
      ability: "end_gain_gold", // ← YENİ
      tier: 1,
    },
    {
      name: "🐌",
      nick: "Salyangoz",
      atk: 1,
      hp: 4,
      cost: 3,
      ability: "start_team_shield",
      tier: 1,
    },
    {
      name: "🦋",
      nick: "Kelebek",
      atk: 2,
      hp: 2,
      cost: 3,
      ability: "levelup_buff_self",
      tier: 1,
    },
  ],
  2: [
    {
      name: "🦀",
      nick: "Yengeç",
      atk: 3,
      hp: 3,
      cost: 3,
      ability: "start_tank", // ← DEĞİŞTİ
      tier: 2,
    },
    {
      name: "🦎",
      nick: "Kertenkele",
      atk: 2,
      hp: 4,
      cost: 3,
      ability: "start_dmg",
      tier: 2,
    },
    {
      name: "🐀",
      nick: "Fare",
      atk: 4,
      hp: 2,
      cost: 3,
      ability: "atk_buff",
      tier: 2,
    },
    {
      name: "🦔",
      nick: "Kirpi",
      atk: 2,
      hp: 5,
      cost: 3,
      ability: "faint_dmg",
      tier: 2,
    },
    {
      name: "🐍",
      nick: "Yılan",
      atk: 5,
      hp: 2,
      cost: 3,
      ability: "start_poison",
      tier: 2,
    },
    {
      name: "🦘",
      nick: "Kanguru",
      atk: 3,
      hp: 4,
      cost: 3,
      ability: "friend_summon",
      tier: 2,
    },
    {
      name: "🦝",
      nick: "Rakun",
      atk: 2,
      hp: 3,
      cost: 3,
      ability: "end_steal_stat",
      tier: 2,
    },
    {
      name: "🐇",
      nick: "Tavşan",
      atk: 3,
      hp: 2,
      cost: 3,
      ability: "start_speed",
      tier: 2,
    },
    {
      name: "🦫",
      nick: "Kunduz",
      atk: 2,
      hp: 4,
      cost: 3,
      ability: "shop_discount",
      tier: 2,
    },
  ],
  3: [
    {
      name: "🐢",
      nick: "Kaplumbağa",
      atk: 2,
      hp: 6,
      cost: 4,
      ability: "faint_shield",
      tier: 3,
    },
    {
      name: "🦉",
      nick: "Baykuş",
      atk: 4,
      hp: 4,
      cost: 4,
      ability: "start_snipe",
      tier: 3,
    },
    {
      name: "🐺",
      nick: "Kurt",
      atk: 5,
      hp: 4,
      cost: 4,
      ability: "friend_faint",
      tier: 3,
    },
    {
      name: "🦩",
      nick: "Flamingo",
      atk: 3,
      hp: 5,
      cost: 4,
      ability: "end_team_buff",
      tier: 3,
    },
    {
      name: "🐗",
      nick: "Yaban Domuzu",
      atk: 6,
      hp: 3,
      cost: 4,
      ability: "start_charge",
      tier: 3,
    },
    {
      name: "🦙",
      nick: "Lama",
      atk: 3,
      hp: 6,
      cost: 4,
      ability: "hurt_heal_friend",
      tier: 3,
    },
    {
      name: "🦦",
      nick: "Su Samuru",
      atk: 4,
      hp: 5,
      cost: 4,
      ability: "buy_buff_behind",
      tier: 3,
    },
    {
      name: "🦨",
      nick: "Kokarca",
      atk: 3,
      hp: 4,
      cost: 4,
      ability: "hurt_weaken_attacker",
      tier: 3,
    },
    {
      name: "🦡",
      nick: "Porsuk",
      atk: 5,
      hp: 5,
      cost: 4,
      ability: "levelup_free_reroll",
      tier: 3,
    },
  ],
  4: [
    {
      name: "🦈",
      nick: "Köpekbalığı",
      atk: 6,
      hp: 5,
      cost: 5,
      ability: "kill_buff",
      tier: 4,
    },
    {
      name: "🐊",
      nick: "Timsah",
      atk: 5,
      hp: 6,
      cost: 5,
      ability: "faint_summon",
      tier: 4,
    },
    {
      name: "🦅",
      nick: "Kartal",
      atk: 7,
      hp: 4,
      cost: 5,
      ability: "start_all",
      tier: 4,
    },
    {
      name: "🐃",
      nick: "Bufalo",
      atk: 4,
      hp: 8,
      cost: 5,
      ability: "hurt_buff",
      tier: 4,
    },
    {
      name: "🦚",
      nick: "Tavuskuşu",
      atk: 5,
      hp: 5,
      cost: 5,
      ability: "end_all",
      tier: 4,
    },
    {
      name: "🦛",
      nick: "Su Aygırı",
      atk: 4,
      hp: 7,
      cost: 5,
      ability: "faint_copy", // ← DEĞİŞTİ
      tier: 4,
    },
    {
      name: "🦬",
      nick: "Bizon",
      atk: 6,
      hp: 6,
      cost: 5,
      ability: "hurt_team_buff",
      tier: 4,
    },
    {
      name: "🦒",
      nick: "Zürafa",
      atk: 5,
      hp: 7,
      cost: 5,
      ability: "end_buff_ahead",
      tier: 4,
    },
    {
      name: "🦓",
      nick: "Zebra",
      atk: 6,
      hp: 5,
      cost: 5,
      ability: "buy_discount_next",
      tier: 4,
    },
  ],
  5: [
    {
      name: "🦁",
      nick: "Aslan",
      atk: 12,
      hp: 10,
      cost: 6,
      ability: "start_fear",
      tier: 5,
    },
    {
      name: "🐘",
      nick: "Fil",
      atk: 9,
      hp: 18,
      cost: 6,
      ability: "hurt_dmg",
      tier: 5,
    },
    {
      name: "🦏",
      nick: "Gergedan",
      atk: 14,
      hp: 10,
      cost: 6,
      ability: "start_trample",
      tier: 5,
    },
    {
      name: "🐻",
      nick: "Ayı",
      atk: 11,
      hp: 13,
      cost: 6,
      ability: "faint_rage",
      tier: 5,
    },
    {
      name: "🦍",
      nick: "Goril",
      atk: 12,
      hp: 12,
      cost: 6,
      ability: "revenge",
      tier: 5,
    },
    {
      name: "🐆",
      nick: "Çita",
      atk: 15,
      hp: 8,
      cost: 6,
      ability: "start_triple",
      tier: 5,
    },
    {
      name: "🐅",
      nick: "Kaplan",
      atk: 13,
      hp: 11,
      cost: 6,
      ability: "kill_fear_all",
      tier: 5,
    },
    {
      name: "🦣",
      nick: "Mamut",
      atk: 10,
      hp: 16,
      cost: 6,
      ability: "start_freeze_enemy",
      tier: 5,
    },
    {
      name: "🐫",
      nick: "Deve",
      atk: 11,
      hp: 14,
      cost: 6,
      ability: "buy_buff_random", // ← YENİ
      tier: 5,
    },
  ],
  6: [
    {
      name: "🐉",
      nick: "Ejderha",
      atk: 18,
      hp: 16,
      cost: 7,
      ability: "start_fire",
      tier: 6,
    },
    {
      name: "🦖",
      nick: "T-Rex",
      atk: 17,
      hp: 18,
      cost: 7,
      ability: "devour",
      tier: 6,
    },
    {
      name: "🐋",
      nick: "Balina",
      atk: 14,
      hp: 22,
      cost: 7,
      ability: "faint_wave",
      tier: 6,
    },
    {
      name: "🦤",
      nick: "Dodo",
      atk: 20,
      hp: 12,
      cost: 7,
      ability: "double",
      tier: 6,
    },
    {
      name: "🐲",
      nick: "Çin Ejderi",
      atk: 16,
      hp: 16,
      cost: 7,
      ability: "weaken_strong",
      tier: 6,
    },
    {
      name: "🦕",
      nick: "Brontosaurus",
      atk: 15,
      hp: 20,
      cost: 7,
      ability: "start_shield_all",
      tier: 6,
    },
    {
      name: "🦭",
      nick: "Fok",
      atk: 19,
      hp: 15,
      cost: 7,
      ability: "kill_heal_team",
      tier: 6,
    },
    {
      name: "🦑",
      nick: "Kalamar",
      atk: 16,
      hp: 18,
      cost: 7,
      ability: "start_multi_snipe",
      tier: 6,
    },
    {
      name: "🐙",
      nick: "Ahtapot",
      atk: 14,
      hp: 19,
      cost: 7,
      ability: "faint_duplicate",
      tier: 6,
    },
  ],
};

const TBG = [
  "",
  "from-gray-800 to-gray-700",
  "from-green-900 to-green-800",
  "from-blue-900 to-blue-800",
  "from-purple-900 to-purple-800",
  "from-red-900 to-red-800",
  "from-orange-900 to-amber-800",
];
const TBD = [
  "",
  "border-gray-400",
  "border-green-400",
  "border-blue-400",
  "border-purple-400",
  "border-red-400",
  "border-orange-400",
];
const TGLOW = [
  "",
  "shadow-gray-500/30",
  "shadow-green-500/30",
  "shadow-blue-500/30",
  "shadow-purple-500/30",
  "shadow-red-500/30",
  "shadow-orange-500/30",
];
const MAX_STAT = 100;
const WIN_TURN = 20;

function Card({
  a,
  compact,
  selected,
  onClick,
  onSell,
  anim,
  showName,
  mirror,
}) {
  const close = a.exp >= 1 && a.lvl < 3;
  const st =
    a.lvl === 3
      ? "★★★"
      : a.lvl === 2
      ? a.exp >= 1
        ? "★★½"
        : "★★"
      : a.exp >= 1
      ? "★½"
      : "★";
  const sp = Math.ceil(a.lvl + (a.exp >= 1 ? 0.5 : 0));

  let animStyle = {};
  if (anim === "damage")
    animStyle = {
      animation: "shake 0.3s",
      background: "linear-gradient(135deg, rgba(239,68,68,0.5), transparent)",
    };
  if (anim === "buff")
    animStyle = {
      animation: "glow 0.4s",
      boxShadow: "0 0 20px 5px rgba(34,197,94,0.6)",
    };
  if (anim === "attackLeft")
    animStyle = { animation: "attackLeft 0.6s ease-in-out" };
  if (anim === "attackRight")
    animStyle = { animation: "attackRight 0.6s ease-in-out" };
  if (anim === "deathLeft")
    animStyle = { animation: "fadeOutLeft 0.5s ease-out forwards" };
  if (anim === "deathRight")
    animStyle = { animation: "fadeOutRight 0.5s ease-out forwards" };
  if (anim === "slideInLeft")
    animStyle = { animation: "slideInLeft 0.4s ease-out" };
  if (anim === "slideInRight")
    animStyle = { animation: "slideInRight 0.4s ease-out" };

  return (
    <div className="relative group">
      <div
        className={`${
          compact ? "w-14 h-16" : "w-20 h-28"
        } rounded-xl flex flex-col items-center justify-center bg-gradient-to-br ${
          TBG[a.tier]
        } ${
          selected
            ? "ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50"
            : close && !compact
            ? "ring-4 ring-green-400"
            : ""
        } border-2 ${
          TBD[a.tier]
        } cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg ${
          TGLOW[a.tier]
        }`}
        onClick={onClick}
        style={animStyle}
      >
        <span className={`${compact ? "text-xl" : "text-3xl"} drop-shadow-lg`}>
          {a.name}
        </span>
        {!compact && showName && (
          <span className="text-xs text-gray-300 -mt-1">{a.nick}</span>
        )}
        {!compact && <span className="text-xs text-yellow-300">{st}</span>}
        {(() => {
          const statOrder = mirror
            ? [a.curHp || a.hp, a.atk]
            : [a.atk, a.curHp || a.hp];
          const colors = mirror
            ? ["text-green-400", "text-red-400"]
            : ["text-red-400", "text-green-400"];
          return (
            <div
              className={`flex ${
                compact ? "text-xs" : "text-sm"
              } gap-1 font-bold`}
              style={mirror ? { transform: "scaleX(-1)" } : {}}
            >
              <span className={`${colors[0]} drop-shadow`}>{statOrder[0]}</span>
              <span className="text-gray-400">/</span>
              <span className={`${colors[1]} drop-shadow`}>{statOrder[1]}</span>
            </div>
          );
        })()}
      </div>
      {onSell && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSell();
          }}
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full text-xs font-bold shadow-lg"
        >
          {sp}
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [gold, setGold] = useState(10);
  const [turn, setTurn] = useState(1);
  const [wins, setWins] = useState(0);
  const [lives, setLives] = useState(5);
  const [team, setTeam] = useState([null, null, null, null, null, null, null]); // 7 slot
  const [shop, setShop] = useState([]);
  const [phase, setPhase] = useState("shop");
  const [log, setLog] = useState([]);
  const [pT, setPT] = useState([]);
  const [eT, setET] = useState([]);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState(null);
  const [selI, setSelI] = useState(null);
  const [tip, setTip] = useState(null);
  const [over, setOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [newTier, setNewTier] = useState(null);
  const [lastT, setLastT] = useState(1);
  const [pGold, setPGold] = useState(0);
  const [guide, setGuide] = useState(false);
  const [guideLvl, setGuideLvl] = useState({});
  const [anims, setAnims] = useState({});
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [discountNext, setDiscountNext] = useState(false);
  const logR = useRef(null);
  const battleGoldRef = useRef(0);

  const [slotUpgrade, setSlotUpgrade] = useState(null);

  const maxT = Math.min(Math.ceil(turn / 2), 6);
  const difficulty = 1 + Math.floor(turn / 5) * 0.2;
  const teamSlots = turn >= 11 ? 7 : turn >= 9 ? 6 : 5; // Aktif slot sayısı
  const shopSlots = turn >= 11 ? 6 : turn >= 9 ? 5 : 4; // Mağaza slot sayısı
  const triggerAnim = (id, type) => {
    setAnims((prev) => ({ ...prev, [id]: type }));
    setTimeout(() => setAnims((prev) => ({ ...prev, [id]: null })), 600);
    playSound(type);
  };

  useEffect(() => {
    const currentMaxT = Math.min(Math.ceil(turn / 2), 6); // İçeride yeniden hesapla, dependency turn'a bağla
    if (currentMaxT > lastT && phase === "shop") {
      setNewTier(currentMaxT);
      setLastT(currentMaxT);
    }

    // ← BURAYA EKLE: Slot açılış bildirimi
    if (turn === 9 && phase === "shop") {
      setSlotUpgrade({ slot: 6, tier: 5 });
    }
    if (turn === 11 && phase === "shop") {
      setSlotUpgrade({ slot: 7, tier: 6 });
    }
  }, [turn, phase, lastT]);

  const refresh = () => {
    const currentFrozen = shop.filter((s) => s.frozen);
    setDiscountNext(false);
    const slotsNeeded = shopSlots - currentFrozen.length; // ← DEĞİŞTİ
    const pool = [];
    for (let t = 1; t <= maxT; t++) pool.push(...TIERS[t]);
    const s = [];
    for (let i = 0; i < slotsNeeded; i++) {
      const a = pool[Math.floor(Math.random() * pool.length)];

      let cost = a.cost;

      // buy_discount_next (Zebra) - Sürekli indirim
      team.forEach((pet) => {
        if (pet && pet.ability === "buy_discount_next") {
          cost = Math.max(1, cost - pwr(pet));
        }
      });

      // shop_discount (Kunduz) - Yüzdelik indirim (tek seferlik)
      if (discountNext) {
        team.forEach((pet) => {
          if (pet && pet.ability === "shop_discount") {
            const level = pwr(pet);
            const discountPercent = level === 1 ? 0.4 : level === 2 ? 0.6 : 0.8;
            const discountedCost = Math.floor(cost * (1 - discountPercent));
            cost = Math.max(1, discountedCost);
            console.log(
              `🦫 Kunduz %${discountPercent * 100} indirim → ${cost}💰`
            );
          }
        });
      }

      s.push({
        ...a,
        id: Math.random(),
        lvl: 1,
        exp: 0,
        curHp: a.hp,
        frozen: false,
        cost: cost,
      });
    }
    // Zebra indirimini kullandık, artık kapat
    if (discountNext) {
      console.log("🦓 Zebra indirimi kullanıldı, kapatılıyor");
      setDiscountNext(false);
    }
    setShop([...currentFrozen, ...s]);
  };

  useEffect(() => {
    refresh();
  }, [turn, shopSlots]);

  const toggleFreeze = (a) => {
    setShop(shop.map((s) => (s.id === a.id ? { ...s, frozen: !s.frozen } : s)));
  };

  const pwr = (a) => a.lvl || 1;
  const sellP = (a) => Math.ceil(a.lvl + (a.exp >= 1 ? 0.5 : 0));
  const stars = (l, e) =>
    l === 3 ? "★★★" : l === 2 ? (e >= 1 ? "★★½" : "★★") : e >= 1 ? "★½" : "★";
  const clampStat = (v) => Math.min(v, MAX_STAT);
  const getDesc = (a, lvlOverride) => {
    const m = lvlOverride || pwr(a);
    if (a.ability === "faint_buff") return `Ölünce: Rastgele dosta +${m}/+${m}`;
    if (a.ability === "none") return "Yetenek yok";
    if (a.ability === "start_buff")
      return `Savaş başı: Kendine +${m} atk geçici`;
    if (a.ability === "end_heal_one")
      return `Tur sonu: Rastgele dosta +${m} hp kalıcı`;
    if (a.ability === "faint_gold") return `Ölünce: +${m} altın`;
    if (a.ability === "sell_gold") return `Satınca: +${m} altın`;
    if (a.ability === "buy_buff_random")
      return `Hayvan alınca: Rastgele dosta +${m}/+${m} kalıcı`;
    if (a.ability === "start_team_shield")
      return `Savaş başı: Takıma +${m} hp geçici`;
    if (a.ability === "levelup_buff_self")
      return `Seviye atlayınca: +${m * 2}/+${m * 2} kalıcı`;

    if (a.ability === "faint_copy") {
      const pct = m === 1 ? 25 : m === 2 ? 50 : 100;
      return `Ölünce: Rastgele dosta %${pct} stat kalıcı`;
    }
    if (a.ability === "start_dmg")
      return `Savaş başı: Rastgele düşmana ${2 * m} hasar`;
    if (a.ability === "atk_buff") return `Her vuruşta: +${m} atk geçici`;
    if (a.ability === "faint_dmg")
      return `Ölünce: Tüm düşmanlara ${m * 2} hasar`;
    if (a.ability === "start_poison")
      return `Savaş başı: Ön düşmana -${m * 2} atk geçici`;
    if (a.ability === "friend_summon")
      return `Dost ölünce: ${m}/${m * 2} yavru çağır`;
    if (a.ability === "end_steal_stat")
      return `Tur sonu: Düşmandan +${m} atk çal (kalıcı)`;
    if (a.ability === "start_speed")
      return `Savaş başı: İlk ${m} tur çift vuruş`;
    if (a.ability === "shop_discount")
      return `Alınca: Sonraki refresh'te %${
        m === 1 ? 40 : m === 2 ? 60 : 80
      } indirim (min 1💰)`;

    if (a.ability === "faint_shield")
      return `Ölünce: Tüm dostlara +${2 * m} hp geçici`;
    if (a.ability === "start_snipe")
      return `Savaş başı: Arka düşmana ${3 * m} hasar`;
    if (a.ability === "friend_faint")
      return `Dost ölünce: +${2 * m}/+${m} geçici`;
    if (a.ability === "end_team_buff")
      return `Tur sonu: Arkadaki 2 dosta +${m}/+${m} kalıcı`;
    if (a.ability === "start_charge") return `Savaş başı: +${2 * m} atk geçici`;
    if (a.ability === "hurt_heal_friend")
      return `Hasar alınca: Rastgele dosta +${m * 2} hp geçici`;
    if (a.ability === "buy_buff_behind")
      return `Hayvan alınca: Arkadakine +${m}/+${m} kalıcı`;
    if (a.ability === "hurt_weaken_attacker")
      return `Hasar alınca: Saldırana -${m * 2} atk geçici`;
    if (a.ability === "levelup_free_reroll")
      return `Seviye atlayınca: ${m} ücretsiz reroll`;

    if (a.ability === "kill_buff")
      return `Öldürünce: +${2 * m}/+${2 * m} geçici`;
    if (a.ability === "faint_summon")
      return `Ölünce: ${3 * m}/${3 * m} yavru çağır`;
    if (a.ability === "start_all")
      return `Savaş başı: Tüm takıma +${m} atk geçici`;
    if (a.ability === "hurt_buff") return `Hasar alınca: +${2 * m} atk geçici`;
    if (a.ability === "end_all") return `Tur sonu: Tüm takıma +${m} hp kalıcı`;
    if (a.ability === "start_tank") return `Savaş başı: +${3 * m} hp geçici`;
    if (a.ability === "hurt_team_buff")
      return `Hasar alınca: Takıma +${m} atk geçici`;
    if (a.ability === "end_buff_ahead")
      return `Tur sonu: Öndeki 2'ye +${m}/+${m} kalıcı`;
    if (a.ability === "buy_discount_next")
      return `Mağazada: -${m} altın indirim (min 1)`;

    if (a.ability === "start_fear")
      return `Savaş başı: Ön düşmana -${4 * m} atk geçici`;
    if (a.ability === "hurt_dmg")
      return `Hasar alınca: Saldırana ${4 * m} hasar`;
    if (a.ability === "start_trample")
      return `Savaş başı: +${5 * m} atk geçici, fazla hasarı arkaya ver`;
    if (a.ability === "faint_rage")
      return `Ölünce: Tüm takıma +${4 * m}/+${4 * m} geçici`;
    if (a.ability === "revenge") return `Ölünce: Katile ${6 * m} hasar ver`;
    if (a.ability === "start_triple")
      return `Savaş başı: İlk ${m} saldırı 3x hasar`;
    if (a.ability === "kill_fear_all")
      return `Öldürünce: Tüm düşmanlara -${2 * m} atk geçici`;
    if (a.ability === "start_freeze_enemy")
      return `Savaş başı: Ön düşmanı %${m * 30} yavaşlat (hasarı azalt)`;
    if (a.ability === "end_gain_gold") return `Tur sonu: +${m} altın`;

    if (a.ability === "start_fire")
      return `Savaş başı: Tüm düşmanlara ${5 * m} hasar`;
    if (a.ability === "devour")
      return `Öldürünce: Düşmanın %${30 + 10 * m} statını al`;
    if (a.ability === "faint_wave")
      return `Ölünce: Tüm düşmanlara ${6 * m} hasar`;
    if (a.ability === "double") return `İlk ${m} saldırı: 2x hasar`;
    if (a.ability === "weaken_strong")
      return `Savaş başı: En güçlü düşmanın statı -%${25 * m} geçici`;
    if (a.ability === "start_shield_all")
      return `Savaş başı: Takıma +${4 * m} hp geçici`;
    if (a.ability === "kill_heal_team")
      return `Öldürünce: Takıma +${3 * m} hp geçici`;
    if (a.ability === "start_multi_snipe")
      return `Savaş başı: ${m} düşmana ${3 * m} hasar`;
    if (a.ability === "faint_duplicate")
      return `Ölünce: Rastgele dostu kopyala`;

    return "";
  };

  const addRew = () => {
    const rt = Math.min(maxT + 1, 6);
    const pool = [...TIERS[rt]];
    const ch = [];
    const used = new Set();
    const grpId = Math.random();
    for (let i = 0; i < 3; i++) {
      let idx;
      do {
        idx = Math.floor(Math.random() * pool.length);
      } while (used.has(idx) && used.size < pool.length);
      used.add(idx);
      ch.push({
        ...pool[idx],
        id: Math.random(),
        lvl: 1,
        exp: 0,
        curHp: pool[idx].hp,
        isR: true,
        rT: rt,
        grp: grpId,
      });
    }
    return ch;
  };

  const merge = (base, add) => {
    const oL = base.lvl;
    let nL = base.lvl;
    let nE = base.exp + (add.exp || 0) + 1;
    while (nE >= 2 && nL < 3) {
      nL++;
      nE -= 2;
    }
    if (nL >= 3) nE = 0;
    const b = nL - oL + 1;

    let atkBonus = b;
    let hpBonus = b;

    // levelup_buff_self yeteneği
    if (base.ability === "levelup_buff_self" && nL > oL) {
      const m = pwr({ ...base, lvl: nL });
      atkBonus += m * 2;
      hpBonus += m * 2;
    }

    const m = {
      ...base,
      lvl: nL,
      exp: nE,
      atk: clampStat(base.atk + atkBonus),
      hp: clampStat(base.hp + hpBonus),
      curHp: clampStat(base.curHp + hpBonus),
    };

    // levelup_free_reroll yeteneği
    if (base.ability === "levelup_free_reroll" && nL > oL) {
      const freeRolls = pwr({ ...base, lvl: nL });
      m.freeRerolls = (m.freeRerolls || 0) + freeRolls;
    }

    let newRewards = [];
    if (nL > oL) {
      newRewards = addRew();
    }

    return { merged: m, rewards: newRewards };
  };

  const buy = (a, slot) => {
    if (!a.isR && gold < a.cost) return;
    const nt = [...team];

    if (
      nt[slot] &&
      nt[slot].name === a.name &&
      nt[slot].tier === a.tier &&
      nt[slot].lvl < 3
    ) {
      const { merged, rewards: newRewards } = merge(nt[slot], a);
      nt[slot] = merged;
      setTeam(nt);

      if (!a.isR) {
        setGold((g) => g - a.cost);
        setShop(shop.filter((x) => x.id !== a.id));

        // Merge sonrası Kunduz olduysa flag aç
        if (merged.ability === "shop_discount") {
          console.log("🦫 Kunduz merge oldu! Sonraki refresh indirimli olacak");
          setDiscountNext(true);
        }

        if (newRewards.length > 0) {
          setRewards((prev) => [...prev, ...newRewards]);
        }
      } else {
        setRewards((prev) => [
          ...prev.filter((x) => x.grp !== a.grp),
          ...newRewards,
        ]);
      }

      // buy_buff_random yeteneği (yeni hayvan alındığında) - GEÇİCİ
      nt.forEach((pet, idx) => {
        if (pet && pet.ability === "buy_buff_random" && idx !== slot) {
          const m = pwr(pet);
          const allies = nt.filter((t, i) => t && i !== idx);
          if (allies.length > 0) {
            const target = allies[Math.floor(Math.random() * allies.length)];
            const targetIdx = nt.findIndex((t) => t && t.id === target.id);
            if (targetIdx !== -1) {
              triggerAnim(pet.id, "buff");
              setTimeout(() => {
                triggerAnim(nt[targetIdx].id, "buff");
              }, 200);

              // Geçici buff - sadece bir sonraki savaş için
              nt[targetIdx] = {
                ...nt[targetIdx],
                tempAtk: (nt[targetIdx].tempAtk || 0) + m, // ← YENİ
                tempHp: (nt[targetIdx].tempHp || 0) + m, // ← YENİ
              };
            }
          }
        }
      });

      nt.forEach((pet, idx) => {
        if (pet && pet.ability === "buy_buff_behind") {
          const m = pwr(pet);
          // Arkadaki dost var mı?
          if (idx < 4 && nt[idx + 1]) {
            nt[idx + 1] = {
              ...nt[idx + 1],
              atk: clampStat(nt[idx + 1].atk + m),
              hp: clampStat(nt[idx + 1].hp + m),
              curHp: clampStat(nt[idx + 1].curHp + m),
            };
            triggerAnim(nt[idx + 1].id, "buff");
          }
        }
      });
      setTeam(nt);
      setSel(null);
      return;
    }

    if (nt[slot] !== null) return;

    nt[slot] = {
      ...a,
      lvl: a.lvl || 1,
      exp: a.exp || 0,
      curHp: a.curHp || a.hp,
      isR: undefined,
      rT: undefined,
      grp: undefined,
    };

    if (!a.isR) {
      setGold((g) => g - a.cost);
      setShop(shop.filter((x) => x.id !== a.id));
    } else {
      setRewards(rewards.filter((x) => x.grp !== a.grp));
    }

    // Kunduz alındı mı? (Mağazadan veya ödülden fark etmez)
    if (a.ability === "shop_discount") {
      console.log("🦫 Kunduz alındı (ilk)! Sonraki refresh indirimli olacak");
      setDiscountNext(true);
    }
    // buy_buff_random yeteneği (yeni hayvan alındığında) - GEÇİCİ
    nt.forEach((pet, idx) => {
      if (pet && pet.ability === "buy_buff_random" && idx !== slot) {
        const m = pwr(pet);
        const allies = nt.filter((t, i) => t && i !== idx);
        if (allies.length > 0) {
          const target = allies[Math.floor(Math.random() * allies.length)];
          const targetIdx = nt.findIndex((t) => t && t.id === target.id);
          if (targetIdx !== -1) {
            triggerAnim(pet.id, "buff");
            setTimeout(() => {
              triggerAnim(nt[targetIdx].id, "buff");
            }, 200);

            // Sadece geçici buff (curHp ve atk, hp değil)
            nt[targetIdx] = {
              ...nt[targetIdx],
              atk: clampStat(nt[targetIdx].atk + m),
              curHp: clampStat(nt[targetIdx].curHp + m),
              // hp kalıcı artmıyor!
            };
          }
        }
      }
    });
    // buy_buff_behind yeteneği
    nt.forEach((pet, idx) => {
      if (pet && pet.ability === "buy_buff_behind") {
        const m = pwr(pet);
        if (idx < 4 && nt[idx + 1]) {
          nt[idx + 1] = {
            ...nt[idx + 1],
            atk: clampStat(nt[idx + 1].atk + m),
            hp: clampStat(nt[idx + 1].hp + m),
            curHp: clampStat(nt[idx + 1].curHp + m),
          };
          triggerAnim(nt[idx + 1].id, "buff");
        }
      }
    });

    setTeam(nt);
    setSel(null);
  };

  const mergeT = (fi, ti) => {
    const nt = [...team];
    const f = nt[fi];
    const t = nt[ti];

    if (f && t && f.name === t.name && f.tier === t.tier) {
      if (t.lvl === 3 || f.lvl === 3) {
        [nt[fi], nt[ti]] = [nt[ti], nt[fi]];
        setTeam(nt);
        setSelI(null);
        return true;
      }
      if (t.lvl < 3) {
        const { merged, rewards: newRewards } = merge(t, f);
        nt[ti] = merged;
        nt[fi] = null;
        setTeam(nt);
        if (newRewards.length > 0) {
          setRewards((prev) => [...prev, ...newRewards]);
        }
        setSelI(null);
        return true;
      }
    }
    return false;
  };

  const sell = (i) => {
    if (!team[i]) return;
    const pet = team[i];
    let goldGain = sellP(pet);

    // sell_gold yeteneği kontrolü
    if (pet.ability === "sell_gold") {
      goldGain += pwr(pet);
    }

    setGold((g) => g + goldGain);
    const nt = [...team];
    nt[i] = null;
    setTeam(nt);
    setSelI(null);
  };

  const swap = (a, b) => {
    const nt = [...team];
    const itemA = nt[a];
    const itemB = nt[b];

    if (
      itemA &&
      itemB &&
      itemA.name === itemB.name &&
      itemA.tier === itemB.tier
    ) {
      if (itemA.lvl === 3 || itemB.lvl === 3) {
        [nt[a], nt[b]] = [nt[b], nt[a]];
        setTeam(nt);
        setSelI(null);
        return;
      }
    }

    [nt[a], nt[b]] = [nt[b], nt[a]];
    setTeam(nt);
    setSelI(null);
  };

  const applyEndTurnBuffs = () => {
    const nt = [...team];
    nt.forEach((a, i) => {
      if (!a) return;
      const m = pwr(a);
      if (a.ability === "end_heal_one") {
        const allies = nt.filter((t, idx) => t && idx !== i);
        if (allies.length > 0) {
          const tIdx = nt.findIndex(
            (t, idx) =>
              t &&
              idx !== i &&
              t.id === allies[Math.floor(Math.random() * allies.length)].id
          );
          if (tIdx !== -1)
            nt[tIdx] = {
              ...nt[tIdx],
              hp: clampStat(nt[tIdx].hp + m),
              curHp: clampStat(nt[tIdx].curHp + m),
            };
        }
      }
      if (a.ability === "end_team_buff") {
        let behind = nt.slice(i + 1).filter((x) => x);
        behind.slice(0, 2).forEach((t) => {
          const idx = nt.findIndex((x) => x && x.id === t.id);
          if (idx !== -1)
            nt[idx] = {
              ...nt[idx],
              atk: clampStat(nt[idx].atk + m),
              hp: clampStat(nt[idx].hp + m),
              curHp: clampStat(nt[idx].curHp + m),
            };
        });
      }
      if (a.ability === "end_all") {
        nt.forEach((t, j) => {
          if (t)
            nt[j] = {
              ...nt[j],
              hp: clampStat(nt[j].hp + m),
              curHp: clampStat(nt[j].curHp + m),
            };
        });
      }
      if (a.ability === "end_steal_stat") {
        nt[i] = {
          ...nt[i],
          atk: clampStat(nt[i].atk + m),
        };
      }
      if (a.ability === "end_buff_ahead") {
        // Öndeki 2 hayvana buff ver
        let ahead = nt.slice(0, i).filter((x) => x);
        ahead.slice(-2).forEach((t) => {
          const idx = nt.findIndex((x) => x && x.id === t.id);
          if (idx !== -1) {
            nt[idx] = {
              ...nt[idx],
              atk: clampStat(nt[idx].atk + m),
              hp: clampStat(nt[idx].hp + m),
              curHp: clampStat(nt[idx].curHp + m),
            };
          }
        });
      }
    });
    nt.forEach((a, i) => {
      if (a) {
        nt[i] = {
          ...nt[i],
          tempAtk: 0,
          tempHp: 0,
        };
      }
    });
    setTeam(nt);
  };

  const genE = () => {
    const cnt = Math.min(2 + Math.floor(turn / 2), 5);
    const pool = [];
    for (let t = 1; t <= maxT; t++) pool.push(...TIERS[t]);
    return Array.from({ length: cnt }, () => {
      const b = pool[Math.floor(Math.random() * pool.length)];
      const bn = Math.floor((turn / 2) * difficulty);
      const l = Math.min(
        1 + Math.floor(Math.random() * Math.ceil(turn / 3)),
        3
      );
      const rawAtk = (b.atk + bn + l - 1) * difficulty;
      const rawHp = (b.hp + bn + l - 1) * difficulty;
      return {
        ...b,
        id: Math.random(),
        lvl: l,
        exp: 0,
        atk: clampStat(Math.floor(rawAtk)), // ← EKLE: Clamp!
        hp: clampStat(Math.floor(rawHp)), // ← EKLE: Clamp!
        curHp: clampStat(Math.floor(rawHp)), // ← EKLE: Clamp!
      };
    });
  };

  const appStart = (p, e) => {
    let pp = p.map((x) => ({ ...x }));
    let ee = e.map((x) => ({ ...x }));
    let lg = [];
    pp.forEach((a, i) => {
      if (a.tempAtk) {
        pp[i].atk += a.tempAtk;
        lg.push(`✨ ${a.nick} +${a.tempAtk} atk (geçici)`);
      }
      if (a.tempHp) {
        pp[i].curHp += a.tempHp;
        lg.push(`✨ ${a.nick} +${a.tempHp} hp (geçici)`);
      }
    });
    pp.forEach((a, i) => {
      const m = pwr(a);
      if (a.ability === "start_buff") {
        pp[i].atk += m;
        triggerAnim(a.id, "buff");
        lg.push(`⚔️ ${a.nick} +${m}`);
      }
      if (a.ability === "start_buff_random" && pp.length > 1) {
        console.log(`🦗 Çekirge tetiklendi! ${a.nick}`);
        // Kendisi hariç rastgele bir dosta buff ver
        const allies = pp.filter((_, idx) => idx !== i);
        if (allies.length > 0) {
          const target = allies[Math.floor(Math.random() * allies.length)];
          const targetIdx = pp.findIndex((x) => x && x.id === target.id);
          if (targetIdx !== -1) {
            pp[targetIdx].atk += m;
            pp[targetIdx].curHp += m;
            triggerAnim(target.id, "buff");
            lg.push(`🦗 ${a.nick} → ${target.nick} +${m}/+${m}`);
          }
        }
      }
      if (a.ability === "start_all") {
        pp.forEach((x, j) => {
          pp[j].atk += m;
          triggerAnim(x.id, "buff");
        });
        lg.push(`⚔️ ${a.nick} takım +${m}`);
      }
      if (a.ability === "start_snipe" && ee.length > 0) {
        const t = ee.length > 1 ? ee.length - 1 : 0;
        ee[t].curHp -= 3 * m;
        triggerAnim(ee[t].id, "damage");
        lg.push(`🎯 ${a.nick} ${3 * m}`);
        ee = ee.filter((x) => x.curHp > 0);
      }

      if (a.ability === "start_multi_snipe" && ee.length > 0) {
        // Level kadar düşmana snipe yap (max düşman sayısı kadar)
        const targetCount = Math.min(m, ee.length);
        for (let j = 0; j < targetCount; j++) {
          if (ee.length > 0) {
            // Rastgele düşman seç
            const targetIdx = Math.floor(Math.random() * ee.length);
            ee[targetIdx].curHp -= 3 * m;
            triggerAnim(ee[targetIdx].id, "damage");
            lg.push(`🦑 ${a.nick} → ${ee[targetIdx].nick}'e ${3 * m} hasar`);
            // Ölen düşmanları temizle
            ee = ee.filter((x) => x.curHp > 0);
          }
        }
      }

      if (a.ability === "start_fear" && ee.length > 0) {
        ee[0].atk = Math.max(1, ee[0].atk - 4 * m);
        lg.push(`😨 ${a.nick} -${4 * m}`);
      }
      if (a.ability === "start_fire") {
        ee.forEach((x) => {
          x.curHp -= 5 * m;
          triggerAnim(x.id, "damage");
        });
        lg.push(`🔥 ${a.nick} ${5 * m}`);
        ee = ee.filter((x) => x.curHp > 0);
      }
      if (a.ability === "start_charge") {
        pp[i].atk += 2 * m;
        triggerAnim(a.id, "buff");
        lg.push(`⚡ ${a.nick} +${2 * m}`);
      }
      if (a.ability === "start_trample") {
        pp[i].atk += 5 * m;
        pp[i].trample = true;
        triggerAnim(a.id, "buff");
        lg.push(`🦏 ${a.nick} +${5 * m}`);
      }
      if (a.ability === "start_tank") {
        // Su Aygırı: Ölünce stat kopyalama yeteneği artık burada değil
        // Yengeç: Savaş başı +HP verme yeteneği
        pp[i].curHp += 3 * m;
        triggerAnim(a.id, "buff");
        lg.push(`🦀 ${a.nick} +${3 * m} hp`);
      }
      if (a.ability === "start_shield_all") {
        pp.forEach((x, j) => {
          pp[j].curHp = clampStat(pp[j].curHp + 4 * m);
          triggerAnim(x.id, "buff");
        });
        lg.push(`🦕 ${a.nick} → Takıma +${4 * m} hp kalkan`);
      }
      if (a.ability === "start_dmg" && ee.length > 0) {
        const t = Math.floor(Math.random() * ee.length);
        ee[t].curHp -= 2 * m;
        triggerAnim(ee[t].id, "damage");
        lg.push(`💥 ${a.nick} ${2 * m}`);
        ee = ee.filter((x) => x.curHp > 0);
      }
      if (a.ability === "start_poison" && ee.length > 0) {
        ee[0].atk = Math.max(1, ee[0].atk - m * 2);
        lg.push(`🐍 ${a.nick} -${m * 2}`);
      }
      if (a.ability === "weaken_strong" && ee.length > 0) {
        let mxI = 0,
          mxP = 0;
        ee.forEach((en, idx) => {
          if (en.atk + en.curHp > mxP) {
            mxP = en.atk + en.curHp;
            mxI = idx;
          }
        });
        const r = (25 * m) / 100;
        ee[mxI].atk = Math.max(1, Math.floor(ee[mxI].atk * (1 - r)));
        ee[mxI].curHp = Math.max(1, Math.floor(ee[mxI].curHp * (1 - r)));
        triggerAnim(ee[mxI].id, "damage");
        lg.push(`🐲 ${a.nick} → ${ee[mxI].nick}'i %${25 * m} zayıflattı`); // ← DEĞİŞTİR
      }
      if (a.ability === "start_freeze_enemy" && ee.length > 0) {
        // Ön düşmanı yavaşlat (%30/%60/%90)
        const slowPercent = m * 30;
        const reduction = slowPercent / 100;
        ee[0].atk = Math.max(1, Math.floor(ee[0].atk * (1 - reduction)));
        triggerAnim(ee[0].id, "damage");
        lg.push(`🦣 ${a.nick} → ${ee[0].nick}'i %${slowPercent} yavaşlattı`);
      }
    });
    return { pp, ee, lg };
  };

  const battle = () => {
    setIsBattleOver(false);
    setRewards([]);
    battleGoldRef.current = 0;

    // Takımı kopyala (tempAtk/tempHp'yi olduğu gibi bırak, appStart kullanacak)
    const pt = team
      .filter((x) => x)
      .map((x) => ({
        ...x,
        curHp: x.hp,
        // tempAtk ve tempHp burada DOKUNMAYIN, appStart'ta kullanılacak
      }));

    // Team state'inden geçici buff'ları temizle
    setTeam((prevTeam) =>
      prevTeam.map((pet) => (pet ? { ...pet, tempAtk: 0, tempHp: 0 } : pet))
    );

    if (pt.length === 0) return;
    const et = genE();
    const { pp, ee, lg } = appStart(pt, et);
    setET(ee);
    setPT(pp);
    setLog(lg);
    setStep(0);
    setPGold(0);
    setPhase("battle");
  };
  const faint = (d, al, en, isP, killer) => {
    // Aynı hayvan zaten öldüyse işleme
    if (d.isDead) {
      console.log(`⚠️ ${d.nick} (${d.id}) zaten ölü, atlıyorum`);
      return { lg: [], sm: [], gG: 0 };
    }

    d.isDead = true; // İşaretle
    const m = pwr(d);
    let lg = [],
      sm = [],
      gG = 0;

    if (d.ability === "faint_buff" && al.length > 0) {
      const i = Math.floor(Math.random() * al.length);
      al[i].atk = clampStat(al[i].atk + m);
      al[i].curHp = clampStat(al[i].curHp + m);
      lg.push(`💀 ${d.nick} → ${al[i].nick}'e +${m}/+${m}`);
    }
    if (d.ability === "faint_copy" && al.length > 0) {
      const i = Math.floor(Math.random() * al.length);
      const pct = m === 1 ? 0.25 : m === 2 ? 0.5 : 1;
      const originalAtk = d.atk;
      const originalHp = d.hp;
      al[i].atk = clampStat(al[i].atk + Math.floor(originalAtk * pct));
      al[i].curHp = clampStat(al[i].curHp + Math.floor(originalHp * pct));
      lg.push(`🦛 ${d.nick} → ${al[i].nick}'e %${pct * 100} stat`);
    }
    if (d.ability === "faint_dmg") {
      en.forEach((x) => {
        x.curHp -= m * 2;
      });
      lg.push(`💀 ${d.nick} → Herkese ${m * 2} hasar`);
    }
    if (d.ability === "faint_shield") {
      al.forEach((x) => {
        x.curHp = clampStat(x.curHp + 2 * m);
      });
      lg.push(`🛡️ ${d.nick} → Herkese +${2 * m} hp`);
    }
    if (d.ability === "faint_rage") {
      al.forEach((x) => {
        x.atk = clampStat(x.atk + 4 * m);
        x.curHp = clampStat(x.curHp + 4 * m);
      });
      lg.push(`🐻 ${d.nick} → Herkese +${4 * m}/+${4 * m}`);
    }
    if (d.ability === "faint_wave") {
      en.forEach((x) => {
        x.curHp -= 6 * m;
      });
      lg.push(`🌊 ${d.nick} → Herkese ${6 * m} hasar`);
    }
    if (d.ability === "faint_summon") {
      sm.push({
        name: "🥚",
        nick: "Yavru",
        atk: 3 * m,
        hp: 3 * m,
        curHp: 3 * m,
        ability: "none",
        tier: 1,
        lvl: 1,
        exp: 0,
        id: Math.random(),
      });
      lg.push(`🥚 ${d.nick} → ${3 * m}/${3 * m} yavru`);
    }
    if (d.ability === "faint_gold" && isP) {
      console.log(`🐷 DOMUZ GOLD TETİKLENDİ - ${d.nick} (id: ${d.id})`);
      gG = m;
      lg.push(`💰 ${d.nick} → +${m} altın`);
    }
    if (d.ability === "revenge" && killer) {
      killer.curHp -= 6 * m;
      lg.push(`🦍 ${d.nick} → ${killer.nick}'e intikam ${6 * m}`);
    }

    al.forEach((a) => {
      if (a.ability === "friend_faint") {
        const am = pwr(a);
        a.atk = clampStat(a.atk + 2 * am);
        a.curHp = clampStat(a.curHp + am);
        lg.push(`🐺 ${a.nick} → +${2 * am}/+${am}`);
      }
    });

    // Kanguru: Dost ölünce yavru çağır (max 3 kez)
    al.forEach((a) => {
      if (a.ability === "friend_summon" && !a.isSummon) {
        // Her Kanguru max 3 yavru çağırabilir
        if (!a.summonCount) a.summonCount = 0;
        if (a.summonCount < 3) {
          const am = pwr(a);
          sm.push({
            name: "🦘",
            nick: "Yavru",
            atk: am,
            hp: am * 2,
            curHp: am * 2,
            ability: "none",
            tier: 1,
            lvl: 1,
            exp: 0,
            id: Math.random(),
            isSummon: true,
          });
          a.summonCount++;
          lg.push(`🦘 ${a.nick} → ${am}/${am * 2} yavru (${a.summonCount}/3)`);
        }
      }
    });

    if (d.ability === "faint_duplicate" && al.length > 0 && isP) {
      const i = Math.floor(Math.random() * al.length);
      const copy = {
        ...al[i],
        id: Math.random(),
        curHp: al[i].hp, // ← Full HP ile spawn olsun
      };
      sm.push(copy);
      lg.push(`🐙 ${d.nick} → ${al[i].nick} kopyalandı`);
    }
    return { lg, sm, gG };
  };

  useEffect(() => {
    if (phase !== "battle" || isBattleOver) return; // ← DEĞİŞTİR: Flag kontrolü ekle

    if (pT.length === 0 || eT.length === 0) {
      setIsBattleOver(true); // ← EKLE: Flag set et (multiple timeout önle)

      const won = eT.length === 0 && pT.length > 0;
      const draw = pT.length === 0 && eT.length === 0;

      if (won || draw) {
        const updatedTeam = team.map((pet) => {
          if (pet && pet.ability === "end_steal_stat") {
            const m = pwr(pet);
            return {
              ...pet,
              atk: clampStat(pet.atk + m),
            };
          }
          return pet;
        });
        setTeam(updatedTeam);
      }

      setTimeout(() => {
        if (won) {
          setWins((w) => w + 1);
          setLog((l) => [...l, "🎉 ZAFER!"]);
        }

        // 20. tura ulaştıysan oyun biter (kazansan da kaybetsen de)
        if (turn >= WIN_TURN) {
          setTimeout(() => setVictory(true), 1000);
          return;
        }

        if (draw) {
          setLog((l) => [...l, "🤝 Berabere"]);
        } else if (!won) {
          // Yenilgi: Yeni lives'ı hemen hesapla (state gecikmesini önle)
          const newLives = lives - 1;
          setLives(newLives);
          setLog((l) => [...l, "💀 Yenilgi"]);

          // Over check'ini YENİ lives ile yap (zamanlama sorunu yok)
          if (newLives <= 0) {
            setOver(true);
            return; // Next turn'e geçme
          }
        }

        // Kazan/Berabere/Yenilgi (ama over değilse) → Next turn
        setTimeout(() => {
          const newTurn = turn + 1;
          setTurn(newTurn);
          const baseGold = 10; // Her tur sabit 10 altın

          // Deve bonusu hesapla
          let camelBonus = 0;
          team.forEach((pet) => {
            if (pet && pet.ability === "end_gain_gold") {
              camelBonus += pwr(pet);
            }
          });

          const battleGold = battleGoldRef.current;
          console.log(
            `💰 TUR GEÇİŞİ: baseGold=${baseGold}, battleGold=${battleGold}, camelBonus=${camelBonus}`
          );
          setGold((prevGold) => {
            const total = baseGold + battleGold + camelBonus + prevGold;
            return total;
          });
          applyEndTurnBuffs();
          setPhase("shop");
        }, 1000);
      }, 400);
      return;
    }

    const tmr = setTimeout(async () => {
      let p = [...pT];
      let e = [...eT];
      let lg = [];
      const a = p[0];
      const d = e[0];
      let pS = [];
      let eS = [];
      const oldAId = a.id;
      const oldDId = d.id;
      let aD = a.atk;
      let dD = d.atk;

      triggerAnim(a.id, "attackLeft");
      triggerAnim(d.id, "attackRight");
      await new Promise((resolve) => setTimeout(resolve, 600));

      const doubleLimit = pwr(a);
      if (
        a.ability === "double" &&
        (!a.doubleCount || a.doubleCount < doubleLimit)
      ) {
        aD *= 2;
        p[0].doubleCount = (p[0].doubleCount || 0) + 1;
        lg.push(`⚡ ${a.nick} 2x!`);
      }

      p[0].curHp -= dD;
      e[0].curHp -= aD;

      if (a.trample && e[0].curHp <= 0 && e.length > 1) {
        const excess = Math.abs(e[0].curHp);
        e[1].curHp -= excess;
        lg.push(`🦏 çiğneme +${excess}`);
      }

      triggerAnim(a.id, "damage");
      triggerAnim(d.id, "damage");
      await new Promise((resolve) => setTimeout(resolve, 600));

      lg.push(`${a.nick} ⚔ ${d.nick} → ${aD}/${dD}`);
      setLog((l) => [...l, ...lg]);
      lg = [];

      if (a.ability === "atk_buff" && p[0].curHp > 0) {
        p[0].atk = clampStat(p[0].atk + pwr(a));
        triggerAnim(a.id, "buff");
        setLog((l) => [...l, `🐀 ${a.nick} +${pwr(a)} atk`]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (a.ability === "hurt_buff" && p[0].curHp > 0 && dD > 0) {
        p[0].atk = clampStat(p[0].atk + 2 * pwr(a));
        triggerAnim(a.id, "buff");
        setLog((l) => [...l, `🐃 ${a.nick} +${2 * pwr(a)} atk`]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Kokarca: Hasar alınca saldıranı zayıflat
      if (
        a.ability === "hurt_weaken_attacker" &&
        p[0].curHp > 0 &&
        dD > 0 &&
        e[0]
      ) {
        e[0].atk = Math.max(1, e[0].atk - 2 * pwr(a));
        triggerAnim(e[0].id, "damage");
        setLog((l) => [...l, `🦨 ${a.nick} → düşman -${2 * pwr(a)} atk`]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Lama: Hasar alınca rastgele dosta heal
      if (
        a.ability === "hurt_heal_friend" &&
        p[0].curHp > 0 &&
        dD > 0 &&
        p.length > 1
      ) {
        const allies = p.slice(1);
        const target = allies[Math.floor(Math.random() * allies.length)];
        target.curHp = clampStat(target.curHp + 2 * pwr(a));
        triggerAnim(target.id, "buff");
        setLog((l) => [
          ...l,
          `🦙 ${a.nick} → ${target.nick} +${2 * pwr(a)} hp`,
        ]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (
        a.ability === "hurt_dmg" &&
        p[0].curHp > 0 &&
        dD > 0 &&
        e[0].curHp > 0
      ) {
        e[0].curHp -= 4 * pwr(a);
        triggerAnim(e[0].id, "damage");
        setLog((l) => [...l, `🐘 ${a.nick} → ${4 * pwr(a)} hasar`]);
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      if (a.ability === "kill_buff" && e[0].curHp <= 0) {
        p[0].atk = clampStat(p[0].atk + 2 * pwr(a));
        p[0].curHp = clampStat(p[0].curHp + 2 * pwr(a));
        triggerAnim(a.id, "buff");
        setLog((l) => [...l, `🦈 ${a.nick} +${2 * pwr(a)}/+${2 * pwr(a)}`]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (a.ability === "devour" && e[0].curHp <= 0) {
        const pct = (30 + 10 * pwr(a)) / 100;
        const atkGain = Math.floor(e[0].atk * pct);
        const hpGain = Math.floor((e[0].hp || e[0].curHp) * pct);
        p[0].atk = clampStat(p[0].atk + atkGain);
        p[0].hp = clampStat(p[0].hp + hpGain); // ← EKLE: Max HP'yi de artır
        p[0].curHp = clampStat(p[0].curHp + hpGain);
        triggerAnim(a.id, "buff");
        setLog((l) => [...l, `🦖 ${a.nick} +${atkGain}/+${hpGain}`]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Fok: Öldürünce takıma heal
      if (a.ability === "kill_heal_team" && e[0].curHp <= 0) {
        p.forEach((pet) => {
          pet.curHp = clampStat(pet.curHp + 3 * pwr(a));
          triggerAnim(pet.id, "buff");
        });
        setLog((l) => [...l, `🦭 ${a.nick} → Takıma +${3 * pwr(a)} hp`]);
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (p[0].curHp <= 0) {
        triggerAnim(p[0].id, "deathLeft");

        const deadPet = p[0];
        p = p.slice(1); // ← BURAYA TAŞI (hemen diziden çıkar)

        const r = faint(
          deadPet,
          p,
          e,
          true,
          e.length > 0 && e[0].curHp > 0 ? e[0] : null
        );

        for (const logMsg of r.lg) {
          setLog((l) => [...l, logMsg]);

          if (deadPet.ability === "faint_buff" && p.length > 0) {
            const buffedPet = p.find((pet) => pet && logMsg.includes(pet.nick));
            if (buffedPet) {
              triggerAnim(buffedPet.id, "buff");
              await new Promise((resolve) => setTimeout(resolve, 800));
            }
          } else if (deadPet.ability === "faint_copy" && p.length > 0) {
            const buffedPet = p.find((pet) => pet && logMsg.includes(pet.nick));
            if (buffedPet) {
              triggerAnim(buffedPet.id, "buff");
              await new Promise((resolve) => setTimeout(resolve, 800));
            }
          } else if (
            deadPet.ability === "faint_dmg" ||
            deadPet.ability === "faint_wave"
          ) {
            e.forEach((enemy) => triggerAnim(enemy.id, "damage"));
            await new Promise((resolve) => setTimeout(resolve, 800));
          } else if (
            deadPet.ability === "faint_shield" ||
            deadPet.ability === "faint_rage"
          ) {
            p.forEach((pet) => pet && triggerAnim(pet.id, "buff"));
            await new Promise((resolve) => setTimeout(resolve, 800));
          } else if (deadPet.ability === "revenge" && e[0]) {
            triggerAnim(e[0].id, "damage");
            await new Promise((resolve) => setTimeout(resolve, 800));
          }

          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        pS = r.sm;
        if (r.gG > 0) {
          battleGoldRef.current += r.gG;
          console.log(
            `💰 Domuz öldü! r.gG=${r.gG}, toplam battleGold=${battleGoldRef.current}`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (e[0].curHp <= 0) {
        triggerAnim(e[0].id, "deathRight");

        const deadEnemy = e[0];
        e = e.slice(1); // ← BURAYA TAŞI

        const r = faint(
          deadEnemy,
          e,
          p,
          false,
          p.length > 0 && p[0].curHp > 0 ? p[0] : null
        );

        for (const logMsg of r.lg) {
          setLog((l) => [...l, logMsg]);
          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        eS = r.sm;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const newP = [...pS, ...p].filter((x) => x.curHp > 0);
      const newE = [...eS, ...e].filter((x) => x.curHp > 0);

      if (newP.length > 0 && newP[0].id !== oldAId) {
        triggerAnim(newP[0].id, "slideInLeft");
      }
      if (newE.length > 0 && newE[0].id !== oldDId) {
        triggerAnim(newE[0].id, "slideInRight");
      }

      // Animasyonlar başladıktan SONRA state'i güncelle
      await new Promise((resolve) => setTimeout(resolve, 100));
      setPT(newP);
      setET(newE);
      setStep((s) => s + 1);
    }, 100);

    return () => clearTimeout(tmr);
  }, [phase, step, pT, eT, lives, pGold, turn, isBattleOver]);

  useEffect(() => {
    if (logR.current) logR.current.scrollTop = logR.current.scrollHeight;
  }, [log]);

  const reset = () => {
    setGold(10);
    setTurn(1);
    setWins(0);
    setLives(5);
    setTeam([null, null, null, null, null, null, null]); // ← 7 slot
    setSlotUpgrade(null); // ← EKLE
    setPhase("shop");
    setOver(false);
    setVictory(false);
    setRewards([]);
    setNewTier(null);
    setLastT(1);
    setPGold(0);
    setGuideLvl({});
    setAnims({});
  };

  const getGuideLvl = (tier, idx) => guideLvl[`${tier}-${idx}`] || 1;
  const setGuideLvlFor = (tier, idx, lvl) =>
    setGuideLvl((prev) => ({ ...prev, [`${tier}-${idx}`]: lvl }));
  if (slotUpgrade) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-5xl mb-4">🎊</div>
        <div className="text-3xl mb-2 text-purple-300 font-bold">
          YENİ SLOT AÇILDI!
        </div>
        <div className="text-xl mb-4">
          {slotUpgrade.slot}. Slot Aktif (Kademe {slotUpgrade.tier})
        </div>
        <div className="text-lg mb-4 text-gray-300">
          Artık {slotUpgrade.slot} hayvanlı takım kurabilirsiniz!
        </div>
        <button
          onClick={() => setSlotUpgrade(null)}
          className="px-6 py-3 bg-purple-600 rounded-lg font-bold text-lg hover:bg-purple-500 transition-all"
        >
          Devam
        </button>
      </div>
    );
  }
  if (victory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-900 to-orange-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-5xl mb-4">🏆</div>
        <div className="text-3xl mb-2 text-yellow-300 font-bold">
          TEBRİKLER!
        </div>
        <div className="text-xl mb-4">{WIN_TURN}. Tura Ulaşmayı Başardın!</div>{" "}
        {/* ← Dinamik + Önerin gibi */}
        <div className="text-lg mb-2">Toplam Galibiyet: {wins}</div>
        <div className="text-lg mb-4">Kalan Can: {lives} ❤️</div>
        <button
          onClick={reset}
          className="px-6 py-3 bg-green-600 rounded-lg font-bold text-lg hover:bg-green-500 transition-all"
        >
          Yeniden Oyna
        </button>
      </div>
    );
  }

  if (over) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-3xl mb-4">💀 OYUN BİTTİ</div>
        <div className="text-xl mb-3">
          Tur: {turn} | Galibiyet: {wins}
        </div>
        <button
          onClick={reset}
          className="px-6 py-3 bg-green-600 rounded-lg font-bold text-lg hover:bg-green-500 transition-all"
        >
          Yeniden Başla
        </button>
      </div>
    );
  }

  if (guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 overflow-auto">
        <style>{`
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
          @keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 25px rgba(34,197,94,0.8); } }
        `}</style>
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
              📖 Kademe Rehberi
            </h2>
            <button
              onClick={() => setGuide(false)}
              className="px-4 py-2 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all shadow-lg"
            >
              ✕
            </button>
          </div>
          <div className="mb-4 p-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl text-sm shadow-lg border border-gray-600">
            <div className="text-yellow-400 mb-1 font-bold">
              🎯 Hedef: 20. tura ulaşıp kazan!
            </div>
            <div className="text-gray-300">
              💡 Yıldızlara tıklayarak seviye güçlerini gör
            </div>
            <div className="text-gray-300">
              ❄️ Mağazada hayvana sağ tıkla = Dondur
            </div>
            <div className="text-gray-300">📊 Maksimum stat: {MAX_STAT}</div>
          </div>
          {[1, 2, 3, 4, 5, 6].map((t) => (
            <div
              key={t}
              className={`mb-4 p-4 rounded-xl bg-gradient-to-br ${TBG[t]} border-2 ${TBD[t]} shadow-xl`}
            >
              <div className="font-bold mb-3 text-lg">
                Kademe {t}{" "}
                <span className="text-gray-300 text-sm font-normal">
                  (Tur {t * 2 - 1}+)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {TIERS[t].map((a, idx) => {
                  const lvl = getGuideLvl(t, idx);
                  return (
                    <div
                      key={idx}
                      className="bg-black/40 rounded-lg p-3 flex items-center gap-3 hover:bg-black/50 transition-all"
                    >
                      <span className="text-3xl drop-shadow-lg">{a.name}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-white">{a.nick}</span>
                          <span className="text-red-400 font-bold">
                            {a.atk + (lvl - 1)}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="text-green-400 font-bold">
                            {a.hp + (lvl - 1)}
                          </span>
                          <span className="text-yellow-400 text-sm font-bold">
                            {a.cost}💰
                          </span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map((l) => (
                              <button
                                key={l}
                                onClick={() => setGuideLvlFor(t, idx, l)}
                                className={`text-base ${
                                  lvl >= l ? "text-yellow-400" : "text-gray-600"
                                } hover:scale-125 transition-transform`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-300 leading-relaxed">
                          {getDesc({ ...a, lvl }, lvl)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (newTier) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="text-2xl mb-3 text-green-400">
          🆕 Kademe {newTier} Açıldı!
        </div>
        <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-lg">
          {TIERS[newTier].map((a, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${TBG[a.tier]} border-2 ${
                TBD[a.tier]
              } rounded-lg p-2 w-36`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{a.name}</span>
                <span className="text-sm font-bold">{a.nick}</span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-red-400 font-bold">{a.atk}</span>
                <span className="text-gray-400">/</span>
                <span className="text-green-400 font-bold">{a.hp}</span>
              </div>
              <div className="text-xs text-gray-300">
                {getDesc({ ...a, lvl: 1 }, 1)}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setNewTier(null)}
          className="px-6 py-3 bg-green-600 rounded-lg font-bold hover:bg-green-500 transition-all"
        >
          Devam
        </button>
      </div>
    );
  }

  const empty = team.filter((x) => x === null).length;
  const hasR = rewards.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-2">
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(34,197,94,0.3); } 50% { box-shadow: 0 0 25px rgba(34,197,94,0.8); } }
        @keyframes attackLeft { 
          0% { transform: translateX(0); } 
          50% { transform: translateX(30px); } 
          100% { transform: translateX(0); } 
        }
        @keyframes attackRight { 
          0% { transform: translateX(0); } 
          50% { transform: translateX(-30px); } 
          100% { transform: translateX(0); } 
        }
        @keyframes fadeOutLeft {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(-50px) scale(0.5); opacity: 0; }
        }
        @keyframes fadeOutRight {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(50px) scale(0.5); opacity: 0; }
        }
        @keyframes slideInLeft {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-3 bg-gradient-to-r from-gray-800/80 to-gray-700/80 p-3 rounded-xl backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">
              Tur {turn}/{WIN_TURN}
            </span>
            <span className="text-gray-300 text-sm px-2 py-1 bg-black/30 rounded">
              K{maxT}
            </span>
            <span className="text-orange-400 text-xs px-2 py-1 bg-black/30 rounded">
              x{difficulty.toFixed(1)}
            </span>
            <button
              onClick={() => setGuide(true)}
              className="px-2 py-1 bg-blue-600/80 rounded text-sm hover:bg-blue-500 transition-all shadow-md"
            >
              📖
            </button>
          </div>
          <div className="flex gap-3 font-bold">
            <span className="text-yellow-300 drop-shadow">💰{gold}</span>
            <span className="text-red-300 drop-shadow">❤️{lives}</span>
            <span className="text-green-300 drop-shadow">✓{wins}</span>
          </div>
        </div>

        {tip ? (
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 rounded-xl p-3 mb-3 backdrop-blur-sm shadow-lg border border-gray-600">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl drop-shadow-lg">{tip.name}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{tip.nick}</span>
                  <span className="text-sm px-2 py-0.5 bg-black/40 rounded">
                    K{tip.tier}
                  </span>
                  <span className="text-yellow-300 text-sm">
                    {stars(tip.lvl || 1, tip.exp || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">{tip.atk}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-green-400 font-bold">
                    {tip.curHp || tip.hp}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-200 bg-black/20 p-2 rounded">
              {getDesc(tip)}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-700/70 rounded-xl p-3 mb-3 h-20 flex items-center justify-center backdrop-blur-sm shadow-inner border border-gray-700">
            <span className="text-gray-400 text-sm text-center">
              💡 Bilgi için hayvana tıkla
              <br />
              ❄️ Sağ tık = Dondur
            </span>
          </div>
        )}

        {phase === "shop" ? (
          <>
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 rounded-xl p-3 mb-3 backdrop-blur-sm shadow-lg border border-gray-600">
              <div className="text-sm text-gray-300 mb-2 font-bold">
                👥 Takım
                <span className="text-xs text-gray-400 ml-2">
                  (Sol=Ön, Sağ=Arka)
                </span>
                {sel && <span className="text-yellow-300"> - Slot seç</span>}
              </div>
              <div className="flex gap-3 justify-center">
                {team.map((a, i) => {
                  const isLocked =
                    (i === 5 && turn < 9) || (i === 6 && turn < 11);
                  const lockedTier = i === 5 ? 5 : 6;

                  if (isLocked) {
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="w-20 h-28 rounded-xl border-2 border-dashed border-gray-600 bg-gray-800/50 opacity-50 flex flex-col items-center justify-center">
                          <span className="text-3xl">🔒</span>
                          <span className="text-xs text-gray-500 mt-1">
                            Kademe {lockedTier}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return a ? (
                    <div
                      key={a.id}
                      onClick={() => {
                        setTip(a);
                        if (sel) buy(sel, i);
                        else if (selI !== null && selI !== i) {
                          if (!mergeT(selI, i)) swap(selI, i);
                        } else setSelI(selI === i ? null : i);
                      }}
                      className="flex flex-col items-center"
                    >
                      <Card
                        a={a}
                        anim={anims[a.id]}
                        selected={selI === i}
                        onSell={() => sell(i)}
                        onClick={() => {}}
                        showName={false}
                      />
                    </div>
                  ) : (
                    <div key={i} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          if (sel) buy(sel, i);
                          else if (selI !== null) swap(selI, i);
                        }}
                        className="w-20 h-28 rounded-xl border-2 border-dashed border-gray-500 text-gray-400 text-3xl hover:border-gray-400 hover:text-gray-300 transition-all bg-gray-800/30"
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-400 text-center mt-2 flex justify-between px-8">
                <span>← Ön</span>
                <span>Arka →</span>
              </div>
            </div>

            <button
              onClick={battle}
              disabled={team.filter((x) => x).length === 0}
              className="w-full py-3 bg-gradient-to-br from-green-600 to-green-800 disabled:opacity-40 rounded-xl font-bold text-xl hover:from-green-500 hover:to-green-700 transition-all shadow-lg border-2 border-green-400"
            >
              ⚔️ Savaş Başlat!
            </button>
          </>
        ) : (
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-700/90 rounded-xl p-3 backdrop-blur-sm shadow-lg border border-gray-600">
            {/* YATAY SAVAŞ DÜZENİ */}
            <div className="flex justify-center items-center mb-3 gap-1">
              {/* DÜŞMAN TAKIMI - SOL TARAF */}
              <div className="flex items-center gap-2">
                {[...eT].reverse().map((a, idx) => {
                  const frontIdx = eT.length - 1;
                  return (
                    <div
                      key={a.id}
                      className={`transition-all ${
                        idx === frontIdx
                          ? "scale-110 z-10"
                          : "scale-90 opacity-60"
                      }`}
                      style={{ transform: "scaleX(-1)" }}
                    >
                      <div className="flex flex-col items-center">
                        {idx === frontIdx && (
                          <div
                            className="text-xs text-red-300 mb-1 font-bold"
                            style={{ transform: "scaleX(-1)" }}
                          >
                            ⚔️ {a.nick}
                          </div>
                        )}
                        <Card
                          a={a}
                          anim={anims[a.id]}
                          compact={idx !== frontIdx}
                          selected={false}
                          onClick={() => {}}
                          showName={false}
                          mirror={true}
                        />
                        {idx === frontIdx && (
                          <div
                            className="text-xs text-gray-400 mt-1"
                            style={{ transform: "scaleX(-1)" }}
                          >
                            {a.atk}/{a.curHp}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ORTA - Savaş İkonu */}
              <div className="text-4xl px-2 drop-shadow-lg animate-pulse z-20">
                ⚔️
              </div>

              {/* OYUNCU TAKIMI - SAĞ TARAF */}
              <div className="flex items-center gap-2">
                {pT.map((a, idx) => (
                  <div
                    key={a.id}
                    className={`transition-all ${
                      idx === 0 ? "scale-110 z-10" : "scale-90 opacity-60"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {idx === 0 && (
                        <div className="text-xs text-green-300 mb-1 font-bold">
                          🛡️ {a.nick}
                        </div>
                      )}
                      <Card
                        a={a}
                        anim={anims[a.id]}
                        compact={idx !== 0}
                        selected={false}
                        onClick={() => {}}
                        showName={false}
                      />
                      {idx === 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          {a.atk}/{a.curHp}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              ref={logR}
              className="bg-gray-900/80 rounded-lg p-3 h-32 overflow-y-auto text-xs backdrop-blur-sm shadow-inner border border-gray-700"
            >
              {log.map((l, i) => (
                <div key={i} className="text-gray-200 py-0.5">
                  {l}
                </div>
              ))}
            </div>
            {pGold > 0 && (
              <div className="text-center text-yellow-300 text-sm mt-2 font-bold animate-pulse">
                +{pGold} 💰
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
