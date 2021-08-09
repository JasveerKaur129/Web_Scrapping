    let request = require("request");
let cheerio = require("cheerio");
let path = require("path");
let fs = require("fs");
let xlsx=require("xlsx");
// home page 
function processScorecard(url) {

    request(url, cb);
}
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        // console.log(html);
        extractMatchDetails(html);
    }
}
function extractMatchDetails(html) {
   
    let searchTool = cheerio.load(html);
    let descElem = searchTool(".event .description");
    let result = searchTool(".event .status-text");
    let stringArr = descElem.text().split(",");
    let venue = stringArr[1].trim();
    let date = stringArr[2].trim();
    result = result.text();
    let innings = searchTool(".card.content-block.match-scorecard-table>.Collapsible");
    // let htmlString = "";
    for (let i = 0; i < innings.length; i++) {
        
        let teamName = searchTool(innings[i]).find("h5").text();
        teamName = teamName.split("INNINGS")[0].trim();
        let opponentIndex = i == 0 ? 1 : 0;
        let opponentName = searchTool(innings[opponentIndex]).find("h5").text();
        opponentName = opponentName.split("INNINGS")[0].trim();
        let cInning = searchTool(innings[i]);
        console.log(`${venue}| ${date} |${teamName}| ${opponentName} |${result}`);
        let allRows = cInning.find(".table.batsman tbody tr");
        for (let j = 0; j < allRows.length; j++) {
            let allCols = searchTool(allRows[j]).find("td");
            let isWorthy = searchTool(allCols[0]).hasClass("batsman-cell");
            if (isWorthy == true) {
                
                let playerName = searchTool(allCols[0]).text().trim();
                let runs = searchTool(allCols[2]).text().trim();
                let balls = searchTool(allCols[3]).text().trim();
                let fours = searchTool(allCols[5]).text().trim();
                let sixes = searchTool(allCols[6]).text().trim();
                let sr = searchTool(allCols[7]).text().trim();
                console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result);
            }
        }
    }
    console.log("`````````````````````````````````````````````````");
    // console.log(htmlString);
}
function processPlayer(teamName, playerName, runs, balls, fours, sixes, sr, opponentName, venue, date, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        sr,
        opponentName,
        venue,
        date,
        result
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}

function dirCreater(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath);
    }

}
function excelWriter(filePath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    xlsx.writeFile(newWB, filePath);
}

function excelReader(filePath, sheetName) {
    if (fs.existsSync(filePath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filePath);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {
    ps: processScorecard
}