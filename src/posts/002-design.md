# Game design

An immersive-sim FPS co-op sandbox on a **super-magnetic, metal-rich planet** where civilization grows industrially and fades away already. You survive by **driving a home-bunker cargo truckvehicle** across an infinite-feeling world, looting and improvising with real physics. The signature is the **isolated vehicle interior**: while the vehicle is moving, players can still freely interact with items inside (storage, crafting, chaos) as if it’s a moving room.

**Drive a moving home-bunker across a magnetic wasteland and survive by turning loot, physics, and curiosity into power.**

### The “first 5 minutes” promise (what players immediately experience)
- You spawn with almost nothing, spot a strange POI on the horizon, and head toward it.
- You find a **box**, start stuffing it with real guns and food, then toss the whole box into one inventory slot.
- You return to the vehicle interior, drop the box on the floor, open it, and realize the **interior is a real playable space even while driving**.
- Drive away to explore the wasteland, find another POI, and repeat.

### Hooks
- **The moving home-bunker**: drive while your friend reorganizes the interior with full physics.
- **Hoarding as gameplay**: boxes can hold real objects by bounds; one hotbar slot can represent an entire messy “kit” if you pack smart.
- **Minimal HUD, maximal world**: tiny crosshair + 12-slot hotbar; the world is the interface.
- **Cozy surface / grim depth**: warm orange grass hills above; cold factories, mines, and caves below.
- **Investigate → understand → act**: solve what a place is/was, then decide how to use it (steal, fight, hack, salvage, upgrade).

### Design pillars (non-negotiables)
- **Clarity of interaction**
  - Instantly readable difference between **grabbable/interactable** vs **static set-dressing**.
  - On hover: outline + simple icon + stack count (plus audio cues).
- **Instant response**
  - Input feels sharp; actions have immediate feedback (sound, animation, physics reaction).
- **Fun > realism (but consistent rules)**
  - Physics and immersion support creativity; we don’t simulate “real life,” we simulate *fun on chaotic foreign planet*.
- **The world is the UI**
  - Avoid “pretend” UI panels for actions that should happen physically.
  - Prefer levers, switches, terminals, devices, containers, light/sound cues.

### The planet (tone + world logic)
- **Super magnetic dusty wasteland**
  - Rich in metals and magnetism; poor on “humanity” (culture, safety, stable institutions).
  - Orange is the emotional anchor color: warm, saturated, slightly overtuned.
- **Biomes as a story**
  - Center: cozy wastelandy grassy hills (warm/orange).
  - North: extreme cold.
  - South: extreme heat.
  - Sky: clean, safe, high-tech “rich layer” (rare/aspirational).
  - Underground: factories/mines/caves — gritty, cold, occasionally horror/gore.

### Current scope notes (pragmatic constraints)
- **Minimal UI** by design (immersive), but interaction readability is mandatory.
- **60fps feel** is a priority; avoid heavy temporal rendering tricks.
- Narrative is mostly **environmental + terminals** (no voice budget).
