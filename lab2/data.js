import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.join(import.meta.dirname, 'data.json');

export function loadData(filePath = DATA_PATH) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function saveData(data, filePath = DATA_PATH) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
