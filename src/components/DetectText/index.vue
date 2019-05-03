<template>
    <div class="wrap">
        <p><input type="file" id="file" ref="file" @change="handleFile"></p>
        <p>
            <button type="button" class="btn_upload" @click="uploadFile">upload</button>
        </p>

        <div class="imgArea">
            <ul class="imgList">
                <li class="listObj" v-for="(item,i) in getItems" :key="i">
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
            </ul>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {Action,Getter} from 'vuex-class';

    const namespace: string = 'textDetect';

    @Component
    export default class DetectText extends Vue {

        @Action('s3Upload', {namespace}) s3Upload : any;
        @Action('getDB', {namespace}) getDB : any;
        @Getter('getItems',{namespace}) getItems : any;

        private file: any = null;
        private imgDimensions: any = {
            width: null,
            height: null,
        };

        private created() {
            this.getDB()
        }

        getImageDimension() {
            const reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = (event: any) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = (evt: any) => {
                    this.imgDimensions.width = evt.path[0].width;
                    this.imgDimensions.height = evt.path[0].height;
                }

            }
        }
        handleFile(e: any): void {
            this.file = e.target.files[0];
            this.getImageDimension();
        }
        uploadFile() {
            this.s3Upload({
                file : this.file,
                imgDimensions : this.imgDimensions
            })
        }
    }
</script>

<style lang="scss" scoped>
    ul {
        margin: 0;
        padding: 0
    }

    li {
        list-style: none;
        margin: 0;
        padding: 0
    }

    .imgArea {
        .imgList {
            padding: 20px;
        }

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
    }

</style>
