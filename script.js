const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//const words = ['hello', 'world'] // ,'games', 'plays', 'tests', 'hairy'];
let words = []; // stores the words from the words.txt file

// Get the words from the word file and store them in the words array:
fetch('words.txt').then(response => response.text()).then(text => {
    let wordsArray = text.split('\n');
    wordsArray.forEach(word => {
        words.push(word);
    });
});


// colours:
const greenOpacity = 'rgba(0, 255, 0, 0.5)'; // Green with opacity

// Colours ^^^^^^

// The game:
game = null; // stores the game object
// A class that creats a new game based on the words array:
class newGame {
    constructor() {
        this.word = words[Math.floor(Math.random() * words.length)];
        this.guesses = [];
        this.remainingGuess = 5;
        this.won = false;
        this.correctLetters = [0, 0, 0, 0, 0];
        this.incorrectLetters = [];
    }
}


// Check for keyboard inputs:
document.onkeyup = function(e) {
    let input = document.getElementById('input').value;
    if (game == null || game.won == true || game.remainingGuess == 0) {
        if (e.key == 'Enter' && !document.getElementById('play-button').disabled) startGame();
        return;
    }


    if (input.length > game.word.length) {
        input = input.substring(0, game.word.length);
        document.getElementById('input').value = input;
        return;
    }

    console.log(input);
    if (e.key == 'Enter') {
        guess();
        return;
    }  

    displayGuess(input);
}

// The large object:
const canvasDisplay = {
    canvas: document.createElement('canvas'),
    display: function() {
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvas.style.border = '1px solid black';
        this.canvas.style.backgroundColor = 'white';
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    },
    clear: function() {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    draw: function() {
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100, 400);
        ctx.lineTo(300, 400);
        ctx.lineTo(300, 100);
        ctx.lineTo(100, 100);
        ctx.stroke();
    }
}


// Within the divs, display 5 boxes equal size to each other inside the canvas:
function displayBoxes() {
    // clear the existing divs: 
    let div = document.getElementById('boxes'); // Get the div element
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    // And clear the text inside the input field:
    document.getElementById('input').value = '';

    // Create 5 divs and append them to the div element
    for (let i = 0; i < 5; i++) {
        let box = document.createElement('div');
        box.setAttribute('id', 'box' + i);
        box.style.width = '50px';
        box.style.height = '50px';
        box.style.border = '1px solid black';
        box.style.backgroundColor = 'white';
        box.style.boxShadow = 'none';
        div.style.color = 'black';
        box.style.display = 'flex';
        box.style.justifyContent = 'center';
        box.style.alignItems = 'center';
        box.style.margin = '1px';
        box.style.marginBottom = '10px';
        box.style.fontSize = '30px';
        
        div.appendChild(box);
    }
}


// Create a hangman game 
function startGame() {

    if (game != null) {
        console.log('Restarting game...');
        // Clear the guess boxes if there are any:
        let boxes = document.getElementById('guesses');
        while (boxes.firstChild) {
            boxes.removeChild(boxes.firstChild);
        }
        // Clear the incorrect letters if there are any:
        let div = document.getElementById('incorrect-letters');
        while (div.firstChild) {
            div.textContent = '';
        }
    }

    // Create a new game
    game = new newGame();

    // Disable the play button:
    document.getElementById('play-button').disabled = true;
    document.getElementById('play-button').className = 'disabled';

    // Calculate the score: It should be 0 initially
    calculateScore();

    // display the letter boxes
    displayBoxes();
}

// A method that processes the guess of the user and checks if the user has won or lost
function guess() {
    // if the user has not guessed anything yet then return
    if (game == null) return;

    let userGuess = document.getElementById('input').value; // Get the user's guess from the input

    if (userGuess.includes(" ") || userGuess.length != 5) {
        calculateScore();
        return;
    }


     if (userGuess != null) userGuess = userGuess.toLowerCase(); // Convert the guess to lowercase
     console.log(userGuess + " " + game.word);

    // Display the guesses
    displayGuessBoxes(userGuess);

    // Display the incorrect letters:
    displayIncorrectLetters();

    // If the word the user guessed is the correct word 
    if (userGuess === game.word && game.remainingGuess > 0) {
        console.log('You won!');
        game.won = true;
        gameWin();

    } 
    
    else {
        // If the user has guessed the wrong word then add the word to the guesses array and subtract one from the remaining guesses
        game.guesses.push(userGuess);
        game.remainingGuess -= 1;
        console.log('Wrong! You have ' + game.remainingGuess + ' guesses left.');

        // Clear the input field
        document.getElementById('input').value = '';
        // Clear the letters in the boxes
        for (let i = 0; i < 5; i++) {
            let box = document.getElementById('box' + i);
            box.innerHTML = '';
        }
    }

    // If the user has no more guesses left then the user has lost
    if (game.remainingGuess === 0) {
        console.log('You lost!');
        console.log('The word was ' + game.word);
        gameLoss();
    }

    // Calculate then display the score:
    calculateScore();
}



