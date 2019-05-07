<template>
    <div class="area">
        <fileHandle @uploadFile="uploadFile"></fileHandle>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import FileHandle from '@/components/FileHandle.vue';

    const namespace: string = 'moderationDetect';

    @Component({
        components : {
            FileHandle
        }
    })
    export default class Moderation extends Vue {
        @Action('s3Upload', {namespace}) s3Upload : any;

        private file : any = null;


        uploadFile(file : any) : void {
            this.s3Upload(file)

        }


    }
</script>

<style scoped>

</style>
