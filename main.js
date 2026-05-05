const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player, boss, gameState = "menu", message = "", messageTimer = 0;
let selectedOption = 0;

function resetGame() {
  player = new Player();
  boss = new Boss();
  gameState = "playing";
  message = "";
  messageTimer = 0;
}

const keys = {};
window.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (gameState === "menu") {
    if (e.key === "ArrowUp") selectedOption = (selectedOption - 1 + 2) % 2;
    if (e.key === "ArrowDown") selectedOption = (selectedOption + 1) % 2;
    if (e.key === "Enter" || e.key === " ") {
      if (selectedOption === 0) resetGame();
      if (selectedOption === 1) window.close();
    }
  }

  if (gameState === "playing") {
    if (e.key === " ") {
      const dmg = player.attack(boss);
      message = `You slash for ${dmg} damage!`;
      messageTimer = 90;
    }
    if (e.key.toLowerCase() === "d") {
      player.defending = true;
      message = "Defending! Next hit reduced.";
      messageTimer = 60;
    }
    if (e.key.toLowerCase() === "r") {
      const dmg = player.specialAttack(boss);
      if (dmg > 0) {
        message = `RAGE STRIKE! ${dmg} damage!!`;
        messageTimer = 120;
      } else {
        message = "Special already used!";
        messageTimer = 60;
      }
    }
  }
});

window.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
  ctx.fillStyle = COLORS.DARK_BG;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if (gameState === "menu") {
    drawCenteredText(ctx, "SHADOW DRAGON", "48px Arial", COLORS.YELLOW, WIDTH/2, 140);
    drawCenteredText(ctx, "BOSS FIGHT", "48px Arial", COLORS.YELLOW, WIDTH/2, 200);

    const playColor = selectedOption === 0 ? COLORS.WHITE : "#888";
    const quitColor = selectedOption === 1 ? COLORS.WHITE : "#888";

    drawCenteredText(ctx, "PLAY", "32px Arial", playColor, WIDTH/2, 340);
    drawCenteredText(ctx, "QUIT", "32px Arial", quitColor, WIDTH/2, 390);
    drawCenteredText(ctx, "↑ ↓  ENTER to select", "18px Arial", "#aaa", WIDTH/2, 480);
  }

  else if (gameState === "playing") {
    // Boss AI + Warning
    boss.attackCooldown--;
    if (boss.attackCooldown <= 0) {
      const result = boss.attack(player);
      boss.isAttacking = true;
      setTimeout(() => boss.isAttacking = false, 300);

      if (result.blocked) {
        message = `Dragon fire blocked! ${result.damage} absorbed.`;
      } else {
        message = `Dragon hits you for ${result.damage} damage!`;
      }
      messageTimer = 100;
      boss.attackCooldown = boss.phase === 1 ? 55 + Math.random() * 35 : 38 + Math.random() * 25;
    }

    boss.update();

    if (player.isAttacking) {
      player.attackTimer--;
      if (player.attackTimer <= 0) player.isAttacking = false;
    }

    if (boss.health <= 0) gameState = "won";
    if (player.health <= 0) gameState = "lost";

    player.draw(ctx);
    boss.draw(ctx);

    // Attack Warning
    if (boss.attackCooldown < 35) {
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 22px Arial";
      ctx.fillText("⚠ DRAGON IS CHARGING ⚠", WIDTH/2 - 160, 160);
    }

    drawCenteredText(ctx, "SPACE = Attack    D = Defend    R = Special", 
      "18px Arial", COLORS.WHITE, WIDTH/2, HEIGHT - 30);

    if (messageTimer > 0) {
      drawCenteredText(ctx, message, "24px Arial", COLORS.YELLOW, WIDTH/2, 80);
      messageTimer--;
    }

    if (boss.phase === 2) {
      drawCenteredText(ctx, "ENRAGED PHASE", "20px Arial", COLORS.RED, WIDTH/2, 115);
    }
  }

  else if (gameState === "won") {
    drawCenteredText(ctx, "VICTORY!", "52px Arial", "#00ff00", WIDTH/2, HEIGHT/2 - 60);
    drawCenteredText(ctx, "You defeated the Shadow Dragon!", "24px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2);
    drawCenteredText(ctx, "Press R to play again", "20px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2 + 60);
    if (keys["r"] || keys["R"]) resetGame();
  }

  else if (gameState === "lost") {
    drawCenteredText(ctx, "DEFEAT", "52px Arial", COLORS.RED, WIDTH/2, HEIGHT/2 - 60);
    drawCenteredText(ctx, "The Shadow Dragon wins...", "24px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2);
    drawCenteredText(ctx, "Press R to try again", "20px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2 + 60);
    if (keys["r"] || keys["R"]) resetGame();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();