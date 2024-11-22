"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Location from "../objects/Location.js";

const Game = () => {
  // initialize gameCards
  const gameCards: Location[] = Array.from({ length: 16 }, (_, i) => {
    return new Location(
      `Location ${i + 1}`,
      `Description ${i + 1}`,
      `image${i + 1}.jpg`,
      "Easy",
      "Default"
    );
  });

  const [locations, setLocations] = useState<Location[]>(gameCards); // re-render gameCards
  const [isFlaggingMode, setIsFlaggingMode] = useState<boolean>(true); // flagging mode is true on default
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // pop up screen is not open (false) on default
  
  const toggleFlag = (index: number) => {
    const updatedCard = [...locations];
    updatedCard[index].toggleFlag(); // calls .toggleFlag() from location class
    setLocations(updatedCard);
  };

  const handleCardClick = (index: number) => {
    if (isFlaggingMode) {
      // if clicked in flagging mode, toggle the card's flag
      toggleFlag(index);
    } else {
      // if clicked in guessing mode, select the card to guess
      setSelectedLocation(locations[index]);
      setIsModalOpen(true);
    }
  };

  const finalizeGuess = () => {
    setIsModalOpen(false); // close pop up after finalizing guess
    // guess--... other stuff
  }

  const cancelGuess = () => {
    setIsModalOpen(false); // close pop up to cancel guess
    setSelectedLocation(null); // de-selects card
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Interactive Location Grid</h1>

      {/* Toggle Button */}
      <button
        onClick={() => setIsFlaggingMode(!isFlaggingMode)}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: isFlaggingMode ? "lightblue" : "lightcoral",
          border: "1px solid black",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Switch to {isFlaggingMode ? "Guessing" : "Flagging"} Mode
      </button>

      {/* Grid Container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          width: "fit-content",
        }}
      >
        {/* Render each location as a button */}
        {locations.map((location, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            style={{
              padding: "20px",
              backgroundColor: location.isFlagged ? "lightgreen" : "lightgray",
              border: "1px solid black",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            {location.name}
          </button>
        ))}
      </div>

      {/* Pop-up (modal) to confirm guess */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "2px solid black",
            borderRadius: "10px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h3>Confirm Your Selection</h3>
          <p>Are you sure you want to select: {selectedLocation?.name}?</p>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
            <button
              onClick={cancelGuess}
              style={{
                padding: "10px 20px",
                backgroundColor: "lightcoral",
                border: "1px solid black",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={finalizeGuess}
              style={{
                padding: "10px 20px",
                backgroundColor: "lightgreen",
                border: "1px solid black",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}
    </div>
  );
};

export default Game;