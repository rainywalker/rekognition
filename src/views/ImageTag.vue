<template>
    <div class="bodyWrap2">
        <image-tag></image-tag>
    </div>

</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import ImageTag from '@/components/ImageTag/index.vue'; // @ is an alias to /src

    @Component({
        components: {
            ImageTag,
        },
    })
    export default class detectLabel extends Vue {

    }
</script>

<style lang="scss" scoped>



</style>
