export default class Wave {
  constructor ({ color, width, height, speed, ctx }) {
    this.t = width * 3 || 1920
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.step = width / 300;
    this.color = color || [255, 255, 255]
    this.speed = speed || 0.01
    this.a = 20
    this.f = 10
    this.d = 480
    this.k = 5
    this.render()
  }

  update(props) {
    props.width && (this.width = props.width);
    props.height && (this.height = props.height);
    props.color && (this.color = props.color);
    props.speed && (this.speed = props.speed);
  }

  caculate (x) {
    this.amplitude = this.a
    this.frequency = this.f * (1 / this.width)
    this.displacement = this.d
    // A*sin(Bx + C) + D
    return (this.amplitude * Math.sin(this.frequency * x + this.t) + this.displacement)
  }

  render (width) {
    this.t -= this.speed
    if (this.t < 0) {
      this.t = 3 * this.width
    }
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.save()
    const gradient = this.ctx.createLinearGradient(0, this.d, 0, this.height)
    gradient.addColorStop(0, `rgba(${this.color.join(',')} ,0.7)`)
    gradient.addColorStop(1, `rgba(${this.color.join(',')} , 1)`)
    this.ctx.fillStyle = gradient || this.color
    this.ctx.beginPath()
    this.ctx.lineWidth = 1
    this.ctx.moveTo(0, this.d)
    for (let i = 0; i <= this.width; i += this.step) {
      this.ctx.lineTo(i, this.caculate(i))
    }
    this.ctx.lineTo(this.width, this.height)
    this.ctx.lineTo(0, this.height)
    this.ctx.lineTo(0, this.d)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.restore()
    window.requestAnimationFrame(this.render.bind(this))
  }
}
