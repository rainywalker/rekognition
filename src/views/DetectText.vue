<template>
    <div id="detectText">
        <detect-text></detect-text>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import DetectText from '@/components/DetectText.vue';

    @Component({
        components : {
            DetectText
        }
    })
    export default class txDetect extends Vue{


    }
</script>

<style scoped lang="scss">

</style>