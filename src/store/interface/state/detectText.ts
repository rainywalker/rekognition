export interface TextDetectState {
    dataList? : Array<object>,
    imgDimension? : {
        width : any,
        height : any
    },
    lineShape? : {
        detectText?: any,
        width?: any,
        height?: any,
        top?: any,
        left?: any
    }

}

