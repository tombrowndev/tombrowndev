(function(){

	// Constants
	const cardArea = document.getElementById('cardArea');
	const startGameButton = document.getElementById('startGame');
	const closeButton = document.getElementById('closeModal');
	const mask = document.getElementById('mask');
	const model = document.getElementById('finishedGameModal');
	const gameMessage = document.getElementById('gameMessage');
	const timer = document.getElementById('timer');

	// Game variables
	let tempCard = null;
	let startTime = 0;
	let cardFlips = 0;
	let matchCount = 0;
	let myTimer;

	// Event Listeners
	startGameButton.addEventListener('click', newGame);
	cardArea.addEventListener('click', turnCard);
	closeButton.addEventListener('click', closeModal);
	closeButton.addEventListener('click', newGame);

	// Clears any existing game and starts a new game
	function newGame(e) {

		// Stop button click from redirecting
		e.preventDefault();

		// Add instruction message
		gameMessage.innerText = 'Please click on a card to start...';

		// Reset game variables
		cardFlips = 0;
		matchCount = 0;
		tempCard = null;

		// Start the clock
		startTime = getTheTime();
		updateTimer();
		myTimer = setInterval(updateTimer, 1000);

		// Remove cards from previous game
		while (cardArea.firstChild) {
	    	cardArea.removeChild(cardArea.firstChild);
		}

		// Fade in the game board if not visible
		let gameBoard = document.getElementById('gameBoard');
		$(gameBoard).fadeIn();

		// Temporary holder for card elements
		let newCards = document.createDocumentFragment();

		for(let i = 0; i < 16; i++) {

			// Create a match number for each item e.g. 1,1,2,2,3,3
			let matchNumber = Math.ceil((i + 1) / 2);

			// Create card element
			let card = document.createElement('div');
			card.classList.add('card');
			card.setAttribute('data-match', matchNumber);

			// Create card top (Back of the card)
			let front = document.createElement('div');
    		front.classList.add('front');
    		front.style.display = 'none';

    		// Create card bottom (Front of the card with the picture)
    		let back = document.createElement('div');
    		back.classList.add('back');
    		back.style.backgroundImage = `url('public/images/cards/${matchNumber}.png')`;

    		// Append the card top and bottom to the card
    		card.appendChild(front);
    		card.appendChild(back);

    		// Append the new card to the temporary card holder
    		newCards.appendChild(card);

		}

		// Shuffle the cards
		shuffleChildren(newCards);

		// Add the new cards to the DOM card area
		cardArea.appendChild(newCards);

		// Add the flip animation event to the new cards
		$('.card').flip({'trigger' : 'manual'});

		// Fade the cards in one by one
	  	for(let j = 0; j < cardArea.children.length; j++) {

	  		// Set length of delay for card fade in
	  		let delay = j * 40;

	  		// Fade in the card
	  		setTimeout(function(){
	  			$(cardArea).children().eq(j).children('.front').fadeIn();
	  		}, delay);

	  	}

	}

	// Shuffles the children of a parent DocumentFragment
	function shuffleChildren(parent) {

		for(let i = parent.children.length; i >= 0; i--) {
	  		parent.appendChild(parent.children[Math.random() * i | 0]);
	  	}

	}

	// Process a card click
	function turnCard(e) {

		// Check if the target was a card top, do nothing if it isn't
		if(!e.target.classList.contains('front')) return;

		// Add initial message on first card flip
		if(matchCount === 0) {
			gameMessage.innerText = `You've found 0 out of 8 pairs captain!`;

		}

		// Store the card element and value that belongs to this card top
		let thisCard = e.target.parentElement;
		let thisValue = thisCard.getAttribute('data-match');

		// These will hold the previous card and values if they exist
		let prevCard;
		let prevValue;

		// Increment card flip count
		cardFlips++;

		// Check if this is a first card flip
		if(tempCard === null) {

			// Store this card for comparison to future second card
			tempCard = thisCard;


		} else {

			// Retrieve the first card
			prevCard = tempCard;
			prevValue = tempCard.getAttribute('data-match');

			// Remove the temporary card asap for responsivness
			tempCard = null;

		}

		// Flip the card
		$(thisCard).flip(true, function(){

			// Check if this is the second card
			if(typeof prevCard !== 'undefined') {
				
				// If the match values match
				if(prevValue === thisValue) {

					// Increment the match counter
					matchCount++;

					// Update the game message
					gameMessage.innerText = `You've found ${matchCount} out of 8 pairs captain!`;

					if(matchCount == 8) {

						// Stop the timer
						clearInterval(myTimer);

						// Finish the game
						finishGame();

					}

					// Blinking effect on card match
					$(thisCard).effect('pulsate');
					$(prevCard).effect('pulsate');

					// Do nothing
					return;

				} else {

					// Shake and Flip this card back
					$(thisCard).effect({
						effect: 'shake',
						complete: function(){
							setTimeout(function(){
								$(thisCard).flip(false);
							}, 500);
						}
					});

					// Shake and Flip the previous card back
					$(prevCard).effect({
						effect: 'shake',
						complete: function(){
							setTimeout(function(){
								$(prevCard).flip(false);
							}, 500);
						}
					});

				}

			}


		});

	}


	// Returns the current time in miliseconds
	function getTheTime() {

		let d = new Date();
		return d.getTime();

	}

	// Updates the clock with the game time
	function updateTimer() {

		// Work out how many seconds the game has lasted so far
		let distance = Math.floor((getTheTime() - startTime));

		let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  		let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  		let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  		// Display to the player
  		timer.innerText = `Time elapsed: ${hours}h ${minutes}m ${seconds}s`;

	}


	// Makes the modal popup with game statistics
	function finishGame() {

		// Work out how many seconds the game lasted
		let totalSeconds = Math.floor((getTheTime() - startTime) / 1000);

		// Generate a score
		let score = Math.floor(totalSeconds / 10) + cardFlips;

		// Generate a star rating
		// 
		// 1 - 31		3 Star
		// 32 - 44		2 Stars
		// 45+			1 Star
		let stars;

		if(score >= 45) {
			stars = 1;
		} else if (score < 45 && score >= 32) {
			stars = 2;
		} else if (score < 32) {
			stars = 3;
		}

		// Add statistics to the popup
		document.getElementById('numberOfFlips').innerText = `${cardFlips} flips`;
		document.getElementById('timeTaken').innerText = `${totalSeconds} seconds`;
		document.getElementById('finalScore').innerText = `${score} points`;
		document.getElementById('finalStars').innerText = `${stars} stars`;

		// Fade in the modal window and mask
		$(mask).fadeIn();
		$(model).fadeIn();

	}

	function closeModal() {

		// Hide the modal and mask
		$(mask).fadeOut();
		$(model).fadeOut();

	}
	

})();