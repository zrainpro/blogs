<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${use}`" />
  </svg>
</template>

<script>
  export default {
    name: 'Icon',
    props: {
      use: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped>

</style>
