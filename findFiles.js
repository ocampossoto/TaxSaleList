var path = require('path'), fs=require('fs');

module.exports = fromDir = (startPath,filter)=>{
    var filesArr = [];
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter); //recurse
        }
        else if (filename.indexOf(filter)>=0) {
            filesArr.push(filename);
            //console.log('-- found: ',filename);
        };
    };
    return filesArr;
};

// console.log(fromDir('./','.xls'));