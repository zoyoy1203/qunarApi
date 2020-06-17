//爬景点详情页
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const base = 'http://touch.piao.qunar.com/touch/getSightImgs.htm?sightId='

const sleep = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
})

// 获取参数
function getvar(url,par){
    var urlsearch = url.split('?');
    pstr = urlsearch[1].split('&');
    for (var i = pstr.length - 1; i >= 0; i--) {
        var tep = pstr[i].split("=");
        if(tep[0] == par){
            return tep[1];
        }
    }
    return(false);
}	


//定义页面内容及Jquery,数据列表
var content , $

process.on('message', async (cityDetails) => { 
    console.log('开始访问目标页面')
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        // headless: false //打开页面
    })
    const page = await browser.newPage()
  
    for (let i = 0; i < cityDetails.length; i++) {
        var hostList = cityDetails[i].hostList
        for (let j=0; j<hostList.length; j++){
            var id = hostList[j].id
            console.log('id'+id)
            await page.goto(base + id, {
                waitUntil: 'networkidle2'
            })

            await sleep(2000)
            content = await page.content()
            $ = cheerio.load(content)

            var imgs = []
            var imagesDom = $('.mp-images-list .mp-images-con')
            for(var i=0; i<imagesDom.length;i++) {
                var img = $($('.mp-images-list').children('.mp-images-con')[i]).find('img').attr('src')
                imgs.push(img)
            }


            result = {
                'sightId':id,
                imgs
            }

            console.log(result);
            return 0
           process.send(result)


        }
    }
    
    
    browser.close()
    process.exit(0)
})


