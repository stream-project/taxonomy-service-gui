<template>
    <p>
      This is an editable list. Every change has to be saved per tag and then everything is submitted with a click on "Trigger publish".
    </p>
    <ul class="list-group">
        <tag-list-entry v-for="tag in fullList" :tag="tag" :key="tag.id" />
    </ul>
    <a href="#" class="float" @click="add">
        <i class="fa fa-plus my-float">
            <BootstrapIcon
                icon="plus"
                size="4x" />
        </i>
    </a>
</template>

<script>
import taglistentry from './tag-list-entry.vue'

export default {
  name: 'tag-list',
  props: {
      taglist: Array
  },
  data() {
      return {
          newEntries: []
      };
  },
  components: {
      'tag-list-entry': taglistentry
  },
  created() {
      localStorage.removeItem('app_changed_tags');
  },
  computed: {
      fullList() {
          return this.newEntries.concat(this.taglist);
      }
  },
  methods: {
      add() {
          var newId = this.newEntries.concat(this.taglist).reduce((acc, cur) => {
              var id = cur.id;
              if (acc <= id)
                return id+1;
              return acc;
          }, 1);
          
          this.newEntries.push({
              name: '',
              uri: '',// TODO use URI from env
              id: newId
          });
          this.newEntries = this.newEntries.sort((a, b) => {
              var nameA = a.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
              var nameB = b.name.toUpperCase(); // Groß-/Kleinschreibung ignorieren
              if (nameA < nameB) {
                  return -1;
              }
              if (nameA > nameB) {
                  return 1;
              }

              // Namen müssen gleich sein
              return 0;
          });
      }
  }
}
</script>

<style>
.float{
	position:fixed;
	width:65px;
	height:65px;
	top:120px;
	right:20px;
	background-color:#0C9;
	color:#FFF;
	border-radius:50px;
	text-align:center;
	box-shadow: 2px 2px 3px #999;
    font-family:Verdana, Geneva, sans-serif;
	font-size:18px;
}

.my-float{
	margin-top:22px;
}
</style>
