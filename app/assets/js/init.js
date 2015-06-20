requirejs.config({
    baseUrl: 'assets',
    paths: {
      bower: 'bower_components',
      Matter: 'bower_components/matter-js/build/matter-0.8.0'
    }
});

requirejs(["Matter"], function(Matter) {

});
