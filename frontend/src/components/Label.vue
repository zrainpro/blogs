<template>
  <div class="label">
    <div :class="`label-name ${required ? 'label-required' : ''}`">{{name}}</div>
    <slot />
  </div>
</template>

<script>
export default {
    name: 'label-self',
    props: {
      name: {
        type: String,
        default: ''
      },
      required: {
        type: Boolean,
        default: true
      },
      msg: {
        type: String,
        default: ''
      }
    },
    methods: {
      blur() {
        console.log(blur);
      }
    }
}
</script>

<style lang="less" scoped>
.label {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .label-name {
    padding-right: 15px;
    &::after {
      content: ':';
    }
  }
  .label-required {
    &::before {
      content: '* ';
      color: #CB4335;
    }
  }
}
</style>
