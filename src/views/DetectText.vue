<template>
    <div id="detectText">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p><button type="button" class="btn_upload" @click="uploadFile">upload</button></p>
        <div class="imgArea">
            <ul>
                <li>
                    <div class="card">
                        <figure>
                            <p class="placeholder"><img src="" alt=""></p>
                            <figcaption>sdfsdf</figcaption>
                        </figure>
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
        detectText : string,
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

                console.log('s3 upload success',data)

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
                                top : res.TextDetections[0].Geometry.BoundingBox.Top *  this.imgDimensions.height,
                                left: res.TextDetections[0].Geometry.BoundingBox.Left * this.imgDimensions.width
                            };
                            return returnObj
                        });



                        console.log(objectDimensions)


                    }

                })
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