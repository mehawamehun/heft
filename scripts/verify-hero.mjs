/**
 * Verifies the hero carousel on DESKTOP (1600×1000) and MOBILE (390×844):
 * visibility, explicit heights, peek mode, real-time drag, snap/spring-back,
 * directional glide, infinite loop and scale sync.
 * Run: node scripts/verify-hero.mjs
 */
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const BROWSERS = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const URL = "http://localhost:3000/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!cond) failures++;
};

const browser = await puppeteer.launch({
  executablePath: BROWSERS.find((p) => existsSync(p)),
  headless: "new",
});
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
page.on("pageerror", (e) => console.log("PAGE EXCEPTION:", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE ERROR:", m.text()); });
await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });

// ── shared helpers ──
const stageInfo = () =>
  page.evaluate(() => {
    const el = document.querySelector('[data-testid="hero-stage"]');
    const r = el.getBoundingClientRect();
    return { w: el.clientWidth, h: r.height, top: r.top, bottom: r.bottom };
  });

const txOf = (slug) =>
  page.evaluate((s) => {
    const el = document.querySelector(`.hero-slide[data-look="${s}"]`);
    if (!el) return null;
    return new DOMMatrixReadOnly(getComputedStyle(el).transform).e;
  }, slug);

const slideStat = (slug) =>
  page.evaluate((s) => {
    const el = document.querySelector(`.hero-slide[data-look="${s}"]`);
    if (!el) return null;
    const img = el.querySelector(".hero-character-img");
    const ir = img.getBoundingClientRect();
    return {
      opacity: parseFloat(getComputedStyle(el).opacity),
      width: el.getBoundingClientRect().width,
      tx: new DOMMatrixReadOnly(getComputedStyle(el).transform).e,
      imgScale: new DOMMatrixReadOnly(getComputedStyle(img).transform).a,
      imgH: ir.height,
      imgLoaded: img.complete && img.naturalWidth > 0,
      right: el.getBoundingClientRect().right,
    };
  }, slug);

const centerSlug = () =>
  page.evaluate(() => document.querySelector('.hero-slide[data-center="true"]')?.getAttribute("data-look"));

async function glideTrace(slug, step = 45, total = 850) {
  const out = [];
  for (let t = 0; t <= total; t += step) {
    out.push({ t, tx: await txOf(slug) });
    await sleep(step);
  }
  return out;
}

/* ════════════════════════ DESKTOP 1600×1000 ════════════════════════ */
console.log("\n── DESKTOP 1600×1000 ──");
await page.setViewport({ width: 1600, height: 1000 });
await sleep(900);

const st = await stageInfo();
ok("desktop: stage explicit height ≥ 580px", st.h >= 580, `h=${st.h.toFixed(0)}px`);
const stGeo = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="hero-stage"]');
  return { cw: el.clientWidth };
});
const slot = stGeo.cw / 5.1;
ok("desktop: charcoal centred", (await centerSlug()) === "charcoal-fleece-hoodie");
const rest = await slideStat("charcoal-fleece-hoodie");
ok("desktop: centre tx = −slot/2", Math.abs(rest.tx + slot / 2) < 2, `tx=${rest.tx.toFixed(1)} expect=${(-slot / 2).toFixed(1)}`);
ok("desktop: centre img loaded & tall", rest.imgLoaded && rest.imgH > 300, `imgH=${rest.imgH.toFixed(0)}px`);
ok("desktop: centre scale = 1.12", Math.abs(rest.imgScale - 1.12) < 0.005, rest.imgScale.toFixed(3));

const side1 = await slideStat("olive-field-jacket");
ok("desktop: side scale = 0.92", Math.abs(side1.imgScale - 0.92) < 0.005, side1.imgScale.toFixed(3));
ok("desktop: side dimmed but visible", side1.opacity > 0.6 && side1.opacity < 1, side1.opacity.toFixed(2));

