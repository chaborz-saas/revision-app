const BASE = 'http://localhost:3000';
const BATCH_SIZE = 3;
const DELAY = 2000; // 2s between batches

const ALL_IDS = [94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,83,84,85,86,87,88,89,90,91,92,93,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,1];

async function generateFiche(chapterId, type) {
  try {
    const res = await fetch(`${BASE}/api/fiches/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId, type }),
    });
    if (res.ok) {
      console.log(`  OK: chapter ${chapterId} (${type})`);
      return true;
    } else {
      const err = await res.text();
      console.log(`  SKIP: chapter ${chapterId} (${type}) - ${err.substring(0, 80)}`);
      return false;
    }
  } catch (e) {
    console.log(`  ERR: chapter ${chapterId} (${type}) - ${e.message}`);
    return false;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log(`Generating fiches for ${ALL_IDS.length} chapters...`);
  let done = 0;
  let errors = 0;

  for (let i = 0; i < ALL_IDS.length; i += BATCH_SIZE) {
    const batch = ALL_IDS.slice(i, i + BATCH_SIZE);
    console.log(`\nBatch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(ALL_IDS.length/BATCH_SIZE)} (chapters: ${batch.join(',')})`);

    const promises = batch.map(id => generateFiche(id, 'resume'));
    const results = await Promise.all(promises);

    done += results.filter(r => r).length;
    errors += results.filter(r => !r).length;

    console.log(`  Progress: ${done} done, ${errors} skipped/errors out of ${ALL_IDS.length}`);

    if (i + BATCH_SIZE < ALL_IDS.length) {
      await sleep(DELAY);
    }
  }

  console.log(`\n=== DONE: ${done} fiches generated, ${errors} errors ===`);
}

main();
