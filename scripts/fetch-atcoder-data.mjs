import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ATCODER_USER = "AXT_AyaKoto";
const BASE = "https://kenkoooo.com/atcoder";
const SUBMISSIONS_DAYS = 7;
const DATA_DIR = "data";
const SLEEP_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchJson = async (url) => {
    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
            "User-Agent": "competitive-programming-portfolio/1.0",
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return response.json();
};

const fromSecond = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * SUBMISSIONS_DAYS;
const updatedAt = new Date().toISOString();

await mkdir(DATA_DIR, { recursive: true });

const history = await fetchJson(`${BASE}/proxy/users/${ATCODER_USER}/history/json`);
await writeFile(join(DATA_DIR, "history.json"), `${JSON.stringify(history)}\n`);
await sleep(SLEEP_MS);

const acRank = await fetchJson(`${BASE}/atcoder-api/v3/user/ac_rank?user=${ATCODER_USER}`);
await writeFile(join(DATA_DIR, "ac_rank.json"), `${JSON.stringify(acRank)}\n`);
await sleep(SLEEP_MS);

const languageRank = await fetchJson(
    `${BASE}/atcoder-api/v3/user/language_rank?user=${ATCODER_USER}`,
);
await writeFile(join(DATA_DIR, "language_rank.json"), `${JSON.stringify(languageRank)}\n`);
await sleep(SLEEP_MS);

const submissions = await fetchJson(
    `${BASE}/atcoder-api/v3/user/submissions?user=${ATCODER_USER}&from_second=${fromSecond}`,
);
await writeFile(join(DATA_DIR, "submissions.json"), `${JSON.stringify(submissions)}\n`);

const info = {
    updated_at: updatedAt,
    user: ATCODER_USER,
    submissions_from_second: fromSecond,
};
await writeFile(join(DATA_DIR, "info.json"), `${JSON.stringify(info, null, 2)}\n`);

console.log(`Fetched AtCoder data into ${DATA_DIR}/`);
