# UC WheRe ?

Authors:

- [Jonathan Setiabudi](https://github.com/JonathanSetiabudi)
- [Anita Hakim](https://github.com/anitathakim)
- [Adithya Chander](https://github.com/adidi-c)
- [Charleen Chen](https://github.com/charleenschen)

<!-- ## Project Description
 > Your project description should summarize the project you are proposing. Be sure to include:
 > * Why is it important or interesting to you?
 > * What languages/tools/technologies do you plan to use? (This list may change over the course of the project)
 > * What will be the input/output of your project?
 > * What are the features that the project provides? -->

## Project Description

Our project adds a twist to the popular game "Guess Who?" (By Hasbro) as instead of guessing people, users will be guessing UCR Locations. We want to challenge ourselves by creating a web app that not only pushes us to learn new technologies but also serve a social purpose that can enhance our school spirit. Upon completion of this project, we hope to create a fun social tool for orientation leaders and new students to teach/learn what's on campus while bonding via playing a game together.
<br/>

### Technologies/Tools of Project

- React Query (frontend)
- TailwindCSS (frontend)
- Next.js (backend)
- Typescript (backend)
- Prettier (VSCode extension)
- ESLint (VSCode extension)
- Socket.io (server communication)
- Cypress (frontend testing)
- Mocha (backend testing)
- Chai (backend testing) 

### Input/Output of Project

- Input
  - Keyboard
    - Lobby code
    - Chatbox messages
  - Mouse
    - Used in Flagging Mode + Guessing Mode
    - Used to interact with buttons (and navigation)
- Output
  - Messaging system
    - Player inputted messages will be displayed on the chatbox
  - Flagging Mode + Guessing Mode
    - Interact with the cards on the grid (we can flag a card, unflag a card, or guess a card)
  - Game result screen
    - Display Victory/Defeat screens for winner and other player respectively

### Game Terminologies

- Host: Player who starts and manages a lobby
- Guest: Player who joins a host's lobby
- Cards: Objects of focus for the game. Each card displays unique locations scattered around campus.
- Hidden Card: Players will each have one "hidden card" that the other player has to guess. They will pick their hidden card in the beginning of each game. The game revolves around the players trying to guess each other's cards and whoever guesses right first wins (if a player guesses wrong, the other player automatically wins).
- Board: The visual board that displays the cards (number of cards limited to grid size and cards displayed will align with the board difficulty) via a grid (modifiable).
- Flagging Mode: During the game, when the player clicks on a card with the left mouse button, that card will be flagged and unflagged (similar to minesweeper). The player can toggle between Flagging Mode and Guessing Mode, but the former is the default
- Guessing Mode: When this mode is toggled on, if a player clicks on a card with the left mouse button, that player is instead making their final guess with that card.

### Project/Game Features

- Lobby
  - Host Game: User can create a game lobby using a distinct four-letter code that can be shared to other users for them to join
  - Join Game: User can join a game lobby by inputting a four-letter code shared by a host
  - Host can customize the board in the lobby
- Board Customization

  - Host can modify the board after lobby has been made through board customizations
  - Depending on the board customizations set by the Host, the board that the players will play on will be shaped by said customizations (ex. board difficulty, grid size)
  - The guest can see the board customizations being modified by the host in the lobby in real time
  - Grid Size: Host can choose between setting the following grid size settings (bigger grid size = more locations to guess from)
    - 4x4
    - 5x5
  - Board Difficulty / Themes: Host can pick difficulty for the game
    - Easy (recognizable buildings)
    - Medium (less recognizable buildings)
    - Hard (very specific locations on campus)
    - Residential and Dining
    - Campus Landmarks
    - Study Spots
    - Bike Racks
    - Streets and Parking Lots
  - Guess Count: Host can decide the number of guesses (between 1 to 3) each player can make during the game.

- Gameplay (Game Screen)
  - "Hidden Card" Selection: Before a game starts, both players will be given a preview of the board (and the cards generated on it) and they will have to pick a card that the other player has to guess. This will become each player's Hidden Card. Each player's Hidden Card will be displayed on the top right of each of their screens throughout the game. Both players will need to pick a card and select a "Ready" button before the actual game starts
  - Messaging: During the game, the players have access to a chatbox to to ask each other questions about the other's hidden card. This is the only aid that they will have to deduce the other player's Hidden Card
  - Flagging: Using a flagging system similar to Minesweeper, players can visualize their process of elimination by "flagging" cards that are unlikely to be the target location. These flagged cards can be unflagged. When players click on a card, that card will be flagged/unflagged.
  - Final Guess: If a player is confident enough to make their guess, they can turn on Guess Mode. This system is the same as the flagging system, only that if the player picks a card, they will be making their final guess with that card. When a player picks a card in Guess Mode, a pop up will appear asking the player if they are sure to proceed with their guess. On this pop up, the player can either cancel their guess or finalize their guess. The latter will affect the Guess Count which will eventually lead to the end of the game
  - Card Descriptions: In both the Card Selection screen and the Game screen, the player can hover over the different cards displayed on the board which will display a pop up in the corner of the screen displaying a description of the location in the card. This will help students become more familiar with the location

Some nice to have features:

- Card Gallery: In the main menu, the players can access a "Card Gallery" that will display all the available cards that can show up in the games along with their descriptions. The player can see these descriptions by hovering over the cards with their mouse

### How to play the game

- After a guest arrives in a host's lobby, the host can start the game
- When the game first starts, the two players will be brought to a selection screen that previews the board they will be playing on. All cards in the preview board will be displayed in the same position in the actual board. Each player must pick a card to be their Hidden Card -- the card that the other player has to guess. When both players are satisfied with their pick, they must both press the "Ready" button to start the actual game
- Once the actual game starts, players can now interact with the real grid with Flagging Mode or Guessing Mode (player can toggle between the two using a toggle button).
- Player Goal: Each player must guess the other's hidden card
  - If a player makes a correct guess, they win and the other will lose
  - If a player makes an incorrect guess and they still have guesses left, that player's guess count will be decremented but the game will keep going
  - If a player makes an incorrect guess and they are the first to run out of guesses, that player loses and the other will win

## User Interface Specification(Navigation Diagram & Screen Layouts)

<img width="838" alt="image" src="https://github.com/user-attachments/assets/3d244cf0-392e-48ea-b9b9-bc9d16f016bb">
</br>
This diagram illustrates the navigation between all screens for the users to experience. Main features are accompanied by explanations.
</br>
</br>
Figma: https://www.figma.com/design/VmG7uA7jlvptvLS0uReVXZ/cs100?node-id=0-1&t=XrUsxLECUcbLSxdd-1

## Class Diagram

### Before

![image](https://github.com/user-attachments/assets/476c8125-042e-49c9-9fbb-a6d82676a293)

### After

![image](https://github.com/user-attachments/assets/39ec36a1-9488-4700-8b16-68bdaad872ef)
</br>
</br>
The changes include removing the User class, creating a Home class, removing the Guess class, and placing the functions/responsibilities inside the game class. Our reasoning for removing the user class was that the User was an "up in the air" idea, and after careful consideration, we felt there was no need for it. Replacing its user class was the Home/Start Screen class. This was to follow the _Single Responsibility Principle_ better. This way, the lobby won't have two responsibilities: creating/joining a lobby and configuring the game settings for the lobby. We put the create/joining lobby responsibilities inside the Home class while leaving the remaining stuff inside the Lobby class. This will help us separate the code better as Lobby seemed saturated with too many responsibilities so spreading some of the code to the Home component helps with that. Another change we made was just to move the Guess class functionality to within the Game class. It seemed unnecessary to create such a small class for something that wouldn't violate the _Single Responsibility Principle_. This way we also would better follow _SOLID_ Principles as the two classes wouldn't have similar responsibilities.

## Final deliverable

>
> All group members will give a demo to the reader during lab time. You should schedule your demo on Calendly with the same reader who took your second scrum meeting. The reader will check the demo and the project GitHub repository and ask a few questions to all the team members.
> Before the demo, you should do the following:

> - Complete the sections below (i.e. Screenshots, Installation/Usage, Testing)
> - Plan one more sprint (that you will not necessarily complete before the end of the quarter). Your In-progress and In-testing columns should be empty (you are not doing more work currently) but your TODO column should have a full sprint plan in it as you have done before. This should include any known bugs (there should be some) or new features you would like to add. These should appear as issues/cards on your Project board.
> - Make sure your README file and Project board are up-to-date reflecting the current status of your project (e.g. any changes that you have made during the project such as changes to your class diagram). Previous versions should still be visible through your commit history.
> - Each team member should also submit the Individual Contributions Form on Canvas for this final phase. In this form, you need to fill in the names of all team members, the percentage of work contributed by each member for the final phase, and a description of their contributions. Remember that each team member should submit the form individually.

## Screenshots

> Screenshots of the input/output after running your application

## Installation/Usage

For the time being, these are the the instructions to play the game locally. Clone/fork this repo. Once you do, download Node.js. Afterwards, run "npm install" which will download dependencies. From there, run split terminals and have one run "npm run server" and "npm run dev" in one terminal per command. there should be a button under where you entered "npm run dev" labelled "https://localhost:3000" and from there you are able to use our game. In the near future, we'd like to make this game online for others to learn the campus through this game.

## Testing

> Screenshot of (Mocha and Chai) Testing output
> 
> ![image](https://github.com/user-attachments/assets/ae606819-17a4-4a61-8bbd-891683e1cc5c)


How was your project tested/validated?

Our project implemented Mocha and Chai, which are JavaScript testing frameworks in order to test the functionality of the backend components of our server. Mocha was used to structure and execute each test, while Chai's assertion output capabilities allowed us to check and validate the behavior of each function within the server.
