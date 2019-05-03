<template>
  <div class="wrap">
    <p><input type="file" id="file" ref="file" @change="handleFile"></p>
    <p><button type="button" class="btn_upload" @click="uploadFile">upload</button></p>
    <div class="imgArea">
      <ul class="imgList">
        <li class="listObj" v-for="(item,i) in dataList" :key="i">
          <div class="imgPreview">
            <div class="card">
              <figure>
                <span class="placeholder"><img :src="'https://rekonition-img.s3.amazonaws.com/'+item.d_key" alt=""></span>
              </figure>
            </div>
            <span v-for="(v,idx) in item.dimension" :key="idx">
                            <em  class="boundingBox"
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
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class HelloWorld extends Vue{


  }
</script>

<style lang="scss" scoped>

</style>
