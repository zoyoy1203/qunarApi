//爬景点详情页
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const base = 'http://touch.piao.qunar.com/touch/detail_'

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

process.on('message', async (hostList) => { 
    console.log('开始访问目标页面')
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        // headless: false //打开页面
    })
    const page = await browser.newPage()
  
    for (let i = 0; i < hostList.length; i++) {
        var sightGroup = hostList[i].sightGroup
        for (let j=0; j<sightGroup.length; j++){
            var id = sightGroup[j].id
            console.log('id'+id)
            await page.goto(base + id +'.html', {
                waitUntil: 'networkidle2'
            })

            await sleep(2000)
            content = await page.content()
            $ = cheerio.load(content)

            var baseinfo ={}
            var ticketRecommend = []
            var tags = []
            var result = {}
            
            var imgbg = $('#imgcontainer img').attr('src')
            var title = $('.mp-headfeagure-info .mp-headfeagure-title').text()


            var item = $('.mp-main .mp-baseinfo .mpg-flexbox .mpg-flexbox-item')
            var score = item.find('div:nth-child(2) .mp-commentcard-score').text()
            var desc = item.find('div:nth-child(2) .mp-commentcard-desc').text()
            var comment_num = item.find('div:nth-child(3) span:nth-child(1).mp-totalcommentnum').text()
            var raiders_num = item.find('div:nth-child(3) span:nth-child(2).mp-totalcommentnum').text()
            var addr = $('.mp-main .mp-baseinfo .mp-baseinfo-address p.mp-baseinfo-address-txt').text()
            var address = addr.substr(1)
            address = address.substr(0,address.length-1)
            baseinfo = {
                score,
                desc,
                comment_num,
                raiders_num,
                address
            }

            var recItems = $('#list-container .mp-ticket-container .mp-promote').children('.mp-ticket-item')
            for(var t=0; t<recItems.length; t++){
                var recItem = $($('#list-container .mp-ticket-container .mp-promote').children('.mp-ticket-item')[t])
                var recTitle = recItem.find('.mp-ticket-main>div h6').text()
                var recTags = recItem.find('.mp-ticket-main>div .mp-ticket-labelcon').children('span')
                for(var n=0; n<recTags.length; n++){
                    var tag =  $(recItem.find('.mp-ticket-main>div .mp-ticket-labelcon').children('span')[n]).text()
                    tags.push(tag)
                }
                var price = recItem.find('.mp-ticket-side a strong em.mp-price-num').text()
                var categor = recItem.find('.mp-ticket-side a em.mp-ticket-btn').text()

                ticketRecommend.push({
                    'title':recTitle,
                    tags,
                    price,
                    categor
                })
            }
            
            result = {
                id,
                title,
                imgbg,
                baseinfo,
                ticketRecommend,
            }
 

           process.send(result)


        }
    }
    
    
    browser.close()
    process.exit(0)
})


