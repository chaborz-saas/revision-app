const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'fiches.json'), 'utf8'));
const ids = [];
const courses = data.courses || data;
for (const c of courses) {
  for (const ch of c.chapters) {
    if (!ch.hasResume) ids.push(ch.id);
  }
}
console.log('TOTAL:' + ids.length);
console.log('IDS:' + ids.join(','));
