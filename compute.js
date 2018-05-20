// var datasetLength = 489;
// var Matrix = require('node-matrix');
var Matrix = require('node-matrices');
var distance = require('compute-cosine-distance');
var zeros = require("zeros");
var similarity = require('compute-cosine-similarity');

exports.generateWeightMatrix = (json, datasetLength, idCv) => {
    // var weightMatrix = Matrix({
    //     rows: json.length,
    //     columns: datasetLength,
    //     values: 0
    // });
    // var maxWeightMatrix = Matrix({
    //     rows: json.length,
    //     columns: 1,
    //     values: 0
    // })
    let idCV = idCv + 'cv';
    var weightMatrix = [];
    var vectorQuery = new Array(json.length).fill(0);
    for (let i = 0; i < datasetLength; i++) {
        let newArray = new Array(json.length).fill(0)
        weightMatrix.push(newArray);
    }
    json.forEach((objectJson, indexTerm) => {
        objectJson.hits.hits.forEach((element, indexDoc) => {
            if (element._id + '' !== idCV + '') {
                let id = parseInt(element._id);
                weightMatrix[id][indexTerm] = element._score;
            } else {
                vectorQuery[indexTerm] = element._score;
            }

        })
    })
    console.log('length matrix', weightMatrix.length);
    return {
        weightMatrix: weightMatrix,
        vectorQuery: vectorQuery
    }
}

cosineScore = function(Q, D) {
    let mauSo;
    let n = Q.length;
    let tuSo = 0;
    let mauSo1 = 0;
    let mauSo2 = 0;
    for (i = 0; i < n; i++) {
        tuSo = tuSo + Q[i] * D[i];
        mauSo1 = mauSo1 + Q[i] * Q[i];
        mauSo2 = mauSo2 + D[i] * D[i];
    }
    var Sim = tuSo / (Math.sqrt(mauSo1) * Math.sqrt(mauSo2));
    return Sim;
}

exports.rankDocuments = (jobWeightMatrix, cvVector, datasetLength) => {
    let cosinSim = [];
    for (let i = 0; i < datasetLength; i++) {
        let sim = cosineScore(jobWeightMatrix[i], cvVector);
        if (!isNaN(sim)) {
            cosinSim.push({
                sim: sim,
                docId: i
            });
        } else {
            cosinSim.push({
                sim: 0,
                docId: i
            });
        }

    }
    let rankedList = cosinSim.sort((a, b) => b.sim - a.sim);
    let rankedListIDs = rankedList.map(element => element.docId);
    console.log('sort: ', rankedList.map(element => element.sim));
    return rankedListIDs;
}

getSumSquare = (array) => {
    let sum = array.reduce((accumulator, currentValue) => {
        return accumulator + currentValue * currentValue
    }, 0);
    return Math.sqrt(sum);
}

exports.processObject = (object, termsVector) => {
    let doc = {
        indexElasticsearch: '',
        source: {
            code: '',
            jobName: '',
            jobDescription: ''
        },
        weight: '',
        tf: 0,
        idf: 0
    }
    let termsList = {
        termsVector: [],
        docs: []
    }
    termsList.termsVector = termsVector;
    for (let i = 0; i < object.length; i++) {
        termsList.docs.push({
            term: termsVector[i],
            docs: []
        })
        for (let j = 0; j < object[i].hits.hits.length; j++) {
            let docLocal = {
                indexElasticsearch: object[i].hits.hits[j]._index,
                source: object[i].hits.hits[j]._source,
                weight: object[i].hits.hits[j]._score,
                tf: object[i].hits.hits[j]._explanation.details[0].details[1].details[0].value,
                idf: object[i].hits.hits[j]._explanation.details[0].details[0].value,
            }
            termsList.docs[i].docs.push(docLocal);
        }
    }
    // object.forEach((element1, index1) => {
    //     termsList.docs.push({
    //         term: termsVector[index1],
    //         docs: []
    //     })
    //     element1.hits.hits.forEach((element2, index2) => {
    //         let docLocal = {
    //             indexElasticsearch: element2._index,
    //             source: element2._source,
    //             weight: element2._score,
    //             tf: element2._explanation.details[0].details[1].details[0].value,
    //             idf: element2._explanation.details[0].details[0].value,
    //         }
    //         termsList.docs[index1].docs.push(docLocal);
    //     })
    // })
    return termsList;
}