"use client";

import React, { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from "../page.jsx";
import { socket } from "@/utils/socket";
import LocationClass from "../objects/Location";
// import userRooms from ".../server/index.js";
// @ts-expect-error - TS complains about the type of newTheme, but we alr know it's a string
const Lobby = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playersInLobby, setPlayerCount] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boardDifficulty, setDifficulty] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [boardTheme, setTheme] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [numGuess, setNumOfGuesses] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gridSize, setGridSize] = useState<number>(16);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameBoard, setGameBoard] = useState<LocationClass[]>([]);

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
    "../images/AI_BUILDINGS.HEIC",
    "../images/DUNDEE_B.HEIC",
    "../images/PENTLANDHILLS.HEIC",
    "../images/GLENMOR.JPG",
    "../images/NORTHDISTRICT.HEIC",
    "../images/BANNOCKBURN_SIGN.HEIC",
    "../images/INTERNATIONALVILLAGE.JPG",
    "../images/GLASCOW.HEIC",
    "../images/LOTHIAN_RESTAURANT.JPG",
    "../images/GLENMOR_POOL.HEIC",
    "../images/DUNDEE_STUDYROOM.JPG",
    "../images/AI_LOUNGE.JPG",
    "../images/WEST_LO.JPG",
    "../images/DUNDEE_A.HEIC",
    "./images/DUNDEEGYM.JPG",
    "../images/EASTLO_LAWN",
    "../images/SCOTTYS_GLENMOR.JPG",
    "../images/NIGHTHUB.JPG",
    "../images/THEBARN_DAYTIME.HEIC",
    "../images/HABIT.JPG",
    "../images/COFFEEBEAN.JPG",
    "../images/GETAWAYCAFE.JPG",
    "../images/ASPB_SCOTTYS.JPG",
    "../images/SCOTTYS_GLASCOW.JPG",
    "../images/BYTES.JPG",
    "../images/EMERBEES.HEIC",
    "../images/IVANS.HEIC",
    "../images/NOODS.JPG",
    "../images/SCOTTY_STATUE.HEIC",
    "../images/BELLTOWER.HEIC",
    "../images/BARNES_AND_NOBLE.HEIC",
    "../images/SRC.HEIC",
    "../images/UCRSIGN.JPG",
    "../images/MRB.HEIC",
    "../images/POLICE_DEPARTMENT.HEIC",
    "../images/BOURNES_HALL.HEIC",
    "../images/HUMSS.HEIC",
    "../images/SSC.HEIC",
    "../images/CHASS_N.HEIC",
    "../images/CHASS_S.HEIC",
    "../images/ARTS_BUILDING.HEIC",
    "../images/UNI_THEATRE.HEIC",
    "../images/UNIVERSITYLECTUREHALL.HEIC",
    "../images/PIERCE_HALL.HEIC",
    "../images/SKYE_HALL.HEIC",
    "../images/CAREER_CENTER.HEIC",
    "../images/AI_BOWL.JPG",
    "../images/STATISTICS.HEIC",
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
  let locationMasterArray: LocationClass[] = [];
  let arrayByTheme: LocationClass[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  for (let i = 0; i < 28; i++) {
    const location = new LocationClass(
      locationNames[i],
      descriptions[i],
      filePaths[i],
      "Residential and Dining",
    );
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("createdLobby", () => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("joinedLobby", () => {
      setPlayerCount((playersInLobby) => playersInLobby + 1);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingDifficulty", (updatedData) => {
      setDifficulty(updatedData.boardDifficulty);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingTheme", (updatedData) => {
      setTheme(updatedData.boardTheme);
      setGameBoard(updatedData.gameBoard);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingGuesses", (updatedData) => {
      setNumOfGuesses(updatedData.numGuess);
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket.on("finishedUpdatingGridSize", (updatedData) => {
      setGridSize(updatedData.gridSize);
      setGameBoard(updatedData.gameBoard);
    });
  });

  const locationByTheme = (theme: number) => {
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
  };

  function getRandomItems<T>(arr: Array<T>, n: number) {
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

  // sends update signals to server when button is clicked
  // const onDifficultyChange = (newDifficulty) => {
  //   setDifficulty(newDifficulty);
  //   const data = { room: props.room, boardDifficulty: newDifficulty };
  //   socket.emit("settingDifficulty", data);
  // };
  // @ts-expect-error - TS complains about the type of newTheme, but we alr know it's a number
  const onThemeChange = (newTheme) => {
    setTheme(newTheme);
    locationByTheme(newTheme);
    setGameBoard(getRandomItems(arrayByTheme, gridSize));
    const data = {
      room: props.room,
      boardTheme: newTheme,
      gameBoard: gameBoard,
    };
    socket.emit("settingTheme", data);
  };
  // @ts-expect-error - TS complains about the type of newNumGuesses, but we alr know it's a number
  const onNumGuessChange = (newNumGuesses) => {
    setNumOfGuesses(newNumGuesses);
    const data = { room: props.room, numGuess: newNumGuesses };
    socket.emit("settingNumberOfGuesses", data);
  };
  // @ts-expect-error - TS complains about the type of newGridSize, but we alr know it's a number
  const onGridChange = (newGridSize) => {
    setGridSize(newGridSize);
    setGameBoard(getRandomItems(arrayByTheme, gridSize));
    const data = {
      room: props.room,
      gridSize: newGridSize,
      gameBoard: gameBoard,
    };
    socket.emit("settingGridSize", data);
  };

  const testEcho = () => {
    const data = { room: props.room };
    socket.emit("testEcho", data);
  };

  // // difficulty handlers
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickEasy = () => {
  //   onDifficultyChange(0);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickMedium = () => {
  //   onDifficultyChange(1);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickHard = () => {
  //   onDifficultyChange(2);
  // };

  // theme handlers
  const handleClickThemeResAndDining = () => {
    onThemeChange(0);
  };

  const handleClickThemeCampusLandmarks = () => {
    onThemeChange(1);
  };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickThemeStudySpots = () => {
  //   onThemeChange(2);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickThemeBikeRacks = () => {
  //   onThemeChange(3);
  // };
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const handleClickThemeStreetsAndParking = () => {
  //   onThemeChange(4);
  // };

  // guess handlers (will probably convert to dropdown menu)
  const handleClickGuess1 = () => {
    onNumGuessChange(1);
  };

  const handleClickGuess3 = () => {
    onNumGuessChange(3);
  };

  // board size handlers (will probably convert this to dropdown as well)
  const handleClickBoardSmall = () => {
    onGridChange(16);
  };

  const handleClickBoardLarge = () => {
    onGridChange(20);
  };

  const buttonPerms = (checkIfHost: boolean) => {
    return checkIfHost
      ? "text-black hover:bg-blue-200"
      : "text-gray-400 cursor-not-allowed";
  };

  const handleTestEcho = () => {
    testEcho();
  };

  return (
    <div>
      {/* <br></br>

      <p>Set your difficulty:</p>

      <button
        onClick={handleClickEasy}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Easy
      </button>

      <br></br>

      <button
        onClick={handleClickMedium}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Medium
      </button>

      <br></br>

      <button
        onClick={handleClickHard}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Hard
      </button> */}

      <br></br>

      <p>Select a theme:</p>

      <button
        onClick={handleClickThemeResAndDining}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        {" "}
        Residential and Dining{" "}
      </button>

      <br></br>

      <button
        onClick={handleClickThemeCampusLandmarks}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        {" "}
        Campus Landmarks{" "}
      </button>

      {/* <br></br>

      <button
        onClick={handleClickThemeStudySpots}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Study Spots
      </button>

      <br></br>

      <button
        onClick={handleClickThemeBikeRacks}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        Bike Racks
      </button>

      <br></br>

      <button
        onClick={handleClickThemeStreetsAndParking}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        {" "}
        Streets and Parking Lots{" "}
      </button> */}

      <br></br>

      <p>How many guesses?</p>

      <button
        onClick={handleClickGuess1}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        1 guess
      </button>

      <br></br>

      <button
        onClick={handleClickGuess3}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        3 guesses
      </button>

      <br></br>

      <p>Set your board size:</p>

      <button
        onClick={handleClickBoardSmall}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        4 x 4
      </button>

      <br></br>

      <button
        onClick={handleClickBoardLarge}
        disabled={!props.isHost}
        className={buttonPerms(props.isHost)}
      >
        5 x 4
      </button>

      <p>tester button for lobby settings:</p>

      <br></br>
      <button onClick={handleTestEcho}>click for echo !</button>
    </div>
  );
};

// try to change guess select to dropdown menu instead.
// for commit
export default Lobby;

// import { User } from "./User";

// // 4x4 = 20
// // 5x5 = 25
// // 4 = 4x4
// // 5 = 5x5
// // 46 = 4x6
// // board theme is string or int?

// // include tests

// class Lobby {
//   //defining variable types
//   hostID: string;
//   guestID: string;
//   playersInLobby: string[] = [];
//   code: string;
//   gridSize: { width: number; height: number };
//   boardDifficulty: number;
//   boardTheme: number;
//   numGuess: number;

//   constructor(
//     user: User,
//     code: string,
//     gridSize = { width: 4, height: 4 },
//     boardDiff = 0,
//     boardTheme = 0,
//     numGuess = 1,
//   ) {
//     this.hostID = user.id;
//     this.guestID = ""; // null on default
//     this.playersInLobby.push(user.id);
//     this.code = code;
//     this.gridSize = gridSize;
//     this.boardDifficulty = boardDiff;
//     this.boardTheme = boardTheme;
//     this.numGuess = numGuess;
//   }

//   joinGame(newUser: User, code: string) {
//     if (code !== this.code) {
//       throw new Error("Invalid code.");
//     }

//     if (this.getNumPlayers() >= 2) {
//       throw new Error("Lobby is full.");
//     }

//     if (this.playersInLobby.includes(newUser.id)) {
//       throw new Error(`User ${newUser.id} is already in the lobby.`);
//     }

//     this.playersInLobby.push(newUser.id);
//     this.guestID = newUser.id;
//   }

//   static hostGame(user: User, code: string) {
//     return new Lobby(user, code);
//   }

//   getHostID() {
//     return this.hostID;
//   }

//   getGuestID() {
//     return this.guestID;
//   }

//   getCurrPlayers() {
//     return this.playersInLobby;
//   }

//   getNumPlayers() {
//     return this.playersInLobby.length;
//   }

//   setGridSize(width: number, height: number) {
//     this.gridSize = { width, height };
//   }

//   getGridSize() {
//     return this.gridSize;
//   }

//   setBoardDiff(boardDiff: number) {
//     this.boardDifficulty = boardDiff;
//   }

//   getBoardDiff() {
//     return this.boardDifficulty;
//   }

//   setBoardTheme(boardTheme: number) {
//     this.boardTheme = boardTheme;
//   }

//   getBoardTheme() {
//     return this.boardTheme;
//   }

//   setNumGuess(numGuess: number) {
//     this.numGuess = numGuess;
//   }

//   getNumGuess() {
//     return this.numGuess;
//   }
// }
