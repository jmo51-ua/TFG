<template>
    <div class="swiper-nav-btns">
      <button @click="slidePrev"></button>
      <button @click="slideNext"></button>
    </div>
</template>

<script>
    export default {
    name: 'SwiperNavButtons',
    inject: ['swiper'],
    methods: {
        slidePrev() {
        if (this.swiper) {
            this.swiper.slidePrev();
        }
        },
        slideNext() {
        if (this.swiper) {
            this.swiper.slideNext();
        }
        }
    }
    };
</script>