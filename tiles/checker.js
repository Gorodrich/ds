/*
 * 個人開発領マップ 事前セルフチェックツール（ブラウザ完結版）
 *
 * 運営が配布している個人開発領マップ自動処理ツール（Python/Pillow版, main.py）と
 * 同じバリデーションロジックをJavaScriptに移植したもの。
 * 画像はサーバーに送信せず、すべてブラウザ内（Canvas API）で処理する。
 *
 * 条件①: PNG形式として読み込めること
 * 条件②: 5000x5000pxであること
 * 条件③: アルファ値が0または255のみであること（中間値なし）
 * 条件④: 合成後クロップ領域内の不透明ピクセル数が上限以下であること
 */

const ZONE_SIZE = 5000;
const MAX_AREA = 250000;
const OVERLAY_COLOR = [255, 0, 255];
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// --- ゾーン座標テーブル（要件定義書3章と同一） ---------------------------

const _COLS = { 1: -10000, 2: -5000, 3: 0, 4: 5000 };
const _ROWS = { 1: -10000, 2: -5000, 3: 0, 4: 5000 };

function buildZoneTable() {
  const zones = {};
  let n = 1;
  for (const row of [1, 2, 3, 4]) {
    for (const col of [1, 2, 3, 4]) {
      zones[String(n).padStart(2, "0")] = [_COLS[col], _ROWS[row]];
      n++;
    }
  }
  return zones;
}
const ZONES = buildZoneTable();

// --- ファイル名解析（要件定義書7章と同一） --------------------------------

function parseFilename(filename) {
  if (!filename.toLowerCase().endsWith(".png")) {
    return { error: "拡張子が.pngではありません" };
  }
  const stem = filename.slice(0, -4);
  const idx = stem.indexOf("_");
  if (idx === -1) {
    return {
      error:
        "ファイル名の形式が不正です（{2桁数字}_{プレイヤー名}.png ではありません）",
    };
  }
  const zonePart = stem.slice(0, idx);
  const playerPart = stem.slice(idx + 1);
  if (!/^\d{2}$/.test(zonePart)) {
    return { error: "ゾーン番号が2桁数字ではありません" };
  }
  if (!(zonePart in ZONES)) {
    return { error: `ゾーン番号が範囲外です（01〜16以外: ${zonePart}）` };
  }
  if (!playerPart) {
    return { error: "プレイヤー名が空です" };
  }
  return { zone: zonePart, player: playerPart };
}

async function isPngSignature(file) {
  const buf = await file.slice(0, 8).arrayBuffer();
  const bytes = new Uint8Array(buf);
  return PNG_SIGNATURE.every((b, i) => bytes[i] === b);
}

// --- ファイル単位バリデーション（条件①②③） -------------------------------

