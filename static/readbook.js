const titleElem = document.querySelector('.title');
const authorElem = document.querySelector('.author')

const readlistBtn = document.querySelector('.readlistbtn')
const favouritesBtn = document.querySelector('.favouritebtn')
const favBtn = document.querySelector('.favourites')
const containerElem = document.querySelector('.container')
const bookcoverElem = document.querySelector('.book-cover img')

readlistBtn.addEventListener('click', ()=>{
    const readItem = {
        id: Date.now(),
        title: titleElem.value,
        author: authorElem.value,
        bookid: parseInt(titleElem.dataset.id),
        userid: parseInt(containerElem.dataset.userid),
    }
    // console.log(readItem)
    const customHeaders = {'Content-Type': "application/json"}

    fetch('/readlistadd', {
        method: 'POST',
        headers: customHeaders,
        body: JSON.stringify(readItem)
    }).then(()=>{
       
    })
    alert('Addded to Readlist')
})

favouritesBtn.addEventListener('click', ()=>{
    const favourite = {
        id: Date.now(),
        title: titleElem.value,
        author: authorElem.value,
        bookid: parseInt(titleElem.dataset.id),
        userid: parseInt(containerElem.dataset.userid),
    }
    // console.log(readItem)
    const customHeaders2 = {'Content-Type': "application/json"}

    fetch('/favouriteadd', {
        method: 'POST',
        headers: customHeaders2,
        body: JSON.stringify(favourite)
    }).then(()=>{
        // location.reload()
    })
    alert('Addded to Favourites')
})