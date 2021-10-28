<template>
    <div class="header">
      <img alt="Vue logo" class="logo" src="../assets/logo.png">
      <div class="header-right">
        <a class="active" href="#home">Home</a>
        <a href="#reload">Reload</a>
        <span :class="spanClass"><a @click="preventIfHidden" :href="href" :aria-disabled="triggerDisabled">Trigger publish</a></span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'myheader',
  props: {
      publishingNeeded: Boolean
  },
  computed: {
      spanClass() {
          return this.publishingNeeded ? '' : 'isDisabled';
      },
      href() {
          return this.publishingNeeded ? '#publish' : '';
      },
      triggerDisabled() {
          return !this.publishingNeeded;
      }
  },
  methods: {
      preventIfHidden(event) {
          // filter out clicks on any other elements
          if (event.target.nodeName == 'A' && event.target.getAttribute('aria-disabled') == 'true') {
            event.preventDefault();
          }
      }
  }
}
</script>

<style>
.isDisabled {
  cursor: not-allowed;
  opacity: 0.5;
}
a[aria-disabled="true"] {
  color: currentColor;
  display: inline-block;  /* For IE11/ MS Edge bug */
  pointer-events: none;
  text-decoration: none;
}


* {box-sizing: border-box;}

body { 
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.logo {
    height: 60px;
}

.header {
  overflow: hidden;
  background-color: #f1f1f1;
  padding: 20px 10px;
}

.header a {
  float: left;
  color: black;
  text-align: center;
  padding: 12px;
  text-decoration: none;
  font-size: 18px; 
  line-height: 25px;
  border-radius: 4px;
}

.header a.logo {
  font-size: 25px;
  font-weight: bold;
}

.header a:hover {
  background-color: #ddd;
  color: black;
}

.header a.active {
  background-color: dodgerblue;
  color: white;
}

.header-right {
  float: right;
}

@media screen and (max-width: 500px) {
  .header a {
    float: none;
    display: block;
    text-align: left;
  }
  
  .header-right {
    float: none;
  }
}
</style>
