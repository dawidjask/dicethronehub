"use client";
import { useState, useCallback } from "react";

// ─── HERO DATA (tier list: styczeń 2026 — Grokipedia / ShadeSmithNet) ─────────
const HEROES = [
  {
    id:"shadow_thief", name:"Shadow Thief", img:"/heroes/shadow_thief.png", icon:"/heroes_icon/shadow_thief_icon.png",
    tier:"S", winRate:76, pickRate:88, banRate:92, set:"S1", weapon:"Zatruta Sztylet", style:"Kontrola / Trucizna", hp:70,
    desc:"Złodziej Cieni to #1 meta stycznia 2026 — efekt odrzucania kart i całkowite ignorowanie obrażeń przez Enter the Shadows czynią go niemal ban-worthy w turniejach. Dominuje większość matchupów w post-expansion meta.",
    counters:["Monk","Paladin","Treant"], counteredBy:["Rogue","Pyromancer","Barbarian"],
    tips:["Trucizna to twój silnik — każdy żeton zadaje obrażenia pasywnie, buduj ich jak najwięcej","Wejście w Cienie zachowuj na momenty gdy przeciwnik ma przygotowany duży atak","Odrzucanie kart to potężna kontrola — atakuj rękę rywala gdy masz okazję"]
  },
  {
    id:"cursed_pirate", name:"Cursed Pirate", img:"/heroes/cursed_pirate.png", icon:"/heroes_icon/cursed_pirate_icon.png",
    tier:"S", winRate:74, pickRate:82, banRate:85, set:"S2", weapon:"Szablę", style:"Ekonomia / Wytrzymałość", hp:70,
    desc:"Przeklęty Pirat awansował do S-tier w styczniu 2026 dzięki wyjątkowej obronie, ekonomii, dobieraniu kart i wartości żetonów Parley. Jeden z najbardziej kompletnych all-rounderów w obecnym meta.",
    counters:["Barbarian","Pyromancer","Samurai"], counteredBy:["Huntress","Rogue","Jean Grey"],
    tips:["Gromadź żetony Parley konsekwentnie — każdy to elastyczność w przyszłych turach","Beczka Prochu to finisher — trzymaj ją na moment gdy przeciwnik ma niskie HP","Dublony to twoja waluta — mądrze zarządzaj nimi między obroną a atakiem"]
  },
  {
    id:"jean_gray", name:"Jean Grey", img:"/heroes/jean_gray.png", icon:"/heroes_icon/jean_gray_icon.png",
    tier:"S", winRate:73, pickRate:70, banRate:78, set:"MARVEL", weapon:"Moc Feniksa", style:"Mitigacja / Phoenix Burn", hp:70,
    desc:"Jean Grey to jedna z pięciu postaci S-tier w styczniu 2026. Force Field blokuje połowę obrażeń, Acuity daje rerolle i CP, a Phoenix Burn zadaje stałe undefendable damage. Forma Dark Phoenix oferuje ogromny burst kosztem fazy dochodu.",
    counters:["Paladin","Treant","Artificer"], counteredBy:["Shadow Thief","Cursed Pirate","Rogue"],
    tips:["Acuity buduj konsekwentnie — rerolle, CP i Phoenix Burn to serce strategii","Force Field aktywuj przed przewidywanymi dużymi atakami","Dark Phoenix to finisher — przełącz się gdy masz Flame Blast gotowy do zamknięcia meczu"]
  },
  {
    id:"black_widow", name:"Black Widow", img:"/heroes/black_widow.png", icon:"/heroes_icon/black_widow_icon.png",
    tier:"A", winRate:65, pickRate:68, banRate:52, set:"MARVEL", weapon:"Ukąszenie i Chwyt", style:"Trucizna / Zwinność", hp:70,
    desc:"Czarna Wdowa awansowała do A-tier dzięki stałym obrażeniom z Time Bomb, silnej obronie przez uniki i unikalnej pasywce pozwalającej grać ulepszenia w dowolnym momencie.",
    counters:["Paladin","Treant","Barbarian"], counteredBy:["Shadow Thief","Monk","Jean Grey"],
    tips:["Time Bomb i trucizna to twój silnik — buduj presję od pierwszej tury","Chwyt stosuj gdy przeciwnik ma dużą pulę CP — kradnij mu turę decydującą","Uniki i ulepszenia w dowolnym momencie dają przewagę tempa — nie marnuj tej elastyczności"]
  },
  {
    id:"spider_man", name:"Spider-Man", img:"/heroes/spider_man.png", icon:"/heroes_icon/spider_man_icon.png",
    tier:"A", winRate:64, pickRate:65, banRate:48, set:"MARVEL", weapon:"Wyrzutnia Pajęczyny", style:"Zwinność / Pajęczyna", hp:70,
    desc:"Spider-Man (Miles Morales) w A-tier dzięki undefendable damage z web combo i dobrej grze przeciwko defensywnym postaciom. Wymaga trudniejszych rzutów by osiągnąć peak, ale w turniejach jest solidnym wyborem.",
    counters:["Paladin","Treant","Gunslinger"], counteredBy:["Shadow Thief","Black Widow","Jean Grey"],
    tips:["Pajęczyna buduj od tury 1 — każdy żeton ogranicza mobilność przeciwnika","Web combo to undefendable finisher — planuj pod niego całą grę","Zwinność to pasywna obrona — oszczędzaj CP na ataki zamiast aktywnych tarcz"]
  },
  {
    id:"pyromancer", name:"Pyromancer", img:"/heroes/pyromancer.png", icon:"/heroes_icon/pyromancer_icon.png",
    tier:"A", winRate:62, pickRate:60, banRate:55, set:"S1", weapon:"Ogień", style:"Agresja / Szklane Działo", hp:70,
    desc:"Piromantka spadła z wyższych pozycji przez wzrost liczby postaci z wysokim DPR w meta 2026, ale Burn tokeny i Pyro Blast nadal czynią ją silnym wyborem turniejowym z solidną obroną jak na glass cannon.",
    counters:["Moon Elf","Shadow Thief","Artificer"], counteredBy:["Monk","Cursed Pirate","Jean Grey"],
    tips:["Mistrzostwo Ognia buduj od pierwszej tury — to twój główny zasób","Żetony Płomień nakładaj masowo — zadają obrażenia bez rzucania kośćmi","Graj agresywnie — im dłużej trwa mecz, tym więcej nowe postacie mają przewagi"]
  },
  {
    id:"thor", name:"Thor", img:"/heroes/thor.png", icon:"/heroes_icon/thor_icon.png",
    tier:"A", winRate:63, pickRate:58, banRate:42, set:"MARVEL", weapon:"Mjolnir", style:"Burst / Błyskawice", hp:70,
    desc:"Thor awansował do A-tier jako niezawodny wybór bez wyraźnych matchup weaknesses — undefendable damage, leczenie i mitigacja tokenów przez łatwe roll objectives.",
    counters:["Moon Elf","Ninja","Gunslinger"], counteredBy:["Shadow Thief","Rogue","Jean Grey"],
    tips:["Ładuj energię błyskawic od pierwszej tury bez przerwy","Mjolnir to finisher po pełnym naładowaniu — nie używaj go przedwcześnie","Thor wygrywa jednym wielkim atakiem — nie rozpraszaj CP na małe ciosy"]
  },
  {
    id:"rogue", name:"Rogue", img:"/heroes/rogue.png", icon:"/heroes_icon/rogue_icon.png",
    tier:"A", winRate:64, pickRate:62, banRate:45, set:"MARVEL", weapon:"Energia Jonowa", style:"Kradzież / Kontratak", hp:70,
    desc:"Rogue to kluczowy counter na S-tier w styczniu 2026 — kradnie HP i działa skutecznie nawet bez kart czy CP, co czyni ją idealną przeciwko Shadow Thief i Cursed Pirate. Skyward tokeny dają mitigację i kontr-obrażenia.",
    counters:["Shadow Thief","Cursed Pirate","Vampire Lord"], counteredBy:["Jean Grey","Black Widow","Monk"],
    tips:["Ionic Energy zbieraj przy każdym trafieniu — każdy atak wzmacnia twój następny cios","Skyward tokeny zachowuj na przewidywane duże ataki","Graj agresywnie bez kart — Rogue nie potrzebuje pełnej ręki by wygrać"]
  },
  {
    id:"loki", name:"Loki", img:"/heroes/loki.png", icon:"/heroes_icon/loki_icon.png",
    tier:"A", winRate:61, pickRate:55, banRate:50, set:"MARVEL", weapon:"Podstęp", style:"Kontrola / Dezorganizacja", hp:70,
    desc:"Loki pozostaje w A-tier — kontrowersyjny placement, ale w rękach doświadczonych graczy oferuje silną prewencję obrażeń, manipulację CP/kart i Vilify spam do domykania gry.",
    counters:["Samurai","Pyromancer","Barbarian"], counteredBy:["Shadow Thief","Rogue","Jean Grey"],
    tips:["Zwodzenie stosuj zanim przeciwnik wykona kluczowy ruch","Dezorganizuj plan rywala zanim rozwinie strategię","Vilify spam to finisher gdy jesteś ahead — nie marnuj go wcześnie"]
  },
  {
    id:"gambit", name:"Gambit", img:"/heroes/gambit.png", icon:"/heroes_icon/gambit_icon.png",
    tier:"A", winRate:58, pickRate:52, banRate:38, set:"MARVEL", weapon:"Karty Asów", style:"Combo / Przyspieszenie", hp:70,
    desc:"Gambit zajmuje dolną część A-tier — disruption, leczenie i mixed damage types, ale skuteczność zależy od wykonania combo z Molecular Acceleration. Najbardziej złożona postać w boxie X-Men Box 2.",
    counters:["Artificer","Treant","Paladin"], counteredBy:["Shadow Thief","Black Widow","Jean Grey"],
    tips:["Accelerate Asy po kolorze — każdy naładowany As to potencjalny finisher","Po detonacji Asów odzyskuj je z talii — planuj pełny cykl combo","Molecular Acceleration wymaga cierpliwości — nie detonuj Asów przedwcześnie"]
  },
  {
    id:"paladin", name:"Paladin", img:"/heroes/paladin.png", icon:"/heroes_icon/paladin_icon.png",
    tier:"B", winRate:52, pickRate:42, banRate:22, set:"S1", weapon:"Miecz i Tarcza", style:"Obrona / Boska Ochrona", hp:70,
    desc:"Paladyn awansował do B-tier dzięki silnej generacji tokenów, ale wciąż ma trudne matchupy z Jean Grey i postaciami z Hex/control. Meta-relevantny, lecz nie dominujący.",
    counters:["Barbarian","Pyromancer","Samurai"], counteredBy:["Jean Grey","Shadow Thief","Cursed Pirate"],
    tips:["Żetony Ochrony to priorytet — buduj je konsekwentnie","Krytyczne trafienie zaskakuje graczy zakładających defensywny styl","Retribution to kontratak — graj cierpliwie, potem odwróć losy jednym cios"]
  },
  {
    id:"monk", name:"Monk", img:"/heroes/monk.png", icon:"/heroes_icon/monk_icon.png",
    tier:"B", winRate:54, pickRate:50, banRate:35, set:"S1", weapon:"Chi", style:"Obrona / Kontratak", hp:70,
    desc:"Mnich spadł z S-tier — w meta 2026 nadal daje ~50/50 vs większość pola dzięki Chi, oczyszczaniu, blokowi i evasion, ale nie dominuje jak nowe postacie X-Men i Outcasts.",
    counters:["Pyromancer","Shadow Thief","Scarlet Witch"], counteredBy:["Jean Grey","Rogue","Cursed Pirate"],
    tips:["Gromadź Chi przed pełnym atakiem — im więcej, tym silniejszy kontratak","Oczyszczenie natychmiast na truciznę, Hex i efekty statusu","Knockdown najskuteczniejszy gdy rywal ma mało CP"]
  },
  {
    id:"vampire_lord", name:"Vampire Lord", img:"/heroes/vampire_lord.png", icon:"/heroes_icon/vampire_lord_icon.png",
    tier:"B", winRate:51, pickRate:48, banRate:40, set:"S2", weapon:"Moc Krwi", style:"Wysysanie / Kontrola", hp:70,
    desc:"Władca Wampirów beneficjent recent buffów — average damage i poniżej average defense, ale leczenie krwią może przekroczyć 10 HP w jednej turze. Sukces zależy od efektywnego wykorzystania healingu.",
    counters:["Paladin","Monk","Treant"], counteredBy:["Rogue","Shadow Thief","Pyromancer"],
    tips:["Graj na długą partię — regeneracja odwraca losy gry","Hipnoza na decydujący atak przeciwnika, nie przypadkowo","Krwawienie kumuluj przed głównym atakiem"]
  },
  {
    id:"artificier", name:"Artificer", img:"/heroes/artificier.png", icon:"/heroes_icon/artificier_icon.png",
    tier:"B", winRate:50, pickRate:38, banRate:25, set:"S2", weapon:"Armia Robotów", style:"Synteza / Ustawienie", hp:70,
    desc:"Wynalazca awansował do B-tier — above-average stats poza obroną, ale w meta 2026 jest konsekwentnie outclassowany przez Spider-Mana, Black Widow i Jean Grey.",
    counters:["Barbarian","Samurai","Gunslinger"], counteredBy:["Spider-Man","Black Widow","Jean Grey"],
    tips:["Roboty w turach 1-2 bez wyjątku — opóźnienie kosztuje całą grę","Synteza przed pełnym atakiem — pośpiech niszczy combo","Robot Leczący to linia życia — nie poświęcaj go pochopnie"]
  },
  {
    id:"ninja", name:"Ninja", img:"/heroes/ninja.png", icon:"/heroes_icon/ninja_icon.png",
    tier:"B", winRate:53, pickRate:48, banRate:28, set:"S1", weapon:"Ninjato", style:"Tempo / Burst", hp:70,
    desc:"Ninja spadła z A-tier — slightly above-average damage, solidna mitigacja i dostęp do wysokiego undefendable damage czynią ją meta-relevant, lecz nie top-tier w 2026.",
    counters:["Treant","Paladin","Artificer"], counteredBy:["Shadow Thief","Jean Grey","Black Widow"],
    tips:["Ninjutsu buduj od tury 1 — każdy stos podnosi obrażenia","Dymna Bomba na ataki z wysokim krytem","Opóźniona Trucizna jako finisher gdy rywal nie ma Cleanse"]
  },
  {
    id:"treant", name:"Treant", img:"/heroes/treant.png", icon:"/heroes_icon/treant_icon.png",
    tier:"C", winRate:46, pickRate:35, banRate:18, set:"S1", weapon:"Gałęzie", style:"Wytrzymałość / Wzrost", hp:70,
    desc:"Drzewiec spadł do C-tier — minor healing i undefendable damage, ale brak wyróżniających cech w meta pełnym agresywnych postaci z wysokim DPR. Well-rounded, lecz nieexceptional.",
    counters:["Pyromancer","Samurai","Gunslinger"], counteredBy:["Cursed Pirate","Jean Grey","Shadow Thief"],
    tips:["Siewka w turze 1 — inwestycja na całą grę","Driada to gameplan, nie bonus","Kolczaste Pnącze jako pułapka na duże ataki fizyczne"]
  },
  {
    id:"black_panther", name:"Black Panther", img:"/heroes/black_panther.png", icon:"/heroes_icon/black_panther_icon.png",
    tier:"C", winRate:45, pickRate:40, banRate:20, set:"MARVEL", weapon:"Pazury z Vibranium", style:"Combo / Taktyka", hp:70,
    desc:"Czarna Pantera w C-tier — silna ekonomia w select matchups, ale broader inconsistencies utrudniają wyższy placement w turniejach 2026.",
    counters:["Ninja","Huntress","Gunslinger"], counteredBy:["Shadow Thief","Jean Grey","Rogue"],
    tips:["Kinetyczna Energia buduj każdą turę","Szał Pantery po pełnym naładowaniu w combo z innymi atakami","Nie przerywaj łańcucha combo — każda przerwa to utrata bonusu"]
  },
  {
    id:"cyclops", name:"Cyclops", img:"/heroes/cyclops.png", icon:"/heroes_icon/cyclops_icon.png",
    tier:"C", winRate:41, pickRate:38, banRate:15, set:"MARVEL", weapon:"Promień Optyczny", style:"Taktyka / Support", hp:70,
    desc:"Cyclops w C-tier — zależy od poprawnej sekwencji kart i dobrego drawu. Battle Plan, Support i Focus Fire dają utility, ale w 1v1 nie wykorzystuje pełnego potencjału leaderskich zdolności.",
    counters:["Artificer","Treant","Paladin"], counteredBy:["Shadow Thief","Rogue","Jean Grey"],
    tips:["Battle Plan manipuluje talią — szukaj kluczowych kart aktywnie","Focus Fire nakładaj przed głównym atakiem optycznym","Support tokeny maksymalizują damage gdy masz pełną sekwencję kart"]
  },
  {
    id:"doctor_strange", name:"Doctor Strange", img:"/heroes/doctor_strange.png", icon:"/heroes_icon/doctor_strange_icon.png",
    tier:"C", winRate:44, pickRate:38, banRate:22, set:"MARVEL", weapon:"Magia", style:"Kontrola / Zaklęcia", hp:70,
    desc:"Doktor Strange spadł do C-tier — wymaga precyzyjnych kombinacji zaklęć i trudnych roll objectives. Crimson Bands są potężne, ale brak dowodów na competitive success na poziomie B-tier.",
    counters:["Barbarian","Huntress","Gunslinger"], counteredBy:["Shadow Thief","Jean Grey","Rogue"],
    tips:["Planuj kilka tur do przodu — masz wiele opcji w każdej chwili","Sling Ring przed atakiem przeciwnika, nie po","Seraphim Shields na burst damage, nie na chip damage"]
  },
  {
    id:"huntress", name:"Huntress", img:"/heroes/huntress.png", icon:"/heroes_icon/huntress_icon.png",
    tier:"C", winRate:43, pickRate:35, banRate:18, set:"S2", weapon:"Nyra (Sabertooth)", style:"Podwójny / Agresja", hp:70,
    companion:{id:"nyra",name:"Nyra",img:"/heroes/nyra.png",hp:10,maxHp:10},
    desc:"Łowczyni to niche counterpick w C-tier — wykorzystuje słabości Cursed Pirate, ale przeciwko prevailing meta 2026 wypada słabo. Nyra daje dual-source damage, lecz utrata companiona drastycznie obniża potencjał.",
    counters:["Cursed Pirate","Vampire Lord","Artificer"], counteredBy:["Shadow Thief","Jean Grey","Black Widow"],
    tips:["Bond z Nyrą utrzymuj przez całą grę","Krwawienie kumuluj z atakami Nyry","Graj agresywnie w fazie środkowej — nie czekaj zbyt długo"]
  },
  {
    id:"scarlet_witch", name:"Scarlet Witch", img:"/heroes/scarlet_witch.png", icon:"/heroes_icon/scarlet_witch_icon.png",
    tier:"C", winRate:42, pickRate:34, banRate:20, set:"MARVEL", weapon:"Magia Chaosu", style:"Kontrola / RNG", hp:70,
    desc:"Czarodziejka Szkarłatna w mid-C-tier — exceptional control i high damage potential, ale często postrzegana jako budget Pyromancer z dodatkową kontrolą zamiast raw DPR.",
    counters:["Barbarian","Treant","Paladin"], counteredBy:["Shadow Thief","Jean Grey","Pyromancer"],
    tips:["Chaos to broń — czerp z losowości zamiast z nią walczyć","Hex dezorganizuje plan rywala budującego strategię","Chaos Wave jako finisher, nie jedyny plan"]
  },
  {
    id:"moon_elf", name:"Moon Elf", img:"/heroes/moon_elf.png", icon:"/heroes_icon/moon_elf_icon.png",
    tier:"D", winRate:35, pickRate:28, banRate:12, set:"S1", weapon:"Łuk i strzały", style:"Uniki / Kontrola", hp:70,
    desc:"Elfka Księżycowa spadła do D-tier — słaba ekonomia, niski DPR, brak card draw, trudne roll objectives i wysokie koszty CP czynią ją nieviable w serious tournaments 2026.",
    counters:["Samurai","Barbarian","Gunslinger"], counteredBy:["Shadow Thief","Cursed Pirate","Jean Grey"],
    tips:["Uniki to jedyna realna obrona — priorytetyzuj je","Oślepienie na duże pule CP przeciwnika","W turniejach 2026 wybieraj prawie zawsze inną postać"]
  },
  {
    id:"tactician", name:"Tactician", img:"/heroes/tactician.png", icon:"/heroes_icon/tactician_icon.png",
    tier:"D", winRate:36, pickRate:25, banRate:30, set:"S2", weapon:"Szabla", style:"Kontrola / Taktyka", hp:70,
    desc:"Taktyk w D-tier — mimo łatwego ultimate, below-average abilities i damage oraz brak consistency. W meta 2026 agresywni gracze nie dają czasu na setup.",
    counters:["Shadow Thief","Pyromancer","Samurai"], counteredBy:["Cursed Pirate","Jean Grey","Rogue"],
    tips:["Tactical Advantage buduj metodycznie — nie skracaj procesu","Immobilize na szykowany duży atak","W turniejach wybieraj tylko jako niche counterpick"]
  },
  {
    id:"captain_marvel", name:"Captain Marvel", img:"/heroes/captain_marvel.png", icon:"/heroes_icon/captain_marvel_icon.png",
    tier:"D", winRate:34, pickRate:30, banRate:15, set:"MARVEL", weapon:"Moc Binarna", style:"Burst / Energia", hp:70,
    desc:"Kapitan Marvel spadła do D-tier — objectively inferior do nowych postaci burst w meta 2026: brak ekonomii, słabe tokeny, obrona i card draw przy drogich kartach.",
    counters:["Barbarian","Treant","Gunslinger"], counteredBy:["Shadow Thief","Jean Grey","Rogue"],
    tips:["Binary Mode to cel pierwszej połowy gry","Photon Blast jako chip damage","W obecnym meta lepsze alternatywy to Thor, Rogue lub Jean Grey"]
  },
  {
    id:"samurai", name:"Samurai", img:"/heroes/samurai.png", icon:"/heroes_icon/samurai_icon.png",
    tier:"D", winRate:33, pickRate:28, banRate:20, set:"S2", weapon:"Katana", style:"Agresja / Honor", hp:70,
    desc:"Samuraj spadł z dawnego S-tier do D-tier w styczniu 2026 — przewidywalna jedna strategia, brak card draw i generacji CP, podatność na upgrade draw przeciwnika.",
    counters:["Moon Elf","Tactician","Gunslinger"], counteredBy:["Shadow Thief","Rogue","Jean Grey"],
    tips:["Shame nakładaj agresywnie od tury 1","Backstab to priorytet — niemożliwy do obrony","Nie marnuj CP na obronę — agresja to jedyna droga"]
  },
  {
    id:"gunslinger", name:"Gunslinger", img:"/heroes/gunslinger.png", icon:"/heroes_icon/gunslinger_icon.png",
    tier:"D", winRate:32, pickRate:25, banRate:10, set:"S2", weapon:"Para Pistoletów", style:"Przeładowanie / Zasięg", hp:70,
    desc:"Rewolwerowiec w D-tier — polega na wygrywaniu wielu rzutów i duelów bez card draw, co prowadzi do niewykorzystanych CP i bezużytecznych upgrade'ów w meta 2026.",
    counters:["Monk","Paladin","Artificer"], counteredBy:["Shadow Thief","Jean Grey","Black Widow"],
    tips:["Przeładuj w turze 1 zawsze","Bounty na najgroźniejszego przeciwnika","Unik tylko na krytyczne ataki — resztę przyjmuj"]
  },
  {
    id:"barbarian", name:"Barbarian", img:"/heroes/barbarian.png", icon:"/heroes_icon/barbarian_icon.png",
    tier:"D", winRate:31, pickRate:30, banRate:8, set:"S1", weapon:"Topór", style:"Agresja / Ogłuszenie", hp:70,
    desc:"Barbarzyńca w D-tier — wygrywa tylko jeśli wyrzuci ultimate lub karty to umożliwią. W meta 2026 z wysokim DPR i kontrolą reliable win condition jest zbyt rzadki.",
    counters:["Moon Elf","Artificer","Gunslinger"], counteredBy:["Shadow Thief","Cursed Pirate","Jean Grey"],
    tips:["Stun to absolutny priorytet","Atakuj agresywnie od rundy 1 — nie masz czasu na setup","Brain Trauma kumuluj przed decydującym atakiem"]
  },
];

