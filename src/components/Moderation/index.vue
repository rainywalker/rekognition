<template>
    <div class="area">
        <h2>Detect Moderation : 안전하지 않은 이미지(후방주의?) 감지</h2>
        <fileHandle @uploadFile="uploadFile"></fileHandle>
        <ul class="wrap">
            <detect-moderation-card v-for="(item,i) in getItems" :item="item" :key="i" />
        </ul>

    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import FileHandle from '@/components/FileHandle.vue';
    import DetectModerationCard from './Card.vue';


    const namespace: string = 'moderationDetect';

    @Component({
        components : {
            FileHandle,
            DetectModerationCard
        }
    })
    export default class Moderation extends Vue {
        @Action('s3Upload', {namespace}) s3Upload : any;
        @Action('getDB', {namespace}) getDB : any;
        @Getter('getItems', {namespace}) getItems : any;


        private created() {
            this.getDB()
        }
        private file : any = null;


        uploadFile(file : any) : void {
            this.s3Upload(file)

        }


    }
</script>

<style scoped lang="scss">
.area{
    max-width:980px;margin:0 auto;
    .wrap{
        column-count: 2;
        column-gap: 1em;
        margin-top:20px;
    }
    @media screen and (max-width: 40em) {
        .wrap{
            column-count: 1;
        }
    }
}
</style>
