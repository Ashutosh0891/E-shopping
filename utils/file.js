const fs=require('fs');

const deleteFile=(filePath)=>{
    fs.unlink(filePath,(err)=>{  //it deletes name and file that is connected to the name
        if(err){
            throw(err)
        }
    })
}

exports.deleteFile=deleteFile;