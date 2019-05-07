<template>
    <li class="listObj">
        <div class="imgPreview">
            <div class="card">
                <figure>
                                <span class="placeholder"><img
                                        :src="'https://rekonition-img.s3.amazonaws.com/'+item.d_key" alt=""></span>
                </figure>
            </div>
            <span v-for="(v,idx) in item.dimension" :key="idx">
                            <em class="boundingBox"
                                :style="{width:v.width + '%',height:v.height + '%',top:v.top + '%',left:v.left + '%'}"
                            ></em>
                        </span>
        </div>
        <div class="cardDesc">
            <ul>
                <li v-for="(v,idx) in item.extractText" :key="idx">
                    <dl class="txInfo">
                        <dt><strong>{{v.DetectedText}}</strong></dt>
                        <dd>{{v.Confidence.toFixed(2)}}%</dd>
                    </dl>
                </li>
            </ul>
        </div>
    </li>
</template>

<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';


    @Component
    export default class DetectTextCard extends Vue{
        @Prop(Object) item!:object;
    }
</script>

<style scoped lang="scss">
    .listObj {
        overflow: hidden;
        box-shadow: 1px 1px 2px #aaa;
        max-width: 900px;
        margin-bottom: 20px;

        .boundingBox {
            position: absolute;
            display: inline-block;
            border: 1px solid rgba(255, 255, 255, 0.69);
            box-shadow: 0 0 2px #14a5ff, 0 0 2px #14a5ff, 0 0 2px #14a5ff,
            0 0 2px #14a5ff, inset 0 0 2px #14a5ff, inset 0 0 2px #14a5ff,
            inset 0 0 2px #14a5ff, inset 0 0 2px #14a5ff !important
        }

        .imgPreview {
            display: inline-block;
            position: relative;
            float: left;
            max-width: 70%;

            figure {
                line-height: 0
            }

            .placeholder {
                position: relative;
                line-height: 0;
                display: inline-block;

                img {
                    max-width: 100%;
                    border: 0
                }
            }

        }

        .cardDesc {
            overflow: hidden;
            padding: 20px;

            .txInfo {
                overflow: hidden;

                dt {
                    display: block;
                    float: left;
                    clear: left;
                    margin-right: 10px
                }

                dd {
                    overflow: hidden
                }
            }
        }

    }
</style>