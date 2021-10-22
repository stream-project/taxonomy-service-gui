async function fetchTags_SPARQL() {
    // TODO
    var p = new Promise((resolve, reject) => {
        resolve([{'name': 'metal', 'uri': 'http://example.com/s9udfhsfs8fh', 'id': 0},
            {'name': 'wood', 'uri': 'http://example.com/udfhsfsd8fh', 'id': 1}]);
    
        var a = 2;
        if (a === 1)
            reject([]);
    });
    var res = await p;
    return res;
}

export {
    fetchTags_SPARQL
}
