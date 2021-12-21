<template>
    <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Current value: <b :id="tag.id + '_name'">{{ tag.name }}</b></h5>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" :id="tag.id + '_label'">Enter new value:</span>
            <input type="text" class="form-control" :placeholder="tag.name" aria-label="tag" :aria-describedby="tag.id + '_label'" :id="tag.id + '_input'" v-model="newValue">
            <button type="button" class="btn btn-dark" @click="onSave()" :disabled="isSaveDisabled">Save</button>
            <button type="button" class="btn btn-danger" @click="onDelete()">Delete</button>
        </div>
        <div class="d-flex w-100 justify-content-between">
            <span v-if="hasOldName" class="mb-1">Old value was: {{ oldName }}</span>
        </div>
        <div class="d-flex w-100 justify-content-between">
            <span v-if="hasPortal" class="mb-1">Created by the portal: {{ tag.portal }}</span>
        </div>
    </a>
</template>

<script>
import { inject } from 'vue'
import {store} from '../controller/helper.js'

export default {
  name: 'tag-list-entry',
  props: {
      tag: Object
  },
  data() {
      return {
          setPublishNeeded: () => {},
          deleteTag: () => {},
          oldName: '',
          newValue: ''
      };
  },
  computed: {
      isSaveDisabled() {
          return this.newValue.length < 1;
      },
      hasOldName() {
        return this.oldName && this.oldName.length > 0;
      },
      hasPortal() {
        return this.tag && this.tag.portal && this.tag.portal.length > 0;
      }
  },
  created() {
      this.setPublishNeeded = inject('setPublishNeeded');
      this.deleteTag = inject('deleteTag');
  },
  methods: {
      onSave() {
          if (this.newValue.length < 1)
            return;

          console.log("Changing ", this.tag.name, "to ", this.newValue);

          // Store change
          var changedTags = [];
          try {
              changedTags = JSON.parse(localStorage.getItem('app_changed_tags'));
          } catch (e) {
              console.error(e);
              changedTags = [];
          }
          var newEntry = {
              name: this.newValue,
              oldName: this.tag.name,
              id: this.tag.id,
              uri: this.tag.uri,
              portal: this.tag.portal
          };
          console.log('new entry:', newEntry);
          if (!changedTags || changedTags.length < 1) {
            changedTags = [];
            changedTags.push(newEntry);
          }
          else {
              var match = changedTags.find((e) => {return e.id === newEntry.id});
              if (match && match.id) {
                  match.name = this.newValue;
              }
              else
                changedTags.push(newEntry);
          }
          localStorage.setItem('app_changed_tags', JSON.stringify(changedTags));
          store.setCounterAction(changedTags.length);
          this.oldName = this.tag.name;

          // update GUI
          document.getElementById(this.tag.id+"_input").value = '';
          document.getElementById(this.tag.id+"_input").placeholder = this.newValue;
          document.getElementById(this.tag.id+"_name").innerText = this.newValue;
          this.newValue = '';

          // Notify header
          this.setPublishNeeded(true);
      },
      onDelete() {
          // delete from storage
          var changedTags = [];
          var tag = this.tag;
          try {
              changedTags = JSON.parse(localStorage.getItem('app_changed_tags'));
              changedTags = changedTags.filter((e) => {
                  return (e.id !== tag.id);
              });
          } catch (e) {
              changedTags = [];
          }
          localStorage.setItem('app_changed_tags', JSON.stringify(changedTags));
          store.setCounterAction(changedTags.length);

          // Notify header
          this.setPublishNeeded(true);

          // update GUI on parent level
          this.deleteTag({
              id: this.tag.id,
              oldName: this.tag.name,
              uri: this.tag.uri,
              portal: this.tag.portal
          });
      }
  }
}
</script>


<style>

</style>
