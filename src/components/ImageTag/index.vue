<template>
    <div class="imgArea">
        <fileHandle @uploadFile="uploadFile"></fileHandle>
        <ul class="masonry">
            <card v-for="(item,i) in getItems" :key="i" :item="item"></card>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import Card from './Card.vue';
    import FileHandle from '@/components/FileHandle.vue';

    const namespace: string = 'labelDetect';

    @Component({
        components : {
            Card,
            FileHandle
        }
    })


    export default class ImageTag extends Vue {

        @Action('s3Upload', {namespace}) s3Upload : any;
        @Action('getDB', {namespace}) getDB : any;
        @Getter('getItems', {namespace}) getItems : any;


        private created() {
            this.getDB()
        }




        uploadFile(file : any) : void {
            console.log(file)
            this.s3Upload(file)

        }




    }
</script>

<style scoped lang="scss">
    h1{text-align: center;margin-top:40px}
    li{list-style: none}

    .imgArea{max-width:980px;margin:0 auto;}
    .masonry {

        column-count: 4;
        column-gap: 1em;
        margin-top:20px

    }
    @media screen and (max-width: 40em) {
        .masonry{
            column-count: 1;
        }
    }

</style>