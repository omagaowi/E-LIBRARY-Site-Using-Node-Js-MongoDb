const selectsElem = document.querySelector('.selects');
const bkInput = document.querySelector('#bookInput')
document.querySelector('.picInput').addEventListener('change', e=>{
    const file = e.target.files[0];				
    console.log(file)
    if(file.type == 'image/jpeg' || file.type == 'image/png'){
        console.log('correct'); 
        let fileReader = new FileReader();
        fileReader.onload = ()=>{
        let fileURL = fileReader.result;
        console.log(fileURL)
        document.querySelector('.book-cover').src = fileURL;
        document.querySelector('.picArea .fa-image').style.display = 'none'
        // showFile(fileURL)
    }
    fileReader.readAsDataURL(file)	
    }else{
        console.log('incorrect')
        alert('File must be an Image')
        document.querySelector('.picArea .fa-image').style.display = 'flex'
    }
})
let options = ['Motivational', 'Real-Life', 'Children', 'Academics', 'Romance', 'Sci-fi', 'Adventure', 'Action',]
document.querySelector('.addBtn').addEventListener('click', ()=>{
    const selectElem = document.createElement('select');
    const primaryElem =  document.createElement('div')
    primaryElem.classList.add('primaryElem')
    selectsElem.appendChild(primaryElem)

    primaryElem.appendChild(selectElem)
    selectElem.classList.add('select')
    selectElem.setAttribute('name', 'categories')
    const deleteCategory = document.createElement('i');
    deleteCategory.classList.add('fas')
    deleteCategory.classList.add('fa-times')
    deleteCategory.setAttribute('title', 'Remove Category')
    // deleteCategory.innerHTML = 'x'
    primaryElem.appendChild(deleteCategory)
    options.forEach(option =>{
        const optionElem = document.createElement('option');
        selectElem.appendChild(optionElem)
        optionElem.value = option;
        optionElem.innerHTML = option;
    })
    deleteCategory.addEventListener('click', ()=>{
        selectsElem.removeChild(primaryElem)
    })
})

const bkTitle = document.querySelector('.title')
const bkAuthor = document.querySelector('.author')

bkTitle.addEventListener('blur', ()=>{
    const booktitle = bkTitle.value
    bkTitle.value = booktitle.toLowerCase()
    bkTitle.style.setProperty('text-transform', 'capitalize')
    console.log(bkTitle.value)
})

bkAuthor.addEventListener('blur', ()=>{
    const bookauthor = bkAuthor.value
    bkAuthor.value = bookauthor.toLowerCase()
    bkAuthor.style.setProperty('text-transform', 'capitalize')
})

bkInput.addEventListener('change', ()=>{
    if(bkInput.value == null || bkInput.value == ''){
        document.querySelector('.addFile').classList.remove('present')
    }else{
        document.querySelector('.addFile').classList.add('present')
    }
})