"use client";

import { useState, useMemo, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";

interface EmojiEntry {
  emoji: string;
  name: string;
  category: string;
}

const CATEGORIES = [
  "All",
  "Smileys",
  "People",
  "Animals",
  "Food",
  "Travel",
  "Activities",
  "Objects",
  "Symbols",
  "Flags",
] as const;

type Category = (typeof CATEGORIES)[number];

const EMOJIS: EmojiEntry[] = [
  // Smileys
  { emoji: "\u{1F600}", name: "Grinning Face", category: "Smileys" },
  { emoji: "\u{1F603}", name: "Grinning Face with Big Eyes", category: "Smileys" },
  { emoji: "\u{1F604}", name: "Grinning Face with Smiling Eyes", category: "Smileys" },
  { emoji: "\u{1F601}", name: "Beaming Face with Smiling Eyes", category: "Smileys" },
  { emoji: "\u{1F606}", name: "Grinning Squinting Face", category: "Smileys" },
  { emoji: "\u{1F605}", name: "Grinning Face with Sweat", category: "Smileys" },
  { emoji: "\u{1F923}", name: "Rolling on the Floor Laughing", category: "Smileys" },
  { emoji: "\u{1F602}", name: "Face with Tears of Joy", category: "Smileys" },
  { emoji: "\u{1F642}", name: "Slightly Smiling Face", category: "Smileys" },
  { emoji: "\u{1F60A}", name: "Smiling Face with Smiling Eyes", category: "Smileys" },
  { emoji: "\u{1F607}", name: "Smiling Face with Halo", category: "Smileys" },
  { emoji: "\u{1F970}", name: "Smiling Face with Hearts", category: "Smileys" },
  { emoji: "\u{1F60D}", name: "Smiling Face with Heart-Eyes", category: "Smileys" },
  { emoji: "\u{1F929}", name: "Star-Struck", category: "Smileys" },
  { emoji: "\u{1F618}", name: "Face Blowing a Kiss", category: "Smileys" },
  { emoji: "\u{1F617}", name: "Kissing Face", category: "Smileys" },
  { emoji: "\u{1F61A}", name: "Kissing Face with Closed Eyes", category: "Smileys" },
  { emoji: "\u{1F619}", name: "Kissing Face with Smiling Eyes", category: "Smileys" },
  { emoji: "\u{1F972}", name: "Smiling Face with Tear", category: "Smileys" },
  { emoji: "\u{1F60B}", name: "Face Savoring Food", category: "Smileys" },
  { emoji: "\u{1F61B}", name: "Face with Tongue", category: "Smileys" },
  { emoji: "\u{1F61C}", name: "Winking Face with Tongue", category: "Smileys" },
  { emoji: "\u{1F92A}", name: "Zany Face", category: "Smileys" },
  { emoji: "\u{1F61D}", name: "Squinting Face with Tongue", category: "Smileys" },
  { emoji: "\u{1F911}", name: "Money-Mouth Face", category: "Smileys" },
  { emoji: "\u{1F917}", name: "Hugging Face", category: "Smileys" },
  { emoji: "\u{1F92D}", name: "Face with Hand Over Mouth", category: "Smileys" },
  { emoji: "\u{1F92B}", name: "Shushing Face", category: "Smileys" },
  { emoji: "\u{1F914}", name: "Thinking Face", category: "Smileys" },
  { emoji: "\u{1F610}", name: "Neutral Face", category: "Smileys" },
  { emoji: "\u{1F611}", name: "Expressionless Face", category: "Smileys" },
  { emoji: "\u{1F636}", name: "Face Without Mouth", category: "Smileys" },
  { emoji: "\u{1F60F}", name: "Smirking Face", category: "Smileys" },
  { emoji: "\u{1F612}", name: "Unamused Face", category: "Smileys" },
  { emoji: "\u{1F644}", name: "Face with Rolling Eyes", category: "Smileys" },
  { emoji: "\u{1F62C}", name: "Grimacing Face", category: "Smileys" },
  { emoji: "\u{1F925}", name: "Lying Face", category: "Smileys" },
  { emoji: "\u{1F60C}", name: "Relieved Face", category: "Smileys" },
  { emoji: "\u{1F614}", name: "Pensive Face", category: "Smileys" },
  { emoji: "\u{1F62A}", name: "Sleepy Face", category: "Smileys" },
  { emoji: "\u{1F924}", name: "Drooling Face", category: "Smileys" },
  { emoji: "\u{1F634}", name: "Sleeping Face", category: "Smileys" },
  { emoji: "\u{1F637}", name: "Face with Medical Mask", category: "Smileys" },
  { emoji: "\u{1F912}", name: "Face with Thermometer", category: "Smileys" },
  { emoji: "\u{1F915}", name: "Face with Head-Bandage", category: "Smileys" },
  { emoji: "\u{1F922}", name: "Nauseated Face", category: "Smileys" },
  { emoji: "\u{1F92E}", name: "Face Vomiting", category: "Smileys" },
  { emoji: "\u{1F927}", name: "Sneezing Face", category: "Smileys" },
  { emoji: "\u{1F975}", name: "Hot Face", category: "Smileys" },
  { emoji: "\u{1F976}", name: "Cold Face", category: "Smileys" },
  { emoji: "\u{1F974}", name: "Woozy Face", category: "Smileys" },
  { emoji: "\u{1F635}", name: "Face with Crossed-Out Eyes", category: "Smileys" },
  { emoji: "\u{1F92F}", name: "Exploding Head", category: "Smileys" },

  // People
  { emoji: "\u{1F44B}", name: "Waving Hand", category: "People" },
  { emoji: "\u{1F91A}", name: "Raised Back of Hand", category: "People" },
  { emoji: "\u{1F590}", name: "Hand with Fingers Splayed", category: "People" },
  { emoji: "\u270B", name: "Raised Hand", category: "People" },
  { emoji: "\u{1F596}", name: "Vulcan Salute", category: "People" },
  { emoji: "\u{1F44C}", name: "OK Hand", category: "People" },
  { emoji: "\u{1F90C}", name: "Pinched Fingers", category: "People" },
  { emoji: "\u{1F90F}", name: "Pinching Hand", category: "People" },
  { emoji: "\u270C", name: "Victory Hand", category: "People" },
  { emoji: "\u{1F91E}", name: "Crossed Fingers", category: "People" },
  { emoji: "\u{1F91F}", name: "Love-You Gesture", category: "People" },
  { emoji: "\u{1F918}", name: "Sign of the Horns", category: "People" },
  { emoji: "\u{1F919}", name: "Call Me Hand", category: "People" },
  { emoji: "\u{1F448}", name: "Backhand Index Pointing Left", category: "People" },
  { emoji: "\u{1F449}", name: "Backhand Index Pointing Right", category: "People" },
  { emoji: "\u{1F446}", name: "Backhand Index Pointing Up", category: "People" },
  { emoji: "\u{1F447}", name: "Backhand Index Pointing Down", category: "People" },
  { emoji: "\u261D", name: "Index Pointing Up", category: "People" },
  { emoji: "\u{1F44D}", name: "Thumbs Up", category: "People" },
  { emoji: "\u{1F44E}", name: "Thumbs Down", category: "People" },
  { emoji: "\u270A", name: "Raised Fist", category: "People" },
  { emoji: "\u{1F44A}", name: "Oncoming Fist", category: "People" },
  { emoji: "\u{1F91B}", name: "Left-Facing Fist", category: "People" },
  { emoji: "\u{1F91C}", name: "Right-Facing Fist", category: "People" },
  { emoji: "\u{1F44F}", name: "Clapping Hands", category: "People" },
  { emoji: "\u{1F64C}", name: "Raising Hands", category: "People" },
  { emoji: "\u{1F450}", name: "Open Hands", category: "People" },
  { emoji: "\u{1F932}", name: "Palms Up Together", category: "People" },
  { emoji: "\u{1F91D}", name: "Handshake", category: "People" },
  { emoji: "\u{1F64F}", name: "Folded Hands", category: "People" },

  // Animals
  { emoji: "\u{1F436}", name: "Dog Face", category: "Animals" },
  { emoji: "\u{1F431}", name: "Cat Face", category: "Animals" },
  { emoji: "\u{1F42D}", name: "Mouse Face", category: "Animals" },
  { emoji: "\u{1F439}", name: "Hamster", category: "Animals" },
  { emoji: "\u{1F430}", name: "Rabbit Face", category: "Animals" },
  { emoji: "\u{1F98A}", name: "Fox", category: "Animals" },
  { emoji: "\u{1F43B}", name: "Bear", category: "Animals" },
  { emoji: "\u{1F43C}", name: "Panda", category: "Animals" },
  { emoji: "\u{1F428}", name: "Koala", category: "Animals" },
  { emoji: "\u{1F42F}", name: "Tiger Face", category: "Animals" },
  { emoji: "\u{1F981}", name: "Lion", category: "Animals" },
  { emoji: "\u{1F42E}", name: "Cow Face", category: "Animals" },
  { emoji: "\u{1F437}", name: "Pig Face", category: "Animals" },
  { emoji: "\u{1F438}", name: "Frog", category: "Animals" },
  { emoji: "\u{1F435}", name: "Monkey Face", category: "Animals" },
  { emoji: "\u{1F414}", name: "Chicken", category: "Animals" },
  { emoji: "\u{1F427}", name: "Penguin", category: "Animals" },
  { emoji: "\u{1F426}", name: "Bird", category: "Animals" },
  { emoji: "\u{1F986}", name: "Duck", category: "Animals" },
  { emoji: "\u{1F985}", name: "Eagle", category: "Animals" },
  { emoji: "\u{1F989}", name: "Owl", category: "Animals" },
  { emoji: "\u{1F987}", name: "Bat", category: "Animals" },
  { emoji: "\u{1F41D}", name: "Honeybee", category: "Animals" },
  { emoji: "\u{1FAB1}", name: "Worm", category: "Animals" },
  { emoji: "\u{1F41B}", name: "Bug", category: "Animals" },
  { emoji: "\u{1F98B}", name: "Butterfly", category: "Animals" },

  // Food
  { emoji: "\u{1F34E}", name: "Red Apple", category: "Food" },
  { emoji: "\u{1F350}", name: "Pear", category: "Food" },
  { emoji: "\u{1F34A}", name: "Tangerine", category: "Food" },
  { emoji: "\u{1F34B}", name: "Lemon", category: "Food" },
  { emoji: "\u{1F34C}", name: "Banana", category: "Food" },
  { emoji: "\u{1F349}", name: "Watermelon", category: "Food" },
  { emoji: "\u{1F347}", name: "Grapes", category: "Food" },
  { emoji: "\u{1F353}", name: "Strawberry", category: "Food" },
  { emoji: "\u{1FAD0}", name: "Blueberries", category: "Food" },
  { emoji: "\u{1F348}", name: "Melon", category: "Food" },
  { emoji: "\u{1F352}", name: "Cherries", category: "Food" },
  { emoji: "\u{1F351}", name: "Peach", category: "Food" },
  { emoji: "\u{1F96D}", name: "Mango", category: "Food" },
  { emoji: "\u{1F34D}", name: "Pineapple", category: "Food" },
  { emoji: "\u{1F965}", name: "Coconut", category: "Food" },
  { emoji: "\u{1F95D}", name: "Kiwi Fruit", category: "Food" },
  { emoji: "\u{1F345}", name: "Tomato", category: "Food" },
  { emoji: "\u{1F951}", name: "Avocado", category: "Food" },
  { emoji: "\u{1F966}", name: "Broccoli", category: "Food" },
  { emoji: "\u{1F96C}", name: "Leafy Green", category: "Food" },
  { emoji: "\u{1F952}", name: "Cucumber", category: "Food" },
  { emoji: "\u{1F336}", name: "Hot Pepper", category: "Food" },
  { emoji: "\u{1FAD1}", name: "Bell Pepper", category: "Food" },
  { emoji: "\u{1F33D}", name: "Ear of Corn", category: "Food" },
  { emoji: "\u{1F955}", name: "Carrot", category: "Food" },
  { emoji: "\u{1F9C4}", name: "Garlic", category: "Food" },
  { emoji: "\u{1F9C5}", name: "Onion", category: "Food" },
  { emoji: "\u{1F954}", name: "Potato", category: "Food" },

  // Travel
  { emoji: "\u{1F697}", name: "Automobile", category: "Travel" },
  { emoji: "\u{1F695}", name: "Taxi", category: "Travel" },
  { emoji: "\u{1F699}", name: "Sport Utility Vehicle", category: "Travel" },
  { emoji: "\u{1F68C}", name: "Bus", category: "Travel" },
  { emoji: "\u{1F68E}", name: "Trolleybus", category: "Travel" },
  { emoji: "\u{1F3CE}", name: "Racing Car", category: "Travel" },
  { emoji: "\u{1F693}", name: "Police Car", category: "Travel" },
  { emoji: "\u{1F691}", name: "Ambulance", category: "Travel" },
  { emoji: "\u{1F692}", name: "Fire Engine", category: "Travel" },
  { emoji: "\u{1F690}", name: "Minibus", category: "Travel" },
  { emoji: "\u{1F6FB}", name: "Pickup Truck", category: "Travel" },
  { emoji: "\u{1F69A}", name: "Delivery Truck", category: "Travel" },
  { emoji: "\u{1F69B}", name: "Articulated Lorry", category: "Travel" },
  { emoji: "\u{1F69C}", name: "Tractor", category: "Travel" },
  { emoji: "\u2708", name: "Airplane", category: "Travel" },
  { emoji: "\u{1F6EB}", name: "Airplane Departure", category: "Travel" },
  { emoji: "\u{1F6EC}", name: "Airplane Arrival", category: "Travel" },
  { emoji: "\u{1F681}", name: "Helicopter", category: "Travel" },
  { emoji: "\u{1F6F8}", name: "Flying Saucer", category: "Travel" },
  { emoji: "\u{1F680}", name: "Rocket", category: "Travel" },
  { emoji: "\u{1F6F6}", name: "Canoe", category: "Travel" },
  { emoji: "\u26F5", name: "Sailboat", category: "Travel" },
  { emoji: "\u{1F6A4}", name: "Speedboat", category: "Travel" },
  { emoji: "\u{1F6F3}", name: "Passenger Ship", category: "Travel" },
  { emoji: "\u26F4", name: "Ferry", category: "Travel" },
  { emoji: "\u{1F6A2}", name: "Ship", category: "Travel" },

  // Activities
  { emoji: "\u26BD", name: "Soccer Ball", category: "Activities" },
  { emoji: "\u{1F3C0}", name: "Basketball", category: "Activities" },
  { emoji: "\u{1F3C8}", name: "American Football", category: "Activities" },
  { emoji: "\u26BE", name: "Baseball", category: "Activities" },
  { emoji: "\u{1F94E}", name: "Softball", category: "Activities" },
  { emoji: "\u{1F3BE}", name: "Tennis", category: "Activities" },
  { emoji: "\u{1F3D0}", name: "Volleyball", category: "Activities" },
  { emoji: "\u{1F3C9}", name: "Rugby Football", category: "Activities" },
  { emoji: "\u{1F94F}", name: "Flying Disc", category: "Activities" },
  { emoji: "\u{1F3B1}", name: "Pool 8 Ball", category: "Activities" },
  { emoji: "\u{1FA80}", name: "Yo-Yo", category: "Activities" },
  { emoji: "\u{1F3D3}", name: "Ping Pong", category: "Activities" },
  { emoji: "\u{1F3F8}", name: "Badminton", category: "Activities" },
  { emoji: "\u{1F3D2}", name: "Ice Hockey", category: "Activities" },
  { emoji: "\u{1F3D1}", name: "Field Hockey", category: "Activities" },
  { emoji: "\u{1F94D}", name: "Lacrosse", category: "Activities" },
  { emoji: "\u{1F3CF}", name: "Cricket Game", category: "Activities" },
  { emoji: "\u{1FA83}", name: "Boomerang", category: "Activities" },
  { emoji: "\u{1F945}", name: "Goal Net", category: "Activities" },
  { emoji: "\u26F3", name: "Flag in Hole", category: "Activities" },
  { emoji: "\u{1FA81}", name: "Kite", category: "Activities" },
  { emoji: "\u{1F3F9}", name: "Bow and Arrow", category: "Activities" },
  { emoji: "\u{1F3A3}", name: "Fishing Pole", category: "Activities" },
  { emoji: "\u{1F93F}", name: "Diving Mask", category: "Activities" },
  { emoji: "\u{1F94A}", name: "Boxing Glove", category: "Activities" },
  { emoji: "\u{1F94B}", name: "Martial Arts Uniform", category: "Activities" },
  { emoji: "\u{1F3BD}", name: "Running Shirt", category: "Activities" },
  { emoji: "\u26F8", name: "Ice Skate", category: "Activities" },
  { emoji: "\u{1F94C}", name: "Curling Stone", category: "Activities" },
  { emoji: "\u{1F6F7}", name: "Sled", category: "Activities" },
  { emoji: "\u{1F3BF}", name: "Skis", category: "Activities" },

  // Objects
  { emoji: "\u231A", name: "Watch", category: "Objects" },
  { emoji: "\u{1F4F1}", name: "Mobile Phone", category: "Objects" },
  { emoji: "\u{1F4BB}", name: "Laptop", category: "Objects" },
  { emoji: "\u2328", name: "Keyboard", category: "Objects" },
  { emoji: "\u{1F5A5}", name: "Desktop Computer", category: "Objects" },
  { emoji: "\u{1F5A8}", name: "Printer", category: "Objects" },
  { emoji: "\u{1F5B1}", name: "Computer Mouse", category: "Objects" },
  { emoji: "\u{1F5B2}", name: "Trackball", category: "Objects" },
  { emoji: "\u{1F4BF}", name: "Optical Disc", category: "Objects" },
  { emoji: "\u{1F4F7}", name: "Camera", category: "Objects" },
  { emoji: "\u{1F4F9}", name: "Video Camera", category: "Objects" },
  { emoji: "\u{1F3A5}", name: "Movie Camera", category: "Objects" },
  { emoji: "\u{1F4FD}", name: "Film Projector", category: "Objects" },
  { emoji: "\u{1F4DE}", name: "Telephone Receiver", category: "Objects" },
  { emoji: "\u260E", name: "Telephone", category: "Objects" },
  { emoji: "\u{1F4FA}", name: "Television", category: "Objects" },
  { emoji: "\u{1F4FB}", name: "Radio", category: "Objects" },
  { emoji: "\u{1F399}", name: "Studio Microphone", category: "Objects" },
  { emoji: "\u{1F39A}", name: "Level Slider", category: "Objects" },
  { emoji: "\u{1F39B}", name: "Control Knobs", category: "Objects" },
  { emoji: "\u{1F9ED}", name: "Compass", category: "Objects" },
  { emoji: "\u23F1", name: "Stopwatch", category: "Objects" },
  { emoji: "\u23F2", name: "Timer Clock", category: "Objects" },
  { emoji: "\u23F0", name: "Alarm Clock", category: "Objects" },
  { emoji: "\u{1F50B}", name: "Battery", category: "Objects" },
  { emoji: "\u{1F50C}", name: "Electric Plug", category: "Objects" },
  { emoji: "\u{1F4A1}", name: "Light Bulb", category: "Objects" },
  { emoji: "\u{1F526}", name: "Flashlight", category: "Objects" },

  // Symbols
  { emoji: "\u2764", name: "Red Heart", category: "Symbols" },
  { emoji: "\u{1F9E1}", name: "Orange Heart", category: "Symbols" },
  { emoji: "\u{1F49B}", name: "Yellow Heart", category: "Symbols" },
  { emoji: "\u{1F49A}", name: "Green Heart", category: "Symbols" },
  { emoji: "\u{1F499}", name: "Blue Heart", category: "Symbols" },
  { emoji: "\u{1F49C}", name: "Purple Heart", category: "Symbols" },
  { emoji: "\u{1F5A4}", name: "Black Heart", category: "Symbols" },
  { emoji: "\u{1F90D}", name: "White Heart", category: "Symbols" },
  { emoji: "\u{1F90E}", name: "Brown Heart", category: "Symbols" },
  { emoji: "\u{1F494}", name: "Broken Heart", category: "Symbols" },
  { emoji: "\u2763", name: "Heart Exclamation", category: "Symbols" },
  { emoji: "\u{1F495}", name: "Two Hearts", category: "Symbols" },
  { emoji: "\u{1F49E}", name: "Revolving Hearts", category: "Symbols" },
  { emoji: "\u{1F49D}", name: "Heart with Ribbon", category: "Symbols" },
  { emoji: "\u{1F498}", name: "Heart with Arrow", category: "Symbols" },
  { emoji: "\u{1F497}", name: "Growing Heart", category: "Symbols" },
  { emoji: "\u{1F496}", name: "Sparkling Heart", category: "Symbols" },
  { emoji: "\u{1F493}", name: "Beating Heart", category: "Symbols" },
  { emoji: "\u2728", name: "Sparkles", category: "Symbols" },
  { emoji: "\u2B50", name: "Star", category: "Symbols" },
  { emoji: "\u{1F31F}", name: "Glowing Star", category: "Symbols" },
  { emoji: "\u{1F4AB}", name: "Dizzy", category: "Symbols" },
  { emoji: "\u{1F525}", name: "Fire", category: "Symbols" },
  { emoji: "\u{1F4A5}", name: "Collision", category: "Symbols" },
  { emoji: "\u{1F4A2}", name: "Anger Symbol", category: "Symbols" },
  { emoji: "\u{1F4A4}", name: "ZZZ", category: "Symbols" },
  { emoji: "\u{1F4A8}", name: "Dashing Away", category: "Symbols" },
  { emoji: "\u{1F4A6}", name: "Sweat Droplets", category: "Symbols" },

  // Flags
  { emoji: "\u{1F1FA}\u{1F1F8}", name: "Flag: United States", category: "Flags" },
  { emoji: "\u{1F1EC}\u{1F1E7}", name: "Flag: United Kingdom", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1FF}", name: "Flag: Czech Republic", category: "Flags" },
  { emoji: "\u{1F1E9}\u{1F1EA}", name: "Flag: Germany", category: "Flags" },
  { emoji: "\u{1F1EB}\u{1F1F7}", name: "Flag: France", category: "Flags" },
  { emoji: "\u{1F1EA}\u{1F1F8}", name: "Flag: Spain", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F9}", name: "Flag: Italy", category: "Flags" },
  { emoji: "\u{1F1EF}\u{1F1F5}", name: "Flag: Japan", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1F3}", name: "Flag: China", category: "Flags" },
  { emoji: "\u{1F1F0}\u{1F1F7}", name: "Flag: South Korea", category: "Flags" },
  { emoji: "\u{1F1E7}\u{1F1F7}", name: "Flag: Brazil", category: "Flags" },
  { emoji: "\u{1F1E8}\u{1F1E6}", name: "Flag: Canada", category: "Flags" },
  { emoji: "\u{1F1E6}\u{1F1FA}", name: "Flag: Australia", category: "Flags" },
  { emoji: "\u{1F1F7}\u{1F1FA}", name: "Flag: Russia", category: "Flags" },
  { emoji: "\u{1F1EE}\u{1F1F3}", name: "Flag: India", category: "Flags" },
  { emoji: "\u{1F1F5}\u{1F1F1}", name: "Flag: Poland", category: "Flags" },
  { emoji: "\u{1F1F8}\u{1F1EA}", name: "Flag: Sweden", category: "Flags" },
  { emoji: "\u{1F1F3}\u{1F1F4}", name: "Flag: Norway", category: "Flags" },
  { emoji: "\u{1F1F5}\u{1F1F9}", name: "Flag: Portugal", category: "Flags" },
  { emoji: "\u{1F1F3}\u{1F1F1}", name: "Flag: Netherlands", category: "Flags" },
];

function getCodePoint(emoji: string): string {
  const codePoints = [...emoji]
    .map((c) => {
      const cp = c.codePointAt(0);
      return cp ? `U+${cp.toString(16).toUpperCase().padStart(4, "0")}` : "";
    })
    .filter(Boolean);
  return codePoints.join(" ");
}

function getHtmlEntity(emoji: string): string {
  const entities = [...emoji]
    .map((c) => {
      const cp = c.codePointAt(0);
      return cp ? `&#x${cp.toString(16).toUpperCase()};` : "";
    })
    .filter(Boolean);
  return entities.join("");
}

export default function EmojiPicker() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiEntry | null>(null);
  const [recentlyCopied, setRecentlyCopied] = useState<EmojiEntry[]>([]);

  const filtered = useMemo(() => {
    let result = EMOJIS;

    if (activeCategory !== "All") {
      result = result.filter((e) => e.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.emoji === q
      );
    }

    return result;
  }, [search, activeCategory]);

  const copyEmoji = useCallback(
    (entry: EmojiEntry) => {
      navigator.clipboard.writeText(entry.emoji).then(() => {
        setCopiedEmoji(entry.emoji);
        setSelectedEmoji(entry);

        setRecentlyCopied((prev) => {
          const without = prev.filter((e) => e.emoji !== entry.emoji);
          return [entry, ...without].slice(0, 10);
        });

        setTimeout(() => setCopiedEmoji(null), 1500);
      });
    },
    []
  );

  return (
    <ToolLayout
      title="Emoji Picker"
      description="Search, browse, and copy emojis to your clipboard. Organized by category with Unicode code points and HTML entities."
      relatedTools={["unicode-lookup", "text-case-converter", "morse-code"]}
    >
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emojis by name (e.g. smile, heart, fire)..."
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 px-4 py-2.5 text-sm focus:border-blue-500 dark:border-blue-400 focus:outline-none"
        />
      </div>

      {/* Category Tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Recently Copied */}
      {recentlyCopied.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Recently Copied
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {recentlyCopied.map((entry) => (
              <button
                key={entry.emoji}
                onClick={() => copyEmoji(entry)}
                title={entry.name}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-xl transition-colors hover:bg-blue-100 dark:bg-blue-900"
              >
                {entry.emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Copied Toast */}
      {copiedEmoji && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-4 py-2 text-sm text-green-700 dark:text-green-300">
          <span className="text-lg">{copiedEmoji}</span>
          <span>Copied!</span>
        </div>
      )}

      {/* Emoji Details */}
      {selectedEmoji && (
        <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 p-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{selectedEmoji.emoji}</span>
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {selectedEmoji.name}
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Category: {selectedEmoji.category}
              </div>
              <div className="mt-1 font-mono text-xs text-blue-700 dark:text-blue-300">
                {getCodePoint(selectedEmoji.emoji)}
              </div>
              <div className="mt-0.5 font-mono text-xs text-gray-500 dark:text-gray-400">
                HTML: {getHtmlEntity(selectedEmoji.emoji)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14">
        {filtered.map((entry) => (
          <button
            key={entry.emoji}
            onClick={() => copyEmoji(entry)}
            onMouseEnter={() => setSelectedEmoji(entry)}
            title={entry.name}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800 ${
              copiedEmoji === entry.emoji
                ? "bg-green-100 dark:bg-green-900 ring-2 ring-green-400"
                : "bg-white dark:bg-gray-900"
            }`}
          >
            {entry.emoji}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
          No emojis found matching &ldquo;{search}&rdquo;
        </div>
      )}

      <div className="mt-2 text-right text-xs text-gray-400 dark:text-gray-500">
        {filtered.length} emoji{filtered.length !== 1 ? "s" : ""} shown
      </div>

      
      {/* SEO Content */}
      <div className="mt-12 space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
          About This Tool
        </h2>
        <p>
          The Emoji Picker is a free online tool available on CodeUtilo. Search, browse, and copy emojis to clipboard. Organized by category with Unicode info. All processing happens directly in your browser — no data is ever sent to any server, ensuring your privacy and security. No signup or installation is required.
        </p>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Key Features
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Browser-Based Processing</strong> — All emoji picker operations run locally in your browser using JavaScript. Your data never leaves your device.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Instant Results</strong> — Get results immediately as you type or paste your input. No waiting for server responses or page reloads.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Free &amp; No Signup</strong> — Use the emoji picker as many times as you need without creating an account or paying anything.
          </li>
          <li>
            <strong className="text-gray-700 dark:text-gray-300">Mobile Friendly</strong> — Works on desktop, tablet, and mobile browsers. Access this tool from any device with an internet connection.
          </li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Common Use Cases
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Using the emoji picker for day-to-day development tasks</li>
          <li>Saving time on repetitive tasks by using a browser-based tool instead of writing custom code</li>
          <li>Working on projects where installing software is not an option (school, work, shared computers)</li>
          <li>Quick prototyping and debugging without switching to a terminal or IDE</li>
          <li>Sharing the tool link with colleagues who need the same functionality</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          How to Use
        </h2>
        <p>
          Enter your input in the text area provided and the emoji picker will process it instantly. Use the Copy button to copy the result to your clipboard. All operations are performed locally in your browser — no data is transmitted to any server.
        </p>
      
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is the Emoji Picker free to use?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes, the Emoji Picker is completely free with no usage limits. There is no signup or registration required. You can use it as many times as you need.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Is my data safe when using this tool?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. All processing happens locally in your browser using JavaScript. Your data is never uploaded to any server or stored anywhere. Everything stays on your device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Does this tool work on mobile devices?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              Yes. The Emoji Picker is fully responsive and works on smartphones, tablets, and desktop computers. You can use it from any modern browser on any device.
            </p>
          </details>
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Do I need to install anything?
            </summary>
            <p className="mt-2 pl-4 text-gray-600 dark:text-gray-400">
              No. The Emoji Picker runs entirely in your web browser. There is nothing to download or install. Just open the page and start using it immediately.
            </p>
          </details>
        </div>
</div>
    </ToolLayout>
  );
}
