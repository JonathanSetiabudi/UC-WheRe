"use client";

import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import Messages from "./messages/page";
import Image from "next/image";
import Scotty from "../../public/assets/bear.svg";
import Norm from "../../public/assets/norm.svg";
import Game from "../app/game/page";
import Lobby from "./Lobby/page";
import Location from "./objects/Location";

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
  "/images/AI_BUILDINGS.JPG",
  "/images/DUNDEE_B.JPG",
  "/images/PENTLANDHILLS.JPG",
  "/images/GLENMOR.JPG",
  "/images/NORTHDISTRICT.JPG",
  "/images/BANNOCKBURN_SIGN.JPG",
  "/images/INTERNATIONALVILLAGE.JPG",
  "/images/GLASGOW.JPG",
  "/images/LOTHIAN_RESTAURANT.JPG",
  "/images/GLENMOR_POOL.JPG",
  "/images/DUNDEE_STUDYROOM.JPG",
  "/images/AI_LOUNGE.JPG",
  "/images/WEST_LO.JPG",
  "/images/DUNDEE_A.JPG",
  "/images/DUNDEEGYM.JPG",
  "/images/EASTLO_LAWN.JPG",
  "/images/SCOTTYS_GLENMOR.JPG",
  "/images/NIGHTHUB.JPG",
  "/images/THEBARN_DAYTIME.JPG",
  "/images/HABIT.JPG",
  "/images/COFFEEBEAN.JPG",
  "/images/GETAWAYCAFE.JPG",
  "/images/ASPB_SCOTTYS.JPG",
  "/images/SCOTTYS_GLASGOW.JPG",
  "/images/BYTES.JPG",
  "/images/EMERBEES.JPG",
  "/images/IVANS.JPG",
  "/images/NOODS.JPG",
  "/images/SCOTTY_STATUE.JPG",
  "/images/BELLTOWER.JPG",
  "/images/BARNES_AND_NOBLE.JPG",
  "/images/SRC.JPG",
  "/images/UCRSIGN.JPG",
  "/images/MRB.JPG",
  "/images/POLICE_DEPARTMENT.JPG",
  "/images/BOURNES_HALL.JPG",
  "/images/HUMSS.JPG",
  "/images/SSC.JPG",
  "/images/CHASS_N.JPG",
  "/images/CHASS_S.JPG",
  "/images/ARTS_BUILDING.JPG",
  "/images/UNI_THEATRE.JPG",
  "/images/UNIVERSITYLECTUREHALL.JPG",
  "/images/PIERCE_HALL.JPG",
  "/images/SKYE_HALL.JPG",
  "/images/CAREER_CENTER.JPG",
  "/images/AI_BOWL.JPG",
  "/images/STATISTICS.JPG",
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

const initialCards: Location[] = [];
// initialize gameCards
for (let i = 0; i < 16; i++) {
  const card = new Location(
    locationNames[i],
    descriptions[i],
    filePaths[i],
    "Residential and Dining",
  );
  initialCards.push(card);
}

