# rp-app - WIP

A quick prototype of a 2‑player roleplay chat room, focused on aiding language learning through typing out scenarios. One player would be a native speaker, and the other a learner.

Two players (a **language learner** + a **native speaker**) roleplay a scenario through text chat. At any point, either player can **swap character roles**.

When a swap happens, the intention is:
- The **last message by the opposite character is redacted**
- The player who initiated the swap is prompted to **rewrite that last message**, as their character has also swapped.

This “swap” mechanic exists so the native speaker can effectively **redact a learner’s message** and replace it with a more natural version. The learner can then swap again and rewrite their response while looking at the native speaker’s natural phrasing.

Project is WIP and primarily for learning and experimentation.

## Technologies / Learning

- **React** + **Next.js**
- **Socket.IO** (real-time multiplayer)
- Designing multiplayer games + UI/UX

## Progress

- **Hosts a basic workflow, from landing page, to a room page**
- **Implements the core chat UI loop** (messages list + 2 player panels)
- **Implements the role/character swap mechanic** (flags the last message as “switched” so it can be rewritten/redacted)
- **Custom server setup** that hosts Next.js and initializes Socket.IO
  - The app is currently a fast-moving mock-up; the Socket.IO client/server contract is still evolving.
- **Basic theming / UI setup** (Tailwind, `next-themes`, HeroUI)

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:4000`.