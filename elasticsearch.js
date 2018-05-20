var elasticsearch = require('elasticsearch');
var idDocumentArray = [];

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var indexNameJob = "job";
var indexNameCV = "cv";
exports.indexNameJob = indexNameJob;
exports.indexNameCV = indexNameCV;
var fs = require("fs");
/**
 * Delete an existing index
 */
function deleteIndex(indexName) {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndexJob() {
    return elasticClient.indices.create({
        index: indexNameJob,
        body: {
            properties: {
                title: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                duration: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                location: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                jobDescription: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                jobRequirement: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                requireQual: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                }
            },
            settings: {
                index: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                analysis: {
                    analyzer: {
                        fulltext_analyzer: {
                            type: "custom",
                            tokenizer: "whitespace",
                            filter: [
                                "lowercase",
                                "type_as_payload"
                            ]
                        }
                    }
                }
            }
        }


    });
}

function initIndexCV() {
    return elasticClient.indices.create({
        index: indexNameCV,
        body: {
            properties: {
                fullname: {
                    type: 'text'
                },
                workExperience: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                summary: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                skills: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                }
            },
            settings: {
                index: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                analysis: {
                    analyzer: {
                        fulltext_analyzer: {
                            type: "custom",
                            tokenizer: "whitespace",
                            filter: [
                                "lowercase",
                                "type_as_payload"
                            ]
                        }
                    }
                }
            }
        }


    });
}

function initTempIndexCV(id) {
    return indexTempExists(id).then(exist => {
        if (exist) {
            console.log('delete');
            return deleteIndex('tempindex' + id);
        } else {
            console.log('xoa het r_________________________')
        }
    }).then(() => {
        console.log('non exist')
        return elasticClient.indices.create({
            index: "tempindex" + id,
            body: {
                properties: {
                    fullname: {
                        type: 'text'
                    },
                    workExperience: {
                        type: 'text',
                        term_vector: "with_positions_offsets_payloads",
                        store: true,
                        analyzer: "fulltext_analyzer"
                    },
                    summary: {
                        type: 'text',
                        term_vector: "with_positions_offsets_payloads",
                        store: true,
                        analyzer: "fulltext_analyzer"
                    },
                    skills: {
                        type: 'text',
                        term_vector: "with_positions_offsets_payloads",
                        store: true,
                        analyzer: "fulltext_analyzer"
                    }
                },
                settings: {
                    index: {
                        number_of_shards: 1,
                        number_of_replicas: 0
                    },
                    analysis: {
                        analyzer: {
                            fulltext_analyzer: {
                                type: "custom",
                                tokenizer: "whitespace",
                                filter: [
                                    "lowercase",
                                    "type_as_payload"
                                ]
                            }
                        }
                    }
                }
            },

        });
    })
}

function addTempCV(id, documentt) {
    return elasticClient.bulk({
        body: [{
            index: {
                _index: 'tempindex' + id,
                _type: "document",
                _id: id + 'cv'
            }
        }, {
            fullname: documentt.fullname,
            skills: documentt.skills,
            workExperience: documentt.workExperience,
            summary: documentt.summary
        }]
    });
}
exports.addTempCV = addTempCV;
exports.initTempIndexCV = initTempIndexCV;
exports.initIndexJob = initIndexJob;
exports.initIndexCV = initIndexCV;

/**
 * check if the index exists
 */
function indexJobExists() {
    return elasticClient.indices.exists({
        index: indexNameJob
    });
}

function indexCVExists() {
    return elasticClient.indices.exists({
        index: indexNameCV
    });
}

function indexTempExists(id) {
    return elasticClient.indices.exists({
        index: 'tempindex' + id
    });
}


function initMappingJob() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                title: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                duration: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                location: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                jobDescription: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                jobRequirement: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                requireQual: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                }
            },
            settings: {
                index: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                analysis: {
                    analyzer: {
                        fulltext_analyzer: {
                            type: "custom",
                            tokenizer: "whitespace",
                            filter: [
                                "uppercase",
                                "type_as_payload"
                            ]
                        }
                    }
                }
            }
        }
    });
}

