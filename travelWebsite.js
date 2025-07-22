// Fetch JSON data once and store globally
let travelData = null;

fetch('travel_recommendation_api.json')
  .then(res => res.json())
  .then(data => {
    travelData = data;
  })
  .catch(err => console.error('Failed to load JSON:', err));

// Helper function to normalize user input (lowercase, singular form)
function normalizeKeyword(input) {
  input = input.toLowerCase().trim();
  // Simple plural normalization: remove trailing 's' if present
  if (input.endsWith('s')) {
    input = input.slice(0, -1);
  }
  return input;
}

// Function to display recommendations
function displayResults(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // Clear previous results

  if (!items || items.length === 0) {
    container.innerHTML = '<p>No recommendations found.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('recommendation-card');
    card.innerHTML = `
      <h3>${item.name}</h3>
      <img src="${item.imageUrl}" alt="${item.name}" style="max-width: 300px; height: auto;" />
      <p>${item.description}</p>
    `;
    container.appendChild(card);
  });
}

// Event handler for search button click
document.getElementById('searchBtn').addEventListener('click', () => {
  if (!travelData) {
    alert('Data not loaded yet. Please try again shortly.');
    return;
  }

  const input = document.getElementById('searchInput').value;
  const keyword = normalizeKeyword(input);

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (keyword === 'beach') {
    // Display at least two beaches
    displayResults(travelData.beaches.slice(0, 2), 'results');
  } else if (keyword === 'temple') {
    // Display at least two temples
    displayResults(travelData.temples.slice(0, 2), 'results');
  } else {
    // For country, find matching country by name (case insensitive)
    const matchedCountry = travelData.countries.find(country =>
      country.name.toLowerCase() === input.toLowerCase()
    );

    if (matchedCountry) {
      // Show its cities as recommendations (at least two)
      displayResults(matchedCountry.cities.slice(0, 2), 'results');
    } else {
      resultsDiv.innerHTML = '<p>No results found for your search.</p>';
    }
  }
});

// Clear button logic
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('results').innerHTML = '';
  document.getElementById('searchInput').value = '';
});
