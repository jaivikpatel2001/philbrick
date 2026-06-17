# Optional GLTF elevator model — maximum realism

The hero ships with a high-quality **procedural** Three.js elevator. For
photoreal fidelity you can drop in a real 3D model and the scene will use it
automatically (same lighting rig, reflections, scroll camera).

## Steps

1. **Get a model** (`.glb` preferred — single self-contained file):
   - Free CC0: [Poly Pizza](https://poly.pizza), [Sketchfab](https://sketchfab.com) (filter "Downloadable" + CC0/CC-BY).
   - Paid/high-end: CGTrader, TurboSquid (look for "PBR", "glTF", "real-time/low-poly" — a few hundred k triangles max for web).
   - Prefer **non-Draco-compressed** glb (Draco needs an extra decoder I can wire on request).

2. **Drop it in** here as: `frontend/public/models/elevator.glb`

3. **Enable it** in `frontend/data/model.ts`:
   ```ts
   export const MODEL = {
     enabled: true,
     url: "/models/elevator.glb",
     targetHeight: 3.0,   // auto-scales the model to ~3 world units tall
     scale: 1,            // nudge if it looks too big/small
     yOffset: 0,          // nudge vertically after centering
   };
   ```

4. Reload the homepage `/`. The model is auto-centered, auto-scaled,
   shadow-enabled and lit by the studio environment. The scroll still drives the
   camera move and a slow rotation.

## Notes / what I'll tune with the real asset

- **Explode + door-open choreography** is authored for the procedural parts. A
  generic model won't have those named parts, so in model-mode the camera move +
  rotation tell the story. If your model has cleanly named nodes (e.g. `doorL`,
  `doorR`, `cabin`, `counterweight`), tell me and I'll wire the explode/doors to
  them.
- Keep the file reasonable for web (ideally < ~15 MB, < ~300k triangles).
- If it loads off-center / wrong scale / wrong orientation, give me the file and
  I'll dial in `scale` / `yOffset` / rotation precisely.
