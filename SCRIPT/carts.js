
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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
//Initialize Storage
const storage = getStorage(app)
//init firestore
const db = getFirestore(app)
//auth reference
const auth = getAuth();

// on load fuction 
window.addEventListener('load', async function () {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('loaded');
    });

    
});

auth.onAuthStateChanged(async (user) => {
    const loginLinks = document.querySelectorAll('.logregdiv');
    const logoutTexts = document.querySelectorAll('.logout');

    if (user) {

        const userId = user.uid; 
        console.log("Current user UID:", userId);
        userCartRef = collection(db, 'Carts', userId, 'cartItems');
        await updateCartItemCount(); 
        await checkUserAndLoadCart();

        loginLinks.forEach(link => link.style.display = 'none');
        logoutTexts.forEach(text => text.textContent = 'Logout'); 

    } else {
        console.log("No user signed in.");

        loginLinks.style.display = 'block';
        logoutTexts.textContent = '';
    }
});

let user = auth.currentUser;
let userCartRef;

async function checkUserAndLoadCart() {
    user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        userCartRef = collection(db, 'Carts', userId, 'cartItems');

        const isEmpty = await isCartEmpty();

        const cartMessage = document.querySelector('.Carts-message');
        const cartContent = document.querySelector('.cart-content');
        const carttotal = document.querySelector('.cart-total');

        if (isEmpty) {
            cartMessage.style.display = 'block';
            carttotal.style.display = 'none';
        } else {
            cartMessage.style.display = 'none';
            cartContent.style.display = 'block';
            carttotal.style.display = 'block';
            await displayCartItems();
        }
    } else {
        console.error('User is not authenticated.');
    }
}

async function isCartEmpty() {
    try {
        if (userCartRef) {
            const querySnapshot = await getDocs(userCartRef);
            const cartItems = querySnapshot.docs.map((doc) => doc.data());
            return cartItems.length === 0;
        } else {
            console.error('userCartRef is not defined.');
            return true;
        }
    } catch (error) {
        console.error('Error checking cart items:', error);
        return true;
    }
}

// Function to truncate title to three words
function truncateTitle(title) {
    if (typeof title !== 'string') {
        return 'No title available';
    }

    const words = title.split(' ');
    const truncatedTitle = words.slice(0, 2).join(' ');
    return truncatedTitle;
}

// Function to display cart items as a table
let id;

