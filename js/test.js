document.addEventListener("DOMContentLoaded", () => {
    const maleBtn = document.getElementById("maleBtn");
    const femaleBtn = document.getElementById("femaleBtn");
    const allBtn = document.getElementById("allBtn");
    const productsContainerSale = document.getElementById("productsContainerSale");
    const productsContainerGender = document.getElementById("productsContainerGender");

    const API_URL = "https://api.noroff.dev/api/v1/rainy-days";
    let allProducts = []; 

    async function fetchData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Bad response from API");
            }
            const products = await response.json();
            allProducts = products;
        } catch (error) {
            console.log(error);
        }
    }

    fetchData().then(() => {
        singleProductSaleDOM();
        singleProductGenderDOM();
    });

    function getProductsByGender(gender) {
        return allProducts.filter(product => product.gender === gender);
    }

    function renderProducts(products) {
        return products.map(product => {
            const { id, image, price, title, discountedPrice, onSale } = product;
            return `
                <div class="single-product" id="product-id-${id}">
                    <div class="img-container">
                        ${onSale ? '<h2 class="sale-txt">SALE</h2>' : ''}
                        <a href="./product/index.html">
                            <img src="${image}" alt="${title}" />
                        </a>
                    </div>
                    <a href="./product/index.html"><h4>${title}</h4></a>
                    <div class="price-size">
                        <h3>Kr${onSale ? discountedPrice : price}</h3>
                        <div class="size-dropdown-container">
                            <div class="size-dropdown">
                                <select class="select-size">
                                    <option value="">XS</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="product-amount">
                        <i onclick="decrement(${id})" class="fa-solid fa-minus"></i>
                        <div id="quantity-${id}" class="quantity">0</div>
                        <i onclick="increment(${id})" class="fa-solid fa-plus"></i>
                    </div>
                </div>
            `;
        }).join("");
    }

    maleBtn.addEventListener("click", () => {
        const genderFiltered = getProductsByGender("Male");
        productsContainerGender.innerHTML = renderProducts(genderFiltered);
    });

    femaleBtn.addEventListener("click", () => {
        const genderFiltered = getProductsByGender("Female");
        productsContainerGender.innerHTML = renderProducts(genderFiltered);
    });


    function singleProductSaleDOM() {
        const productsOnSale = allProducts.filter(product => product.onSale);
        productsContainerSale.innerHTML = renderProducts(productsOnSale);
    }

    function singleProductGenderDOM() {
        productsContainerGender.innerHTML = renderProducts(allProducts);
    }

    window.increment = function(id) {
        console.log("Increment:", id);
    }

    window.decrement = function(id) {
        console.log("Decrement:", id);
    }
});
