<template>
    <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Current value: <b :id="tag.id + '_name'">{{ tag.name }}</b></h5>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" :id="tag.id + '_label'">Enter new value:</span>
            <input type="text" class="form-control" :placeholder="tag.name" aria-label="tag" :aria-describedby="tag.id + '_label'" :id="tag.id + '_input'" v-model="newValue">
            <button type="button" class="btn btn-dark" @click="onSave()" :disabled="isSaveDisabled">Save</button>
        </div>
        <div class="d-flex w-100 justify-content-between">
            <span v-if="oldName.length > 0" class="mb-1">Old value was: {{ oldName }}</span>
        </div>
    </a>
</template>

<script>
import { inject } from 'vue'
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'tag-list-entry',
  props: {
      tag: Object
  },
  data() {
      return {
          setPublishNeeded: () => {},
          oldName: '',
          newValue: ''
      };
  },
  computed: {
      isSaveDisabled() {
          return this.newValue.length < 1;
      }
  },
  created() {
      this.setPublishNeeded = inject('setPublishNeeded');
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
          }
          var newUri = this.tag.uri.split("/").slice(0, -1).join("/")+"/"+encodeURIComponent(uuidv4());
          var newEntry = {
              name: this.newValue,
              oldName: this.tag.name,
              id: this.tag.id,
              oldUri: this.tag.uri,
              uri: newUri
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
                  match.uri = newUri;
              }
              else
                changedTags.push(newEntry);
          }
          localStorage.setItem('app_changed_tags', JSON.stringify(changedTags));
          this.oldName = this.tag.name;
          
          // update GUI
          document.getElementById(this.tag.id+"_input").value = '';
          document.getElementById(this.tag.id+"_input").placeholder = this.newValue;
          document.getElementById(this.tag.id+"_name").innerText = this.newValue;
          this.newValue = '';
          
          // Notify header
          this.setPublishNeeded();
      }
  }
}
</script>


<style>

</style>
