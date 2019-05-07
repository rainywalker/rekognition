<template>
    <div class="imgArea">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p><button type="button" class="btn_upload" @click="uploadFile">upload</button></p>

        <ul class="masonry">
            <card v-for="(item,i) in getItems" :key="i" :item="item"></card>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import Card from './Card.vue';

    const namespace: string = 'labelDetect';

    @Component({
        components : {
            Card
        }
    })
    export default class ImageTag extends Vue {

        @Action('s3Upload', {namespace}) s3Upload : any;
        @Action('getDB', {namespace}) getDB : any;
        @Getter('getItems', {namespace}) getItems : any;

        private created() {
            this.getDB()
        }

        private file : any = null;

        uploadFile() : void {
            this.s3Upload(this.file)

        }
        handleFile(e : any) : void {
            this.file = e.target.files[0];

        }



    }
</script>

<style scoped lang="scss">
    h1{text-align: center;margin-top:40px}
    li{list-style: none}
    .btn_upload{background: dodgerblue;color:#fff;padding:5px 10px;border-radius: 10px}
    .imgArea{width:980px;margin:0 auto;}
    .masonry { /* Masonry container */
        column-count: 4;
        column-gap: 1em;

    }

</style>