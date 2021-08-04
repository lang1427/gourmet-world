/// <reference types="jquery" />

interface CitySelectOpt {
    province?: string
    city?: string
}

interface JQueryCitySelectStatic {
    (dom: string, opt?: CitySelectOpt);
}

interface JQueryStatic {

    citySelect: JQueryCitySelectStatic;
}
