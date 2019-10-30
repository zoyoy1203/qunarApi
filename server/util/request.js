const request = require('request');
const queryString = require('querystring')
const zlib = require('zlib')

const createRequest = (method, url, data, options) => {
    return new Promise((resolve, reject) => {   //两个参数 resolve 异步执行成功的回调函数,reject异步执行失败的回调函数

        const answer = { status: 500, body: {}, cookie: []}
        const settings = {
            method:method,
            url:url,
            headers: {
                "Accept": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "User-Agent":" Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
            },
            body: queryString.stringify(data)  //stringify这个方法是将一个对象序列化成一个字符串 body：需要传送的数据
        }
    
        request(
            settings,
            (err, res, body) => {
                if(err){
                    answer.status = 502;
                    answer.body = { code: 502, msg: err.stack};
                    reject(answer);
                } else {
                    answer.body = JSON.parse(body)
                    answer.status = answer.body.code || res.statusCode
                
                    answer.status =
                    100 < answer.status && answer.status < 600 ? answer.status : 400
                    if (answer.status == 200) resolve(answer)
                    else reject(answer)
                }
            }
        )
    })


}
module.exports = createRequest