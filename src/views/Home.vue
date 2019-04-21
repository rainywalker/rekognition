<template>
    <div class="home">
        <h1>AWS Rekonition Image Detect Test...</h1>
        <v-tabs
                v-model="active"
                color="cyan"
                dark
                slider-color="yellow"
        >
            <v-tab
                    v-for="n in 3"
                    :key="n"
                    ripple
            >
                Item {{ n }}

            </v-tab>
            <v-tab-item
                    v-for="n in 3"
                    :key="n"
            >
                <v-card flat>
                    <v-card-text>{{ text }}</v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs>
        <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

    @Component({
        components: {
            HelloWorld,
        },
    })
    export default class Home extends Vue {
        private text : string = 'xxx'
        private active :any = null

    }
</script>

<style lang="scss">
h1{text-align: center;margin-top:40px}
</style>
