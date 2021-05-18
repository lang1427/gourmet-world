const koa = require('koa')
const Router = require('koa-router')
const request = require('superagent')  // 代理请求
const cheerio = require('cheerio')      // 类Jquery 操作DOM

const app = new koa()
const router = new Router()


router.get('/', async ctx => {
    let res = await request.get('https://www.meishichina.com/')

    let html = res.text         // 得到请求页的html结构
    let $ = cheerio.load(html)      // 转换成jquery DOM 

    /* 获取菜单分类 */
    let menu_category = []
    $(".w1_1 ul:not(.sub) > li").each((i, ele) => {
        let $ele = $(ele)
        menu_category.push({
            p_id: 0,
            m_name: $ele.find('.la').text()
        })
        $ele.find('.sub li').each((index, elem) => {
            let sub_title = $(elem).find('span').text()
            let title = $(elem).find('a').text().split(sub_title)[0]
            if (!!title) {
                menu_category.push({
                    p_id: i + 1,
                    m_name: title + '/' + sub_title
                })
            } else {
                menu_category.push({
                    p_id: i + 1,
                    m_name: $(ele).find('img').attr('src')
                })
            }


        })

    })
    console.log(menu_category)

    ctx.body = html
})


request.get('https://home.meishichina.com/show-top-type-recipe.html').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 5,
            status: 1
            // user_name,
            // user_href,
        })
    })

    // console.log(data)
    let step_data = []
    var pro = data.map(item => {
        return request.get(item.step_href)
    })
    Promise.all(pro).then(() => {
        for (let i = 0; i < pro.length; i++) {
            let html = pro[i].response.text
            let $ = cheerio.load(html)
            let title = $('#recipe_title').text()
            let url_list = []
            $('.recipeStep_img img').each(function () {
                url_list.push($(this).attr('src'))
            })
            let url = {}
            for (let key in url_list) {
                url[parseInt(key) + 1] = url_list[key];
            }
            let desc_arr = $('.recipeStep_word').text().split('。').map((item) => { return item.replace(/^\d+/, '') }),  // 去除以数字开头的字符串
                desc = {};
            for (let desckey in desc_arr) {
                desc[parseInt(desckey) + 1] = desc_arr[desckey]
            }
            step_data.push({
                title,
                url: JSON.stringify(url),
                desc: JSON.stringify(desc),
                g_id: i+1
            })
        }
        // console.log(step_data)
    })

    /* 不抓取分页数据了 */
    // let pages_href = []
    // $('.ui-page-inner').find('a:not(.now_page)').each(function () {
    //     if (!Number.isNaN(Number($(this).text()))) {
    //         pages_href.push($(this).attr('href'))
    //     }
    // })
    // var promise = pages_href.map(function (href) {
    //     return request.get(href)
    // })
    // Promise.all(promise).then(() => {
    //     for (let i = 0; i < promise.length; i++) {

    //         let html = promise[i].response.text
    //         let $ = cheerio.load(html)
    //         $('#J_list li').each(function () {
    //             let step_href = $(this).find('.pic').children('a').attr('href')
    //             let img = $(this).find('.pic').find('img').attr('data-src')
    //             let g_name = $(this).find('h2').find('a').text()
    //             let user_name = $(this).find('p.subline').text()
    //             let user_href = $(this).find('p.subline').find('a').attr('href')
    //             let ingredients = $(this).find('.subcontent').text()        // 原料成分
    //             data.push({
    //                 step_href,
    //                 img,
    //                 g_name,
    //                 user_name,
    //                 user_href,
    //                 ingredients
    //             })
    //         })
    //     }
    //     console.log(data)
    // }).catch(err => {
    //     console.log('err: ', err)
    // })


})

/* 获取 人气菜肴数据 */
request.get('https://home.meishichina.com/show-top-type-recipe-order-pop.html').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 6,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)
})

/* 获取 春季食谱数据 */
request.get('https://home.meishichina.com/recipe/chunji/').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,      
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 7,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)

})

/* 获取 早餐做法数据 */
request.get('https://home.meishichina.com/recipe/zaocan/').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,      
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 8,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)

})

/* 获取 高颜值 数据 */
request.get('https://home.meishichina.com/recipe/gaoyanzhi/').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,      
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 9,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)

})

/* 获取 凉菜数据 */
request.get('https://home.meishichina.com/recipe/liangcai/').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,      
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 10,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)

})

/* 获取 热菜数据 */
request.get('https://home.meishichina.com/recipe/recai/').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,      
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 11,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)

})

/* 获取 主食数据 */
request.get('https://home.meishichina.com/recipe/zhushi/').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,      
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 12,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)

})

/* 获取 小吃数据 */
request.get('https://home.meishichina.com/recipe/xiaochi/').then(res => {
    let html = res.text
    let $ = cheerio.load(html)
    let data = []

    $('#J_list li').each(function () {
        let step_href = $(this).find('.pic').children('a').attr('href')
        let img = $(this).find('.pic').find('img').attr('data-src')
        let g_name = $(this).find('h2').find('a').text()
        let user_name = $(this).find('p.subline').text()
        let user_href = $(this).find('p.subline').find('a').attr('href')
        let ingredients = $(this).find('.subcontent').text()        // 原料成分
        data.push({
            step_href,      
            g_name,
            img,
            user_id: 1,
            desc: '',
            ingredients,
            difficulty: 1,
            zhuliao: '',
            fuliao: '',
            tiaoliao: '',
            category_id: 13,
            status: 1
            // user_name,
            // user_href,
        })
    })
    // console.log(data)

})

app.use(router.routes())

app.listen(8686)