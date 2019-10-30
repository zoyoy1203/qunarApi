//爬电影详情数据
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const base = 'http://touch.piao.qunar.com/touch/weekHotSales.htm?cityName='

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
var result = []


process.on('message', async (cities) => { 
    console.log('开始访问目标页面')

    var cityList = cities[0].cityList.domestic[0].cities

    // console.log(cityList)
    // return 0

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        // headless: false //打开页面
    })
    const page = await browser.newPage()

    var sightGroup = []
    var daytripGroup = []
    var comment_item = {}
    var comment_img = []
    var hostList = {}

    for (let i = 0; i < cityList.length; i++) {
        //获取地名，地名Id
        let cityName = cityList[i].city_name
        let cityId = cityList[i]._id
        
        await page.goto(base + cityName, {
          waitUntil: 'networkidle2'
        })
        await sleep(3000)

        var num = 0
        // 循环刷新i次
        while ( num < 6) {
            await page.evaluate(async (num) => {
                /* 这里做的是渐进滚动，如果一次性滚动则不会触发获取新数据的监听 */
                console.log('开始滚动')
                for (var y = 0; y <= 2000*num; y += 100) {
                    window.scrollTo(0,y)
                }
            },num)
            await sleep(2000)
            num++
        }
        
    
        // await sleep(3000)



        content = await page.content()
        $ = cheerio.load(content)
        
       //获取顶部背景图
        var imgbg = $('#mp-main .mp-imgavatar img').attr('src')
        // 获取顶部标题
        var toptitle = $('#mp-main .mp-imgavatar .mp-imgavatar-poptext').text().replace(/^\s*|\s*$/g,"");
        //获取top景点
        var sightList = $($('#sightGroup').children('li'))

        for(let i=0; i<sightList.length; i++){
            var item = $($('#sightGroup').children('li')[i])
            var img = item.find('a .mp-product-imgcon img').attr('src')
            var title = item.find('a .mp-product-info h4').text()
            var like_num = item.find('a .mp-product-info .mp-product-taglist .mp-product-light:nth-child(1)').text()
            var comment_num = item.find('a .mp-product-info .mp-product-taglist .mp-product-light:nth-child(3)').text()
            var price = item.find('a .mp-product-info .mp-product-priceinfo span .mp-product-quanrpricenum').text()
        
            var name = item.find('a .mp-comments-con .mp-comments-item .mp-content-level>span:nth-child(2)').text()
            var date = item.find('a .mp-comments-con .mp-comments-item .mp-content-level .mp-comments-date').text()
            var comment_text = item.find('a .mp-comments-con .mp-comments-item .mp-comments-text').text()
           
            var url = item.find('a').attr('href')
            var id = url.match(/detail_(\S*).html/)[1]

            var imgs = item.find('a .mp-comments-con .mp-comments-item div:nth-child(4)>div img')
            for(let j=0; j<imgs.length; j++){
                var c_img = $(item.find('a .mp-comments-con .mp-comments-item div:nth-child(4)>div').children('img')[j]).attr('src')
                comment_img.push(c_img)
            }
          
            comment_item = {
                name,
                date,
                comment_text,
                comment_img
            }
            var comment_img = []
            sightGroup.push({
                id,
                img,
                title,
                like_num,
                comment_num,
                price,
                comment_item
                
            })
        }

        // console.log(sightGroup)
      

        //  获取top线路
        var sightList = $($('#daytripGroup').children('li'))
        for(let i=0; i<sightList.length; i++){
            var item = $($('#daytripGroup').children('li')[i])
            var img = item.find('a .mp-product-imgcon img').attr('src')
            var title = item.find('a .mp-product-info h4').text()
            var like_num = item.find('a .mp-product-info .mp-product-taglist .mp-product-light:nth-child(1)').text()
            var comment_num = item.find('a .mp-product-info .mp-product-taglist .mp-product-light:nth-child(3)').text()
            var price = item.find('a .mp-product-info .mp-product-priceinfo span .mp-product-quanrpricenum').text()
        
            var name = item.find('a .mp-comments-con .mp-comments-item .mp-content-level>span:nth-child(2)').text()
            var date = item.find('a .mp-comments-con .mp-comments-item .mp-content-level .mp-comments-date').text()
            var comment_text = item.find('a .mp-comments-con .mp-comments-item .mp-comments-text').text()
            
            var url = item.find('a').attr('href')
            var id = getvar(url,'spuId')

            var imgs = item.find('a .mp-comments-con .mp-comments-item div:nth-child(4)>div img')
            for(let j=0; j<imgs.length; j++){
                var c_img = $(item.find('a .mp-comments-con .mp-comments-item div:nth-child(4)>div').children('img')[j]).attr('src')
                comment_img.push(c_img)
            }
          
          
            comment_item = {
                name,
                date,
                comment_text,
                comment_img
            }
            var comment_img = []
            daytripGroup.push({
                id,
                img,
                title,
                like_num,
                comment_num,
                price,
                comment_item
                
            })
        }

        hostList = {
            cityName,
            cityId,
            imgbg,
            toptitle,
            sightGroup,
            daytripGroup
        }
        process.send(hostList)
        var sightGroup = []
        var daytripGroup = []
        var comment_item = {}
        var comment_img = []
        var hostList = {}
        
      }

      browser.close()
      process.exit(0)
    
})