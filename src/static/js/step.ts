$(function () {

    $('.J_lik').on('click', add_recipe_like)

    function add_recipe_like() {
        if (!!$.cookie('username')) {
            $.ajax({
                url: '/add_recipe_like',
                type: 'post',
                // contentType:'json',
                data: {
                    good_id: $('#recipe_id').val()
                },
                success: res => {
                    if (res.code === 1) {
                        layer.msg('点赞成功', { icon: 6 })
                        $('.J_lik').addClass('on').prop('title', '已点赞')
                        $('.J_lik span').text(parseInt($('.J_lik span').text()) + 1)
                    } else {
                        layer.msg(res.mes, { icon: 8 })
                    }
                }
            })
        } else {
            layer.msg('您还没有登陆哦！')
        }
    }
})