

const userElem = document.querySelector('.user');
const closeAccount = document.querySelector('.exit')
const booksElem = document.querySelector('.book-container');
const deleteBtn1 = document.querySelector('.deletebtn1');
const deleteBtn2 = document.querySelector('.deletebtn2');
const cancelBtn = document.querySelector('.canceldel');
const searchElem = document.querySelector('.search')
const searchInput = document.querySelector('.search input')
const searchBtn = document.querySelector('.search button')




userElem.addEventListener('click', ()=>{
    document.querySelector('.account').classList.add('reveal')
    document.querySelector('.account-details').classList.add('reveal')
})

closeAccount.addEventListener('click', ()=>{
    document.querySelector('.account').classList.remove('reveal')
    document.querySelector('.account-details').classList.remove('reveal')
    // document.querySelector('.confirm-window').classList.remove('reveal')
})

booksElem.addEventListener('click', ()=>{
    document.querySelector('.account').classList.remove('reveal')
    document.querySelector('.account-details').classList.remove('reveal')
    // document.querySelector('.confirm-window').classList.remove('reveal')
})

searchInput.addEventListener('focus', ()=>{
    searchElem.classList.add('active')
    searchBtn.classList.add('active')
})

searchInput.addEventListener('blur', ()=>{
    searchElem.classList.remove('active')
    searchBtn.classList.remove('active')
})

searchBtn.addEventListener('click', ()=>{
    if(searchInput.value == null || searchInput.value == null ){
       console.log('no search value')
    }else{
        searchInput.focus()
        const searchValue = searchInput.value
        const data = {
            value: searchValue
        }
        console.log(searchValue)
        const customHeaders = {'Content-Type': "application/json"}
        fetch('/search', {
            method: 'POST',
            headers: customHeaders,
            body: JSON.stringify(data)
        }).then(()=>{
            console.log('searching')
            location.href = '/results'
        })        
    }
})

const categories = ['All', 'Motivational', 'Real-Life', 'Children', 'Academics', 'Romance', 'Sci-fi', 'Adventure', 'Action', 'Other']
const categoryList = document.querySelector('.catergories ul')
const allBooks = document.querySelectorAll('.book')
document.addEventListener('DOMContentLoaded', ()=>{
    allBooks.forEach(book => {
        book.style.display = 'flex'
    })
})
categories.forEach(element => {
    const listItem = document.createElement('li')
    categoryList.appendChild(listItem)
    listItem.innerHTML = element;
    listItem.dataset.categories = element;
    listItem.classList.remove('active')
    if(listItem.dataset.categories == 'All'){
        listItem.classList.add('active')
    }
    listItem.addEventListener('click', ()=>{
        document.querySelectorAll('.catergories ul li').forEach(list =>{
            list.classList.remove('active')
        })
        listItem.classList.add('active')
        if(listItem.dataset.categories == 'All'){
            console.log('true')
            allBooks.forEach(book => {
                book.style.display = 'flex'
            });

        }else{
            console.log('false')
            allBooks.forEach(book => {
                if(book.dataset.category.includes(listItem.dataset.categories)){
                    book.style.display = 'flex'
                }else{
                    book.style.display = 'none'
                }
            });
        }
    })
});
