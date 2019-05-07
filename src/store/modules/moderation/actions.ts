import { ActionTree } from 'vuex';
import { ModerationState } from '@/store/interface/state/moderation';
import { RootState } from '@/store/interface';
import {AWS} from '@/store/AWS'

export const actions : ActionTree<ModerationState, RootState> = {
    s3Upload({commit, dispatch}, file : any) : void {

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
                if (res.ModerationLabels.length > 0) dispatch('putDB', res.ModerationLabels);
                else {

                }

            }
        })
    },
    putDB({commit}, list : Array<object>) : void {

    }
}
