<template>
    <li class="cardObj">
        <span class="placeholder">
            <img :src="imgSrc(item.name)" :class="{blur:isBlind  && seen === true}" alt="">
            <em v-if="isBlind && seen === true" class="blindLayer"> </em>
            <button type="button" v-if="isBlind  && seen === true" class="showMe" @click="showMe">show me</button>
        </span>
        <ul class="tags">
            <li v-for="(v,i) in item.tags" :key="i">
                <dl>
                    <dt>{{v.Name}} </dt>
                    <dd>{{v.Confidence.toFixed(2)}}%</dd>
                </dl>
            </li>
        </ul>
    </li>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component
    export default class DetectModerationCard extends Vue {

        @Prop(Object) item!:any;

        private seen : boolean = false;

        created() {
            if (this.item.tags.length > 0) {
                this.item.tags.forEach((v : any) => {
                    if (v.Name === 'Explicit Nudity') {
                        this.seen = true;
                    }
                })
            }
            else {
                this.seen = false
            }
        }
        private get isBlind() {
            if (this.item.tags.length > 0) {
                return this.item.tags.map((v : any) => v.Name === 'Explicit Nudity')[0]
            }
            else return false
        }

        showMe() : void {
            this.seen = false
        }

        imgSrc(str : string) : string {
            return `https://rekonition-img.s3.amazonaws.com/${str}`
        }

    }
</script>

<style scoped lang="scss">
.wrap{
    .cardObj{
        display: inline-block;margin:0 0 1em;overflow: hidden;position: relative;box-shadow: 1px 1px 2px #aaa;
        background: #f1f1f1;
        .placeholder{
            position: relative;display: inline-block;overflow: hidden;line-height: 0;
            max-width:70%;float:left;
            .blindLayer{
                position: absolute;left:0;top:0;right:0;bottom:0;z-index: 1;
                background: rgba(0,0,0,.6);
            }
            .blur{
                filter:blur(25px)
            }
            img{max-width:100%}
        }
        .tags{overflow: hidden;padding:10px;}
        .showMe{position: absolute;left:50%;top:50%;margin:-20px 0 0 -50px;
            border:2px solid #fff;border-radius: 4px;text-align: center;width:100px;height:40px;z-index: 10;
            cursor:pointer;color:#fff}
    }
}
</style>