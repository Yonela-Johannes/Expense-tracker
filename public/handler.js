const getCode = document.querySelector('.get-code')
const email = document.querySelector('email')
const sideContainer = document.querySelector('.side-container')
console.log('insied')
const handler = () => {
    if (email.value.length > 3) {
        sideContainer.classList.add('animate__animated animate__slideInRight')
    }
}


getCode.addEventListener('click', handler)