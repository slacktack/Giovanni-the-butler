// Character looks for the sidekick: Nocturne, Blaze, Frost, Miko and Cloud. Each is a head-and-shoulders hologram
// in the LED palette that fades out at the bottom like the JARVIS globe's projector, with a face that blinks,
// follows the cursor, talks with the real voice level and acts out moods. Hair moves with the body: the anime
// the guardian's cape hem sways, the fighters' spikes spring, the kitten's bow bobs and the pup's long ears swing.
// 10-dither.js calls in here when the look is one of these, as it does jarvis.js. Pure drawing: it composes a
// small grid of levels, then writes it through the kit's put.
//
// The bodies are pixel art, one per size (default, small, cursor). Rows are the left half up to and including
// the centre column and are mirrored; a row as wide as the whole sprite is used as written (for what isn't
// symmetrical, like a side parting). Letters are levels of the LED palette, 0 darkest to 4 brightest:
//   h hair (1)  H hair shine (2)  s skin (3)  z skin shade (2)  c cloth (2)  C cloth shade (1)  k cloth light (3)
//   w white (4)  t/T hair that swings (1/2)  0-4 that level.  The face (eyes, brows, mouth) is drawn over it.
// over is drawn over the face (a mask band, whiskers, a visor): [row, column, levels, mirrored too]. mouths replaces the shared
// mouths for that size.
(() => {
  const R = window.Roamie;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const LV = { h: 1, H: 2, s: 3, S: 4, z: 2, c: 2, C: 1, k: 3, w: 4, t: 1, T: 2, 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 };
  const SWING = new Set(['t', 'T']);

  // eye: the viewer's-right eye's inner column (from the centre) and top row; mouth: its row; cy: the row of the
  // body point; fade: rows at the bottom that fade out.
  const ART = {
    
    // Tushar Gautam, who makes Giovanni (shown on the About page, not a look): a textured dark fringe over faded sides,
    // and a hoodie with its drawstrings.
    tushar: {
      L: {
        w: 29, cy: 14, fade: 5, eye: [2, 12], mouth: 18,
        patch: [[0, 10, 'hh.h'], [0, 16, 'h.hh'], [1, 9, 'hhhHhhh'], [7, 15, 'shh'], [8, 16, 'h']],
        rows: [
          '...............', '.........hhhhhh', '.......hhhhhhhh', '......hhhhHHhhh', '.....hhhhhhhhhh', '.....Hhhhhhhhhh',
          '.....HHhhhhhhhh', '.....HHhshhshhh', '.....HHssshssss', '.....Hsssssssss', '.....zsssssssss', '....zzsssssssss',
          '....zzsssssssss', '....zzsssssssss', '.....zsssssssss', '......sssssssss', '......sssssssss', '.......ssssssss',
          '.......ssssssss', '........sssssss', '..........sssss', '............sss', '............zss', '............zss',
          '........cccccCz', '.....CCCCCcccCc', '...CCCCCCCCCwCC', '..CCCCCCCCCCwCC', '.CCCCCCCCCCCwCC', 'CCCCCCCCCCCCkCC',
        ],
      },
      S: {
        w: 17, cy: 8, fade: 3, eye: [2, 8], mouth: 11,
        patch: [[0, 5, 'h.h'], [0, 10, 'h'], [4, 9, 'sh']],
        rows: ['.........', '....hhhhh', '...hhhHhh', '..Hhhhhhh', '..Hhhshhs', '..Hssssss', '..sssssss', '.zsssssss', '.zsssssss', '..sssssss', '..sssssss', '...ssssss', '....sssss', '......sss', '.......zs', '...CCcccz', 'CCCCCCCwC'],
      },
      X: {
        w: 11, cy: 4, fade: 1, eye: [1, 3], mouth: 5,
        patch: [[0, 3, 'h.hh']],
        rows: ['......', '.hhhhh', '.Hhshh', '.sssss', 'zsssss', '.sssss', '..ssss', '...zss', '..CCwC'],
      },
    },
    // nocturne: a night guardian: a cowl with two points, a mask band over the brow, and a cape that flares to the edges with a scalloped hem
    nocturne: {
      L: {
        w: 29, cy: 14, fade: 5, eye: [2, 12], mouth: 19, tail: [21, 29],
        patch: [[1, 10, 'c'], [2, 9, 'cc'], [2, 26, 'cc'], [2, 27, 'c'], [19, 13, '1'], [21, 14, 'w'], [22, 13, 'www'], [24, 12, '4'], [24, 16, '4'], [25, 14, '4']],
        over: [[10, 8, '1111111', true], [12, 11, '44', true], [11, 7, '1', true]],
        mouths: { closed: ['0..0'], talk1: ['.00.', '.00.'], talk2: ['.00.', '0110', '0110', '.00.'], shout: ['00000', '01110', '01110', '.000.'], o: ['.0.', '010', '.0.'], frown: ['.000.', '0...0'], grin: ['000000', '044440', '.0000.'], flat: ['0000'] },
        rows: [
          '...............', '.........CCC...', '........CCCCC..', '.......CCCCCCC.', '......CCCCCCCCC', '.....CCCCCCCCCC',
          '.....CCCCCCCCCC', '.....CCccssssss', '.....CCcCssssss', '.....CCCsssssss', '.....CC111sssss', '.....CC111sssss',
          '.....CCCsssssss', '.....CCCsssssss', '.....CCCsssssss', '.....CCCsssssss', '......C.sssssss', '......CCsssssss',
          '......CCCCsssss', '......CCCCCCsss', '.......CCCCCCCC', '..........CCCCC', '............zzz', '..........CCCCC',
          '..CCCCCCCCCCCCC', '.CCCCCCCCCCCCCC', 'CCCCCCCCCCCCCCC', 'CCtCCCttCCttCt.', 'CCttCCt.tCCt...', 'CCCTTCCCT.TCT..'
        ],
      },
      S: {
        w: 17, cy: 8, fade: 3, eye: [2, 8], mouth: 11, tail: [12, 16],
        patch: [[2, 4, 'c'], [2, 12, 'c'], [10, 8, 'w'], [12, 8, '4']],
        over: [[5, 3, '1111', true], [6, 4, '4', true]],
        mouths: { closed: ['0'], talk1: ['0', '0'], talk2: ['.0.', '000', '.0.'], shout: ['.0.', '000', '000', '.0.'], o: ['0'], frown: ['.0.', '0.0'], grin: ['0.0', '.0.'], flat: ['000'] },
        rows: ['.........', '...CCC...', '..CCCCC..', '.CCCCCCCC', '.CC11ssss', '.CCssssss', '.CCssssss', '.CCssssss', '..Cssssss', '..CCCCCCC', '....CCCCC', '......zzz', 'CCCCCCCCC', 'CCCCCCCCC', 'CCcCCCCcC', 'CCCcCCCcC', 'CCCCcCCCC'],
      },
      X: {
        w: 11, cy: 4, fade: 1, eye: [1, 3], mouth: 5, tail: [7, 8],
        patch: [[6, 5, 'w']],
        rows: ['...CCC', '..CCCC', '.CCCCC', '.CCsss', '.C1sss', '.CCsss', '..CCCC', 'CCCCCC', 'CcCCCC'],
      },
    },
    // pip: the bunny from the installer: two long ears that twitch and sway, a pink nose, whiskers and a scarf
    pip: {
      L: {
        w: 29, cy: 14, fade: 5, eye: [2, 10], mouth: 16, blush: [6, 14], tail: [0, 6],
        patch: [[1, 10, 'w'], [2, 10, 'w'], [3, 10, 'w'], [4, 10, 'w'], [5, 10, 'w'], [15, 14, '1'], [25, 14, 'w'], [26, 13, 'www']],
        over: [[15, 9, '1', true], [16, 10, '1', true], [17, 9, '1', true]],
        mouths: { closed: ['.0.0.'], talk1: ['.00.'], talk2: ['.00.', '0110'], shout: ['.000.', '01110', '01110'], o: ['.0.', '0.0'], frown: ['.00.', '0..0'], grin: ['00000', '04444', '.000.'], flat: ['000'] },
        rows: [
          '..........tt...', '.........ttt...', '.........tttt..', '.........ttttt.', '........tttttt.', '........ttttttt',
          '......ccccccccc', '.....cccsssssss', '.....cccsssssss', '.....cc11ssssss', '.....cc11ssssss', '.....cccsssssss',
          '.....cccsssssss', '......sssssssss', '......sssssssss', '......sssss1sss', '......ssssscsss', '.......ssssssss',
          '.......ssssssss', '........sssssss', '..........zzzzz', '............zzz', '............zzz', '..........ccccc',
          '........CCCwwww', '......CCCwwwwww', '....CCCCwwwwwww', '...CCCccwwwwwww', '..CCCcccwwwwwww', 'CCCCccccccccccc'
        ],
      },
      S: {
        w: 17, cy: 8, fade: 3, eye: [2, 7], mouth: 10, blush: [4, 8], tail: [0, 4],
        patch: [[1, 6, 'w'], [2, 6, 'w'], [3, 6, 'w'], [9, 8, '1']],
        over: [[9, 5, '1', true]],
        mouths: { closed: ['0.0'], talk1: ['.0.'], talk2: ['000'], shout: ['000', '.0.'], o: ['.0.'], frown: ['0.0'], grin: ['000'], flat: ['00'] },
        rows: ['......tt.', '.....ttt.', '.....tttt', '....ttttt', '...cccccc', '..ccsssss', '..cc11sss', '..cccssss', '...ssssss', '...ssss1s', '....sssss', '.....zzzz', '...CCwwww', '.CCCwwwww', 'CCCCwwwww', 'CCCCCwwww', 'CCCCCCCCC'],
      },
      X: {
        w: 11, cy: 4, fade: 1, eye: [1, 3], mouth: 5, tail: [0, 3],
        patch: [[4, 2, '11']],
        rows: ['....tt', '...ttt', '...ttt', '..ccss', '..11ss', '..sszz', '...sss', '.CCwww', 'CCCCCC'],
      },
    },
    // miko: a kitten: two triangle ears, a bright bow at the crown, a small dark nose, a blush and a chest ribbon
    miko: {
      L: {
        w: 29, cy: 14, fade: 5, eye: [3, 12], mouth: 17, blush: [6, 15], tail: [26, 29],
        patch: [[2, 4, 'c'], [2, 24, 'c'], [3, 4, 'c'], [3, 24, 'c'], [16, 14, '1'], [26, 14, 'w'], [27, 12, 'twwwt'], [28, 11, 'ttwwwtt']],
        over: [[15, 9, '1', true], [16, 10, '1', true], [17, 9, '1', true], [9, 6, '1', true]],
        mouths: { closed: ['0.0', '.0.'], talk1: ['.0.', '0.0'], talk2: ['0.0', '.0.', '010'], shout: ['0.0.0', '.000.', '01110', '.000.'], o: ['.0.', '0.0'], frown: ['.0.0.'], grin: ['0.0.0', '.000.', '.111.'], flat: ['.0.'] },
        rows: [
          '....k.....w..cc', '...kk....www.cc', '...ccc..wwwwwcc', '....ccc..kkkwww', '.....cccc..wwww', '.....cccccccccc',
          '....ccccccccccc', '....ccsssssssss', '....ccsssssssss', '....11sssssssss', '....11sssssssss', '....ccsssssssss',
          '....ccsssssssss', '.....ssssssssss', '.....ssssssssss', '.....ssssssCsss', '......ssssscsss', '......ssssssszz',
          '.......ssssssss', '........sssssss', '..........zzzzz', '............zzz', '...........cccc', '..........wwwww',
          '........CCCwwcC', '......CCCwwwwcc', '....CCCkkwwcccc', '..CCckkkwwwwwww', '.CCckkkkwwwwwww', 'CCCCccckkkccccc'
        ],
      },
      S: {
        w: 17, cy: 8, fade: 3, eye: [2, 8], mouth: 11, blush: [4, 9], tail: [13, 16],
        patch: [[2, 4, 'c'], [2, 12, 'c'], [8, 8, '1'], [13, 8, 'w'], [14, 7, 'www']],
        over: [[8, 5, '1', true], [5, 3, '1', true]],
        mouths: { closed: ['0.0', '.0.'], talk1: ['.0.'], talk2: ['010'], shout: ['010', '.0.'], o: ['.0.'], frown: ['0.0'], grin: ['0.0', '.0.'], flat: ['.0.'] },
        rows: ['......wcc', '.....wwcc', '....ccwww', '..ccccccc', '..cssssss', '..11sssss', '..ccsssss', '...ssssCs', '...sssszz', '....sssss', '.....zzzz', '....wwwww', '..CCwwwww', '.CCwwwwww', '.CCkkwwww', 'CCCcccccc', 'CCCCccccC'],
      },
      X: {
        w: 11, cy: 4, fade: 1, eye: [1, 3], mouth: 5,
        patch: [[5, 4, '1'], [7, 5, 'w']],
        mouths: { closed: ['0'], talk1: ['0'], talk2: ['0'], shout: ['0'], o: ['0'], frown: ['0'], grin: ['0'], flat: ['0'] },
        rows: ['....w.', '...ccc', '..csss', '..11ss', '..ccss', '...szz', '..wwww', '.Cwwww', 'CCCCCC'],
      },
    },
    // cloud: a pup: long ears that swing as it moves, a dark nose, and a bright fluffy chest
    cloud: {
      L: {
        w: 29, cy: 14, fade: 5, eye: [3, 12], mouth: 17, tail: [4, 20],
        patch: [[7, 3, 'cc'], [7, 25, 'cc'], [10, 3, 'cc'], [10, 25, 'cc'], [14, 14, '1'], [25, 12, 'www'], [26, 11, 'wwwww'], [27, 11, 'wwwww']],
        over: [[13, 14, '4'], [18, 12, 'c', true]],
        mouths: { closed: ['.00.'], talk1: ['.00.', '0110'], talk2: ['.000.', '01110', '04440', '.000.'], shout: ['00000', '01110', '04440', '01110', '00000'], o: ['.0.', '0.0'], frown: ['.00.', '0..0'], grin: ['000000', '011110', '044440', '.0000.'], flat: ['000'] },
        rows: [
          '.........kkkkkk', '.......kkkkkkkk', '.....kkkkkkkkkk', '...kkkkkkkkkkkk', '..ttkkkkkssssss', '..ttkksssssssss',
          '..ttk.sssssssss', '..tt.11ssssssss', '..tt.11ssssssss', '..tt.ksssssssss', '..tt.ksssssssss', '..tt..kssssssss',
          '..tt...ssssssss', '..t....ssssssss', '..t....ssssssss', '..t....ssssssss', '..t....sssssszz', '...k...sssssszz',
          '......sssssssss', '......zzzzzzzzz', '.......ssssssss', '............zzz', '...........wwww', '..........wwwww',
          '.......CCCwwwcc', '.....CCCwwwwwcc', '...CCCcwwwwcccc', '..CCccwwwwwwwww', '.CCccwwwwwwwwww', 'CCCCccccccccccc'
        ],
      },
      S: {
        w: 17, cy: 8, fade: 3, eye: [2, 8], mouth: 11, tail: [1, 9],
        patch: [[3, 3, 'cc'], [3, 13, 'cc'], [8, 8, '1'], [13, 6, 'www'], [14, 5, 'www']],
        over: [[8, 8, '4']],
        mouths: { closed: ['.0.'], talk1: ['0.0'], talk2: ['010', '.0.'], shout: ['010', '010'], o: ['.0.'], frown: ['0.0'], grin: ['000', '.0.'], flat: ['000'] },
        rows: ['....kkkk.', '..kkkkkk.', '.ttkkssss', '.tt11ssss', '.ttk.ssss', '.tt.kssss', '.t..kssss', '.t..ksszz', '..k.ssszz', '....sssss', '.....zzzz', '....wwwww', '..CCwwwww', '.CCcwwwww', '.CCcwwwww', 'CCCc.wwww', 'CCCCccccC'],
      },
      X: {
        w: 11, cy: 4, fade: 1, eye: [1, 3], mouth: 5, tail: [1, 6],
        patch: [[2, 3, 'c'], [5, 4, '1'], [8, 4, 'www']],
        mouths: { closed: ['0'], talk1: ['0'], talk2: ['00'], shout: ['00'], o: ['0'], frown: ['0'], grin: ['00'], flat: ['0'] },
        rows: ['..kkkk', '.tksss', '.t11ss', '.tksss', '.t.ksz', '.t.kzz', '..wwww', '.Cwwww', 'CCwwww'],
      },
    },
  };
  // Mirror the half rows once. w is the whole width (odd, so there's a centre column).
  for (const who in ART) for (const sz in ART[who]) {
    const a = ART[who][sz], half = (a.w + 1) / 2;
    a.rows = a.rows.map((r) => (r.length === a.w ? r : r.length === half ? r + [...r.slice(0, -1)].reverse().join('') : (console.warn(`people.js: ${who} ${sz} row "${r}" is ${r.length} wide, not ${half} or ${a.w}`), r)));
    a.cx = half - 1;
    for (const [j, i, str] of a.patch ?? []) a.rows[j] = a.rows[j].slice(0, i) + str + a.rows[j].slice(i + str.length);
  }

  // Eyes, drawn for the viewer's-right eye and mirrored for the left. Each: open, wide, shut, happy, dizzy, sleepy.
  const EYES = {
    tushar: {
      L: { open: ['000', '040'], wide: ['000', '040', '000'], shut: ['...', '000'], happy: ['.0.', '0.0'], dizzy: ['0.0', '.0.', '0.0'], sleepy: ['...', '000'] },
      S: { open: ['0', '0'], wide: ['0', '0', '0'], shut: ['.', '0'], happy: ['0'], dizzy: ['0'], sleepy: ['.', '0'] },
      X: { open: ['0', '0'], wide: ['0', '0'], shut: ['.', '0'], happy: ['0'], dizzy: ['0'], sleepy: ['.', '0'] },
    },
    nocturne: {
      L: { open: ['.44.', '4444'], wide: ['.44.', '4444', '.44.'], shut: ['....', '4444'], happy: ['.44.', '4444'], dizzy: ['4.4.', '.44.'], sleepy: ['....', '4444'] },
      S: { open: ['44'], wide: ['44', '44'], shut: ['..', '44'], happy: ['44'], dizzy: ['4.4', '.4.'], sleepy: ['..', '44'] },
      X: { open: ['4'], wide: ['4', '4'], shut: ['.', '4'], happy: ['4'], dizzy: ['4'], sleepy: ['.', '4'] },
    },
    pip: {
      L: { open: ['000', '040', '000'], wide: ['000', '040', '040', '000'], shut: ['...', '000'], happy: ['.0.', '0.0'], dizzy: ['0.0', '.0.', '0.0'], sleepy: ['...', '000'] },
      S: { open: ['00', '40'], wide: ['00', '40', '00'], shut: ['..', '00'], happy: ['.0.', '0.0'], dizzy: ['0.0', '.0.'], sleepy: ['..', '00'] },
      X: { open: ['0', '0'], wide: ['0', '0', '0'], shut: ['.', '0'], happy: ['0'], dizzy: ['0'], sleepy: ['.', '0'] },
    },
    miko: {
      L: { open: ['0000', '0440', '0110', '.22.'], wide: ['0000', '0440', '0440', '0110'], shut: ['....', '0000'], happy: ['....', '.00.', '0..0'], dizzy: ['0..0', '.00.', '.00.'], sleepy: ['....', '0000'] },
      S: { open: ['000', '440', '000'], wide: ['000', '440', '440', '000'], shut: ['...', '000'], happy: ['.0.', '0.0'], dizzy: ['0.0', '.0.'], sleepy: ['...', '000'] },
      X: { open: ['0', '0'], wide: ['0', '0', '0'], shut: ['.', '0'], happy: ['0'], dizzy: ['0'], sleepy: ['.', '0'] },
    },
    cloud: {
      L: { open: ['000', '040', '000'], wide: ['000', '040', '040', '000'], shut: ['...', '000'], happy: ['.0.', '0.0'], dizzy: ['0.0', '.0.', '0.0'], sleepy: ['...', '000'] },
      S: { open: ['00', '40'], wide: ['00', '40', '00'], shut: ['..', '00'], happy: ['.0.', '0.0'], dizzy: ['0.0', '.0.'], sleepy: ['..', '00'] },
      X: { open: ['0', '0'], wide: ['0', '0', '0'], shut: ['.', '0'], happy: ['0'], dizzy: ['0'], sleepy: ['.', '0'] },
    },
  };
  // Mouths, centred: closed (a small smile), talk1, talk2 (open wider), shout, o, frown, grin, flat.
  const MOUTHS = {
    L: { closed: ['0..0', '.00.'], talk1: ['.00.', '.00.'], talk2: ['.00.', '0110', '0110', '.00.'], shout: ['.00.', '0110', '0110', '0110', '.00.'], o: ['.0.', '0.0', '.0.'], frown: ['.00.', '0..0'], grin: ['000000', '044440', '.0000.'], flat: ['000'] },
    S: { closed: ['0'], talk1: ['0', '0'], talk2: ['.0.', '000', '.0.'], shout: ['.0.', '000', '000', '.0.'], o: ['0'], frown: ['.0.', '0.0'], grin: ['0.0', '.0.'], flat: ['000'] },
    X: { closed: ['0'], talk1: ['0'], talk2: ['00'], shout: ['00'], o: ['0'], frown: ['0'], grin: ['00'], flat: ['0'] },
  };

  // A grid of levels around the figure. -1 is empty; fig marks the figure itself (outlined).
  const grid = (x0, y0, w, h) => ({ x0, y0, w, h, lv: new Int8Array(w * h).fill(-1), fig: new Uint8Array(w * h) });
  const at = (G, gx, gy) => { const x = gx - G.x0, y = gy - G.y0; return x < 0 || y < 0 || x >= G.w || y >= G.h ? -1 : y * G.w + x; };
  const set = (G, gx, gy, l, fig = 0) => { const i = at(G, gx, gy); if (i >= 0) { G.lv[i] = l; if (fig) G.fig[i] = 1; } };
  const get = (G, gx, gy) => { const i = at(G, gx, gy); return i < 0 ? -1 : G.lv[i]; };
  // Stamps rows of '0'-'4' ('.' leaves the cell) with their top-left at (gx, gy), or mirrored with their top-right there.
  const stamp = (G, rows, gx, gy, mirror = false) => rows.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) if (row[i] !== '.') set(G, mirror ? gx - i : gx + i, gy + j, +row[i]);
  });
  // Dark cells all round the figure: anything empty next to a figure cell (not along the faded bottom).
  function outline(G, ok) {
    const out = [];
    for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) {
      const i = y * G.w + x;
      if (G.lv[i] >= 0) continue;
      const n = (dx, dy) => { const xx = x + dx, yy = y + dy; return xx >= 0 && yy >= 0 && xx < G.w && yy < G.h && G.fig[yy * G.w + xx]; };
      if ((n(1, 0) || n(-1, 0) || n(0, 1) || n(0, -1)) && ok(G.y0 + y)) out.push(i);
    }
    for (const i of out) G.lv[i] = 0;
  }
  const flush = (k, G) => { for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) { const l = G.lv[y * G.w + x]; if (l >= 0) k.put(G.x0 + x, G.y0 + y, l); } };
  const spring = (st, want, k, c) => {
    const s = (st.swing ??= { x: 0, v: 0 }), dt = Math.min(0.05, st.dt ?? 0.016);
    s.v += ((want - s.x) * k - s.v * c) * dt; s.x += s.v * dt;
    return s.x;
  };

  const person = (who) => ({
    // Talking: the real voice when it's playing, else a made-up level while it talks.
    level(st) {
      if (st.mode === 'talk' && st.voice != null) return clamp(st.voice * 1.4, 0, 1);
      if (st.mode === 'talk') return clamp(0.5 + 0.5 * Math.sin(st.t * 13) * Math.abs(Math.sin(st.t * 3.1 + 1)), 0, 1);
      return 0;
    },
    // The body: cx, cy (cells) the body point, rad its radius in cells. k: { put, L, th }.
    body(k, cx, cy, rad, st) { flush(k, this.draw(k, Math.round(cx), Math.round(cy), st, rad >= 9 ? 'L' : 'S')); },
    // Pointer form: a pixel arrow tip at the hotspot (hx, hy), the head beside it.
    cursor(k, cx, cy, hx, hy, st) {
      const G = this.draw(k, cx + 2, cy + 2, st, 'X');
      const ARROW = ['4', '44', '444', '4444', '44', '.4'];
      ARROW.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] !== '.') set(G, hx + i, hy + j, 4, 1); });
      outline(G, () => true);
      flush(k, G);
    },

    draw(k, cx, cy, st, size) {
      const a = ART[who][size], t = st.t, lvl = this.level(st), A = st.act;
      // Body motion: a shake when upset, a droop asleep (the hop on hype is the kit's: by already has it, and a second
      // hop of our own at another rate made it stutter). Talking moves only the mouth, so the head and the speech
      // bubble beside it hold still while it speaks.
      const shake = A === 'upset' && st.actA % 0.9 < 0.32 ? Math.round(Math.sin(t * 48)) : 0;
      const droop = st.sleepy > 0.5 ? 1 : 0;
      const x0 = cx - a.cx + shake, y0 = cy - a.cy + droop;
      const G = grid(x0 - 3, y0 - 4, a.w + 6, a.rows.length + 8);
      // Swinging hair: against the way it moves, a little sway at rest, a toss on hype.
      const swing = spring(st, clamp(-(st.vx ?? 0) / 260, -2.5, 2.5) + Math.sin(t * 1.6) * 0.35 + (A === 'hype' ? Math.sin(st.actA * 6.5) * 1.2 : 0), 30, 6);
      const [tTop, tEnd] = a.tail ?? [0, 1];
      const fadeAt = a.rows.length - a.fade;
      a.rows.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) {
          const ch = row[i];
          if (ch === '.' || ch === ' ') continue;
          // The bottom rows dissolve, more each row, like a projection fading out.
          if (j >= fadeAt && (j - fadeAt + 1) / (a.fade + 1) > (size === 'L' ? k.th(x0 + i, y0 + j) : ((i + j) & 1 ? 0.3 : 0.65))) continue;
          let dx = 0;
          if (SWING.has(ch)) { const u = clamp((j - tTop) / (tEnd - tTop), 0, 1); dx = Math.round(swing * u * u); }
          set(G, x0 + i + dx, y0 + j, LV[ch], 1);
        }
      });
      const c = { G, a, x: x0 + a.cx, y: y0, st, t, size, lvl };
      this.face(c);
      this.extra(c);
      outline(G, (gy) => gy < y0 + fadeAt);
      return G;
    },

    face(c) {
      const { G, a, x, y, st, size, lvl } = c;
      const lx = Math.round(clamp(st.look[0], -1, 1) * (size === 'L' ? 1.2 : 0.6)), ly = Math.round(clamp(st.look[1], -1, 1) * (size === 'L' ? 0.8 : 0.4));
      const state = st.dizzy > 0.5 ? 'dizzy' : st.sleepy > 0.5 ? 'sleepy' : st.happy > 0.5 ? 'happy' : st.open < 0.35 ? 'shut' : st.wide > 0.5 ? 'wide' : 'open';
      const E = EYES[who][size][state];
      const ex = a.eye[0], ey = y + a.eye[1] + ly - (state === 'wide' ? 1 : 0);
      stamp(G, E, x + ex + lx, ey);
      stamp(G, E, x - ex + lx, ey, true);
      // Brows (where no hair covers them), from the agent's pose or the act.
      const brow = st.brow;
      if (size !== 'X' && (brow || who === 'nocturne' || who === 'blaze' || who === 'frost' || who === 'tushar')) {
        const by = ey - (size === 'L' ? 2 : 1) - (brow === 'raised' ? 1 : 0), bw = size === 'L' ? 4 : 2;
        for (const s of [1, -1]) for (let i = 0; i < bw; i++) {
          const bx = x + s * (ex + i) + lx;
          const yy = by + ((brow === 'angry' || brow === 'determined') && i === 0 ? 1 : brow === 'sad' && i === bw - 1 ? 1 : 0);
          if (get(G, bx, yy) < 2) continue;
          set(G, bx, yy, who === 'nocturne' || who === 'blaze' || who === 'frost' || who === 'tushar' ? 1 : 2 - (brow ? 1 : 0));
        }
      }
      // Blush: always for the anime girl, when happy for Sarah.
      if (a.blush && (who === 'miko' || st.happy > 0.5)) for (const s of [1, -1]) {
        const bx = x + s * a.blush[0] + lx, by = y + a.blush[1] + ly;
        if (size === 'L') { set(G, bx, by, 2); set(G, bx - s, by, 2); } else set(G, bx, by, 2);
      }
      // Mouth: from the voice while it talks, else the pose or act.
      let mouth = st.mouth;
      if (st.mode === 'talk') mouth = lvl > 0.62 ? 'talk2' : lvl > 0.22 ? 'talk1' : 'closed';
      if (!mouth || !MOUTHS[size][mouth]) mouth = st.happy > 0.5 ? 'grin' : 'closed';
      if (st.sleepy > 0.5) mouth = size === 'L' ? 'o' : 'flat';
      const M = a.mouths?.[mouth] ?? MOUTHS[size][mouth];
      stamp(G, M, x + lx - Math.floor((M[0].length - 1) / 2), y + a.mouth + Math.max(0, ly));
    },

    extra(c) {
      const { G, a, x, y, st, t, size } = c;
      for (const [j, i, str, both] of a.over ?? []) for (let n = 0; n < str.length; n++) {
        set(G, x - a.cx + i + n, y + j, +str[n]);
        if (both) set(G, x + a.cx - i - n, y + j, +str[n]);
      }
      // The fighters and the guardian keep a permanent brow, drawn after the face so the eyes stay clear.
      // A stud or an earring, on the side its hair is tucked.
      if (a.earring) { set(G, x + a.earring[0], y + a.earring[1], 4); }
      // The anime girl sparkles when she's thrilled.
      if ((who === 'miko' || who === 'blaze') && size !== 'X' && (st.act === 'hype' || st.happy > 0.5)) {
        for (let i = 0; i < 3; i++) {
          if (Math.sin(t * 7 + i * 2) < -0.2) continue;
          const ang = i * 2.1 + t * 1.3, d = size === 'L' ? 15 : 9;
          const sx = Math.round(x + Math.cos(ang) * d), sy = Math.round(y + a.cy - 4 + Math.sin(ang) * d * 0.7);
          if (size === 'L') stamp(G, ['.4.', '444', '.4.'], sx - 1, sy - 1); else set(G, sx, sy, 4);
        }
      }
      // Asleep: a small z rising beside the head.
      if (st.sleepy > 0.5 && size !== 'X') {
        const zx = x + (size === 'L' ? 12 : 7), zy = y + (size === 'L' ? 2 : 0) - (Math.floor(t * 1.5) % 2);
        stamp(G, size === 'L' ? ['444', '..4', '.4.', '4..', '444'] : ['44', '.4', '44'], zx, zy);
      }
    },
  });

  R.people = { nocturne: person('nocturne'), pip: person('pip'), miko: person('miko'),
    cloud: person('cloud'), tushar: person('tushar') };
})();
