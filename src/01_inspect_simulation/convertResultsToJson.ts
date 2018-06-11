import * as readline from 'readline';
import * as fs from 'fs';

const readStream = fs.createReadStream('./src/resultsOfInspection.txt')

const rl = readline.createInterface({
  input: readStream,
});

type Result = {
  fitness?: number
  input?: number[]
}

let currentResult: Result = {};

const results: Result[] = [];

rl.on('line', input => {
  const i = JSON.parse(input);
  if(typeof i === 'number') {
    currentResult.fitness = i;
  }
  if(typeof i === 'object') {
    currentResult.input = i;
  }
  if(currentResult.fitness && currentResult.input) {
    results.push(currentResult);
    currentResult = {};
  }
});

rl.on('close', () => {
  fs.writeFileSync('./src/resultsOfInspection.json', JSON.stringify({results}))
})
