
//// io is a socket function to request for a socket connection to a server
const socket = io()

var data = {}
///// socket.on is a function which waits  for realtime event name message
socket.on('message', (msg) => {
  // the below code is used to  mnotify when a new policy added.
  let notificationList = document.querySelector('#drop-down')

  if (msg.type == 'policy') {
    let bell = document.querySelector('#bell')
    bell.classList.add('addRedColor')
    let mainDiv = document.createElement('a')
    mainDiv.classList.add('dropdown-item')
    mainDiv.href = '/policy'
    markup = ` <span>New policy added</span>`
    mainDiv.innerHTML = markup
    notificationList.appendChild(mainDiv)
  }
})