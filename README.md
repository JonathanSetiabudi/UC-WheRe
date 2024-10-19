# UC WheRe ? 
Authors:
* [Jonathan Setiabudi](https://github.com/JonathanSetiabudi)
* [Anita Hakim](https://github.com/anitathakim)
* [Adithya Chander](https://github.com/adidi-c)
* [Charleen Chen](https://github.com/charleenschen)


<!-- ## Project Description 
 > Your project description should summarize the project you are proposing. Be sure to include:
 > * Why is it important or interesting to you?
 > * What languages/tools/technologies do you plan to use? (This list may change over the course of the project)
 > * What will be the input/output of your project?
 > * What are the features that the project provides? -->
## Project Description
Our project adds a twist to the popular game "Guess Who?" (By Hasbro) as instead of guessing people, users will be guessing UCR Locations. We want to challenge ourselves by creating a web app that not only pushes us to learn new technologies but also serve a social purpose that can enhance our school spirit. Upon completion of this project, we hope to create a fun social tool for orientation leaders and new students to teach/learn what's on campus while bonding via playing a game together.
<br/><br/>

The technologies/tools our project will use are: <br/>
* React Query (frontend)
* TailwindCSS (frontend)
* Next.js (backend)
* Typescript (backend)
* Prettier (VSCode extension)
* ESLint (VSCode extension)

<br/>

The input and output of our project will entail the following: <br/>
* Input
   * Keyboard
       * Lobby code
       * Messages (asking questions)
   * Mouse
       * Used in Flagging system
       * Yes/No answers
* Output
   * Messaging system
       *  Yes/No responses to opponent's guesses/questions 
   * Flagging system
       * Enable/disable a flag on a specific card to allow user to eliminate locations while playing
   * Game result screen
       * Display Victory/Defeat screens for winner and other player respectively

<br/>

The features of our project will include: 
* Lobby 
    * Host Game: User can create a game lobby with customzied game settings that has a distinct four-letter code (can be shared to other users)
    * Join Game: User can join a game lobby by inputting a four-letter code shared by a host
* Game Customization Page
    * Host can personalize the board and difficulty to their desire
* Gameplay
     * Card Selection: Before a game starts, both players to pick their UCR location that the other player has to guess 
     * Messaging: Players can send yes-or-no questions to each other to deduce the other player's location
     * Flagging: Players use process of elimination by  "flagging" locations that are unlikely to be the target location
     * Final Guess: Players can make their final guess on the target location to win the game
     * Game Result: If final guess is correct, victory screen will appear. Else, defeat screen will appear.

 > ## Phase II
 > In addition to completing the "User Interface Specification" and "Class Diagram" sections below, you will need to:
 > * Create an "Epic" (note) for each feature. Place these epics in the `Product Backlog` column
 > * Complete your first *sprint planning* meeting to plan out the next 7 days of work.
 >   * Break down the "Epics" into smaller actionable user stories (i.e. smaller development tasks). Convert them into issues and assign them to team members. Place these in the `TODO` column (aka Sprint Backlog).
 >   * These cards should represent roughly 7 days worth of development time for your team. Then, once the sprint is over you should be repeating these steps to plan a new sprint, taking you until your second scrum meeting with the reader in phase III.
 > * Each team member needs to submit the Individual Contributions Form on Canvas for this phase. In this form, you need to fill in the names of all team members, the percentage of work contributed by each member for phase  II, and a description of their contributions. Remember that each team member should submit the form individually.
 > * Schedule two check-ins using Calendly. Both time slots should be during your lab on week 6. Your entire team must be present for both check-ins.
 >   * The first check-in needs to be scheduled with your lab TA. During that meeting, you will discuss your project design/class diagram from phase II.
 >   * The second check-in should be scheduled with a reader. During that meeting you will discuss:
 >     * The tasks you are planning for the first sprint
 >     * How work will be divided between the team members
## User Interface Specification
 > Include a navigation diagram for your screens and the layout of each of those screens as desribed below. For all the layouts/diagrams, you can use any tool such as PowerPoint or a drawing program. (Specification requirement is adapted from the User Interface Design Document Template of CMSC 345 at the University of Maryland Global Campus)

### Navigation Diagram
> Draw a diagram illustrating how the user can navigate from one screen to another. Here is an [example](https://creately.com/diagram/example/ikfqudv82/user-navigation-diagram-classic?r=v). It can be useful to label each symbol that represents a screen so that you can reference the screens in the next section or the rest of the document if necessary. Give a brief description of what the diagram represents.

### Screen Layouts
> Include the layout of each of your screens. The layout should describe the screen’s major components such as menus and prompts for user inputs and expected output, or any graphical user interface components if applicable (e.g. buttons, text boxes, etc). Explain what is on the layout, and the purpose of each menu item, button, etc. If many screens share the same layout, start by describing the general layout and then list the screens that will be using that layout and the differences between each of them.

## Class Diagram
 > Include a **class diagram(s)** for your project and a **description** of the diagram(s). Your class diagram(s) should include all the main classes you plan for the project. This should be in sufficient detail that another group could pick up the project this point and successfully complete it. Use proper UML notation (as discussed in the course slides).
 
 > ## Phase III
 > You will need to schedule a check-in for the second scrum meeting with the same reader you had your first scrum meeting with (using Calendly). Your entire team must be present. This meeting will occur on week 8 during lab time.
 
 > BEFORE the meeting you should do the following:
 > * Update your class diagram from Phase II to include any feedback you received from your TA/grader.
 > * Considering the SOLID design principles, reflect back on your class diagram and think about how you can use the SOLID principles to improve your design. You should then update the README.md file by adding the following:
 >   * A new class diagram incorporating your changes after considering the SOLID principles.
 >   * For each update in your class diagram, you must explain in 3-4 sentences:
 >     * What SOLID principle(s) did you apply?
 >     * How did you apply it? i.e. describe the change.
 >     * How did this change help you write better code?
 > * Perform a new sprint plan like you did in Phase II.
 > * Make sure that your README file (and Project board) are up-to-date reflecting the current status of your project and the most recent class diagram. Previous versions of the README file should still be visible through your commit history.
>  * Each team member should also submit the Individual Contributions Form on Canvas for phase III. In this form, you need to fill in the names of all team members, the percentage of work contributed by each member for phase III, and a description of their contributions. Remember that each team member should submit the form individually.
 
> During the meeting with your reader you will discuss: 
 > * How effective your last sprint was (each member should talk about what they did)
 > * Any tasks that did not get completed last sprint, and how you took them into consideration for this sprint
 > * Any bugs you've identified and created issues for during the sprint. Do you plan on fixing them in the next sprint or are they lower priority?
 > * What tasks you are planning for this next sprint.

 
 > ## Final deliverable
 > All group members will give a demo to the reader during lab time. ou should schedule your demo on Calendly with the same reader who took your second scrum meeting. The reader will check the demo and the project GitHub repository and ask a few questions to all the team members. 
 > Before the demo, you should do the following:
 > * Complete the sections below (i.e. Screenshots, Installation/Usage, Testing)
 > * Plan one more sprint (that you will not necessarily complete before the end of the quarter). Your In-progress and In-testing columns should be empty (you are not doing more work currently) but your TODO column should have a full sprint plan in it as you have done before. This should include any known bugs (there should be some) or new features you would like to add. These should appear as issues/cards on your Project board.
 > * Make sure your README file and Project board are up-to-date reflecting the current status of your project (e.g. any changes that you have made during the project such as changes to your class diagram). Previous versions should still be visible through your commit history.
>  * Each team member should also submit the Individual Contributions Form on Canvas for this final phase. In this form, you need to fill in the names of all team members, the percentage of work contributed by each member for the final phase, and a description of their contributions. Remember that each team member should submit the form individually.
 
 ## Screenshots
 > Screenshots of the input/output after running your application
 ## Installation/Usage
 > Instructions on installing and running your application
 ## Testing
 > How was your project tested/validated? If you used CI, you should have a "build passing" badge in this README.
 
