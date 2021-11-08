const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');
var xlsx = require('node-xlsx');
var fromDir = require('./findFiles');
const location = "./docs/";
const convertToCSV = () => {
    var xlsFiles = fromDir(location, '.xls');
    xlsFiles.forEach(item => {
        justName = item.replace('.xls', "");
        var obj = xlsx.parse(item); // parses a file
        var rows = [];
        var writeStr = "";

        //looping through all sheets except 1st one
        for (var i = 1; i < obj.length; i++) {
            var sheet = obj[i];
            //loop through all rows in the sheet
            for (var j = 0; j < sheet['data'].length; j++) {
                //add the row to the rows array
                var temp = sheet['data'];
                var type = temp[j][4];
                if (type == "V" || type == "I") {
                    if (temp[j][3] != undefined) {
                        //remove commas.
                        temp[j][3] = temp[j][3].replace(",", "");
                        temp[j][3] = temp[j][3].replace("\n", " ");
                    }
                    if (temp[j][2] != undefined) {
                        temp[j][2] = "";// temp[j][2].replace(",","");
                    }
                    if (temp[j][5] != undefined) {
                        price = temp[j][5].match(/\$ ([0-9]+[\.,0-9]*)/g);
                        if (price != null) {
                            temp[j][5] = price[0].replace(",", "");
                        }

                    }
                    rows.push(temp[j]);
                }
            }
        }
        var jsonData = [];
        //creates the csv string to write it to a file
        for (var i = 1; i < rows.length; i++) {
            if (rows[i].length > 0) {
                var data = rows[i];
                writeStr += rows[i].join(",") + "\n";
                jsonData.push(
                    {
                        parcel: data[0],
                        actionNumber: data[1],
                        address: data[3],
                        type: data[4],
                        startingBid: data[5]
                    }
                )
            }

        }
        //writes to a file, but you will presumably send the csv as a      
        //response instead
        fs.writeFile(justName + ".csv", writeStr, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(justName + ".csv" + " was saved in the current directory!");
        });
        fs.writeFile(justName + ".json", JSON.stringify(jsonData), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(justName + ".json" + " was saved in the current directory!");
        });

    })
}


const downloadFile = (listName) => {
    const file = fs.createWriteStream(location + listName);
    http.get("http://maps.wycokck.org/gisdata/taxsale/"+listName, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(convertToCSV);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink("TaxSale349.xls"); // Delete the file async. (But we don't check the result)
        // if (cb) cb(err.message);
    });
}

downloadFile("TaxSale349.xls");
downloadFile("TaxSale350.xls");
