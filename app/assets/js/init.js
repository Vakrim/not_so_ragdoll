requirejs.config({
    baseUrl: 'assets',
    paths: {
    },
    packages: [
      {
        name: 'cs',
        location: 'bower_components/require-cs',
        main: 'cs'
      },
      {
        name: 'coffee-script',
        location: 'bower_components/coffeescript',
        main: 'extras/coffee-script'
      }
    ]
});



requirejs(["cs!js/world", "cs!js/neuron_network", "cs!js/renderer", "js/genetic-0.1.14"], function(World, Network, Renderer, Genetic) {

  window.Network = Network;
  window.World = World;
  window.Renderer = Renderer;
  window.Genetic = Genetic;

  var test_world, genetic;

  test_world = new World(p2);

  Network.set_weight_length(test_world.get_angles(), test_world.constraints.length);

  genetic = Genetic.create();

  genetic.optimize = Genetic.Optimize.Maximize;
  genetic.select1 = Genetic.Select1.Tournament2;
  genetic.select2 = Genetic.Select2.FittestRandom;

  var best_weights = (new Network()).set_zero_weights();

  genetic.seed = function() {
    var network = new window.Network();
    return network.set_random_weights();
  };

  genetic.mutate = function(weights) {
    for(var i = 0; i < weights.length; i++) {
      weights[i] *= (Math.random() * 0.4) + 0.8;
    }
    return weights;
  };

  genetic.crossover = function(mother, father) {

    var len = mother.length;
    var son = Array(len);
    var daughter = Array(len);

    for(var i = 0; i < len; i++) {
      if(Math.floor(Math.random()) < 0.5) {
        daughter[i] = mother[i];
        son[i] = father[i];
      } else {
        daughter[i] = father[i];
        son[i] = mother[i];
      }
    }

    return [son, daughter];
  };

  genetic.fitness = function(entity) {
    var world = new World(p2);
    var network = new Network();

    network.set_weights(entity);

    for(var i = 0; i < 50; i++) {
      network.set_input(world.get_angles());
      world.set_momentum(network.output());
      world.step(1/10);
    }

    return world.fitness();
  };

  genetic.notification = function(pop, generation, stats, isFinished) {
    console.log('GEN: ', generation, 'STATS: ', stats.maximum, ' - ', stats.minimum, '(' + stats.mean + ')')
    if(isFinished) {
      best_weights = pop[0].entity;
    }
  }

  var config = {
    iterations: 40,
    size: 10,
    crossover: 0.9, // default: 0.9
    mutation: 0.4, // default: 0.2
  };
  var userData = {
  };

  genetic.evolve(config, userData);

  (function() {
    var world = new World(p2);
    var renderer = new Renderer(world);
    var network = new Network();

    (animation_frame = function() {
      requestAnimationFrame(animation_frame);

      network.set_input(world.get_angles());
      network.set_weights(best_weights);
      world.set_momentum(network.output());

      world.step()

      renderer.render()
    }).call();
  }).call();
});
