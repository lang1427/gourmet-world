$(function () {
    let url = window.location.pathname
    switch (url) {
        case "/user/my_settings_profile":
            $('#mod_location .left a').eq(0).addClass('on')
            initProfile()
            changeProfile()
            break;
        case "/user/my_settings_password":
            $('#mod_location .left a').eq(1).addClass('on')
            modifyPawd()
            break;
    }

    function initProfile() {
        $.citySelect('.box', {
            province: $('#province').val() as string,
            city: $('#city').val() as string
        })

        $('.things_type1 span').each(function () {
            if ($.trim($(this).text()) == $('#things_type').val()) {
                $(this).addClass('on')
            }
        })
        $('.things_type1 span').on('click', function (this: any) {
            $(this).addClass('on').siblings().removeClass('on')
            $('#things_type').val($.trim($(this).text()))
        })
    }
    function changeProfile() {
        $('input[name="save_submit"]').on('click', function () {
            $('#J_form').ajaxSubmit({
                success: function (rsp) {
                    if (rsp.code === 1) {
                        layer.msg('更改信息成功', { icon: 6 })
                        window.setTimeout(function () {
                            window.location.reload()
                        }, 3e3)
                    } else {
                        layer.msg(rsp.mes)
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        })
    }

    function modifyPawd() {
        $('input[name="submit"]').on('click', function () {
            if ($.trim($('#J_password_cur').val() as string) == '' || $.trim($('#J_password_new').val() as string) == '' || $.trim($('#J_password_new_2').val() as string) == '') {
                layer.msg('请将 原密码 新密码 确认密码 信息填写完整')
                return false;
            }
            if ($.trim($('#J_password_new').val() as string).length < 16 || $.trim($('#J_password_new').val() as string).length > 32) {
                layer.msg('新密码的长度需要在16~32之间')
                return false;
            }
            if ($.trim($('#J_password_new').val() as string) !== $.trim($('#J_password_new_2').val() as string)) {
                layer.msg('新密码与确认密码不一致')
                return false;
            }

            $('#J_form').ajaxSubmit({
                data: {
                    oldpassword: md5($('#J_password_cur').val() as string),
                    newpassword: md5($('#J_password_new').val() as string)
                },
                success: function (rsp) {
                    if (rsp.code === 1) {
                        layer.msg('更改密码成功，正在为您跳转登录页...', { icon: 6 })
                        window.setTimeout(function () {
                            window.location.href = '/user/login'
                        }, 3e3)
                    } else {
                        layer.msg(rsp.mes, { icon: 5 })
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        })
    }

})