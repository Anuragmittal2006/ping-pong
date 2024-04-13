const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function adjustCanvasSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const canvasWidth = screenWidth * 0.8; // Set canvas width to 80% of screen width
    const canvasHeight = screenHeight * 0.8; // Set canvas height to 80% of screen height
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}

// Call the adjustCanvasSize function initially to set the canvas size
adjustCanvasSize();

// Add event listener to adjust canvas size when window is resized
window.addEventListener('resize', adjustCanvasSize);

// Rest of your existing code goes here...
const width = canvas.width; // Use canvas width instead of fixed width
const height = canvas.height; // Use canvas height instead of fixed height

const paddleWidth = 10;
const paddleHeight = 70;
const paddleSpeed = 5;
const ballSize = 10;
const ballSpeed = 5;

let player1Score = 0;
let player2Score = 0;

let ball = {
    x: width / 2,
    y: height / 2,
    dx: Math.random() < 0.5 ? ballSpeed : -ballSpeed,
    dy: Math.random() * 2 - 1 * ballSpeed
};

let player1 = {
    x: 10,
    y: height / 2 - paddleHeight / 2,
};

let player2 = {
    x: width - 20,
    y: height / 2 - paddleHeight / 2,
};

let vsAI = false; // Flag to indicate if playing vs AI

const keysPressed = {};

document.addEventListener('keydown', function (e) {
    keysPressed[e.key] = true;
});

document.addEventListener('keyup', function (e) {
    delete keysPressed[e.key];
});

let touchStartY = 0; // Variable to store the starting Y-coordinate of touch event

// Function to handle touch start event
function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

// Function to handle touch move event
function handleTouchMove(event) {
    event.preventDefault(); // Prevent scrolling

    const touchY = event.touches[0].clientY;
    const deltaY = touchY - touchStartY; // Calculate change in Y-coordinate

    // Determine swipe direction
    const sensitivity = 0.5; // Adjust sensitivity as needed
    const paddleSpeed = sensitivity * deltaY; // Scale deltaY to paddle speed

    // Player 1 controls (left paddle)
    if (paddleSpeed < 0 && player1.y > 0) {
        player1.targetY = player1.y + paddleSpeed;
    } else if (paddleSpeed > 0 && player1.y + paddleHeight < height) {
        player1.targetY = player1.y + paddleSpeed;
    }

    // Reset touchStartY for next touch event
    touchStartY = touchY;
}

// Add event listeners for touch events
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

document.getElementById('twoPlayers').addEventListener('click', function() {
    vsAI = false;
    resetGame();
});

document.getElementById('vsAI').addEventListener('click', function() {
    vsAI = true;
    resetGame();
});

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '36px Arial';
    ctx.fillText(text, x, y);
}

function handleControls() {
    // Player 1 controls
    if ('w' in keysPressed && player1.y > 0) {
        player1.y -= paddleSpeed;
    }
    if ('s' in keysPressed && player1.y + paddleHeight < height) {
        player1.y += paddleSpeed;
    }

    // Player 2 controls
    if (!vsAI) {
        if ('ArrowUp' in keysPressed && player2.y > 0) {
            player2.y -= paddleSpeed;
        }
        if ('ArrowDown' in keysPressed && player2.y + paddleHeight < height) {
            player2.y += paddleSpeed;
        }
    } else {
        // AI control for player 2
        if (ball.dx > 0) {
            if (player2.y + paddleHeight / 2 < ball.y) {
                player2.y += paddleSpeed;
            } else {
                player2.y -= paddleSpeed;
            }
        }
    }
}

function draw() {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#003366');
    gradient.addColorStop(1, '#336699');

    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawRect(player1.x, player1.y, paddleWidth, paddleHeight, '#fff');
    drawRect(player2.x, player2.y, paddleWidth, paddleHeight, '#fff');
    drawRect(ball.x, ball.y, ballSize, ballSize, '#fff');
    drawText(player1Score, width / 4, 50, '#fff');
    drawText(player2Score, width * 3 / 4, 50, '#fff');
}

function update() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ballSize >= height || ball.y <= 0) {
        ball.dy = -ball.dy;
    }

    if (ball.x + ballSize >= width) {
        player1Score++;
        resetBall();
    } else if (ball.x <= 0) {
        player2Score++;
        resetBall();
    }

    if (ball.x <= player1.x + paddleWidth && ball.y >= player1.y && ball.y <= player1.y + paddleHeight) {
        ball.dx = -ball.dx;
    }

    if (ball.x + ballSize >= player2.x && ball.y >= player2.y && ball.y <= player2.y + paddleHeight) {
        ball.dx = -ball.dx;
    }
}

function resetBall() {
    ball.x = width / 2;
    ball.y = height / 2;
    ball.dx = Math.random() < 0.5 ? ballSpeed : -ballSpeed;
    ball.dy = Math.random() * 2 - 1 * ballSpeed;
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    resetBall();
    player1.y = height / 2 - paddleHeight / 2;
    player2.y = height / 2 - paddleHeight / 2;
}

function gameLoop() {
    handleControls();
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Set canvas size
canvas.width = width;
canvas.height = height;

// Start the game loop
gameLoop();