// forward glide
await page.click('.hero-arrow--right');
const fwd = await glideTrace("olive-field-jacket");
const f0 = fwd[0].tx, fE = fwd[fwd.length - 1].tx;
ok("desktop: next glides exactly one slot", Math.abs(f0 - slot / 2) < 20 && Math.abs(fE + slot / 2) < 2 && Math.abs(fE - f0) > slot * 0.8, `travel=${Math.abs(fE - f0).toFixed(1)}px slot=${slot.toFixed(0)}px`);
const fmid = fwd.filter((s) => s.tx !== null);
const fStep = Math.max(...fmid.slice(1).map((s, i) => Math.abs(s.tx - fmid[i].tx)));
ok("desktop: no teleport", fStep < slot * 0.5, `maxStep=${fStep.toFixed(1)}px`);

// full clockwise wrap
const order = ["black-fleece-hoodie", "cream-sweatshirt", "black-cropped-bomber", "striped-long-sleeve", "stone-sherpa-fleece", "sherpa-and-denim", "charcoal-fleece-hoodie"];
let wrapOK = true;
for (const exp of order) {
  await page.click('.hero-arrow--right');
  await sleep(680);
  if ((await centerSlug()) !== exp) wrapOK = false;
}
ok("desktop: full 8-step clockwise loop, correct order", wrapOK);
ok("desktop: no reset after wrap", Math.abs((await txOf("charcoal-fleece-hoodie")) + slot / 2) < 2);

// anticlockwise
await page.click('.hero-arrow--left');
const back = await glideTrace("sherpa-and-denim");
const b0 = back[0].tx, bE = back[back.length - 1].tx;
ok("desktop: prev glides rightward one slot", Math.abs(b0 + slot / 2 + slot) < 20 && Math.abs(bE + slot / 2) < 2 && (bE - b0) > slot * 0.8, `travel=${(bE - b0).toFixed(1)}px`);

// click +2 side character
await page.click('.hero-slide[data-look="olive-field-jacket"]'); // sherpa centre → olive is +2 right
const cg = await glideTrace("olive-field-jacket");
ok("desktop: click +2 char glides 2 slots to centre", Math.abs(cg[cg.length - 1].tx + slot / 2) < 2 && Math.abs(cg[0].tx - (-slot / 2 + 2 * slot)) < 25, `tx0=${cg[0].tx.toFixed(1)} expect=${(-slot / 2 + 2 * slot).toFixed(1)} travel=${Math.abs(cg[cg.length - 1].tx - cg[0].tx).toFixed(1)}px`);
ok("desktop: clicked char becomes centre", (await centerSlug()) === "olive-field-jacket");

/* ════════════════════════ MOBILE 390×844 ════════════════════════ */
console.log("\n── MOBILE 390×844 ──");
await page.setViewport({ width: 390, height: 844 });
await sleep(900);
// Reset to the first look so mobile checks start from a known state.
await page.click('[role="tablist"] button[aria-label="Go to Charcoal Fleece Hoodie"]');
await sleep(750);
ok("mobile: charcoal centred", (await centerSlug()) === "charcoal-fleece-hoodie");

const mst = await stageInfo();
ok("mobile: stage explicit height 420–520px", mst.h >= 420 && mst.h <= 521, `h=${mst.h.toFixed(0)}px`);

const mGeo = await page.evaluate(() => document.querySelector('[data-testid="hero-stage"]').clientWidth);
const centerW = mGeo * 0.68;
const stepM = mGeo * 0.48; // 0.34 + 0.12 + 0.02
const mc = await slideStat("charcoal-fleece-hoodie");
ok("mobile: centre slot = 68% of container", Math.abs(mc.width - centerW) < 4, `w=${mc.width.toFixed(0)}px expect≈${centerW.toFixed(0)}px`);
ok("mobile: centre tx = −centreW/2 (on-screen centre)", Math.abs(mc.tx + centerW / 2) < 2, `tx=${mc.tx.toFixed(1)}`);
ok("mobile: centre visible, opacity 1", mc.opacity === 1 && mc.imgLoaded, `op=${mc.opacity}`);
ok("mobile: centre img tall (head-to-toe above bar)", mc.imgH > 240, `imgH=${mc.imgH.toFixed(0)}px`);
ok("mobile: centre scale = 1.12", Math.abs(mc.imgScale - 1.12) < 0.005, mc.imgScale.toFixed(3));

