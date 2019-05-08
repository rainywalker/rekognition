import { ActionTree } from 'vuex';
import { ModerationState } from '@/store/interface/state/moderation';
import { RootState } from '@/store/interface';
import {AWS} from '@/store/AWS'
import moment from 'moment';

export const actions : ActionTree<ModerationState, RootState> = {
    async s3Upload({commit, dispatch, rootState}, file : any) {
        rootState.isLoading = true;
        const s3: any = new AWS.S3({
            apiVersion: '2006-03-01',
            params: {
                Bucket: 'rekonition-img/moderation'
            }
        });
        try {
            const result : any = await s3.upload({
                Key : file.name,
                Body : file,
                ACL : 'public-read',
                ContentType : file.type
            }).promise();

            dispatch('rekognition', result)
        }
        catch (e) {
            console.log(e)
        }

    },
    async rekognition({dispatch}, data) {

        const rekognition : any = new AWS.Rekognition();

        try {
            const result = await rekognition.detectModerationLabels({
                Image: {
                    S3Object: {
                        Bucket: 'rekonition-img',
                        Name: data.Key
                    }
                },
            }).promise();

            const moderationLabel = result.ModerationLabels.map((v:any) => {
                if (v.ParentName === '') {
                    v.ParentName = '-'
                }
                return v
            });

            dispatch('putDB', {
                moderationLabel,
                name : data.Key
            });
        }
        catch (e) {
            console.log(e)
        }
    },
    async putDB({commit,rootState}, {moderationLabel, name}) {

        const timestamp : string = moment().format('x');

        const params = {
            Item: {
                id: timestamp,
                name,
                tags: moderationLabel
            },
            TableName: 'rekogModeration'
        };

        const docClient : any = new AWS.DynamoDB.DocumentClient();

        try {
            const result = await docClient.put(params).promise();
            commit('pushItem',params.Item);
            rootState.isLoading = false;
        }
        catch (e) {
            console.log(e)
        }

    },
    async getDB({commit}) {
        const docClient : any = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'rekogModeration',
        };

        try {
            const result  = await docClient.scan(params).promise();
            commit('getItems', result.Items);
        }
        catch (e) {
            console.log(e)
        }
    }
}
