$(function(){

    $('.category_item').each(function(){
        $(this).on('mouseenter',function(){
            $(this).find('.sub').css('display','block')
        })
        $(this).on('mouseleave',function(){
            $(this).find('.sub').css('display','none')
        })
    })
})