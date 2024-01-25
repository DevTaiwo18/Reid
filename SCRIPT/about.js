// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signOut} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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
const auth = getAuth()
//init firestore
const db = getFirestore(app)
//collection reference

// on load fuction 
window.addEventListener('load', async function () {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('loaded');
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
        await updateCartItemCount(); 

        loginLinks.forEach(link => link.style.display = 'none');
        logoutTexts.forEach(text => text.textContent = 'Logout'); 

    } else {
        console.log("No user signed in.");

        loginLinks.style.display = 'block';
        logoutTexts.textContent = '';
    }
});


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

window.addEventListener('load', updateCartItemCount);

document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});