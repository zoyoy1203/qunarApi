// 爬电影库数据
const url = `https://touch.piao.qunar.com/touch/toNewCityList.htm`
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

//定义页面内容及Jquery,数据列表
var content , $
var result = []


;(async () => {
    console.log('Start movies')

    const browser = await puppeteer.launch({ // 打开一个虚拟浏览器
        args: ['--no-sandbox'],
        dumpio: false,
        // headless: false
    })

    const page = await browser.newPage()  // 打开一个页面
    await page.goto(url, {
        waitUntil: 'networkidle2'  // 当网页空闲的时候说明页面已经加载完毕了
    })
    await sleep(3000)

    content = await page.content()
    $ = cheerio.load(content)

    var cityList = {}
    var domestic = []
    var foreign = []
    var cities = []

    var num = 2
    while(num>0){
        if(num==2){
            var index = 7
            // 获取境内热门城市
            var list = ['A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','W','X','Y','Z']
            var domestic_hot = $('#city-domestic .mp-tr3 li')
            for(let i=0; i<domestic_hot.length; i++){
                var cityname = $($('#city-domestic .mp-tr3').children('li')[i]).children('a').text()
                cities.push({'city_name':cityname})
            }
            // console.log(cities)
            domestic.push({
                title:'热门城市',
                cities
            })
            cities=[]
            for(var i=0; i<list.length; i++){
                var tag = '#city-domestic ul:nth-child('+index+')'
                var list_li = $(tag).children('li')
        
                for(let j=0; j<list_li.length; j++){
                    var cityname = $( $(tag).children('li')[j]).children('a').text()
                    cities.push({'city_name':cityname})
                }
                var title = list[i]
                domestic.push({
                    title,
                    cities
                })
                cities = []
                index +=3
                
            }
        }else{
             // 获取境外热门城市
            var index = 7
            var list = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','Y','Z']
            var domestic_hot = $('#city-foreign .mp-tr3 li')
            for(let i=0; i<domestic_hot.length; i++){
                var cityname = $($('#city-foreign .mp-tr3').children('li')[i]).children('a').text()
                cities.push({'city_name':cityname})
            }
            foreign.push({
                title:'热门城市',
                cities
            })
            cities = []
            for(var i=0; i<list.length; i++){
                var tag = '#city-foreign ul:nth-child('+index+')'
                var list_li = $(tag).children('li')
        
                for(let j=0; j<list_li.length; j++){
                    var cityname = $( $(tag).children('li')[j]).children('a').text()
                    cities.push({'city_name':cityname})
                }
                var title = list[i]
                foreign.push({
                    title,
                    cities
                })
                cities = []
                index +=3
                
            }
        }

        num--
    }

    var list = {
        cityList:{
            domestic,
            foreign
        }
    }

    // console.log(domestic)
    // console.log('----------------------------')
    // console.log(list)
    // return 0

    await browser.close()
    // console.log(result)
    // console.log(result.length)

    process.send(list)
    process.exit(0)

})()