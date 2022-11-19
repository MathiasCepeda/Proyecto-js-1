const productosDom = document.querySelector(".productos-center");
const carritoDom = document.querySelector(".carrito");
const carritocenter = document.querySelector(".carrito-center");
const openCarrito = document.querySelector(".carrito-icon");
const closeCarrito = document.querySelector(".close-carrito");
const overlay = document.querySelector(".carrito-overlay");
const carritoTotal = document.querySelector(".carrito-total");
const clearCarritoBTN = document.querySelector(".clear-carrito");
const ItemTotales = document.querySelector(".item-total");
const detalles = document.getElementById('detalles');

let carrito = [];
let BottonDOM = [];

class Productos {
 async getProductos() {
    try {
        const result = await fetch("http://localhost:3001/items");
        const data = await result.json();
        return data;
    } catch(err){
      console.log(err)
    }
  }
}




class UI {

    detalleProducto(id) {
        const filtrodato = productos.filter(item => item.id == id) 
        let result = "";
        filtrodato.forEach(producto => {
            result += `
            <article class="detalle-grid">
            <img src="${producto.relojimagen}" alt="${producto.tittle}" class="img-fluid">
            <div class="detalle-content">
                <h3>${producto.tittle}</h3>
                <div class="rating">
                    <div class="rating">
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                        <span>⭐</span>
                    </div>
                    <p class="price"><b>precio: </b> $${producto.price} </p> 
                    <p class="description">
                        <b>Descripcion: </b> <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
                          Laboriosam iure magni odio vitae quod recusandae rerum molestias voluptates 
                          temporibus libero, voluptas voluptatem nostrum accusantium. Tempore eligendi molestiae
                          odit placeat iure.</span>
                    </p> 
                    <p class="description">
                        <span>
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis hic atque 
                            accusantium. Officia, magnam ab vitae odio 
                            provident inventore quia, et libero architecto 
                            recusandae molestiae! Libero dolorem nesciunt placeat quo.
                        </span>
                    </p>
                    <div class="bottom">
                        <div class="btn-group">
                            <button class="btn addtocart" data-id=${producto.id}>añadir carrito</button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
         `
        });
        detalles.innerHTML = result;
    }

    renderproductos(productos) {
        let result = "";
        productos.forEach((producto) => {
            result += `<div class="producto">
            <div class="image-container">
            <img src="${producto.relojimagen}" alt="${producto.tittle}">
            </div>
            <div class="producto-footer">
              <h1>${producto.tittle}</h1>
              <div class="rating">
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
                <span>⭐</span>
              </div>
              <div class="price">
                $${producto.price}
              </div>
            </div>
            <div class="botton">
                <div class="btn-group">
                  <button class="btn addtocart" data-id=${producto.id}>Añadir carrito</button>
                  <a href="productos-detalles.html? id=${producto.id}" class="btn view">Vista</a>
                </div>
            </div>
            
        </div>`
        });
        productosDom.innerHTML = result;
    }


    
    getbuttons() {
        const buttons = [...document.querySelectorAll(".addtocart")];
        BottonDOM = buttons;
        buttons.forEach(button => {
            const id = button.dataset.id;
            const inCart = carrito.find(item => item.id === parseInt(id,10));
           
            if(inCart) { 
              button.innerHTML = "En el carrito"
              button.disabled = true;
            }
            button.addEventListener("click", e => {
                e.preventDefault();
                e.target.innerHTML = "En el carrito"
                e.target.disabled = true;
                
                //obtener productos al carrito
                const carritoItem = {...Storage.getProductos(id), cantidad: 1}

                //agregamos el producto al carrito 

                carrito = [...carrito, carritoItem]

                //guardamos el carrito al localstorage

                Storage.saveCart(carrito)

                //set cart values
                this.setItemValues(carrito)
                this.addCarritoItem(carritoItem)
                
                //show carrito

            })
        })
    }

    setItemValues(carrito) {
       let TempTotal = 0;
       let itemTotal = 0;
       carrito.map(item => {
        TempTotal += item.price * item.cantidad;
        itemTotal += itemTotal.cantidad;
       });
       carritoTotal.innerText = parseFloat(TempTotal.toFixed(2));
       ItemTotales.innerText = itemTotal

    }

