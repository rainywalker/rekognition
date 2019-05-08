import { ActionTree } from 'vuex';
import { ModerationState } from '@/store/interface/state/moderation';
import { RootState } from '@/store/interface';
import {AWS} from '@/store/AWS'
import moment from 'moment';

export const actions : ActionTree<ModerationState, RootState> = {
    s3Upload({commit, dispatch, rootState}, file : any) : void {
        rootState.isLoading = true;
        const s3: any = new AWS.S3({
            apiVersion: '2006-03-01',
            params: {
                Bucket: 'rekonition-img/moderation'
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
    rekognition({dispatch}, data) : void {

        const rekognition : any = new AWS.Rekognition();

        rekognition.detectModerationLabels({
            Image: {
                S3Object: {
                    Bucket: 'rekonition-img',
                    Name: data.Key
                }
            },

        }, (err: any, res: any) => {
            if (err) throw err

            else {
                console.log(res);

                const moderationLabel = res.ModerationLabels.map((v:any) => {
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
        })
    },
    putDB({commit,rootState}, {moderationLabel, name}) : void {
        const timestamp = moment().format('x')
        console.log(Array.isArray(moderationLabel) ,moderationLabel)
        const params = {
            Item: {
                id: timestamp,
                name,
                tags: moderationLabel
            },
            TableName: 'rekogModeration'
        };

        const docClient = new AWS.DynamoDB.DocumentClient();

        docClient.put(params, (err: any, data: any) => {
            if (err) throw err;
            else {
                console.log(data)
                commit('pushItem',params.Item);
                rootState.isLoading = false;
            }
        })
    },
    getDB({commit}) : void {
        const docClient = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: 'rekogModeration',

        };
        docClient.scan(params, (err: any, data: any) => {

            commit('getItems', data.Items)

        })
    }
}
