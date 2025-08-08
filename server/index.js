//imports express module as express
const express = require("express");
//imports http module as http
const http = require("http");
//imports socket.io module as { Server }
const { Server } = require("socket.io");
//imports cors module as cors
const cors = require("cors");
const { isNullOrUndefined } = require("util");

class LocationClass { 
    constructor(name, descriptionInput, imageInput, locationTypeInput) {
        this.name = name; // set name for each location
        this.isFlagged = false; // set flag to off by default
        this.isSelected_HC = false;
        this.description = descriptionInput; // use string input as description
        this.img = imageInput; // use png/jpg/heic input as img
        // this.difficulty = difficultyLevel; // use string input as difficulty  (can be used for filtering difficulty levels)
        this.locationType = locationTypeInput; // use string input as location type (can be used for filtering when creating gamemode types/difficulty levels)
    }
    toggleFlag() {
    this.isFlagged = !this.isFlagged;
  }

  checkFlag() {
    if (this.isFlagged == true) {
      return true;
    } else {
      return false;
    }
  }

  toggleSelection() {
    this.isSelected_HC = !this.isSelected_HC;
    return this;
  }

  checkSelection() {
    if (this.isSelected_HC == true) {
      return true;
    } else {
      return false;
    }
  }
}


//creates an instance of express called app
const app = express();
//uses the cors module
app.use(cors());
//creates server using the createServer method from the http module and assigns it to the variable server
const server = http.createServer(app);

