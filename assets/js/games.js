// function detectDeviceType() {
//   const userAgent = navigator.userAgent.toLowerCase();
//   if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
//     return "mobile";
//   } else {
//     return "desktop";
//   }
// }

// function showResizePopup() {
//   const popup = document.createElement("div");
//   popup.id = "resize-popup";
//   popup.style.position = "fixed";
//   popup.style.top = "50%";
//   popup.style.left = "50%";
//   popup.style.transform = "translate(-50%, -50%)";
//   popup.style.padding = "20px";
//   popup.style.backgroundColor = "rgba(255, 255, 255, 0)";
//   popup.style.color = "white";
//   popup.style.borderRadius = "10px";
//   popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
//   popup.style.zIndex = "1000";
//   popup.innerText = "Please note: Resizing the window may affect the layout.";

//   const closeButton = document.createElement("button");
//   closeButton.innerText = "Close";
//   closeButton.style.marginTop = "10px";
//   closeButton.style.padding = "5px 10px";
//   closeButton.style.border = "none";
//   closeButton.style.borderRadius = "5px";
//   closeButton.style.backgroundColor = "#f44336";
//   closeButton.style.color = "white";
//   closeButton.style.cursor = "pointer";

//   closeButton.addEventListener("click", () => {
//     popup.remove();
//   });

//   popup.appendChild(closeButton);
//   document.body.appendChild(popup);
// }

// if (detectDeviceType() === "desktop") {
//   window.addEventListener("resize", () => {
//     showResizePopup();
//   });
// } else {
//   showResizePopup();
// }

// if (detectDeviceType() === "desktop") {
//   window.addEventListener("resize", () => {
//     if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
//       console.log("User is in fullscreen mode.");
//     } else {
//       console.log("User is not in fullscreen mode.");
//     }
//   });
// }

// console.log("Device Type:", detectDeviceType());

// if (detectDeviceType() === "mobile") {
//   document.body.classList.add("mobile");
// }

let currentPopup = 1;

try {
  if (localStorage.getItem('visitedMinijeux') === 'true') {
    currentPopup = 6;
  } else {
    currentPopup = 1; // Set to the initial popup
    localStorage.setItem('visitedMinijeux', 'true'); // Mark as visited
  }
} catch (e) {
  console.warn('localStorage non accessible:', e);
  currentPopup = 1; // Fallback to initial popup
}
showPopup(currentPopup); // Call showPopup after determining currentPopup

function showPopup(popupNumber) {
  const popups = Array.from({ length: 6 }, (_, i) => document.getElementById(`popup${i + 1}`));
  const canvasMap = {
    2: 'burger-container',
    3: 'shooter-container',
    4: 'runner-container',
    5: 'pong-container',
  };

  const gifMap = {
    'burger-container': 'assets/minijeux/burgerV1.gif',
    'shooter-container': 'assets/minijeux/shooterV1.gif',
    'runner-container': 'assets/minijeux/runnerV1.gif',
    'pong-container': 'assets/minijeux/pongV1.gif',
  };

  // Hide all popups and remove highlights
  popups.forEach((popup, index) => {
    if (popup) popup.classList.add('d-none');
    const canvasId = canvasMap[index + 1];
    if (canvasId) {
      const canvasElement = document.getElementById(canvasId);
      canvasElement?.classList.remove('highlight');
      if (canvasId in gifMap) {
        const gif = canvasElement.querySelector('.game-gif');
        if (gif) gif.remove(); // Remove the gif if it exists
      }
    }
  });

  // Show the specified popup
  const targetPopup = document.getElementById(`popup${popupNumber}`);
  if (targetPopup) targetPopup.classList.remove('d-none');

  // Highlight the corresponding canvas
  const canvasToHighlight = canvasMap[popupNumber];
  if (canvasToHighlight) {
    const canvasElement = document.getElementById(canvasToHighlight);
    canvasElement?.classList.add('highlight');
    if (canvasToHighlight in gifMap) {
      const gif = document.createElement('img');
      gif.src = gifMap[canvasToHighlight];
      gif.alt = `${canvasToHighlight} Animation`;
      gif.classList.add('game-gif');
      gif.style.position = 'absolute';
      gif.style.top = '50%';
      gif.style.left = '50%';
      gif.style.transform = 'translate(-50%, -50%)';
      gif.style.zIndex = '10';
      canvasElement.appendChild(gif);
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "Enter") {
    e.preventDefault(); // Prevent default behavior for space and enter keys
    currentPopup = currentPopup < 6 ? currentPopup + 1 : 1; // Cycle through six popups
    showPopup(currentPopup);
  }
});

function syncCheckboxes(id) {
  const isOverlay = id.includes('-overlay');
  const mainId = isOverlay ? id.replace('-overlay', '') : `${id}-overlay`;
  const sourceCheckbox = document.getElementById(id);
  const targetCheckbox = document.getElementById(mainId);
  if (sourceCheckbox && targetCheckbox) {
    targetCheckbox.checked = sourceCheckbox.checked;
  }
  }

  window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
  });

// Adjust game sizes to canvas sizes
function adaptGameSizes() {
  const canvases = document.querySelectorAll("canvas");
  canvases.forEach(canvas => {
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;

    // Set canvas size based on parent container size
    canvas.width = parent.offsetWidth * 0.9; // 90% of parent width
    canvas.height = parent.offsetHeight * 0.8; // 80% of parent height

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to apply new sizes
  });
}

