<template>
  <li>{{ tag.name }}</li>
</template>

<script>
export default {
  name: 'tag-list-entry',
  props: {
      tag: Object
  }
}
</script>
