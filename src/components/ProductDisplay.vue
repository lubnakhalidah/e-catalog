<script>

export default {
    name: 'ProductDisplay',
    data() {
        return {
            products: [],
            currentIndex: 0,
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
            const productApi = await fetch('https://fakestoreapi.com/products')
            const products = await productApi.json()
            this.products = products
            console.log(products);
        },
        nextProduct() {
            this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length
        },
        formatRating(rating) {
            return `${rating.rate}/5`
        },
        formatTitle(category){
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
                    'color': 'var(--white)',
                    'border': '1px solid var(--black)'
                }
            }
        }
//         formatButton(category) {
//     if (category === "men's clothing") {
//         return {
//             'background-color': 'var(--blue-dark)',
//             'border-color': 'var(--blue-dark)',
//         };
//     } else if (category === "women's clothing") {
//         return {
//             'background-color': 'var(--purple-dark)',
//             'border-color': 'var(--purple-dark)',
//         };
//     } else {
//         return {
//             'background-color': 'var(--white)',
//             'border-color': 'var(--white)',
//         };
//     }
// }
    },
    mounted() {
        this.callProductAPI()
    }
}
</script>

<template>
    <div class="container">
        <div class="container bg-blue-light">
            <div class="overlay">
                <img src="../assets/images/bg-pattern.svg" alt="background men" class="overlay-background">
            </div>
            <div class="product-card" v-for="product in [currentProduct]" :key="product.id">
                <div class="product-info">
                    <div class="product-image">
                        <img :src="product.image" alt="Product Image" />
                    </div>
                    <div class="product-detail">
                        <div :class="['title', formatTitle(product.category)]" >
                            <h3>{{ product.title }}</h3>
                        </div>
                        <div class="sub-title">
                            <p> {{ product.category }}</p>
                            <p> {{ formatRating(product.rating) }}</p>
                            <span v-for="i in 5" :key="i" :class="{'circle': true, 'filled': i <= Math.floor(currentProduct.rating.rate)}"></span>
                        </div>
                        <div class="description">
                            <p>{{ product.description }}</p>
                        </div>
                        <div class="price">
                            <p :class="formatPrice(product.category)">&dollar;{{ product.price }}</p>
                        </div>
                        <div class="button">
                            <button :style="formatButtonBuy(product.category)" type="button"  class="btn-buy">Buy Now</button>
                            <button :style="formatButtonNext(product.category)" type="button" @click="nextProduct" class="btn-next">Next Product</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>