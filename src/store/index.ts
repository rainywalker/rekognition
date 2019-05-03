import Vue from 'vue';
import Vuex, {StoreOptions} from 'vuex';
import {imageDetect} from './modules/detectImage'
import { RootState } from '@/store/interface';
import {AWS} from './AWS'


Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    state: {
        bucketName : 'rekonition-img',
        bucketRegion : 'ap-northeast-2',
        IdentiryPoolId : 'ap-northeast-2:2d3bcfc3-d348-4ebe-b7dc-c08e0a0808e8'
    },
    getters : {},
    modules: {
        imageDetect
    },
    mutations: {

    },
    actions: {
        AWS_INIT({commit, state}) : void {

            AWS.config.update({
                region : state.bucketRegion,
                credentials : new AWS.CognitoIdentityCredentials({
                    IdentityPoolId : state.IdentiryPoolId
                })
            });

        },
    },
});


// export default new Vuex.Store({
//     state: {
//         bucketName : 'rekonition-img',
//         bucketRegion : 'ap-northeast-2',
//         IdentiryPoolId : 'ap-northeast-2:2d3bcfc3-d348-4ebe-b7dc-c08e0a0808e8',
//         items : []
//     },
//     getters : {
//         getItems : state => state.items
//     },
//     actions: {
//         AWS_INIT({commit, state}) : void {
//             AWS.config.update({
//                 region : state.bucketRegion,
//                 credentials : new AWS.CognitoIdentityCredentials({
//                     IdentityPoolId : state.IdentiryPoolId
//                 })
//             });
//
//             commit('AWS_INIT')
//         },
//         rekognition({state,commit, dispatch}, data : any) : void {
//             const rekognition : any = new AWS.Rekognition();
//
//             rekognition.detectLabels({
//                 Image : {
//                     S3Object : {
//                         Bucket : data.Bucket,
//                         Name : data.Key
//                     }
//                 }
//             }, (err : any, res : any) => {
//                 if (err) throw err
//
//                 else {
//
//                     dispatch('putDB',{res,name : data.Key})
//
//
//                 }
//
//             })
//         },
//         getDB({commit}) : void {
//               // const docClient = new AWS.DynamoDB();
//               const docClient = new AWS.DynamoDB.DocumentClient();
//
//
//               const params = {
//                   TableName : 'rekognitionTable',
//
//               };
//             docClient.scan(params, (err : any, data : any) => {
//
//                 commit('getDB',data)
//             })
//         },
//         putDB({commit, dispatch}, res : any) : void {
//             const items : Array <object> = res.res.Labels.map((v:any) => {
//                 return {
//                     name : v.Name,
//                     confidence : v.Confidence
//                 }
//             });
//             console.log(res)
//             const params = {
//                 Item : {
//                     p_key : res.name,
//                     tag : items
//                 },
//                 TableName : 'rekognitionTable'
//             };
//
//             const docClient = new AWS.DynamoDB.DocumentClient();
//             docClient.put(params, (err : any, data : any) => {
//                 if (err) throw err;
//                 else {
//                     console.log(data)
//                     // dispatch('getDB')
//                     commit('pushItem',params.Item)
//
//                 }
//             })
//         },
//         s3Upload({state, commit, dispatch},file : any) : void {
//             const s3 : any = new AWS.S3({
//                 apiVersion : '2006-03-01',
//                 params : {
//                     Bucket : state.bucketName
//                 }
//             });
//
//             s3.upload({
//                 Key : file.name,
//                 Body : file,
//                 ACL : 'public-read',
//                 ContentType : file.type
//             }, (err:any, data:any) => {
//                 if (err) {
//                     throw err
//                 }
//                 dispatch('rekognition', data)
//             })
//         }
//     },
//     mutations: {
//         getDB(state, obj) : void {
//             state.items = obj.Items
//         },
//         pushItem(state : any, obj : any) : void {
//             state.items.unshift(obj)
//         },
//         AWS_INIT(state) : void {
//
//             // const s3 = new AWS.S3();
//             // s3.listObjects({
//             //     Bucket : state.bucketName
//             // }, (err : any, data : any) => {
//             //     if (err) {
//             //         console.log(err)
//             //     }
//             //     else {
//             //
//             //         data.Contents.forEach((v :any) => {
//             //             console.log(v)
//             //             // console.log(`https://${state.bucketName}.s3.amazonaws.com/${v.Key}`)
//             //         })
//             //
//             //     }
//             // })
//         }
//     }
// })
