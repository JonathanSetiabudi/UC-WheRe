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
- (some misc js testing framework)

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

- Log in (Accounts)
  - Scoreboard
  - Game statistics
- Card Gallery: In the main menu, the players can access a "Card Gallery" that will display all the available cards that can show up in the games along with their descriptions. The player can see these descriptions by hovering over the cards with their mouse

### How to play the game

- After a guest arrives in a host's lobby, the host can start the game
- When the game first starts, the two players will be brought to a selection screen that previews the board they will be playing on. All cards in the preview board will be displayed in the same position in the actual board. Each player must pick a card to be their Hidden Card -- the card that the other player has to guess. When both players are satisfied with their pick, they must both press the "Ready" button to start the actual game
- Once the actual game starts, players can now interact with the real grid with Flagging Mode or Guessing Mode (player can toggle between the two using a toggle button).
- Player Goal : Each player must guess the other's hidden card
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
![image](https://github.com/user-attachments/assets/476c8125-042e-49c9-9fbb-a6d82676a293)

> ## Phase III
> You will need to schedule a check-in for the second scrum meeting with the same reader you had your first scrum meeting with (using Calendly). Your entire team must be present. This meeting will occur on week 8 during lab time.

> BEFORE the meeting you should do the following:
>
> - Update your class diagram from Phase II to include any feedback you received from your TA/grader.
> - Considering the SOLID design principles, reflect back on your class diagram and think about how you can use the SOLID principles to improve your design. You should then update the README.md file by adding the following:
>   - A new class diagram incorporating your changes after considering the SOLID principles.
>   - For each update in your class diagram, you must explain in 3-4 sentences:
>     - What SOLID principle(s) did you apply?
>     - How did you apply it? i.e. describe the change.
>     - How did this change help you write better code?
> - Perform a new sprint plan like you did in Phase II.
> - Make sure that your README file (and Project board) are up-to-date reflecting the current status of your project and the most recent class diagram. Previous versions of the README file should still be visible through your commit history.
> - Each team member should also submit the Individual Contributions Form on Canvas for phase III. In this form, you need to fill in the names of all team members, the percentage of work contributed by each member for phase III, and a description of their contributions. Remember that each team member should submit the form individually.

> During the meeting with your reader you will discuss:
>
> - How effective your last sprint was (each member should talk about what they did)
> - Any tasks that did not get completed last sprint, and how you took them into consideration for this sprint
> - Any bugs you've identified and created issues for during the sprint. Do you plan on fixing them in the next sprint or are they lower priority?
> - What tasks you are planning for this next sprint.

> ## Final deliverable
>
> All group members will give a demo to the reader during lab time. ou should schedule your demo on Calendly with the same reader who took your second scrum meeting. The reader will check the demo and the project GitHub repository and ask a few questions to all the team members.
> Before the demo, you should do the following:
>
> - Complete the sections below (i.e. Screenshots, Installation/Usage, Testing)
> - Plan one more sprint (that you will not necessarily complete before the end of the quarter). Your In-progress and In-testing columns should be empty (you are not doing more work currently) but your TODO column should have a full sprint plan in it as you have done before. This should include any known bugs (there should be some) or new features you would like to add. These should appear as issues/cards on your Project board.
> - Make sure your README file and Project board are up-to-date reflecting the current status of your project (e.g. any changes that you have made during the project such as changes to your class diagram). Previous versions should still be visible through your commit history.
> - Each team member should also submit the Individual Contributions Form on Canvas for this final phase. In this form, you need to fill in the names of all team members, the percentage of work contributed by each member for the final phase, and a description of their contributions. Remember that each team member should submit the form individually.

## Screenshots

> Screenshots of the input/output after running your application

## Installation/Usage

> Instructions on installing and running your application

## Testing

> How was your project tested/validated? If you used CI, you should have a "build passing" badge in this README.
