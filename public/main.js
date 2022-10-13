const messages = document.querySelector('.messages')
console.log(messages.innerHTML)

setTimeout(() => {
    messages.innerHTML = ''
}, 2500)