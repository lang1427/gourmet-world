
/// <reference types="jquery" />

export as namespace sudoSlider;

export interface JQueryExtension {
    (config?: Settings): JQuery;
    // readonly defaults: Readonly<Settings>;
    // isVideoCompatible(): boolean;
}

export interface Settings {
    effect?: Effect
    speed?: number            // 轮播的速度
    customLink?: boolean
    controlsFadeSpeed?: number
    controlsFade?: boolean
    insertAfter?: boolean
    vertical?: boolean
    slideCount?: number
    moveCount?: number
    startSlide?: number
    responsive?: boolean
    ease?: string
    auto?: boolean          // 是否自动
    pause?: number          // 停留时间
    resumePause?: boolean
    continuous?: boolean
    prevNext?: boolean
    numeric?: boolean
    numericText?: any[]
    slices?: number
    boxCols?: number
    boxRows?: number
    history?: boolean
    autoHeight?: boolean
    autoWidth?: boolean
    updateBefore?: boolean
    ajax?: boolean
    preloadAjax?: number
    loadingText?: string
    prevHtml?: string
    nextHtml?: string
    controlsAttr?: string
    numericAttr?: string
    interruptible?: boolean
    useCSS?: boolean
    touch?: boolean
    touchHandle?: boolean
    mouseTouch?: boolean
    allowScroll?: boolean
    CSSease?: string
    ajaxHasHTML?: boolean
    performanceMode?: number
}

export interface Slide {
    src?: string;
    video?: Video;
    delay?: number;
    cover?: boolean;
    color?: string;
    align?: AlignType;
    valing?: AlignType;
    transition?: TransitionType;
    transitionDuration?: number;
    animation?: AnimationType;
    animationDuration?: Duration;
}

export type Effect =
    | 'blinds1'
    | 'blinds1Up'
    | 'blinds1Right'
    | 'blinds1Down'
    | 'blinds1Left'
    | 'blinds2'
    | 'blinds2Up'
    | 'blinds2Right'
    | 'blinds2Down'
    | 'blinds2Left'
    | 'fold'
    | 'foldUp'
    | 'foldRight'
    | 'foldDown'
    | 'foldLeft'
    | 'pushOut'
    | 'pushOutUp'
    | 'pushOutRight'
    | 'pushOutDown'
    | 'pushOutLeft'
    | 'pushIn'
    | 'pushInUp'
    | 'pushInRight'
    | 'pushInDown'
    | 'pushInLeft'
    | 'reveal'
    | 'revealUp'
    | 'revealRight'
    | 'revealDown'
    | 'revealLeft'
    | 'slice'
    | 'sliceUp'
    | 'sliceRight'
    | 'sliceDown'
    | 'sliceLeft'
    | 'sliceReverse'
    | 'sliceReverseUp'
    | 'sliceReverseRight'
    | 'sliceReverseDown'
    | 'sliceReverseLeft'
    | 'sliceRandom'
    | 'sliceRandomUp'
    | 'sliceRandomRight'
    | 'sliceRandomDown'
    | 'sliceRandomLeft'
    | 'sliceReveal'
    | 'sliceRevealUp'
    | 'sliceRevealRight'
    | 'sliceRevealDown'
    | 'sliceRevealLeft'
    | 'sliceRevealReverse'
    | 'sliceRevealReverseUp'
    | 'sliceRevealReverseRight'
    | 'sliceRevealReverseDown'
    | 'sliceRevealReverseLeft'
    | 'sliceRevealRandom'
    | 'sliceRevealRandomUp'
    | 'sliceRevealRandomRight'
    | 'sliceRevealRandomDown'
    | 'sliceRevealRandomLeft'
    | 'sliceFade'
    | 'sliceFadeUp'
    | 'sliceFadeRight'
    | 'sliceFadeDown'
    | 'sliceFadeLeft'
    | 'zip'
    | 'zipUp'
    | 'zipRight'
    | 'zipDown'
    | 'zipLeft'
    | 'unzip'
    | 'unzipUp'
    | 'unzipRight'
    | 'unzipDown'
    | 'unzipLeft'
    | 'boxRandom'
    | 'boxRandomGrowIn'
    | 'boxRandomGrowInRounded'
    | 'boxRandomGrowOut'
    | 'boxRandomGrowOutRounded'
    | 'boxRandomFlyIn'
    | 'boxRandomFlyOut'
    | 'boxRainUpLeft'
    | 'boxRainDownLeft'
    | 'boxRainDownRight'
    | 'boxRainUpRight'
    | 'boxRainGrowInUpLeft'
    | 'boxRainGrowInDownLeft'
    | 'boxRainGrowInDownRight'
    | 'boxRainGrowInUpRight'
    | 'boxRainGrowInRoundedUpLeft'
    | 'boxRainGrowInRoundedDownLeft'
    | 'boxRainGrowInRoundedDownRight'
    | 'boxRainGrowInRoundedUpRight'
    | 'boxRainGrowOutUpLeft'
    | 'boxRainGrowOutDownLeft'
    | 'boxRainGrowOutDownRight'
    | 'boxRainGrowOutUpRight'
    | 'boxRainGrowOutRoundedUpLeft'
    | 'boxRainGrowOutRoundedDownLeft'
    | 'boxRainGrowOutRoundedDownRight'
    | 'boxRainGrowOutRoundedUpRight'
    | 'boxRainFlyInUpLeft'
    | 'boxRainFlyInDownLeft'
    | 'boxRainFlyInDownRight'
    | 'boxRainFlyInUpRight'
    | 'boxRainFlyOutUpLeft'
    | 'boxRainFlyOutDownLeft'
    | 'boxRainFlyOutDownRight'
    | 'boxRainFlyOutUpRight'
    | 'boxSpiralInWards'
    | 'boxSpiralInWardsGrowIn'
    | 'boxSpiralInWardsGrowInRounded'
    | 'boxSpiralInWardsGrowOut'
    | 'boxSpiralInWardsGrowOutRounded'
    | 'boxSpiralOutWards'
    | 'boxSpiralOutWardsGrowIn'
    | 'boxSpiralOutWardsGrowInRounded'
    | 'boxSpiralOutWardsGrowOut'
    | 'boxSpiralOutWardsGrowOutRounded'
    | 'fade'
    | 'fadeOutIn'
    | 'foldRandomHorizontal'
    | 'foldRandomVertical'
    | 'slide'
    | 'stackUp'
    | 'stackUpReverse'
    | 'stackRight'
    | 'stackRightReverse'
    | 'stackDown'
    | 'stackDownReverse'
    | 'stackLeft'
    | 'stackLeftReverse'
    | 'random'

declare global {
    interface JQuery<TElement = HTMLElement> {
        sudoSlider: sudoSlider.JQueryExtension;
        on(events: VegasInitEvent, handler: (event: JQuery.Event, settings: Settings) => void): this;
        on(
            events: VegasPlay | VegasPause | VegasWalk | VegasEnd,
            handler: (event: JQuery.Event, index: number, slide: Slide) => void,
        ): this;
    }

    interface JQueryStatic {
        sudoSlider: sudoSlider.JQueryExtension;
    }
}
