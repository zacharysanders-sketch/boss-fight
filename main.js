const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player, boss, gameState = "menu", message = "", messageTimer = 0;
let selectedOption = 0;
let screenFlash = 0;

function resetGame() {
  player = new Player();
  boss = new Boss();
  gameState = "playing";
  message = "";
  messageTimer = 0;
  screenFlash = 0;
}

const keys = {};

window.addEventListener("keydown", e => {
  if (gameState === "playing") {
    if (e.key === " ") {
      e.preventDefault();
      const dmg = player.attack(boss);
      message = `Hit for ${dmg} damage!`;
      messageTimer = 80;
    }
    
    if (e.key.toLowerCase() === "d") {
      player.defending = true;
      message = "Defending (hold D)";
      messageTimer = 60;
    }
    
    if (e.key.toLowerCase() === "r") {
      const dmg = player.specialAttack(boss);
      if (dmg > 0) {
        message = `RAGE STRIKE! ${dmg} DAMAGE!!!`;
        messageTimer = 140;
        screenFlash = 15;  // Screen flash effect
      } else {
        message = "Rage already used!";
        messageTimer = 80;
      }
    }
  }

  if (gameState === "menu") {
    if (e.key === "ArrowUp") selectedOption = (selectedOption - 1 + 2) % 2;
    if (e.key === "ArrowDown") selectedOption = (selectedOption + 1) % 2;
    if (e.key === "Enter" || e.key === " ") {
      if (selectedOption === 0) resetGame();
      if (selectedOption === 1) window.close();
    }
  }
});

window.addEventListener("keyup", e => {
  if (e.key.toLowerCase() === "d") player.defending = false;
});

function gameLoop() {
  ctx.fillStyle = COLORS.DARK_BG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (screenFlash > 0) {
    ctx.fillStyle = `rgba(255, 200, 0, ${screenFlash / 20})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    screenFlash--;
  }

  if (gameState === "menu") {
    drawCenteredText(ctx, "SHADOW DRAGON", "48px Arial", COLORS.YELLOW, WIDTH/2, 140);
    drawCenteredText(ctx, "BOSS FIGHT", "48px Arial", COLORS.YELLOW, WIDTH/2, 200);
    drawCenteredText(ctx, "PLAY", "32px Arial", selectedOption === 0 ? COLORS.WHITE : "#888", WIDTH/2, 340);
    drawCenteredText(ctx, "QUIT", "32px Arial", selectedOption === 1 ? COLORS.WHITE : "#888", WIDTH/2, 390);
    drawCenteredText(ctx, "↑ ↓  ENTER to select", "18px Arial", "#aaa", WIDTH/2, 480);
  } 
  else if (gameState === "playing") {
    boss.attackCooldown--;
    if (boss.attackCooldown <= 0) {
      const result = boss.attack(player);
      boss.isAttacking = true;
      
      if (result.blocked) {
        message = `Blocked! (${result.damage})`;
      } else {
        message = `Dragon hits for ${result.damage}!`;
      }
      messageTimer = 100;
      
      boss.attackCooldown = boss.phase === 1 ? 75 + Math.random()*35 : 48 + Math.random()*30;
      setTimeout(() => boss.isAttacking = false, 250);
    }

    boss.update();
    player.update();

    if (boss.health <= 0) gameState = "won";
    if (player.health <= 0) gameState = "lost";

    player.draw(ctx);
    boss.draw(ctx);

    // Rage Warning
    if (boss.attackCooldown < 40 && boss.attackCooldown > 8) {
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 26px Arial";
      ctx.fillText("⚠ DRAGON IS CHARGING ⚠", WIDTH/2 - 205, 155);
    }

    // Rage Active Text
    if (player.isRaging) {
      drawCenteredText(ctx, "RAGE MODE ACTIVATED!", "bold 32px Arial", "#ffff00", WIDTH/2, 180);
    }

    drawCenteredText(ctx, "SPACE = Attack    Hold D = Defend    R = Rage Strike (once)", 
      "18px Arial", COLORS.WHITE, WIDTH/2, HEIGHT - 35);

    if (messageTimer > 0) {
      drawCenteredText(ctx, message, "26px Arial", player.isRaging ? "#ffff00" : COLORS.YELLOW, WIDTH/2, 75);
      messageTimer--;
    }

    if (boss.phase === 2) {
      drawCenteredText(ctx, "ENRAGED PHASE", "20px Arial", COLORS.RED, WIDTH/2, 115);
    }
  } 
  else if (gameState === "won" || gameState === "lost") {
    if (gameState === "won") {
      drawCenteredText(ctx, "VICTORY!", "55px Arial", "#00ff00", WIDTH/2, HEIGHT/2 - 80);
      drawCenteredText(ctx, "You defeated the Shadow Dragon!", "24px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2 - 10);
    } else {
      drawCenteredText(ctx, "DEFEAT", "55px Arial", COLORS.RED, WIDTH/2, HEIGHT/2 - 80);
      drawCenteredText(ctx, "The Shadow Dragon wins...", "24px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2 - 10);
    }
    drawCenteredText(ctx, "Press R to play again", "22px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2 + 60);
    if (keys["r"] || keys["R"]) resetGame();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();