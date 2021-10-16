const client = io()
const inputElement = document.querySelector('.message')
const logoutButton = document.querySelector('#logout')
const ulElement = document.querySelector('ul')


inputElement.onkeyup = e => {
    if(e.target.value.length > 0){
        if(e.keyCode === 13){
            let answer = []
            let data = document.cookie
            let userId = data.split('=')[1]
            answer.push(userId,e.target.value)
            client.emit('new_message', answer)
            e.target.value = null
        } 
    }
} 

client.on('init', data => {
    let messages = JSON.parse(data)
    for(let message of messages){
        let li = document.createElement('li')
        let username = document.createElement('span')
        let span = document.createElement('span')
        username.textContent ='name:  ' + message.name
        username.style.color = 'green'
        username.style.fontFamily = 'sans-serif'
        username.style.fontSize = '17px'
        li.textContent =  message.message
        span.textContent = message.date
        span.style.fontSize = '12px'
        span.style.color = 'orange'
        li.append(span)
        ulElement.append(username,li)
    }
})

client.on('receive_message', data => {
    let li = document.createElement('li')
    let span = document.createElement('span')
    let username = document.createElement('span')
    username.textContent ='name:  ' + data[0].name
    username.style.color = 'green'
    username.style.fontFamily = 'sans-serif'
    username.style.fontSize = '17px'
    li.textContent = data[0].message
    span.textContent = data[0].date
    span.style.fontSize = '12px'
    span.style.color = 'orange'
    li.append(span)
    ulElement.append(username,li)
})


client.on('online_user', data => {
    data = JSON.parse(data)
    let li = document.createElement('li')
    let span = document.createElement('span')
    span.textContent = ' online'
    li.textContent = data[0].onlineuser
    li.setAttribute('class', 'item-user')
    li.append(span)
    online.append(li)
    userName.textContent = data[0].onlineuser
})