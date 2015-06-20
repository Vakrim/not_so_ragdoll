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
  console.log(arguments);

  var world, network, renderer;

  world = new World(p2);

  network = new Network();

  renderer = new Renderer(world);

  network
    .set_output_size(world.constraints.length)
    .set_input(world.get_angles())
    .set_random_weights();

  (animation_frame = function() {
    requestAnimationFrame(animation_frame);

    network.set_input(world.get_angles());
    network.set_random_weights();
    world.set_momentum(network.output());

    world.step()

    renderer.render()
  }).call()






});
