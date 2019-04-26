import Vue from 'vue'
import Vuex from 'vuex'
const AWS = require('aws-sdk');

Vue.use(Vuex);



export default new Vuex.Store({
    state: {
        bucketName : 'rekonition-img',
        bucketRegion : 'ap-northeast-2',
        IdentiryPoolId : 'ap-northeast-2:2d3bcfc3-d348-4ebe-b7dc-c08e0a0808e8',
        items : []
    },
    getters : {
        getItems : state => state.items
    },
    actions: {
        AWS_INIT({commit, state}) : void {
            AWS.config.update({
                region : state.bucketRegion,
                credentials : new AWS.CognitoIdentityCredentials({
                    IdentityPoolId : state.IdentiryPoolId
                })
            });

            commit('AWS_INIT')
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
        getDB({commit}) : void {
              const docClient = new AWS.DynamoDB()

              const params = {
                  TableName : 'rekognitionTable',

              }
            docClient.scan(params, (err : any, data : any) => {

                commit('getDB',data)
            })
        },
        putDB({commit}, res : any) : void {
            const items : Array<object> = res.res.Labels.map((v:any) => {
                return {
                    name : v.Name,
                    confidence : v.Confidence
                }
            });

            const params = {
                Item : {
                    p_key : res.name,
                    tag : items
                },
                TableName : 'rekognitionTable'
            }

            const docClient = new AWS.DynamoDB.DocumentClient();
            docClient.put(params, (err : any, data : any) => {
                if (err) throw err;
                else {
                    console.log(data)
                }
            })
        },
        s3Upload({state, commit, dispatch},file : any) : void {
            const s3 : any = new AWS.S3({
                apiVersion : '2006-03-01',
                params : {
                    Bucket : state.bucketName
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
        }
    },
    mutations: {
        getDB(state, obj) : void {
            state.items = obj.Items
        },
        AWS_INIT(state) : void {

            const s3 = new AWS.S3();
            s3.listObjects({
                Bucket : state.bucketName
            }, (err : any, data : any) => {
                if (err) {
                    console.log(err)
                }
                else {

                    data.Contents.forEach((v :any) => {

                        console.log(`https://${state.bucketName}.s3.amazonaws.com/${v.Key}`)
                    })

                }
            })

            // const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
            //
            // ddb.listTables({Limit:10}, (err :any, data : any) => {
            //     if (err) {
            //         console.log("Error", err.code);
            //     } else {
            //         console.log(data.TableNames[1])
            //
            //
            //     }
            // });
            // ddb.describeTable({
            //     TableName : 'sfn-workshop-setup-ImageMetadataDDBTable-1MVK8ZVISB067'
            // }, (error : any, res : any) => {
            //     console.log(res)
            // })
            // const params = {
            //    TableName : 'sfn-workshop-setup-ImageMetadataDDBTable-1MVK8ZVISB067',
            //
            // }
            // ddb.scan(params, (err:any, data:any) => {
            //     if (err) {
            //         console.log(err)
            //     }
            //     else {
            //         console.log(data)
            //     }
            // })

        }
    },
})
