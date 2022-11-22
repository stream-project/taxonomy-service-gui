const endpointUrl = 'https://sparql.stream-dataspace.net/sparql/';

async function fetchTags_SPARQL() {
    const SimpleClient = require('sparql-http-client/SimpleClient')

    const query = `
    PREFIX tags: <http://stream-ontology.com/tags/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX ckan: <http://stream-ontology.com/ckan/>
    select ?subject ?label ?portal
    FROM  <http://stream-ontology.com/tags/>
    where { ?subject a skos:Concept ;
                  skos:prefLabel ?label .
                OPTIONAL { ?subject ckan:portal ?portal }  }`;

    const client = new SimpleClient({ endpointUrl });
    const stream = await client.query.select(query);

    if (!stream.ok) {
        console.error(stream.statusText);
        console.log(stream);
        return [];
    }

    const content = await stream.json();

    var list = [];
    var i = 1;
    console.log(content.results.bindings);
    for (const row of content.results.bindings) {
        list.push({
            name: row.label.value,
            id: i,
            uri: row.subject.value,
            portal: row.portal ? row.portal.value : ''
        });
        i++;
    }

    return list.sort();
}

async function publish(taglist) {
    var deleteQuery = '';
    var insertQuery = '';

    if (taglist.length < 1)
        return true;

    taglist.forEach((item) => {
        var queryPartPortal = '';
        if (item.portal)
          queryPartPortal = '; ckan:portal <'+item.portal+'>';
        if (item.oldName && item.oldName !== '') {
            deleteQuery += '<' + item.uri + '> skos:prefLabel "'+ item.oldName +'" '+queryPartPortal+' .\n';
        }
        if (item.name && item.name !== '') {
            insertQuery += '<' + item.uri + '> a skos:Concept ; skos:prefLabel "' + item.name + '" '+queryPartPortal+' .\n';
        }
    });

    if (deleteQuery.length > 0) {
        deleteQuery = `
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX ckan: <http://stream-ontology.com/ckan/>
            DELETE DATA { GRAPH <` + process.env.VUE_APP_BASE_URI_TAGS + `> { ` + deleteQuery + ` } } ;\n`
    }

    if (insertQuery.length > 0) {
        insertQuery = `
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            PREFIX ckan: <http://stream-ontology.com/ckan/>
            INSERT DATA { GRAPH <` + process.env.VUE_APP_BASE_URI_TAGS + `> { ` + insertQuery + ` } } `;
    }

    console.log('Send:', deleteQuery+insertQuery);

    const SimpleClient = require('sparql-http-client/SimpleClient')
    const client = new SimpleClient({ endpointUrl });
    const stream = await client.query.select(deleteQuery+insertQuery);

    if (!stream.ok) {
        console.error(stream.statusText);
        console.log(stream);
        return false;
    }

    const content = await stream.json();

    console.log(content.results.bindings);

    return true;
}

import axios from 'axios';

async function sendToCKAN(taglist) {
  var patch = {delete: [], insert: []};

  // build patch
  taglist.forEach((item) => {
      if (item.oldName && item.oldName !== '') {
          patch.delete.push(item.oldName)
      }
      if (item.name && item.name !== '') {
          patch.insert.push(item.name)
      }
  });

  // send the requests
  var portals = process.env.VUE_APP_CKAN_PORTALS.split(",");
  var responses = [];
  portals.forEach(async (portal) => {
    var response = await axios({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: patch,
      url: portal+'/api/3/action/process_tag_patch'
    });
    console.log(response);
    responses.push({"portal": portal, status: response.status});
  });

  var failed = responses.filter((e) => {return e.status !== "200" });
  if (failed.length > 0) {
    return failed;
  }

  return [];
}

import { reactive } from 'vue'
// A basic store object which is used in different components
const store = {
    debug: true,

    state: reactive({
        counter: 0
    }),

    setCounterAction(value) {
        if (this.debug) {
            console.log('setCounterAction triggered with', value)
        }

        this.state.counter = value
    },

    increaseCounterAction() {
        if (this.debug) {
            console.log('increaseCounterAction triggered')
        }

        this.state.counter += 1
    },

    resetCounterAction() {
        if (this.debug) {
            console.log('resetCounterAction triggered')
        }

        this.state.counter = 0
    }
}

export {
    fetchTags_SPARQL,
    publish,
    sendToCKAN,
    store
}
