//课程评论 参数： id:课程id 
module.exports = (query, request) => {
    query.sightId = query.sightId
    query.pageNum = query.pageNum || 1 //页数
    query.pageSize = query.pageSize || 10  //只能为10  坑爹，先留着
    query.tagType = query.tagType || 0 //默认0
    // query.tagName = query.tagName || "全部"
    return request(
        'GET',
        `https://touch.piao.qunar.com/touch/queryCommentsAndTravelTips.json?type=mp&pageSize=${query.pageSize}&fromType=SIGHT&pageNum=${query.pageNum}&sightId=${query.sightId}&tagType=${query.tagType}`,
        {cookie: query.cookie, proxy: query.proxy}
    )
}