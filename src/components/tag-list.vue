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
import { provide, inject } from 'vue'
import {store} from '../controller/helper.js'
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'tag-list',
  props: {
      taglist: Array
  },
  data() {
      return {
          newEntries: [],
          setPublishNeeded: () => {},
          deletedIds: []
      };
  },
  components: {
      'tag-list-entry': taglistentry
  },
  created() {
      this.setPublishNeeded = inject('setPublishNeeded');

      localStorage.removeItem('app_changed_tags');

      const deleteTag = (tag) => {
          var tagNeedsToBeDeletedWithSPARQL = true;
          console.log('new entries:', [].concat(this.newEntries));
          this.newEntries = this.newEntries.filter((e) => {
              const a = (e.id !== tag.id);
              if (!a)
                tagNeedsToBeDeletedWithSPARQL = false;
              return a;
          });
          console.log('filtered new entries:', this.newEntries);
          var changedTags = [];
          try {
              changedTags = JSON.parse(localStorage.getItem('app_changed_tags'));
          } catch (e) {
              console.error(e);
          }
          if (!changedTags || changedTags.length < 1) {
            changedTags = [];
          }
          if (tagNeedsToBeDeletedWithSPARQL) {
              console.warn('Adding tag to delete list:', tag);
              // Add delete into storage
              changedTags.push(tag);
              localStorage.setItem('app_changed_tags', JSON.stringify(changedTags));
              store.setCounterAction(changedTags.length);

              this.deletedIds.push(tag.id);
          }
          if (changedTags.length < 1) {
              this.setPublishNeeded(false);
          }
      }
      provide('deleteTag', deleteTag);
  },
  computed: {
      fullList() {
          return this.newEntries.concat(this.taglist.filter((e) => {
              return this.deletedIds.indexOf(e.id) === -1;
          }));
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
              uri: process.env.VUE_APP_BASE_URI_TAGS + uuidv4(),
              id: newId
          });
          
          this.newEntries.sort((a, b) => {
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
