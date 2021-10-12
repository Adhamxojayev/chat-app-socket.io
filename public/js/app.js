const client = io()
const inputElement = document.querySelector('.message')
const logoutButton = document.querySelector('#logout')
const ulElement = document.querySelector('ul')


inputElement.onkeyup = e => {
    if(e.keyCode === 13){
        let answer = []
        let data = document.cookie
        let userId = data.split('=')[1]
        answer.push(userId,e.target.value)
        client.emit('new_message', answer)
        e.target.value = null
    } 
} 

client.on('init', data => {
    let messages = JSON.parse(data)
    for(let message of messages){
        let li = document.createElement('li')
        li.textContent = message.name + ':' + message.message
        ulElement.append(li)
    }
})

client.on('receive_message', data => {
    let li = document.createElement('li')
    li.textContent = data[0].name + ':' + data[0].message
    ulElement.append(li)
})

