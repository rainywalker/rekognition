<template>
    <div class="home">
        <image-tag></image-tag>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import ImageTag from '@/components/ImageTag.vue'; // @ is an alias to /src

    const namespace: string = 'imageDetect';

    @Component({
        components: {
            ImageTag,
        },
    })
    export default class Home extends Vue {
    }
</script>

<style lang="scss" scoped>



</style>
