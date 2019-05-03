<template>
    <div class="wrap">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p>
            <button type="button" class="btn_upload" @click="uploadFile">upload</button>
        </p>
        <div class="imgArea">
            <ul class="imgList">
                <li class="listObj" v-for="(item,i) in dataList" :key="i">
                    <div class="imgPreview">
                        <div class="card">
                            <figure>
                                <span class="placeholder"><img
                                        :src="'https://rekonition-img.s3.amazonaws.com/'+item.d_key" alt=""></span>
                            </figure>
                        </div>
                        <span v-for="(v,idx) in item.dimension" :key="idx">
                            <em class="boundingBox"
                                :style="{width:v.width + '%',height:v.height + '%',top:v.top + '%',left:v.left + '%'}"
                            ></em>
                        </span>
                    </div>
                    <div class="cardDesc">
                        <ul>
                            <li v-for="(v,idx) in item.extractText" :key="idx">
                                <dl class="txInfo">
                                    <dt><strong>{{v.DetectedText}}</strong></dt>
                                    <dd>{{v.Confidence.toFixed(2)}}%</dd>
                                </dl>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>

</template>

<script lang="ts">
    const AWS = require('aws-sdk');
    AWS.config.update({
        region: 'ap-northeast-2',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'ap-northeast-2:2d3bcfc3-d348-4ebe-b7dc-c08e0a0808e8'
        })
    });

    import {Component, Vue} from 'vue-property-decorator';

    interface lineShape {
        detectText?: string,
        width: number,
        height: number,
        top: number,
        left: number
    }

    @Component
    export default class DetectText extends Vue {
        private file: any = null;
        private imgDimensions: any = {
            width: null,
            height: null,
        }
        private dataList: Array<object> = [];

        private created() {

            this.getDB();

        }

        getDB() {
            const docClient = new AWS.DynamoDB.DocumentClient();
            const params = {
                TableName: 'rekogDetectText',

            };
            docClient.scan(params, (err: any, data: any) => {
                this.dataList = [...data.Items]


            })

        }

        getImageDimension() {
            const reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = (event: any) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = (evt: any) => {
                    this.imgDimensions.width = evt.path[0].width;
                    this.imgDimensions.height = evt.path[0].height;
                }

            }
        }

        handleFile(e: any): void {
            this.file = e.target.files[0];
            this.getImageDimension();
        }

        putDB(lineArg: Array<object>, wordArg: Array<object>, key: string) {

            const params = {
                Item: {
                    d_key: key,
                    dimension: lineArg,
                    extractText: wordArg

                },
                TableName: 'rekogDetectText'
            };

            const docClient = new AWS.DynamoDB.DocumentClient();
            docClient.put(params, (err: any, data: any) => {
                if (err) throw err;
                else {
                    console.log(data)
                    this.getDB()


                }
            })


        }

        rekognitioner(data: any) {
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

                        const returnObj: lineShape = {
                            detectText: v.DetectedText,
                            width: ((v.Geometry.BoundingBox.Width * this.imgDimensions.width) / this.imgDimensions.width) * 100,
                            height: ((v.Geometry.BoundingBox.Height * this.imgDimensions.height) / this.imgDimensions.height) * 100,
                            top: ((v.Geometry.BoundingBox.Top * this.imgDimensions.height) / this.imgDimensions.height) * 100,
                            left: ((v.Geometry.BoundingBox.Left * this.imgDimensions.width) / this.imgDimensions.width) * 100
                        };
                        return returnObj
                    });
                    this.putDB(objectDimensions, words, data.Key)

                }

            })
        }

        uploadFile() {
            const s3: any = new AWS.S3({
                apiVersion: '2006-03-01',
                params: {
                    Bucket: 'rekonition-img/detectText'
                }
            });

            s3.upload({
                Key: this.file.name,
                Body: this.file,
                ACL: 'public-read',
                ContentType: this.file.type
            }, (err: any, data: any) => {
                if (err) {
                    throw err
                }
                this.rekognitioner(data)

                console.log('s3 upload success', data)


            })
        }


    }
</script>

<style lang="scss" scoped>
    ul {
        margin: 0;
        padding: 0
    }

    li {
        list-style: none;
        margin: 0;
        padding: 0
    }

    .imgArea {
        .imgList {
            padding: 20px;
        }

        .listObj {
            overflow: hidden;
            box-shadow: 1px 1px 2px #aaa;
            max-width: 900px;
            margin-bottom: 20px;

            .boundingBox {
                position: absolute;
                display: inline-block;
                border: 1px solid rgba(255, 255, 255, 0.69);
                box-shadow: 0 0 2px #14a5ff, 0 0 2px #14a5ff, 0 0 2px #14a5ff,
                0 0 2px #14a5ff, inset 0 0 2px #14a5ff, inset 0 0 2px #14a5ff,
                inset 0 0 2px #14a5ff, inset 0 0 2px #14a5ff !important
            }

            .imgPreview {
                display: inline-block;
                position: relative;
                float: left;
                max-width: 70%;

                figure {
                    line-height: 0
                }

                .placeholder {
                    position: relative;
                    line-height: 0;
                    display: inline-block;

                    img {
                        max-width: 100%;
                        border: 0
                    }
                }

            }

            .cardDesc {
                overflow: hidden;
                padding: 20px;

                .txInfo {
                    overflow: hidden;

                    dt {
                        display: block;
                        float: left;
                        clear: left;
                        margin-right: 10px
                    }

                    dd {
                        overflow: hidden
                    }
                }
            }

        }
    }

</style>
