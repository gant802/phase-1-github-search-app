const body = document.querySelector('body')

//declaring variables for search output and listing results that are taken from the body variable above
const form = body.querySelector('#github-form')
const userListContainer = body.querySelector('#user-list')
const repoListContainer = body.querySelector('#repos-list')
const searchBox = body.querySelector('#search')

//add event listener to form that calls a function to retrieve user data that fetches from an api
form.addEventListener('submit', e => retrieveUserData(e))

function retrieveUserData(e) {
    e.preventDefault() 
    const userInput = e.target.search.value
    searchBox.value = ""

    fetch('https://api.github.com/search/users?q=octocat')
  .then(response => response.json())
  .then(data => searchForUser(data))
  .catch(error => console.error('Error:', error));

  //function that searches for specific user from user input in the form
  //iterates through the data retrieved from the api to find specific user
  //displays user login name, avatar, link to their github and a note to tell the user to click
  //the login name to see that user's repos
  function searchForUser(APIdata) {
    
    const foundUser = APIdata.items.find((user) => {
      return userInput.toLowerCase() === user.login.toLowerCase() 
    })
    if (!foundUser) {
        alert('Can\'t find user!')        
    }
    userListContainer.innerHTML = ''
    repoListContainer.innerHTML = ''
    const userCardDiv = document.createElement('div')
    userCardDiv.innerHTML = `
    <h2 id="h2-to-open-repos">${foundUser.login}</h2>
    <img src="${foundUser.avatar_url}"
    <p><a href="${foundUser.html_url}" target="_blank">-> See my github profile <-</a></p>
    <p>Note: Click my name to show my list of repos!</p>`
    userListContainer.appendChild(userCardDiv)

    const openRepoH2 = userCardDiv.querySelector('#h2-to-open-repos')
    
    //add event listener that will open the repos of the clicked username, calls fucntion fetchRepos to do this 
    openRepoH2.addEventListener('click', e => fetchRepos(e.target.textContent))
  }
  
}

//function that fetches the array of repos linked to the username you clicked
function fetchRepos(loginName) {
    
    fetch(`https://api.github.com/users/${loginName}/repos`)
    .then(response => response.json())
  .then(data => displayRepos(data))
  .catch(error => console.error('Error:', error));
}

//function displays all the repos of the username you clicked 
function displayRepos(data) {
    data.forEach(repo => {
        const p = document.createElement('p')
        p.textContent = repo.name 
        repoListContainer.appendChild(p)
    })
}




