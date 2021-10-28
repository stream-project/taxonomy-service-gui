<template>
    <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Current value: <b :id="tag.id + '_name'">{{ tag.name }}</b></h5>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" :id="tag.id + '_label'">New value:</span>
            <input type="text" class="form-control" :placeholder="tag.name" aria-label="tag" :aria-describedby="tag.id + '_label'" :id="tag.id + '_input'">
            <button type="button" class="btn btn-dark" @click="onSave()" >Speichern</button>
        </div>
    </a>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'tag-list-entry',
  props: {
      tag: Object
  },
  data() {
      return {
          setPublishNeeded: () => {}
      };
  },
  created() {
      this.setPublishNeeded = inject('setPublishNeeded');
  },
  methods: {
      onSave() {
          var newTagName = document.getElementById(this.tag.id+"_input").value;
          console.log("Changing ", this.tag, "to ", newTagName);
          
          // Store change
          var changedTags = [];
          try {
              changedTags = JSON.parse(localStorage.getItem('app_changed_tags'));
          } catch (e) {
              console.error(e);
          }
          var newUri = this.tag.uri.split("/").slice(0, -1).join("/")+"/"+encodeURIComponent(newTagName);
          var newEntry = {
              name: newTagName,
              id: this.tag.id,
              oldUri: this.tag.uri,
              uri: newUri
          };
          if (!changedTags || changedTags.length < 1) {
            changedTags = [];
            changedTags.push(newEntry);
          }
          else {
              var match = changedTags.find((e) => {return e.id === newEntry.id});
              if (match && match.id) {
                  match.name = newTagName;
                  match.uri = newUri;
              }
              else
                changedTags.push(newEntry);
          }
          localStorage.setItem('app_changed_tags', JSON.stringify(changedTags));
          
          // update GUI
          document.getElementById(this.tag.id+"_input").value = '';
          document.getElementById(this.tag.id+"_input").placeholder = newTagName;
          document.getElementById(this.tag.id+"_name").innerText = newTagName;
          
          // Notify header
          this.setPublishNeeded();
      }
  }
}
</script>


<style>

</style>
