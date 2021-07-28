$(function () {

    if($.trim((<string>$('#q').val())) !== '' && $('#search_res_list').length == 0){
        $('#no-data').removeClass('none')
    }

    $('#search').on('click', searchSubmit)

    $('#q').on('keyup', function (event) {
        if (event.keyCode === 13) {
            searchSubmit()
        }
    })

    function searchSubmit() {
        if ($.trim((<string>$('#q').val())) !== '') {
            window.location.href = '/search/' + $('#q').val()
        }
    }
})