//爬电影详情数据
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const base = 'https://touch.piao.qunar.com/touch/index_'

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

    // return 0

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        // headless: false //打开页面
    })
    const page = await browser.newPage()

    var cityDetail = []
    var banners = []
    var icons = []
    var hostList = []
    var likeList = []
    var weekendTrip =[]


    var num = 11
    while(num <=22 ){
        var cityList = cities[0].cityList.domestic[num].cities
        console.log(cityList)

        for (let i = 0; i < cityList.length; i++) {
            //获取地名，地名Id
            let cityName = cityList[i].city_name
            let cityId = cityList[i]._id
        
            console.log(cityName)
            console.log(cityId)
            
            await page.goto(base + cityName+'.html', {
              waitUntil: 'networkidle2'
            })
            await sleep(3000)
            content = await page.content()
            $ = cheerio.load(content)
            
            // 轮播图
            var swipe_item = $('#img-slider .mpw-swipe-wrap').children('.mpw-swipe-item')
            for(let i=0; i<swipe_item.length; i++){
                var img = $($('#img-slider .mpw-swipe-wrap').children('.mpw-swipe-item')[i]).find('a img').attr('src')
                banners.push(img)
            }
    
            // icons
            var  category_container= $('#category-container .mpw-swipe-wrap').children('.mpw-swipe-item')
            for(let i=0; i<category_container.length; i++){
                var item = $($('#category-container .mpw-swipe-wrap').children('.mpw-swipe-item')[i]).find('.mp-category-item')
                for(let j=0; j<item.length; j++){
                    var img = $(item.children('a')[j]).find('.mp-category-img-container img').attr('src')
                    var keyword =  $(item.children('a')[j]).find('.keywords').text()
            
                    icons.push({
                        'img':img,
                        'keyword':keyword
                    })
                }
               
            }
            
            // 热门榜单
            var hotsale_list = $('.mp-hotsale-list').children('li')
            for(let i=0; i<hotsale_list.length; i++){
                var item = $($('.mp-hotsale-list').children('li')[i])
                var img = item.find('a .mp-hotsale-imgcon img').attr('src')
                var title = item.find('a .mp-hotsale-sight').text()
                var price = item.find('a .mp-hotsale-price .mpg-price .mpg-price-num').text()
                var url = item.find('a').attr('href')
                var id = getvar(url,'id')
                // console.log('热门榜单：'+id)
                hostList.push({
                    'id':id,
                    'img':img,
                    'title':title,
                    'price':price
                })
            }
    
            // 猜你喜欢
            var like_list = $('.mp-like-list').children('li')
            for(let i=0; i<like_list.length; i++){
                var item = $($('.mp-like-list').children('li')[i])
                var img = item.find('a .mp-like-imgcon img').attr('src')
                var tag =  item.find('a .mp-like-tag').text()
                var title = item.find('a .mp-like-info .mp-like-title').text()
                var score = item.find('a .mp-like-info .mp-like-comment .mpf-starlevel').attr('data-score')
                var comment_num = item.find('a .mp-like-info .mp-like-comment .mp-comment-num').text()
                var  price = item.find('a .mp-like-info .mp-like-price .mpg-price .mpg-price-num').text()
                var address = item.find('a .mp-like-info .mp-like-price .mp-like-address').text()
                var feature = item.find('a .mp-like-info .mp-like-feature .mp-ellipsis2').text()
                var url = item.find('a').attr('href')
                var id = getvar(url,'id')
                // console.log('猜你喜欢：'+id)
    
                likeList.push({
                    'id':id,
                    'img':img,
                    'tag':tag,
                    'title':title,
                    'score':score,
                    'comment_num':comment_num,
                    'price':price,
                    'address':address,
                    'feature':feature
                })
            }
         
            // 周末去哪儿
            var weekend_trip = $('#weekend-trip>div .mp-product-item')
            for(let i=0; i<weekend_trip.length; i++){
                var item =  $($('#weekend-trip>div').children('.mp-product-item')[i])
                var img = item.find('a .product-imgcontainer img').attr('src')
                var title = item.find('a .mp-product-info .product-name').text()
                var desc = item.find('a .mp-product-info .product-desc').text()
                var url = item.find('a').attr('href')
                var id = getvar(url,'skuId')
                // console.log('推荐：'+id)
                weekendTrip.push({
                    'id':id,
                    'img':img,
                    'title':title,
                    'desc':desc
                })
            }
    
    
            await sleep(3000)
    
            cityDetail = {
                'cityName':cityName,
                'cityId':cityId,
                cityDetail:{
                    banners,
                    icons,
                    hostList,
                    likeList,
                    weekendTrip
                }
            }
        
            // console.log(cityDetail)
            // console.log('1111111111111')
            // return 0
            process.send(cityDetail)
        
            var cityDetail = []
            var banners = []
            var icons = []
            var hostList = []
            var likeList = []
            var weekendTrip =[]
          }

        num++
    }
 
   


   
  
      browser.close()
      process.exit(0)
    

})