//creates an instance of the Server class from the socket.io module and assigns it to the variable io
const io = new Server(server, {
  //cors configuration
  //origin is set to false if the NODE_ENV is production
  cors: {
    origin:
      process.env.NODE_ENV === "production" ? false : ["http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
});

function generateRandomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

function generateLobbyCode() {
  const lobbyCode = `${generateRandomLetter()}${generateRandomLetter()}${generateRandomLetter()}${generateRandomLetter()}`;
  if (currLobbies.find((lobby) => lobby.roomCode === lobbyCode)) {
    return generateLobbyCode();
  } else {
    return lobbyCode;
  }
}


const locationNames = [
  "Aberdeen Inverness",
  "Dundee B",
  "Pentland Dorms",
  "Glen Mor Apartments",
  "North District",
  "Bannockburn Village",
  "International Village",
  "Glascow",
  "Lothian Dining",
  "Glen Mor Pool",
  "Dundee Study Rooms",
  "AI Lounge",
  "West Lothian",
  "Dundee A",
  "Dundee Gym",
  "East Lothian Lawn",
  "Scotty's(Glen Mor)",
  "HUB",
  "The Barn",
  "The Habit",
  "Coffee Bean",
  "Getaway Cafe",
  "Scotty's(ASPB)",
  "Scotty's(Glascow)",
  "Bytes",
  "Emerbee's",
  "Ivan's",
  "Noods",
  "Scotty Statue",
  "Clock Tower",
  "Barnes and Noble",
  "SRC",
  "UCR Sign",
  "Multidisciplinary Research Building",
  "UCPD",
  "Bournes Hall",
  "HUMSS",
  "SSC",
  "CHASS North",
  "CHASS South",
  "Arts Building",
  "University Theatre",
  "ULH",
  "Pierce Hall",
  "Skye Hall",
  "Career Center",
  "AI Bowl",
  "Stats Building",
];

  const filePaths = [
    ///images/NOODS.jpg
    "/images/AI_BUILDINGS.HEIC",
    "/images/DUNDEE_B.HEIC",
    "/images/PENTLANDHILLS.HEIC",
    "/images/GLENMOR.JPG",
    "/images/NORTHDISTRICT.HEIC",
    "/images/BANNOCKBURN_SIGN.HEIC",
    "/images/INTERNATIONALVILLAGE.JPG",
    "/images/GLASGOW.HEIC",
    "/images/LOTHIAN_RESTAURANT.JPG",
    "/images/GLENMOR_POOL.HEIC",
    "/images/DUNDEE_STUDYROOM.JPG",
    "/images/AI_LOUNGE.JPG",
    "/images/WEST_LO.JPG",
    "/images/DUNDEE_A.HEIC",
    "/images/DUNDEEGYM.JPG",
    "/images/EASTLO_LAWN",
    "/images/SCOTTYS_GLENMOR.JPG",
    "/images/NIGHTHUB.JPG",
    "/images/THEBARN_DAYTIME.HEIC",
    "/images/HABIT.JPG",
    "/images/COFFEEBEAN.JPG",
    "/images/GETAWAYCAFE.JPG",
    "/images/ASPB_SCOTTYS.JPG",
    "/images/SCOTTYS_GLASGOW.JPG",
    "/images/BYTES.JPG",
    "/images/EMERBEES.HEIC",
    "/images/IVANS.HEIC",
    "/images/NOODS.JPG",
    "/images/SCOTTY_STATUE.HEIC",
    "/images/BELLTOWER.HEIC",
    "/images/BARNES_AND_NOBLE.HEIC",
    "/images/SRC.HEIC",
    "/images/UCRSIGN.JPG",
    "/images/MRB.HEIC",
    "/images/POLICE_DEPARTMENT.HEIC",
    "/images/BOURNES_HALL.HEIC",
    "/images/HUMSS.HEIC",
    "/images/SSC.HEIC",
    "/images/CHASS_N.HEIC",
    "/images/CHASS_S.HEIC",
    "/images/ARTS_BUILDING.HEIC",
    "/images/UNI_THEATRE.HEIC",
    "/images/UNIVERSITYLECTUREHALL.HEIC",
    "/images/PIERCE_HALL.HEIC",
    "/images/SKYE_HALL.HEIC",
    "/images/CAREER_CENTER.HEIC",
    "/images/AI_BOWL.JPG",
    "/images/STATISTICS.HEIC",
  ];

  const descriptions = [
    "Aberdeen-Inverness (A-I), located next to the SRC and Glascow, offers a vibrant, community-focused living experience. Conveniently located near campus amenities, A-I features lounges, study spaces, and frequent events. With modern facilities and a welcoming atmosphere, it’s the perfect place for students to connect, learn, and grow.",
    "Dundee Building B at UCR offers students the most modern and comfortable living environment out of all the dorms. Featuring entertainment lounges, music and karokee rooms, study lounges, and social spaces, it’s perfect for fostering connections and focusing on academics. Conveniently located near Glascow and North District, Dundee B ensures a supportive and engaging residential experience.",
    "Pentland Hills is a network of different dorm buildings with the most unique dorm expierience consisting of a suite style layout. With plentiful lounges, and outdoor spaces, they offer a balance of comfort and productivity. Close to Glen Mor and Dundee, Pentland Hills fosters academic focus and social connections in a supportive environment.",
    "Glen Mor Apartments at UCR offer standard, apartment-style living with private bedrooms, kitchens, and living spaces. They combine independence with proximity to campus. Amenities include study areas, fitness facilities, and a pool, providing a convenient and comfortable home for academic and personal growth.",
    "Considered the big brother of the Dundee Dorms, it takes the Dundee experience to your own room, with the standard layout being 4 bedrooms and 2 bathrooms with a modern kitchen and similar furniture to Dundee's. It contains many private study room, similar to Dundee, allowing for academic success and comfort. It has it's own mini grocery store and boba shop on the first floor.",
    "Bannockburn Village at UCR offers affordable, apartment-style housing with spacious layouts and essential amenities. Ideal for grad students, it provides a balance of independence and community. Located near campus, Bannockburn is a convenient and welcoming option for students seeking a supportive environment for living and learning.",
    "Offering a selection of two-, three-, or five-bedroom apartments tailored for student living, International Village provides residents with an exceptional experience in the area. Relaxation and recreation take center stage with amenities such as a fitness center, study lounges, and an onsite laundry room, ensuring a perfect balance between academics and leisure. Inside your spacious student apartment, unwind effortlessly with modern features, fully furnished interiors including appliances, all utilities included, and central AC.",
  "In Fall 2020, Dining opened its newest Residential Restaurant, Glasgow, adjacent to the equally brand new Dundee Residence Hall. The venue also includes a Scotty's convenience store with a selection of grab-n-go sandwiches, salads, hot/cold beverages, frozen foods, ice cream, and snacks as well as health and personal care items. At full capacity, the two-story, 830-seat Glasgow will include an exhibition bakery, retail store, and two private dining rooms.",
  "Lothian Residential Restaurant offers all-you-care-to-eat dining in a relaxed social environment. Lothian’s seven food stations offer a wide selection of classic, international, healthy, and hearty cuisines. Vegetarian, vegan, and gluten-free options are offered daily.",
  "﻿The Glen Mor Pool at UCR is a resident-exclusive outdoor pool located near the Glen Mor Apartments. It provides a relaxing space for residents to unwind, swim, and socialize while enjoying the California sun, offering a great spot for recreation and relaxation on campus.",
  "The study rooms inside all of the Dundee buildings, with one on each floor. THey offer whiteboards, TV's and multiple tables for individual or group work.",
  "The main lobby/lounge for the AI dorms offers a older, homey feel, with the older vending machines and multiple couchs to wait for friends and family to arrive.",
  "West Lothian, the older of the two, offers a slightly less modern residential experience with comfortable rooms, study lounges, and community spaces. Conveniently right on top of Lothain dining, it fosters a supportive environment for academic success and social engagement, making it an ideal choice for students seeking balance and connection.",
  "Dundee Building A at UCR offers students the most modern and comfortable living environment out of all the dorms. Featuring a gym, entertainment lounges, study lounges, and social spaces, it’s perfect for fostering connections and focusing on academics. Conveniently located near Glascow and North District, Dundee A ensures a supportive and engaging residential experience.",
  "The small but modern gym containing the most basic/essential gym equipment located in Dundee A across from the Dundee firepits.",
  "East Lothian Lawn at UCR is a scenic outdoor space perfect for relaxation, studying, or social gatherings. Surrounded by East Lothian's buildings, it offers a serene environment where students can unwind, connect, and enjoy UCR’s vibrant community atmosphere while sheltered from the wind.",
  "Scotty's by Glen Mor at UCR is a convenient campus market offering a variety of snacks, beverages, and essentials. Located near Glen Mor Apartments, it's a go-to spot for students to grab quick meals, groceries, and supplies in a friendly and accessible setting.",
  "The HUB at UCR is a central gathering space for students, offering dining options, lounges, and event areas. It serves as a hub for socializing, studying, and engaging in campus activities, providing a vibrant atmosphere where students can relax, connect, and participate in university life.",
  "The Barn, a treasured space on the UCR campus, was built in 1917 as a working barn and horse stable from the university’s early days as the Riverside Citrus Experiment Station. The Barn was incorporated into the university in 1955 as a dining and music performance venue until it was closed in the summer of 2018 when renovation and expansion began. That $30 million project included adding another outdoor bar, an entertainment stage for concerts, plus an exclusive faculty/staff full-service concept called The Barn Stable that includes an indoor bar.",
  "The Habit at UCR is a popular fast-casual restaurant known for its delicious burgers, fries, and shakes. Located on campus, it offers a quick and satisfying dining option for students craving a tasty meal in a casual, convenient setting.",
  "The Coffee Bean & Tea Leaf at UCR offers a cozy spot for students to enjoy a variety of coffee, tea, and baked goods. With a relaxing atmosphere, it’s a perfect place to study, meet friends, or grab a quick caffeine boost between classes.",
  "Getaway Cafe at UCR is a casual dining spot offering a variety of alcohol, snacks, and light meals. With its relaxed ambiance, it's a great place for students to unwind, drink, or 'get lit' while enjoying a cozy environment.",
  "Scotty’s is UCR’s personalized convenience store with multiple locations around the campus. There’s no need to venture off campus when you’re looking for a wide selection of grab-n-go sandwiches, salads, hot/cold beverages, frozen foods, ice cream, and snacks or health and personal care items.",
  "Scotty’s is UCR’s personalized convenience store with multiple locations around the campus. There’s no need to venture off campus when you’re looking for a wide selection of grab-n-go sandwiches, salads, hot/cold beverages, frozen foods, ice cream, and snacks or health and personal care items. It is located inside Glascow Dining Halls.",
  "Bytes at UCR is a popular hole in the wall campus eatery inside Winston Chung Hall, offering a variety of starbucks drinks and food options, including pastries, donuts, and sandwhiches. Conveniently located for students on the go, Bytes provides a satisfying and efficient dining experience in a casual setting.",
  "Emerbee's cafe Proudly Serves Starbucks along with the newest creative food offerings from our excellent culinary team! The Emerbee's menu offers paninis, toasts, signature treats featuring honey grown right here at UCR, and much more. Check out our full breakfast and lunch/dinner menu to the right! With a thousand-square-feet of umbrella-covered tables and chairs, Emerbee's has room for studying and socializing. Stay awhile to grab a bite and learn a bit about bee research on campus via our CIBER-dedicated info display!",
  "Ivan’s at Hinderaker is a walk-up window with all the perks of a traditional coffee house serving fair trade coffee, espresso, tea and pastries. Available are smoothies, an assortment of grab-n-go wrap sandwiches, salads, fruit cups and yogurt parfaits.",
  "Dive into a fully customizable dining experience where every bowl is tailored to your taste. Start with your choice of ramen, udon, or rice noodles, then enhance it with bold, flavorful sauces like gochujang, spicy ramen, black bean, or yellow curry. ",
  "Scotty on the Bench at UCR is a charming outdoor seating area located near the HUB and outdoor benches. It offers a relaxing spot for students to unwind, socialize, or study while enjoying the campus surroundings. It’s a peaceful place to take a break and enjoy the UCR atmosphere.",
  "The Bell Tower at UCR is a campus landmark and a popular meeting spot. Located at the heart of the university, it serves as a symbol of the school’s history and a focal point for students to gather, relax, or enjoy the surrounding views of the campus.",
  "The Barnes & Noble at UCR is a campus bookstore offering textbooks, school supplies, UCR apparel, and a wide selection of books. It’s a convenient spot for students to find academic materials, grab a gift, or buy apperal while browsing the latest reads.",
  "The SRC (Student Recreation Center) at UCR is a state-of-the-art facility offering a variety of fitness equipment, group classes, and recreational activities. With amenities like a swimming pool, rock climbing wall, and sports courts, the SRC provides students with a place to stay active, healthy, and engaged.",
  "The UCR Sign is a prominent campus landmark, located at the heart of the university near the Bell Tower. It serves as a welcoming symbol for students, staff, and visitors, offering a photo opportunity and a reminder of the UCR community’s pride and spirit.",
  "The Multidisciplinary Research Building (MRB) at UCR is a cutting-edge facility dedicated to fostering innovation and collaboration across various fields of study. It houses advanced research labs, classrooms, and meeting spaces, providing a dynamic environment for students and faculty to work on interdisciplinary projects and discoveries. Found on Aberdeen Drive, across AI and near the SRC.",
  "The UCR Police Department is responsible for ensuring the safety and security of the campus community. Offering services like emergency response, crime prevention, and community outreach, the department plays a vital role in maintaining a safe environment for students, faculty, and staff at the university. Found on the corner of University Ave and W Linden St.",
  "Bourns Hall at UCR is a hub for engineering students, featuring modern classrooms, labs, and research facilities. It’s home to the Bourns College of Engineering, providing a collaborative space for students and faculty to engage in innovative projects and cutting-edge research in various engineering fields. Found adjacent to Winston Chung and the Barnes and Noble.",
  "The Humanities Building at UCR houses classrooms, faculty offices, and seminar rooms for the College of Humanities, Arts, and Social Sciences. It provides a space for students to engage in diverse academic disciplines, offering a dynamic environment for learning, collaboration, and intellectual exploration. It is located near the Barn.",
  "A state of the art three-story, 62,000-square-foot building will feature a mix of classrooms, small- to large-sized lecture halls outfitted with modern presentational tools, multipurpose rooms, student study areas, meeting rooms, and a student lounge. With a seating capacity of 1,100, the new building will provide a significant increase in classroom space to meet the growing campus enrollment and graduation rates in coming years.",
  "CHASS North at UCR is a building that houses classrooms, faculty offices, and resources for students in the College of Humanities, Arts, and Social Sciences (CHASS). It provides a collaborative environment for academic pursuits, fostering a community for students and faculty within the humanities and social sciences disciplines. Located adjacent to CHASS South.",
  "CHASS South at UCR is a key building for the College of Humanities, Arts, and Social Sciences (CHASS). It features classrooms, seminar spaces, and faculty offices, offering a collaborative environment for students and faculty to engage in academic activities and research across various humanities and social science fields. Located adjacent to CHASS North",
  "The Arts Building at UCR is a hub for the Department of Art, offering studio spaces, classrooms, and galleries for students and faculty. It provides a creative environment for students to explore various art forms, including visual arts, sculpture, and digital media, while engaging in exhibitions and artistic collaborations.",
  "The University Theatre at UCR is a performing arts venue that hosts a variety of productions, including plays, dance performances, and concerts. It serves as a creative space for students, faculty, and guest artists to showcase their talents, while offering the campus community a venue for cultural and artistic experiences.",
  "The University Lecture Hall at UCR is a spacious venue designed for large lectures, seminars, and events. Equipped with modern technology and seating for hundreds of students, it provides a conducive environment for academic presentations, guest speakers, and campus-wide gatherings.",
  "Pierce Hall at UCR is a lab and academic building offering spaces for labs, research, and professor consultation. It supports various academic departments such as chem and bio, providing a functional environment for learning, teaching, and engagement in a range of disciplines across the university. It is located adjacent to Bournes and the Scotty on the Bench statue.",
  "Skye Hall at UCR is an academic building that houses classrooms, faculty offices, and meeting spaces. It provides a modern environment for learning and collaboration, supporting a range of academic disciplines and offering students and faculty a space to engage in educational activities and discussions. It is located adjacent to the HUB.",
  "The Career Center at UCR provides students with resources and support to explore career paths, develop professional skills, and connect with potential employers. Offering workshops, career counseling, job fairs, and internships, it helps students prepare for successful careers after graduation. It is located adjacent to the University Lecture and Skye Halls.",
  "The Aberdeen-Inverness Bowl at UCR is an outdoor recreational space located near the Aberdeen-Inverness residence halls. It serves as a social and relaxation area for students, offering a place for informal gatherings, outdoor activities, and community events in a scenic and inviting setting. It is located across from Winston Chung and the Multidisciplinary building.",
  "The Statistics Building at UCR houses classrooms, research labs, and faculty offices for the Department of Statistics. It provides a collaborative environment for students and faculty to engage in data analysis, research projects, and academic pursuits related to statistical theory and applications.",
];

let locationMasterArray = [];
let arrayByTheme = [];

for (let i = 0; i < 28; i++) {
  const location = new LocationClass(
    locationNames[i],
    descriptions[i],
    filePaths[i],
    "Residential and Dining",
  );
  arrayByTheme.push(location);
  locationMasterArray.push(location);
}

for (let j = 28; j < 48; j++) {
  const location = new LocationClass(
    locationNames[j],
    descriptions[j],
    filePaths[j],
    "Campus Landmarks",
  );
  locationMasterArray.push(location);
}

const initialGameBoard = [];

for (let i = 0; i < 16; i++) {
  initialGameBoard.push(arrayByTheme[i]);
}

function getRandomItems(arr, n) {
  if (n > arr.length) {
    throw new Error("n cannot be larger than the array length");
  }

  const result = [];
  const seen = new Set();

  while (result.length < n) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    if (!seen.has(randomIndex)) {
      seen.add(randomIndex);
      result.push(arr[randomIndex]);
    }
  }

  return result;
}

const locationByTheme = (theme) => {
  arrayByTheme = [];
  if (theme === 0) {
    for (let i = 0; i < locationMasterArray.length; i++) {
      if (locationMasterArray[i].locationType === "Residential and Dining") {
        arrayByTheme.push(locationMasterArray[i]);
      }
    }
  } else if (theme === 1) {
    for (let i = 0; i < locationMasterArray.length; i++) {
      if (locationMasterArray[i].locationType === "Campus Landmarks") {
        arrayByTheme.push(locationMasterArray[i]);
      }
    }
  }
  return arrayByTheme;
};

currLobbies = [
  {
    roomCode: "TEST",
    players: [],
    readyStatus: {},
    hiddenCards: {},
    numOfUsers: 0,
    difficulty: 0,
    theme: 0,
    numGuesses: 1,
    lobbyGridSize: 16,
    gameBoard: [],
    // hostHasSelected: false,
    // guestHasSelected: false,
    gameStarted: false,
  },
];

//on connection, logs the message "User connected" and the socket id
//this is basically a list of event listeners
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  //on creating a room, logs the message "User created room" and the room id
  //then emits the createdRoom event to the room with the room id
  socket.on("create_lobby", () => {
    const roomCode = generateLobbyCode();
    let room = {
      roomCode: roomCode,
      players: [socket.id],
      readyStatus: { [socket.id]: false },
      hiddenCards: { [socket.id]: null },
      numOfUsers: 1,
      difficulty: 0,
      theme: 0,
      numGuesses: 1,
      lobbyGridSize: 16,
      gameBoard: initialGameBoard,
    };
    currLobbies.push(room);
    console.log(`User(${socket.id}) created room: ${roomCode}`);
    socket.join(roomCode);
    socket.emit("createdLobby", roomCode);
    console.log(`Players in ${roomCode}`, room.players);
  });

  //on joining the room, logs the message "User connected to room
  socket.on("join_lobby", (room) => {
    if (currLobbies.find((lobby) => lobby.roomCode === room)) {
      if (currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers < 2) {
        currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers++;
        socket.join(room);
        console.log(`User(${socket.id}) connected to lobby: ${room}`);
        currLobbies
          .find((roomToBeFound) => roomToBeFound.roomCode === room)
          .players.push(socket.id);
        if (
          currLobbies.find((lobby) => lobby.roomCode === room).numOfUsers === 2
        ) {
          console.log(`Lobby (${room}) is now full`);
        }
        console.log(
          `Players in ${room}`,
          currLobbies.find((roomToBeFound) => roomToBeFound.roomCode === room)
            .players,
        );
        socket.emit("joinedLobby", room);
      } else {
        console.log(`User(${socket.id}) tried to join full lobby: ${room}`);
        socket.in(room).emit("triedJoinFullLobby");
      }
    } else {
      console.log(
        `User(${socket.id}) tried to join non-existent lobby: ${room}`,
      );
      socket.in(room).emit("triedJoinNonExistentLobby");
    }
  });

  //on leaving the room, logs the message "User disconnected from room" and the room id

  socket.on("leave", (room) => {
    console.log(`User(${socket.id}) disconnected from lobby: ${room}`);
    socket.leave(room);
    const roomToChange = currLobbies.find((lobby) =>
      lobby.players.includes(socket.id),
    );
    if (roomToChange) {
      const roomToDecrement = roomToChange.roomCode;
      roomToChange.numOfUsers--;
      if (roomToChange.players[0] === socket.id) {
        socket.in(roomToChange.roomCode).emit("hostLeft");
      } else if (roomToChange.gameStarted === true) {
        socket.in(roomToChange.roomCode).emit("guestLeftMidGame");
      } else {
        roomToChange.players = roomToChange.players.filter(
          (player) => player !== socket.id,
        );
      }
      if (roomToChange.numOfUsers === 0 && roomToChange.roomCode !== "TEST") {
        currLobbies = currLobbies.filter(
          (lobby) => lobby.roomCode !== roomToChange.roomCode,
        );
        console.log(`Lobby ${roomToDecrement} has been deleted`);
      }
    }
  });

  //on disconnect, logs the message "User disconnected" and the socket id
  socket.on("disconnect", () => {
    console.log(`User(${socket.id}) disconnected`);
    const roomToChange = currLobbies.find((lobby) =>
      lobby.players.includes(socket.id),
    );
    if (roomToChange) {
      const roomToDecrement = roomToChange.roomCode;
      currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
        .numOfUsers--;
      roomToChange.players = roomToChange.players.filter(
        (player) => player !== socket.id,
      );

      delete roomToChange.readyStatus[socket.id]; // del room's readiness status

      if (roomToChange.gameStarted) {
        const oppID = roomToChange.players.find((id) => id !== socket.id);

        io.in(oppID).emit("victory");
        console.log(
          `Player ${oppID} wins as they are the only player left in lobby ${roomToChange.roomCode}`,
        );
      }

      if (
        currLobbies.find((lobby) => lobby.roomCode === roomToDecrement)
          .numOfUsers === 0 &&
        roomToDecrement !== "TEST"
      ) {
        currLobbies = currLobbies.filter(
          (lobby) => lobby.roomCode !== roomToDecrement,
        );
        console.log(`Lobby ${roomToDecrement} has been deleted`);
      }
    }
  });

  //on receiving a sendMessage event, logs the message "I AM BEING RECIEVED" and the data
  //then emits the receivedMessage event to the room with the message
  socket.on("sendMessage", (data) => {
    console.log("I AM BEING RECIEVED", data);
    socket.to(data.room).emit("receivedMessage", data);
  });

  socket.on("answerQuestion", (answer, room, author) => {
    console.log("Answer received", answer);
    socket.to(room).emit("receivedAnswer", answer, author);
  });

  socket.on("setHiddenCard", ({ room, hiddenCard }) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      if (!theLobby.hiddenCards) {
        theLobby.hiddenCards = {};
      }

      theLobby.hiddenCards[socket.id] = hiddenCard;
      console.log(
        `Player ${socket.id} set their hidden card to ${hiddenCard.name}`,
      );
      //console.log(`Player ${socket.id} set their hidden card`);
    } else {
      console.log(
        `Player ${socket.id} tried to set their hidden card in non-existent lobby`,
      );
    }
  });

  socket.on("tryStartGame", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      if (theLobby.numOfUsers === 2) {
        io.to(room).emit("updateGameBoard", theLobby.gameBoard);
        io.to(room).emit("successStartGame");
        theLobby.gameStarted = true;
        console.log(
          `Host User(${socket.id}) successsfully started a game in lobby: ${room}`,
        );
      } else {
        io.to(room).emit("failStartGame");
        console.log(
          `Host User(${socket.id}) failed to start a game in lobby: ${room}`,
        );
      }
    } else {
      console.log(
        `Host User(${socket.id}) tried to start game in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("tryLaunchGame", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      if (!room.readyStatus) {
        room.readyStatus = {};
      }

      theLobby.readyStatus[socket.id] = true; // set readyStatus to true
      console.log(`Player ${socket.id} in room ${room} is ready`);

      const allReady = Object.values(theLobby.readyStatus).every(
        (status) => status === true,
      );
      if (allReady) {
        io.to(room).emit("launchGame");
        console.log(`2/2 players in room ${room} are ready. Launching game`);
      } else {
        io.to(room).emit("waitingForOtherReady");
        console.log(`1/2 players in ${room} are ready. Cannot launch game`);
      }
    } else {
      console.log(
        `User(${socket.id}) tried to launch game in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("playerCancelledReady", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      theLobby.readyStatus[socket.id] = false; // player is no longer ready
      console.log(`Player ${socket.id} in room ${room} is no longer ready`);
    } else {
      console.log(
        `User(${socket.id}) tried to cancel ready in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("finalizedGuess", ({ room, guessedCardName }) => {
    //console.log(`Player ${socket.id} finalized their guess`);
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      //console.log("Hidden Cards:", theLobby.hiddenCards);

      const oppID = theLobby.players.find((id) => id !== socket.id);
      const oppCard = theLobby.hiddenCards[oppID];

      if (guessedCardName === oppCard.name) {
        io.to(socket.id).emit("victory");
        io.to(oppID).emit("defeat");
        console.log(`Player ${socket.id} won by guessing right!`);
      } else {
        io.to(socket.id).emit("incorrectGuess");
        console.log(
          `Player ${socket.id} guessed incorrectly. Decrementing numGuesses available`,
        );
      }
    } else {
      console.log(
        `User(${socket.id}) tried to finalize guess in a non-existent lobby: ${room}`,
      );
    }
  });

  socket.on("ranOutOfGuesses", (room) => {
    const theLobby = currLobbies.find((lobby) => lobby.roomCode === room);
    if (theLobby) {
      const oppID = theLobby.players.find((id) => id !== socket.id);

      io.to(socket.id).emit("defeat");
      io.to(oppID).emit("victory");

      console.log(`Player ${socket.id} ran out of guesses and lost!`);
    } else {
      console.log(
        `User(${socket.id}) ran out of guesses in a non-existent lobby: ${room}`,
      );
    }
  });

  //upon receiving a settingDifficulty, settingTheme, settingNumGuesses, or settingGridSize
  // event, log "updating ____ setting" and the new difficulty setting

  socket.on("settingDifficulty", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("updating difficulty setting to ", data.boardDifficulty);
    room.difficulty = data.boardDifficulty;
    room.gameBoard = data.gameBoard;
    const updatedData = {
      room: data.room,
      boardDifficulty: room.difficulty,
      gameBoard: room.gameBoard,
    };
    socket.in(lobbyCode).emit("finishedUpdatingDifficulty", updatedData);
  });

  socket.on("settingTheme", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("updating theme setting to ", data.boardTheme);
    room.theme = data.boardTheme;
    room.gameBoard = getRandomItems(
      locationByTheme(data.boardTheme),
      room.lobbyGridSize
    );
    const updatedData = {
      room: data.room,
      gameBoard: room.gameBoard,
    };
    io.in(lobbyCode).emit("finishedUpdatingTheme", updatedData);
  });

  socket.on("settingNumberOfGuesses", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("updating number of guesses to ", data.numGuess);
    room.numGuesses = data.numGuess;
    const updatedData = { room: data.room, numGuess: room.numGuesses };
    socket.to(lobbyCode).emit("finishedUpdatingGuesses", updatedData);
  });

  socket.on("settingGridSize", (data) => {
    const lobbyCode = data.room;
    const room = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("updating gridSize to ", data.gridSize);
    room.lobbyGridSize = data.gridSize;
    room.gameBoard = getRandomItems(
      locationByTheme(room.theme),
      room.lobbyGridSize
    );
    const updatedData = {
      room: data.room,
      gameBoard: room.gameBoard,
    };
    io.in(lobbyCode).emit("finishedUpdatingGridSize", updatedData);
  });

  socket.on("testEcho", (data) => {
    const lobbyCode = data.room;
    const roomData = currLobbies.find((lobby) => lobby.roomCode === lobbyCode);
    console.log("current settings: room", lobbyCode);
    console.log("players in lobby:", roomData.numOfUsers);
    console.log("difficulty: ", roomData.difficulty);
    console.log("theme: ", roomData.theme);
    console.log("number of guesses: ", roomData.numGuesses);
    console.log("size of grid: ", roomData.lobbyGridSize);
    console.log("game board: ", roomData.gameBoard);
  });
});

server.listen(8080, () => {
  console.log("listening on 8080");
});
