<template>
    <a href="#" class="list-group-item list-group-item-action">
        <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">Current value: <b>{{ tag.name }}</b></h5>
        </div>
        <div class="input-group mb-3">
            <span class="input-group-text" :id="tag.id + '_label'">New value:</span>
            <input type="text" class="form-control" :placeholder="tag.name" aria-label="tag" :aria-describedby="tag.id + '_label'">
            <button type="button" class="btn btn-dark">Speichern</button>
        </div>
    </a>
</template>

<script>
export default {
  name: 'tag-list-entry',
  props: {
      tag: Object
  }
}
</script>


<style>

</style>
