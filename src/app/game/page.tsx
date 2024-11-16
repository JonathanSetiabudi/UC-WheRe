"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Location from "../objects/Location.js";

// export default function Game() {
//   socket.connect();


// }

interface GameProps {
  locations: Location[];
}

const Game = ({ locations } : GameProps) => {
  const [cardsList, setCardsList] = useState<Location[]>(locations.slice(0, 16));
  const [cardsTheme, setCardsTheme] = useState<string>("CampusLandmarks");

  const setSize4x4 = () => {
    if (cardsList.length != 16) {
      setCardsList(locations.slice(0, 16));
    }
  };
  
  const setSize4x5 = () => {
    if (cardsList.length != 20 ) {
      const addLocations = locations.slice(cardsList.length, 20);
      setCardsList([...cardsList, ...addLocations]);
    }
  };

  // check
  const filterTheme = (theme: string) => {
    setCardsTheme(theme);
    const filteredLocations = locations.filter(location => location.locationType === theme);
  }

  return (
    <div>

    {/* Gridsize buttons */}
    <button onClick={setSize4x4}>Set Size to 16 (4x4)</button>
    <button onClick={setSize4x5}>Expand to 20 (4x5)</button>

    {/* Location theme dropdown menu */}
    <select onChange={(e) => filterTheme(e.target.value)} value={cardsTheme}>
      <option value="CampusLandmarks">Campus Landmarks</option>
      <option value="Residential&Dining">Residential & Dining</option>
      <option value="StudySpots">Study Spots</option>
      <option value="BikeRacks">Bike Racks</option>
      <option value="Streets&ParkingLots">Streets and Parking Lots</option>

    </select>
  </div>
  )
};