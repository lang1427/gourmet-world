var ibgs: object[] = [
    { src: 'https://i3.meishichina.com/attachment/magic/2017/04/11/20170411149189588154913.jpg' },
    { src: 'https://i3.meishichina.com/attachment/magic/2016/07/20/20160720146900157818213.jpg' },
    { src: 'https://i3.meishichina.com/attachment/magic/2015/11/24/201511241448337585505.jpg' },
    { src: 'https://i3.meishichina.com/attachment/magic/2015/10/13/20151013111553208843446.jpg' },
    { src: 'https://i3.meishichina.com/attachment/magic/2015/08/31/20150831141046186920980.jpg' },
    { src: 'https://i3.meishichina.com/attachment/magic/2015/08/06/20150806104623263299572.jpg' },
    { src: 'https://i3.meishichina.com/attachment/magic/2015/08/04/20150804133214358339649.jpg' },
    { src: 'https://i3.meishichina.com/attachment/magic/2015/07/28/20150728115959448081113.jpg' }
];
var ibgs_ie: string = 'https://i3.meishichina.com/attachment/magic/2017/04/11/20170411149189588154913.jpg';

$(function () {
    $('body').vegas({
        timer: false,        // 取消进度条
        overlay: true,
        transition: 'fade',
        delay: 10000,
        animation: 'random',
        animationDuration: 20000,
        slides: ibgs
    });

    function input_test(): boolean {
        if (!$.trim((<string>$('#username').val()))) {
            layer.msg('昵称不能为空');
            $('#username').focus()
            return false
        }
        if (!$.trim((<string>$('#password').val()))) {
            layer.msg('密码不能为空');
            $('#password').focus()
            return false
        }
        return true
    }

    $('#loginbtn').on('click', function () {
        if (input_test()) {
            $('#password').val(md5(<string>$('#password').val()))
            $("#loginform").ajaxSubmit({
                success: function (res) {
                    if (res.code === 1) {
                        window.location.href = '/'
                    } else {
                        layer.msg(res.mes)
                        $('#password').val('')
                    }
                },
                error: function () {
                    layer.msg('服务器开了个小差', { icon: 5 })
                    $('#password').val('')
                }
            });
        }
    })

})