
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIPtxYv2mhGB2j3H25MHKR8nxOGcKdPoc",
    authDomain: "e-commerce-4a591.firebaseapp.com",
    projectId: "e-commerce-4a591",
    storageBucket: "e-commerce-4a591.appspot.com",
    messagingSenderId: "828519444034",
    appId: "1:828519444034:web:c0603781847b8e932d07db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Storage
const storage = getStorage(app);
// Initialize Firestore
const db = getFirestore(app);
// Get the Auth instance
const auth = getAuth();

// on load fuction 
window.addEventListener('load', async function () {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('loaded');
    });

    womenLink.style.color = 'orangered';
    await fetchAndDisplayWomenClothing();

});

// to link smallImgElements to shop page
const smallImgElements = document.querySelectorAll('.small-img');

function redirectToPage(event) {
    const pageURL = './shop.html';
    window.location.href = pageURL;
}

smallImgElements.forEach((element) => {
    element.addEventListener('click', redirectToPage);
});

// to fetch product 

let womenLink = document.getElementById('womenLink')
let menLink = document.getElementById('menLink')
let ElecLink = document.getElementById('ElecLink')
let JeweLink = document.getElementById('JeweLink')
let display = document.getElementById('display');
let spinner = document.getElementById('spinner')
let CartBTN = document.getElementById('CartBTN')

function truncateTitle(title) {
    const words = title.split(' ');
    const truncatedTitle = words.slice(0, 5).join(' ');
    return truncatedTitle;
}

