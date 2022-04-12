const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

let messages = []
const productos = []

app.use(express.urlencoded({ extended: true }))
app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    let productos = [
        {nombre: 'Escuadra', precio: 20, foto: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Squadra_45.jpg/640px-Squadra_45.jpg"}, 
        {nombre: 'Regla', precio: 10, foto: "https://image.shutterstock.com/image-vector/school-measuring-plastic-ruler-20-260nw-615662024.jpg"}, 
        {nombre: 'Compás', precio: 20, foto: "https://thumbs.dreamstime.com/b/comp%C3%A1s-de-dibujo-aislado-rojo-132996590.jpg"}
    ]
    res.render('productos', { productos })
})

app.post('/productos', (req, res) => {
    productos.push(req.body)
    console.log(productos)
    res.redirect('/')
})

app.use(express.static('public'))

io.on('connection', function(socket){
    console.log('Un cliente se ha conectado')
    /* Emitir todos los mensajes a un cliente nuevo */
    socket.emit('messages', messages)

    socket.on('new-message', function(data){
        /* Agregar mensajes a array */
        messages.push(data)

        /* Emitir a todos los clientes */ 
        io.sockets.emit('messages', messages)
    })
})

const PORT = process.env.PORT || 8080

const srv = server.listen(PORT, () => {
    console.log(`Servidor Http con WebSockets escuchando en el puerto ${srv.address().port}`)
})
srv.on('error', error => console.log(`Error en el servidor ${error}`))