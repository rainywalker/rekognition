<template>
    <div class="loading">
        <div class="text-xs-center">
            <v-progress-circular
                    :size="70"
                    :width="7"
                    color="red"
                    indeterminate
            ></v-progress-circular>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class LoadingBar extends Vue{

    }
</script>

<style scoped lang="scss">
.loading{
    position: fixed;left:0;top:0;right:0;bottom:0;z-index: 100;background: rgba(0,0,0,.6);
    .text-xs-center{
        height:100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>