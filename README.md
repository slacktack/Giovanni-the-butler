# Giovanni

**A butler that lives on your screen.** You talk to it, it remembers what you said you'd do, reminds you, points at things on your screen, and does the clicking when you ask. Your model, your keys, your machine. No servers of ours, no account, no subscription.

By **Tushar Gautam** · macOS · Windows · Linux · AGPL-3.0

---

## What it does

- **Talk, don't type.** Hold the talk keys, say it, let go. While you speak you can circle anything on screen and it sees what you mean.
- **Or type.** Tap the text shortcut and a small field opens beside your cursor.
- **It answers out loud** — in a voice you pick — or stays silent and writes.
- **It remembers.** What you said you'd do, reminders down to the second or on a repeating schedule, and lasting facts about you.
- **It shows, not just tells.** Rings the exact button to press, step by step, and waits for your click. Draws cards, charts, timelines, maps and 3D models beside whatever you're reading.
- **It acts.** Opens apps, sites and files; on macOS and Windows it clicks and types inside other apps.
- **Your model.** Sign in with Claude or ChatGPT, use an API key (Gemini, Grok, Kimi, GLM, DeepSeek and more), or run a local model through Ollama.

## The cast

Six characters, every one drawn procedurally as pixel art on a single green LED ramp — no sprite sheets, so they scale and glow like the hardware they're pretending to be. Each has its own name, voice and greetings.

| Look | What it is |
| --- | --- |
| **Buddy** | The default. A tiny glowing pixel critter |
| **JARVIS** | A glowing sphere of light that ripples as it speaks |
| **Nocturne** | A night guardian: pointed cowl, mask band, scalloped cape |
| **Pip** | A bunny: long ears that swing as it moves, a fluffy chest |
| **Miko** | A kitten: triangle ears, a bow at the crown, a chest ribbon |
| **Cloud** | A pup: floppy ears, bright eyes, a lit collar |

Sizes: **Default**, **Small**, and **Cursor** — a pointer that rides with your mouse.

## The interface

A **Signal** console: paper `#E9E5E1` on a dot grid, hard ink rules, uppercase mono labels, one green-to-teal gradient reserved for anything live, red only for danger.

| Token | Value |
| --- | --- |
| Static | `#E9E5E1` |
| Phosphor | `#2BD94A` |
| Terminal | `#111111` |
| Teal | `#26B69A` |
| Alert | `#E2462B` |

Type is **Doto** (dot matrix) for readouts and **Martian Mono** for everything else. Both are SIL OFL and vendored in `showcase/onboarding/fonts/`. The LED canvases render at device-pixel ratio with smoothing off, so the dots stay sharp on a Retina display.

## Requirements

| | |
| --- | --- |
| macOS | 13.5 or later. Speech recognition runs on-device; best on macOS 26+ |
| Windows | 10 or later. Speech runs locally on the Parakeet model |
| Linux | x86_64, glibc 2.38+ (Ubuntu 24.04, Fedora 39, Debian 13). Beta |

## Build and run

Needs Rust, Node 22+, the [Tauri v2 prerequisites](https://v2.tauri.app/start/prerequisites/), and on macOS the Xcode Command Line Tools.

```bash
git clone https://github.com/slacktack/Giovanni-the-butler.git
cd Giovanni-the-butler/showcase/tauri
(cd sidecar && npm ci && npm test)   # the sidecar's own suite
./build.sh dev                        # debug binary
./build.sh                            # release bundle for this machine
```

Output lands in `src-tauri/target/release/bundle/` (`.app` and `.dmg` on macOS). `build.sh` downloads the pinned Node runtime and verifies it against Node's published SHA-256 sums.

**There is no update feed.** Nothing replaces your build behind your back. To self-update from your own repo, put a minisign public key and endpoint in `plugins.updater` in `tauri.conf.json` and set `UPDATE_REPO` in `showcase/tauri/sidecar/sidekick.mjs`.

## What it costs

Giovanni runs no backend and bills nothing. Every cost is a service you connect:

| | |
| --- | --- |
| **The model** | Your Claude or ChatGPT plan (flat), an API key (per token), or Ollama (free) |
| **Listening** | Free — on-device on all three platforms |
| **Spoken replies** | Off by default. Fish Audio or Gemini TTS bill to your own account; VoiceStudio runs locally for nothing |

Each request carries roughly 12.6k tokens of prompt and tool schemas before your own words, so a flat subscription plan is the cheapest way to run it. The panel footer shows today's requests and tokens.

## Local models

Ollama is supported. A model must handle **images and tool calls** and needs **32k context or more** (`OLLAMA_CONTEXT_LENGTH=32768`); Giovanni tells you when a model doesn't qualify. One background agent at a time on a local model.

## Privacy

No analytics, no telemetry, no developer servers. Data leaves your machine only to services you connect: your AI provider (your message, the live state block, and a screenshot when you ask about the screen), the voice service if spoken replies are on, and sites the agent fetches. Speech-to-text is on-device.

Everything Giovanni stores lives under `~/.gg/`: settings, memory, sessions, activity logs (7 days) and a token-count log. Fish Audio and Gemini voice keys go to the OS keystore (Keychain, DPAPI, or the desktop keyring); AI sign-ins live in `~/.gg/auth.json`.

Full text: [PRIVACY.md](PRIVACY.md).

## Safety

- **File edits, commands and app control are off by default.** You turn them on in the panel's Behavior page only if you want them.
- Commands are parsed and classified before they run. Destructive, privileged, persistence and secret-path commands are blocked outright; anything that changes something asks you first; download-into-a-shell is refused.
- Secret paths (`~/.ssh`, cloud credentials, browser cookies, keychains, `.env`) are never read or written, and symlinks are resolved before the check.
- Web fetches refuse localhost and private ranges, re-checking DNS on every redirect.
- **Known limitation:** the classifier parses shell text as a POSIX shell would, but the command runs in your login shell. Quoting forms it doesn't expand (`$'…'`, `{a,b}`) can reach the shell unclassified — so treat "Allow File Edits & Commands" as off unless you need it. How to report: [SECURITY.md](SECURITY.md).

## Layout

```
showcase/tauri/src-tauri/   Tauri shell (Rust) + macOS/Windows/Linux helpers
showcase/tauri/sidecar/     the agent: prompts, tools, safety rules, voice (plain ESM)
showcase/roamies/           the renderer: characters, ink, cards, canvas and WebGL
showcase/panel/             the menu-bar panel
showcase/onboarding/        the setup guide
```

The sidecar is unminified ES modules and the UI is plain JS, so you can change the brain and the interface without recompiling anything: `./build.sh dev` picks up edits on the next start.

## License

AGPL-3.0-only — see [LICENSE](LICENSE). Third-party terms and attributions are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md); the agent runs on the AGPL-3.0 [gg-framework](https://github.com/KenKaiii/gg-framework) packages. Giovanni's characters, interface, copy and product identity are Tushar Gautam's. If you distribute a modified Giovanni, share its source under the same license.
