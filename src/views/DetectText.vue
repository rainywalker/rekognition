<template>
    <div id="detectText">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p><button type="button" class="btn_upload" @click="uploadFile">upload</button></p>
        <div class="imgArea">

            <ul>
                <li v-for="(item,i) in boundingBox" :key="i">
                    <div class="card">
                        <figure>
                            <p class="placeholder"><img :src="'https://rekonition-img.s3.amazonaws.com/'+item.d_key" alt=""></p>
                            <figcaption>{{item.d_key}}</figcaption>
                        </figure>
                    </div>


                        <div v-for="(v,idx) in item.dimension" :key="idx">
                            {{v.detectText}}
                            <span style="position:absolute;border:1px solid red;display: inline-block"
                                :style="{width:v.width + 'px',height:v.height + 'px',top:v.top + 'px',left:v.left + 'px'}"
                            ></span>
                        </div>



                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    const AWS = require('aws-sdk');
    AWS.config.update({
        region : 'ap-northeast-2',
        credentials : new AWS.CognitoIdentityCredentials({
            IdentityPoolId : 'ap-northeast-2:2d3bcfc3-d348-4ebe-b7dc-c08e0a0808e8'
        })
    });

    import {Component, Vue} from 'vue-property-decorator';

    interface lineShape {
        detectText? : string,
        width : number,
        height:number,
        top : number,
        left : number
    }

    @Component
    export default class DetectText extends Vue{
        private file : any = null;
        private imgDimensions : any = {
            width : null,
            height: null,
        }
        private dataList : Array <object> = [];
        private boundingBox : any = []


        private created() {
            const s3 = new AWS.S3();
            // s3.listObjects({
            //     Bucket : 'rekonition-img',
            //     Prefix : 'detectText/'
            // }, (err : any, data : any) => {
            //     if (err) {
            //         console.log(err)
            //     }
            //     else {
            //         data.Contents.forEach((v :any) => {
            //
            //             this.dataList.push({
            //                 uri : `https://rekonition-img.s3.amazonaws.com/${v.Key}`
            //             })
            //
            //             // console.log(`https://${state.bucketName}.s3.amazonaws.com/${v.Key}`)
            //         })
            //         this.dataList.shift();
            //
            //     }
            // });

            this.getDB();



        }
        getDB() {
            const docClient = new AWS.DynamoDB.DocumentClient();
            const params = {
                TableName : 'rekogDetectText',

            };
            docClient.scan(params, (err : any, data : any) => {
                this.boundingBox = [...data.Items]
                console.log(data.Items)


            })

        }
        getImageDimension() {
            const reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = (event : any) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = (evt : any) => {
                    this.imgDimensions.width = evt.path[0].width;
                    this.imgDimensions.height = evt.path[0].height;
                }

            }
        }
        handleFile(e : any) : void {
            this.file = e.target.files[0];
            this.getImageDimension();
        }
        putDB(arg:Array<object>, key : string) {

            const params = {
                Item : {
                    d_key : key,
                    dimension : arg

                },
                TableName : 'rekogDetectText'
            };

            const docClient = new AWS.DynamoDB.DocumentClient();
            docClient.put(params, (err : any, data : any) => {
                if (err) throw err;
                else {
                    console.log(data)
                    this.getDB()



                }
            })


        }
        rekognitioner(data : any) {
            const rekognition : any = new AWS.Rekognition();

            rekognition.detectText({
                Image : {
                    S3Object : {
                        Bucket : 'rekonition-img',
                        Name : data.Key
                    }
                }
            }, (err : any, res : any) => {
                if (err) throw err

                else {
                    console.log(res)
                    const lines : Array <object> = res.TextDetections.filter((v : any) => v.Type === 'LINE');
                    const words : Array <object> = res.TextDetections.filter((v : any) => v.Type === 'WORD');

                    const objectDimensions = lines.map((v:any) => {

                        const returnObj : lineShape = {
                            detectText : v.DetectedText,
                            width : v.Geometry.BoundingBox.Width * this.imgDimensions.width,
                            height : v.Geometry.BoundingBox.Height * this.imgDimensions.height,
                            top : v.Geometry.BoundingBox.Top *  this.imgDimensions.height,
                            left: v.Geometry.BoundingBox.Left * this.imgDimensions.width
                        };
                        return returnObj
                    });
                    this.putDB(objectDimensions, data.Key)
                    console.log(objectDimensions)





                }

            })
        }
        uploadFile() {
            const s3 : any = new AWS.S3({
                apiVersion : '2006-03-01',
                params : {
                    Bucket : 'rekonition-img/detectText'
                }
            });

            s3.upload({
                Key : this.file.name,
                Body : this.file,
                ACL : 'public-read',
                ContentType : this.file.type
            }, (err:any, data:any) => {
                if (err) {
                    throw err
                }
                this.rekognitioner(data)
                this.dataList.unshift({
                    uri : data.Location,
                });
                console.log('s3 upload success',data)


            })
        }


    }
</script>

<style scoped lang="scss">
ul{margin:0;padding:0}
li{list-style: none;margin:0;padding:0}
    .imgArea{
        li{
            position: relative;
        }
    }
</style>