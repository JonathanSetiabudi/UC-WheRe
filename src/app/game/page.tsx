"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Location from "../objects/Location";

interface GameProps {
  room: string;
}

const Game: React.FC<GameProps> = ({ room }) => {
  // initialize gameCards
  const gameCards: Location[] = Array.from({ length: 16 }, (_, i) => {
    return new Location(
      `Location ${i + 1}`,
      `Description ${i + 1}`,
      `image${i + 1}.jpg`,
      1,
      "Default",
    );
  });

  const [locations, setLocations] = useState<Location[]>(gameCards); // re-render gameCards
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(true);
  const [numGuesses, setNumGuesses] = useState<number>(1); // num. guesses a player can make
  const [isFlaggingMode, setIsFlaggingMode] = useState<boolean>(true); // flagging mode is true on default
  const [playerHasSelected, setPlayerHasSelected] = useState<boolean>(false);
  const [playerIsReady, setPlayerIsReady] = useState<boolean>(false);
  const [hiddenCard, setHiddenCard] = useState<Location | null>(null);
  const [guessedLocation, setguessedLocation] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // pop up screen is not open (false) on default

  const select_HC = (index: number) => {
    // if new card clicked is the same as current hidden card, do nothing
    if (hiddenCard && locations[index] === hiddenCard) {
      return;
    } else {
      // for loop of updated location array
      const updatedCards = locations.map((location, i) => {
        // const updatedLocation = new Location(
        //   location.name,
        //   location.description,
        //   location.img,
        //   location.difficulty,
        //   location.locationType
        // );

        // if location at i is selected location, make it selected
        if (i === index) {
          location.isSelected_HC = true; //{ ...location, isSelected_HC: true };
        }
        // else (even previously selected cards) deselect it
        else {
          location.isSelected_HC = false; //{ ...location, isSelected_HC: false };
        }

        return location;
      });

      setLocations(updatedCards);
      setHiddenCard(updatedCards[index]);
      setPlayerHasSelected(true);
    }
  };

  const toggleFlag = (index: number) => {
    const updatedCard = [...locations];
    updatedCard[index].toggleFlag(); // calls .toggleFlag() from location class
    setLocations(updatedCard);
  };

  // ADD CONDITION TO CHECK IF BOTH PLAYERS HAVE SELECTED A CARD
  const handleClickOnReady = () => {
    // if (hiddenCard !== null) {
    //   // setIsSelectionMode(false);
    //   setIsModalOpen(true);
    //   socket.emit("player is ready to launch the game")
    // }
    setIsModalOpen(true);
  };

  // player selects location
  // player presses ready button
  // calls playerIsReady()
  // if other player is also ready, calls launchGame

  const playerPressedReady = () => {
    setPlayerIsReady(true);
    socket.emit("tryLaunchGame", room);
    // launchGame();
  };

  const cancelReady = () => {
    setPlayerIsReady(false);
    setIsModalOpen(false);
    socket.emit("playerCancelledReady", room);
  };

  const handleClickOnGrid = (index: number) => {
    if (isSelectionMode) {
      select_HC(index);
      socket.emit("hiddenCardSelected");
    } else {
      // socket.emit("cardClickedOnGrid", isFlaggingMode);
      if (isFlaggingMode) {
        // if clicked in flagging mode, toggle the card's flag
        toggleFlag(index);
      } else {
        // if clicked in guessing mode, guess the card
        setguessedLocation(locations[index]);
        setIsModalOpen(true);
      }
    }
  };

  const finalizeGuess = () => {
    setIsModalOpen(false); // close pop up after finalizing guess
    setNumGuesses(numGuesses - 1);
    socket.emit("finalizedGuess", room);
  };

  const cancelGuess = () => {
    setIsModalOpen(false); // close pop up to cancel guess
    setguessedLocation(null); // de-selects card
  };

  useEffect(() => {
    socket.connect();

    socket.on("launchGame", () => {
      setIsSelectionMode(false);
    });

    socket.on("waitingForOtherReady", () => {
      //alert("Waiting for other player to ready up to start.");
    });
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {isSelectionMode && (
        <div>
          <h1>Select your card!</h1>
        </div>
      )}

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
              backgroundColor: location.isSelected_HC
                ? "#0000FF"
                : location.isFlagged
                  ? "#ff0000"
                  : "#666e78",
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

      {isSelectionMode ? (
        <div>
          <button
            onClick={handleClickOnReady}
            style={{
              marginBottom: "20px",
              padding: "10px 20px",
              backgroundColor: "#70cf73",
              border: "3px black",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            Ready
          </button>

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
              {playerHasSelected ? (
                <div>
                  <h3>Confirm Your Selection</h3>
                  <p>Are you sure you are ready?</p>
                  <p>The card you have selected is: {hiddenCard?.name}</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={cancelReady}
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
                      onClick={playerPressedReady}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "lightgreen",
                        border: "1px solid black",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Im Ready
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p>Please select a card</p>
                  <button
                    onClick={cancelReady}
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
                </div>
              )}

              {/* show waiting message when 1/2 player is ready */}
              {playerIsReady && (
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  <p>Waiting for other player to ready up...</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* display mode status */}
          {!isFlaggingMode ? (
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

          {/* pop-up (modal) to confirm */}
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
              <div>
                <h3>Confirm Your Selection</h3>
                <div>
                  <p>
                    Are you sure you want to select: {guessedLocation?.name} as
                    your guess?
                  </p>
                  <p>Guesses Left: {numGuesses} </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: "20px",
                    }}
                  >
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
              </div>
            </div>
          )}
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
