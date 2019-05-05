<template>
    <div class="area">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p><button type="button" class="btn_upload" @click="uploadFile">upload</button></p>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';

    const namespace: string = 'moderationDetect';

    @Component
    export default class Moderation extends Vue {
        @Action('s3Upload', {namespace}) s3Upload : any;

        private file : any = null;


        uploadFile() : void {
            this.s3Upload(this.file)

        }
        handleFile(e : any) : void {
            this.file = e.target.files[0];

        }

    }
</script>

<style scoped>

</style>
