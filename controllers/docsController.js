const fs = require('fs');

exports.index = (_, res) => {
    return fs.readFile(__dirname + '/../public/docs.html', 'utf8', (__, text) => {
        res
            .set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'")
            .send(text);
    })
};

exports.getApiList = (_, res) => {
    return fs.readFile(__dirname + '/../public/api.json', 'utf8', (__, text) => {
        res.json(text);
    })
}
