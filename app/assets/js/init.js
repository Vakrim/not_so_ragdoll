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

requirejs(["cs!js/world"], function(World) {
  console.log(arguments);
  world = new World(p2);

});
