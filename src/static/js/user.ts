
$(function () {
    $(".recipe_ser").click(function () {
        if ($(".search_b").is(":hidden")) {
            $(".search_b").slideDown();
            setTimeout(function () {
                $(".search_b #tbid").focus()
            }, 500)
        }
        else {
            $(".search_b").slideUp();
        }
    });
    $(".close").click(function () {
        $(".search_b").slideUp();
    });
    $("#tbid_btn").click(function () {
        var val = $("#tbid").val()
        if (!$.trim(<string>val)) {
            layer.msg("请输入菜谱名称");
            $(".search_b #tbid").val('');
            $(".search_b #tbid").focus();
            return false
        } else {
            window.location.href = "/user/menu-page/1?userid=" + $('#userid').val() + '&search=' + $.trim(<string>val);
        }
    });
    $('#tbid').on('keydown', function (event) {
        if (event.keyCode == 13) {
            $("#tbid_btn").click()
        }
    })
    var val = $("#tbid").val();
    if ($.trim(<string>val) != '') {
        $(".search_b").css("display", "block");
    }
})