// ─── DICE DATA ─────────────────────────────────────────────────────────────────
const DICE_FACES = [
  {id:"blank",label:"Puste",symbol:"○",color:"#4a4030"},
  {id:"1",label:"1",symbol:"1",color:"#6b5a3a"},
  {id:"2",label:"2",symbol:"2",color:"#8a7a5a"},
  {id:"3",label:"3",symbol:"3",color:"#c9a84c"},
  {id:"4",label:"4",symbol:"4",color:"#facc15"},
  {id:"sword",label:"Miecz",symbol:"⚔",color:"#f87171"},
  {id:"shield",label:"Tarcza",symbol:"🛡",color:"#60a5fa"},
  {id:"arrow",label:"Strzała",symbol:"↑",color:"#4ade80"},
];

const SETS: Record<string,{label:string,color:string,border:string}> = {
  S1:{label:"Season 1",color:"rgba(201,168,76,0.15)",border:"rgba(201,168,76,0.5)"},
  S2:{label:"Season 2",color:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.5)"},
  MARVEL:{label:"Marvel",color:"rgba(220,38,38,0.12)",border:"rgba(220,38,38,0.5)"},
};

const DRAFT_ORDER = [
  {team:1,type:"bring",phase:1},{team:2,type:"bring",phase:1},
  {team:1,type:"bring",phase:1},{team:2,type:"bring",phase:1},
  {team:1,type:"bring",phase:1},{team:2,type:"bring",phase:1},
  {team:1,type:"ban",phase:2},{team:2,type:"ban",phase:2},
  {team:1,type:"pick",phase:3},{team:2,type:"pick",phase:3},
];

