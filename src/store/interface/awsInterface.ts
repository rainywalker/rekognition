export interface S3Params {
    apiVersion : string,
    params : {
        Bucket : string
    }
}
export interface S3uploadObj {
    Key: string,
    Body:any,
    ACL: string,
    ContentType: string
}

export interface Detect {
    Image: {
        S3Object: {
            Bucket: string
            Name: string
        }
    }
}

