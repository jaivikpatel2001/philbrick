# Hero environment (HDRI) — the realism unlock

Real-time metal looks "real" when it reflects a real lit room. Dropping an
interior **HDRI** here makes the elevator's steel, glass and brushed metal reflect a
believable environment instead of the generic studio default — the single
biggest step toward the photographic look.

## Steps

1. Download a free **indoor / lobby HDRI** (CC0):
   - [Poly Haven → Indoor HDRIs](https://polyhaven.com/hdris/indoor) (grab the **2K** `.hdr`)
   - [ambientCG → HDRIs](https://ambientcg.com)
   Good picks: a hotel lobby, modern interior, or studio with soft windows.

2. Save it here as: `frontend/public/hdri/lobby.hdr`

3. Enable it in `frontend/data/environment.ts`:
   ```ts
   export const ENV = {
     hdri: "/hdri/lobby.hdr",
     intensity: 1.25,   // raise/lower reflection + ambient strength
     background: false, // true = also show the HDRI as the backdrop
   };
   ```

4. Reload `/`. Every metal/glass surface now reflects the real environment.

## Notes
- 2K is plenty for reflections and keeps the page light; 4K only if you set
  `background: true` and want a crisp backdrop.
- `intensity` is your main dial — bump it up for brighter, more reflective metal.
- This pairs with the soft area lights already in the scene; together they give
  the even, photographic illumination real product shots have.
- Want even closer to photoreal? Add real **PBR texture maps** (brushed-steel and
  marble: albedo + roughness + normal + metalness) — ask and I'll wire the
  `TextureLoader` path next.
