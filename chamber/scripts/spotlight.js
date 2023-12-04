let spotlight = document.getElementById('businessSpotlight');
const baseURL = "https://nayadelacruz.github.io/wdd230/";
const linksURL = "https://nayadelacruz.github.io/wdd230/chamber/data/members.json";

async function getMembers() {
    //It is called response, because the first thing that a API sends is a responds
    const response = await fetch(linksURL);
    //Then it send a promise and we have to wait for the promise to be complited
    const data = await response.json();
    console.log(data.members);
    newObject(data.members);
  }
function newObject(members){
    let membersObject= [];
    members.forEach((member) => {
        let membership = member.membership;
        if (membership == 'silver' || membership == 'gold'){
            membersObject.push(member)
        }
        
    });
    console.log(membersObject);
    randomMembers(membersObject);

} 

function randomMembers(members){
    // Get a random index from the array
    
    let randomIndex1 = Math.floor(Math.random() * members.length);
    let member1= members[randomIndex1];
    members = members.filter(function(value) {
        return value !== member1;
    });
    let randomIndex2 = Math.floor(Math.random() * members.length);
    let member2= members[randomIndex2];
    let membersSpotlight = [member1, member2];
    console.log(membersSpotlight)
    displayMembers(membersSpotlight);
}

function displayMembers(membersList){
    membersList.forEach((member)=>{
        //create elements
        let div=document.createElement('div');
        div.classList.add("division");
        let img = document.createElement('img');
        img.src = member.image;
        img.width = 250;
        img.height = 150;
        let website = document.createElement('a');
        website.textContent=member.url;
        website.href=member.url;
        let phone = document.createElement('p');
        phone.textContent = member.phone;
        //append childs
        div.appendChild(img);
        div.appendChild(website);
        div.appendChild(phone);
        spotlight.appendChild(div);



    })

}

getMembers();