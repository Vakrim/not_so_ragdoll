const { results } = require('./resultsOfInspection.json') as {
  results: Result[];
};
import * as tf from '@tensorflow/tfjs';

type Result = {
  fitness: number;
  input: number[];
};

(async () => {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ units: 200, inputShape: [400], activation: 'relu' }),
      tf.layers.dense({ units: 200, activation: 'relu' }),
      tf.layers.dense({ units: 200, activation: 'relu' }),
      tf.layers.dense({ units: 1 }),
    ],
  });

  const optimizer = tf.train.sgd(0.001);

  model.compile({ loss: 'meanSquaredError', optimizer });

  const xs = tf.tensor2d(results.map(r => r.input));
  const ys = tf.tensor2d(results.map(r => [r.fitness]));

  const [evaluteX, trainX] = tf.split(xs, 2, 0);
  const [evaluteY, trainY] = tf.split(ys, 2, 0);

  await model
    .fit(trainX, trainY, {
      epochs: 100,
      shuffle: true,
      validationSplit: 0.2,
    })
    .then(h => {
      console.log(h);
      console.log(
        `Learning Loss: ${h.history.loss[h.history.loss.length - 1]}`
      );
      console.log(
        `Validation Loss: ${h.history.val_loss[h.history.val_loss.length - 1]}`
      );
    });

  console.log(tf.memory());
})();
