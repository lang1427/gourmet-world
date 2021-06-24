$(function () {

    function getComment() {
        $.ajax({
            type: 'get',
            url: '/comment',
            data: {
                good_id: $('#recipe_id').val()
            },
            beforeSend: function () {
                $('.comment-loading').show()
            },
            success: function (res) {
                if (res.count > 0) {
                    let htmlstr = ``
                    for (let i = 0; i < res.data.length; i++) {
                        htmlstr += `
                        <li data-id="${res.data[i].content_id}">
                            <div class="pic">
                                <a href="/user?userid=${res.data[i].user_id}" target="_blank" title="点击进入 ${res.data[i].user_name} 的主页">
                                    <img class="imgLoad" src="https://i5.meishichina.com/data/avatar/010/27/43/98_avatar_big.jpg?x-oss-process=style/c180&amp;v=20210622" width="48" height="48" style="display: block;">
                                </a>
                            </div>
                            <div class="detail">
                                <div class="tools">
                                    <div class="left">
                                        <a title="点击进入 ${res.data[i].user_name} 的主页" href="/user?userid=${res.data[i].user_id}" target="_blank">${res.data[i].user_name}</a>
                                        <span class="subtime">${res.data[i].content_time}</span>
                                    </div>
                                    <div class="right">
                                        <a href="#" class="J_event" data-type="reply">回复</a>
                                    </div>
                                </div>
                                <div class="content">${res.data[i].content}</div>
                            </div>
                        </li>
                        `
                    }
                    $('#comment_list').html(htmlstr)
                    $('#recordCount').text(res.count + '条')
                    $('.comment-error').hide()
                } else {
                    $('.comment-error').show()
                }
            },
            complete: function () {
                $('.comment-loading').hide()
            }
        })
    }

    /** 判断 contenteditable="true" 的值是否为空内容 （表情除外:img标签）  */
    function getText(str: string) {
        return str.replace(/<[^<>|^<img>]+>/g, "").replace(/&nbsp;/gi, "");
    }
    function isNull(str: string) {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }


    if (!!$.cookie('username')) {

        $('#comment_box').on('click', '.bq', function (e) {
            $('.face').slideDown()
            e.stopPropagation()
        })
        $('body').on('click', function () {
            $('.face').slideUp()
        })

        $('#comment_box .submit').on('click', function () {
            let content = getText($("#comment_val").html()); //获取输入框内容
            if (isNull(content)) {
                $('#comment_val').html('')
                $('#comment_val').focus(); //自动获取焦点
                layer.msg('您还未输入任何内容', { icon: 8 })
                return;
            }
            if ($('#comment_val').html().length > 500) {
                layer.msg('评论内容不能超过500个字（包含空格、回车）', { icon: 8 })
                return;
            }
            $.ajax({
                url: '/add_comment',
                type: 'post',
                data: {
                    good_id: $('#recipe_id').val(),
                    content: $("#comment_val").html(),   // 拿原内容给后台服务器
                },
                success: function (res) {
                    if (res.code === 1) {
                        layer.msg(res.mes, { icon: 6 })
                        $('#comment_val').html('')
                        getComment()
                    } else {
                        layer.msg(res.mes, { icon: 8 })
                    }
                }
            })

        })
    } else {
        $('#comment_val').prop('contenteditable', false)
            .prop('title', '请先登录')
            .html('<div class="comment-login-text" title="请先登录"><a href="/user/login" class="J_event" data-type="login">登录</a>后参与讨论，发表评论</div>')
    }

    if (parseInt($('.J_com span').text()) !== 0) getComment();
    else $('.comment-error').show()

    //点击小图标时，添加功能
    $(".face ul li").on('click', function (this: any) {
        let simg = $(this).find("img").clone();
        $("#comment_val").append(simg); //将表情添加到输入框
    });

})
