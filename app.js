const express= require('express');
const path=require('path')
const app=express()
const PORT=process.env.PORT||3000
let socketConnected=new Set()
const server=app.listen(PORT,()=>{
    console.log(`Server is running on port${PORT}`);
})
//initiaize socket.io
const io=require('socket.io')(server)

//Express.js that tells your server to serve all the static files located in a folder called public.
app.use(express.static(path.join(__dirname,'public')))

//listen on thee connection event io when socket is connected
io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id)
    socketConnected.add(socket.id)
    io.emit('clients-total',socketConnected.size)

    socket.on('disconnect',()=>{
        console.log('Socket disconnected',socket.id);
        socketConnected.delete(socket.id)
        io.emit('clients-total',socketConnected.size)
    })

    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message',data)
    })
    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })

}


