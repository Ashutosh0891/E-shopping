const deleteProduct=(btn)=>{
    const prodId=btn.parentNode.querySelector('[name=productId]').value; //parent node is div class in products.ejs that includes button
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement=btn.closest('article') //to remove entire card instantly using the article element check inspect/element n browser 

    fetch('/admin/product/' + prodId,{
        method:'DELETE',
        headers:{
            'csrf-token':csrf
        }
    })
    .then(result=>{
        console.log(result.json)
       return result.json()
       
    })
    .then(data=>{

        productElement.parentNode.removeChild(productElement)
        console.log(data)
    })
    .catch(err=>{
        console.log(err)
    })
}