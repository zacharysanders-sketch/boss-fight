class Boss {
  constructor() {
    this.x = 500;
    this.y = 220;
    this.health = 280;
    this.maxHealth = 280;
    this.attackCooldown = 90;
    this.phase = 1;
    this.isAttacking = false;
  }

  update() {
    if (this.health < this.maxHealth * 0.4 && this.phase === 1) {
      this.phase = 2;
    }
  }

  draw(ctx) {
    const flash = this.isAttacking || (this.attackCooldown < 35 && Math.floor(Date.now() / 90) % 2 === 0);
    
    ctx.fillStyle = flash ? "#ff0088" : COLORS.PURPLE;
    ctx.beginPath();
    ctx.ellipse(this.x + 60, this.y + 55, 60, 42, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = flash ? "#ff0044" : "#640064";
    ctx.beginPath();
    ctx.arc(this.x + 92, this.y + 35, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.RED;
    ctx.beginPath();
    ctx.arc(this.x + 107, this.y + 30, 10, 0, Math.PI * 2);
    ctx.fill();

    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = COLORS.RED;
    ctx.fillRect(this.x - 20, this.y - 45, 200, 20);
    ctx.fillStyle = this.phase === 2 ? "#ff5500" : "#c83200";
    ctx.fillRect(this.x - 20, this.y - 45, 200 * ratio, 20);

    ctx.fillStyle = COLORS.WHITE;
    ctx.font = "bold 18px Arial";
    ctx.fillText(`Shadow Dragon ${Math.floor(this.health)}`, this.x - 8, this.y - 50);
  }

  attack(player) {
    let dmg = this.phase === 1 ? 16 + Math.floor(Math.random() * 12) : 23 + Math.floor(Math.random() * 12);
    if (player.defending) {
      dmg = Math.floor(dmg * 0.45);
    } else {
      player.health = Math.max(0, player.health - dmg);
    }
    return { damage: Math.floor(dmg), blocked: player.defending };
  }
}