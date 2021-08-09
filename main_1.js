let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
let fs = require("fs");
let path = require("path");

let request = require("request");
let cheerio = require("cheerio");
let AllMatcgObj = require("./match");
// home page 
const iplPath = path.join(__dirname, "ipl");
dirCreater(iplPath);
request(url, cb);
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractLink(html);
    }
}
function extractLink(html) {
    let searchTool = cheerio.load(html);
    let anchorElem = searchTool("a[data-hover='View All Results']");
    let link = anchorElem.attr("href");
    // console.log(link);
    let fullLink = "https://www.espncricinfo.com" + link;
    // console.log(fullLink);
    AllMatcgObj.gAlmatches(fullLink);
}

function dirCreater(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }

}