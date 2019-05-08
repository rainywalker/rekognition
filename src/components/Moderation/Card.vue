<template>
    <div class="wrap">

        <figure>
                <span class="placeholder">
                    <img :src="imgSrc(item.name)" :class="blind" alt="">
                    <em v-if="modal" class="blindLayer"> </em>
                </span>

            <figcaption>{{item.name}}</figcaption>
        </figure>


    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component
    export default class DetectModerationCard extends Vue {

        @Prop(Object) item!:any;

        private seen : boolean = false;
        private modal : boolean =  false;

        get blind () {
            if (this.item.tags.length > 0) {
                this.item.tags.forEach((v : any) => {
                    if (v.Name === 'Explicit Nudity') {
                        this.seen = true;
                        this.modal = true;
                    }
                })
            }

            return {
                blur : this.seen,
            }
        }
        imgSrc(str : string) : string {
            return `https://rekonition-img.s3.amazonaws.com/${str}`
        }

    }
</script>

<style scoped lang="scss">
.wrap{
    .placeholder{
        position: relative;display: inline-block;overflow: hidden;line-height: 0;font-size: 0;
        .blindLayer{
            position: absolute;left:0;top:0;right:0;bottom:0;z-index: 1;
            background: rgba(0,0,0,.6);
        }
        .blur{
            filter:blur(50px)
        }
    }
}
</style>