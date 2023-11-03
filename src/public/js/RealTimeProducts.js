const socket = io()

const productForm = document.getElementById('form')
const title = document.getElementById('title')
const description = document.getElementById('description')
const price = document.getElementById('price')
const thumbnail = document.getElementById('thumbnailInput')
const stock = document.getElementById('stock')
const code = document.getElementById('code')
const products = document.getElementById('productList')
const deleteButton = document.querySelectorAll('#btnDelete')



productForm.addEventListener('submit', async e =>{
    try{
        e.preventDefault()
        const data = new FormData(form)
    
        console.log({data})
        
        await fetch('/api/products', {
            method: 'POST',
            body: data
        }).then(result => result.json())
        .then(product => {title.value = ''
        description.value = ''
        price.value = ''
        thumbnail.value = null
        stock.value = ''
        code.value = ''} )
    } catch (error) {
        console.log(error)
    }
 
})

const deleteProduct = async (id) => {
    try{

        console.log(id)

        await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        }).then(res => res.json()).then(json => console.log(json))


    } catch (error) {
        console.log(error)
    }
}

const createHtml = (data) =>{

    if(data){
        return data.length ? 
        data.map(newProduct => {
            products.innerHTML += `
            <div id="productList" class="row row-cols-1 row-cols-md-3 g-4">
                <div id="productoItem" class="card">
                    <img src="${newProduct.thumbnail}" class="card-img-top" alt="${newProduct.title}">
                    <div class="card-body">
                        <span><h2 style="font-size: 30px; margin-top: -5px;">${newProduct.title}</h2></span>
                        <span><p style="margin-top: -5px;">${newProduct.price}</p></span> 
                        <button id="btnDelete" onclick="deleteProduct(${newProduct.id})" class="btn btn-dark" style="margin-top: -10px;">Eliminar</button>      
                    </div>             
                </div>
            </div>
            `
        })
        
        :products.innerHTML += `
        <div id="productList" class="row row-cols-1 row-cols-md-3 g-4">
            <div id="productoItem" class="card">
                <img src="${data.thumbnail}" class="card-img-top" alt="${data.title}">
                <div class="card-body">
                    <span><h2 style="font-size: 30px; margin-top: -5px;">${data.title}</h2></span>
                    <span><p style="margin-top: -5px;">${data.price}</p></span> 
                    <button id="btnDelete" onclick="deleteProduct(${data.id})" class="btn btn-dark" style="margin-top: -10px;">Eliminar</button>                   
                </div>
            </div>
        </div>
        `
    } else if (data == null)
    {
        return '<h2> NO HAY PRODUCTOS </h2>'
    }
    

    
}

socket.on('newProduct', (data) => {
    products.innerHTML = ""
    createHtml(data)
})

socket.on('deleteProduct', (data) => {
    products.innerHTML = ""
    createHtml(data)
})