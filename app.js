const http = require('http');
const https = require('https');

const port = 3000;
const hostname = '127.0.0.1';

function getDataFromGit(response, userUrl) {

    let userUrlLen = userUrl.split('/').filter(ele => ele !== '').length;

    if(userUrlLen>4){
        const errResponse = {error: '400: bad request', message: 'extra inputs found'}
        response.statusCode = 400;
        response.write(JSON.stringify(errResponse));
        response.end();
        return;
    }else if (userUrlLen === 1) {
        const errResponse = {error: '400: bad request', message: 'please enter repo, branch and file name'}
        response.statusCode = 400;
        response.write(JSON.stringify(errResponse));
        response.end();
        return;
    } else if (userUrlLen === 2) {
        const errResponse = {error: '400: bad request', message: 'please enter branch and file name'}
        response.statusCode = 400;
        response.write(JSON.stringify(errResponse));
        response.end();
        return;
    } else if (userUrlLen === 3) {
        const errResponse = {error: '400: bad request', message: 'please enter file name'}
        response.statusCode = 400;
        response.write(JSON.stringify(errResponse));
        response.end();
        return;
    } else {
        const fileName = userUrl.split('/').filter(ele => ele !== '')[3];
        if (fileName.substr(fileName.length-5,fileName.length-1)!=='.json')
        {
            const errResponse = {error: '400: bad request', message: 'file extension should be .json'}
            response.statusCode = 400;
            response.write(JSON.stringify(errResponse));
            response.end();
            return;
        }
    }

    const url = `https://raw.githubusercontent.com${userUrl}`;
    let data = '';

    const requestToGit = https.request(url, (responseFromGit) => {

        responseFromGit.on('data', (chunk) => {
            data = data + chunk.toString();
        });

        responseFromGit.on('end', () => {
            if (data[0] === '4') {
                const errResponse = {error: data, message: 'please check the userid, repo, branch and file name'}
                response.statusCode = data.substr(0, 3);
                response.write(JSON.stringify(errResponse));
            } else {
                response.statusCode = 200;
                response.write(data);
            }
            response.end();
        });
    }).end();

    requestToGit.on('error', (error) => {
        const errMsg = {error: error, errorhello: ''}
        response.end(JSON.stringify(errMsg));
    });
}

const server = http.createServer()

server.on('request', (request, response) => {
    getDataFromGit(response, request.url);
});

server.listen(port, hostname, () => {
    console.log('server stared');
});


/*
        try {
   } catch (e) {
            const errResponse = {error: 'internal error', message: 'fixing, come back later'}
            response.statusCode = 500;
            response.write(JSON.stringify(errResponse));
        }
 */