function gameWin() {
    if (game.won) {
        // Add a green glow around the div boxes:
        for (let i = 0; i < 5; i++) {
            let box = document.getElementById('box' + i);
            box.style.backgroundColor = 'green';
            box.style.boxShadow = '0px 0px 3px 3px green';
            box.style.backgroundColor = 'white';
        }

        // Display the correct word in all caps in boxes div:
        for (let i = 0; i < game.word.length; i++) {
            let box = document.getElementById('box' + i);
            box.style.font = '30px Arial';
            box.textContent = game.word.charAt(i).toUpperCase();
            box.style.color = 'green';
        }

        // Activate the play button again:
        document.getElementById('play-button').disabled = false;
        document.getElementById('play-button').className = 'enabled';
    }
}

function gameLoss() {
    if (!game.won) {
        for (let i = 0; i < 5; i++) {
            let box = document.getElementById('box' + i);
            box.style.backgroundColor = 'red';
            box.style.boxShadow = '0px 0px 3px 3px red';
            box.style.backgroundColor = 'white';
        }

        // Display the correct word in all caps in boxes div:
        for (let i = 0; i < game.word.length; i++) {
            let box = document.getElementById('box' + i);
            box.style.font = '30px Arial';
            //box.style.fontWeight = 'bold';
            box.textContent = game.word.charAt(i).toUpperCase();
            box.style.color = blackOpacity = 'rgba(0, 0, 0, 0.5)';
        }
    
        // Activate the play button again:
        document.getElementById('play-button').disabled = false;
        document.getElementById('play-button').className = 'enabled';
    }
}


// Display the letters that the user has guessed inside the 5 boxes:
function displayGuess(guess) {

    // Display the guesses inside the boxes
    for (let i = 0; i < 5; i++) {
        let includes = false;
        let box = document.getElementById('box' + i);

        for (let j = 0; j < game.guesses.length; j++) {
            if (game.guesses[j].includes(guess.charAt(i)) && !game.word.includes(guess.charAt(i))) {
                // Make the letter coloured in the box 
                box.style.color = 'red';
                box.textContent = guess.charAt(i);
                includes = true; // The letter has already been guessed 
            }
            else if (!includes) box.style.color = 'black';
        }
            
        box.textContent = guess.charAt(i);
    }
}


