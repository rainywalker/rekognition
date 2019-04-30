<template>
    <div class="home">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p><button type="button" class="btn_upload" @click="uploadFile">upload</button></p>

        <div class="imgArea">
            <ul class="masonry">
                <li class="item" v-for="(item,i) in $store.state.items" :key="i">
                    <p><img :src="imgSrc(item.p_key)" alt=""></p>
                    <ul class="tags">
                        <li v-for="(elem,idx) in item.tag" :key="idx">
                            {{elem.name}}
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

    @Component({
        components: {
            HelloWorld,
        },
    })
    export default class Home extends Vue {
        private file : any = null;

        private created() {
            this.$store.dispatch('AWS_INIT');
            this.$store.dispatch('getDB')
        }
        imgSrc(str : string) : string {
            return `https://rekonition-img.s3.amazonaws.com/${str}`
        }
        uploadFile() : void {
            this.$store.dispatch('s3Upload', this.file)

        }
        handleFile(e : any) : void {
            this.file = e.target.files[0];

        }


    }
</script>

<style lang="scss" scoped>
h1{text-align: center;margin-top:40px}
li{list-style: none}
.btn_upload{background: dodgerblue;color:#fff;padding:5px 10px;border-radius: 10px}
.imgArea{width:980px;margin:0 auto;}
.masonry { /* Masonry container */
    column-count: 4;
    column-gap: 1em;
    .item {
        display: inline-block;
        margin: 0 0 1em;
        width: 100%;
        border:1px solid #ddd;
        .tags{
            overflow:hidden;margin:0;padding:0 10px 10px;
            li{
                float:left;background: darkslategray;color:#fff;padding:2px 5px;
                margin-right:5px;border-radius: 10px;margin-top:5px;
            }
        }
        img{
            max-width: 100%;
        }
    }
}


</style>
