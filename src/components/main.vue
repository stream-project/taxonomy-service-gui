<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Test
    </p>
    <tag-list :taglist="taglist" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

import taglist_v from './tag-list.vue'
import fetchTags_SPARQL from '../controller/helper.js'

export default {
    name: 'mymain',
    props: {
        msg: String
    },
    components: {
        'tag-list': taglist_v
    },
    setup () {
        const taglist = ref([]);
        const fetchTags = () => {
            taglist.value = fetchTags_SPARQL()
        }
        
        onMounted(fetchTags);
        
        return {
            taglist,
            fetchTags
        };
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
