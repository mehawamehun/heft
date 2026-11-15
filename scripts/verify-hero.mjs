/**
 * Verifies the hero carousel glides directionally in a real browser.
 * Slide geometry: a slide at circular offset d sits at
 *   tx = -slot/2 + d*slot   (left:50% + centring offset)
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
await page.setViewport({ width: 1600, height: 1000 });
// Some environments (and some users' OS settings) report reduced motion,
// which zeroes transitions — emulate the default so we test the real design.
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
page.on("pageerror", (e) => console.log("PAGE EXCEPTION:", e.message));
page.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE ERROR:", m.text()); });

await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
await sleep(1200);

const reduced = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
ok("environment: transitions enabled", !reduced, `reduced=${reduced}`);

const txOf = (slug) =>
  page.evaluate((s) => {
    const el = document.querySelector(`.hero-slide[data-look="${s}"]`);
    if (!el) return null;
    return new DOMMatrixReadOnly(getComputedStyle(el).transform).e;
  }, slug);

const centerSlug = () =>
  page.evaluate(() => document.querySelector('.hero-slide[data-center="true"]')?.getAttribute("data-look"));

const imgScale = (slug) =>
  page.evaluate((s) => {
    const el = document.querySelector(`.hero-slide[data-look="${s}"] .hero-character-img`);
    return new DOMMatrixReadOnly(getComputedStyle(el).transform).a;
  }, slug);

async function glideTrace(slug, step = 45, total = 850) {
  const samples = [];
  for (let t = 0; t <= total; t += step) {
    samples.push({ t, tx: await txOf(slug) });
    await sleep(step);
  }
  return samples;
}

const slot = await page.evaluate(() => document.querySelector(".hero-slide").getBoundingClientRect().width);
console.log(`slot width: ${slot.toFixed(1)}px`);

// ── 1. rest state ──
ok("rest: charcoal centred", (await centerSlug()) === "charcoal-fleece-hoodie");
const restTx = await txOf("charcoal-fleece-hoodie");
ok("rest: centre tx = −slot/2 (centred on stage)", Math.abs(restTx + slot / 2) < 1.5, `tx=${restTx?.toFixed(1)} expect=${(-slot / 2).toFixed(1)}`);

// ── 2. forward glide (next): olive travels +1 slot → centre ──
await page.click('.hero-arrow--right');
const fwd = await glideTrace("olive-field-jacket");
const f0 = fwd[0].tx, fE = fwd[fwd.length - 1].tx;
ok("next: olive starts ≈ centre+slot (+144)", Math.abs(f0 - (slot / 2)) < 25, `tx0=${f0.toFixed(1)} expect≈${(slot / 2).toFixed(1)}`);
ok("next: olive ends centred (−144)", Math.abs(fE + slot / 2) < 1.5, `txEnd=${fE.toFixed(1)}`);
const fmid = fwd.filter((s) => s.tx !== null);
const fStep = Math.max(...fmid.slice(1).map((s, i) => Math.abs(s.tx - fmid[i].tx)));
const fTravel = Math.abs(f0 - fE);
ok("next: continuous glide, no teleport", fStep < slot * 0.5 && fTravel > slot * 0.75, `maxStep=${fStep.toFixed(1)}px travel=${fTravel.toFixed(1)}px`);
ok("next: outgoing centre lands one slot left", Math.abs((await txOf("charcoal-fleece-hoodie")) + slot / 2 + slot) < 2);

// ── 3. full clockwise wrap (7 more nexts) — order + zero reset ──
const expected = ["black-fleece-hoodie", "cream-sweatshirt", "black-cropped-bomber", "striped-long-sleeve", "stone-sherpa-fleece", "sherpa-and-denim", "charcoal-fleece-hoodie"];
let wrapOK = true;
for (const [i, exp] of expected.entries()) {
  await page.click('.hero-arrow--right');
  await sleep(700);
  const c = await centerSlug();
  if (c !== exp) { wrapOK = false; console.log(`  step ${i + 2}: expected ${exp}, got ${c}`); }
}
ok("clockwise: full 8-step loop, correct order", wrapOK);
const afterWrap = await txOf("charcoal-fleece-hoodie");
ok("loop: no reset after wrap — centre sits exactly on stage", Math.abs(afterWrap + slot / 2) < 1.5, `tx=${afterWrap?.toFixed(1)}`);

// ── 4. anticlockwise (prev): sherpa enters from the LEFT and glides right ──
await page.click('.hero-arrow--left');
const back = await glideTrace("sherpa-and-denim");
const b0 = back[0].tx, bE = back[back.length - 1].tx;
ok("prev: re-entrant starts ≈ centre−slot (−432)", Math.abs(b0 + slot / 2 + slot) < 25, `tx0=${b0.toFixed(1)}`);
ok("prev: ends centred", Math.abs(bE + slot / 2) < 1.5, `txEnd=${bE.toFixed(1)}`);
const bmid = back.filter((s) => s.tx !== null);
const bStep = Math.max(...bmid.slice(1).map((s, i) => Math.abs(s.tx - bmid[i].tx)));
ok("prev: continuous glide rightward", bStep < slot * 0.5 && (bE - b0) > slot * 0.75, `maxStep=${bStep.toFixed(1)}px travel=${(bE - b0).toFixed(1)}px`);
ok("prev: centre is now sherpa-and-denim", (await centerSlug()) === "sherpa-and-denim");

// ── 5. click the +2 side character → it glides to centre ──
// centre is sherpa (logical 7); the +2 right character is olive (logical 1)
await page.click('.hero-slide[data-look="olive-field-jacket"]');
const clickGlide = await glideTrace("olive-field-jacket");
const g0 = clickGlide[0].tx, gE = clickGlide[clickGlide.length - 1].tx;
ok("click +2 char: starts ≈ centre+2slots (+432)", Math.abs(g0 - (-slot / 2 + 2 * slot)) < 25, `tx0=${g0.toFixed(1)} expect≈${(-slot / 2 + 2 * slot).toFixed(1)}`);
ok("click +2 char: glides to centre", Math.abs(gE + slot / 2) < 1.5, `txEnd=${gE.toFixed(1)}`);
const gmid = clickGlide.filter((s) => s.tx !== null);
const gStep = Math.max(...gmid.slice(1).map((s, i) => Math.abs(s.tx - gmid[i].tx)));
// a 2-slot ease-out jump moves fast early: ~40% of 576px within the first
// sample is correct curve behaviour — a teleport would be one ~576px step.
ok("click +2 char: continuous 2-slot travel", gStep < slot * 0.9 && Math.abs(g0 - gE) > 2 * slot * 0.75, `maxStep=${gStep.toFixed(1)}px travel=${Math.abs(g0 - gE).toFixed(1)}px`);
ok("click +2 char: becomes centre", (await centerSlug()) === "olive-field-jacket");

// ── 6. synchronized scale ──
await sleep(700);
const sc = await imgScale("olive-field-jacket");
ok("scale: centre img = 1.15", Math.abs(sc - 1.15) < 0.005, sc.toFixed(3));
const side = await page.evaluate(() => {
  const el = [...document.querySelectorAll(".hero-slide")].find(
    (s) => s.getAttribute("data-center") !== "true" && parseFloat(getComputedStyle(s).opacity) > 0.5,
  );
  return new DOMMatrixReadOnly(getComputedStyle(el.querySelector(".hero-character-img")).transform).a;
});
ok("scale: side img = 1", Math.abs(side - 1) < 0.005, side.toFixed(3));

// ── screenshots ──
await page.screenshot({ path: "verify-centre.png" });
await page.click('.hero-arrow--right');
await sleep(260);
await page.screenshot({ path: "verify-midflight.png" });
await sleep(650);
await page.screenshot({ path: "verify-after.png" });

await browser.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
