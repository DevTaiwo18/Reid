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

document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

let user = auth.currentUser;
let userCartRef;

auth.onAuthStateChanged(async (user) => {
    const loginLinks = document.querySelectorAll('.logregdiv');
    const logoutTexts = document.querySelectorAll('.logout');

    if (user) {

        const userId = user.uid; 
        console.log("Current user UID:", userId);
        userCartRef = collection(db, 'Carts', userId, 'cartItems');
        await updateCartItemCount(user); 
        await fetchAndDisplayTotalOrders(user);

        loginLinks.forEach(link => link.style.display = 'none');
        logoutTexts.forEach(text => text.textContent = 'Logout'); 

    } else {
        console.log("No user signed in.");

        loginLinks.style.display = 'block';
        logoutTexts.textContent = '';
    }
});

async function updateCartItemCount(user) {
    try {
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

async function fetchAndDisplayTotalOrders(user) {
    try {
        if (user) {
            const userId = user.uid;
            const ordersRef = collection(db, 'orders');
            const userOrderRef = doc(ordersRef, userId);

            const snapshot = await getDoc(userOrderRef);

            if (snapshot.exists()) {
                const orderData = snapshot.data();
                const totalAmount = parseFloat(orderData.total.replace('$', '')); 
                console.log(totalAmount);

                const totalAmountElement = document.querySelector('#show-total');
                totalAmountElement.textContent = `${orderData.total}`;

                const conversionRate = 958;
                const totalInNaira = totalAmount * conversionRate;
                const formattedNaira = totalInNaira.toLocaleString('en-US'); 

                const convertedAmountElement = document.querySelector('.converted-amount');
                convertedAmountElement.textContent = `₦${formattedNaira}.00`; 
            } else {
                console.error("Order document does not exist");
            }
        }
    } catch (error) {
        console.error('Error fetching user order:', error);
    }
}

const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener("submit", payWithPaystack, false);

function payWithPaystack(e) {
  e.preventDefault();

  let handler = PaystackPop.setup({
    key: 'pk_test_2a0d1a9a5c41fc955bd8d77e931370a0f0594fa0', 
    email: document.getElementById("email-address").value,
    amount: document.getElementById("amount").value * 100,
    ref: ''+Math.floor((Math.random() * 1000000000) + 1), 
    onClose: function(){
      console.log('Window closed.');
    },
    callback: function(response){
      let message = 'Payment complete! Reference: ' + response.reference;
      alert(message);
    }
  });

  handler.openIframe();
}









