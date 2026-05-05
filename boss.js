class Boss {
  constructor() {
    this.x = 500;
    this.y = 220;
    this.width = 120;
    this.height = 100;
    this.health = 280;
    this.maxHealth = 280;
    this.attackCooldown = 80;
    this.phase = 1;
    this.isAttacking = false;
  }

  draw(ctx) {
    const isEnraged = this.phase === 2;
    const flash = this.isAttacking || (this.attackCooldown < 25 && Math.floor(Date.now() / 100) % 2 === 0);

    // Body
    ctx.fillStyle = flash ? "#ff0088" : COLORS.PURPLE;
    ctx.beginPath();
    ctx.ellipse(this.x + 60, this.y + 55, 60, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = flash ? "#ff0044" : "#640064";
    ctx.beginPath();
    ctx.arc(this.x + 90, this.y + 35, 35, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = COLORS.RED;
    ctx.beginPath();
    ctx.arc(this.x + 105, this.y + 30, 10, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = "#500078";
    ctx.beginPath();
    ctx.moveTo(this.x + 20, this.y + 30);
    ctx.lineTo(this.x - 30, this.y - 20);
    ctx.lineTo(this.x + 10, this.y + 60);
    ctx.fill();

    // Health Bar
    const barWidth = 200;
    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = COLORS.RED;
    ctx.fillRect(this.x - 20, this.y - 40, barWidth, 20);
    ctx.fillStyle = isEnraged ? "#ff4400" : "#c83200";
    ctx.fillRect(this.x - 20, this.y - 40, barWidth * ratio, 20);

    ctx.fillStyle = COLORS.WHITE;
    ctx.font = "bold 18px Arial";
    ctx.fillText(`Shadow Dragon ${Math.floor(this.health)}`, this.x - 5, this.y - 48);
  }

  update() {
    if (this.health < this.maxHealth * 0.4 && this.phase === 1) {
      this.phase = 2;
      this.attackCooldown = 50;
    }
  }

  attack(player) {
    let damage = this.phase === 1 ? 
      12 + Math.floor(Math.random() * 11) : 
      18 + Math.floor(Math.random() * 11);

    if (player.defending) {
      damage = Math.floor(damage * 0.45);
      return { damage, blocked: true };
    }
    player.health = Math.max(0, player.health - damage);
    return { damage, blocked: false };
  }
}