    addCarritoItem ({relojimagen, price, tittle, id}){
       const div = document.createElement("div") 
       div.classList.add("carrito-item")

       div.innerHTML = `<img src= ${relojimagen} alt= ${tittle}>
       <div>
           <h3>${tittle}</h3>
           <p class="price">$${price}</p>
       </div>
       <div>
           <span class = "increase" data-id=${id}>
               <i class="fa-solid fa-sort-up"></i>
           </span>
           <p class = "item-cantidad">1</p>
           <span class = "decrease" data-id=${id}>
               <i class="fa-solid fa-sort-down"></i>
           </span>
       </div>
       <div>
           <span class="remove-item" data-id=${id}>
               <i class="fa-sharp fa-solid fa-trash"></i>
           </span>
       </div>`

       carritocenter.appendChild(div) 
    }
    show(){
        carritoDom.classList.add("show")
        overlay.classList.add("show")
    }
    hide(){
        carritoDom.classList.remove("show")
        overlay.classList.remove("show")
    }

    setAPP(){
        carrito = Storage.getCart()
        this.setItemValues(carrito)
        this.populate(carrito)

        openCarrito.addEventListener("click", this.show)

        closeCarrito.addEventListener("click", this.hide)
    }

    populate(carrito) {
        carrito.forEach(item => this.addCarritoItem(item))
    }
    cartlogic() {
        clearCarritoBTN.addEventListener("click", () => {
            this.clearCarrito()
            this.hide()
        });
        carritocenter.addEventListener("click", e => {
            const target = e.target.closest("span")
            const targetElement = target.classList.contains("remove-item");

            if(!target) return
            if(targetElement) {
                const id = parseInt(target.dataset.id);
                this.removeItem(id)
                carritocenter.removeChild(target.parentElement.parentElement)
            } else if(target.classlist.contains("increase")) {
                const id = parseInt(target.dataset.id, 10);
                let tempItem = carrito.find(item => item.id === id);
                tempItem.cantidad++;
                Storage.saveCart(carrito)
                this.setItemValues(carrito)
                target.nextElementSibling.innerText = tempItem.cantidad
            } else if (target.classList.contains("decrease")){
                const id = parseInt(target.dataset.id, 10);
                let tempItem = carrito.find(item => item.id === id);
                tempItem.cantidad--;

                if(tempItem.cantidad > 0) {
                    Storage.saveCart(carrito)
                    this.setItemValues(carrito)
                    target.previousElementSibling.innerHTML = tempItem.catidad;
                }else {
                    this.removeItem(id);
                    carritocenter.removeChild(target.parentElement.parentElement)
                }
            }
        });
    }

    clearCarrito() {
        const cartItems = carrito.map(item => item.id) 
        cartItems.forEach(id => this.removeItem(id))

        while(carritocenter.children.length > 0) {
            carritocenter.removeItem(carritocenter.children[0])
        }
    }
    removeItem(id) {
        carrito = carrito.filter(item => item.id !== id);
        this.setItemValues(carrito)
        Storage.saveCart(carrito)

        let button = this.singleButton(id);
        if(button) {
            button.disabled = false,
            button.innerHTML = "añadir carrito"
        }

        
    }

    singleButton(id){
        return BottonDOM.find(button => parseInt(button.dataset.id) === id)
    }
}

class Storage {
    static saveProduct(Obj){
        localStorage.setItem("productos", JSON.stringify(Obj))
    }
    static saveCart(carrito) {
        localStorage.setItem("carrito", JSON.stringify(carrito))
    }

    static getProductos(id) {
        const producto = JSON.parse(localStorage.getItem("productos"))
        return producto.find(product => product.id === parseFloat(id,10))
    }

    static getCart(){
        return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : [];
    }
}

let category = "";
let productos = [];

function categoryvalue(){
    const ui = new UI();

    category = document.getElementById("category").value
    if(category.length > 0) {
        const producto = productos.filter(regx => regx.category === category)
        ui.renderproductos(producto)
    }else {
        ui.renderproductos(productos);
    }

}

const query = new URLSearchParams(window.location.search)
let id = query.get('id')


document.addEventListener("DOMContentLoaded" , async () => {
    const productoslista = new Productos();
    const ui = new UI();

    ui.setAPP()

    productos = await productoslista.getProductos();

    if(id){
        ui.detalleProducto(id);
        Storage.saveProduct(productos);
        ui.getbuttons();
        ui.cartlogic();
    }else {
        
        ui.renderproductos(productos);
        Storage.saveProduct(productos);
        ui.getbuttons();
        ui.cartlogic();
    }

    
    
})