"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Location from "../objects/Location";
//import Messages from "./messages/page";

interface GameProps {
  room: string;
  gameBoard: Location[];
  // gridSize: number;
  // numGuesses: number;
}

const initialCards: Location[] = [];
// initialize gameCards
for (let i = 0; i < 20; i++) {
  const card = new Location(
    `Location ${i + 1}`,
    `Description ${i + 1}`,
    `../images${i + 1}.jpg`,
    "Default",
  );
  initialCards.push(card);
}

const Game: React.FC<GameProps> = ({ room, gameBoard }) => {
  const [numGuessesLeft, setNumGuessesLeft] = useState<number>(1); // num. guesses a player can make
  // const [gridSize, setGridSize] = useState<number>(16);

  //const [locations, setLocations] = useState<Location[]>(gameCards); // re-render gameCards
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(true);
  const [isFlaggingMode, setIsFlaggingMode] = useState<boolean>(true); // flagging mode is true on default
  const [playerHasSelected, setPlayerHasSelected] = useState<boolean>(false);
  const [playerIsReady, setPlayerIsReady] = useState<boolean>(false);
  const [hiddenCard, setHiddenCard] = useState<Location | null>(null);
  const [guessedCard, setGuessedCard] = useState<Location | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // pop up screen is not open (false) on default
  const [playerWon, setPlayerWon] = useState<boolean>(false);
  const [showGameResult, setShowGameResult] = useState<boolean>(false);
  const [continueModal, setContinueModal] = useState<boolean>(false); // ugly modal to notify player to keep playing while numguesses > 0

  useEffect(() => {
    socket.on("finishedUpdatingGuesses", (data) => {
      setNumGuessesLeft(data.numGuesses);
    });

    socket.on("launchGame", () => {
      setIsSelectionMode(false);
      setIsModalOpen(false);
    });

    socket.on("waitingForOtherReady", () => {
      //alert("Waiting for other player to ready up to start.");
    });

    socket.on("victory", () => {
      setPlayerWon(true);
      setShowGameResult(true);
    });

    socket.on("defeat", () => {
      setShowGameResult(true);
    });

    socket.on("incorrectGuess", () => {
      setNumGuessesLeft((prevNumGuessesLeft) => {
        const newNumGuessesLeft = prevNumGuessesLeft - 1;

        if (newNumGuessesLeft !== 0) {
          //alert("You guessed wrong! Try again");
          setContinueModal(true);
        } else {
          //alert("You guessed wrong and ran out of guesses");
          socket.emit("ranOutOfGuesses", room);
        }

        return newNumGuessesLeft;
      });
    });

    return () => {
      // socket.off("launchGame");
      // socket.off("waitingForOtherReady");
      socket.off("victory");
      socket.off("defeat");
      socket.off("incorrectGuess");
    };
  }, [room]);

  const select_HC = (index: number) => {
    // if new card clicked is the same as current hidden card, do nothing
    if (hiddenCard && gameBoard[index] === hiddenCard) {
      return;
    } else {
      // for loop of updated location array
      const updatedCards = gameBoard.map((card, i) => {
        // if location at i is selected location, make it selected
        if (i === index) {
          card.isSelected_HC = true; //{ ...location, isSelected_HC: true };
        }
        // else (even previously selected cards) deselect it
        else {
          card.isSelected_HC = false; //{ ...location, isSelected_HC: false };
        }

        return card;
      });

      gameBoard = updatedCards;
      setHiddenCard(updatedCards[index]);
      setPlayerHasSelected(true); // checker for modal

      socket.emit("setHiddenCard", { room, hiddenCard: gameBoard[index] });
    }
  };

  const toggleFlag = (index: number) => {
    gameBoard[index].toggleFlag(); // calls .toggleFlag() from location class
  };

  const handleClickOnReady = () => {
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
        setGuessedCard(gameBoard[index]);
        setIsModalOpen(true);
      }
    }
  };

  const finalizeGuess = () => {
    if (guessedCard && guessedCard.name) {
      setIsModalOpen(false); // close pop up after finalizing guess
      socket.emit("finalizedGuess", {
        room,
        guessedCardName: guessedCard.name,
      });
    } else {
      console.log(
        "ERRROR: guessedCard is undefined or does not have a name property.",
      );
    }
  };

  const cancelGuess = () => {
    setIsModalOpen(false); // close pop up to cancel guess
    setGuessedCard(null); // de-selects card
  };

  const closeContinueModal = () => {
    setContinueModal(false);
  };

  // bug at continue modal, decrements all the way to -1

  const ResultScreen = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {playerWon ? (
          <div>
            <h1>VICTORY</h1>
            {/*<p>You guessed right! Woohoo!</p>*/}
          </div>
        ) : (
          <div>
            <h1>DEFEAT</h1>
            {/* <p>The other player guessed your card! Better luck next time!</p> */}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {!showGameResult ? (
        <div>
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
            {gameBoard.map((card, index) => (
              <button
                key={index}
                onClick={() => handleClickOnGrid(index)}
                style={{
                  padding: "20px",
                  backgroundColor: card.isSelected_HC
                    ? "#0000FF"
                    : card.isFlagged
                      ? "#ff0000"
                      : "#666e78",
                  border: "1px solid black",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {card.name}
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
                      <p>Waiting for other player to get ready...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1>{`Number of guesses left: ${numGuessesLeft}`}</h1>
              <div>
                <h2>Selected Card: {hiddenCard?.name}</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hiddenCard?.img} alt="filler alt text" />
                <h3>Card Description: {hiddenCard?.description}</h3>
              </div>
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
                        Are you sure you want to select: {guessedCard?.name} as
                        your guess?
                      </p>
                      <p>Guesses Left: {numGuessesLeft} </p>
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

              {continueModal && (
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
                  <h1>You guessed wrong</h1>
                  <p>Guesses Left: {numGuessesLeft} </p>

                  <button
                    onClick={closeContinueModal}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "lightcoral",
                      border: "1px solid black",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <ResultScreen />
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
