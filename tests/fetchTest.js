const axios = require("axios");

async function fetchGameDetails(appId) {
  try {
    const response = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=en`
    );

    // Check if the response is successful
    if (response.status === 200) {
      const gameData = response.data[appId];

      // Check if the game data is available
      if (gameData.success) {
        const {
          name,
          steam_appid: id,
          short_description: description,
          header_image: headerImage,
          screenshots,
          price_overview: price,
          movies,
          developers,
          publishers,
          release_date: releaseDate,
        } = gameData.data;

        // Process the extracted fields as needed
        // console.log("Name:", name);
        // console.log("ID:", id);
        // console.log("Description:", description);
        // console.log("Header Image:", headerImage);
        // console.log("Screenshots:", screenshots);
        // console.log("Price:", price);
        // console.log("Movies:", movies);
        // console.log("Developers:", developers);
        // console.log("Publishers:", publishers);
        // console.log("Release Date:", releaseDate);
      } else {
        console.error("Error retrieving game data:", gameData);
      }
    } else {
      console.error("Error fetching game details:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching game:", error);
  }
}

// Call the function with the desired AppID
fetchGameDetails(265930); // Example using Dota 2 (AppID: 570)
