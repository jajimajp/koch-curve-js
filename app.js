class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
  * @param {CanvasRenderingContext2D} ctx
  * @param {Position} pos
  */
  static moveTo(ctx, pos) {
    ctx.moveTo(pos.x, pos.y);
  }

  /**
  * @param {CanvasRenderingContext2D} ctx
  * @param {Position} pos
  */
  static lineTo(ctx, pos) {
    ctx.lineTo(pos.x, pos.y);
  }

  /**
   * ex) divisionPoint(a, b, 0) = a
   *
   * @param {Position} a
   * @param {Position} b
   * @param {number} rate
   */
  static divisionPoint(a, b, rate) {
    const x = (1 - rate) * a.x + rate * b.x;
    const y = (1 - rate) * a.y + rate * b.y;
    return new Position(x, y);
  }
}

class Line {
  /**
   * @param {Position} start
   * @param {Position} end
   */
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  /**
   * @returns {Line[]}
   */
  koch(minLength = 4) {
    // Base case
    if (this.length() < minLength) {
      return [this];
    }

    // Reduction
    const mid1 = Position.divisionPoint(this.start, this.end, 1 / 3);
    const mid3 = Position.divisionPoint(this.start, this.end, 2 / 3);
    const angle = Math.atan2(mid3.y - mid1.y, mid3.x - mid1.x);
    const len = (new Line(mid1, mid3)).length();
    const mid2 = new Position(mid1.x + len * Math.cos(angle + (Math.PI / 3)), mid1.y + len * Math.sin(angle + (Math.PI / 3)));

    const line1 = new Line(this.start, mid1);
    const line2 = new Line(mid1, mid2);
    const line3 = new Line(mid2, mid3);
    const line4 = new Line(mid3, this.end);
    return [
      ...line1.koch(),
      ...line2.koch(),
      ...line3.koch(),
      ...line4.koch(),
    ];
  }

  /**
   * returns {number}
   */
  length() {
    return Math.sqrt(
      Math.pow(this.start.x - this.end.x, 2)
      + Math.pow(this.start.y - this.end.y, 2)
    );
  }
}


/**
  * @param {CanvasRenderingContext2D} ctx
  * @param {Position[]} positions
  */
function drawPolygon(ctx, positions) {
  if (positions.length === 0) {
    return;
  }
  ctx.translate(80, 80)
  ctx.beginPath();
  Position.moveTo(ctx, positions[0]);
  positions.slice(1).forEach(pos => {
    Position.lineTo(ctx, pos);
  })
  ctx.closePath();
  ctx.stroke();
  ctx.translate(-80, -80)
}

const fst = new Position(80, 0);
const snd = new Position(80 * Math.cos(Math.PI * 4 / 3), 80 * Math.sin(Math.PI * 4 / 3));
const trd = new Position(80 * Math.cos(Math.PI * 2 / 3), 80 * Math.sin(Math.PI * 2 / 3));
const paths = [
  ...(new Line(fst, snd)).koch(),
  ...(new Line(snd, trd)).koch(),
  ...(new Line(trd, fst)).koch(),
];

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
drawPolygon(ctx, paths.map(line => line.start));

// Button to save image.
const a = document.querySelector('#download');
a.href = canvas.toDataURL('image/png');
a.download = 'result.png';

