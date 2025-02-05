let cart = []; //tudo isso nesse array, vai ser nosso carrinho
let modalQt = 1;
let modalKey = 0; //quando abrir o modal, vai mostrar a pizza

const c = (el)=> document.querySelector(el); // fizemos essa função para nao ter que ficar colocando toda hora document.queryselector, ai so precisa colocar "c" que ele faz a mesma coisa que o document.queryselector faria

const cs = (el)=>document.querySelectorAll(el); //array mostra os itens que ele encontrou 


//listagem das pizzas
pizzaJson.map((item, index)=>{

    let pizzaItem = c('.models .pizza-item').cloneNode(true) // estou clonando a div pizza-item que esta dentro da div models
  
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //isso é para ficar 2 numeros depois da virgula exemplo 16.99 e colocar o R$
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); //quando alguem clicar no link, ele nao vai ficar mais atualizando a tela e sim realizar alguma ação
        let key = e.target.closest('.pizza-item').getAttribute('data-key') //vai achar o elemento mais proximo que tenha pizza-item 
        modalQt = 1 //reseta quantidade
        modalKey = key;//vai falar qual a pizza

       c('.pizzaBig img ').src = pizzaJson[key].img;
       c('.pizzaInfo h1').innerHTML = pizzaJson[key].name; //esse pizzajson[key] serve para quando abrir o modal, vai aparecer o nome da pizza que eu cliquei
       c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
       c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
       c('.pizzaInfo--size.selected').classList.remove('selected'); //remover o selected da classe pizzainfosize
       cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
        if(sizeIndex ==2){
            size.classList.add('selected')
        }
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

       })

       c('.pizzaInfo--qt').innerHTML = modalQt; //O VALOR DO MODAL SEMPRE VAI COMEÇAR COM 1

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex'; //isso é para quando clicar na imagem, ele vai abrir a telinha de adicionar pizza e tlz, precisa colocar o flex, pois ele no css esta como none
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200)//vai esperar 1 quinto de um segundo e vai colocar a opacidade (Fazer uma transição bem de leve)
      
    })
   

   c('.pizza-area').append( pizzaItem) //aqui utiliza o append, pois o innerhtml ele iria pegar uma pizza e substituir por outra, e o appende pega uma pizza e adiciona outra inves de trocar uma pela outra

});

 //eventos do modal
 function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
 }
 cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal)
}); // isso é para o botao de voltar funcionar

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }//isso e para exlcuir as pizzas e ficar ate 1, para ele nao diminuir ate 0 ou -1, -2...
   
})
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
   });//isso é para mudar entre o tamanho das pizzas
   c('.pizzaInfo--addButton').addEventListener('click', ()=>{
   // nao vai ser necessario deixar isso,entao comentei so para saber como fazer console.log('pizza:'+modalKey) //Qual a pizza?
    
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));//Qual o tamanho da pizza?
    let identifier =  pizzaJson[modalKey].id+'@'+size; //Garante que tamanhos diferentes da mesma pizza sejam tratados como itens separados.
    let key = cart.findIndex(item => item.identifier === identifier);
    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
   
    updateCart();
    closeModal();

   // nao vai ser necessario deixar isso,entao comentei so para saber como fazer console.log('Quantidade:'+modalQt)//quantas pizzas vao ser selecionadas?
   })//carrinho de compras

c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0 ){
        c('aside').style.left ='0'
    } 
   
    })
    c('.menu-closer').addEventListener('click',()=>{
        c('aside').style.left = '100vw';
});

   function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaData = pizzaJson.find((item) => item.id == cart[i].id); // Renomeei para pizzaData para evitar conflito
            subtotal += pizzaData.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M'; // ← Corrigido
                    break;
                case 2:
                    pizzaSizeName = 'G'; // ← Corrigido
                    break;
            }
            let pizzaName = `${pizzaData.name} (${pizzaSizeName})`; // Usando pizzaData

            cartItem.querySelector('img').src = pizzaData.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt --;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            })
            c('.cart').append(cartItem);
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
