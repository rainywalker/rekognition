<template>
    <div class="area">
        <fileHandle @uploadFile="uploadFile"></fileHandle>
        <detect-moderation-card v-for="(item,i) in getItems" :item="item" :key="i" />
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
    max-width:980px;margin:0 auto
}
</style>
