# taxonomyservice

Intended to be used in the STREAM project under the subdomain tags.stream-dataspace.net

This is a VueJS 3 webapp.
It does provide CRUD operations on SKOS terms in a SPARQL endpoint.
In order to apply operations to the store, a button click is needed.
Each update of the RDF store could trigger sending a patch to all linked CKAN instances.
These instances have to have installed ckanext-tags in order to retrieve the patch and apply it to their datasets.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
