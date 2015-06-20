requirejs.config({
    baseUrl: 'assets',
    paths: {
      Matter: 'bower_components/matter-js/build/matter-0.8.0'
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

requirejs(["Matter", "cs!js/world"], function(Matter, World) {

});
