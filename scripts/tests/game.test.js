const { game, newGame, showScore, addTurn, lightsOn, showTurn, playerTurn } = require("../game");

jest.spyOn(window, "alert").mockImplementation(() => {});

beforeAll(() => {
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("game object contains correct keys", () => {
    test("score key exist", () => {
        expect("score" in game).toBe(true);
    });
    test("currentGame key exist", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exist", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choises key exist", () => {
        expect("choises" in game).toBe(true);
    });
    test("choises contains corrects ids", () => {
        expect(game.choises).toEqual(["button1", "button2", "button3", "button4"]);
    });
    test("turnNumber keys exist", () => {
        expect("turnNumber" in game).toBe(true);
    });
    test("lastButton key exist", () => {
        expect("lastButton" in game).toBe(true);
    });
    test("turnInProgress key exist", () => {
        expect("turnInProgress" in game).toBe(true);
    });
});

describe("newGame works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ["button1", "button2"];
        game.currentGame = ["button1", "button2"];
        game.showScore = "42";
        newGame();
    });
    test("should set game score to zero", () => {
        expect(game.score).toEqual(0);
    });
    test("should add one move in the computers game array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    test("should clear the player moves array", () => {
        expect(game.playerMoves.length).toBe(0);
    });
    test("should display 0 for score", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    });
    test("data listener attribute set to true", () => {
        const elements = document.getElementsByClassName("circle");
        for(let element of elements) {
            expect(element.getAttribute("data-listener")).toEqual("true");
        }
    });
});

describe("gameplay works corretly", () => {
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add a correct clas to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurn should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurn();
        expect(game.turnNumber).toBe(0);
    });
    test("should increment the score if turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test("should call an alert if the move is wrong", () => {
        game.playerMoves.push("wrong");
        playerTurn();
        expect(window.alert).toBeCalledWith("Wrong move!");
    });
    test("should toggle turnInProgress to be true", () => {
        showTurn();
        expect(game.turnInProgress).toBe(true);
    });
    test("clicking during the computer sequence should fail", () => {
        showTurn();
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
});

