const baseURL = "https://nayadelacruz.github.io/wdd230/";
const linksURL = "https://nayadelacruz.github.io/wdd230/data/links.json";
let ul = document.getElementById('activities');

async function getLinks() {
    const response = await fetch(linksURL);
    const data = await response.json();
    console.log(data);
    console.log(data.weeks);
    displayLinks(data.weeks);
  }

  function displayLinks(weeks){
    weeks.forEach((week) => {
        //Create elemets to add to the ul element
        let li = document.createElement('li');
        //fille the content of the li
        li.textContent = `${week["week"]}: `;
        //fill the content of the a element
        aElements = week["links"];
        aElements.forEach((element)=>{
            let a = document.createElement('a');
            a.textContent = ` ${element["title"]} |`;
            a.href = `${element["url"]}`;
            li.appendChild(a);
        });
        
        //Append the li and a elements tot the ul
        ul.appendChild(li);
    });

    //create elements to add the title activiy links
    
  }
  
  getLinks();