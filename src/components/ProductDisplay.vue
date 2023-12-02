<script>

export default {
    name: 'ProductDisplay',
    data() {
        return {
            products: [],
            currentIndex: 0,
            hasUnavailable: false,
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

            // const mensClothingIndex = products.findIndex(product => product.category.toLowerCase() === 'men\'s clothing');
            const womensClothingIndex = products.findIndex(product => product.category.toLowerCase() === 'women\'s clothing');


            // for (const product of products) {
            //     if (product.category.toLowerCase() === 'unavailable') {
            //         hasUnavailable = true;
            //         break;
            //     }
            // }
            // Tambahkan satu produk "unavailable" di antara "mens clothing" dan "womens clothing"

            const unavailableProduct = {
                id: 999, // Atur id yang unik
                title: 'Unavailable Product',
                category: 'unavailable',
                rating: 0,
                description: 'This product is unavailable to show',
                price: 0,
                image: '@/assets/images/sad-face.svg', // Ganti dengan URL gambar sesuai kebutuhan
                available: false,
            };

            products.forEach(product => {
                product.available = product.category.toLowerCase() !== 'unavailable';
            });
            const repeatCount = 2;

            for (let i = 0; i < repeatCount; i++) {
                products.splice(womensClothingIndex, 0, { ...unavailableProduct, id: i + 999 });
            }

            this.hasUnavailable = products.some(product => !product.available);



            this.products = products
            console.log(products);
        },
        nextProduct() {
            this.currentIndex = (this.currentIndex + 1) % this.filteredProducts.length
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

            <div class="product-card" v-if="currentProduct.available">
                <div class="product-info" v-for="product in [currentProduct]" :key="product.id">
                    <div class="product-image">
                        <img :src="product.image" alt="Product Image" />
                    </div>
                    <div class="product-detail">
                        <div :class="['title', formatTitle(product.category)]">
                            <h3>{{ product.title }}</h3>
                        </div>
                        <div class="sub-title">
                            <p> {{ product.category }}</p>
                            <p> {{ formatRating(product.rating) }}</p>
                            <span v-for="i in 5" :key="i"
                                :class="{ 'circle': true, 'filled': i <= Math.floor(currentProduct.rating.rate) }"></span>
                        </div>
                        <div class="description">
                            <p>{{ product.description }}</p>
                        </div>
                        <div class="price">
                            <p :class="formatPrice(product.category)">&dollar;{{ product.price }}</p>
                        </div>
                        <div class="button">
                            <button :style="formatButtonBuy(product.category)" type="button" class="btn-buy">Buy
                                Now</button>
                            <button :style="formatButtonNext(product.category)" type="button" @click="nextProduct"
                                class="btn-next">Next Product</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-card" v-else>
                <div class="unavailable-container">
                    <div class="unavailable-image">
                        <img src="@/assets/images/sad-face.svg" alt="">
                    </div>
                    <div class="product-detail-unavailable">
                        <p>{{ currentProduct.description }}</p>
                        <div class="button">
                            <button :style="formatButtonNext(currentProduct.category)" type="button" @click="nextProduct"
                                class="btn-next">Next Product</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>