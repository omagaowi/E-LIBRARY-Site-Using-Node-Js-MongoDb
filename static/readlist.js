const deleteBtn = document.querySelectorAll('.deleteBtn')
// console.log(Array.from(deleteBtn))
deleteBtn.forEach(element =>{
    element.addEventListener('click', ()=>{
    // console.log(deleteBtn.dataset.doc)
    const endpoint = '/deletereaditem/' + element.dataset.doc;

    fetch(endpoint, {
        method: 'DELETE'
    }).then(()=>{
        console.log('deleted')
        location.reload()
    }).catch((err)=>{
        console.log(err)
    })
})
})
