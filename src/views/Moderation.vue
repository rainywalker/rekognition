<template>
    <div>
        <moderation></moderation>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Moderation from '@/components/Moderation/index.vue';

    @Component({
        components : {
            Moderation
        }
    })
    export default class detectModeration extends Vue {

    }
</script>

<style scoped>

</style>
