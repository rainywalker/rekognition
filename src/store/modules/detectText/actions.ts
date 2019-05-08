import { ActionTree } from 'vuex';
import { TextDetectState } from '@/store/interface/state/detectText';
import { RootState } from '@/store/interface';
import {AWS} from '@/store/AWS'


export const actions : ActionTree<TextDetectState, RootState> = {
    async s3Upload({rootState, dispatch, commit}, {file,imgDimensions}){
        rootState.isLoading = true;

        const s3: any = new AWS.S3({
            apiVersion: '2006-03-01',
            params: {
                Bucket: 'rekonition-img/detectText'
            }
        });

        try {
            const result : any = await s3.upload({
                Key: file.name,
                Body:file,
                ACL: 'public-read',
                ContentType: file.type
            }).promise();

            dispatch('rekognitioner',{
                result,
                imgDimensions
            });

            console.log('s3 upload success', result)
        }
        catch (e) {
            console.log(e)
        }
    },
    async rekognitioner({dispatch, state},{result,imgDimensions}) {
        const rekognition: any = new AWS.Rekognition();

        try {
            const res  = await rekognition.detectText({
                Image: {
                    S3Object: {
                        Bucket: 'rekonition-img',
                        Name: result.Key
                    }
                }
            }).promise();

            const lines: Array<object> = res.TextDetections.filter((v: any) => v.Type === 'LINE');
            const words: Array<object> = res.TextDetections.filter((v: any) => v.Type === 'WORD');

            interface returnObj {
                detectText : string,
                width : number,
                height : number,
                top : number,
                left : number
            }

            const objectDimensions : Array<object> = lines.map((v: any) => {

                const returnObj : returnObj = {
                    detectText: v.DetectedText,
                    width: ((v.Geometry.BoundingBox.Width * imgDimensions.width) / imgDimensions.width) * 100,
                    height: ((v.Geometry.BoundingBox.Height * imgDimensions.height) / imgDimensions.height) * 100,
                    top: ((v.Geometry.BoundingBox.Top * imgDimensions.height) / imgDimensions.height) * 100,
                    left: ((v.Geometry.BoundingBox.Left * imgDimensions.width) / imgDimensions.width) * 100

                };
                return returnObj
            });
            console.log(objectDimensions)
            dispatch('putDB',{objectDimensions,words,key:result.Key})

        }
        catch (e) {
            console.log(e)
        }
    },

    async putDB({dispatch,commit,rootState},{objectDimensions,words,key}) {

        const params = {
            Item: {
                d_key: key,
                dimension: objectDimensions,
                extractText: words

            },
            TableName: 'rekogDetectText'
        };

        const docClient = new AWS.DynamoDB.DocumentClient();

        try {
            const result = await docClient.put(params).promise();
            commit('pushItem',params.Item);
            rootState.isLoading = false
        }
        catch (e) {
            console.log(e)
        }

    },
    async getDB({commit}) {

        const docClient : any = new AWS.DynamoDB.DocumentClient();

        const params = {
            TableName: 'rekogDetectText',
        };

        try {
            const result : any = await docClient.scan(params).promise();
            commit('getItems', result.Items)
        }
        catch (e) {
            console.log(e)
        }

    }
};
