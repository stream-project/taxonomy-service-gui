<template>
    <div class="header">
      <img alt="Vue logo" class="logo" src="../assets/logo.png">
      <div class="header-right">
        <a class="active" href="#">Home</a>
        <a @click="reload">Reload</a>
        <span :class="spanClass">
            <a @click="preventIfHidden" :href="href" :aria-disabled="triggerDisabled">
                Trigger publish
                <span class="position-absolute start-99 translate-middle badge rounded-pill bg-success">
                    {{ numberOfChanges }}
                    <span class="visually-hidden">Changes</span>
                </span>
            </a>
        </span>
      </div>
    </div>
</template>

<script>
import {publish} from '../controller/helper.js'

export default {
  name: 'myheader',
  props: {
      publishingNeeded: Boolean
  },
  data() {
      return {
          numberOfChanges: '' // TODO redo the code to have a component which is responsible for the data
      };
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
          else {
              this.publish();
          }
      },
      reload() {
          this.$swal({
              title: 'Reloading the page',
              text: "Changes which were not published will be discarded.",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, reload'
            }).then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
          });
      },
      publish() {
          const success = publish(JSON.parse(localStorage.getItem('app_changed_tags')));
          if (success)
            location.reload();
          else {
              this.$swal({
                  icon: 'error',
                  title: 'Error',
                  text: 'There is a problem with the SPARQL endpoint. Please have a look into the browser console/log.'
              })
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
