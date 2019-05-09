import { ActionTree } from 'vuex';
import { ImgDetectState } from '@/store/interface/state/detectImage';
import { RootState } from '@/store/interface';
import {AWS} from '@/store/AWS'
import * as awsCommon from "@/store/AWS_common";

export const actions : ActionTree<ImgDetectState, RootState> = {
    async s3Upload({rootState, commit, dispatch},file : any) {

        rootState.isLoading = true;

        const s3 = awsCommon.S3prepareParams('rekonition-img/detectLabel');

        try {

            const result : any = await s3.upload(awsCommon.s3uploadObject(file)).promise();

            dispatch('rekognition', result)
        }
        catch (e) {
            console.log(e)
        }
    },
    async rekognition({state,commit, dispatch}, data : any)  {
        const rekognition : any = new AWS.Rekognition();

        try {

            const result  = await rekognition.detectLabels(awsCommon.rekognitionObject(data)).promise();

            dispatch('putDB',{result,name : data.Key})

        }
        catch (e) {
            console.log(e)
        }

    },
    async putDB({rootState,commit, dispatch}, {result, name})  {

        const items : Array <object> = result.Labels.map((v:any) => {
            return {
                name : v.Name,
                confidence : v.Confidence
            }
        });

        const params = {
            Item : {
                p_key : name,
                tag : items
            },
            TableName : 'rekognitionTable'
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
            TableName : 'rekognitionTable',
        };

        try {
            const result : any = await docClient.scan(params).promise();
            commit('getDB',result)
        }
        catch (e) {
            console.log(e)
        }
    },
}
