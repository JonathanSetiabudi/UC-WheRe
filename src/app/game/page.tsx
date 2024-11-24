"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Location from "../objects/Location";


const Game = () => {
  // initialize gameCards
  const gameCards: Location[] = Array.from({ length: 16 }, (_, i) => {
    return new Location(
      `Location ${i + 1}`,
      `Description ${i + 1}`,
      `image${i + 1}.jpg`,
      1,
      "Default"
    );
  }); 

  // take gameCards from selectCard

  const [normHiddenCard, setNormHiddenCard] = useState<Location | null>(null); // host hidden card
  const [scottHiddenCard, setScottHiddenCard] = useState<Location | null>(null);  // guest hiddenCard
  const [locations, setLocations] = useState<Location[]>(gameCards); // re-render gameCards
  const [numGuesses, setNumGuesses] = useState<number>(1); // num. guesses a player can make
  const [isFlaggingMode, setIsFlaggingMode] = useState<boolean>(true); // flagging mode is true on default
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // pop up screen is not open (false) on default

  // make selection page
  // set norm and scot hidden card
  
  const toggleFlag = (index: number) => {
    const updatedCard = [...locations];
    updatedCard[index].toggleFlag(); // calls .toggleFlag() from location class
    setLocations(updatedCard);

    socket.emit("flagToggled", updatedCard[index].checkFlag());
  };

  const handleClickOnGrid = (index: number) => {
    socket.emit("cardClickedOnGrid", isFlaggingMode);
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
    socket.emit("finalizedGuess");
    setNumGuesses(numGuesses - 1);
    
    // useEffect() => {
    //   if (numGuesses == 0) {
    //     // game over
    //   }
    // }
  }

  const cancelGuess = () => {
    setIsModalOpen(false); // close pop up to cancel guess
    setSelectedLocation(null); // de-selects card
    socket.emit("cancelledGuess");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* board display */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          width: "fit-content",
        }}
      >
        {/* render each card as a button */}
        {locations.map((location, index) => (
          <button
            key={index}
            onClick={() => handleClickOnGrid(index)}
            style={{
              padding: "20px",
              backgroundColor: location.isFlagged ? "#ff0000" : "#666e78",
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

      {/* display mode status */}
      { !isFlaggingMode ? (
        <h1>Currently in Guessing Mode</h1>
      ) : (
        <h1>Currently in Flagging Mode</h1>
      )}

      {/* toggle button between modes*/}
      <button
        onClick={() => setIsFlaggingMode(!isFlaggingMode)}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: isFlaggingMode ? "#bf4240" : "#008080",
          border: "1px solid black",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Switch to {isFlaggingMode ? "Guessing" : "Flagging"} Mode
      </button>

      {/* pop-up (modal) to confirm guess */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#32426d",
            padding: "20px",
            border: "2px solid black",
            borderRadius: "10px",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h3>Confirm Your Selection</h3>
          <p>Are you sure you want to select: {selectedLocation?.name}?</p>
          <p>Guesses Left: {numGuesses} </p>
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

      {/* pop-up overlay */}
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