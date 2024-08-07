const maleBtn = document.getElementById("maleBtn");
const femaleBtn = document.getElementById("femaleBtn");
const allBtn = document.getElementById("allBtn");
const productsContainerSale = document.getElementById("productsContainerSale") /* container of products list */
const productsContainerGender = document.getElementById("productsContainerGender") /* container of products list */
const sizeDropdown = document.getElementById("sizeDropdown")

const API_URL =  "https://api.noroff.dev/api/v1/rainy-days";
let allProducts = []; /* from emtpy to list of genderfiltered */

async function fetchData() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Bad response from API");
        }
        let products = await response.json(); 
        allProducts = products; /* change the value of empty array */
    } 
    catch (error){
        console.log(error);
    }

}

fetchData().then( () => {
    singleProductSaleDOM() /* display products on sale  */
    singleProductGenderDOM() /* display products on by gender  */
})  

function getProductsByGender(gender) {
   return allProducts.filter( allProducts => allProducts.gender === gender);
}

/* Gender filter button provides DOM display with on Sale/normal price info */
maleBtn.addEventListener("click", () => {
    let genderFiltered = getProductsByGender("Male");/* called the function and matched the parameter asked */ 
    return productsContainerGender.innerHTML = genderFiltered.map((x) => {
        let { id, image, price, title, discountedPrice, onSale } = x;
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
    }).join("")
})
/* Gender filter button provides DOM display with on Sale/normal price info */
femaleBtn.addEventListener("click", () => {
    let genderFiltered =  getProductsByGender("Female"); /* called the function and matched the parameter asked */
    return productsContainerGender.innerHTML = genderFiltered.map((x) => {
        let { id, image, price, title, discountedPrice, onSale } = x;
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
    }).join("")
})



/* OnSale Products display automatically on DOM */
let singleProductSaleDOM = () => {
    return (productsContainerSale.innerHTML = allProducts.map((x) => {
        let { id, image, price, title, discountedPrice, onSale } = x;
        if (onSale) {
            return `
                <div class="single-product" id="product-id-${id}">
                    <div class="img-container">
                        <h2 class="sale-txt">SALE</h2>
                        <a href="./product/index.html">
                            <img src="${image}" alt="${title}" />
                        </a>
                    </div>
                    <a href="./product/index.html"><h4>${title}</h4></a>
                    <div class="price-size">
                        <h3>Kr${discountedPrice}</h3>
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
        }
        return '';
    }).join(""))
    
} /*  to remove the comma in between datas */


/* All products display automatically on DOM */
let singleProductGenderDOM = () => {
    return productsContainerGender.innerHTML = allProducts.map((x) => {
        let { id, image, price, title, discountedPrice, onSale } = x;
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
    }).join("")/*  to remove the comma in between datas */
}



let increment = (id) => {
 console.log(id);
};

let decrement = (id) => {
    console.log(id);
};
let update = () => {

};