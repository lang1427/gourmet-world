$(function () {

    if (getUrlParam('recipename') != '') {
        //decodeURI： 将类似于 %E4%B8%AD%E6%96%87 字符串 转换为中文
        $('#tbid').val(decodeURI(getUrlParam('recipename')))
    }

    let url = window.location.pathname  // 这里获取到的url为 /user/my_recipe/1  ,需要去掉最后一个/:page 的内容
    let removePageUrl = url.substr(0, url.lastIndexOf('/'))
    switch (removePageUrl) {
        case "/user/my_recipe":
            $('#mod_location a').eq(0).addClass('on')
            break;
        case "/user/my_recipe_pending":
            $('.m_search').remove()
            $('#mod_location a').eq(1).addClass('on')
            if ($('.ui_no_data').length === 1) {
                $('.ui_no_data p').text('您没有处于待审核的菜谱！')
            }
            $('.del').remove()
            break;
        case "/user/my_recipe_fail":
            $('.m_search').remove()
            $('#mod_location a').eq(2).addClass('on')
            if ($('.ui_no_data').length === 1) {
                $('.ui_no_data p').text('您没有审核未通过的菜谱！')
            }
            break;
        case "/user/my_recipe_draft":
            $('.m_search').remove()
            $('#mod_location a').eq(3).addClass('on')
            if ($('.ui_no_data').length === 1) {
                $('.ui_no_data p').text('您没有保存草稿的菜谱！')
            }
            break;

    }

    let total_page: number = Math.ceil(parseInt((<string>$('#total').val())) / 10)
    let page: number = parseInt((<string>$('#page').val()))


    function templatePage(total_page: number, page: number): string {
        let html = ``
        if (total_page > 1) {
            if (total_page <= 6) {
                html += `<a href="${(1 === page) ? 'javascript:;' : removePageUrl + '/' + (page - 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}" >上一页</a>`
                for (let i = 1; i <= total_page; i++) {
                    html += ` <a class="${(i === page) ? 'now_page' : ''}"
                    href="${(i === page) ? 'javascript:;' : removePageUrl + '/' + i + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">${i}</a> `
                }
                html += `<a href="${(total_page === page) ? 'javascript:;' : removePageUrl + '/' + (page + 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">下一页</a>`
            } else {
                if (page < 6) {
                    html += `<a href="${(1 === page) ? 'javascript:;' : removePageUrl + '/' + (page - 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}"> 上一页</a>`
                    for (let i = 1; i <= 6; i++) {
                        html += `
                        <a class="${(i === page) ? 'now_page' : ''} "
                        href="${(i === page) ? 'javascript:;' : removePageUrl + '/' + i + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">${i}</a> 
                        `
                    }
                    if (total_page != 7) {
                        html += `<span>...</span>`
                    }
                    html += `
                    <a href="${removePageUrl + '/' + total_page + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">${total_page} </a>    
                    <a href="${(total_page === page) ? 'javascript:;' : removePageUrl + '/' + (page + 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">下一页</a> 
                    `
                } else {
                    html += `
                    <a href="${(1 === page) ? 'javascript:;' : removePageUrl + '/' + (page - 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">上一页</a>
                    <a href=${removePageUrl}/1${(getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}> 1 </a> 
                    <span>...</span>
                    <a href="${removePageUrl + '/' + (page - 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">${(page - 1)}</a> 
                    <a class="now_page" href="javascript:;">${page}</a> `
                    if (page != total_page) {
                        html += ` <a href="${removePageUrl + '/' + (page + 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">${(page + 1)}</a>`
                        if (page != total_page - 1) {
                            if (page != total_page - 2) {
                                html += `<span>...</span>`
                            }
                            html += ` <a href="${removePageUrl + '/' + total_page + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">${total_page} </a>`
                        }
                    }
                    html += `<a href="${(total_page === page) ? 'javascript:;' : removePageUrl + '/' + (page + 1) + (getUrlParam('recipename') == '' ? "" : "?recipename=" + decodeURI(getUrlParam('recipename')))}">下一页</a> `
                }
            }
        }
        return html

    }

    const page_html = templatePage(total_page, page)
    $('.ui-page-inner').html(page_html);

    $('.del').on('click', function (this: any) {
        let th = $(this)
        layer.confirm('确认要删除这个菜谱吗?', function (index) {

            $.ajax({
                url: '/del/recipe',
                type: 'post',
                data: {
                    recipe_id: th.attr('data-id')
                },
                success: function (rsp) {
                    if (rsp.code === 1) {
                        layer.msg('删除成功', { icon: 6 })
                        th.closest('li').remove()
                    } else {
                        layer.msg(rsp.mes)
                    }
                }
            })
            layer.close(index);
        });
    })
})