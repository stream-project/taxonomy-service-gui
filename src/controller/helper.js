async function fetchTags_SPARQL() {
    const SimpleClient = require('sparql-http-client/SimpleClient')

    const endpointUrl = 'https://sparql.stream-dataspace.net/sparql/';
    const query = `
    PREFIX ex: <http://stream-ontology.com/tags/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    select ?subject ?label
    where { ?subject a skos:Concept ;
                  skos:prefLabel ?label .  }`;

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
            uri: row.subject.value
        });
        i++;
    }
    
    return list.sort();
}

export {
    fetchTags_SPARQL
}
