import {AWS} from '@/store/AWS';
import * as awsInterface from '@/store/interface/awsInterface';


export const S3prepareParams : any = (bucket : string) => {
    const params: awsInterface.S3Params = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {
            Bucket: bucket
        }
    });

    return params
};

export const s3uploadObject : any = (file : any) => {
    const obj : awsInterface.S3uploadObj = {
        Key: file.name,
        Body:file,
        ACL: 'public-read',
        ContentType: file.type
    };
    return obj;
};

export const rekognitionObject : any = (result : any) => {
    const obj : awsInterface.Detect = {
        Image: {
            S3Object: {
                Bucket: 'rekonition-img',
                Name: result.Key
            }
        }
    }
    return obj
};