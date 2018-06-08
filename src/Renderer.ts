import Scene from './Scene';
import * as p2 from 'p2';

class Renderer {
  scene: Scene;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;

  constructor(scene: Scene) {
    this.scene = scene;
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.w = this.canvas.width;
    this.h = this.canvas.height;

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.lineWidth = 0.05;
  }

  drawbox = (body: p2.Body) => {
    const ctx = this.ctx;
    ctx.beginPath();
    const x = body.position[0];
    const y = body.position[1];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(body.angle);
    const shape = body.shapes[0];
    if (shape instanceof p2.Box) {
      ctx.rect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);
    } else if (shape instanceof p2.Circle) {
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

    this.scene.bodies.forEach(body => {
      this.drawbox(body);
    });

    ctx.restore();
  };
}

export default Renderer;
