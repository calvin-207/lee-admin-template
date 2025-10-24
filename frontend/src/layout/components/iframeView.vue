<template>
	<div class="iframe-pages">
        <iframe :key="route.meta.link" :src="route.meta.link" frameborder='0'></iframe>
	</div>
</template>

<script setup>
    import { useRoute } from 'vue-router'
    const route = useRoute()

</script>

<style scoped>
	.iframe-pages {
        width:100%;
        height:100%;
        background: #fff;
    }
	iframe {
        border:0;
        width:100%;
        height:100%;
        display: block;
    }
</style>
