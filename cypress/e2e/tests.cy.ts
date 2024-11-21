describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Home page contains everything correct", () => {
    cy.getDataTest("username-input").should("exist");
    cy.getDataTest("create-lobby-button").should("exist");
    cy.getDataTest("lobby-input").should("exist");
    cy.getDataTest("join-lobby-button").should("exist");
  });
});

describe("LobbyCreationAndChat", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Creating a lobby and joining it and sending messages", () => {
    cy.getDataTest("username-input").type("test");
    cy.getDataTest("create-lobby-button").click();
    cy.getDataTest("room-code").should("contain.text", "Room:");
    cy.getDataTest("message-log-header").should("exist");
    cy.getDataTest("message-input").type("Testing123");
    cy.getDataTest("send-message-button").click();
    cy.get("form").should("contain.text", "test:Testing123");
    cy.getDataTest("message-input").type("CS100");
    cy.getDataTest("send-message-button").click();
    cy.get("form").should("contain.text", "test:CS100");
  });
  it("Creating a lobby and joining it and leaving it", () => {
    cy.getDataTest("username-input").type("test");
    cy.getDataTest("create-lobby-button").click();
    cy.getDataTest("room-code").should("contain.text", "Room:");
    cy.getDataTest("message-log-header").should("exist");
    cy.getDataTest("leave-button").click();
    cy.getDataTest("username-input").should("exist");
    cy.getDataTest("create-lobby-button").should("exist");
    cy.getDataTest("lobby-input").should("exist");
    cy.getDataTest("join-lobby-button").should("exist");
    cy.getDataTest("room-code").should("not.exist");
    cy.getDataTest("message-log-header").should("not.exist");
  });
  it("Creating a lobby and joining it and leaving it then creating a new lobby", () => {
    cy.getDataTest("username-input").type("test");
    cy.getDataTest("create-lobby-button").click();
    cy.getDataTest("room-code").should("contain.text", "Room:");
    cy.getDataTest("message-log-header").should("exist");
    cy.getDataTest("leave-button").click();
    cy.getDataTest("username-input").should("exist");
    cy.getDataTest("create-lobby-button").should("exist");
    cy.getDataTest("lobby-input").should("exist");
    cy.getDataTest("join-lobby-button").should("exist");
    cy.getDataTest("username-input").type("test");
    cy.getDataTest("create-lobby-button").click();
    cy.getDataTest("room-code").should("contain.text", "Room:");
    cy.getDataTest("message-log-header").should("exist");
  });
  it("Joining a lobby and receiving a message", () => {
    cy.getDataTest("username-input").type("Receiver");
    cy.getDataTest("lobby-input").type("test");
    cy.getDataTest("join-lobby-button").click();
    cy.getDataTest("room-code").should("contain.text", "Room:TEST");
    cy.getDataTest("message-log-header").should("exist");
    cy.getDataTest("new-tab-button").click();

    cy.wait(10000);
    //Manually inputting the message "Hello!" in the new tab
    //Because Cypress puppeteer wants to be a little bitch
    cy.get("form").should("contain.text", "Tester:Hello!");
  });
  it("Joining an already full lobby", (done) => {
    //open the new tabs to manually join the 'TEST' lobby
    cy.getDataTest("new-tab-button").click();
    cy.getDataTest("new-tab-button").click();
    cy.wait(20000);

    cy.getDataTest("username-input").type("Audeze");
    cy.getDataTest("lobby-input").type("test");
    cy.getDataTest("join-lobby-button").click();

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.equal("Lobby is full");
      done();
    });
  });

  it.only("Joining a non-existant lobby", (done) => {
    cy.getDataTest("username-input").type("Audeze");
    cy.getDataTest("lobby-input").type("lmao");
    cy.getDataTest("join-lobby-button").click();

    cy.on("window:alert", (alertText) => {
      expect(alertText).to.equal("Lobby does not exist");
      done();
    });
  });
});