const TIER_COLORS:Record<string,{bg:string,border:string,text:string}> = {
  S:{bg:"rgba(220,38,38,0.15)",border:"rgba(220,38,38,0.6)",text:"#fca5a5"},
  A:{bg:"rgba(234,179,8,0.12)",border:"rgba(234,179,8,0.5)",text:"#fde68a"},
  B:{bg:"rgba(59,130,246,0.12)",border:"rgba(59,130,246,0.5)",text:"#93c5fd"},
  C:{bg:"rgba(168,85,247,0.12)",border:"rgba(168,85,247,0.5)",text:"#d8b4fe"},
  D:{bg:"rgba(100,116,139,0.12)",border:"rgba(100,116,139,0.4)",text:"#94a3b8"},
};

const EMPTY_DRAFT={active:false,step:0,t1brings:[] as string[],t2brings:[] as string[],t1bans:[] as string[],t2bans:[] as string[],t1picks:[] as string[],t2picks:[] as string[],history:[] as any[]};

function getWinColor(wr:number){if(wr>=70)return"#4ade80";if(wr>=60)return"#facc15";if(wr>=50)return"#fb923c";return"#f87171";}

// ─── DICE RING ─────────────────────────────────────────────────────────────────
function DiceRing({value,maxValue=70,color="#c9a84c",size=90}:{value:number,maxValue:number,color:string,size:number}){
  const r=34,circ=2*Math.PI*r,pct=Math.max(0,value/maxValue),dash=pct*circ;
  return(
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6"/>
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ*0.25} strokeLinecap="round" style={{transition:"stroke-dasharray 0.4s ease"}}/>
      <text x="40" y="44" textAnchor="middle" fill={color} fontSize="16" fontWeight="900" fontFamily="'Cinzel',serif">{value}</text>
    </svg>
  );
}

function SmallDiceRing({value,maxValue,color,size=50}:{value:number,maxValue:number,color:string,size:number}){
  const r=22,circ=2*Math.PI*r,pct=Math.max(0,value/maxValue),dash=pct*circ;
  return(
    <svg width={size} height={size} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5"/>
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ*0.25} strokeLinecap="round" style={{transition:"stroke-dasharray 0.4s ease"}}/>
      <text x="26" y="30" textAnchor="middle" fill={color} fontSize="12" fontWeight="900" fontFamily="'Cinzel',serif">{value}</text>
    </svg>
  );
}

// ─── TOURNAMENT TYPES ──────────────────────────────────────────────────────────
type TPlayer={id:string,name:string,heroId?:string,seed:number};
type TMatch={id:string,p1?:string,p2?:string,winner?:string,score1:number,score2:number,round:number,slot:number};
type TTournament={id:string,name:string,format:"SE"|"RR",players:TPlayer[],matches:TMatch[],created:string};

