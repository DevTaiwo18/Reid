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

let one = document.getElementById('one')
one.addEventListener('click', function (event) {
    if (event.target.nodeName === "I") {
        change2(event)
    }
});

let two = document.getElementById('two')
two.addEventListener('click', function (event) {
    if (event.target.nodeName === "I") {
        change(event)
    }
});

function change2(event) {
    event.preventDefault()
    let passwordField2 = document.getElementById('LoginPassword');
    let eyeIcon2 = document.querySelector('#show1');

    if (passwordField2.type === 'password') {
        passwordField2.type = 'text';
        eyeIcon2.classList.remove('fa-eye');
        eyeIcon2.classList.add('fa-eye-slash');
    } else {
        passwordField2.type = 'password';
        eyeIcon2.classList.remove('fa-eye-slash');
        eyeIcon2.classList.add('fa-eye');
    }
}

function change(event) {
    event.preventDefault()
    let passwordField = document.getElementById('RegPassword');
    let eyeIcon = document.querySelector('#show2');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }

}

let messageDiv = document.querySelector('.div-message');
let message = document.getElementById('message')


function checkEmail(email) {
    let regex = /^[A-Za-z0-9_]+[@]{1}[A-Za-z0-9_]+[\.]{1}[A-Za-z0-9_]+$/;
    return regex.test(email);
}

function checkPassword(password) {
    let regex = /^(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;
    return regex.test(password);
}

const signUpForm = document.getElementById('registrationForm');
const spinnerSignUp = document.getElementById('spinnerSignUp');
const signUpBTN = document.getElementById('signUpBTN');
const formparent = document.querySelector('.form-parent')
const myaccount = document.querySelector('.my-account')

signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = signUpForm.email.value.trim();
    const password = signUpForm.password.value.trim();

    if (!checkEmail(email)) {
        messageDiv.style.display = 'block';
        message.innerHTML = 'Please enter a valid email';
        return;
    } else if (!checkPassword(password)) {
        messageDiv.style.display = 'block';
        message.innerHTML = 'Please enter a strong password';
        return;
    }

    spinnerSignUp.classList.remove('d-none');
    signUpBTN.disabled = true;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        formparent.style.display = ('none')
        myaccount.style.display = ('block')
    } catch (error) {
        console.error('Error during registration:', error.message);
        if (error.code === 'auth/email-already-in-use') {
            messageDiv.style.display = 'block';
            message.innerHTML = 'The account has already been used.';
        } else {
            messageDiv.style.display = 'block';
            message.innerHTML = 'Registration failed. Please try again.';
        }
    } finally {
        spinnerSignUp.classList.add('d-none');
        signUpBTN.disabled = false;
    }
});


const loginForm = document.getElementById('loginForm')
const signInBTN = document.getElementById('signInBTN');
const spinnerSignIn = document.getElementById('spinnerSignIn');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = loginForm.LoginEmail.value.trim();
    const password = loginForm.LoginPassword.value.trim();

    if (!checkEmail(email)) {
        messageDiv.style.display = 'block';
        message.innerHTML = 'Please enter a valid email';
        return;
    }
    else if (!checkPassword(password)) {
        messageDiv.style.display = 'block';
        message.innerHTML = 'Please enter a Strong Passowrd';
        return;
    }

    spinnerSignIn.classList.remove('d-none');
    signInBTN.disabled = true;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        formparent.style.display = ('none')
        myaccount.style.display = ('block')
        console.log('User logged in:', userCredential.user);
    } catch (error) {
        console.error('Error during login:', error.message);
        if (error.message === `Firebase: Error (auth/invalid-credential).`) {
            messageDiv.style.display = 'block';
            message.innerHTML = `*Invalid Email or Password`   
        }
    }
    finally {
        spinnerSignIn.classList.add('d-none');
        signInBTN.disabled = false;
    }
});


let cancel2 = document.querySelector('.cancel-message')
cancel2.addEventListener('click', function (event) {
    event.preventDefault()
    let messageDiv = document.querySelector('.div-message');
    messageDiv.style.display = 'none';
})


window.addEventListener('DOMContentLoaded', () => {
    const formparent = document.querySelector('.form-parent');
    const myaccount = document.querySelector('.my-account');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            formparent.style.display = 'none';
            myaccount.style.display = 'block';
        } else {
            formparent.style.display = 'block';
            myaccount.style.display = 'none';
        }
    });
});

let dashboardmessage = document.querySelector('.dashboard-message')
let orderMessages = document.querySelector('.order-messages')
let addressMessage = document.querySelector('.adress-messages')

document.addEventListener('DOMContentLoaded', function() {
    const dashboardBtn = document.getElementById('dashboardBtn');
    dashboardBtn.style.backgroundColor = 'rgb(255, 106, 40)';
    dashboardmessage.style.display = 'block'

});

const dashboardBtn = document.getElementById('dashboardBtn');
const orderBtn = document.getElementById('ordersBtn')
const addressBtn = document.getElementById('AddressBtn');

dashboardBtn.addEventListener('click', function (event) {
    event.preventDefault()
    dashboardBtn.style.backgroundColor = 'rgb(255, 106, 40)';
    orderBtn.style.backgroundColor = 'rgb(36, 36, 36)'
    addressBtn.style.backgroundColor = 'rgb(36, 36, 36)'
    orderMessages.style.display = 'none'
    addressMessage.style.display = 'none'
    dashboardmessage.style.display = 'block'
})

orderBtn.addEventListener('click', function (event) {
    event.preventDefault()
    orderBtn.style.backgroundColor = 'rgb(255, 106, 40)';
    dashboardBtn.style.backgroundColor = 'rgb(36, 36, 36)'
    addressBtn.style.backgroundColor = 'rgb(36, 36, 36)'
    dashboardmessage.style.display = 'none'
    addressMessage.style.display = 'none'
    orderMessages.style.display = 'block'
})

addressBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    addressBtn.style.backgroundColor = 'rgb(255, 106, 40)';
    dashboardBtn.style.backgroundColor = 'rgb(36, 36, 36)';
    orderBtn.style.backgroundColor = 'rgb(36, 36, 36)';
    dashboardmessage.style.display = 'none';
    orderMessages.style.display = 'none';
    addressMessage.style.display = 'block';

    const user = auth.currentUser;

    if (user) {
        const userId = user.uid;
        const addressDocRef = doc(db, 'addresses', userId);

        try {
            const addressSnapshot = await getDoc(addressDocRef);
            if (addressSnapshot.exists()) {
                const addressData = addressSnapshot.data();
                console.log(addressData);
                
                const streetAddressElement = document.getElementById('streetaddress');
                const townCityElement = document.getElementById('towncity');
                const stateElement = document.getElementById('state');
                const numberElement = document.getElementById('number');
                const emailElement = document.getElementById('email');

                streetAddressElement.textContent = `Street Address: ${addressData.streetAddress}`;
                townCityElement.textContent = `Town/City: ${addressData.townCity}`;
                stateElement.textContent = `State: ${addressData.country}`;
                numberElement.textContent = `Number: ${addressData.phone}`;
                emailElement.textContent = `Email: ${user.email}`;

            } else {
                console.log("The document for the user's address does not exist.");
            }
        } catch (error) {
            console.error('Error fetching user address:', error);
        }
    } else {
        console.log('No user signed in.');
    }
});

const signOutBTN = document.getElementById('signOutBTN')
signOutBTN.addEventListener('click', async ()=>{
    signOut(auth).then(()=>{
        formparent.style.display = 'block';
        myaccount.style.display = 'none';
        window.location.reload()
    })
    .catch((error)=>{
        console.log(error);
    })
})

document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});



