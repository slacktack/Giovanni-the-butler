// The chosen sidekick: the LED matrix dither blob, without the drips, with the agent layer on top.
Roamie.register(Roamie.ditherKit({
  id: 'sidekick', label: 'Sidekick', matrix: true, pixel: 1.3, glow: 0.12, speed: 80,
  pal: [[17, 17, 17], [10, 94, 44], [22, 150, 66], [43, 217, 74], [178, 245, 190]],
  plugin: (kit) => Roamie.agentPlugin?.(kit) ?? null,
}));
