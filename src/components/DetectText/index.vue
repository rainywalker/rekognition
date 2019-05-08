<template>
    <div class="wrap">
        <h2>Detect Text : 텍스트 감지</h2>
        <fileHandle @uploadFile="uploadFile" @handleFile="handleFile"></fileHandle>

        <div class="imgArea">
            <ul class="imgList">
                <detect-text-card v-for="(item,i) in getItems" :key="i" :item="item"></detect-text-card>
            </ul>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action,Getter} from 'vuex-class';

    import detectTextCard from './Card.vue';
    import FileHandle from '@/components/FileHandle.vue';

    const namespace: string = 'textDetect';

    @Component({
        components : {
            detectTextCard,
            FileHandle
        }
    })
    export default class DetectText extends Vue {

        @Action('s3Upload', {namespace}) s3Upload : any;
        @Action('getDB', {namespace}) getDB : any;
        @Getter('getItems',{namespace}) getItems : any;

        private file: any = null;
        private imgDimensions: any = {
            width: null,
            height: null,
        };

        private created() {
            this.getDB()
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
        handleFile(file : any): void {
            this.file = file;
            this.getImageDimension();
        }
        uploadFile() {
            this.s3Upload({
                file : this.file,
                imgDimensions : this.imgDimensions
            })
        }
    }
</script>

<style lang="scss" scoped>
    .wrap{
        max-width: 980px;margin:0 auto;
    }

    .imgArea {
        .imgList {
            padding: 20px;
        }


    }

</style>
