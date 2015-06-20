class Renderer
  constructor: (@world) ->
    @canvas = document.getElementById("view");
    @w = @canvas.width;
    @h = @canvas.height;

    @ctx = @canvas.getContext("2d");
    @ctx.lineWidth = 0.05;

  drawbox: (body) ->
    ctx = @ctx
    ctx.beginPath();
    x = body.position[0];
    y = body.position[1];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(body.angle);
    shape = body.shapes[0]
    if shape.width? && shape.height?
      ctx.rect(-shape.width/2, -shape.height/2, shape.width, shape.height);
    else if shape.radius?
      ctx.arc(0, 0, shape.radius, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.restore();

  render: ->
    ctx = @ctx
    ctx.clearRect(0,0,@w,@h);

    ctx.save();
    ctx.translate(@w/2, @h/2);
    ctx.scale(50, -50);

    for body in @world.bodies
      @drawbox(body)

    ctx.restore();

define ->
  Renderer
