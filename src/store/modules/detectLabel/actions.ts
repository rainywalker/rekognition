import { ActionTree } from 'vuex';
import { ImgDetectState } from '@/store/interface/state/detectImage';
import { RootState } from '@/store/interface';
import {AWS} from '@/store/AWS'

export const actions : ActionTree<ImgDetectState, RootState> = {
    s3Upload({rootState, commit, dispatch},file : any) : void {
        rootState.isLoading = true;
        const s3 : any = new AWS.S3({
            apiVersion : '2006-03-01',
            params : {
                Bucket : rootState.bucketName
            }
        });

        s3.upload({
            Key : file.name,
            Body : file,
            ACL : 'public-read',
            ContentType : file.type
        }, (err:any, data:any) => {
            if (err) {
                throw err
            }
            dispatch('rekognition', data)
        })
    },
    rekognition({state,commit, dispatch}, data : any) : void {
        const rekognition : any = new AWS.Rekognition();

        rekognition.detectLabels({
            Image : {
                S3Object : {
                    Bucket : data.Bucket,
                    Name : data.Key
                }
            }
        }, (err : any, res : any) => {
            if (err) throw err

            else {

                dispatch('putDB',{res,name : data.Key})


            }

        })
    },
    putDB({rootState,commit, dispatch}, res : any) : void {
        const items : Array <object> = res.res.Labels.map((v:any) => {
            return {
                name : v.Name,
                confidence : v.Confidence
            }
        });
        console.log(res)
        const params = {
            Item : {
                p_key : res.name,
                tag : items
            },
            TableName : 'rekognitionTable'
        };

        const docClient = new AWS.DynamoDB.DocumentClient();
        docClient.put(params, (err : any, data : any) => {
            if (err) throw err;
            else {
                console.log(data)
                // dispatch('getDB')
                commit('pushItem',params.Item);
                rootState.isLoading = false

            }
        })
    },
    getDB({commit}) : void {
          // const docClient = new AWS.DynamoDB();
          const docClient = new AWS.DynamoDB.DocumentClient();


          const params = {
              TableName : 'rekognitionTable',

          };
        docClient.scan(params, (err : any, data : any) => {

            commit('getDB',data)
        })
    },
}