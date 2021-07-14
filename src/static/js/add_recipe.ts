$(function () {
    $('#J_form').on('submit', function () {
        if ($.trim(<string>$('#J_subject').val()) == "") {
            layer.msg('请输入菜品名称')
            return false
        }
    })
})