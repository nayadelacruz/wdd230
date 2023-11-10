const x = document.getElementById('hamburgerBtn');

function toggleMenu() {
  document.getElementById("primaryNav").classList.toggle("open");
  document.getElementById("hamburgerBtn").classList.toggle("open");
  document.getElementById("logo").classList.toggle("open");
}

x.onclick = toggleMenu;

// DATE 
// select the elements to manipulate (output to)
const datefield = document.querySelector(".date");
// derive the current date using a date object
const now = new Date();
const fulldate = new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(
	now
);

datefield.innerHTML = `<em>${fulldate}</em>`;

/*----- Footer ---- */
const update = document.lastModified;

const lastUpdated=`Last Updated: ${update}`;

document.getElementById("update").innerHTML = lastUpdated;

/* banner */
let d = new Date().getDay();

const banner = document.getElementById("banner");
if (d === 1 || d === 2) {
  banner.style.display = "block";
}

const close = document.querySelector("#close");

close.addEventListener("click", () => {
  banner.style.display = "none";
});



