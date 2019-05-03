<template>
    <li class="item" >
        <p><img :src="imgSrc(item.p_key)" alt=""></p>
        <ul class="tags">
            <li v-for="(elem,idx) in item.tag" :key="idx">
                {{elem.name}}
            </li>
        </ul>
    </li>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component
    export default class Card extends Vue {
        @Prop(Object) item!:object;

        imgSrc(str : string) : string {
            return `https://rekonition-img.s3.amazonaws.com/${str}`
        }

    }
</script>

<style lang="scss" scoped>
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

</style>