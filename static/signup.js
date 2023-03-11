
const emailValid = document.querySelector('.signupEmail');
const passwordValid = document.querySelector('.signupPassword');
const emailVal = document.querySelector('.signupEmail').value;
const passwordVal = document.querySelector('.signupPassword').value;
const newForm = document.querySelector('.newForm')
const emails = document.querySelectorAll('.emails p')





document.querySelector('.signupBtn').addEventListener('click', () =>{
    // const usersArray = document.querySelector('.newform').dataset.users;
    // console.log(usersArray)
    // const userB4 = usersArray.includes(emailValid.value)
    let usersArray = []
    emails.forEach(element => {
        // console.log(element.dataset.users)
        usersArray.push(element.dataset.users)
    })
    console.log(usersArray)
    let emailB4
    if(usersArray.includes(emailValid.value)){
        emailB4 = true
    }else{
        emailB4 = false
    }
    console.log(emailB4)
    

    if(emailValid.checkValidity()){
        document.querySelector('.alert').style.display = 'none'
    }else{
        document.querySelector('.alert').style.display = 'flex'
        document.querySelector('.alert strong').innerHTML = 'Enter a valid Email'
    }

    if(passwordValid.checkValidity()){
        document.querySelector('.alert').style.display = 'none'
    }else{
          document.querySelector('.alert').style.display = 'flex'
        document.querySelector('.alert strong').innerHTML = 'Password must be up to 8 characters'
    }

    if(emailB4 == true){
        document.querySelector('.alert').style.display = 'flex'
        document.querySelector('.alert strong').innerHTML = 'Email Already Exists'
    }else{
        document.querySelector('.alert').style.display = 'none'
    }

    

    if(emailValid.value != '' && passwordValid.value != '' && emailValid.checkValidity() &&  passwordValid.checkValidity() && emailB4 !=true){
        // console.log('valid')
        document.querySelector('.second-login-bg').classList.add('show');
        document.querySelector('.welcome-banner span').innerHTML = emailValid.value;
        document.querySelector('.second-login-window').classList.add('show');
    }else{
        document.querySelector('.newform').classList.add('invalid');
        setTimeout(() => {
            document.querySelector('.newform').classList.remove('invalid');
        }, 300)
    }

})

document.querySelector('.closeBtn').addEventListener('click', ()=>{
        document.querySelector('.second-login-bg').classList.remove('show');
        document.querySelector('.second-login-window').classList.remove('show');
        document.querySelector('.firstn').value = null;
        document.querySelector('.lastn').value = null;
        // document.querySelector('.usern').value = null;
})

document.querySelector('.finishBtn').addEventListener('click', ()=>{
    const firstName = document.querySelector('.firstn').value;
    const lastNAme = document.querySelector('.lastn').value
    if(firstName == '' || firstName == null || lastNAme == '' || lastNAme == null ){
      console.log('error')
      document.querySelector('.second-login-window').classList.add('invalid');
        setTimeout(() => {
            document.querySelector('.second-login-window').classList.remove('invalid');
        }, 300)
    }else{
        const url = '/register';
        const data = {
            name: lastNAme + ' ' + firstName,
            email: emailValid.value,
            password: passwordValid.value
        }
        const customHeaders = {'Content-Type': "application/json"}

        fetch(url, {
            method: 'POST',
            headers: customHeaders,
            body: JSON.stringify(data)
        }).then(()=>{
            console.log('request sent')
            location.href = '/login'
        })
    }
})

