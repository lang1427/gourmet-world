$(function () {

    if (getUrlParam('recipename') != '') {
        //decodeURI： 将类似于 %E4%B8%AD%E6%96%87 字符串 转换为中文
        $('#tbid').val(decodeURI(getUrlParam('recipename')))
    }

    let url = window.location.pathname
    switch (url) {
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
            break;

    }

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