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
- Husky (pre-push hooks & maintenance)

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
## Screenshots

![image](https://github.com/user-attachments/assets/1349d796-4e22-42a4-952b-bbb0705d0978)
![image](https://github.com/user-attachments/assets/acf5c1b3-9add-450d-b5a8-972dd987e56d)

This is our home screen with username and lobby inputs.
</br>
![image](https://github.com/user-attachments/assets/ffa491d9-3edd-48a8-9c96-657073388537)
</br>
This is the host side of the lobby screen.
</br>
![image](https://github.com/user-attachments/assets/668206b8-b2b0-4537-8889-625757c94acd)
</br>
This is the guest side of the lobby screen. The buttons are disabled for the guest.
</br>
![image](https://github.com/user-attachments/assets/d3fb75c6-5cbd-4196-9bef-23ba65bf87f1)
</br>
This is the selection screen, allowing you to select your card. 
</br>
![image](https://github.com/user-attachments/assets/fcad00ee-0bde-49f4-9a4d-f8b4dad28704)
</br>
The card is highlighted when you click an image.
</br>
![image](https://github.com/user-attachments/assets/83eb516b-c3a6-4442-a79e-ac4ac43dcc16)
![image](https://github.com/user-attachments/assets/b9883089-54bd-496f-a524-29cdf221c711)
</br>
When you click ready, this confirmation pops up. If you ready up before your opponent, then it has a waiting message.
</br>
![image](https://github.com/user-attachments/assets/a00deba0-2d8f-49e3-9418-ea01765c169b)
![image](https://github.com/user-attachments/assets/f4694f35-5c35-4991-ad08-8a0f2b6879f6)

This is what the game looks like upon starting. The rest is playing the game.
![image](https://github.com/user-attachments/assets/65924fe8-54a6-429f-820a-119f1eea35cb)
![image](https://github.com/user-attachments/assets/0d7e15b9-eb75-4a07-8acd-7b0fc0f3f8b9)
![image](https://github.com/user-attachments/assets/46ddd35e-591d-4203-970e-00a30f1d7619)
</br>
This is the messaging/answering system.
</br>
![image](https://github.com/user-attachments/assets/951f6329-0993-4523-9400-94c8103bde51)
</br>
Flagged cards are red.
</br>
![image](https://github.com/user-attachments/assets/0dbb88ca-ea5d-4eaa-98db-52d3df726b57)
</br>
When you choose to guess, there is a confirmation screen.
</br>
![image](https://github.com/user-attachments/assets/721f651c-0241-4547-b5f8-00e2a35f8670)
</br>
And then a small victory screen.












## Installation/Usage

For the time being, these are the the instructions to play the game locally. Clone/fork this repo. Once you do, download Node.js. Afterwards, run "npm install" which will download dependencies. From there, run split terminals and have one run "npm run server" and "npm run dev" in one terminal per command. there should be a button under where you entered "npm run dev" labelled "https://localhost:3000" and from there you are able to use our game. In the near future, we'd like to make this game online for others to learn the campus through this game.

## Testing

> Screenshot of (Mocha and Chai) Testing output
> 
> ![image](https://github.com/user-attachments/assets/ae606819-17a4-4a61-8bbd-891683e1cc5c)


How was your project tested/validated?

Our project implemented Mocha and Chai, which are JavaScript testing frameworks in order to test the functionality of the backend components of our server. Mocha was used to structure and execute each test, while Chai's assertion output capabilities allowed us to check and validate the behavior of each function within the server. Additionally, we used Husky, Prettier, and ESLint to ensure that all of our pushed code followed a standardized format and rules, which kept all of our code consistent and stable across all versions and throughout our development process. 
