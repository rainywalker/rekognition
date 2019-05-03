import { ActionTree } from 'vuex';
import { TextDetectState } from '@/store/interface/state/detectText';
import { RootState } from '@/store/interface';
import {AWS} from '@/store/AWS'

export const actions : ActionTree<TextDetectState, RootState> = {
    s3Upload({state, dispatch, commit}, {file,imgDimensions}) : void {

        const s3: any = new AWS.S3({
            apiVersion: '2006-03-01',
            params: {
                Bucket: 'rekonition-img/detectText'
            }
        });

        s3.upload({
            Key: file.name,
            Body:file,
            ACL: 'public-read',
            ContentType: file.type
        }, (err: any, data: any) => {
            if (err) throw err;
            else {
                dispatch('rekognitioner',{
                    data,
                    imgDimensions
                });
                console.log('s3 upload success', data)
            }
        })
    },
    rekognitioner({dispatch, state},{data,imgDimensions}) :void {
        const rekognition: any = new AWS.Rekognition();

        rekognition.detectText({
            Image: {
                S3Object: {
                    Bucket: 'rekonition-img',
                    Name: data.Key
                }
            }
        }, (err: any, res: any) => {
            if (err) throw err

            else {
                console.log(res)
                const lines: Array<object> = res.TextDetections.filter((v: any) => v.Type === 'LINE');
                const words: Array<object> = res.TextDetections.filter((v: any) => v.Type === 'WORD');

                const objectDimensions = lines.map((v: any) => {

                    const returnObj = {

                        detectText: v.DetectedText,
                        width: ((v.Geometry.BoundingBox.Width * imgDimensions.width) / imgDimensions.width) * 100,
                        height: ((v.Geometry.BoundingBox.Height * imgDimensions.height) / imgDimensions.height) * 100,
                        top: ((v.Geometry.BoundingBox.Top * imgDimensions.height) / imgDimensions.height) * 100,
                        left: ((v.Geometry.BoundingBox.Left * imgDimensions.width) / imgDimensions.width) * 100

                    };
                    return returnObj
                });
                console.log(objectDimensions)
                dispatch('putDB',{objectDimensions,words,key:data.Key})

            }

        })
    },

    putDB({dispatch,commit,state},{objectDimensions,words,key}) : void{

        const params = {
            Item: {
                d_key: key,
                dimension: objectDimensions,
                extractText: words

            },
            TableName: 'rekogDetectText'
        };

        const docClient = new AWS.DynamoDB.DocumentClient();

        docClient.put(params, (err: any, data: any) => {
            if (err) throw err;
            else {
                commit('pushItem',params.Item)
            }
        })
    },
    getDB({dispatch, commit}) : void {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'rekogDetectText',

        };
        docClient.scan(params, (err: any, data: any) => {

            commit('getItems', data.Items)

        })
    }
};