async function checkFile(file) {
  const filename = file.name;
  const errors = [];

  const validSig = await isPngSignature(file);
  if (!validSig) {
    errors.push("条件①不合格（PNG形式として読み込めませんでした）");
    errors.push("条件②不合格（判定不可: 画像を読み込めなかったため）");
    errors.push("条件③不合格（判定不可: 画像を読み込めなかったため）");
    return { filename, ok: false, errors, imageData: null };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (e) {
    errors.push(`条件①不合格（画像として読み込めません: ${e}）`);
    errors.push("条件②不合格（判定不可: 画像を読み込めなかったため）");
    errors.push("条件③不合格（判定不可: 画像を読み込めなかったため）");
    return { filename, ok: false, errors, imageData: null };
  }

  const w = bitmap.width;
  const h = bitmap.height;
  if (w !== ZONE_SIZE || h !== ZONE_SIZE) {
    errors.push(
      `条件②不合格（サイズが5000x5000ではありません。実際: ${w}x${h}）`
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  let midCount = 0;
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    if (a !== 0 && a !== 255) midCount++;
  }
  if (midCount > 0) {
    errors.push(
      `条件③不合格（アルファ値に中間値が${midCount}ピクセル存在します）`
    );
  }

  const ok = errors.length === 0;
  return {
    filename,
    ok,
    errors,
    imageData: ok ? imageData : null,
    width: w,
    height: h,
  };
}

// --- 合成キャンバス作成（要件定義書5.2章と同一） ---------------------------

function buildComposite(zoneEntries) {
  const xMins = [], zMins = [], xMaxs = [], zMaxs = [];
  for (const e of zoneEntries) {
    const [zx, zz] = ZONES[e.zone];
    xMins.push(zx);
    zMins.push(zz);
    xMaxs.push(zx + ZONE_SIZE);
    zMaxs.push(zz + ZONE_SIZE);
  }
  const cxMin = Math.min(...xMins);
  const czMin = Math.min(...zMins);
  const cxMax = Math.max(...xMaxs);
  const czMax = Math.max(...zMaxs);
  const cw = cxMax - cxMin;
  const ch = czMax - czMin;

  if (zoneEntries.length === 1) {
    const only = zoneEntries[0];
    return {
      data: only.imageData.data,
      width: only.imageData.width,
      height: only.imageData.height,
      cxMin,
      czMin,
    };
  }

  const composite = new Uint8ClampedArray(cw * ch * 4);
  for (const e of zoneEntries) {
    const [zx, zz] = ZONES[e.zone];
    const offX = zx - cxMin;
    const offY = zz - czMin;
    const src = e.imageData.data;
    const sw = e.imageData.width;
    const sh = e.imageData.height;
    for (let y = 0; y < sh; y++) {
      const srcRowStart = y * sw * 4;
      const dstRowStart = ((y + offY) * cw + offX) * 4;
      composite.set(
        src.subarray(srcRowStart, srcRowStart + sw * 4),
        dstRowStart
      );
    }
  }
  return { data: composite, width: cw, height: ch, cxMin, czMin };
}

// bbox(不透明領域の外接矩形)と面積(不透明ピクセル数)を1パスで算出
function computeBboxAndArea(data, w, h) {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  let area = 0;
  for (let y = 0; y < h; y++) {
    let rowHasOpaque = false;
    const rowStart = y * w * 4;
    for (let x = 0; x < w; x++) {
      const a = data[rowStart + x * 4 + 3];
      if (a === 255) {
        area++;
        rowHasOpaque = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
      }
    }
    if (rowHasOpaque) {
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX === -1) return null;
  return { left: minX, upper: minY, right: maxX + 1, lower: maxY + 1, area };
}

// --- プレイヤー単位の処理 ---------------------------------------------------

async function processPlayer(player, entries) {
  const fileResults = [];
  for (const e of entries) {
    const r = await checkFile(e.file);
    fileResults.push({ ...r, zone: e.zone });
  }

  const files = entries.map((e) => e.file.name);
  const zones = [...new Set(entries.map((e) => e.zone))].sort();

  const fileErrors = [];
  for (const fr of fileResults) {
    for (const err of fr.errors) fileErrors.push(`${fr.filename}: ${err}`);
  }
  if (fileErrors.length > 0) {
    return { player, files, zones, status: "validation_ng", reasons: fileErrors };
  }

  const zoneEntries = fileResults.map((fr) => ({
    zone: fr.zone,
    imageData: fr.imageData,
  }));
  const composite = buildComposite(zoneEntries);
  const bboxResult = computeBboxAndArea(
    composite.data,
    composite.width,
    composite.height
  );

  if (!bboxResult) {
    return {
      player,
      files,
      zones,
      status: "no_opaque_pixels",
      reasons: ["不透明ピクセルが1つも存在しません"],
    };
  }

  const { left, upper, right, lower, area } = bboxResult;

  if (area > MAX_AREA) {
    return {
      player,
      files,
      zones,
      status: "validation_ng",
      reasons: [
        `条件④不合格（申請面積が${area.toLocaleString()}ブロックで、上限${MAX_AREA.toLocaleString()}ブロックを超えています）`,
      ],
    };
  }

  const pxMin = left, pyMin = upper, pxMax = right - 1, pyMax = lower - 1;
  const loc1x = composite.cxMin + pxMin;
  const loc1z = composite.czMin + pyMin;
  const loc2x = composite.cxMin + pxMax + 1;
  const loc2z = composite.czMin + pyMax + 1;
  const croppedW = right - left;
  const croppedH = lower - upper;

  return {
    player,
    files,
    zones,
    status: "success",
    croppedSize: `${croppedW}x${croppedH}`,
    area: area.toLocaleString(),
    loc1: `(${loc1x}, 64, ${loc1z})`,
    loc2: `(${loc2x}, 64, ${loc2z})`,
    cropInfo: {
      data: composite.data,
      width: composite.width,
      left,
      upper,
      right,
      lower,
    },
  };
}

// --- 画面表示 ---------------------------------------------------------------

const fileInput = document.getElementById("file-input");
const checkButton = document.getElementById("check-button");
const selectedCount = document.getElementById("selected-count");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");

fileInput.addEventListener("change", () => {
  const n = fileInput.files.length;
  selectedCount.textContent = n > 0 ? `${n}件選択中` : "";
  checkButton.disabled = n === 0;
  resultsEl.innerHTML = "";
  statusEl.hidden = true;
});

checkButton.addEventListener("click", runCheck);

async function runCheck() {
  checkButton.disabled = true;
  resultsEl.innerHTML = "";
  statusEl.hidden = false;
  statusEl.textContent = "チェック中...";

  const files = Array.from(fileInput.files);

  // ファイル名解析。不正なものが1件でもあれば全体を中断する
  // （運営側ツールの「不正ファイル名検出時は全体中断」の方針と統一）
  const parseErrors = [];
  const parsed = [];
  for (const file of files) {
    const result = parseFilename(file.name);
    if (result.error) {
      parseErrors.push(`${file.name}: ${result.error}`);
    } else {
      parsed.push({ zone: result.zone, player: result.player, file });
    }
  }

  if (parseErrors.length > 0) {
    statusEl.textContent = "";
    renderParseErrors(parseErrors);
    checkButton.disabled = false;
    return;
  }

  const players = {};
  for (const p of parsed) {
    if (!players[p.player]) players[p.player] = [];
    players[p.player].push(p);
  }

  const playerNames = Object.keys(players).sort();
  for (const player of playerNames) {
    statusEl.textContent = `チェック中... (${player})`;
    try {
      const result = await processPlayer(player, players[player]);
      renderPlayerResult(result);
    } catch (e) {
      renderPlayerResult({
        player,
        files: players[player].map((p) => p.file.name),
        zones: [...new Set(players[player].map((p) => p.zone))].sort(),
        status: "error",
        reasons: [`予期しないエラーが発生しました: ${e}`],
      });
    }
  }

  statusEl.hidden = true;
  checkButton.disabled = false;
}

function renderParseErrors(errors) {
  const card = document.createElement("div");
  card.className = "player-card ng";
  const h2 = document.createElement("h2");
  h2.innerHTML = `<span class="badge ng">NG</span> ファイル名エラー`;
  card.appendChild(h2);
  const p = document.createElement("p");
  p.className = "meta";
  p.textContent =
    "不正なファイル名が見つかりました。すべてのファイル名を修正してから、再度チェックしてください。";
  card.appendChild(p);
  const ul = document.createElement("ul");
  ul.className = "reasons";
  for (const e of errors) {
    const li = document.createElement("li");
    li.textContent = e;
    ul.appendChild(li);
  }
  card.appendChild(ul);
  resultsEl.appendChild(card);
}

function renderPlayerResult(r) {
  const isOk = r.status === "success";
  const card = document.createElement("div");
  card.className = `player-card ${isOk ? "ok" : "ng"}`;

  const h2 = document.createElement("h2");
  h2.innerHTML = `<span class="badge ${isOk ? "ok" : "ng"}">${
    isOk ? "OK" : "NG"
  }</span> ${escapeHtml(r.player)}`;
  card.appendChild(h2);

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `使用ファイル: ${r.files.join(", ")} / 使用ゾーン: ${r.zones.join(", ")}`;
  card.appendChild(meta);

  if (isOk) {
    addDetailLine(card, `クロップ後サイズ: ${r.croppedSize}`);
    addDetailLine(card, `申請面積（不透明ピクセル数）: ${r.area}`);
    addDetailLine(card, `loc1: ${r.loc1} / loc2: ${r.loc2}`);

    const preview = document.createElement("div");
    preview.className = "preview";
    const canvas = renderCropPreview(r.cropInfo);
    preview.appendChild(canvas);
    const note = document.createElement("p");
    note.textContent =
      "※プレビューは不透明部分を#ff00ffに置き換えた状態で表示しています（実際の提出内容の色はそのままで問題ありません）";
    preview.appendChild(note);
    card.appendChild(preview);
  } else {
    const ul = document.createElement("ul");
    ul.className = "reasons";
    for (const reason of r.reasons) {
      const li = document.createElement("li");
      li.textContent = reason;
      ul.appendChild(li);
    }
    card.appendChild(ul);
  }

  resultsEl.appendChild(card);
}

function addDetailLine(card, text) {
  const p = document.createElement("p");
  p.className = "detail-line";
  p.textContent = text;
  card.appendChild(p);
}

function renderCropPreview(cropInfo) {
  const { data, width, left, upper, right, lower } = cropInfo;
  const cw = right - left;
  const ch = lower - upper;

  const cropped = new Uint8ClampedArray(cw * ch * 4);
  for (let y = 0; y < ch; y++) {
    const srcRowStart = ((y + upper) * width + left) * 4;
    const dstRowStart = y * cw * 4;
    cropped.set(data.subarray(srcRowStart, srcRowStart + cw * 4), dstRowStart);
  }
  for (let i = 0; i < cropped.length; i += 4) {
    if (cropped[i + 3] === 255) {
      cropped[i] = OVERLAY_COLOR[0];
      cropped[i + 1] = OVERLAY_COLOR[1];
      cropped[i + 2] = OVERLAY_COLOR[2];
    }
  }

  const full = document.createElement("canvas");
  full.width = cw;
  full.height = ch;
  full.getContext("2d").putImageData(new ImageData(cropped, cw, ch), 0, 0);

  // 表示用に縮小（元画像はそのまま保持しない＝メモリ節約）
  const MAX_DISPLAY = 480;
  const scale = Math.min(1, MAX_DISPLAY / Math.max(cw, ch));
  const display = document.createElement("canvas");
  display.width = Math.max(1, Math.round(cw * scale));
  display.height = Math.max(1, Math.round(ch * scale));
  const dctx = display.getContext("2d");
  dctx.imageSmoothingEnabled = false;
  dctx.drawImage(full, 0, 0, display.width, display.height);
  return display;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
