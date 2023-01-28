const sname = document.getElementById("name");
const submitbtn = document.getElementById("submitbtn");
const container = document.querySelector(".superherolist");
const showfav = document.getElementById("showfav");

let fav = localStorage.getItem("fav") || [];

function loadError(){
    const div = document.createElement("div")
    div.classList.add("error")
    div.innerHTML = `Please Enter Correct Name!`
    container.appendChild(div)
}

async function fetchSuperhero(sname){
    let superheroName = sname.value;

    try {
        const response = await fetch(`https://www.superheroapi.com/api.php/1628132770683309/search/${superheroName}`)
        const data = await response.json();
        container.innerHTML = "";
        if(data.response != "error") renderSuperhero(data.results);
        else loadError();
    } catch (error) {
        console.log(error)
    }
}

function addToFav(hero,btn){
    
    fav = JSON.parse(localStorage.getItem("fav")) || [];

    fav.push(hero);
    localStorage.setItem("fav",JSON.stringify(fav));

    btn.textContent = "Added"
    btn.style.background = "green" 
}

function renderSuperhero(list){
    showfav.classList.remove("disable")
    let i = 0;
    list.forEach((item)=>{

        const div = document.createElement("div");
        div.id = item.id;
        div.classList.add("superhero-item")
        div.innerHTML = `<h2>${item.name}</h2>
        <img src="${item.image.url}">
        <button class="favbtn${i}" id="${item.id}">Add to Favourites</button>
        `
        container.appendChild(div);

        const favbtn = document.querySelector(`.favbtn${i}`);
                
        favbtn.addEventListener("click", (e) => {addToFav(item,e.target)});
        i++;
    })

    
    sname.value = "";
}

function removeFav(id){
    fav = JSON.parse(localStorage.getItem("fav"));
    fav = fav.filter((item)=>
        item.id !== id
    )
    localStorage.setItem("fav",JSON.stringify(fav));
    showFavs(fav);
}

function showFavs(list){
    showfav.classList.add("disable")
    container.innerHTML = "";

    if(list.length == 0){
        const div = document.createElement("div")
        div.classList.add("error")
        div.innerHTML = `No Favourites Added!`
        container.appendChild(div)
        return;
    }
    let set = new Set();
    
    let i = 0;
    list.forEach((item)=>{
        if(!set.has(item.id)){
            const div = document.createElement("div");
            div.id = item.id;
            div.classList.add("superhero-item")
            div.innerHTML = `<h2>${item.name}</h2>
            <img src="${item.image.url}">
            <button class="favbtn${i}" id="${item.id}" >Remove</button>
            `
            container.appendChild(div);

            const favbtn = document.querySelector(`.favbtn${i}`);
                    
            favbtn.addEventListener("click", () => {removeFav(item.id)});
            set.add(item.id);
            i++;
        }
    });
}

submitbtn.addEventListener("click", (e)=> {fetchSuperhero(sname)})
showfav.addEventListener("click", (e)=> {showFavs(JSON.parse(localStorage.getItem("fav")))})