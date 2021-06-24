$(function () {

    if ($.cookie('username')) {
        $('.bar-link').addClass('none')
        $('.bar-user').css('display', 'block')
        // 中文base64解密会将符号+替换为空格 所以这里要replace处理一下
        $('#J_barUserName').text($.base64.decode($.cookie('username').replace(" ", "+"), true))
    }

    $('.bar-user').on('mouseenter', function (this: any) {
        $((this)).find('.bar-box').css('display', 'block')
    }).on('mouseleave', function (this: any) {
        $((this)).find('.bar-box').css('display', 'none')
    })

    $('.bar-add').on('mouseenter', function (this: any) {
        $((this)).find('.bar-box').css('display', 'block')
    }).on('mouseleave', function (this: any) {
        $((this)).find('.bar-box').css('display', 'none')
    })

    $('.J_barExit').on('click', function () {
        $.ajax({
            url: '/logout',
            type: 'post',
            success: function (rsp) {
                if (rsp.code) {
                    window.location.reload()
                }
            }
        })
    })

})