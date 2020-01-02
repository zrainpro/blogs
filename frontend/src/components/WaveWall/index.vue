<template>
  <div>
    <canvas ref="canvas" class="wave-wall" :width="width" :height="height" />
    <canvas ref="canvasWave" class="wave-wall" :width="width" :height="height" />
  </div>
</template>

<script>
  import { dispatchEvent } from '../../utils/function';
  import Wave from './wave';

  export default {
    name: 'WaveWall',
    props: {
      styles: {
        type: Object,
        default() { return {} }
      }
    },
    data() {
      return {
        listener: null,
        width: 600,
        height: 550,
        interval: 3,
        color: [255, 255, 255]
      }
    },
    mounted () {
      this.listener = () => {
        this.width = window.innerWidth - 8;
        this.drewLine(); // 绘制线条
        this.drewWave(this.width); // 绘制波浪
      }
      window.addEventListener('resize', this.listener)
      this.$nextTick(() => dispatchEvent('resize'))
    },
    destroyed () {
      window.removeEventListener('resize', this.listener)
    },
    watch: {
      styles: {
        deep: true,
        handler() {
          if (this.styles.color) {
            this.color = this.styles.color;
            this.wave.update({
              color: this.color
            });
          }
        }
      }
    },
    methods: {
      drewLine() {
        const ctx = this.$refs.canvas.getContext('2d')
        ctx.clearRect(0, 0, this.width, this.height)
        this.$nextTick(() => {
          ctx.strokeStyle = 'rgba(0,0,0,0.2)';
          ctx.lineWidth = 1;
          for (let i = 0; i <= this.height; i += this.interval) {
            ctx.beginPath();
            ctx.moveTo(0, i + 0.5);
            ctx.lineTo(this.width, i + 0.5);
            ctx.stroke();
          }
        })
      },
      drewWave() {
        const ctx = this.$refs.canvasWave.getContext('2d');
        ctx.clearRect(0, 0, this.width, this.height);
        this.$nextTick(() => {
          if (!this.wave) {
            this.wave = new Wave({
              width: this.width + 8,
              height: 550,
              speed: 0.031,
              color: this.color,
              ctx
            });
          }
          this.wave.update({
            width: window.innerWidth,
            color: this.color
          });
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.wave-wall {
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