const peek = await slideStat("olive-field-jacket");
const cont = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="hero-stage"]');
  const r = el.getBoundingClientRect();
  return { right: r.right, left: r.left };
});
ok("mobile: right peek opacity 0.75", Math.abs(peek.opacity - 0.75) < 0.02, peek.opacity.toFixed(2));
ok("mobile: right peek scale 0.82", Math.abs(peek.imgScale - 0.82) < 0.005, peek.imgScale.toFixed(3));
ok("mobile: right peek partially clipped at edge", peek.right > cont.right - 1, `right=${peek.right?.toFixed(0)} edge=${cont.right?.toFixed(0)}`);
ok("mobile: peek img loaded", peek.imgLoaded && peek.imgH > 60, `imgH=${peek.imgH.toFixed(0)}px`);

// ── REAL-TIME DRAG on mobile ──
const grab = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="hero-stage"]');
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height * 0.55 };
});
const baseTx = mc.tx;
await page.mouse.move(grab.x, grab.y);
await page.mouse.down();
await page.mouse.move(grab.x - 50, grab.y, { steps: 4 });
await sleep(60);
const d1 = await txOf("charcoal-fleece-hoodie");
await page.mouse.move(grab.x - 110, grab.y, { steps: 4 });
await sleep(60);
const d2 = await txOf("charcoal-fleece-hoodie");
await page.mouse.up();
ok("mobile: row follows finger in real time (step 1 ≈ −50px)", Math.abs(d1 - (baseTx - 50)) < 15, `Δ=${(d1 - baseTx).toFixed(1)}px`);
ok("mobile: row follows finger in real time (step 2 ≈ −110px)", Math.abs(d2 - (baseTx - 110)) < 15, `Δ=${(d2 - baseTx).toFixed(1)}px`);
await sleep(750);
ok("mobile: release past 40px snaps to NEXT (olive centred)", (await centerSlug()) === "olive-field-jacket");

// spring-back: short drag must NOT change the centre
const oliveTx = await txOf("olive-field-jacket");
await page.mouse.move(grab.x, grab.y);
await page.mouse.down();
await page.mouse.move(grab.x + 25, grab.y, { steps: 3 });
await sleep(40);
await page.mouse.up();
await sleep(700);
ok("mobile: short drag springs back (centre unchanged)", (await centerSlug()) === "olive-field-jacket" && Math.abs((await txOf("olive-field-jacket")) + centerW / 2) < 2);

// drag right → previous
await page.mouse.move(grab.x, grab.y);
await page.mouse.down();
await page.mouse.move(grab.x + 130, grab.y, { steps: 6 });
await sleep(40);
await page.mouse.up();
await sleep(750);
ok("mobile: drag right snaps to PREVIOUS (charcoal centred)", (await centerSlug()) === "charcoal-fleece-hoodie");

// arrows still work on mobile
await page.click('.hero-arrow--right');
await sleep(700);
ok("mobile: right arrow still slides", (await centerSlug()) === "olive-field-jacket");

// dots
await page.click('[role="tablist"] button[aria-label="Go to Black Cropped Bomber"]');
await sleep(750);
ok("mobile: dot jump works", (await centerSlug()) === "black-cropped-bomber");

// screenshots for visual confirmation
await page.screenshot({ path: "verify-mobile.png" });
await page.setViewport({ width: 1600, height: 1000 });
await sleep(800);
await page.screenshot({ path: "verify-desktop.png" });

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