function initMappingCV() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: "document",
        body: {
            properties: {
                fullname: {
                    type: 'text'
                },
                workExperience: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                summary: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                },
                skills: {
                    type: 'text',
                    term_vector: "with_positions_offsets_payloads",
                    store: true,
                    analyzer: "fulltext_analyzer"
                }
            },
            settings: {
                index: {
                    number_of_shards: 1,
                    number_of_replicas: 0
                },
                analysis: {
                    analyzer: {
                        fulltext_analyzer: {
                            type: "custom",
                            tokenizer: "whitespace",
                            filter: [
                                "uppercase",
                                "type_as_payload"
                            ]
                        }
                    }
                }
            }
        }
    });
}

function countDocuments() {
    return elasticClient.count({
        index: indexName
    }, (err, response) => {
        console.log('count', response.count);
    })
}

exports.countDocuments = countDocuments;

function addJobs(documents) {
    return elasticClient.bulk({
        body: documents
    }, (err, response, status) => {
        console.log(';engthhh', documents.length)
            // response.items.forEach(item => {
            //     idDocumentArray.push(item.index._id);
            // })
    });
}

function addCVs(documents) {
    return elasticClient.bulk({
        body: documents
    });
}

function addOneDocument(document) {
    return elasticClient.index({
        index: indexName,
        type: "document",
        body: document
    }, (err, response, status) => {
        console.log('repppp', response)
    })
}

exports.addOneDocument = addOneDocument;

async function getMatchJobs(input, id) {
    let suggestResults = [];
    let countResponses = 0;
    let inputLength = input.split(" ").length;
    for (let word of input.split(" ")) {
        let data = await elasticClient.search({
            index: [indexNameJob, 'tempindex' + id],
            type: "document",
            body: {
                query: {
                    multi_match: {
                        query: word,
                        fields: ["jobDescription", "jobRequirement^3", "location", "requiredQual^9", "summary", "workExperience", "skills"],
                        fuzziness: 'AUTO',
                    },
                },
                size: 1111,
            }
        });
        suggestResults.push(data);
    }

    return suggestResults;
}

// async function getMatchCVs(input) {
//     let suggestResults = [];
//     let countResponses = 0;
//     let inputLength = input.split(" ").length;
//     for (let word of input.split(" ")) {
//         let data = await elasticClient.search({
//             index: [indexNameJob, indexNameCV],
//             type: "document",
//             body: {
//                 query: {
//                     multi_match: {
//                         query: word,
//                         fields: ['skill']
//                     },
//                 },
//                 explain: true,
//                 size: 1111
//             }
//         });
//         suggestResults.push(data);
//     }

//     return suggestResults;
// }

async function getDocumentsByID(IDs, indexName) {
    let docs = [];
    for (let id of IDs) {
        let doc = await elasticClient.get({
            index: indexName,
            type: "document",
            id: id
        })
        docs.push(doc);

    }
    return docs;
}
exports.getDocumentsByID = getDocumentsByID;

function getDocs(indexName) {
    return elasticClient.search({
        index: indexName,
        type: "document",
        body: {
            query: {
                match_all: {}
            },
            size: 10000
        }
    })
}
exports.getDocs = getDocs;

function getTermAnalysis(id, indexName, fieldToAnalyze) { //return promise
    return elasticClient.termvectors({
        index: indexName,
        type: "document",
        termStatistics: false,
        fieldStatistics: false,
        fields: fieldToAnalyze,
        offsets: false,
        payloads: false,
        positions: false,
        id: id + ''
    })
}

exports.indexJobExists = indexJobExists;
exports.indexCVExists = indexCVExists;
exports.initMappingJob = initMappingJob;
exports.initMappingCV = initMappingCV;
exports.getMatchJobs = getMatchJobs;
exports.addJobs = addJobs;
exports.addCVs = addCVs;
exports.getTermAnalysis = getTermAnalysis;