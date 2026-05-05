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

window.addEventListener("keydown", e => {
  if (gameState === "playing") {
    if (e.key === " ") {
      const dmg = player.attack(boss);
      message = `You hit for ${dmg} damage!`;
      messageTimer = 90;
    }
    if (e.key.toLowerCase() === "d") {
      player.defending = true;
      message = "Defending (hold D)";
      messageTimer = 70;
    }
    if (e.key.toLowerCase() === "r") {
      const dmg = player.specialAttack(boss);
      if (dmg > 0) {
        message = `RAGE STRIKE! ${dmg} DAMAGE!!!`;
        messageTimer = 160;
        screenFlash = 20;
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
    }
  }

  if ((gameState === "won" || gameState === "lost") && e.key.toLowerCase() === "r") {
    resetGame();
  }
});

window.addEventListener("keyup", e => {
  if (e.key.toLowerCase() === "d") player.defending = false;
});

function drawCenteredText(text, font, color, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.fillText(text, WIDTH / 2, y);
}

function gameLoop() {
  ctx.fillStyle = COLORS.DARK_BG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (screenFlash > 0) {
    ctx.fillStyle = `rgba(255, 220, 100, ${screenFlash / 30})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    screenFlash--;
  }

  if (gameState === "menu") {
    drawCenteredText("SHADOW DRAGON", "48px Arial", COLORS.YELLOW, 150);
    drawCenteredText("BOSS FIGHT", "48px Arial", COLORS.YELLOW, 210);
    drawCenteredText("PLAY", "34px Arial", selectedOption === 0 ? "#fff" : "#888", 340);
    drawCenteredText("QUIT", "34px Arial", selectedOption === 1 ? "#fff" : "#888", 390);
    drawCenteredText("↑ ↓   ENTER to start", "20px Arial", "#aaa", 480);
  } 
  else if (gameState === "playing") {
    boss.attackCooldown--;
    if (boss.attackCooldown <= 0) {
      const result = boss.attack(player);
      boss.isAttacking = true;
      message = result.blocked ? `Blocked! (${result.damage})` : `Dragon hits for ${result.damage}!`;
      messageTimer = 100;
      boss.attackCooldown = boss.phase === 1 ? 75 + Math.random() * 40 : 48 + Math.random() * 32;
      setTimeout(() => boss.isAttacking = false, 280);
    }

    boss.update();
    player.update();

    if (boss.health <= 0) gameState = "won";
    if (player.health <= 0) gameState = "lost";

    player.draw(ctx);
    boss.draw(ctx);

    if (boss.attackCooldown < 38 && boss.attackCooldown > 8) {
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 26px Arial";
      ctx.fillText("⚠ DRAGON IS CHARGING ⚠", WIDTH / 2, 155);
    }

    if (player.isRaging) {
      drawCenteredText("RAGE MODE!", "bold 36px Arial", "#ffff00", 190);
    }

    drawCenteredText("SPACE = Attack    Hold D = Defend    R = Rage Strike", "19px Arial", COLORS.WHITE, HEIGHT - 35);

    if (messageTimer > 0) {
      drawCenteredText(message, "26px Arial", player.isRaging ? "#ffff00" : COLORS.YELLOW, 80);
      messageTimer--;
    }

    if (boss.phase === 2) {
      drawCenteredText("ENRAGED PHASE", "20px Arial", COLORS.RED, 120);
    }
  } 
  else {
    if (gameState === "won") {
      drawCenteredText("VICTORY!", "55px Arial", "#00ff00", 220);
      drawCenteredText("You defeated the Shadow Dragon!", "24px Arial", "#fff", 280);
    } else {
      drawCenteredText("DEFEAT", "55px Arial", "#ff0000", 220);
      drawCenteredText("The Shadow Dragon wins...", "24px Arial", "#fff", 280);
    }
    drawCenteredText("Press R to play again", "24px Arial", "#fff", 370);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();