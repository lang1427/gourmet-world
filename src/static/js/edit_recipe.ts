$(function () {
    interface Istep_data {
        desc: string
        url: string
    }
    interface Iobj {
        [attr: number]: any
    }

    $('#J_m_cover').fileupload({
        done: function (e, data) {
            if (data.result.code === 1) {
                if ($('#cover').children().length == 0) {
                    $('#cover').html(`
                    <div>
                        <img class="imgLoad" src="${data.result.img}" style="display: inline-block;">
                        <input type="hidden" name="allpic" value="${data.result.img}">
                    </div>
                    `)
                } else {
                    $('#cover').find('img').attr('src', data.result.img)
                    $('#cover').find('input[name="allpic"]').val(data.result.img)
                }
                saveTip('成品图片')
            }
        }
    })

    document.addEventListener("visibilitychange", function () {
        document.hidden ? window.clearInterval(auto_timer) : interval();
    });

    // 间隔2分钟检查数据，保存草稿功能
    let oldData = get_recipe_data()
    let auto_timer = interval()
    function interval() {
        return window.setInterval(function () {
            auto_save_data()
        }, 12 * 1e4)  
    }
    function auto_save_data() {
        let newData = get_recipe_data()
        if (newData.subject !== oldData.subject) {
            var { subject } = newData
        }
        if (newData.message !== oldData.message) {
            var { message } = newData
        }
        if (newData.difficulty !== oldData.difficulty) {
            var { difficulty } = newData
        }
        if (JSON.stringify({ zhuliao: newData.zhuliao }) !== JSON.stringify({ zhuliao: oldData.zhuliao })) {
            var { zhuliao } = newData
        }
        if (JSON.stringify({ fuliao: newData.fuliao }) !== JSON.stringify({ fuliao: oldData.fuliao })) {
            var { fuliao } = newData
        }
        if (JSON.stringify({ tiaoliao: newData.tiaoliao }) !== JSON.stringify({ tiaoliao: oldData.tiaoliao })) {
            var { tiaoliao } = newData
        }
        if (!!subject || !!message || !!difficulty || !!zhuliao || !!tiaoliao || !!fuliao) {
            $.ajax({
                url: '/publish/recipe-edit',
                type: 'post',
                data: {
                    recipe_id: $('#recipeinfo_id').val(),
                    g_name: subject,
                    desc: message,
                    difficulty,
                    zhuliao: zhuliao && zhuliao.join('、'),
                    fuliao: fuliao && fuliao.join('、'),
                    tiaoliao: tiaoliao && tiaoliao.join('、'),
                },
                success: function (rsp) {
                    if (rsp.code === 1) {
                        saveTip('菜谱名称，描述，制作难度，食材明细')
                        oldData = get_recipe_data()
                    } else {
                        layer.msg(rsp.mes, { icon: 5 })
                    }
                }
            })
        }
    }

    // 食材明细相关
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
    $('.ingredient').on('click', '.delete', function () {
        $(this).parent().remove()
    })
    $('.del').on('click', function (this: any) {
        $(this).closest('blockquote').remove()
    })


    // 制作难度 相关
    $('.difficulty span').each(function () {
        if ($(this).text() == $('#difficulty').val()) {
            $(this).addClass('on')
        }
    })
    $(".things_type1 span").on('click', function (this: any) {
        $(this).addClass('on').siblings().removeClass('on');
        $(this).closest('li').find('input').val(<string>$(this).text());
    })

    // 步骤相关
    var file_len: number = 0, isMultiple: boolean = false;
    $('.step').on('click', 'input[name="gourmet"]', function () {
        // https://github.com/blueimp/jQuery-File-Upload/wiki/Options
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
                if (isMultiple === false) {
                    if (data.result.code === 1) {
                        $(this).parent().find('.file_img').attr('src', data.result.url)
                        saveTip('菜谱步骤')
                    }
                } else {
                    file_len--;
                    if (file_len === 0) {
                        // 全部上传完成
                        renderStep_template()
                        saveTip('菜谱步骤')
                        isMultiple = false
                    }
                }
            },
            fail: function () { },  // 上传文件中止或失败时触发
            always: function () { },  // 文件上传完毕触发（成功，失败，中止）
            progress: function () { },  // 当前文件上传进度条
            progressall: function () { },  // 全局文件上传进度
            change: function (e, data) { // 文件发生改变时触发
                file_len = data.files.length
                if (file_len >= 2) isMultiple = true
            },
            paste: function () { },      // 粘贴 时触发的事件
            drop: function () { },       // 拖拽区域的拖拽事件
            dragover: function () { },   // 拖拽离开执行
            chunksend: function () { },   // 每个分块上传请求开始时执行
            chunkdone: function () { }, // 每个分块上传请求成功时执行
            chunkfail: function () { },
            chunkalways: function () { },
        })
    })
    $('#dragsort').on('click', '.add', function () {
        let cur_step_index = parseInt($(this).closest('blockquote').find('.J_imghidden').val() as string)
        get_recipe_step(function (data: Istep_data) {
            let { desc, url } = data
            let desc_json = JSON.parse(desc)
            let url_json = JSON.parse(url)
            /**
             *  假如当前最新的step数据为 ： { 1:'a', 2:'b', 3:'c' }
             *  希望在第一步中点击添加一步 导致数据变更为 ： { 1:'a', 2:'', 3:'b', 4:'c' }
             */
            // 从后台获取得到最新的step数据，拿到数据值进行转化成数组，通过数组的splice方法插入新值到对应点击添加一步的步数后面，再将其转化为步骤数据对象类型发送给后台,最后在renderStep_template
            let desc_valueArr = Object.values(desc_json)
            let url_valueArr = Object.values(url_json)
            desc_valueArr.splice(cur_step_index, 0, "")
            url_valueArr.splice(cur_step_index, 0, "")
            let _desc: any = {}
            for (const key in desc_valueArr) {
                _desc[parseInt(key) + 1] = desc_valueArr[key]
            }
            let _url: any = {}
            for (const key in url_valueArr) {
                _url[parseInt(key) + 1] = url_valueArr[key]
            }
            set_recipe_step(_desc, _url, true)
        })
    })
    $('#dragsort').on('click', '.delete', function () {
        if ($('#dragsort blockquote').length <= 3) {
            layer.msg('至少需要3个步骤')
            return false
        }
        let cur_step_index = parseInt($(this).closest('blockquote').find('.J_imghidden').val() as string)
        get_recipe_step(function (data: Istep_data) {
            let { desc, url } = data
            let desc_json = JSON.parse(desc)
            let url_json = JSON.parse(url)
            // 同 添加一步 类似
            let desc_valueArr = Object.values(desc_json)
            let url_valueArr = Object.values(url_json)
            desc_valueArr.splice(cur_step_index - 1, 1)
            url_valueArr.splice(cur_step_index - 1, 1)
            let _desc: any = {}
            for (const key in desc_valueArr) {
                _desc[parseInt(key) + 1] = desc_valueArr[key]
            }
            let _url: any = {}
            for (const key in url_valueArr) {
                _url[parseInt(key) + 1] = url_valueArr[key]
            }
            set_recipe_step(_desc, _url, true)
        })
    })
    $('#dragsort').on('click', '.up', function () {
        let cur_step_index = $(this).parent().parent().index()
        if (cur_step_index === 0) {
            layer.msg('当前已经是第一步了')
            return false
        }
        cur_step_index -= 1;
        $('#dragsort').find('blockquote:eq(' + cur_step_index + ')').before($(this).parent().parent().clone().hide());
        $('#dragsort').find('blockquote:eq(' + cur_step_index + ')').fadeIn('800');
        $(this).closest('.J_blockQ').remove();
        _resetStepInfo()
        let { desc, url } = _buildStepData()
        set_recipe_step(desc, url)
    })
    $('#dragsort').on('click', '.down', function () {
        var cur_step_index = $(this).parent().parent().index();
        if (cur_step_index == $('#dragsort blockquote').length - 1) {
            layer.msg('已经是最后一步了')
            return false
        }
        cur_step_index++; $('#dragsort').find('blockquote:eq(' + cur_step_index + ')').after($(this).parent().parent().clone().hide());
        cur_step_index++; $('#dragsort').find('blockquote:eq(' + cur_step_index + ')').fadeIn('800');
        $(this).closest('.J_blockQ').remove();
        _resetStepInfo()
        let { desc, url } = _buildStepData()
        set_recipe_step(desc, url)
    })
    var oldIndex: number;
    $('#dragsort').sortable({
        containerSelector: '#dragsort',
        handle: '.dragsort',
        itemSelector: "blockquote",
        onDragStart: function ($item: any, container, _super: any) {
            oldIndex = $item.index()
            $item.appendTo($item.parent())
            _super($item, container)
        },
        onDrag: function ($item: any, container, _super: any) {
            var field,
                newIndex = $item.index()
            if (newIndex != oldIndex)
                $item.closest('#dragsort').find('blockquote').each(function (i: any, row: any) {
                    row = $(row)
                    field = row.children().eq(oldIndex)
                    if (newIndex)
                        field.before(row.children()[newIndex])
                    else
                        row.prepend(field)
                })

            _super($item, container)
        },
        onDrop: function ($item: any, container: any, _super, event) {
            $item.removeClass(container.group.options.draggedClass).removeAttr(" style ")
            $(" body ").removeClass(container.group.options.bodyClass)
            var new_index = $item.index()
            if (new_index != oldIndex) {
                _resetStepInfo()
                let { desc, url } = _buildStepData()
                set_recipe_step(desc, url)
            }
        }
    })

    function _resetStepInfo() {
        $('#dragsort blockquote').each(function (index, ele) {
            let step = index + 1
            $(this).find('.J_imghidden').val(step)
            $(this).find('.J_step_num').text(step + '、')
        })
    }
    function _buildStepData() {
        let desc: Iobj = {}, url: Iobj = {};
        $('#dragsort blockquote').each(function () {
            let step = parseInt((<string>$(this).find('.J_imghidden').val()))
            desc[step] = $(this).find('.textArea').val()
            url[step] = $(this).find('.file_img').attr('src')

        })
        return {
            desc,
            url
        }
    }

    // 步骤描述 输入过程 超过1分钟则向后台保存草稿
    let input_step_desc = debounce(() => {
        let { desc, url } = _buildStepData()
        set_recipe_step(desc, url)
    }, 60000)
    $('#dragsort').on('input', '.textArea', function () {
        input_step_desc()
    })


    renderStep_template()
    function renderStep_template() {
        get_recipe_step(function (data: Istep_data) {
            let { desc, url } = data
            let desc_json = JSON.parse(desc)
            let url_json = JSON.parse(url)
            let html = ``
            for (const key in url_json) {
                html += `
                <blockquote class="cp_block J_blockQ clear">
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
                        <span class="J_step_num">${key}、</span> 
                        <a href="javascript:void(0);" class="add J_addTextarea">&nbsp;添加一步&nbsp;</a> 
                        <a href="javascript:void(0);" class="up J_upTextarea">&nbsp;上移一步&nbsp;</a>
                        <a href="javascript:void(0);" class="down J_downTextarea">&nbsp;下移一步&nbsp;</a>
                        <a href="javascript:void(0);" class="delete J_delTextarea">&nbsp;删除本步&nbsp;</a>
                        <a href="javascript:void(0);" class="dragsort">&nbsp;调换顺序&nbsp;</a>
                    </div>
                </blockquote>
                `
            }
            $('#dragsort').html(html)

        })
    }
    function get_recipe_step(successCallback: Function) {
        $.ajax({
            url: '/get_recipe_step',
            type: "post",
            data: {
                recipe_id: $('#recipeinfo_id').val()
            },
            success: function (res) {
                if (res.code === 1) {
                    successCallback(res)
                } else {
                    console.log(res.mes)
                }
            }
        })
    }
    function set_recipe_step(desc: object, url: object, isRender?: boolean) {
        $.ajax({
            url: '/edit_recipe_step',
            type: "post",
            data: {
                recipe_id: $('#recipeinfo_id').val(),
                desc: JSON.stringify(desc),
                url: JSON.stringify(url)
            },
            success: function (res) {
                if (res.code === 1) {
                    if (isRender) renderStep_template();
                    saveTip('菜谱步骤')
                }
            }
        })
    }

    function saveTip(mes: string): void {
        let time = new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0')
        $('#save_tip').html('已于 ' + time + ' 自动保存: ' + mes)
    }

    interface IRecipeData {
        subject: string
        message: string
        difficulty: string
        zhuliao: string[]
        fuliao: string[]
        tiaoliao: string[]
    }
    function get_recipe_data(): IRecipeData {
        var zhuliao: string[] = [],
            fuliao: string[] = [],
            tiaoliao: string[] = [];
        $('.ingredient blockquote').eq(0).find('.liao').each(function () {
            zhuliao.push($(this).val() + '')
        })
        $('.ingredient blockquote').eq(1).find('.liao').each(function () {
            fuliao.push($(this).val() + '')
        })
        $('.ingredient blockquote').eq(2).find('.liao').each(function () {
            tiaoliao.push($(this).val() + '')
        })
        var data: IRecipeData = {
            subject: $.trim($('input[name="subject"]').val() + ''),
            message: $.trim($('textarea[name="message"]').val() + ''),
            difficulty: $.trim($('#difficulty').val() + ''),
            zhuliao,
            fuliao,
            tiaoliao
        }
        return data
    }


    function saveRecipe(recipe_data: IRecipeData, step_data: Istep_data, cover_img: undefined | string, status: number) {
        $.ajax({
            url: '/publish/recipe-save',
            type: 'post',
            data: {
                recipe_id: $('#recipeinfo_id').val(),
                g_name: recipe_data.subject,
                desc: recipe_data.message,
                difficulty: recipe_data.difficulty,
                zhuliao: recipe_data.zhuliao && recipe_data.zhuliao.join(''),
                fuliao: recipe_data.fuliao && recipe_data.fuliao.join(''),
                tiaoliao: recipe_data.tiaoliao && recipe_data.tiaoliao.join(''),
                cover_img: cover_img,
                step_desc: step_data.desc,
                step_url: step_data.url,
                status
            },
            success: function (rsp) {
                layer.msg(rsp.mes)
            }
        })
    }
    // 手动存为草稿
    $('#savebtn').on('click', function () {
        let recipe_data = get_recipe_data()
        let recipe_step = _buildStepData()
        let cover_img: undefined | string = ($('input[name="allpic"]').val() as undefined | string)
        let obj: Istep_data = {
            desc: JSON.stringify(recipe_step.desc),
            url: JSON.stringify(recipe_step.url)
        }
        saveRecipe(recipe_data, obj, cover_img, 3)
    })
    // 发布菜谱
    $('#postbtn').on('click', function () {
        let recipe_data = get_recipe_data()
        let recipe_step = _buildStepData()
        let cover_img: undefined | string = ($('input[name="allpic"]').val() as undefined | string)
        let obj: Istep_data = {
            desc: JSON.stringify(recipe_step.desc),
            url: JSON.stringify(recipe_step.url)
        }

        if (recipe_data.subject == '' || recipe_data.difficulty == '' || typeof cover_img == 'undefined') {
            layer.msg('菜谱名称，成品图片，制作难度 不能为空')
            return false
        }
        if (($('.ingredient blockquote').eq(0).find('.liao')[0] as HTMLInputElement).value == '') {
            layer.msg('主料不能为空')
            return false
        }
        let stepArr = Object.values(recipe_step.desc)
        if (stepArr.length < 3) {
            layer.msg('步骤必须存在3步')
            return false
        }
        let flag: boolean = stepArr.some(function (item) {
            return item == ""
        })
        if (flag) {
            layer.msg('步骤描述不能为空')
            return false
        }
        saveRecipe(recipe_data, obj, cover_img, 1)
    })
})
