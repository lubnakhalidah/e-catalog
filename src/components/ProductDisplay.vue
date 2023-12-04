<script>
import LoadingSkeleton from './ProductDisplayLoader.vue'

export default {
    name: 'ProductDisplay',
    data() {
        return {
            products: [],
            currentIndex: 0,
            hasUnavailable: false,
            loading: true,
            loadingNextProduct: false,
        }
    },
    computed: {
        filteredProducts() {
            const allowedCategories = ['men\'s clothing', 'women\'s clothing', 'unavailable'];
            return this.products.filter(product => allowedCategories.includes(product.category.toLowerCase()))
        },
        currentProduct() {
            return this.filteredProducts[this.currentIndex] || {}
        }
    },
    methods: {
        async callProductAPI() {
            setTimeout(async () => {
                const productApi = await fetch('https://fakestoreapi.com/products')
                const products = await productApi.json()
                this.loading = false;

                const womensClothingIndex = products.findIndex(product => product.category.toLowerCase() === 'women\'s clothing');

                const unavailableProduct = {
                    id: 999,
                    title: 'Unavailable Product',
                    category: 'unavailable',
                    rating: 0,
                    description: 'This product is unavailable to show',
                    price: 0,
                    image: '@/assets/images/sad-face.svg',
                    available: false,
                };

                products.forEach(product => {
                    product.available = product.category.toLowerCase() !== 'unavailable';
                });

                const repeatCount = 10;

                for (let i = 0; i < repeatCount; i++) {
                    products.splice(womensClothingIndex, 0, { ...unavailableProduct, id: i + 999 });
                }

                this.hasUnavailable = products.some(product => !product.available);

                this.products = products
                // console.log(products);

                this.loading = false;

            }, 1000);
        },
        nextProduct() {
            this.loadingNextProduct = true;
            setTimeout(() => {
                this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length
                this.loadingNextProduct = false
            }, 1000);

        },
        formatBackground(category) {
            if (category === "men's clothing") {
                return 'bg-blue-light'
            } else if (category === "women's clothing") {
                return 'bg-pink'
            } else {
                return 'bg-light-grey'
            }
        },
        formatRating(rating) {
            return `${rating.rate}/5`
        },
        formatTitle(category) {
            if (category === 'men\'s clothing') {
                return 'text-blue-dark'
            } else {
                return 'text-purple-dark'
            }
        },
        formatPrice(category) {
            if (category === 'men\'s clothing') {
                return 'text-blue-dark'
            } else {
                return 'text-purple-dark'
            }
        },
        formatButtonBuy(category) {
            if (category === "men's clothing") {
                return {
                    'background-color': 'var(--blue-dark)',
                    'border': '1px solid var(--blue-dark)'
                }
            } else if (category === "women's clothing") {
                return {
                    'background-color': 'var(--purple-dark)',
                    'border': '1px solid var(--purple-dark)'
                }
            } else {
                return {
                    'background-color': 'var(--white)',
                    'border': '1px solid var(--black)'
                }
            }
        },
        formatButtonNext(category) {
            if (category === "men's clothing") {
                return {
                    'color': 'var(--blue-dark)',
                    'border': '1px solid var(--blue-dark)'
                }
            } else if (category === "women's clothing") {
                return {
                    'color': 'var(--pink)',
                    'border': '1px solid var(--purple-dark)'
                }
            } else {
                return {
                    'background-color': 'var(--white)',
                    'color': 'var(--black)',
                    'border': '2px solid var(--black)'
                }
            }
        }
    },
    mounted() {
        this.callProductAPI()
    },
    components: {
        LoadingSkeleton,
    }
}
</script>

<template>
    <div class="container">

        <LoadingSkeleton v-if="loading || loadingNextProduct" />

        <div :class="['container', formatBackground(currentProduct.category)]" v-else>
            <div class="overlay">
                <img src="../assets/images/bg-pattern.svg" alt="background pattern" class="overlay-background">
            </div>

            <div class="product-card" v-if="currentProduct.available">
                <div class="product-info" v-for="product in [currentProduct]" :key="product.id">
                    <div class="product-image">
                        <img :src="product.image" alt="Product Image" />
                    </div>
                    <div class="product-detail">
                        <div class="product-detail-top">
                            <h3 :class="['title', formatTitle(product.category)]">{{ product.title }}</h3>
                            <div class="sub-title">
                                <span> {{ product.category }}</span>
                                <div class="rating">
                                    <span> {{ formatRating(product.rating) }}</span>
                                    <span v-for="i in 5" :key="i"
                                        :class="{ 'circle': true, 'filled': i <= Math.floor(currentProduct.rating.rate) }"></span>
                                </div>
                            </div>
                            <div class="description">
                                <p>{{ product.description }}</p>
                            </div>
                        </div>
                        <div class="product-detail-bottom">
                            <span :class="formatPrice(product.category)">&dollar;{{ product.price }}</span>
                            <div class="button">
                                <button :style="formatButtonBuy(product.category)" type="button" class="btn-buy">Buy
                                    Now</button>
                                <button :style="formatButtonNext(product.category)" type="button" @click="nextProduct"
                                    class="btn-next">Next Product</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="product-card">
                <div class="unavailable-container">
                    <div class="overlay">
                        <img src="@/assets/images/sad-face.svg" alt="">
                    </div>
                    <div class="product-detail-unavailable">
                        <p>{{ currentProduct.description }}</p>
                        <div class="button-unavailable">
                            <button :style="formatButtonNext(currentProduct.category)" type="button" @click="nextProduct"
                                class="btn-next-unavailable">Next Product</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>