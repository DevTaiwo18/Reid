// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, updateDoc,getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth,} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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
const colRef = collection(db, 'Carts')

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

const proceedToPaymentBtn = document.getElementById('proceedtopayment');
const spinner = document.getElementById('spinner');
let messageDiv = document.querySelector('.div-message');
let message = document.getElementById('message')

function validateInputs() {
    const inputs = document.querySelectorAll('#checkout-form input[required], #checkout-form select[required]');
    for (const input of inputs) {
        if (!input.value.trim()) {
            return false;
        }
    }
    return true;
}

let cancel2 = document.querySelector('.cancel-message')
cancel2.addEventListener('click', function (event) {
    event.preventDefault()
    let messageDiv = document.querySelector('.div-message');
    messageDiv.style.display = 'none';
})

proceedToPaymentBtn.addEventListener('click', async function () {
    if (spinner.classList.contains('d-none') && validateInputs()) {
        spinner.classList.remove('d-none');
        spinner.classList.remove('d-none');

        const firstName = document.getElementById('firstname').value;
        const lastName = document.getElementById('lastname').value;
        const companyName = document.getElementById('company').value;
        const country = document.getElementById('country').value;
        const streetAddress = document.getElementById('streetaddress').value;
        const townCity = document.getElementById('towncity').value;
        const stateCounty = document.getElementById('statecounty').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
    
        const addressData = {
            firstName,
            lastName,
            country,
            streetAddress,
            townCity,
            stateCounty,
            phone,
            email
        };
    
        if (companyName.trim() !== '') {
            addressData.companyName = companyName;
        }
    
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const addressRef = doc(db, 'addresses', userId);
    
                const docSnapshot = await getDoc(addressRef);
                if (docSnapshot.exists()) {
                    await updateDoc(addressRef, addressData);
                } else {
                    await setDoc(addressRef, addressData);
                }
                window.location.href = './payment.html'
            } else {
                console.error('User is not authenticated');
                window.location.href = './logreg.html';
            }
        } catch (error) {
            console.error('Error storing address data:', error);
        }
        finally{
            spinner.classList.add('d-none');
        }
    } else {
        messageDiv.style.display = 'block';
        message.innerHTML = 'Please fill in all required fields';
    }
});

auth.onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        console.log('Current User ID:', userId);

        try {
            const addressRef = doc(db, 'addresses', userId);
            getDoc(addressRef).then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const addressData = docSnapshot.data();
                    console.log('Address Data:', addressData);
                    document.getElementById('firstname').value = addressData.firstName || '';
                    document.getElementById('lastname').value = addressData.lastName || '';
                    document.getElementById('company').value = addressData.companyName || '';
                    document.getElementById('country').value = addressData.country || '';
                    document.getElementById('streetaddress').value = addressData.streetAddress || '';
                    document.getElementById('towncity').value = addressData.townCity || '';
                    document.getElementById('statecounty').value = addressData.stateCounty || '';
                    document.getElementById('phone').value = addressData.phone || '';
                    document.getElementById('email').value = addressData.email || '';
                } else {
                    console.log('User address data not found.');
                }
            }).catch((error) => {
                console.error('Error fetching user address:', error);
            });
        } catch (error) {
            console.error('Error fetching user address:', error);
        }
    } else {
        console.log('No user is currently signed in.');
    }
});

document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
