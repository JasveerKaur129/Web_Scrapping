let request = require("request");
let cheerio = require("cheerio");
let scoreCardObj = require("./scorecard");
function getAllMatchesLink(url) {
    request(url, function (err, response, html) {
        if (err) {
            console.log(err);
        }
        else {
            extractAllLinks(html);
        }
    })
}
function extractAllLinks(html) {
    let searchTool = cheerio.load(html);
    let scorecardElems = searchTool("a[data-hover='Scorecard']");
    for (let i = 0; i < scorecardElems.length; i++) {
        let link = searchTool(scorecardElems[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com" + link;
        console.log(fullLink);
        scoreCardObj.ps(fullLink);
        // 
    }
}
module.exports = {
    gAlmatches: getAllMatchesLink
}