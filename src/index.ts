import Scene from './Scene';
import Renderer from './Renderer';
import * as tf from '@tensorflow/tfjs';

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

declare global {
  interface Window {
    tf: any;
    model: any;
  }
}

window.tf = tf;

const scene = new Scene();
const renderer = new Renderer(scene);

console.time('go!');
for (let i = 0; i < 60 * 10; i++) {}
console.timeEnd('go!');
console.log('constraints', scene.constraints.length);
console.log(scene.getPositions().length);
console.log(scene.fitness);

const model = tf.sequential({
  layers: [
    tf.layers.dense({ units: 32, inputShape: [24], activation: 'relu' }),
    tf.layers.dense({ units: 10 }),
  ],
});

model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

window.model = model;

const frame = function() {
  scene.step();

  tf.tidy(() => {
    const output = model.predictOnBatch(
      tf.tensor2d(scene.getPositions(), [1, 24])
    ) as tf.Tensor<tf.Rank.R1>;

    scene.setMomentum(Array.from(output.dataSync()));
  });
  requestAnimationFrame(frame);

  renderer.render();
};
requestAnimationFrame(frame);
