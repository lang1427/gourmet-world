$(function () {
    $('#J_list li').on('mouseenter', function (this: any) {
        $(this).find('.get_nums').fadeIn()
    }).on('mouseleave', function (this: any) {
        $(this).find('.get_nums').fadeOut()
    })

    $('.del').on('click', function (this: any) {
        let star_id = $(this).attr('data-star_id')
        let recipe_id = $(this).attr('data-recipe_id')
        $.ajax({
            url: '/del_recipe_star',
            type: 'post',
            data: {
                star_id,
                recipe_id
            },
            success: (rsp) => {
                if (rsp.code === 1) {
                    layer.msg(rsp.mes, { icon: 6 })
                    $(this).parent().parent().remove()
                } else {
                    layer.msg(rsp.mes, { icon: 8 })
                }
            }
        })
    })
})