$(function () {

    $('.category_item').each(function () {
        $(this).on('mouseenter', function (this:any) {
            $(this).find('.sub').css('display', 'block')
        })
        $(this).on('mouseleave', function (this:any) {
            $(this).find('.sub').css('display', 'none')
        })
    })

    // banner 轮播
    var sudoSlider = $("#home_index_slider").sudoSlider({
        continuous: true,
        auto: true,
        effect: "fade",
        speed: 700,
        pause: 3000,
        numeric: true,
        prevHtml: '<a class="prevBtn" href="javascript:void(0);"><i>&nbsp;</i></a>',
        nextHtml: '<a class="nextBtn" href="javascript:void(0);"><i>&nbsp;</i></a>'
    });

    // 菜谱图片懒加载
    $('img.imgLoad').lazyload()
})