<template>
    <div class="home">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p><button type="button" @click="uploadFile">upload</button></p>

    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
    const AWS = require('aws-sdk');

    @Component({
        components: {
            HelloWorld,
        },
    })
    export default class Home extends Vue {
        private file : any = null;
        private bucketName : string = 'rekonition-img';
        private bucketRegion : string = 'ap-northeast-2';
        private IdentiryPoolId : string = 'ap-northeast-2:2d3bcfc3-d348-4ebe-b7dc-c08e0a0808e8';


        uploadFile() : void {
            AWS.config.update({
                region : this.bucketRegion,
                credentials : new AWS.CognitoIdentityCredentials({
                    IdentityPoolId : this.IdentiryPoolId
                })
            });

            const s3 : any = new AWS.S3({
                apiVersion : '2006-03-01',
                params : {
                    Bucket : this.bucketName
                }
            });

            s3.upload({
                Key : this.file.name,
                Body : this.file,
                ACL : 'public-read'
            }, (err:any, data:any) => {
                if (err) {
                    console.log('err : ', err)
                }
                console.log('data : ', data);

                const rekognition : any = new AWS.Rekognition();

                rekognition.detectLabels({

                    Image : {
                        S3Object : {
                            Bucket : data.Bucket,
                            Name : data.Key
                        }
                    },
                    MaxLabels : 10,
                    MinConfidence : 50
                }, (err : any, res : any) => {
                    if (err) {
                        console.log('err : ',err)
                    }
                    else {
                        console.log('res : ',res)
                    }

                })
            })
        }

        handleFile(e : any) : void {

            this.file = e.target.files[0];



        }


    }
</script>

<style lang="scss">
h1{text-align: center;margin-top:40px}
</style>
