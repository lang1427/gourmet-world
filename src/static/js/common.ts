$(function () {
    // 图片懒加载
    $('img.imgLoad').lazyload()
    $.ajaxSetup({
        success: function (rsp) {
            if (rsp.code === -1) {
                layer.msg(rsp.mes, { icon: 5 })
                return false
            }
        }
    })
})

const debounce = function (fn: Function, delay: number) {
    var timer: any = null;
    return function (this: any) {
        var that = this,
            arg = arguments;
        if (timer) {
            window.clearTimeout(timer)
            timer = null
        }
        console.log(timer)
        timer = window.setTimeout(() => {

            fn.apply(that, arg)
        }, delay)
    }
}