function generateSEBracket(players:TPlayer[]):TMatch[]{
  const n=players.length,rounds=Math.ceil(Math.log2(n)),matches:TMatch[]=[];
  for(let i=0;i<Math.pow(2,rounds)/2;i++){
    matches.push({id:`r1m${i}`,p1:players[i*2]?.id,p2:players[i*2+1]?.id,score1:0,score2:0,round:1,slot:i});
  }
  for(let r=2;r<=rounds;r++){
    const prev=matches.filter(m=>m.round===r-1).length;
    for(let i=0;i<Math.ceil(prev/2);i++) matches.push({id:`r${r}m${i}`,score1:0,score2:0,round:r,slot:i});
  }
  return matches;
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────
export default function Home(){
  const [tab,setTab]=useState("heroes");
  const [selectedHero,setSelectedHero]=useState<any>(null);
  const [sortBy,setSortBy]=useState<"name"|"tier"|"winrate">("tier");
  const [filterTier,setFilterTier]=useState("all");
  const [filterSet,setFilterSet]=useState("all");
  const [draft,setDraft]=useState({...EMPTY_DRAFT});
  const [hoveredHero,setHoveredHero]=useState<string|null>(null);
  const [showBattle,setShowBattle]=useState(false);
  const [battles,setBattles]=useState<{t1hp:number,t2hp:number,t1max:number,t2max:number,t1id:string,t2id:string,nyra1hp:number,nyra2hp:number,log:string[]}>({t1hp:70,t2hp:70,t1max:70,t2max:70,t1id:"",t2id:"",nyra1hp:0,nyra2hp:0,log:[]});
  const [tournaments,setTournaments]=useState<TTournament[]>([]);
  const [activeTournament,setActiveTournament]=useState<string|null>(null);
  const [showNewTournament,setShowNewTournament]=useState(false);
  const [newTName,setNewTName]=useState("");
  const [newTFormat,setNewTFormat]=useState<"SE"|"RR">("SE");
  const [newTPlayers,setNewTPlayers]=useState<string[]>(["","","",""]);
  // Dice calculator
  const [diceCount,setDiceCount]=useState(6);
  const [keptDice,setKeptDice]=useState<number[]>([]);
  const [targetFace,setTargetFace]=useState("sword");
  const [rerolls,setRerolls]=useState(2);
  const [calcResult,setCalcResult]=useState<number|null>(null);
  const [editMatch,setEditMatch]=useState<string|null>(null);
  const [matchScore1,setMatchScore1]=useState(0);
  const [matchScore2,setMatchScore2]=useState(0);

  const getHero=(id:string)=>HEROES.find(x=>x.id===id) as any;
  const currentPhase=draft.active&&draft.step<DRAFT_ORDER.length?DRAFT_ORDER[draft.step]:null;
  const isDone=!draft.active&&draft.step>=DRAFT_ORDER.length;
  const allUsed=[...draft.t1brings,...draft.t2brings,...draft.t1bans,...draft.t2bans,...draft.t1picks,...draft.t2picks];

  const getClickable=()=>{
    if(!currentPhase)return[];
    if(currentPhase.type==="bring")return HEROES.filter(h=>!allUsed.includes(h.id)).map(h=>h.id);
    if(currentPhase.type==="ban")return(currentPhase.team===1?draft.t2brings:draft.t1brings);
    if(currentPhase.type==="pick")return(currentPhase.team===1?draft.t1brings:draft.t2brings);
    return[];
  };
  const clickable=getClickable();

  function draftSelect(heroId:string){
    if(!draft.active||draft.step>=DRAFT_ORDER.length||!clickable.includes(heroId))return;
    const phase=DRAFT_ORDER[draft.step];
    const nd={...draft,t1brings:[...draft.t1brings],t2brings:[...draft.t2brings],t1bans:[...draft.t1bans],t2bans:[...draft.t2bans],t1picks:[...draft.t1picks],t2picks:[...draft.t2picks],history:[...draft.history,{...phase,hero:heroId,step:draft.step}]};
    if(phase.type==="bring"){phase.team===1?nd.t1brings.push(heroId):nd.t2brings.push(heroId);}
    else if(phase.type==="ban"){
      if(phase.team===1){nd.t1bans.push(heroId);nd.t2brings=nd.t2brings.filter(x=>x!==heroId);}
      else{nd.t2bans.push(heroId);nd.t1brings=nd.t1brings.filter(x=>x!==heroId);}
    }else if(phase.type==="pick"){
      if(phase.team===1){nd.t1picks.push(heroId);nd.t1brings=nd.t1brings.filter(x=>x!==heroId);}
      else{nd.t2picks.push(heroId);nd.t2brings=nd.t2brings.filter(x=>x!==heroId);}
    }
    nd.step=draft.step+1;
    if(nd.step>=DRAFT_ORDER.length)nd.active=false;
    setDraft(nd);
  }

  function randomPick(){
    if(!clickable.length)return;
    const r=clickable[Math.floor(Math.random()*clickable.length)];
    draftSelect(r);
  }

  function undoDraft(){
    if(!draft.history.length)return;
    const last=draft.history[draft.history.length-1];
    const nd={...draft,t1brings:[...draft.t1brings],t2brings:[...draft.t2brings],t1bans:[...draft.t1bans],t2bans:[...draft.t2bans],t1picks:[...draft.t1picks],t2picks:[...draft.t2picks],history:draft.history.slice(0,-1),step:last.step,active:true};
    if(last.type==="bring"){last.team===1?nd.t1brings=nd.t1brings.filter(x=>x!==last.hero):nd.t2brings=nd.t2brings.filter(x=>x!==last.hero);}
    else if(last.type==="ban"){if(last.team===1){nd.t1bans=nd.t1bans.filter(x=>x!==last.hero);nd.t2brings.push(last.hero);}else{nd.t2bans=nd.t2bans.filter(x=>x!==last.hero);nd.t1brings.push(last.hero);}}
    else if(last.type==="pick"){if(last.team===1){nd.t1picks=nd.t1picks.filter(x=>x!==last.hero);nd.t1brings.push(last.hero);}else{nd.t2picks=nd.t2picks.filter(x=>x!==last.hero);nd.t2brings.push(last.hero);}}
    setDraft(nd);
  }

  function startBattle(t1id:string,t2id:string){
    const h1=getHero(t1id),h2=getHero(t2id);
    setBattles({t1hp:70,t2hp:70,t1max:70,t2max:70,t1id,t2id,nyra1hp:t1id==="huntress"?10:0,nyra2hp:t2id==="huntress"?10:0,log:["⚔ Bitwa rozpoczęta!"]});
    setShowBattle(true);
  }

  function adjustHP(side:"t1"|"t2",delta:number){
    setBattles(prev=>{
      const k=side==="t1"?"t1hp":"t2hp",mx=side==="t1"?prev.t1max:prev.t2max;
      const newHp=Math.max(0,Math.min(mx,prev[k]+delta));
      const h=getHero(side==="t1"?prev.t1id:prev.t2id);
      const entry=`${h?.name||side}: ${prev[k]} → ${newHp} HP`;
      const log=[entry,...prev.log].slice(0,20);
      if(newHp===0&&prev[k]>0){const w=getHero(side==="t1"?prev.t2id:prev.t1id);return{...prev,[k]:newHp,log:[`🏆 ${w?.name} wygrywa!`,...log]};}
      return{...prev,[k]:newHp,log};
    });
  }

  function adjustNyraHP(side:"nyra1"|"nyra2",delta:number){
    setBattles(prev=>{
      const k=side==="nyra1"?"nyra1hp":"nyra2hp";
      const newHp=Math.max(0,Math.min(10,prev[k]+delta));
      const log=[`Nyra: ${prev[k]} → ${newHp} HP`,...prev.log].slice(0,20);
      return{...prev,[k]:newHp,log};
    });
  }

  // Dice probability calculator
  function calculateProbability(){
    const freeDice=diceCount-keptDice.length;
    if(freeDice<0){setCalcResult(0);return;}
    // Probability of at least 1 success on N dice with R rerolls
    // Each die has 1/6 chance per face (simplified for 6-sided)
    const pSuccess=1/6;
    const pFail=1-pSuccess;
    // P(0 successes in all rolls) = (pFail)^(freeDice * (rerolls+1)) -- simplified
    const pAllFail=Math.pow(pFail,freeDice*(rerolls+1));
    const pAtLeastOne=1-pAllFail;
    setCalcResult(Math.round(pAtLeastOne*1000)/10);
  }

  function createTournament(){
    if(!newTName.trim())return;
    const players:TPlayer[]=newTPlayers.filter(p=>p.trim()).map((name,i)=>({id:`p${i}`,name:name.trim(),seed:i+1}));
    if(players.length<2)return;
    const t:TTournament={id:Date.now().toString(),name:newTName,format:newTFormat,players,matches:generateSEBracket(players),created:new Date().toLocaleDateString("pl-PL")};
    setTournaments(prev=>[...prev,t]);
    setActiveTournament(t.id);
    setShowNewTournament(false);setNewTName("");setNewTPlayers(["","","",""]);
    setTab("tournament");
  }

  function setMatchWinner(tId:string,matchId:string,winnerId:string,s1:number,s2:number){
    setTournaments(prev=>prev.map(t=>{
      if(t.id!==tId)return t;
      const updated=t.matches.map(m=>m.id===matchId?{...m,winner:winnerId,score1:s1,score2:s2}:m);
      const match=t.matches.find(m=>m.id===matchId);
      if(match){
        const nextMatch=updated.find(m=>m.round===match.round+1&&m.slot===Math.floor(match.slot/2));
        if(nextMatch){match.slot%2===0?(nextMatch.p1=winnerId):(nextMatch.p2=winnerId);}
      }
      return{...t,matches:updated};
    }));
    setEditMatch(null);
  }

  const displayHeroes=HEROES.filter(h=>filterTier==="all"||h.tier===filterTier).filter(h=>filterSet==="all"||h.set===filterSet).sort((a,b)=>{
    if(sortBy==="name")return a.name.localeCompare(b.name);
    if(sortBy==="winrate")return b.winRate-a.winRate;
    if(sortBy==="tier"){const o={S:0,A:1,B:2,C:3,D:4} as any;return o[a.tier]-o[b.tier];}
    return 0;
  });

  const activeTournamentData=tournaments.find(t=>t.id===activeTournament);
  const phaseLabel=()=>{if(!currentPhase)return"";if(currentPhase.type==="bring")return"FAZA 1 — WYBÓR POSTACI";if(currentPhase.type==="ban")return"FAZA 2 — BAN POSTACI PRZECIWNIKA";return"FAZA 3 — FINALNY WYBÓR";};

  const TeamPanel=({team}:{team:1|2})=>{
    const brings=team===1?draft.t1brings:draft.t2brings;
    const bans=team===1?draft.t1bans:draft.t2bans;
    const picks=team===1?draft.t1picks:draft.t2picks;
    const color=team===1?"#f87171":"#60a5fa";
    const bg=team===1?"linear-gradient(135deg,rgba(220,38,38,0.06) 0%,rgba(0,0,0,0.4) 100%)":"linear-gradient(225deg,rgba(37,99,235,0.06) 0%,rgba(0,0,0,0.4) 100%)";
    const side=team===1?"borderRight":"borderLeft";
    return(
      <div style={{background:bg,[side]:`1px solid ${team===1?"rgba(220,38,38,0.15)":"rgba(37,99,235,0.15)"}`,display:"flex",flexDirection:"column",padding:"14px 12px",gap:10,overflow:"hidden"}}>
        <div style={{textAlign:"center",fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:900,color,letterSpacing:"0.15em"}}>{team===1?"⚔ DRUŻYNA 1":"🛡 DRUŻYNA 2"}</div>
        <div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.2em",color:"#3a2010",textTransform:"uppercase",marginBottom:5,textAlign:"center"}}>Zban przez D{team}</div>
          <div style={{display:"flex",justifyContent:"center"}}>
            {[0].map(i=>{const id=bans[i];const h=id?getHero(id):null;const isA=currentPhase?.team===team&&currentPhase?.type==="ban"&&bans.length===i;
            return<div key={i} style={{width:52,height:52,background:h?"rgba(248,113,113,0.08)":"rgba(248,113,113,0.03)",border:`1px solid ${isA?"rgba(248,113,113,0.9)":h?"rgba(248,113,113,0.5)":"rgba(248,113,113,0.1)"}`,borderRadius:3,overflow:"hidden",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",animation:isA?"banPulse 1.5s ease-in-out infinite":"none"}}>
              {h?<><img src={h.icon||h.img} alt={h.name} style={{width:"100%",height:"100%",objectFit:"cover",filter:"grayscale(80%) brightness(0.4)"}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"rgba(248,113,113,0.9)"}}>✕</div></>:<span style={{fontSize:18,color:"rgba(248,113,113,0.15)"}}>⛔</span>}
            </div>;})}
          </div>
        </div>
        <div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.2em",color:"#3a2010",textTransform:"uppercase",marginBottom:5,textAlign:"center"}}>Pula postaci</div>
          {[0,1,2].map(i=>{const id=brings[i];const h=id?getHero(id):null;const isBanned=(team===1?draft.t2bans:draft.t1bans).includes(id||"");const isFP=picks[0]===id;const isA=currentPhase?.team===team&&currentPhase?.type==="bring"&&brings.length===i;
          return<div key={i} style={{display:"flex",alignItems:"center",gap:7,background:isFP?"rgba(201,168,76,0.1)":isBanned?"rgba(248,113,113,0.04)":isA?"rgba(201,168,76,0.05)":h?"rgba(255,255,255,0.02)":"rgba(0,0,0,0.2)",border:`1px solid ${isFP?"rgba(201,168,76,0.6)":isBanned?"rgba(248,113,113,0.25)":isA?"rgba(201,168,76,0.7)":h?`${color}44`:"rgba(255,255,255,0.04)"}`,borderRadius:3,padding:"5px 7px",minHeight:50,marginBottom:5,transition:"all 0.3s",position:"relative",overflow:"hidden",opacity:isBanned&&!isFP?0.45:1,animation:isA?"pulseGlow 1.5s ease-in-out infinite":"none"}}>
            {h?<><img src={h.icon||h.img} alt={h.name} style={{width:36,height:36,objectFit:"cover",objectPosition:"top",borderRadius:2,flexShrink:0,filter:isBanned&&!isFP?"grayscale(100%)":""}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/><div style={{overflow:"hidden"}}><div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:isFP?"#c9a84c":isBanned?"#f87171":"#e8dcc8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</div><div style={{fontSize:8,color:isFP?"#c9a84c":isBanned?"#f87171":"#6b5a3a"}}>{isFP?"★ WYBRANA":isBanned?"ZBANOWANA":h.winRate+"% WR"}</div></div>{isBanned&&!isFP&&<div style={{position:"absolute",right:5,fontSize:12,color:"rgba(248,113,113,0.6)"}}>✕</div>}<div style={{position:"absolute",left:0,top:0,bottom:0,width:2,background:isFP?"rgba(201,168,76,0.8)":isBanned?"rgba(248,113,113,0.4)":`${color}88`}}/></>:<div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:isA?"rgba(201,168,76,0.5)":"#1a1510",paddingLeft:3}}>{isA?"WYBIERZ...":""}</div>}
          </div>;})}
        </div>
        <div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.2em",color:"#3a2010",textTransform:"uppercase",marginBottom:5,textAlign:"center"}}>Finalna postać</div>
          {(()=>{const id=picks[0];const h=id?getHero(id):null;const isA=currentPhase?.team===team&&currentPhase?.type==="pick"&&picks.length===0;
          return<div style={{display:"flex",alignItems:"center",gap:8,background:h?"rgba(201,168,76,0.08)":isA?"rgba(201,168,76,0.04)":"rgba(0,0,0,0.2)",border:`1px solid ${h?"rgba(201,168,76,0.5)":isA?"rgba(201,168,76,0.7)":"rgba(255,255,255,0.04)"}`,borderRadius:3,padding:"7px 9px",minHeight:58,transition:"all 0.3s",animation:isA?"pulseGlow 1.5s ease-in-out infinite":"none",position:"relative",overflow:"hidden"}}>
            {h?<><img src={h.img} alt={h.name} style={{width:40,height:54,objectFit:"cover",objectPosition:"top",borderRadius:2,flexShrink:0}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/><div><div style={{fontFamily:"'Cinzel',serif",fontSize:8,color:"#c9a84c",letterSpacing:"0.1em"}}>FINALNA POSTAĆ</div><div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#c9a84c",fontWeight:700}}>{h.name}</div><div style={{fontSize:9,color:getWinColor(h.winRate)}}>{h.winRate}% · {h.tier}-Tier</div></div><div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:"rgba(201,168,76,0.8)"}}/></>:<div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:isA?"rgba(201,168,76,0.5)":"#1a1510",paddingLeft:3}}>{isA?"WYBIERZ FINALNĄ...":"Czeka na wybór..."}</div>}
          </div>;})()}
        </div>
        {isDone&&picks[0]&&team===1&&(
          <button onClick={()=>{const t1=draft.t1picks[0],t2=draft.t2picks[0];if(t1&&t2)startBattle(t1,t2);}} style={{background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.3)",color:"#c9a84c",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.1em",padding:"8px",cursor:"pointer",textTransform:"uppercase",marginTop:4}}>⚔ Rozpocznij Bitwę</button>
        )}
      </div>
    );
  };

  return(
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Roboto:wght@300;400;500;700&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#07060a;color:#ddd5c8;font-family:Roboto,sans-serif;overflow-x:hidden;min-height:100vh;background-image:radial-gradient(ellipse 80% 40% at 50% -5%,rgba(201,168,76,0.06) 0%,transparent 70%)}
      ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:#07060a}::-webkit-scrollbar-thumb{background:#2a2010;border-radius:2px}
      @keyframes pulseGlow{0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.3)}50%{box-shadow:0 0 50px rgba(201,168,76,0.7)}}
      @keyframes banPulse{0%,100%{box-shadow:0 0 15px rgba(248,113,113,0.3)}50%{box-shadow:0 0 40px rgba(248,113,113,0.7)}}
      @keyframes heroSlideIn{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
      @keyframes heroSlideInR{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
      @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      .nav{position:sticky;top:0;z-index:50;background:rgba(7,6,10,0.95);border-bottom:1px solid rgba(201,168,76,0.2);backdrop-filter:blur(24px)}
      .nav-inner{max-width:1600px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 40px;height:64px}
      .nav-logo{display:flex;align-items:center;height:44px}
      .nav-logo img{height:100%;width:auto;object-fit:contain}
      .nav-tab{background:none;border:none;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#4a4030;padding:0 20px;height:64px;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.2s;position:relative}
      .nav-tab::after{content:'';position:absolute;bottom:-1px;left:50%;right:50%;height:2px;background:#c9a84c;transition:all 0.3s}
      .nav-tab:hover{color:#8a7a5a}.nav-tab:hover::after{left:20px;right:20px}
      .nav-tab.active{color:#c9a84c}.nav-tab.active::after{left:20px;right:20px}
      .main{max-width:1600px;margin:0 auto;padding:40px 40px 80px}
      .page-hero{text-align:center;padding:48px 0 40px;border-bottom:1px solid rgba(201,168,76,0.1);margin-bottom:40px}
      .page-eyebrow{font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:0.3em;text-transform:uppercase;color:#c9a84c;margin-bottom:12px;opacity:0.7}
      .page-title{font-family:'Cinzel',serif;font-size:clamp(32px,5vw,58px);font-weight:900;letter-spacing:0.02em;color:#e8dcc8;line-height:1.1;margin-bottom:12px}
      .page-title span{color:#c9a84c}
      .page-sub{font-size:15px;color:#6b5a3a;line-height:1.7;max-width:560px;margin:0 auto}
      .toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;align-items:center}
      .pill{background:transparent;border:1px solid rgba(201,168,76,0.15);font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#4a4030;padding:6px 16px;cursor:pointer;border-radius:100px;transition:all 0.2s}
      .pill:hover{border-color:rgba(201,168,76,0.4);color:#8a7a5a}
      .pill.active{background:rgba(201,168,76,0.1);border-color:rgba(201,168,76,0.5);color:#c9a84c}
      .pill.set-marvel.active{background:rgba(220,38,38,0.1);border-color:rgba(220,38,38,0.5);color:#fca5a5}
      .pill.set-s2.active{background:rgba(59,130,246,0.1);border-color:rgba(59,130,246,0.5);color:#93c5fd}
      .divider{width:1px;height:20px;background:rgba(255,255,255,0.06);margin:0 4px}
      .sort-label{font-family:'Cinzel',serif;font-size:9px;color:#3a2010;letter-spacing:0.1em;text-transform:uppercase}
      .heroes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
      .hero-card{position:relative;overflow:hidden;cursor:pointer;background:#0e0c10;border:1px solid rgba(255,255,255,0.05);border-radius:4px;transition:all 0.35s cubic-bezier(0.4,0,0.2,1)}
      .hero-card::before{content:'';position:absolute;inset:0;z-index:1;background:linear-gradient(to bottom,transparent 30%,rgba(7,6,10,0.6) 60%,rgba(7,6,10,0.97) 100%)}
      .hero-card:hover{border-color:rgba(201,168,76,0.4);transform:translateY(-5px) scale(1.01);box-shadow:0 20px 50px rgba(0,0,0,0.7),0 0 30px rgba(201,168,76,0.07)}
      .hero-img{width:100%;aspect-ratio:3/4;object-fit:cover;object-position:top center;display:block;transition:transform 0.5s}
      .hero-card:hover .hero-img{transform:scale(1.06)}
      .hero-tier{position:absolute;top:8px;right:8px;z-index:2;font-family:'Cinzel',serif;font-size:9px;font-weight:900;letter-spacing:0.1em;padding:2px 8px;border-radius:2px;border:1px solid}
      .hero-set{position:absolute;top:8px;left:8px;z-index:2;font-size:8px;padding:2px 6px;border-radius:2px;border:1px solid;font-family:'Cinzel',serif;letter-spacing:0.05em}
      .hero-info{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:16px 14px 14px}
      .hero-name{font-family:'Cinzel',serif;font-size:13px;font-weight:700;color:#e8dcc8;margin-bottom:8px;letter-spacing:0.03em}
      .wr-row{display:flex;justify-content:space-between;font-size:9px;color:#6b5a3a;margin-bottom:4px}
      .wr-track{height:2px;background:rgba(255,255,255,0.06);border-radius:1px;overflow:hidden;margin-bottom:8px}
      .hero-style{font-size:9px;color:#4a4030}
      .modal-bg{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,0.9);backdrop-filter:blur(8px);display:flex;align-items:flex-start;justify-content:center;padding:28px 16px;overflow-y:auto}
      .modal-box{background:#0e0c10;width:100%;max-width:820px;border:1px solid rgba(201,168,76,0.25);border-radius:4px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.9);animation:slideUp 0.3s ease both}
      .modal-top{display:grid;grid-template-columns:220px 1fr}
      .modal-img{width:100%;height:100%;object-fit:cover;object-position:top;display:block;min-height:300px}
      .modal-details{padding:28px;background:linear-gradient(135deg,rgba(201,168,76,0.03) 0%,transparent 50%);display:flex;flex-direction:column}
      .modal-tier-badge{align-self:flex-start;font-family:'Cinzel',serif;font-size:9px;font-weight:900;letter-spacing:0.15em;padding:3px 12px;border:1px solid;border-radius:2px;margin-bottom:12px}
      .modal-name{font-family:'Cinzel',serif;font-size:28px;font-weight:900;color:#c9a84c;margin-bottom:4px;line-height:1}
      .modal-weapon{font-size:12px;color:#4a4030;letter-spacing:0.08em;margin-bottom:20px}
      .modal-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px}
      .modal-stat{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.04);padding:12px 8px;text-align:center;border-radius:2px}
      .modal-stat-val{font-family:'Cinzel',serif;font-size:18px;font-weight:900;margin-bottom:3px}
      .modal-stat-label{font-size:8px;color:#4a4030;letter-spacing:0.15em;text-transform:uppercase}
      .modal-body{padding:20px 28px 0}
      .modal-section{font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#c9a84c;opacity:0.6;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(201,168,76,0.1)}
      .modal-desc{font-size:14px;color:#9a8a78;line-height:1.75;margin-bottom:20px}
      .matchups{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
      .mu-label{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px}
      .mu-item{font-size:12px;color:#9a8a78;padding:6px 10px;margin-bottom:3px;border-radius:2px;border-left:2px solid;background:rgba(0,0,0,0.2)}
      .tips{list-style:none;margin-bottom:8px}
      .tip{font-size:13px;color:#9a8a78;padding:6px 0 6px 16px;position:relative;border-bottom:1px solid rgba(255,255,255,0.03);line-height:1.6}
      .tip::before{content:'▸';position:absolute;left:0;color:#c9a84c;opacity:0.6}
      .modal-close{display:block;width:100%;padding:14px;background:none;border:none;border-top:1px solid rgba(255,255,255,0.04);font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.2em;color:#4a4030;cursor:pointer;text-transform:uppercase;transition:all 0.2s}
      .modal-close:hover{color:#c9a84c;background:rgba(201,168,76,0.03)}
      .draft-ctrl-btn{background:rgba(0,0,0,0.4);border:1px solid rgba(201,168,76,0.2);font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.12em;color:#6b5a3a;padding:7px 14px;cursor:pointer;transition:all 0.2s;text-transform:uppercase}
      .draft-ctrl-btn:hover{border-color:rgba(201,168,76,0.5);color:#c9a84c}
      .draft-ctrl-btn.start{border-color:rgba(74,222,128,0.4);color:#4ade80}
      .draft-ctrl-btn.reset{border-color:rgba(248,113,113,0.3);color:#f87171}
      .draft-ctrl-btn.random{border-color:rgba(168,85,247,0.4);color:#d8b4fe}
      .draft-start-btn{font-family:'Cinzel',serif;font-size:12px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.4);color:#c9a84c;padding:14px 44px;cursor:pointer;transition:all 0.3s}
      .draft-start-btn:hover{background:rgba(201,168,76,0.18)}
      .stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;margin-bottom:28px}
      .stat-card{background:#0e0c10;border:1px solid rgba(255,255,255,0.04);padding:24px;border-radius:4px}
      .stat-title{font-family:'Cinzel',serif;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#c9a84c;opacity:0.7;margin-bottom:18px}
      .stat-row{display:flex;align-items:center;gap:9px;margin-bottom:10px;cursor:pointer;transition:opacity 0.2s;padding:3px 0}
      .stat-row:hover{opacity:0.75}
      .stat-num{font-family:'Cinzel',serif;font-size:10px;color:#2a2010;width:16px;flex-shrink:0}
      .stat-img{width:26px;height:34px;object-fit:cover;object-position:top;border:1px solid rgba(255,255,255,0.05);flex-shrink:0;border-radius:1px}
      .stat-name{font-size:12px;color:#8a7a5a;flex:1}
      .stat-bar-bg{width:64px;height:3px;background:rgba(255,255,255,0.04);border-radius:2px;overflow:hidden;flex-shrink:0}
      .stat-bar-fill{height:100%;border-radius:2px}
      .stat-val{font-family:'Cinzel',serif;font-size:11px;font-weight:700;min-width:36px;text-align:right}
      .tier-chart{background:#0e0c10;border:1px solid rgba(255,255,255,0.04);padding:24px;border-radius:4px}
      .tier-row{display:flex;align-items:center;gap:16px;padding:12px 14px;margin-bottom:6px;background:rgba(0,0,0,0.2);border-radius:2px}
      .tier-letter{font-family:'Cinzel',serif;font-size:18px;font-weight:900;width:20px;flex-shrink:0}
      .tier-chips{display:flex;gap:7px;flex-wrap:wrap}
      .tier-chip{display:flex;align-items:center;gap:5px;padding:3px 9px 3px 3px;background:#0e0c10;border:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:all 0.2s;border-radius:2px}
      .tier-chip:hover{border-color:rgba(201,168,76,0.3)}
      .tier-chip img{width:18px;height:24px;object-fit:cover;object-position:top;border-radius:1px}
      .tier-chip span{font-size:10px;color:#8a7a5a;font-family:'Cinzel',serif}
      .t-card{background:#0e0c10;border:1px solid rgba(255,255,255,0.04);padding:28px;margin-bottom:16px;border-radius:4px}
      .t-title{font-family:'Cinzel',serif;font-size:18px;font-weight:900;color:#c9a84c;letter-spacing:0.05em;margin-bottom:8px}
      .challonge-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.3);color:#c9a84c;font-family:'Cinzel',serif;font-size:10px;letter-spacing:0.15em;padding:10px 24px;cursor:pointer;text-decoration:none;transition:all 0.25s;text-transform:uppercase;border-radius:2px}
      .challonge-btn:hover{background:rgba(201,168,76,0.12)}
      /* DICE CALC */
      .dice-face{width:52px;height:52px;border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;border:2px solid;font-family:'Cinzel',serif;font-weight:700;user-select:none}
      .dice-face:hover{transform:translateY(-2px)}
      .hp-btn{width:36px;height:36px;border-radius:3px;border:none;font-size:18px;cursor:pointer;font-weight:700;transition:all 0.15s;display:flex;align-items:center;justify-content:center;font-family:'Cinzel',serif}
      .hp-btn:active{transform:scale(0.92)}
      .hp-delta{font-family:'Cinzel',serif;font-size:8px;padding:3px 7px;cursor:pointer;border-radius:2px;border:1px solid;transition:all 0.15s}
      .hp-delta:disabled{opacity:0.3;cursor:not-allowed}
      @media(max-width:768px){
        .nav-inner{padding:0 16px}.nav-tab{padding:0 10px;font-size:8px}
        .main{padding:20px 16px 60px}.heroes-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
        .modal-top{grid-template-columns:1fr}.modal-img{max-height:260px}
        .modal-stats{grid-template-columns:repeat(2,1fr)}.matchups{grid-template-columns:1fr}
        .stats-grid{grid-template-columns:1fr}.tier-row{flex-wrap:wrap}
      }
    `}</style>

    {/* NAV */}
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-logo">
          <img src="/dice_throne_hub.png" alt="Dice Throne Hub" onError={e=>{const t=e.target as HTMLImageElement;t.style.display="none";const d=document.createElement("div");d.style.cssText="font-family:'Cinzel',serif;font-size:17px;font-weight:900;color:#c9a84c;letter-spacing:0.15em;";d.textContent="DICE THRONE HUB";t.parentNode?.appendChild(d);}}/>
        </div>
        <div style={{display:"flex"}}>
          {[["heroes","Bohaterowie"],["draft","Draft Mode"],["stats","Meta Stats"],["tournament","Turnieje"],["dice","Kalkulator Kości"]].map(([id,label])=>(
            <button key={id} className={`nav-tab${tab===id?" active":""}`} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>
      </div>
    </nav>

    {/* ══ HEROES ══ */}
    {tab==="heroes"&&(
      <div className="main">
        <div className="page-hero">
          <div className="page-eyebrow">Dice Throne · Sezon 2025</div>
          <h1 className="page-title">Wybierz swojego <span>Bohatera</span></h1>
          <p className="page-sub">Statystyki turniejowe, tier list, kontry i porady strategiczne dla każdego bohatera</p>
        </div>
        <div className="toolbar">
          <span className="sort-label">Zestaw:</span>
          {[["all","Wszyscy"],["S1","Season 1"],["S2","Season 2"],["MARVEL","Marvel"]].map(([f,l])=>(
            <button key={f} className={`pill set-${f.toLowerCase()}${filterSet===f?" active":""}`} onClick={()=>setFilterSet(f)}>{l}</button>
          ))}
          <div className="divider"/>
          <span className="sort-label">Tier:</span>
          {["all","S","A","B","C","D"].map(f=>(
            <button key={f} className={`pill${filterTier===f?" active":""}`} onClick={()=>setFilterTier(f)}>{f==="all"?"All":f}</button>
          ))}
          <div className="divider"/>
          <span className="sort-label">Sortuj:</span>
          {[["tier","Tier"],["name","A-Z"],["winrate","Win%"]].map(([s,l])=>(
            <button key={s} className={`pill${sortBy===s?" active":""}`} onClick={()=>setSortBy(s as any)}>{l}</button>
          ))}
          <span style={{marginLeft:"auto",fontFamily:"'Cinzel',serif",fontSize:9,color:"#3a2010",letterSpacing:"0.1em"}}>{displayHeroes.length} / {HEROES.length}</span>
        </div>
        <div className="heroes-grid">
          {displayHeroes.map(h=>{
            const si=SETS[h.set];
            return(
              <div key={h.id} className="hero-card" onClick={()=>setSelectedHero(h)}>
                <img src={h.img} alt={h.name} className="hero-img" onError={e=>{(e.target as HTMLImageElement).style.opacity="0.05"}}/>
                <div className="hero-tier" style={{background:TIER_COLORS[h.tier].bg,borderColor:TIER_COLORS[h.tier].border,color:TIER_COLORS[h.tier].text}}>{h.tier}</div>
                <div className="hero-set" style={{background:si.color,borderColor:si.border,color:si.border.replace("0.5","0.9")}}>{si.label}</div>
                <div className="hero-info">
                  <div className="hero-name">{h.name}</div>
                  <div className="wr-row"><span>WIN RATE</span><span style={{color:getWinColor(h.winRate),fontFamily:"'Cinzel',serif",fontWeight:700}}>{h.winRate}%</span></div>
                  <div className="wr-track"><div style={{height:"100%",width:`${h.winRate}%`,background:getWinColor(h.winRate),borderRadius:1}}/></div>
                  <div className="hero-style">{h.style}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* ══ DRAFT ══ */}
    {tab==="draft"&&(
      <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 64px)",background:"#07060a",overflow:"hidden"}}>
        <div style={{background:"rgba(0,0,0,0.85)",borderBottom:"1px solid rgba(201,168,76,0.15)",padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",backdropFilter:"blur(20px)",flexShrink:0}}>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button className="draft-ctrl-btn start" onClick={()=>setDraft({...EMPTY_DRAFT,active:true})}>▶ Start</button>
            <button className="draft-ctrl-btn" onClick={undoDraft}>↩</button>
            <button className="draft-ctrl-btn reset" onClick={()=>{setDraft({...EMPTY_DRAFT});setHoveredHero(null);}}>✕</button>
            <button className="draft-ctrl-btn random" onClick={randomPick} disabled={!draft.active||!clickable.length} style={{opacity:!draft.active||!clickable.length?0.3:1}}>🎲 Losuj</button>
          </div>
          <div style={{textAlign:"center",flex:1}}>
            {currentPhase?(<>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:900,letterSpacing:"0.08em",color:currentPhase.type==="ban"?"#f87171":currentPhase.type==="bring"?"#facc15":"#4ade80"}}>{phaseLabel()}</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#6b5a3a",marginTop:2}}>Drużyna {currentPhase.team} · Krok {draft.step+1}/{DRAFT_ORDER.length}</div>
            </>):isDone?(
              <div style={{fontFamily:"'Cinzel',serif",fontSize:16,fontWeight:900,color:"#c9a84c"}}>✓ DRAFT ZAKOŃCZONY</div>
            ):(
              <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#3a2010"}}>Naciśnij Start</div>
            )}
          </div>
          <div style={{minWidth:160,textAlign:"right",fontFamily:"'Cinzel',serif",fontSize:10,color:"#4a4030"}}>Bring 3 · Ban 1 · Pick 1</div>
        </div>
        <div style={{background:"rgba(0,0,0,0.4)",borderBottom:"1px solid rgba(255,255,255,0.03)",padding:"6px 24px",display:"flex",alignItems:"center",gap:3,flexShrink:0}}>
          {DRAFT_ORDER.map((phase,i)=>{
            const done=draft.step>i,active=draft.step===i&&draft.active;
            const c=phase.type==="ban"?"#f87171":phase.type==="bring"?"#facc15":"#4ade80";
            return<div key={i} style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:24,height:24,borderRadius:2,background:done?"rgba(201,168,76,0.12)":active?`${c}22`:"rgba(0,0,0,0.3)",border:`1px solid ${done?"rgba(201,168,76,0.35)":active?c:"rgba(255,255,255,0.05)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontFamily:"'Cinzel',serif",color:done?"#c9a84c":active?c:"#3a2010",fontWeight:700}}>
                {done?"✓":phase.team}
              </div>
              {i<DRAFT_ORDER.length-1&&<div style={{width:6,height:1,background:"rgba(255,255,255,0.04)"}}/>}
            </div>;
          })}
          <div style={{marginLeft:10,display:"flex",gap:10,fontSize:8,fontFamily:"'Cinzel',serif"}}>
            <span style={{color:"#facc15"}}>■ BRING</span><span style={{color:"#f87171"}}>■ BAN</span><span style={{color:"#4ade80"}}>■ PICK</span>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"260px 1fr 260px",flex:1,overflow:"hidden"}}>
          <TeamPanel team={1}/>
          <div style={{display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",background:"radial-gradient(ellipse 70% 50% at 50% 0%,rgba(201,168,76,0.03) 0%,transparent 60%)"}}>
            {hoveredHero&&(()=>{
              const h=getHero(hoveredHero);if(!h)return null;
              const isR=currentPhase?.team===2;
              return<div style={{position:"absolute",[isR?"right":"left"]:0,top:0,bottom:0,width:"44%",zIndex:10,pointerEvents:"none",animation:isR?"heroSlideInR 0.3s ease both":"heroSlideIn 0.3s ease both"}}>
                <img src={h.img} alt={h.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",display:"block",maskImage:isR?"linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0.6) 60%,transparent 100%)":"linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.6) 60%,transparent 100%)",WebkitMaskImage:isR?"linear-gradient(to left,rgba(0,0,0,1) 0%,rgba(0,0,0,0.6) 60%,transparent 100%)":"linear-gradient(to right,rgba(0,0,0,1) 0%,rgba(0,0,0,0.6) 60%,transparent 100%)"}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/>
                <div style={{position:"absolute",bottom:28,[isR?"right":"left"]:16,textAlign:isR?"right":"left"}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:24,fontWeight:900,color:"#e8dcc8",textShadow:"0 2px 20px rgba(0,0,0,1)",letterSpacing:"0.03em"}}>{h.name}</div>
                  <div style={{fontSize:11,color:"#6b5a3a",marginTop:3,textShadow:"0 1px 10px rgba(0,0,0,0.9)"}}>{h.style}</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:700,color:getWinColor(h.winRate),marginTop:5,textShadow:"0 1px 10px rgba(0,0,0,0.9)"}}>{h.winRate}% WIN RATE</div>
                  <div style={{display:"inline-block",marginTop:6,padding:"2px 10px",background:TIER_COLORS[h.tier].bg,border:`1px solid ${TIER_COLORS[h.tier].border}`,color:TIER_COLORS[h.tier].text,fontFamily:"'Cinzel',serif",fontSize:9}}>{h.tier}-TIER</div>
                </div>
              </div>;
            })()}
            <div style={{padding:"10px 16px 6px",textAlign:"center",flexShrink:0}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:8,fontWeight:700,letterSpacing:"0.25em",textTransform:"uppercase",color:currentPhase?.type==="ban"?"rgba(248,113,113,0.5)":currentPhase?.type==="pick"?"rgba(74,222,128,0.5)":currentPhase?.type==="bring"?"rgba(250,204,21,0.5)":"#2a2010"}}>
                {currentPhase?.type==="ban"?`Zbanuj postać z puli Drużyny ${currentPhase.team===1?2:1}`:currentPhase?.type==="pick"?`Wybierz finalną postać D${currentPhase.team}`:currentPhase?.type==="bring"?"Wybierz postać do swojej puli":"Pula bohaterów"}
              </div>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"4px 14px 14px"}}>
              {!draft.active&&!isDone?(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",textAlign:"center",gap:14}}>
                  <div style={{fontSize:48,opacity:0.15}}>⚔</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:20,fontWeight:900,color:"#3a2010"}}>BRING 3 · BAN 1 · PICK 1</div>
                  <div style={{fontSize:13,color:"#2a2010",lineHeight:1.8,maxWidth:340}}>Faza 1: Każdy wybiera 3 postacie<br/>Faza 2: Każdy banuje 1 postać przeciwnika<br/>Faza 3: Każdy wybiera 1 z pozostałych 2</div>
                  <button className="draft-start-btn" onClick={()=>setDraft({...EMPTY_DRAFT,active:true})}>▶ ROZPOCZNIJ DRAFT</button>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(68px,1fr))",gap:4}}>
                  {HEROES.map(h=>{
                    const isC=clickable.includes(h.id),isBrought=draft.t1brings.includes(h.id)||draft.t2brings.includes(h.id);
                    const isHov=hoveredHero===h.id,isBan=currentPhase?.type==="ban",isPick=currentPhase?.type==="pick";
                    const dimmed=draft.active&&!isC;
                    return<div key={h.id} style={{position:"relative",cursor:isC?"pointer":"default",overflow:"hidden",background:"#0e0c10",border:`1px solid ${isHov&&isC?(isBan?"rgba(248,113,113,0.8)":isPick?"rgba(74,222,128,0.8)":"rgba(250,204,21,0.8)"):"rgba(255,255,255,0.04)"}`,borderRadius:2,transition:"all 0.18s",opacity:dimmed?0.18:1,filter:dimmed?"grayscale(80%)":"none",transform:isHov&&isC?"translateY(-3px) scale(1.06)":"none"}}
                      onClick={()=>isC&&draftSelect(h.id)} onMouseEnter={()=>isC&&setHoveredHero(h.id)} onMouseLeave={()=>setHoveredHero(null)}>
                      <img src={h.icon||h.img} alt={h.name} style={{width:"100%",aspectRatio:"1",objectFit:"cover",objectPosition:"top",display:"block"}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0.05"}}/>
                      <div style={{position:"absolute",top:2,right:2,fontFamily:"'Cinzel',serif",fontSize:7,fontWeight:900,padding:"1px 3px",borderRadius:1,background:TIER_COLORS[h.tier].bg,border:`1px solid ${TIER_COLORS[h.tier].border}`,color:TIER_COLORS[h.tier].text}}>{h.tier}</div>
                      {isBrought&&<div style={{position:"absolute",top:2,left:2,width:5,height:5,borderRadius:"50%",background:draft.t1brings.includes(h.id)?"#f87171":"#60a5fa"}}/>}
                      <div style={{padding:"3px 4px",fontFamily:"'Cinzel',serif",fontSize:7,color:"#6b5a3a",textAlign:"center",background:"rgba(0,0,0,0.7)",borderTop:"1px solid rgba(255,255,255,0.03)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</div>
                    </div>;
                  })}
                </div>
              )}
            </div>
          </div>
          <TeamPanel team={2}/>
        </div>
      </div>
    )}

    {/* ══ STATS ══ */}
    {tab==="stats"&&(
      <div className="main">
        <div className="page-hero">
          <div className="page-eyebrow">Dane Turniejowe 2025</div>
          <h1 className="page-title">Meta <span>Statistics</span></h1>
          <p className="page-sub">Zebrane z turniejów Lipiec 2025, Sierpień 2025 i Mistrzostw Polski 2025</p>
        </div>
        <div className="stats-grid">
          {[
            {title:"TOP WIN RATE",list:[...HEROES].sort((a,b)=>b.winRate-a.winRate).slice(0,8),val:(h:any)=>h.winRate+"%",color:(h:any)=>getWinColor(h.winRate)},
            {title:"Najczęściej banowani",list:[...HEROES].sort((a,b)=>b.banRate-a.banRate).slice(0,8),val:(h:any)=>h.banRate+"%",color:()=>"#f87171"},
            {title:"Najczęściej wybierani",list:[...HEROES].sort((a,b)=>b.pickRate-a.pickRate).slice(0,8),val:(h:any)=>h.pickRate+"%",color:()=>"#60a5fa"},
            {title:"Najniższy Win Rate",list:[...HEROES].sort((a,b)=>a.winRate-b.winRate).slice(0,8),val:(h:any)=>h.winRate+"%",color:(h:any)=>getWinColor(h.winRate)},
          ].map(card=>(
            <div key={card.title} className="stat-card">
              <div className="stat-title">{card.title}</div>
              {card.list.map((h,i)=>(
                <div key={h.id} className="stat-row" onClick={()=>{setSelectedHero(h);setTab("heroes")}}>
                  <span className="stat-num">{i+1}</span>
                  <img src={h.img} alt={h.name} className="stat-img" onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/>
                  <span className="stat-name">{h.name}</span>
                  <div className="stat-bar-bg"><div className="stat-bar-fill" style={{width:card.val(h),background:card.color(h)}}/></div>
                  <span className="stat-val" style={{color:card.color(h)}}>{card.val(h)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="tier-chart">
          <div style={{fontFamily:"'Cinzel',serif",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c9a84c",opacity:0.7,marginBottom:18}}>Tier List — Ranking Kompetytywny Styczeń 2026</div>
          {["S","A","B","C","D"].map(tier=>(
            <div key={tier} className="tier-row" style={{borderLeft:`2px solid ${TIER_COLORS[tier].border}`}}>
              <span className="tier-letter" style={{color:TIER_COLORS[tier].text}}>{tier}</span>
              <div className="tier-chips">
                {HEROES.filter(h=>h.tier===tier).map(h=>(
                  <div key={h.id} className="tier-chip" onClick={()=>{setSelectedHero(h);setTab("heroes")}}>
                    <img src={h.img} alt={h.name} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/>
                    <span>{h.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ══ TOURNAMENT ══ */}
    {tab==="tournament"&&(
      <div className="main">
        <div className="page-hero">
          <div className="page-eyebrow">Organized Play</div>
          <h1 className="page-title">Turnieje <span>& Bracket</span></h1>
          <p className="page-sub">Twórz turnieje, zarządzaj bracketem i śledź wyniki</p>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
          <button onClick={()=>setShowNewTournament(true)} style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ade80",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.15em",padding:"10px 24px",cursor:"pointer",borderRadius:2,textTransform:"uppercase"}}>+ Nowy Turniej</button>
          {tournaments.map(t=>(
            <button key={t.id} onClick={()=>setActiveTournament(t.id)} style={{background:activeTournament===t.id?"rgba(201,168,76,0.1)":"rgba(0,0,0,0.3)",border:`1px solid ${activeTournament===t.id?"rgba(201,168,76,0.5)":"rgba(255,255,255,0.06)"}`,color:activeTournament===t.id?"#c9a84c":"#6b5a3a",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.1em",padding:"10px 20px",cursor:"pointer",borderRadius:2}}>
              {t.name}
            </button>
          ))}
        </div>
        {showNewTournament&&(
          <div className="t-card" style={{marginBottom:20,animation:"slideUp 0.3s ease both"}}>
            <div className="t-title">Nowy Turniej</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#4a4030",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Nazwa</div>
                <input value={newTName} onChange={e=>setNewTName(e.target.value)} placeholder="np. Mistrzostwa Polski 2025" style={{width:"100%",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.08)",color:"#e8dcc8",padding:"10px 14px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:12,outline:"none"}}/>
              </div>
              <div>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#4a4030",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8}}>Format</div>
                <div style={{display:"flex",gap:8}}>
                  {[["SE","Single Elim."],["RR","Round Robin"]].map(([f,l])=>(
                    <button key={f} onClick={()=>setNewTFormat(f as any)} style={{flex:1,background:newTFormat===f?"rgba(201,168,76,0.1)":"rgba(0,0,0,0.3)",border:`1px solid ${newTFormat===f?"rgba(201,168,76,0.4)":"rgba(255,255,255,0.06)"}`,color:newTFormat===f?"#c9a84c":"#6b5a3a",fontFamily:"'Cinzel',serif",fontSize:10,padding:"10px",cursor:"pointer",borderRadius:2}}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#4a4030",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10}}>Gracze</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
                {newTPlayers.map((p,i)=>(
                  <input key={i} value={p} onChange={e=>{const n=[...newTPlayers];n[i]=e.target.value;setNewTPlayers(n);}} placeholder={`Gracz ${i+1}`} style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.06)",color:"#e8dcc8",padding:"9px 12px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:11,outline:"none"}}/>
                ))}
                <button onClick={()=>setNewTPlayers([...newTPlayers,""])} style={{background:"rgba(255,255,255,0.02)",border:"1px dashed rgba(255,255,255,0.08)",color:"#3a2010",fontFamily:"'Cinzel',serif",fontSize:10,padding:"9px",cursor:"pointer",borderRadius:2}}>+ Dodaj gracza</button>
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={createTournament} style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ade80",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.15em",padding:"10px 28px",cursor:"pointer",borderRadius:2,textTransform:"uppercase"}}>Utwórz</button>
              <button onClick={()=>setShowNewTournament(false)} style={{background:"none",border:"1px solid rgba(255,255,255,0.06)",color:"#4a4030",fontFamily:"'Cinzel',serif",fontSize:10,padding:"10px 20px",cursor:"pointer",borderRadius:2}}>Anuluj</button>
            </div>
          </div>
        )}
        {activeTournamentData?(
          <div className="t-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
              <div>
                <div className="t-title">{activeTournamentData.name}</div>
                <div style={{fontSize:13,color:"#4a4030"}}>{activeTournamentData.format==="SE"?"Single Elimination":"Round Robin"} · {activeTournamentData.players.length} graczy · {activeTournamentData.created}</div>
              </div>
            </div>
            {/* BRACKET */}
            <div style={{overflowX:"auto",paddingBottom:16}}>
              <div style={{display:"flex",gap:28,alignItems:"flex-start",minWidth:"max-content"}}>
                {[...new Set(activeTournamentData.matches.map(m=>m.round))].sort().map(round=>(
                  <div key={round} style={{display:"flex",flexDirection:"column",gap:14}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#c9a84c",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6,textAlign:"center"}}>
                      {round===[...new Set(activeTournamentData.matches.map(m=>m.round))].sort().length?"FINAŁ":round===[...new Set(activeTournamentData.matches.map(m=>m.round))].sort().length-1?"PÓŁFINAŁ":`Runda ${round}`}
                    </div>
                    {activeTournamentData.matches.filter(m=>m.round===round).map(match=>{
                      const p1=activeTournamentData.players.find(p=>p.id===match.p1);
                      const p2=activeTournamentData.players.find(p=>p.id===match.p2);
                      const isEditing=editMatch===match.id;
                      return(
                        <div key={match.id} style={{background:"#0e0c10",border:`1px solid ${match.winner?"rgba(201,168,76,0.4)":"rgba(255,255,255,0.06)"}`,borderRadius:4,overflow:"hidden",width:200}}>
                          {[{player:p1,score:match.score1,isW:match.winner===p1?.id},{player:p2,score:match.score2,isW:match.winner===p2?.id}].map((side,si)=>(
                            <div key={si} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:side.isW?"rgba(201,168,76,0.08)":"transparent",borderBottom:si===0?"1px solid rgba(255,255,255,0.04)":"none"}}>
                              <div style={{flex:1,overflow:"hidden"}}>
                                <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:side.isW?"#c9a84c":side.player?"#e8dcc8":"#3a2010",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{side.player?.name||"TBD"}</div>
                              </div>
                              <div style={{fontFamily:"'Cinzel',serif",fontSize:14,fontWeight:900,color:side.isW?"#c9a84c":"#4a4030"}}>{match.winner?side.score:"-"}</div>
                              {side.isW&&<span style={{fontSize:12}}>🏆</span>}
                            </div>
                          ))}
                          {!match.winner&&p1&&p2&&(
                            <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",padding:"6px 10px",display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"}}>
                              {isEditing?(
                                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                                  <input type="number" value={matchScore1} onChange={e=>setMatchScore1(+e.target.value)} style={{width:34,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"2px 4px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:11,textAlign:"center",outline:"none"}}/>
                                  <span style={{color:"#4a4030",fontSize:10}}>:</span>
                                  <input type="number" value={matchScore2} onChange={e=>setMatchScore2(+e.target.value)} style={{width:34,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",color:"#fff",padding:"2px 4px",borderRadius:2,fontFamily:"'Cinzel',serif",fontSize:11,textAlign:"center",outline:"none"}}/>
                                  <button onClick={()=>setMatchWinner(activeTournamentData.id,match.id,matchScore1>matchScore2?p1.id:p2.id,matchScore1,matchScore2)} style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ade80",fontFamily:"'Cinzel',serif",fontSize:9,padding:"2px 8px",cursor:"pointer",borderRadius:2}}>OK</button>
                                  <button onClick={()=>setEditMatch(null)} style={{background:"none",border:"1px solid rgba(255,255,255,0.06)",color:"#4a4030",fontFamily:"'Cinzel',serif",fontSize:9,padding:"2px 6px",cursor:"pointer",borderRadius:2}}>✕</button>
                                </div>
                              ):(
                                <div style={{display:"flex",gap:4}}>
                                  <button onClick={()=>{setEditMatch(match.id);setMatchScore1(0);setMatchScore2(0);}} style={{background:"rgba(201,168,76,0.06)",border:"1px solid rgba(201,168,76,0.2)",color:"#c9a84c",fontFamily:"'Cinzel',serif",fontSize:9,padding:"3px 10px",cursor:"pointer",borderRadius:2}}>Wynik</button>
                                  <button onClick={()=>{setDraft({...EMPTY_DRAFT,active:true});setTab("draft");}} style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.2)",color:"#4ade80",fontFamily:"'Cinzel',serif",fontSize:9,padding:"3px 10px",cursor:"pointer",borderRadius:2}}>Draft</button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ):(
          <div className="t-card">
            <div style={{textAlign:"center",padding:"40px"}}>
              <div style={{fontSize:40,opacity:0.2,marginBottom:16}}>🏆</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:"#3a2010",marginBottom:8}}>Brak aktywnego turnieju</div>
              <div style={{fontSize:13,color:"#2a2010"}}>Kliknij "+ Nowy Turniej" aby stworzyć bracket</div>
            </div>
          </div>
        )}
      </div>
    )}

    {/* ══ DICE CALCULATOR ══ */}
    {tab==="dice"&&(
      <div className="main">
        <div className="page-hero">
          <div className="page-eyebrow">Narzędzie Strategiczne</div>
          <h1 className="page-title">Kalkulator <span>Kości</span></h1>
          <p className="page-sub">Oblicz prawdopodobieństwo uzyskania pożądanego wyniku przy danej liczbie rerollów</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:900,margin:"0 auto"}}>
          {/* LEFT — SETTINGS */}
          <div style={{background:"#0e0c10",border:"1px solid rgba(255,255,255,0.04)",borderRadius:4,padding:28}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c9a84c",opacity:0.7,marginBottom:20}}>Ustawienia rzutu</div>

            {/* Dice count */}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#8a7a5a",marginBottom:12,letterSpacing:"0.05em"}}>Liczba kości: <span style={{color:"#c9a84c",fontWeight:700}}>{diceCount}</span></div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[3,4,5,6,7,8].map(n=>(
                  <button key={n} onClick={()=>setDiceCount(n)} style={{width:40,height:40,background:diceCount===n?"rgba(201,168,76,0.15)":"rgba(0,0,0,0.3)",border:`1px solid ${diceCount===n?"rgba(201,168,76,0.5)":"rgba(255,255,255,0.06)"}`,color:diceCount===n?"#c9a84c":"#6b5a3a",fontFamily:"'Cinzel',serif",fontSize:14,fontWeight:700,cursor:"pointer",borderRadius:3}}>{n}</button>
                ))}
              </div>
            </div>

            {/* Rerolls */}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#8a7a5a",marginBottom:12,letterSpacing:"0.05em"}}>Liczba rerollów: <span style={{color:"#c9a84c",fontWeight:700}}>{rerolls}</span></div>
              <div style={{display:"flex",gap:8}}>
                {[0,1,2,3].map(n=>(
                  <button key={n} onClick={()=>setRerolls(n)} style={{width:40,height:40,background:rerolls===n?"rgba(201,168,76,0.15)":"rgba(0,0,0,0.3)",border:`1px solid ${rerolls===n?"rgba(201,168,76,0.5)":"rgba(255,255,255,0.06)"}`,color:rerolls===n?"#c9a84c":"#6b5a3a",fontFamily:"'Cinzel',serif",fontSize:14,fontWeight:700,cursor:"pointer",borderRadius:3}}>{n}</button>
                ))}
              </div>
            </div>

            {/* Target face */}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#8a7a5a",marginBottom:12,letterSpacing:"0.05em"}}>Cel (co chcesz uzyskać):</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[
                  {id:"1",label:"1",sym:"⚀",c:"#9a8a78"},
                  {id:"2",label:"2",sym:"⚁",c:"#9a8a78"},
                  {id:"3",label:"3",sym:"⚂",c:"#c9a84c"},
                  {id:"4",label:"4",sym:"⚃",c:"#c9a84c"},
                  {id:"5",label:"5",sym:"⚄",c:"#facc15"},
                  {id:"6",label:"6",sym:"⚅",c:"#facc15"},
                  {id:"sword",label:"Miecz",sym:"⚔",c:"#f87171"},
                  {id:"shield",label:"Tarcza",sym:"🛡",c:"#60a5fa"},
                ].map(face=>(
                  <button key={face.id} onClick={()=>setTargetFace(face.id)} style={{padding:"10px 6px",background:targetFace===face.id?`${face.c}22`:"rgba(0,0,0,0.3)",border:`1px solid ${targetFace===face.id?face.c:"rgba(255,255,255,0.06)"}`,color:targetFace===face.id?face.c:"#4a4030",borderRadius:3,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                    <div style={{fontSize:20,marginBottom:2}}>{face.sym}</div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.05em"}}>{face.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Kept dice */}
            <div style={{marginBottom:24}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#8a7a5a",marginBottom:8,letterSpacing:"0.05em"}}>Trzymane kości (już uzyskane cele): <span style={{color:"#c9a84c",fontWeight:700}}>{keptDice.length}</span></div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Array.from({length:diceCount}).map((_,i)=>(
                  <button key={i} onClick={()=>{setKeptDice(prev=>prev.includes(i)?prev.filter(x=>x!==i):[...prev,i]);}} style={{width:36,height:36,background:keptDice.includes(i)?"rgba(74,222,128,0.15)":"rgba(0,0,0,0.3)",border:`1px solid ${keptDice.includes(i)?"rgba(74,222,128,0.5)":"rgba(255,255,255,0.06)"}`,color:keptDice.includes(i)?"#4ade80":"#4a4030",borderRadius:3,cursor:"pointer",fontFamily:"'Cinzel',serif",fontSize:11,fontWeight:700}}>
                    {keptDice.includes(i)?"✓":i+1}
                  </button>
                ))}
              </div>
              <div style={{fontSize:11,color:"#4a4030",marginTop:6}}>Kliknij kość aby oznaczyć że już uzyskałeś cel na tej kości</div>
            </div>

            <button onClick={calculateProbability} style={{width:"100%",background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.4)",color:"#c9a84c",fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:"0.15em",padding:"14px",cursor:"pointer",borderRadius:3,textTransform:"uppercase",transition:"all 0.2s"}}>Oblicz Prawdopodobieństwo</button>
          </div>

          {/* RIGHT — RESULT */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:"#0e0c10",border:"1px solid rgba(255,255,255,0.04)",borderRadius:4,padding:28,flex:1}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c9a84c",opacity:0.7,marginBottom:20}}>Wynik</div>
              {calcResult!==null?(
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:72,fontWeight:900,color:calcResult>=70?"#4ade80":calcResult>=40?"#facc15":"#f87171",marginBottom:8,lineHeight:1}}>{calcResult}%</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#6b5a3a",marginBottom:24}}>szansa na co najmniej jeden sukces</div>
                  <div style={{background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:4,padding:16,textAlign:"left"}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#4a4030",marginBottom:10,letterSpacing:"0.1em",textTransform:"uppercase"}}>Parametry</div>
                    {[
                      ["Kości do rzutu",`${diceCount-keptDice.length} z ${diceCount}`],
                      ["Kości z celem",`${keptDice.length}`],
                      ["Rerolle",`${rerolls}x`],
                      ["Cel",targetFace],
                    ].map(([l,v])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#8a7a5a",marginBottom:6}}>
                        <span>{l}</span><span style={{color:"#c9a84c",fontFamily:"'Cinzel',serif",fontWeight:700}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop:16,padding:12,background:calcResult>=70?"rgba(74,222,128,0.06)":calcResult>=40?"rgba(250,204,21,0.06)":"rgba(248,113,113,0.06)",border:`1px solid ${calcResult>=70?"rgba(74,222,128,0.2)":calcResult>=40?"rgba(250,204,21,0.2)":"rgba(248,113,113,0.2)"}`,borderRadius:4}}>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:calcResult>=70?"#4ade80":calcResult>=40?"#facc15":"#f87171",textAlign:"center"}}>
                      {calcResult>=70?"Wysokie prawdopodobieństwo — graj pod ten wynik":calcResult>=40?"Umiarkowane — warto spróbować":"Niskie — rozważ alternatywę"}
                    </div>
                  </div>
                </div>
              ):(
                <div style={{textAlign:"center",padding:"40px 20px",color:"#3a2010"}}>
                  <div style={{fontSize:40,marginBottom:16,opacity:0.3}}>🎲</div>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:14,marginBottom:8}}>Ustaw parametry i kliknij Oblicz</div>
                  <div style={{fontSize:12,color:"#2a2010",lineHeight:1.7}}>Kalkulator uwzględnia liczbę wolnych kości, ilość rerollów i czy masz już niektóre cele</div>
                </div>
              )}
            </div>

            {/* QUICK REFERENCE */}
            <div style={{background:"#0e0c10",border:"1px solid rgba(255,255,255,0.04)",borderRadius:4,padding:20}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:9,fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"#c9a84c",opacity:0.7,marginBottom:14}}>Szybka Tabela Referencji</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr>{["Kości","0 reroll","1 reroll","2 reroll"].map(h=><th key={h} style={{fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.1em",color:"#3a2010",textTransform:"uppercase",padding:"5px 8px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5,6].map(n=>{
                    const p=(r:number)=>Math.round((1-Math.pow(5/6,n*(r+1)))*100);
                    return<tr key={n}>
                      <td style={{fontFamily:"'Cinzel',serif",color:"#c9a84c",padding:"5px 8px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.02)"}}>{n}</td>
                      {[0,1,2].map(r=><td key={r} style={{color:p(r)>=70?"#4ade80":p(r)>=40?"#facc15":"#f87171",padding:"5px 8px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,0.02)"}}>{p(r)}%</td>)}
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* ══ HERO MODAL ══ */}
    {selectedHero&&(
      <div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)setSelectedHero(null)}}>
        <div className="modal-box">
          <div className="modal-top">
            <img src={selectedHero.img} alt={selectedHero.name} className="modal-img" onError={e=>{(e.target as HTMLImageElement).style.opacity="0.05"}}/>
            <div className="modal-details">
              <div className="modal-tier-badge" style={{background:TIER_COLORS[selectedHero.tier].bg,borderColor:TIER_COLORS[selectedHero.tier].border,color:TIER_COLORS[selectedHero.tier].text}}>{selectedHero.tier}-TIER · {SETS[selectedHero.set]?.label}</div>
              <div className="modal-name">{selectedHero.name}</div>
              <div className="modal-weapon">{selectedHero.weapon} · {selectedHero.style}</div>
              <div className="modal-stats">
                {[{val:`${selectedHero.winRate}%`,label:"Win Rate",color:getWinColor(selectedHero.winRate)},{val:`${selectedHero.pickRate}%`,label:"Pick Rate",color:"#60a5fa"},{val:`${selectedHero.banRate}%`,label:"Ban Rate",color:"#f87171"},{val:selectedHero.tier,label:"Tier",color:TIER_COLORS[selectedHero.tier].text}].map(s=>(
                  <div key={s.label} className="modal-stat"><div className="modal-stat-val" style={{color:s.color}}>{s.val}</div><div className="modal-stat-label">{s.label}</div></div>
                ))}
              </div>
              {selectedHero.companion&&(
                <div style={{background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.3)",borderRadius:3,padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <img src={selectedHero.companion.img} alt={selectedHero.companion.name} style={{width:36,height:48,objectFit:"cover",objectPosition:"top",borderRadius:2}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/>
                  <div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:10,color:"#d8b4fe",letterSpacing:"0.1em"}}>TOWARZYSZ</div>
                    <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#d8b4fe",fontWeight:700}}>{selectedHero.companion.name}</div>
                    <div style={{fontSize:10,color:"rgba(216,180,254,0.6)"}}>HP: {selectedHero.companion.maxHp}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-body">
            <div className="modal-section">Opis</div>
            <p className="modal-desc">{selectedHero.desc}</p>
            <div className="modal-section">Matchupy</div>
            <div className="matchups">
              <div><div className="mu-label" style={{color:"#4ade80"}}>✅ Kontruje</div>{selectedHero.counters.map((c:string)=><div key={c} className="mu-item" style={{borderLeftColor:"#4ade80"}}>{c}</div>)}</div>
              <div><div className="mu-label" style={{color:"#f87171"}}>❌ Słaby vs</div>{selectedHero.counteredBy.map((c:string)=><div key={c} className="mu-item" style={{borderLeftColor:"#f87171"}}>{c}</div>)}</div>
            </div>
            <div className="modal-section">Porady Turniejowe</div>
            <ul className="tips">{selectedHero.tips.map((t:string,i:number)=><li key={i} className="tip">{t}</li>)}</ul>
          </div>
          <button className="modal-close" onClick={()=>setSelectedHero(null)}>— Zamknij —</button>
        </div>
      </div>
    )}

    {/* ══ BATTLE WINDOW ══ */}
    {showBattle&&(()=>{
      const h1=getHero(battles.t1id),h2=getHero(battles.t2id);
      const t1p=battles.t1hp/battles.t1max,t2p=battles.t2hp/battles.t2max;
      const t1d=battles.t1hp===0,t2d=battles.t2hp===0;
      const t1c=t1p>0.5?"#4ade80":t1p>0.25?"#facc15":"#f87171";
      const t2c=t2p>0.5?"#4ade80":t2p>0.25?"#facc15":"#f87171";
      return(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.96)",backdropFilter:"blur(12px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,animation:"slideUp 0.3s ease both"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.3em",color:"#c9a84c",marginBottom:20,textTransform:"uppercase",opacity:0.7}}>⚔ Bitwa · Dice Throne</div>
          {(t1d||t2d)&&(
            <div style={{textAlign:"center",marginBottom:20,animation:"slideUp 0.5s ease both"}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#c9a84c",marginBottom:4}}>🏆 WYGRYWA</div>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:22,fontWeight:900,color:"#c9a84c"}}>{t1d?(h2?.name||"D2"):(h1?.name||"D1")}</div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:32,alignItems:"center",maxWidth:960,width:"100%"}}>
            {/* T1 */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <div style={{position:"relative",width:180,height:240,overflow:"hidden",border:`2px solid ${t1d?"rgba(248,113,113,0.3)":"rgba(220,38,38,0.4)"}`,borderRadius:4,opacity:t1d?0.4:1,filter:t1d?"grayscale(100%)":"none",transition:"all 0.5s"}}>
                {h1&&<img src={h1.img} alt={h1.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,6,10,0.8) 0%,transparent 50%)"}}/>
                <div style={{position:"absolute",bottom:10,left:0,right:0,textAlign:"center",fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:900,color:"#f87171"}}>{h1?.name}</div>
                {t1d&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>💀</div>}
              </div>
              <DiceRing value={battles.t1hp} maxValue={battles.t1max} color={t1c} size={90}/>
              <div style={{display:"flex",gap:6}}>
                <button className="hp-btn" onClick={()=>adjustHP("t1",-1)} disabled={t1d||t2d} style={{background:"rgba(248,113,113,0.1)",color:"#f87171",opacity:t1d||t2d?0.3:1}}>−</button>
                <button className="hp-btn" onClick={()=>adjustHP("t1",1)} disabled={t1d||t2d||battles.t1hp>=battles.t1max} style={{background:"rgba(74,222,128,0.1)",color:"#4ade80",opacity:t1d||t2d||battles.t1hp>=battles.t1max?0.3:1}}>+</button>
              </div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>
                {[-5,-3,-1,1,3,5].map(d=>(
                  <button key={d} className="hp-delta" onClick={()=>adjustHP("t1",d)} disabled={t1d||t2d} style={{background:d<0?"rgba(248,113,113,0.06)":"rgba(74,222,128,0.06)",border:`1px solid ${d<0?"rgba(248,113,113,0.15)":"rgba(74,222,128,0.15)"}`,color:d<0?"#f87171":"#4ade80",opacity:t1d||t2d?0.3:1}}>{d>0?"+":""}{d}</button>
                ))}
              </div>
              {battles.t1id==="huntress"&&(
                <div style={{textAlign:"center",marginTop:6}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#d8b4fe",letterSpacing:"0.1em",marginBottom:4}}>NYRA</div>
                  <SmallDiceRing value={battles.nyra1hp} maxValue={10} color={battles.nyra1hp>5?"#4ade80":battles.nyra1hp>2?"#facc15":"#f87171"} size={50}/>
                  <div style={{display:"flex",gap:4,marginTop:4,justifyContent:"center"}}>
                    <button onClick={()=>adjustNyraHP("nyra1",-1)} style={{width:26,height:26,background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",color:"#f87171",fontSize:14,cursor:"pointer",borderRadius:2,fontWeight:700}}>−</button>
                    <button onClick={()=>adjustNyraHP("nyra1",1)} disabled={battles.nyra1hp>=10} style={{width:26,height:26,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ade80",fontSize:14,cursor:"pointer",borderRadius:2,fontWeight:700,opacity:battles.nyra1hp>=10?0.3:1}}>+</button>
                  </div>
                </div>
              )}
            </div>

            {/* CENTER */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <div style={{fontFamily:"'Cinzel',serif",fontSize:28,fontWeight:900,color:"rgba(201,168,76,0.25)",letterSpacing:"0.1em"}}>VS</div>
              <div style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.04)",borderRadius:4,padding:12,maxWidth:160,maxHeight:200,overflowY:"auto",width:"100%"}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:7,color:"#3a2010",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>Log bitwy</div>
                {battles.log.map((l,i)=><div key={i} style={{fontSize:9,color:i===0?"#c9a84c":"#4a4030",marginBottom:2,lineHeight:1.4,borderBottom:"1px solid rgba(255,255,255,0.02)",paddingBottom:2}}>{l}</div>)}
              </div>
              <button onClick={()=>setBattles(prev=>({...prev,t1hp:prev.t1max,t2hp:prev.t2max,nyra1hp:prev.t1id==="huntress"?10:0,nyra2hp:prev.t2id==="huntress"?10:0,log:["⚔ HP zresetowane!"]}))} style={{background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",color:"#c9a84c",fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.1em",padding:"7px 16px",cursor:"pointer",borderRadius:2,textTransform:"uppercase"}}>Reset HP</button>
            </div>

            {/* T2 */}
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <div style={{position:"relative",width:180,height:240,overflow:"hidden",border:`2px solid ${t2d?"rgba(248,113,113,0.3)":"rgba(37,99,235,0.4)"}`,borderRadius:4,opacity:t2d?0.4:1,filter:t2d?"grayscale(100%)":"none",transition:"all 0.5s"}}>
                {h2&&<img src={h2.img} alt={h2.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}} onError={e=>{(e.target as HTMLImageElement).style.opacity="0"}}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(7,6,10,0.8) 0%,transparent 50%)"}}/>
                <div style={{position:"absolute",bottom:10,left:0,right:0,textAlign:"center",fontFamily:"'Cinzel',serif",fontSize:13,fontWeight:900,color:"#60a5fa"}}>{h2?.name}</div>
                {t2d&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>💀</div>}
              </div>
              <DiceRing value={battles.t2hp} maxValue={battles.t2max} color={t2c} size={90}/>
              <div style={{display:"flex",gap:6}}>
                <button className="hp-btn" onClick={()=>adjustHP("t2",-1)} disabled={t1d||t2d} style={{background:"rgba(248,113,113,0.1)",color:"#f87171",opacity:t1d||t2d?0.3:1}}>−</button>
                <button className="hp-btn" onClick={()=>adjustHP("t2",1)} disabled={t1d||t2d||battles.t2hp>=battles.t2max} style={{background:"rgba(74,222,128,0.1)",color:"#4ade80",opacity:t1d||t2d||battles.t2hp>=battles.t2max?0.3:1}}>+</button>
              </div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"center"}}>
                {[-5,-3,-1,1,3,5].map(d=>(
                  <button key={d} className="hp-delta" onClick={()=>adjustHP("t2",d)} disabled={t1d||t2d} style={{background:d<0?"rgba(248,113,113,0.06)":"rgba(74,222,128,0.06)",border:`1px solid ${d<0?"rgba(248,113,113,0.15)":"rgba(74,222,128,0.15)"}`,color:d<0?"#f87171":"#4ade80",opacity:t1d||t2d?0.3:1}}>{d>0?"+":""}{d}</button>
                ))}
              </div>
              {battles.t2id==="huntress"&&(
                <div style={{textAlign:"center",marginTop:6}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:9,color:"#d8b4fe",letterSpacing:"0.1em",marginBottom:4}}>NYRA</div>
                  <SmallDiceRing value={battles.nyra2hp} maxValue={10} color={battles.nyra2hp>5?"#4ade80":battles.nyra2hp>2?"#facc15":"#f87171"} size={50}/>
                  <div style={{display:"flex",gap:4,marginTop:4,justifyContent:"center"}}>
                    <button onClick={()=>adjustNyraHP("nyra2",-1)} style={{width:26,height:26,background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",color:"#f87171",fontSize:14,cursor:"pointer",borderRadius:2,fontWeight:700}}>−</button>
                    <button onClick={()=>adjustNyraHP("nyra2",1)} disabled={battles.nyra2hp>=10} style={{width:26,height:26,background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",color:"#4ade80",fontSize:14,cursor:"pointer",borderRadius:2,fontWeight:700,opacity:battles.nyra2hp>=10?0.3:1}}>+</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button onClick={()=>setShowBattle(false)} style={{marginTop:24,background:"none",border:"1px solid rgba(255,255,255,0.08)",color:"#4a4030",fontFamily:"'Cinzel',serif",fontSize:10,letterSpacing:"0.2em",padding:"10px 36px",cursor:"pointer",borderRadius:2,textTransform:"uppercase",transition:"all 0.2s"}} onMouseEnter={e=>{(e.currentTarget).style.color="#c9a84c";(e.currentTarget).style.borderColor="rgba(201,168,76,0.3)";}} onMouseLeave={e=>{(e.currentTarget).style.color="#4a4030";(e.currentTarget).style.borderColor="rgba(255,255,255,0.08)";}}>— Zamknij —</button>
        </div>
      );
    })()}
    </>
  );
}