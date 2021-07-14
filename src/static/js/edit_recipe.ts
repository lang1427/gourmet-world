$(function () {

    $('.ingredient').on('focus', '.liao', function () {
        var parent_dom = $(this).parent()
        var blockquote = $(this).parent().parent()
        if (parent_dom.hasClass('J_addDiv')) {
            parent_dom.removeClass('J_addDiv')
            blockquote.append(`
            <div class="J_addDiv">
                <input type="text" class="liao" autocomplete="off">
                <a href="javascript:void(0);" class="delete J_delete"></a>
            </div>`)
        }
    })

    $('.difficulty span').each(function () {
        if ($(this).text() == $('#difficulty').val()) {
            $(this).addClass('on')
        }
    })

    $(".things_type1 span").on('click', function (this: any) {
        $(this).addClass('on').siblings().removeClass('on');
        $(this).closest('li').find('input').val(<string>$(this).attr("data-value"));
    })

    $('input[name="gourmet"]').fileupload({
        dataType: 'json',
        fileInput: $('input[name="gourmet"]'),
        // formData:{ },
        // 文件提交上传时触发
        submit: function (e: any, data: any) {
            // 文件上传时添加额外字段 告诉后台当前图片是哪个步骤的图片
            data.formData = { step: $(e.target).prev().val() }
        },
        send: function (e, data) { }, // 每个文件上传请求开始时触发
        done: function (e, data) { // 文件上传成功

        },
        fail: function () { },  // 上传文件中止或失败时触发
        always: function () { },  // 文件上传完毕触发（成功，失败，中止）
        progress: function () { },  // 当前文件上传进度条
        progressall: function () { },  // 全局文件上传进度
        change: function (e, data) { },    // 文件发生改变时触发
        paste: function () { },      // 粘贴 时触发的事件
        drop: function () { },       // 拖拽区域的拖拽事件
        dragover: function () { },   // 拖拽离开执行
        chunksend: function () { },   // 每个分块上传请求开始时执行
        chunkdone: function () { }, // 每个分块上传请求成功时执行
        chunkfail: function () { },
        chunkalways: function () { },
    })

    $('.step').on('click', 'input[name="gourmet"]', function () {
        $(this).fileupload({
            dataType: 'json',
            // formData:{ },
            // 文件提交上传时触发
            submit: function (e: any, data: any) {
                // 文件上传时添加额外字段 告诉后台当前图片是哪个步骤的图片
                data.formData = { step: $(e.target).prev().val() }
            },
            send: function (e, data) { }, // 每个文件上传请求开始时触发
            done: function (e, data) { // 文件上传成功
                if (data.result.code === 1) {
                    $(this).parent().find('.file_img').attr('src', data.result.url)
                }
            },
            fail: function () { },  // 上传文件中止或失败时触发
            always: function () { },  // 文件上传完毕触发（成功，失败，中止）
            progress: function () { },  // 当前文件上传进度条
            progressall: function () { },  // 全局文件上传进度
            change: function (e, data) { },    // 文件发生改变时触发
            paste: function () { },      // 粘贴 时触发的事件
            drop: function () { },       // 拖拽区域的拖拽事件
            dragover: function () { },   // 拖拽离开执行
            chunksend: function () { },   // 每个分块上传请求开始时执行
            chunkdone: function () { }, // 每个分块上传请求成功时执行
            chunkfail: function () { },
            chunkalways: function () { },
        })
    })


    // 获取步骤相关的数据
    get_recipe_step()
    function get_recipe_step() {
        $.ajax({
            url: '/get_recipe_step',
            type: "post",
            data: {
                recipe_id: $('#recipeinfo_id').val()
            },
            success: function (res) {
                if (res.code === 1) {
                    renderStep_template(res)
                } else {
                    console.log(res.mes)
                }
            }
        })
    }
    interface Istep_data {
        desc: string
        url: string
    }
    function renderStep_template(data: Istep_data) {
        let { desc, url } = data
        let desc_json = JSON.parse(desc)
        let url_json = JSON.parse(url)
        let html = ``
        for (const key in url_json) {
            html += `
            <blockquote class="cp_block J_blockQ clear" style="cursor: move;">
                <div class="left addicon J_fileImag">
                    <input type="hidden" value="${key}" name="step_img" class="J_imghidden">
                    <input type="file" name="gourmet" data-url="/upload/recipe_step" class="file"
                        accept="image/png,image/gif,image/jpeg" value="">
                    <p class="p1">点击上传步骤图</p>
                    <p class="p3">（可不填）</p>
                    <div class="div_file_img"><b></b><img class="file_img imgLoad" src="${url_json[key]}" style="display: inline-block;"></div>
                </div>
                <div class="right">
                    <textarea class="textArea J_input" name="note" placeholder="请输入步骤说明"
                        maxlength="200">${desc_json[key]}</textarea>
                    <span class="J_step_num">${key}、</span> <a href="javascript:void(0);"
                        class="add J_addTextarea">&nbsp;添加一步&nbsp;</a> <a href="javascript:void(0);"
                        class="up J_upTextarea">&nbsp;上移一步&nbsp;</a> <a href="javascript:void(0);"
                        class="down J_downTextarea">&nbsp;下移一步&nbsp;</a> <a
                        href="javascript:void(0);" class="delete J_delTextarea">&nbsp;删除本步&nbsp;</a>
                </div>
            </blockquote>
            `
        }
        $('#dragsort').html(html)
    }

})