// 1) Women's
async function fetchAndDisplayWomenClothing() {
    display.innerHTML = ''
    spinner.classList.remove('d-none')
    try {
        const res = await fetch('https://fakestoreapi.com/products/category/women%27s%20clothing');
        const data = await res.json();
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    finally {
        spinner.classList.add('d-none')
    }
}

womenLink.addEventListener('click', async function (event) {
    event.preventDefault();
    await fetchAndDisplayWomenClothing();

    womenLink.style.color = 'orangered';
    menLink.style.color = 'gray';
    ElecLink.style.color = 'gray';
    JeweLink.style.color = 'gray';
});

// 2) Men's
async function fetchAndDisplayMenClothing() {
    display.innerHTML = '';
    spinner.classList.remove('d-none')
    try {
        const res = await fetch('https://fakestoreapi.com/products/category/men%27s%20clothing');
        const data = await res.json();
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    finally {
        spinner.classList.add('d-none')
    }
}

menLink.addEventListener('click', async function (event) {
    event.preventDefault();
    await fetchAndDisplayMenClothing();

    menLink.style.color = 'orangered';
    womenLink.style.color = 'gray';
    ElecLink.style.color = 'gray';
    JeweLink.style.color = 'gray';
});

// 3) Kids
async function fetchAndDisplayElectronics() {
    display.innerHTML = '';
    spinner.classList.remove('d-none')
    try {
        const res = await fetch('https://fakestoreapi.com/products/category/electronics');
        const data = await res.json();

        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    finally {
        spinner.classList.add('d-none')
    }
}

ElecLink.addEventListener('click', async function (event) {
    event.preventDefault();
    await fetchAndDisplayElectronics();

    ElecLink.style.color = 'orangered';
    womenLink.style.color = 'gray';
    menLink.style.color = 'gray';
    JeweLink.style.color = 'gray';
});

// 4) Shoes
async function fetchAndDisplayJewe() {
    display.innerHTML = '';
    spinner.classList.remove('d-none')
    try {
        const res = await fetch('https://fakestoreapi.com/products/category/jewelery');
        const data = await res.json();

        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
        data.forEach((elem) => {
            const truncatedTitle = truncateTitle(elem.title);
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src=${elem.image} class="card-img-top" alt="...">
                <div class="card-body">
                    <p>${truncatedTitle}</p>
                    <p>$${elem.price}</p> 
                    <button class="bottom-button">+ Quick View</button>
                </div>
            `;

            const quickViewButton = card.querySelector('.bottom-button');
            quickViewButton.addEventListener('click', (event) => view(event));

            display.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    finally {
        spinner.classList.add('d-none')
    }
}

JeweLink.addEventListener('click', async function (event) {
    event.preventDefault();
    await fetchAndDisplayJewe()

    JeweLink.style.color = 'orangered';
    ElecLink.style.color = 'gray';
    womenLink.style.color = 'gray';
    menLink.style.color = 'gray';
});

// Function to display a message when clicking the "View" button

function view(event) {
    event.preventDefault();

    let clickedButton = event.currentTarget;
    let card = clickedButton.closest('.card');

    if (card) {
        let imageSrc = card.querySelector('img').src;
        let title = card.querySelector('.card-body p:first-of-type').innerText;
        let price = card.querySelector('.card-body p:nth-of-type(2)').innerText;

        let displayedImage = document.getElementById('displayedImage');
        let displayTitle = document.getElementById('displayTitle');
        let displayPrice = document.getElementById('displayPrice');

        displayedImage.src = imageSrc;
        displayTitle.innerText = title;
        displayPrice.innerText = price;

        let setAlarm = document.querySelector('.setAlarm');
        setAlarm.style.display = 'block';
    }
}


display.addEventListener('click', function (event) {
    if (event.target.nodeName === "BUTTON") {
        view(event)
    }
});

let cancel = document.querySelector('.setAlarm')
let cancel2 = document.querySelector('.cancel-message')
cancel2.addEventListener('click', function(event){
    event.preventDefault()
    let messageDiv = document.querySelector('.div-message');
    messageDiv.style.display = 'none';
})
cancel.addEventListener('click', function (event) {
    if (event.target.nodeName === 'SPAN') {
        can(event)
    }
    if (event.target.nodeName === 'BUTTON') {
        addToCart(event)
    }
})

function can(event) {
    event.preventDefault()
    let setALarm = document.querySelector('.setALarm');
    setALarm.style.display = 'none';
}

async function updateCartItemCount() {
    try {
        const user = auth.currentUser;

        if (user) {
            const userId = user.uid; 

            const userCartRef = collection(db, 'Carts', userId, 'cartItems');

            const querySnapshot = await getDocs(userCartRef);
            const itemCount = querySnapshot.size; 

            const cartNumParagraphs = document.querySelectorAll('.cart-num');
            cartNumParagraphs.forEach((cartNumParagraph) => {
                cartNumParagraph.textContent = `${itemCount} item(${itemCount !== 1 ? 's' : ''})`;
            });
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

window.addEventListener('load', updateCartItemCount());

let userCartRef;

const user = auth.currentUser;

window.addEventListener('load', async function () {
    auth.onAuthStateChanged(async (user) => {
        const loginLinks = document.querySelectorAll('.logregdiv');
        const logoutTexts = document.querySelectorAll('.logout');

        if (user) {

            const userId = user.uid; 
            console.log("Current user UID:", userId);
            userCartRef = collection(db, 'Carts', userId, 'cartItems');
            await updateCartItemCount(); 

            loginLinks.forEach(link => link.style.display = 'none');
            logoutTexts.forEach(text => text.textContent = 'Logout'); 

            userCartRef = collection(db, 'Carts', userId, 'cartItems');
            await updateCartItemCount();
        } else {
            console.log("No user signed in.");

            loginLinks.style.display = 'block';
            logoutTexts.textContent = '';
        }
    });
});


// fuction to add to carts
async function addToCart(event) {
    event.preventDefault();

    const user = auth.currentUser;

    if (!user) {
        window.location.href = './html/logreg.html';
        return;
    }

    CartBTN = event.currentTarget;
    const spinners = CartBTN.querySelector('#spinnerss');

    const displayedImage = document.getElementById('displayedImage').src;
    const displayTitle = document.getElementById('displayTitle').innerText;
    const displayPrice = document.getElementById('displayPrice').innerText;
    const selectedSize = document.getElementById('sizeSelect').value;
    const selectedColor = document.getElementById('colorSelect').value;
    const quantity = document.getElementById('quantityInput').value;
    let messageDiv = document.querySelector('.div-message');
    let message = document.getElementById('message');

    spinners.classList.remove('d-none');
    CartBTN.disabled = true;

    try {
        const blob = await fetch(displayedImage).then((res) => res.blob());
        const randNum = Math.floor(Math.random() * 10000);
        const imageName = `product_image_${randNum}`;
        const storageRef = ref(storage, imageName);
        await uploadBytes(storageRef, blob);  
        const imgURL = await getDownloadURL(storageRef);
        console.log('Image uploaded successfully:', imgURL);
        const newProduct = await addDoc(userCartRef, {
            displayedImage: imgURL,
            displayTitle,
            displayPrice,
            selectedSize,
            selectedColor,
            quantity
        });

        await updateCartItemCount();
        can(event);
        messageDiv.style.display = 'block';
        message.innerHTML = 'Product added to the cart successfully';
    }catch (error) {
        message.innerHTML = 'Error adding product to cart';
    }
    finally {
        spinners.classList.add('d-none');
        CartBTN.disabled = false;
    }
}

document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

   
