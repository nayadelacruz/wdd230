

// Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
var currentDay = new Date().getDay();
  // Check if today is Wednesday (day index 3)
  if (currentDay === 1 || currentDay === 2 || currentDay === 3 ) {
    // Display the banner
    document.querySelector('.banner').style.display = 'flex';
  } else {
    document.querySelector('.banner').style.display = 'none';
  }

  document.getElementById('closeBanner').addEventListener('click',closeBanner);

  function closeBanner(){
    document.getElementById('banner').style.display = 'none';
  }
