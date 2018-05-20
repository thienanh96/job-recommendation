var express = require('express');
var router = express.Router();
var compute = require('./compute');
var elastic = require('./elasticsearch');
var jobDatasetLength = 489;
var cvDatasetLength = 6;
var sw = require('stopword')

/* GET suggestions */

router.get('/index/:indexName/analyze/:id', function(req, res, next) { //recommendation
    let modifiedID = parseInt(req.params.id);
    return elastic.getTermAnalysis(modifiedID + '', req.params.indexName + '', ['summary']).then(resp => {
        console.log('resp', resp)
        let start = Date.now();
        let termObject = resp.term_vectors.summary.terms;
        let termVectors = Object.getOwnPropertyNames(termObject);
        console.log('term vec', termVectors);
        termVectors = sw.removeStopwords(termVectors);
        let matchedJobPromise = elastic.getMatchJobs(termVectors.join(" "), modifiedID + '');
        Promise.resolve(matchedJobPromise).then(value => {
            let weight = compute.generateWeightMatrix(value, jobDatasetLength, modifiedID);
            let matrixDocuments = weight.weightMatrix;
            let id = modifiedID;
            let vectorQuery = weight.vectorQuery;
            console.log('VECTOR_QUERY', vectorQuery);
            let rankedListIDs = compute.rankDocuments(matrixDocuments, vectorQuery, jobDatasetLength);
            let end = Date.now();
            console.log('CURRENT: ', (end - start) / 1000);
            elastic.getDocumentsByID(rankedListIDs, 'job').then(result => {
                return res.json(result);
            })
        })
    });
});

/* POST document to be indexed */
router.post('/', function(req, res, next) {
    elastic.addDocument(req.body).then(function(result) {
        return res.json(result)
    });
});

router.get('/index/:indexName', function(req, res, next) { // lay cv va job ve
    return elastic.getDocs(req.params.indexName + '').then(docs => {
        return res.json(docs.hits.hits);
    })
})



module.exports = router;