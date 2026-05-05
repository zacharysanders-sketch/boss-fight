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
    if (e.key === " ") {                    // Normal Attack
      const dmg = player.attack(boss);
      message = `You slash for ${dmg} damage!`;
      messageTimer = 80;
    }
    if (e.key.toLowerCase() === "d") {      // Defend - now properly timed
      player.defending = true;
      message = "Defending! (Next hit reduced)";
      messageTimer = 70;
    }
    if (e.key.toLowerCase() === "r") {      // Special
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

window.addEventListener("keyup", e => {
  keys[e.key] = false;
  
  // Reset defending when key is released
  if (e.key.toLowerCase() === "d") {
    player.defending = false;
  }
});

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
    // === Boss Attack Logic ===
    boss.attackCooldown--;
    
    if (boss.attackCooldown <= 0) {
      const result = boss.attack(player);
      boss.isAttacking = true;
      
      if (result.blocked) {
        message = `Dragon attack blocked! (${result.damage} dmg)`;
      } else {
        message = `Dragon hits you for ${result.damage} damage!`;
      }
      messageTimer = 100;

      // Reset cooldown
      boss.attackCooldown = boss.phase === 1 ? 
        70 + Math.random() * 40 : 45 + Math.random() * 35;

      // Flash effect ends quickly
      setTimeout(() => { if (boss) boss.isAttacking = false; }, 280);
    }

    boss.update();

    // Player attack animation
    if (player.isAttacking) {
      player.attackTimer--;
      if (player.attackTimer <= 0) player.isAttacking = false;
    }

    // Win / Lose
    if (boss.health <= 0) gameState = "won";
    if (player.health <= 0) gameState = "lost";

    // Draw everything
    player.draw(ctx);
    boss.draw(ctx);

    // === Warning System ===
    if (boss.attackCooldown < 38 && boss.attackCooldown > 5) {
      ctx.fillStyle = "#ff0000";
      ctx.font = "bold 26px Arial";
      ctx.fillText("⚠ DRAGON CHARGING ATTACK ⚠", WIDTH/2 - 210, 155);
    }

    drawCenteredText(ctx, "SPACE = Attack    D = Hold to Defend    R = Special (once)", 
      "18px Arial", COLORS.WHITE, WIDTH/2, HEIGHT - 30);

    if (messageTimer > 0) {
      drawCenteredText(ctx, message, "24px Arial", COLORS.YELLOW, WIDTH/2, 80);
      messageTimer--;
    }

    if (boss.phase === 2) {
      drawCenteredText(ctx, "ENRAGED PHASE - Faster Attacks!", "20px Arial", COLORS.RED, WIDTH/2, 115);
    }
  }

  else if (gameState === "won" || gameState === "lost") {
    if (gameState === "won") {
      drawCenteredText(ctx, "VICTORY!", "52px Arial", "#00ff00", WIDTH/2, HEIGHT/2 - 70);
      drawCenteredText(ctx, "You defeated the Shadow Dragon!", "24px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2);
    } else {
      drawCenteredText(ctx, "DEFEAT", "52px Arial", COLORS.RED, WIDTH/2, HEIGHT/2 - 70);
      drawCenteredText(ctx, "The Shadow Dragon wins...", "24px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2);
    }
    drawCenteredText(ctx, "Press R to play again", "20px Arial", COLORS.WHITE, WIDTH/2, HEIGHT/2 + 70);
    
    if (keys["r"] || keys["R"]) resetGame();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();