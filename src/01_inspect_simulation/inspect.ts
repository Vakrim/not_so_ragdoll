import { simulate } from '../Scene';
import { open, writeSync } from 'fs';

const populateArrayWithRandom = (size: number) =>
  Array(size)
    .fill(0)
    .map(() => Math.random() * 2 - 1);

open('./src/resultsOfInspection.txt', 'a', (err, fd) => {
  for(let n = 0; n < 100; n++) {
    const moments = populateArrayWithRandom(10 * 4 * 10);
    const fitness = simulate(moments);

    const writeData = JSON.stringify(moments) + '\n' + JSON.stringify(fitness) + '\n';
    writeSync(fd, writeData, null, 'UTF8');

    if(n % 10 === 0) {
      console.log(n);
    }
  }
});