export default function Home() {
  socket.connect();

  //react states for username and room
  const [gameBoard, setGameBoard] = useState(initialCards);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showLobby, setShowLobby] = useState<boolean>(false);
  const [showGame, setShowGame] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [lobbyIsFull, setLobbyIsFull] = useState<boolean>(false);
  const [lobbyNotExistent, setLobbyNotExistent] = useState<boolean>(false);
  const [isEmptyUsername, setIsEmptyUsername] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  // const [gridSize, setGridSize] = useState<number>(16);
  // const [numGuesses, setNumGuesses] = useState<number>(1);
  useEffect(() => {
    socket.connect();

    socket.on("createdLobby", (data) => {
      setRoom(data);
      setIsHost(true);
    });

    socket.on("joinedLobby", (data) => {
      setRoom(data);
      setShowLobby(true);
      setLobbyIsFull(true);
    });

    socket.on("hostLeft", () => {
      leave();
    });

    socket.on("guestLeftMidGame", () => {
      leave();
    });

    socket.on("triedJoinFullLobby", () => {
      setShowErrorModal(true);
      // setLobbyIsFull(true);
    });

    socket.on("triedJoinNonExistentLobby", () => {
      setShowErrorModal(true);
      setLobbyNotExistent(true);
    });

    socket.on("successStartGame", () => {
      setShowGame(true);
    });

    socket.on("failStartGame", () => {
      setShowErrorModal(true);
    });

    socket.on("updateGameBoard", (data) => {
      setGameBoard(data);
    });

    return () => {
      setLobbyIsFull(false);

      socket.emit("leave", room);

      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // @ts-expect-error - TS complains about the type of e, but don't worry about it
  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // @ts-expect-error - TS complains about the type of e, but don't worry about it
  const onRoomChange = (e) => {
    setRoom(e.target.value.toUpperCase());
  };

  const joinLobby = () => {
    if (username.trim() !== "" && room !== "") {
      socket.emit("join_lobby", room);
    } else if (username.trim() === "") {
      setIsEmptyUsername(true);
      setShowErrorModal(true);
    }
  };

  const createLobby = () => {
    if (username.trim() === "") {
      setIsEmptyUsername(true);
      setShowErrorModal(true);
    } else {
      socket.emit("create_lobby", gameBoard);
      setShowLobby(true);
    }
  };

  const doStartGame = () => {
    socket.emit("tryStartGame", room);
  };

  // leave modal caused by homepage errors
  const leaveError = () => {
    setShowErrorModal(false);
    // setRoom(null);
    // setLobbyIsFull(false);
    setLobbyNotExistent(false);
    setIsEmptyUsername(false);
  };

  const leave = () => {
    setIsHost(false);
    setShowLobby(false);
    setShowGame(false);
    socket.emit("leave", room);
  };

  const buttonPerms = (checkIfHost: boolean) => {
    return checkIfHost
      ? "text-black hover:bg-blue-200"
      : "text-gray-400 cursor-not-allowed";
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#FFF8D2";
  }, []);

  return (
    <div className="Home">
      {!showLobby ? (
        <div className="flex flex-col items-center font-jersey">
          <div className="mb-7 text-center text-7xl text-ucwhere-blue">
            UC WheRe?
            <br />
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            data-test="new-tab-button"
          >
            New Tab for Testing
          </a>
          <br />
          <input
            className="mb-1 rounded-md p-2 text-black"
            type="text"
            placeholder="Username"
            onChange={onUsernameChange}
            data-test="username-input"
          />

          <button
            className="mb-5 text-xl text-ucwhere-light-blue enabled:hover:text-ucwhere-blue"
            onClick={createLobby}
          >
            Create a Lobby
          </button>
          <input
            className="mb-1 rounded-md p-2 text-black"
            type="text"
            placeholder="Enter Lobby ID"
            onChange={onRoomChange}
            data-test="lobby-input"
          />

          <button
            className="mb-3 text-xl text-ucwhere-light-blue enabled:hover:text-ucwhere-blue"
            data-test="join-lobby-button"
            onClick={joinLobby}
          >
            Join a Lobby
          </button>
          <div className="grid grid-cols-2 gap-5 p-10">
            <Image src={Scotty} width="230" height="230" alt="Scotty" />
            <Image src={Norm} width="200" height="200" alt="norm" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-5 font-jersey text-white">
          <div className="rounded-lg bg-ucwhere-orange p-2 text-2xl">
            Room: {room}
          </div>
          <a
            href="http://localhost:3000"
            target="_blank"
            data-test="new-tab-button"
          >
            New Tab for Testing
          </a>
          {showGame ? (
            <div>
              <Messages
                data-test="messaging-component"
                username={username}
                room={room}
                isHost={isHost}
              />
              <Game room={room} gameBoard={gameBoard} />
            </div>
          ) : (
            <div>
              <Lobby room={room} isHost={isHost} />

              <br></br>

              <button
                className="m-2 rounded-md bg-ucwhere-red p-2 text-2xl text-ucwhere-light-blue text-white hover:bg-rose-500"
                data-test="leave-button"
                onClick={leave}
              >
                Leave
              </button>

              {/* <br></br> */}

              <button
                className={`${buttonPerms(isHost)} rounded-md bg-ucwhere-green p-2 text-2xl text-white hover:bg-emerald-500`}
                disabled={!isHost}
                onClick={doStartGame}
              >
                Start Game
              </button>
            </div>
          )}
        </div>
      )}

      {showErrorModal && (
        <div
          className="rounded-lg border-2 border-gray-700 bg-ucwhere-blue p-6 font-jersey text-lg text-gray-800 text-white"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {lobbyIsFull && <p>Lobby you are attempting to join is full.</p>}
          {lobbyNotExistent && (
            <p>Lobby you are attempting to join is non-existent.</p>
          )}
          {isEmptyUsername && <p>You must input a username to play.</p>}
          {showLobby && !lobbyIsFull && (
            <p>Not enough players to start game.</p>
          )}

          <div>
            <button
              className="mt-2 rounded-lg bg-ucwhere-red px-3 py-1 text-white hover:bg-rose-500"
              onClick={leaveError}
              style={
                {
                  // padding: "10px 20px",
                  // backgroundColor: "#32426d",
                  // border: "1px solid black",
                  // borderRadius: "5px",
                }
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
