       const descriptionElem = document.querySelector('.description')
        const editSelect = document.querySelectorAll('.select')
        const singleSelect = document.querySelector('.single')
        const selectDiv =  document.querySelector('.selectElem')
        const editForm = document.querySelector('form')
        const uploadBtn = document.querySelector('.uploadBtn')
        const bookCoverElem = document.querySelector('#picInput')
        const bookInputElem = document.querySelector('#bookInput')
        const titleInputElem = document.querySelector('.title')
        const authorInputElem = document.querySelector('.author')
        const selectsEleme = document.querySelector('.selects');
        let descriptionVal

        descriptionVal = descriptionElem.dataset.doc;
        // console.log(descriptionVal)
        descriptionElem.value = descriptionVal

        editSelect.forEach(element => {
            element.value = element.dataset.doc
        })

        // singleSelect.value = singleSelect.dataset.doc;

        editSelect.forEach(element => {
            element.value = element.dataset.doc
        })



        
        descriptionVal = descriptionElem.dataset.doc;
        // console.log(descriptionVal)
        descriptionElem.value = descriptionVal
        const selectLength = editSelect.length
        // console.log(selectLength)
        let elemArray = [0]
        for(let i = 1; i < selectLength; i++){
            // console.log(editSelect[i])
            elemArray.push(editSelect[i])
        }
        elemArray = elemArray.filter((el)=>{
            return el != 0
        })
        console.log(elemArray)
        elemArray.forEach(element => {
            const deleteCategory = document.createElement('i');
            deleteCategory.classList.add('fas')
            deleteCategory.classList.add('fa-times')
            deleteCategory.setAttribute('title', 'Remove Category')
            const parent = element.parentNode;
            // console.log(parent)
            parent.appendChild(deleteCategory)
            deleteCategory.addEventListener('click', ()=>{
                selectsEleme.removeChild(parent)
            })
        })
        




const deleteButton = document.querySelector('.deleteBtn');
deleteButton.addEventListener('click', ()=>{
    const endpoint = '/deletebook/' + deleteButton.dataset.doc

    fetch(endpoint, {
        method: 'DELETE'
    }).then(()=>{
        location.href = '/admin'
    })
})