<template>
    <ul class="list-group">
        <tag-list-entry v-for="tag in taglist" :tag="tag" :key="tag.id" />
    </ul>
</template>

<script>
import taglistentry from './tag-list-entry.vue'

export default {
  name: 'tag-list',
  props: {
      taglist: Array
  },
  components: {
      'tag-list-entry': taglistentry
  }
}
</script>
