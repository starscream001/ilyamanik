# Business bots design lab

Three independent prototypes with common factual content, plus a comparison index:

- `/bots-lab/editorial/`: Editorial Grid / Magazine, large typography and tactile photographic metaphor.
- `/bots-lab/product/`: Minimalism & Swiss Style, interface-first demonstration and visible request pipeline.
- `/bots-lab/atmosphere/`: cinematic storytelling, dark photographic scene and restrained entrance motion with reduced-motion fallback.

UI UX Pro Max is the sole design skill used for these concepts. See root AGENTS.md. Search outputs were treated as suggestions: the unrelated 3D product preview match was rejected and narrowed to minimalism software interface. Brand, typography and content choices are deliberate project overrides.

These are test pages (`noindex,follow`). Existing main-site design is retained. Its business-bots card links to the comparison index. No lead form, analytics, real bookings or real bot API are present. Demo scenarios run entirely in the browser. Contact links go to Ilya's existing contacts/Telegram.

`python3 bots-lab/tools/build.py` rebuilds the four HTML files. Edit CSS and JS directly. Bump asset versions in build.py after publishing CSS/JS changes. Original generated images remain preserved; project assets are optimized WebP copies (120KB and 178KB).

## Image provenance

Created with the built-in imagegen tool for these prototypes. They are conceptual illustrations, not photos of completed client projects. No third-party media was copied.

- `assets/order.webp`: premium editorial photographic still life: a vivid scarlet telephone coiled cord on a warm off-white paper desk, disordered blank request cards at left and three precisely aligned stacks with black binder clips at right, chrome stapler and a cropped hand aligning the last stack. Directional afternoon sunlight, tactile paper, subtle photographic grain. No lettering, logos, robots, neural networks, floating screens or fake UI.
- `assets/flow.webp`: photographic sculptural installation: vivid vermilion red thread passes through six brushed-aluminum gates on a charcoal stone table, one small paper envelope at the beginning, directional studio light, dark atmosphere, tactile materials, architectural precision, negative space for typography. No lettering, logos, robots, neon or fake UI.

## Validation

Check 375/768/1024/1440 CSS px, all local links and anchors, demo tabs with pointer and keyboard, step progression/reset, FAQ disclosures, contact navigation, loaded assets, and console errors. Reduced motion uses a CSS override and all content remains available without animations. Without JavaScript the sample first exchange remains visible.
