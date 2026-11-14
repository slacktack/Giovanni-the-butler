import assert from 'node:assert/strict';
import { aboutGiovanni } from '../about.mjs';

// The app's manual for about_giovanni: each platform's own wording, and only the features this copy has.
const base = { name: 'JARVIS', looks: ['Roamie', 'JARVIS', 'Anime Girl'], mac: false, linux: false, snap: false, pointer: false, voice: false, hotkeys: false };
const mac = aboutGiovanni({ ...base, mac: true, snap: true, pointer: true, voice: true, hotkeys: true });
const win = aboutGiovanni(base);
const linux = aboutGiovanni({ ...base, linux: true, voice: true });
assert.match(mac, /lives in the menu bar at the top of the screen/);
assert.match(mac, /Show JARVIS, Ask JARVIS…, Ask About an Area…, Stop, Quit Giovanni/);
assert.match(mac, /Look: Roamie, JARVIS or Anime Girl/);
assert.match(mac, /Wake word \(say "Hey Giovanni"/);
assert.match(mac, /Voice Provider: Fish Audio, Gemini or VoiceStudio/);
assert.match(win, /bottom right of the taskbar/);
assert.ok(!/Ask About an Area|Wake word|Voice Control|Cursor, a little arrow/.test(win), 'features this copy lacks are left out');
assert.match(linux, /AppIndicator extension/);
assert.ok(!/Check for Updates|Update to /.test(linux), 'a self-built fork has no update feed to poll');
assert.ok(!/Wake word/.test(linux), 'the wake word is Mac only');
for (const t of [mac, win, linux]) {
  assert.match(t, /Save Diagnostics/);
  assert.match(t, /made by Tushar Gautam and licensed under AGPL-3\.0/);
  assert.ok(!/\$\{|undefined/.test(t), 'every part is filled in');
}
console.log('about tests: passed');
