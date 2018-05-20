var documents = require('./router');
var elastic = require('./elasticsearch');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const cors = require('cors');
//......

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
    limit: '50mb'
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/documents', documents);

var fs = require("fs");
var dataset = [];
var bulkJsonJob = [];
var bulkJsonCV = [];
exports.datasetLength;
fs.readFile('./Job-desc.geojson', 'utf8', function(err, data) {
    if (err) throw err;
    let json = JSON.parse(data).features;
    dataset = json.map((element) => element.properties);
    exports.datasetLength = dataset.length;
    let start = 0;
    let end = 489;
    for (let index = start; index < end; index++) {
        let element = dataset[index];
        bulkJsonJob.push({
            index: {
                _index: elastic.indexNameJob,
                _type: "document",
                _id: index
            }
        });
        bulkJsonJob.push({
            title: element.Tittle,
            duration: element.Duration,
            location: element.Location,
            jobDescription: element.JobDescription,
            jobRequirement: element.JobRequirment,
            requiredQual: element.RequiredQual,
        });
    }
    elastic.indexJobExists().then(function(exists) {
        if (exists) {
            return elastic.deleteIndex('job');
        }
    }).then(function() {
        return elastic.initIndexJob().then(function() {
            elastic.addJobs(bulkJsonJob);

        });
    });
});

// fs.readFile('./cvs.geojson', 'utf8', function(err, data) {
//     if (err) throw err;
//     let dataset = JSON.parse(data).cv;
//     console.log('settt', elastic.indexNameCV)
//     datasetLength = dataset.length;
//     dataset.forEach((element, index) => {
//         bulkJsonCV.push({
//             index: {
//                 _index: elastic.indexNameCV,
//                 _type: "document",
//                 _id: index
//             }
//         });
//         bulkJsonCV.push({
//             fullname: element.fullname,
//             summary: element.summary,
//             workExperience: element.workExperience,
//             skills: element.skills
//         });
//     });
//     elastic.indexCVExists().then(function(exists) {
//         if (exists) {
//             return elastic.deleteIndex('cv');
//         }
//     }).then(function() {
//         return elastic.initIndexCV().then(function() {
//             console.log('bulk index cv')
//             return elastic.addCVs(bulkJsonCV);

//         }).then(() => {
//             console.log('hear');
//             let promise = createTempIndex(dataset);
//         })
//     }).catch(err => {
//         console.log('errr: ', err)
//     })
// });

// async function createTempIndex(dataset) {
//     let start = 0;
//     let end = 100;
//     for (let index = start; index < end; index++) {
//         let element = dataset[index];
//         let initTempIndex = await elastic.initTempIndexCV(index);
//         let addTempCV = await elastic.addTempCV(index, {
//             fullname: element.fullname,
//             summary: element.summary,
//             workExperience: element.workExperience,
//             skills: element.skills
//         });
//         console.log('complete one');
//     }
//     return Promise.resolve('oke');
// }




var server = require('http').Server(app);
server.listen(port, () => {
    console.log('Server is running on port ' + port);
})