// Display the users guesses on the right side of the screen in boxes: each letter has its own box
// Add a div on each guess
// Put the guess inside the div
function displayGuessBoxes(guess) {
    let div = document.getElementById('guesses'); // Get the div element
    div.style.gridTemplateColumns = 'repeat(5, 50px)';
    div.style.rowGap = '5px';
    div.style.columnGap = '1px';
    div.style.color = 'black';

    // Create an array of the letters in the word and how many times they appear:
    let letterAndCount = [];  // For keeping track of the letters in the word, followed by how many times they appear
    for (let j = 0; j < 5; j++) {
        let count = 0; // For keeping track of how many times a letter appears in the word
        letterAndCount.push(game.word.charAt(j));
        for (let k = 0; k < 5; k++) {
            let index = letterAndCount.indexOf(game.word.charAt(j));
            let lastIndex = letterAndCount.lastIndexOf(game.word.charAt(j));

            if (game.word.charAt(j) === game.word.charAt(k)) {
                count++;
            }
        }
        letterAndCount.push(count); // Add the count to the array
    }
    console.log(letterAndCount);

    // Check if the user guessed the letter correctly and if there are duplicates in the word prior to the letter
    // then do not display yellow around the box of the duplicate letter:
    for (let i = 0; i < 5; i++) {
        if (guess.charAt(i) === game.word.charAt(i)) {
            letterAndCount[letterAndCount.indexOf(guess.charAt(i))+1]--;
        }
    }

    for (let i = 0; i < 5; i++) {
        let guessDiv = document.createElement('div' + game.guesses.length); // Create a new div
        
        // Display a colour based on if the user has guessed the correct letter or not:
        if (guess.charAt(i) === game.word.charAt(i)) {  
            // If the user has guessed the correct letter then display the letter in green
            guessDiv.style.backgroundColor = 'green';
            guessDiv.style.boxShadow = '0px 0px 3px 3px green';
            guessDiv.style.backgroundColor = 'white';

            // Keep track of the score
            if (game.correctLetters[i] === 0){  
                game.correctLetters[i] = 1;
            }   
        } 
        else {
            // If the user has guessed the wrong letter then display the letter normally
            guessDiv.style.backgroundColor = 'white';
            guessDiv.style.boxShadow = '0px 0px 3px 3px white';

            // Check if the user has guessed a letter that is somewhere else in the word
            for (let j = 0; j < game.word.length; j++) {

                if (guess.charAt(i) === game.word.charAt(j) && (letterAndCount.indexOf(guess.charAt(i)))+1 > 0) {
                    // If the user has guessed a letter that is somewhere else in the word then display the letter in yellow
                    guessDiv.style.backgroundColor = 'yellow';
                    guessDiv.style.boxShadow = '0px 0px 3px 3px yellow';
                    guessDiv.style.backgroundColor = 'white';
                    letterAndCount[letterAndCount.indexOf(guess.charAt(i))+1]--; // Remove a count of the letter from the array
                    console.log(letterAndCount);
                    break;
                }
            }  

            if (letterAndCount[letterAndCount.indexOf(guess.charAt(i))+1] < 0) { // If the letter has already been guessed then display it in white
                guessDiv.style.backgroundColor = 'white';
                guessDiv.style.boxShadow = '0px 0px 3px 3px white';
            }       
            
            // If the user has guessed a letter that is not in the word then display the letter in red on the right side of the screen
            if (!game.word.includes(guess.charAt(i)) && !game.incorrectLetters.includes(guess.charAt(i))) {
                game.incorrectLetters.push(guess.charAt(i)); // Add the letter to the incorrect letters array
            }
        }

        // After a colour is chosen, set the other attributes of the div:
        guessDiv.setAttribute('id', 'guess' + game.guesses.length);
        guessDiv.style.width = '50px';
        guessDiv.style.height = '50px';
        guessDiv.style.border = '1px solid black';
        guessDiv.style.display = 'flex';
        guessDiv.style.justifyContent = 'center';
        guessDiv.style.alignItems = 'center';
        guessDiv.style.margin = '1px';
        guessDiv.style.marginBottom = '10px';
        guessDiv.style.fontSize = '30px';
        guessDiv.textContent = guess.charAt(i);
        div.appendChild(guessDiv);
    }
}


// Clear the current guesses:
function clearGuesses() {
    let div = document.getElementById('guesses'); // Get the div element
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}


// Calculate the score:
function calculateScore() {
    let score = 0;
    for (let i = 0; i < game.correctLetters.length; i++) {
        if (game.correctLetters[i] === 1) score++;
    }
    displayScore(score); // Display the score
    return score;
}
// Display the amount of correct letters the user has guessed: and other info
function displayScore(score) {
    let div = document.getElementById('score');
    let userGuess = document.getElementById('input').value; // Get the user's guess from the input

    // If there are other conditions met then display other text with the score:
    let otherText = ""; // For displaying other text
    if (game.remainingGuess <= 0) otherText = "   - You Lose! The word was: " + game.word + ".";
    if (score === 5) otherText = "   - You Win!";

    else if (userGuess.includes(" ")) otherText = " - You cannot guess a space!";

    div.textContent = 'Score: ' + score + otherText;   // Display the score 
}


// Display incorrect letters in the right side of the screen:
function displayIncorrectLetters() {
    let div = document.getElementById('incorrect-letters'); // Get the div element

    console.log("Incorrect Letters: " + game.incorrectLetters);

    // Add the incorrect letters to the div:
    let newLetters = div.textContent;
    for (let i = 0; i < game.incorrectLetters.length; i++) {
        console.log("Incorrect Letter: " + game.incorrectLetters[i], i);
        if (!div.textContent.includes(game.incorrectLetters[i]) && game.incorrectLetters[i] != undefined) newLetters += game.incorrectLetters[i] + " ";
    }
    div.textContent = newLetters;

    // Sort the letters in the div alphabetically:
    let letters = div.textContent.split(" ");
    letters.sort();
    div.textContent = "";
    for (let i = 0; i < letters.length; i++) {
        div.textContent += letters[i] + " ";
    }
}


// Button disabled:
function disabled(button) {
    button.disabled = true;
}

function enabled(button) {
    button.disabled = false;
}


