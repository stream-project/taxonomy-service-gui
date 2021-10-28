<template>
  <myheader :publishingNeeded="tagsWereChanged" />
  <mymain />
  <myfooter />
</template>

<script>

import mymain from './components/main.vue'
import myheader from './components/myheader.vue'
import myfooter from './components/myfooter.vue'
import { provide } from 'vue'

export default {
    name: 'App',
    components: {
        'myheader': myheader,
        'mymain': mymain,
        'myfooter': myfooter
    },
    data() {
        return {
            tagsWereChanged: false
        }
    },
    created() {
        const setPublishNeeded = (v) => {
          this.tagsWereChanged = v;
        }
        provide('setPublishNeeded', setPublishNeeded);
        
        console.log(process.env);
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
