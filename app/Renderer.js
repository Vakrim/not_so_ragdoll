class Renderer {
  constructor(world) {
    this.world = world;
    this.canvas = document.getElementById('view');
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineWidth = 0.05;
  }

  drawbox = body => {
    const ctx = this.ctx;
    ctx.beginPath();
    const x = body.position[0];
    const y = body.position[1];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(body.angle);
    const shape = body.shapes[0];
    if (shape.width && shape.height) {
      ctx.rect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
    } else if (shape.radius) {
      ctx.arc(0, 0, shape.radius, 0, 2 * Math.PI, false);
    }
    ctx.stroke();
    ctx.restore();
  };

  render = () => {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.translate(this.w / 2, this.h / 2);
    ctx.scale(50, -50);

    this.world.bodies.forEach(body => {
      this.drawbox(body);
    });

    ctx.restore();
  };
}

export default Renderer;
