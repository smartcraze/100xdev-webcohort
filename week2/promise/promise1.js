const fs = require('fs');

function readFileCallback(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        callback(null, data);
    });
}

// Usage
readFileCallback('/path/to/file.txt', (err, data) => {
    if (err) {
        return console.error('Error reading file:', err);
    }
    console.log('File content:', data);
});