async function displayCartItems() {

    let subtotal = 0;

    try {
        const querySnapshot = await getDocs(userCartRef);

        const tableBody = document.querySelector('#tbody');
        tableBody.innerHTML = '';

        querySnapshot.forEach((item) => {

            id = item.id
            const actualData = item.data()

            // deliveryCost = 1000 * actualData.length

            const imageUrl = actualData.displayedImage || 'default_image_url.jpg';
            const title = actualData.displayTitle || 'No title available';
            const price = actualData.displayPrice || 0;
            const quantity = actualData.quantity || 0;
            const size = actualData.selectedSize

            const truncatedTitle = truncateTitle(title);

            const priceValue = parseFloat(price.replace('$', ''));

            const row = document.createElement('tr');

            const deleteCell = document.createElement('td');
            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('bi', 'bi-trash-fill');
            deleteIcon.dataset.itemId = item.id;
            deleteIcon.addEventListener('click', (e) => deleteCartItem(e));
            deleteCell.appendChild(deleteIcon);

            const imageCell = document.createElement('td');
            imageCell.innerHTML = `<img src="${imageUrl}" alt="${title}" width="50">`;

            const titleCell = document.createElement('td');
            titleCell.textContent = truncatedTitle;

            const sizeCell = document.createElement('td');
            sizeCell.textContent = `${size}`;

            const priceCell = document.createElement('td');
            priceCell.textContent = `${price}`;

            const quantityCell = document.createElement('td');
            const quantityContainer = document.createElement('div');
            quantityContainer.classList.add('quantity-container');

            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.classList.add('quantity-btn', 'decrease-btn');
            minusBtn.addEventListener('click', () => decreaseQuantity(item.id));

            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.classList.add('quantity-btn', 'increase-btn');
            plusBtn.addEventListener('click', () => increaseQuantity(item.id));

            const quantityDisplay = document.createElement('span');
            quantityDisplay.textContent = `${quantity}`;
            quantityDisplay.classList.add('quantity-display');

            quantityContainer.appendChild(minusBtn);
            quantityContainer.appendChild(quantityDisplay);
            quantityContainer.appendChild(plusBtn);
            quantityCell.appendChild(quantityContainer);

            const totalCell = document.createElement('td');
            const total = priceValue * quantity;
            subtotal += total;
            totalCell.textContent = `$${total.toFixed(2)}`;

            row.appendChild(deleteCell);
            row.appendChild(imageCell);
            row.appendChild(titleCell);
            row.appendChild(sizeCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(totalCell);

            tableBody.appendChild(row);

            const itemCount = querySnapshot.size;
            const deliveryCost = 15 * itemCount;

            const subtotalElement = document.getElementById('Subtotal');
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    
            const deliveryElement = document.getElementById('delivering');
            deliveryElement.textContent = `$${deliveryCost.toFixed(2)}`;
    
            const totalElement = document.getElementById('Total');
            const totalAmount = subtotal + deliveryCost;
            totalElement.textContent = `$${totalAmount.toFixed(2)}`;

        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

async function updateCartItemCount() {
    try {
        const authenticated = isAuthenticated();

        if (userCartRef && authenticated) {
            const querySnapshot = await getDocs(userCartRef);
            const cartItems = querySnapshot.docs.map((doc) => doc.data());
            const itemCount = cartItems.length;

            const cartNumParagraphs = document.querySelectorAll('.cart-num');
            cartNumParagraphs.forEach((cartNumParagraph) => {
                cartNumParagraph.textContent = `${itemCount} item(${itemCount !== 1 ? 's' : ''})`;
            });
        } else {
            console.error('User not authenticated:', !authenticated);
            console.error('UserCartRef status:', userCartRef);
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

let messageDiv = document.querySelector('.div-message');
let message = document.getElementById('message')

async function deleteCartItem(event) {
    console.log(itemId);
    const itemId = event.currentTarget.dataset.itemId;
    try {
        const docRef = doc(userCartRef, itemId);
        await deleteDoc(docRef)
        await updateCartItemCount()
        await displayCartItems();
        messageDiv.style.display = 'block';
        message.innerHTML = 'Product deleted from the cart successfully';
        const isEmpty = await isCartEmpty();
        if (isEmpty) {
            const cartMessage = document.querySelector('.Carts-message');
            const cartContent = document.querySelector('.cart-content')
            const carttotal = document.querySelector('cart-total')
            cartMessage.style.display = 'block';
            cartContent.style.display = 'none'
            carttotal.style.display = 'none'
        }
        setTimeout(function () {
            if (messageDiv) {
                messageDiv.remove();
            }
        }, 3000);
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

window.addEventListener('load', updateCartItemCount);

document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

async function decreaseQuantity(itemId) {
    try {
        const itemDoc = doc(userCartRef, itemId);
        const itemSnapshot = await getDoc(itemDoc);
        const itemData = itemSnapshot.data();

        if (itemData.quantity > 1) {
            await updateDoc(itemDoc, {
                quantity: itemData.quantity - 1
            });

            messageDiv.style.display = 'block';
            message.innerHTML = 'Update cart successfully';

            await displayCartItems();
            
        }

    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

async function increaseQuantity(itemId) {
    try {
        const itemDoc = doc(userCartRef, itemId);
        const itemSnapshot = await getDoc(itemDoc);
        
        if (itemSnapshot.exists()) {
            const itemData = itemSnapshot.data();

            const currentQuantity = itemData.quantity || 0;undefined
            console.log(currentQuantity);

            await updateDoc(itemDoc, {
                quantity: Number(currentQuantity) + 1
            });

            messageDiv.style.display = 'block';
            message.innerHTML = 'Update cart successfully';

            await displayCartItems();

        } else {
            console.log('Document does not exist or there was an issue fetching data.');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

let cancel2 = document.querySelector('.cancel-message')
cancel2.addEventListener('click', function (event) {
    event.preventDefault()
    let messageDiv = document.querySelector('.div-message');
    messageDiv.style.display = 'none';
})

function isAuthenticated() {
    const user = auth.currentUser;
    return user !== null; 
}

let checkout = document.getElementById('checkout');
checkout.addEventListener('click', async function () {
    if (isAuthenticated()) {
        try {
            const user = auth.currentUser;
            const userId = user.uid;

            const totalAmount = document.getElementById('Total').textContent;

            const ordersRef = collection(db, 'orders');
            const userOrderRef = doc(ordersRef, userId);

            await setDoc(userOrderRef, {
                total: totalAmount,
            });

            window.location.href = "./checkout.html";
        } catch (error) {
            console.error('Error creating user order:', error);
        }
    } else {
        window.location.href = "./logreg.html";
    }
});

document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});