window.addEventListener("resize", adaptGameSizes);
adaptGameSizes(); // Initial call to set sizes
function setupToggles() {
    const games = ['pong', 'shooter', 'runner', 'burger'];
    games.forEach(game => {
      const checkbox = document.getElementById(`${game}-toggle`);
      const container = document.getElementById(`${game}-container`);
      checkbox.addEventListener('change', () => {
        container.classList.toggle('disabled', !checkbox.checked);
      });
    });
  }
  
  function getDifficulty() {
    const difficultyRadios = document.getElementsByName('difficulty');
    for (const radio of difficultyRadios) {
      if (radio.checked) {
        if (radio.id === 'easy-mode') return 1;
        if (radio.id === 'normal-mode') return 2;
        if (radio.id === 'hard-mode') return 3;
      }
    }
    console.warn("No difficulty selected, defaulting to easy.");
    return 1; // Default difficulty level (easy)
  }

  function closeTutorial() {
    document.getElementById('tutorialOverlay').classList.add('hidden');
    getDifficulty(); // Call getDifficulty() to set the initial difficulty
    const difficulty = getDifficulty();
    const includePong = document.getElementById("pong-toggle-overlay");
    const includeShooter = document.getElementById("shooter-toggle-overlay");
    const includeRunner = document.getElementById("runner-toggle-overlay");
    const includeBurger = document.getElementById("burger-toggle-overlay");
    setupToggles();
    startPong(difficulty, includePong.checked);
    startShooter(difficulty, includeShooter.checked);
    startRunner(difficulty, includeRunner.checked);
    startBurger(difficulty, includeBurger.checked);
    startBonus(); // Initialize the bonus game
    startScoreboard(); // Initialize the scoreboard
    adaptGameSizes(); // Call to adjust game sizes after tutorial
    window.showPopup = () => {
    };
  }
 
  // === PONG ===
  function startPong(difficulty, includePong) {
    const canvas = document.getElementById("pong");
    const ctx = canvas.getContext("2d");
    let paddleY = canvas.height / 2 - 50; // Initial paddle size increased
    let paddleHeight = 100; // Initial paddle height
    const paddleWidth = 10;
    const ballRadius = 5;

    let balls = [
      {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4,
        dy: difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4,
      },
    ];

    let paddleSpeed = 0; // Paddle velocity
    const maxPaddleSpeed = 20; // Increased maximum speed for paddle movement
    const paddleAcceleration = 3; // Increased acceleration for faster response
    const paddleFriction = 0.02; // Reduced friction for smoother movement

    let lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2; // Adjust lives based on difficulty
    let collisionCooldown = false; // Cooldown flag for paddle collision
    let gameOver = false; // Game over flag
    let gameRunning = true; // Flag to track if the game is running
    const pongToggle = document.getElementById("pong-toggle");

    let currentStreak = 0; // Counter for current streak
    let personalBest = 0; // Counter for personal best streak
    let elapsedTime = 0; // Track elapsed time for spawning new balls

    function resetGame() {
      paddleY = canvas.height / 2 - 50;
      paddleHeight = 100;
      balls = [
        {
          x: canvas.width / 2,
          y: canvas.height / 2,
          dx: difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4,
          dy: difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4,
        },
      ];
      paddleSpeed = 0;
      lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2; // Reset lives based on difficulty
      currentStreak = 0; // Reset current streak
      elapsedTime = 0; // Reset elapsed time
      if (gameOver || !gameRunning) {
        personalBest = 0; // Reset personal best streak only when the game is over or not running
      }
      gameOver = false;
    }

    function drawBackground() {
      // Draw court background with textured wooden floor
      const woodColors = ["#D2B48C", "#C19A6B", "#A67B5B"]; // Different shades of brown for wood texture
      const plankWidth = 20; // Width of each plank

      for (let x = 0; x < canvas.width; x += plankWidth) {
        ctx.fillStyle = woodColors[x / plankWidth % woodColors.length]; // Alternate wood colors
        ctx.fillRect(x, 0, plankWidth, canvas.height);
      }

      // Add plank lines for texture
      ctx.strokeStyle = "black"; // Red for plank lines
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += plankWidth) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw outer boundary
      ctx.strokeStyle = "red"; // Red for outer boundary
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Draw goal areas
      const goalAreaWidth = 60;
      const goalAreaHeight = canvas.height / 3;
      ctx.lineWidth = 2;

      // Draw large goal half-circles
      const goalCircleRadius = goalAreaHeight / 2;

      // Right goal half-circle (mirrored vertically)
      ctx.beginPath();
      ctx.arc(canvas.width - goalAreaWidth, canvas.height / 2, goalCircleRadius, Math.PI / 2, Math.PI * 1.5);
      ctx.stroke();

      // Left goal half-circle (mirrored vertically)
      ctx.beginPath();
      ctx.arc(goalAreaWidth, canvas.height / 2, goalCircleRadius, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      // Right goal area (rectangle, mirrored vertically)
      ctx.strokeRect(canvas.width - goalAreaWidth, canvas.height / 2 - goalAreaHeight / 2, goalAreaWidth, goalAreaHeight);

      // Left goal area (rectangle, mirrored vertically)
      ctx.strokeRect(0, canvas.height / 2 - goalAreaHeight / 2, goalAreaWidth, goalAreaHeight);

      // Draw center line
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Draw center circle
      const centerCircleRadius = 40;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, centerCircleRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    function pulsePong() {
      canvas.style.transition = "transform 0.2s ease";
      canvas.style.transform = "scale(1.05)";
    
      setTimeout(() => {
        canvas.style.transform = "scale(1)";
      }, 200);
    }
    
    function draw() {
      if (!gameRunning) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (gameOver) {
        pulsePong(); // Pulse effect on game over
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gameOverImage = new Image();
        gameOverImage.src = "assets/minijeux/multiman-ko.png"; // Path to the image
        gameOverImage.onload = () => {
          const imgWidth = 304.5; // Set desired width
          const imgHeight = 228; // Set desired height
          const centerX = (canvas.width - imgWidth) / 2;
          const centerY = (canvas.height - imgHeight) / 2;
          ctx.drawImage(gameOverImage, centerX, centerY, imgWidth, imgHeight);
        };
        canvas.classList.add("disabled"); // Add disabled class to canvas
        pongToggle.checked = false; // Set the checkbox to false
        gameRunning = false; // Stop the game loop
        window.updateScore("pong", personalBest); // Send personalBest to scoreboard
        setTimeout(() => {
          draw();
        }, 5000);
        return;
      }

      drawBackground();

      // Draw lives counter
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText(`Lives: ${lives}`, canvas.width - 80, 20);

      // Draw paddle
      ctx.fillStyle = "black";
      ctx.fillRect(10, paddleY, paddleWidth, paddleHeight);

      // Draw and move balls
      balls.forEach((ball, index) => {
        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top and bottom walls
        if (ball.y - ballRadius <= 0 || ball.y + ballRadius >= canvas.height) {
          ball.dy = -ball.dy;
        }

        // Ball collision with paddle
        if (
          ball.x - ballRadius <= 10 + paddleWidth &&
          ball.y >= paddleY &&
          ball.y <= paddleY + paddleHeight &&
          !collisionCooldown
        ) {
          ball.dx = -ball.dx;

          // Reduce paddle height by 1px on each end
          if (paddleHeight > 10) {
            paddleHeight -= 2;
            paddleY += 1; // Adjust position to keep paddle centered
          }

          collisionCooldown = true; // Activate cooldown
          setTimeout(() => (collisionCooldown = false), 50); // Reset cooldown after 50ms
        }

        // Ball collision with right wall
        if (ball.x + ballRadius >= canvas.width) {
          ball.dx = -ball.dx;
          currentStreak++; // Increment current streak
          personalBest = Math.max(personalBest, currentStreak); // Update personal best streak
        }

        // Ball out of bounds (lose life)
        if (ball.x - ballRadius <= 0) {
          lives -= 1; // Decrease lives
          currentStreak = 0; // Reset current streak
          if (lives === 0) {
            gameOver = true; // Set game over flag
          } else {
            // Reset ball position near the right wall
            balls[index] = {
              x: canvas.width - 20,
              y: canvas.height / 2,
              dx: difficulty === 1 ? -2 : difficulty === 2 ? -3 : -4,
              dy: difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4,
            };
          }
        }
      });

      // Apply paddle movement
      paddleY += paddleSpeed;

      // Apply friction to paddle speed
      if (paddleSpeed > 0) {
        paddleSpeed = Math.max(0, paddleSpeed - paddleFriction);
      } else if (paddleSpeed < 0) {
        paddleSpeed = Math.min(0, paddleSpeed + paddleFriction);
      }

      // Prevent paddle from going out of bounds
      if (paddleY < 0) {
        paddleY = 0;
        paddleSpeed = 0;
      }
      if (paddleY + paddleHeight > canvas.height) {
        paddleY = canvas.height - paddleHeight;
        paddleSpeed = 0;
      }

      // Spawn a new ball every 30 seconds if no lives are lost
      elapsedTime += 1 / 60; // Increment elapsed time (assuming 60 FPS)
      if (elapsedTime >= 30) {
        balls.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          dx: difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4,
          dy: difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4,
        });
        elapsedTime = 0; // Reset elapsed time
      }

      requestAnimationFrame(draw);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        paddleSpeed = Math.max(paddleSpeed - paddleAcceleration, -maxPaddleSpeed);
      }
      if (e.key === "ArrowDown") {
        paddleSpeed = Math.min(paddleSpeed + paddleAcceleration, maxPaddleSpeed);
      }
    });

    draw();

    if (!includePong) {
      gameRunning = false; // Stop the game loop if not included
      draw;
    }

    // Add event listener for the pong-toggle checkbox
    pongToggle.addEventListener("change", () => {
      gameRunning = pongToggle.checked;
      if (!gameRunning) {
        window.updateScore("pong", personalBest); // Send personalBest to scoreboard
        personalBest = 0; // Reset personalBest when the game is not running
      } else {
        resetGame(); // Restart the game from the beginning
        draw(); // Resume the game
      }
    });
  }
  
  // === SHOOTER ===
  function startShooter(difficulty, includeShooter) {
    const canvas = document.getElementById("shooter");
    const ctx = canvas.getContext("2d");
    let x = canvas.width / 2;
    let dx = 0; // Velocity for smooth movement
    const bullets = [];
    const enemies = [];
    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      blinkSpeed: Math.random() * 0.02 + 0.005,
      blinkOpacity: Math.random(),
      blinkDirection: Math.random() < 0.5 ? -1 : 1,
    }));
    const playerWidth = 75; // Adjusted width for the sprite
    const playerHeight = 75; // Adjusted height for the sprite
    const bulletWidth = 3;
    let lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2;
    let gameOver = false;
    let gameRunning = true;
    let elapsedTime = 0;
    let currentStreak = 0;
    let personalBest = 0;
    let spawnRate = difficulty === 1 ? 3000 : difficulty === 2 ? 2500 : 2000; // Initial spawn rate
    const shooterToggle = document.getElementById("shooter-toggle");

    const heartSprite = new Image();
    heartSprite.src = "assets/minijeux/nlife-sprite.png";
    const emptyHeartSprite = new Image();
    emptyHeartSprite.src = "assets/minijeux/emptynlife-sprite.png";

    const playerSprite = new Image();
    playerSprite.src = "assets/minijeux/playership-sprite.png"; // New player sprite

    const enemySprites = {
      blue: new Image(),
      green: new Image(),
      yellow: new Image(),
      red: new Image(),
      purple: new Image(),
    };

    enemySprites.blue.src = "assets/minijeux/alienspeed-sprite.png";
    enemySprites.green.src = "assets/minijeux/alien1-sprite.png";
    enemySprites.yellow.src = "assets/minijeux/alien2-sprite.png";
    enemySprites.red.src = "assets/minijeux/alien3-sprite.png";
    enemySprites.purple.src = "assets/minijeux/alienspeed2-sprite.png";

    function resetGame() {
      x = canvas.width / 2;
      dx = 0;
      bullets.length = 0;
      enemies.length = 0;
      lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2;
      gameOver = false;
      elapsedTime = 0;
      currentStreak = 0;
      spawnRate = difficulty === 1 ? 3000 : difficulty === 2 ? 2500 : 2000; // Reset spawn rate
      if (gameOver || !gameRunning) {
        personalBest = 0;
      }
    }

    function drawLives() {
      const heartSize = 20;
      const spacing = 5;
      const startX = canvas.width - (4 * (heartSize + spacing)) - 10; // Always draw 4 containers

      for (let i = 0; i < 4; i++) {
        const sprite = i < lives ? heartSprite : emptyHeartSprite; // Use emptyHeartSprite for lost lives
        ctx.drawImage(sprite, startX + i * (heartSize + spacing), 10, heartSize, heartSize);
      }
    }

    function addOneLife() {
      if (lives < 4) {
        lives++;
        drawLives();
      }
    }

    document.addEventListener("keydown", e => {
      if (e.key === "ArrowLeft") dx = -5;
      if (e.key === "ArrowRight") dx = 5;
    });

    document.addEventListener("keyup", e => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") dx = 0;
    });

    setInterval(() => {
      if (gameRunning) {
        // Add two sources of bullet fire
        bullets.push({ x: x + playerWidth / 5 - bulletWidth / 2, y: canvas.height - playerHeight - 10 }); // Left bullet
        bullets.push({ x: x + (5 * playerWidth) / 6 - bulletWidth / 2, y: canvas.height - playerHeight - 10 }); // Right bullet
      }
    }, 500);

    function spawnEnemies() {
      if (gameRunning) {
        const enemyX = Math.random() * (canvas.width - 50); // Ensure enemy spawns entirely within the canvas
        const enemyY = -50; // Spawn enemies above the canvas
        let enemyType;
        if (elapsedTime >= 50) {
          const types = ["yellow", "red", "purple"];
          enemyType = types[Math.floor(Math.random() * types.length)];
        } else if (elapsedTime >= 40) {
          const types = ["yellow", "red", "blue", "purple"];
          enemyType = types[Math.floor(Math.random() * types.length)];
        } else if (elapsedTime >= 30) {
          const types = ["green", "yellow", "red", "blue"];
          enemyType = types[Math.floor(Math.random() * types.length)];
        } else if (elapsedTime >= 20) {
          const types = ["green", "yellow", "blue"];
          enemyType = types[Math.floor(Math.random() * types.length)];
        } else if (elapsedTime >= 10) {
          const types = ["green", "blue"];
          enemyType = types[Math.floor(Math.random() * types.length)];
        } else {
          const types = ["green"];
          enemyType = types[Math.floor(Math.random() * types.length)];
        }
        const health = enemyType === "red" ? 3 : enemyType === "yellow" ? 2 : enemyType === "purple" ? 2 : 1;
        const speed = enemyType === "purple" ? (difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4) : 1;
        enemies.push({ x: enemyX, y: enemyY, size: 20, type: enemyType, health: health, speed: speed });
      }

      // Gradually increase spawn rate over time
      spawnRate = Math.max(500, spawnRate - 15); // Decrease spawn rate, but not below 500ms
      setTimeout(spawnEnemies, spawnRate);
    }

    setTimeout(spawnEnemies, spawnRate); // Start spawning enemies

    function pulseShooter() {
      canvas.style.transition = "transform 0.2s ease";
      canvas.style.transform = "scale(1.05)";
    
      setTimeout(() => {
        canvas.style.transform = "scale(1)";
      }, 200);
    }

    function draw() {
      if (!gameRunning) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (gameOver) {
        pulseShooter();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gameOverImage = new Image();
        gameOverImage.src = "assets/minijeux/multiman-ko.png"; // Path to the image
        gameOverImage.onload = () => {
          const imgWidth = 203; // Set desired width
          const imgHeight = 152; // Set desired height
          const centerX = (canvas.width - imgWidth) / 2;
          const centerY = (canvas.height - imgHeight) / 2;
          ctx.drawImage(gameOverImage, centerX, centerY, imgWidth, imgHeight);
        };
        canvas.classList.add("disabled");
        shooterToggle.checked = false;
        gameRunning = false;
        window.updateScore("shooter", personalBest);
        setTimeout(() => {
          draw();
        }, 5000);
        return;
      }

      ctx.fillStyle = "#000033";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.blinkOpacity += star.blinkSpeed * star.blinkDirection;
        if (star.blinkOpacity <= 0 || star.blinkOpacity >= 1) {
          star.blinkDirection *= -1;
          star.blinkOpacity = Math.max(0, Math.min(1, star.blinkOpacity));
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.blinkOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
        ctx.fill();

        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
      });

      drawLives();

      x += dx;
      if (x < 0) x = 0;
      if (x + playerWidth > canvas.width) x = canvas.width - playerWidth;

      // Draw the player sprite
      ctx.drawImage(playerSprite, x, canvas.height - playerHeight, playerWidth, playerHeight);

      ctx.fillStyle = "red";
      bullets.forEach(b => {
        b.y -= 3;
        ctx.fillRect(b.x, b.y, bulletWidth, 10);
      });

      for (let i = bullets.length - 1; i >= 0; i--) {
        if (bullets[i].y + 10 < 0) {
          bullets.splice(i, 1);
        }
      }

      enemies.forEach(e => {
        const sprite = enemySprites[e.type];
        ctx.drawImage(sprite, e.x, e.y, e.size * 2.5, e.size * 2.5); // Adjusted size for sprites

        // Update hitbox to match the sprite
        e.hitbox = {
          x: e.x + e.size * 0.25,
          y: e.y + e.size * 0.25,
          width: e.size * 2,
          height: e.size * 2,
        };

        // Move enemies downward
        e.y += e.speed; // Use the enemy's speed property
      });

      for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].y > canvas.height) {
          enemies.splice(i, 1);
          lives--;
          currentStreak = 0;
          if (lives === 0) {
            gameOver = true;
          }
        }
      }

      for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
          const e = enemies[i];
          const b = bullets[j];
          if (
            b.x < e.hitbox.x + e.hitbox.width &&
            b.x + bulletWidth > e.hitbox.x &&
            b.y < e.hitbox.y + e.hitbox.height &&
            b.y + 10 > e.hitbox.y
          ) {
            e.health--;
            bullets.splice(j, 1);
            if (e.type === "purple" && e.health === 1) {
              e.type = "blue"; // Purple enemies become blue when hit
              e.speed = 1; // Adjust speed to match blue enemies
            } else if (e.type === "red" && e.health === 2) {
              e.type = "yellow"; // Red enemies become yellow when hit
            } else if (e.type === "yellow" && e.health === 1) {
              e.type = "green"; // Yellow enemies become green when hit
            } else if (e.health <= 0) {
              enemies.splice(i, 1);
              currentStreak++;
              personalBest = Math.max(personalBest, currentStreak);
            }
            break;
          }
        }
      }

      elapsedTime += 1 / 60;
      requestAnimationFrame(draw);
    }

    draw();

    if (!includeShooter) {
      gameRunning = false;
      draw;
    }

    shooterToggle.addEventListener("change", () => {
      gameRunning = shooterToggle.checked;
      if (!gameRunning) {
        window.updateScore("shooter", personalBest);
        personalBest = 0;
      }
      if (gameRunning) {
        resetGame();
        draw();
      }
    });

    // Expose functions for external access
    window.shooterResetGame = resetGame;
    window.shooterAddOneLife = addOneLife;
  }
  
  // === RUNNER ===
  function startRunner(difficulty, includeRunner) {
    const canvas = document.getElementById("runner");
    const ctx = canvas.getContext("2d");
    let y = 160; // Lowered initial position for the player
    let dy = 0;
    let jumping = false;
    let holdJump = false;
    let crouching = false; // New crouching state
    let gliding = false; // New gliding state
    const obstacles = [];
    const skyscraperHeights = [300, 100, 200, 150]; // Predefined heights for skyscrapers
    let skyscraperIndex = 0; // Index to track the current skyscraper height
    const skyscrapers = Array.from({ length: 5 }, (_, i) => ({
      x: i * 300,
      width: 100,
      height: skyscraperHeights[i % skyscraperHeights.length], // Use predefined heights in a loop
      windows: generateWindows(100, skyscraperHeights[i % skyscraperHeights.length]), // Generate coherent windows
    }));
    let gameOver = false;
    let gameRunning = true; // Flag to track if the game is running
    let personalBest = 0; // Counter for personal best streak
    let currentStreak = 0; // Counter for current streak
    let lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2; // Adjust lives based on difficulty
    const runnerToggle = document.getElementById("runner-toggle");

    // Preload images
    const images = {
      player: new Image(),
      crouch: new Image(),
      glide: new Image(),
      taxi: new Image(),
      tree: new Image(),
      bin: new Image(),
      plane: new Image(),
      heart: new Image(),
      emptyHeart: new Image(),
    };

    images.player.src = "assets/minijeux/multimanrun-sprite.png";
    images.crouch.src = "assets/minijeux/multimancrouch-sprite.png";
    images.glide.src = "assets/minijeux/multimanfly-sprite.png";
    images.taxi.src = "assets/minijeux/taxi-sprite.png";
    images.tree.src = "assets/minijeux/tree-sprite.png";
    images.bin.src = "assets/minijeux/bin-sprite.png";
    images.plane.src = "assets/minijeux/plane-sprite.png";
    images.heart.src = "assets/minijeux/life-sprite.png";
    images.emptyHeart.src = "assets/minijeux/emptylife-sprite.png";

    function drawLives() {
      const heartSize = 20;
      const spacing = 5;
      const startX = canvas.width - (4 * (heartSize + spacing)) - 10; // Always draw 4 containers

      for (let i = 0; i < 4; i++) {
        const sprite = i < lives ? images.heart : images.emptyHeart; // Use emptyHeartSprite for lost lives
        ctx.drawImage(sprite, startX + i * (heartSize + spacing), 10, heartSize, heartSize);
      }
    }

    function loseLife() {
      lives--;
      currentStreak = 0; // Reset current streak when a life is lost
      if (lives === 0) {
        gameOver = true;
        window.updateScore("runner", personalBest); // Send personalBest to scoreboard
      }
    }

    function resetLives() {
      lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2;
    }

    function addOneLife() {
      if (lives < 4) {
        lives++;
        drawLives();
      }
    }

    function resetGame() {
      y = 160;
      dy = 0;
      jumping = false;
      holdJump = false;
      crouching = false; // Reset crouching state
      gliding = false; // Reset gliding state
      obstacles.length = 0;
      gameOver = false;
      currentStreak = 0; // Reset current streak
      if (gameOver || !gameRunning) {
        personalBest = 0; // Reset personal best streak only when the game is over or not running
      }
      resetLives(); // Reset lives
    }

    function generateWindows(buildingWidth, buildingHeight) {
      const rowHeight = 50; // Fixed row height
      const colWidth = 30; // Fixed column width
      const rows = Math.floor(buildingHeight / rowHeight) - 1; // Remove the bottom row
      const cols = Math.floor(buildingWidth / colWidth);
      const windows = [];
      const xOffset = (buildingWidth - cols * colWidth) / 2; // Center windows horizontally
      const yOffset = (buildingHeight - rows * rowHeight) / 2; // Center windows vertically

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          windows.push({
            x: col * colWidth + xOffset + 5, // Add spacing between windows
            y: row * rowHeight + yOffset + 10, // Add spacing between rows
            width: 20,
            height: 30,
          });
        }
      }
      return windows;
    }

    document.addEventListener("keydown", e => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent default behavior of the Space key
        if (!jumping && !crouching && gameRunning) {
          dy = -6.5; // Increased jump speed for a higher jump
          jumping = true;
          holdJump = true; // Start holding jump
        }
      }
      if (e.code === "ArrowDown") {
        if (jumping) {
          gliding = true; // Enable gliding if in the air
        } else {
          crouching = true; // Enable crouching if on the ground
        }
      }
    });

    document.addEventListener("keyup", e => {
      if (e.code === "Space") {
        holdJump = false; // Stop holding jump
      }
      if (e.code === "ArrowDown") {
        gliding = false; // Disable gliding
        crouching = false; // Disable crouching
      }
    });

    function spawnObstacle() {
      if (!gameRunning) return;

      const type = Math.random(); // Random value to determine obstacle type
      let crouchable = false; // New crouchable property
      let sprite = null; // Sprite for the obstacle
      let flipped = Math.random() < 0.5; // Randomly flip the sprite

      if (type < 0.2) {
        width = 85;
        height = 50;
        sprite = images.taxi;
      } else if (type < 0.35) {
        width = 40;
        height = 80;
        sprite = images.tree;
      } else if (type < 0.5) {
        width = 25;
        height = 30;
        sprite = images.bin;
      } else if (type < 0.65) {
        height = 20;
        width = 40;
        sprite = images.plane;
        crouchable = true;
        flipped = false; // Ensure the plane sprite is not flipped
      } else {
        return; // No obstacle spawned
      }

      obstacles.push({
        x: canvas.width,
        y: crouchable ? canvas.height - height - 60 : canvas.height - height - 40,
        width: width,
        height: height,
        passed: false,
        crouchable: crouchable,
        sprite: sprite,
        flipped: flipped, // Add flipped property
      });
    }

    setInterval(spawnObstacle, difficulty === 1 ? 3000 : difficulty === 2 ? 2000 : 1500); // Adjust obstacle spawn rate based on difficulty

    function pulseRunner() {
      canvas.style.transition = "transform 0.2s ease";
      canvas.style.transform = "scale(1.05)";
    
      setTimeout(() => {
        canvas.style.transform = "scale(1)";
      }, 200);
    }

    function draw() {
      if (!gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      if (gameOver) {
        pulseRunner(); // Pulse effect on game over
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gameOverImage = new Image();
        gameOverImage.src = "assets/minijeux/multiman-ko.png"; // Path to the image
        gameOverImage.onload = () => {
          const imgWidth = 304.5; // Set desired width
          const imgHeight = 228; // Set desired height
          const centerX = (canvas.width - imgWidth) / 2;
          const centerY = (canvas.height - imgHeight) / 2;
          ctx.drawImage(gameOverImage, centerX, centerY, imgWidth, imgHeight);
        };
        runnerToggle.checked = false; // Set the checkbox to false
        gameRunning = false; // Stop the game loop
        setTimeout(() => {
          draw();
        }, 5000);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw darker blue sky background
      ctx.fillStyle = "#5ba2f2"; // Slightly darker sky blue
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw scrolling skyscrapers
      skyscrapers.forEach((building, index) => {
        building.x -= 1; // Move skyscrapers to the left
        if (building.x + building.width < 0) {
          building.x = canvas.width; // Reset position when out of bounds
          skyscraperIndex = (skyscraperIndex + 1) % skyscraperHeights.length; // Cycle through predefined heights
          building.height = skyscraperHeights[skyscraperIndex];
          building.windows = generateWindows(building.width, building.height); // Generate new coherent windows
        }
        ctx.fillStyle = "gray";
        ctx.fillRect(building.x, canvas.height - building.height - 40, building.width, building.height);

        // Add black border to skyscrapers
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.strokeRect(building.x, canvas.height - building.height - 40, building.width, building.height);

        // Draw windows on the skyscrapers
        building.windows.forEach(window => {
          ctx.fillStyle = "white";
          ctx.fillRect(
            building.x + window.x,
            canvas.height - building.height - 40 + window.y,
            window.width,
            window.height
          );
          ctx.strokeStyle = "black"; // Add black border
          ctx.lineWidth = 1;
          ctx.strokeRect(
            building.x + window.x,
            canvas.height - building.height - 40 + window.y,
            window.width,
            window.height
          );
        });
      });

      // Draw pedestrian city street
      const tileSize = 20;
      for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = canvas.height - 40; y < canvas.height; y += tileSize) {
          ctx.fillStyle = (x / tileSize + y / tileSize) % 2 === 0 ? "#A9A9A9" : "#808080"; // Checkerboard pattern
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }

      // Draw floor line
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40); // Adjusted floor position
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();

      // Draw lives
      drawLives();

      // Draw player with appropriate sprite and adjust hitbox
      let playerHitbox = { x: 50, y: y, width: 50, height: 60 }; // Default hitbox for standing
      if (crouching) {
        ctx.drawImage(images.crouch, 50, y + 20, 60, 50); // Adjusted sprite dimensions for crouching
        playerHitbox = { x: 50, y: y + 20, width: 50, height: 45 }; // Adjust hitbox for crouching
      } else if (gliding) {
        ctx.drawImage(images.glide, 43, y - 23, 67, 93); // Adjusted sprite dimensions for gliding
      } else {
        ctx.drawImage(images.player, 50, y, 60, 71); // Adjusted sprite dimensions for standing
      }

      // Apply gravity or gliding
      if (!crouching) {
        if (gliding && dy > 0) {
          dy = Math.min(dy + 0.1, 1); // Slow descent while gliding, only if falling
        } else if (holdJump && dy < 0) {
          dy += 0.15; // Reduced gravity while holding jump for smoother ascent
        } else {
          dy += 0.35; // Reduced normal gravity for smoother descent
        }
        y += dy;
      }

      // Prevent falling below ground
      if (y >= canvas.height - 80) {
        y = canvas.height - 80;
        dy = 0;
        jumping = false;
        gliding = false; // Disable gliding when on the ground
      }

      // Draw and move obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= 2.5; // Fixed obstacle speed

        if (obs.sprite) {
          if (obs.flipped) {
            ctx.save();
            ctx.scale(-1, 1); // Flip the sprite horizontally
            ctx.drawImage(obs.sprite, -obs.x - obs.width, obs.y, obs.width, obs.height);
            ctx.restore();
          } else {
            ctx.drawImage(obs.sprite, obs.x, obs.y, obs.width, obs.height);
          }
        }

        // Check for collision
        if (
          playerHitbox.x < obs.x + obs.width &&
          playerHitbox.x + playerHitbox.width > obs.x &&
          playerHitbox.y < obs.y + obs.height &&
          playerHitbox.y + playerHitbox.height > obs.y
        ) {
          if (!obs.crouchable || !crouching) {
            loseLife(); // Lose a life on collision
            obstacles.splice(i, 1); // Remove the obstacle after collision
          }
        }

        // Check if the player has passed the obstacle
        if (!obs.passed && obs.x + obs.width < playerHitbox.x) {
          obs.passed = true;
          currentStreak++; // Increment current streak
          personalBest = Math.max(personalBest, currentStreak); // Update personal best streak
        }

        // Remove obstacles that go out of bounds
        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
        }
      }

      requestAnimationFrame(draw);
    }

    draw();

    if (!includeRunner) {
      gameRunning = false; // Stop the game loop if not included
      draw;
    }
    

    // Add event listener for the runner-toggle checkbox
    runnerToggle.addEventListener("change", () => {
      gameRunning = runnerToggle.checked;
      if (!gameRunning) {
        window.updateScore("runner", personalBest); // Send personalBest to scoreboard
        personalBest = 0; // Reset personalBest when the game is not running
      } else {
        resetGame(); // Restart the game from the beginning
        draw(); // Resume the game
      }
    });

    // Expose functions for external access
    window.runnerResetGame = resetGame;
    window.runnerAddOneLife = addOneLife;
  }
  
  // === BURGER BUILDER ===
  function startBurger(difficulty, includeBurger) {
    const canvas = document.getElementById("burger");
    const ctx = canvas.getContext("2d");
    let stack = [];
    const items = [
      { key: "a", sprite: "assets/minijeux/steak-sprite.png", squareSprite: "assets/minijeux/squaresteak-sprite.png", label: "Steak" },
      { key: "z", sprite: "assets/minijeux/salad-sprite.png", squareSprite: "assets/minijeux/squaresalad-sprite.png", label: "Salade" },
      { key: "e", sprite: "assets/minijeux/bacon-sprite.png", squareSprite: "assets/minijeux/squarebacon-sprite.png", label: "Bacon" },
      { key: "r", sprite: "assets/minijeux/cheese-sprite.png", squareSprite: "assets/minijeux/squarecheese-sprite.png", label: "Fromage" }
    ];
    let targetItem = null;
    let gameOver = false;
    let timeLeft = difficulty === 1 ? 7 : difficulty === 2 ? 5 : 3;
    let intervalId = null;
    let gameRunning = true;
    const burgerToggle = document.getElementById("burger-toggle");
    let lastItem = null;
    let cooldownActive = false;
    let comboCounter = 0;
    let personalBest = 0;
    let bonusTime = 0;
    let lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2;
    let blinkState = false; // State for blinking effect
    let blinkInterval = 0; // Counter for slower blinking

    const chefSprite = new Image();
    chefSprite.src = "assets/minijeux/multimanchef-sprite.png";

    const heartSprite = new Image();
    heartSprite.src = "assets/minijeux/life-sprite.png";
    const emptyHeartSprite = new Image();
    emptyHeartSprite.src = "assets/minijeux/emptylife-sprite.png";

    // Preload all ingredient sprites
    const preloadedSprites = {};
    items.forEach(item => {
      preloadedSprites[item.sprite] = new Image();
      preloadedSprites[item.sprite].src = item.sprite;

      preloadedSprites[item.squareSprite] = new Image();
      preloadedSprites[item.squareSprite].src = item.squareSprite;
    });

    function drawLives() {
      const heartSize = 20;
      const spacing = 5;
      const startX = 10;
      const startY = 10;

      for (let i = 0; i < 4; i++) {
        const sprite = i < lives ? heartSprite : emptyHeartSprite; // Use emptyHeartSprite for lost lives
        ctx.drawImage(sprite, startX + i * (heartSize + spacing), startY, heartSize, heartSize);
      }
    }

    function addOneLife() {
      if (lives < 4) {
        lives++;
        drawLives();
      }
    }

    function loseLife() {
      lives--;
      bonusTime = 0; // Reset bonus time
      if (lives === 0) {
        gameOver = true;
        window.updateScore("burger", personalBest); // Pass personalBest to scoreboard
      }
    }

    function resetLives() {
      lives = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2;
    }

    function resetGame() {
      stack = [];
      gameOver = false;
      timeLeft = difficulty === 1 ? 7 : difficulty === 2 ? 5 : 3;
      bonusTime = 0;
      lastItem = null;
      cooldownActive = false;
      resetLives();
      changeTargetItem();
      startCountdown();
    }

    function changeTargetItem() {
      let newItem;
      do {
        newItem = items[Math.floor(Math.random() * items.length)];
      } while (lastItem === newItem);

      targetItem = newItem;
      lastItem = newItem;
      timeLeft = difficulty === 1 ? 6 : difficulty === 2 ? 5 : 4;
      timeLeft += bonusTime;
    }

    function startCountdown() {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!gameRunning || cooldownActive) return;
        timeLeft--;
        if (timeLeft === 0) {
          loseLife();
          stack = [];
          if (!gameOver) {
            activateCooldown();
          }
        }
      }, 1000);
    }

    function activateCooldown() {
      cooldownActive = true;
      setTimeout(() => {
        cooldownActive = false;
        changeTargetItem();
        startCountdown();
      }, 2000);
    }

    changeTargetItem();
    startCountdown();

    document.addEventListener("keydown", e => {
      if (gameOver || !gameRunning || cooldownActive) return;

      const item = items.find(i => i.key === e.key.toLowerCase());
      if (item) {
        stack.push(item);
        if (item.sprite === targetItem.sprite) {
          personalBest = Math.max(personalBest, stack.length); // Update personalBest
          changeTargetItem();
          startCountdown();
        } else {
          loseLife();
          stack = [];
          if (!gameOver) {
            activateCooldown();
          }
        }
        if (stack.length > 20) {
          stack.shift();
        }
      }
    });

    function pulseBurger() {
      canvas.style.transition = "transform 0.2s ease";
      canvas.style.transform = "scale(1.05)";

      setTimeout(() => {
        canvas.style.transform = "scale(1)";
      }, 200);
    }

    function draw() {
      if (!gameRunning) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gameOver) {
        pulseBurger(); // Pulse effect on game over
        const gameOverImage = new Image();
        gameOverImage.src = "assets/minijeux/multiman-ko.png"; // Path to the image
        gameOverImage.onload = () => {
          const imgWidth = 203; // Set desired width
          const imgHeight = 152; // Set desired height
          const centerX = (canvas.width - imgWidth) / 2;
          const centerY = (canvas.height - imgHeight) / 2;
          ctx.drawImage(gameOverImage, centerX, centerY, imgWidth, imgHeight);
        };
        burgerToggle.checked = false;
        gameRunning = false;
        setTimeout(() => {
          draw();
        }, 5000);
        return;
      }

      // Draw kitchen background
      ctx.fillStyle = "#F5F5DC"; // Light beige for walls
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw tiled wall
      const tileSize = 40;
      ctx.fillStyle = "#E0E0E0"; // Light gray for tiles
      for (let x = 0; x < canvas.width; x += tileSize) {
        for (let y = 0; y < canvas.height - 120; y += tileSize) {
          ctx.fillRect(x, y, tileSize - 2, tileSize - 2); // Add spacing between tiles
        }
      }

      // Draw chef sprite on the left
      ctx.drawImage(chefSprite, 0, canvas.height - 300, 200, 250);

      // Draw counter
      ctx.fillStyle = "#8B4513"; // Brown for counter
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);

      // Draw stove
      ctx.fillStyle = "#333"; // Dark gray for stove
      ctx.fillRect(canvas.width - 120, canvas.height - 100, 100, 40);
      ctx.fillStyle = "#FF4500"; // Red for burners
      ctx.beginPath();
      ctx.arc(canvas.width - 100, canvas.height - 80, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(canvas.width - 60, canvas.height - 80, 10, 0, Math.PI * 2);
      ctx.fill();

      const centerX = canvas.width - 150; // Adjusted to move the burger more to the right

      // Draw bottom bun
      ctx.fillStyle = "#F4A460";
      ctx.fillRect(centerX, canvas.height - 20, 100, 10);

      let y = canvas.height - 36;
      stack.slice(-20).forEach(item => {
        const sprite = preloadedSprites[item.sprite]; // Use preloaded sprite
        ctx.drawImage(sprite, centerX, y, 100, 15);
        y -= 16;
      });

      // Draw top bun
      const topBunY = y + 16;
      ctx.fillStyle = "#F4A460";
      ctx.beginPath();
      ctx.arc(centerX + 50, topBunY, 50, Math.PI, 0);
      ctx.fill();

      // Draw lives using the drawLives function on the top left
      drawLives();

      if (targetItem) {
        const squareSize = 90; // Increased square size
        if (cooldownActive) {
          ctx.fillStyle = "black";
          ctx.fillRect(canvas.width - squareSize - 10, 10, squareSize, squareSize); // Explicitly set width and height to squareSize
          ctx.fillStyle = ctx.fillStyle; // Ensure no scaling issues affect the square
        } else {
          const targetSprite = preloadedSprites[targetItem.squareSprite]; // Use preloaded square sprite
          ctx.drawImage(targetSprite, canvas.width - squareSize - 10, 10, squareSize, squareSize);

          // Make the stroke blink in red only when timeLeft <= 2.5
          if (timeLeft <= 2.5) {
            blinkInterval++;
            if (blinkInterval % 30 === 0) { // Slower blinking
              blinkState = !blinkState; // Toggle blink state
            }
            ctx.strokeStyle = blinkState ? "red" : "black";
          } else {
            ctx.strokeStyle = "black";
          }
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(canvas.width - squareSize - 10, 10, squareSize, squareSize, 10); // Rounded corners
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    }

    draw();

    if (!includeBurger) {
      gameRunning = false;
      draw;
    }

    burgerToggle.addEventListener("change", () => {
      gameRunning = burgerToggle.checked;
      if (!gameRunning) {
        window.updateScore("burger", personalBest); // Pass personalBest to scoreboard
        personalBest = 0; // Reset personalBest when the game is not running
      } else {
        resetGame();
        draw();
      }
    });

    window.burgerResetGame = resetGame; // Expose resetGame function
    window.burgerAddOneLife = addOneLife; // Expose addOneLife function
  }

function startBonus() {
  let x = Math.random() * (window.innerWidth - 50); // Random horizontal position
  let y = Math.random() * (window.innerHeight - 50); // Random vertical position
  let dx = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1); // Random horizontal direction and speed
  let dy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2 + 1); // Random vertical direction and speed
  let bonusVisible = true;

  // Check if at least one game is running
  function isAnyGameRunning() {
    return (
      document.getElementById("pong-toggle").checked ||
      document.getElementById("shooter-toggle").checked ||
      document.getElementById("runner-toggle").checked ||
      document.getElementById("burger-toggle").checked
    );
  }

  // Create the bonus element
  const bonus = document.createElement("div");
  bonus.style.position = "absolute";
  bonus.style.width = "90px";
  bonus.style.height = "40px";
  bonus.style.backgroundImage = "url('assets/minijeux/multibonus-sprite.png')"; // Set the sprite as background
  bonus.style.backgroundSize = "cover"; // Ensure the image covers the div
  bonus.style.left = `${x}px`;
  bonus.style.top = `${y}px`;

  function updateBonus() {
    if (!bonusVisible || !isAnyGameRunning()) {
      bonus.remove(); // Remove the bonus if no games are running
      return;
    }

    x += dx;
    y += dy;

    // Bounce on borders
    if (x <= 0 || x + 90 >= window.innerWidth) {
      dx = -dx;
    }
    if (y <= 0 || y + 40 >= window.innerHeight) {
      dy = -dy;
    }

    // Update bonus position
    bonus.style.left = `${x}px`;
    bonus.style.top = `${y}px`;

    requestAnimationFrame(updateBonus);
  }

  bonus.addEventListener("click", () => {
    bonusVisible = false;
    bonus.remove();
    if (window.shooterAddOneLife && document.getElementById("shooter-toggle").checked) {
      window.shooterAddOneLife();
    }
    if (window.runnerAddOneLife && document.getElementById("runner-toggle").checked) {
      window.runnerAddOneLife();
    }
    if (window.burgerAddOneLife && document.getElementById("burger-toggle").checked) {
      window.burgerAddOneLife();
    }
  });

  // Delay the bonus spawn by 2 minutes after closeTutorial is triggered
  setTimeout(() => {
    if (isAnyGameRunning()) {
      document.body.appendChild(bonus);
      updateBonus();
    }
  }, 120000);
}

  // === SCOREBOARD ===
  function startScoreboard() {
    const canvas = document.getElementById("scoreboard");
    const img = document.getElementById("face");
    const ctx = scoreboard.getContext("2d");
    let scores = {};
    let highestScore = {}; // Object to store all-time highest scores
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.font = "24px Trebuchet MS";
    ctx.textAlign = "center";
    let y = 100;
    ctx.fillText("Tableau des scores", canvas.width / 2, y);

    function drawScoreboard() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
      ctx.fillStyle = "black";
      ctx.font = "24px Trebuchet MS";
      ctx.textAlign = "center";
      let y = 100; // Reset y position for proper alignment
      ctx.fillText("Tableau des scores", canvas.width / 2, y);

      ctx.font = "20px Trebuchet MS";
      ctx.textAlign = "left";

      y += 60; // Add some spacing
      for (const [game, score] of Object.entries(scores)) {
        ctx.fillText(`${game.charAt(0).toUpperCase() + game.slice(1)} : ${score}`, 10, y);
        y += 40; // Add extra spacing between lines
      }

      // Draw Highest Scores section
      y += 60; // Add some spacing
      ctx.fillText("Meilleur(s) Score(s)", 10, y);
      y += 40;
      for (const [game, highScore] of Object.entries(highestScore)) {
        ctx.fillText(`${game.charAt(0).toUpperCase() + game.slice(1)} : ${highScore}`, 10, y);
        y += 40; // Add extra spacing between lines
      }
    }

    function pulseScoreboard() {
      img.style.transition = "transform 0.2s ease";
      img.style.transform = "scale(1.05)";
      canvas.style.transition = "transform 0.2s ease";
      canvas.style.transform = "scale(1.05)";
    
      setTimeout(() => {
        canvas.style.transform = "scale(1)";
        img.style.transform = "scale(1)";
      }, 200);
    }

    function updateScore(game, points) {
      scores[game] = points; // Reset the current score to the provided points

      // Update highest scores
      if (!highestScore.hasOwnProperty(game) || points > highestScore[game]) {
        highestScore[game] = points;
      }

      drawScoreboard();
      pulseScoreboard(); // Call pulseScoreboard to animate the scoreboard
    }

    // Expose the updateScore function globally for other games to update their scores
    window.updateScore = updateScore;
  }
