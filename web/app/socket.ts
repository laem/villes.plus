import { io } from 'socket.io-client'
import APIUrl from '@/app/APIUrl'

const socket = io(APIUrl.replace('http', 'ws'))
socket.connect()
console.log('le client a tenté de se connecter au socket')
socket.emit('message-socket-initial')

export default socket
