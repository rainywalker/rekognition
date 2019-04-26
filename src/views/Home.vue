<template>
    <div class="home">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p><button type="button" @click="uploadFile">upload</button></p>
        {{$store.state.items}}
        <v-flex xs12 sm6 offset-sm3>
            <v-card v-for="(item,i) in $store.state.items" :key="i">

                <v-img
                        :src="imgSrc(item.p_key.S)"
                        aspect-ratio="2.75"
                ></v-img>

                <v-card-title primary-title>
                    <div>
                        <h3 class="headline mb-0">{{item.p_key.S}}</h3>
                        <div v-for="(elem,idx) in item.tag.L" :key="idx">{{elem.M.name.S}} </div>
                    </div>
                </v-card-title>
            </v-card>
        </v-flex>

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

<style lang="scss">
h1{text-align: center;margin-top:40px}
</style>
