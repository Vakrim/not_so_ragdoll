import NeuronNetwork from './NeuronNetwork';
import World from './World';
import Renderer from './Renderer';
import p2 from 'p2';

var world = new World(p2);
var renderer = new Renderer(world);

const frame = function() {
  requestAnimationFrame(frame);

  world.step();

  renderer.render();
}
requestAnimationFrame(frame);
