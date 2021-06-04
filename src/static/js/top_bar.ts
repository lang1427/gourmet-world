$(function () {

    if ($.cookie('username')) {
        $('.bar-link').addClass('none')
        $('.bar-user').css('display', 'block')
        $('#J_barUserName').text($.cookie('username'))
    }

    $('.bar-user').on('mouseenter', function (this:any) {
        $((this)).find('.bar-box').css('display', 'block')
    }).on('mouseleave', function (this:any) {
        $((this)).find('.bar-box').css('display', 'none')
    })

    $('.bar-add').on('mouseenter', function (this:any) {
        $((this)).find('.bar-box').css('display', 'block')
    }).on('mouseleave', function (this:any) {
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