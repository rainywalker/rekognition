<template>
    <div class="inputFile">
        <v-text-field label="Select Image" v-model="imageName" @click='pickFile' prepend-icon='attach_file'></v-text-field>
        <input  type="file" style="display: none" ref="file" accept="image/*" @change="handleFile">
        <p><button type="button" class="btn_upload" @click="uploadFile">Upload</button></p>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Emit} from 'vue-property-decorator';

    @Component
    export default class FileHandle extends Vue{

        private file : any = null;
        private imageName : string = '';

        @Emit('handleFile')
        handleFile(changeEvent : any) : void {
            this.file = changeEvent.target.files[0];
            this.imageName = this.file.name
            return this.file
        }

        pickFile() : void {
            const elem : HTMLElement = this.$refs.file as HTMLElement;
            elem.click()
        }


        uploadFile() {

            if (this.file === null) {
                alert('이미지를 선택해주세요')
                return false
            }
            else {
                this.$emit('uploadFile', this.file)
            }

        }
    }
</script>

<style scoped lang="scss">
    .inputFile{
        .btn_upload{background: dodgerblue;color:#fff;padding:5px 10px;margin-left:20px;}
        display: flex;align-items: center;
    }
</style>