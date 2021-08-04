
interface cityJson {
    code: string
    name: string
    children: cityJson[]
}

$.citySelect = function (dom: string, options: any) {

    let labelCSS = {
        "display": 'block',
        "width": '75px',
        "textAlign": 'right',
        "lineHeight": '30px'
    }

    let iconCss = {
        "borderBottomWidth": 0,
        "borderWidth": "6px",
        "position": "absolute",
        "right": "10px",
        "top": "16px",
        "borderColor": "transparent",
        "borderStyle": "solid",
        "borderTopColor": "#999"
    }

    let selectBoxCSS = {
        "float": "left",
        "width": "157px",
        "marginRight": "10px",
        "position": "relative"
    }

    let selectBoxSpanCSS = {
        "width": "120px",
        "padding": "8px 27px 8px 10px",
        "display": "block",
        "border": "1px solid #ddd",
        "cursor": "pointer"
    }

    let selectContentUlCss = {
        "border": "1px solid #ddd",
        "position": "absolute",
        "width": "100%",
        "top": "36px",
        "overflowY": "auto",
        "display": "none",
        "background": "#fff"
    }

    let selectContentLlCss = {
        "lineHeight": "30px",
        "padding": "0 0 0 10px"
    }

    let disabledCSS = {
        "backgroundColor": "#f3f3f3",
        "color": "#999",
    }

    let enableCSS = {
        "backgroundColor": "initial",
        "color": "initial",
    }

    let idRandom = Math.ceil(Math.random() * 100000)

    var config = {
        domSelect: ["#province_" + idRandom, "#city_" + idRandom],  // "#area"
        domInit: ["请选择省份", "请选择城市"],  // "请选择区县"
    }

    var opts = $.extend(config, options);
    var province_data: cityJson[] = []
    var city_data: cityJson[] = []

    $(dom).html(`
    <span class="name">所在城市：</span>
    <div class="gf-select" id="province_${idRandom}">
        <span><em style="font-style: normal;">${opts.province ? opts.province : '请选择省份'}</em><i class="icon-jt"><input type="hidden" name="province" value="${opts.province ? opts.province : ''}"></i></span>
        <ul>
            <li>请选择省份</li>           
        </ul>
    </div>
    <div class="gf-select" id="city_${idRandom}">
        <span><em style="font-style: normal;">${opts.city ? opts.city : '请选择城市'}</em><i class="icon-jt"><input type="hidden" name="city" value="${opts.city ? opts.city : ''}"></i></span>
        <ul>
            <li data-value="">请选择城市</li>
        </ul>
    </div>
    `)
    //     <div class="gf-select" id="area">
    //     <span><em style="font-style: normal;">请选择区县</em><i class="icon-jt"><input type="hidden" name="area" value=""></i></span>
    //     <ul>
    //         <li data-value="">请选择区县</li>
    //     </ul>
    // </div>

    $(dom).find('span.name').css(labelCSS)
    $(dom).find('.icon-jt').css(iconCss)
    $(dom).find('.gf-select').css(selectBoxCSS)
    $(dom).find('.gf-select span').css(selectBoxSpanCSS)
    $(dom).find('.gf-select ul').css(selectContentUlCss).addClass('ui-webkit-scrollbar')


    $(document).on("click", ".gf-select > span", function () {
        if ($(this).hasClass('disabled')) return false;
        $(this).closest(".gf-select").css("z-index", 100);
        if ($(this).next("ul").children().length > 4) {
            $(this).next("ul").css({ "height": 154, "overflow": "auto" });
        } else {
            $(this).next("ul").css({ "height": "auto" });
        }
        if ($(this).next("ul")[0].style.display == 'none') {
            $(".gf-select ul").hide();
            $(this).next("ul").show();
        } else {
            $(this).next("ul").hide();
        }
    });
    $(document).on("click", ".gf-select ul li", function () {
        var parent = $(this).closest("ul");
        var select = $(this).closest(".gf-select");
        var value: string = $(this).attr("data-value") + '';
        var text = $(this).text();
        if ($(this).closest(".gf-select").hasClass("noclick")) {
            parent.hide();
            return false;
        }
        select.css("z-index", 1);
        select.find("em").html(text);
        select.find("input[type='hidden']").val(text);
        parent.hide();
    });
    $(document).on("click", function (e: any) {
        if ($(e.target).closest(".gf-select").length == 0) {
            $(".gf-select").css("z-index", 1);
            $(".gf-select ul").hide();
        }
    });

    var provinceItemEvent = function (this: any) {
        var item = ['<li>' + opts.domInit[1] + '</li>'];
        var code = $(this).attr("code");
        if (code && code != "") {
            var data = province_data.filter(function (item) {
                return item.code === code
            });
            city_data = data[0].children || []
            if (city_data.length === 0) {
                $(opts.domSelect[1]).css(disabledCSS).find('span').addClass('disabled').css("cursor", "default")
                $(opts.domSelect[2]).css(disabledCSS).find('span').addClass('disabled').css("cursor", "default")
            } else {
                $(opts.domSelect[1]).css(enableCSS).find('span').removeClass('disabled').css("cursor", "pointer")
                $(opts.domSelect[2]).css(enableCSS).find('span').removeClass('disabled').css("cursor", "pointer")
                for (var i = 0; i < city_data.length; i++) {
                    item.push('<li data-value="' + city_data[i]["name"] + '" code="' + city_data[i]["code"] + '">' + city_data[i]["name"] + '</li>');
                }
            }
            $(opts.domSelect[1]).find("ul").html(item.join("\n"));
        } else {
            $(opts.domSelect[1]).find("ul").html(item.join("\n"));
        }
        $(opts.domSelect[1]).find("ul li:first").trigger("click");
        _addStyle()
    }
    // var cityItemEvent = function (this: any) {
    //     var item = ['<li>' + opts.domInit[2] + '</li>'];
    //     var code = $(this).attr("code");

    //     if (code && code != "") {
    //         var data = city_data.filter(function (item) {
    //             return item.code === code
    //         });
    //         var area_data = data[0].children || []
    //         if (area_data.length === 0) {
    //             $(opts.domSelect[2]).css(disabledCSS).find('span').addClass('disabled').css("cursor", "default")
    //         } else {
    //             $(opts.domSelect[2]).css(enableCSS).find('span').removeClass('disabled').css("cursor", "pointer")
    //             for (var i = 0; i < area_data.length; i++) {
    //                 item.push('<li data-value="' + area_data[i]["name"] + '" code="' + area_data[i]["code"] + '">' + area_data[i]["name"] + '</li>');
    //             }
    //         }
    //         $(opts.domSelect[2]).find("ul").html(item.join("\n"));
    //     } else {
    //         $(opts.domSelect[2]).find("ul").html(item.join("\n"));
    //     }
    //     $(opts.domSelect[2]).find("ul li:first").trigger("click");
    //     _addStyle()
    // }

    var initSelectEvent = function (json: any) {
        var item = ['<li>' + opts.domInit[0] + '</li>'];
        province_data = json
        var initProvinVal = $(opts.domSelect[0]).find("input").val();
        var initCityVal = $(opts.domSelect[1]).find("input").val();
        var initAreaVal = $(opts.domSelect[2]).find("input").val();

        for (var i = 0; i < province_data.length; i++) {
            item.push('<li data-value="' + province_data[i]["name"] + '" code="' + province_data[i]["code"] + '">' + province_data[i]["name"] + '</li>');
        }
        $(opts.domSelect[0]).find("ul").html(item.join("\n"));
        _addStyle()

        if (initProvinVal != "") {
            $(opts.domSelect[0]).find("ul li[data-value='" + initProvinVal + "']").trigger('click');
        }

        if (initCityVal != "") {
            $(opts.domSelect[1]).find("ul li[data-value='" + initCityVal + "']").trigger('click');
        }

        if (initAreaVal != "") {
            $(opts.domSelect[2]).find("ul li[data-value='" + initAreaVal + "']").trigger('click');
        }
    }

    var _addStyle = function () {
        $(dom).find('.gf-select ul li').css(selectContentLlCss)
    }

    var ajaxConfig = {
        url: "/public/city.json",
        type: 'get',
        success: initSelectEvent
    }
    $.ajax(ajaxConfig);
    $(document).on("click", opts.domSelect[0] + " li", provinceItemEvent);
    // $(document).on("click", opts.domSelect[1] + " li", cityItemEvent);
}
