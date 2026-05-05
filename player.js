class Player {
  constructor() {
    this.x = 150;
    this.y = 350;
    this.width = 60;
    this.height = 80;
    this.health = 100;
    this.maxHealth = 100;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.defending = false;
    this.usedSpecial = false;
    this.isRaging = false;
    this.rageTimer = 0;
  }

  update() {
    if (this.isRaging) {
      this.rageTimer--;
      if (this.rageTimer <= 0) this.isRaging = false;
    }
    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) this.isAttacking = false;
    }
  }

  draw(ctx) {
    const raging = this.isRaging && Math.floor(Date.now() / 70) % 2 === 0;

    ctx.fillStyle = this.isRaging ? "#ffaa00" : COLORS.BLUE;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#c8b48c";
    ctx.beginPath();
    ctx.arc(this.x + 30, this.y + 20, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = this.isRaging ? "#ffff00" : "#ffffff";
    ctx.lineWidth = this.isRaging ? 14 : 8;
    const swordX = this.isAttacking ? this.x + 85 : this.x + 52;
    ctx.beginPath();
    ctx.moveTo(this.x + 48, this.y + 48);
    ctx.lineTo(swordX, this.y + 18);
    ctx.stroke();

    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = COLORS.RED;
    ctx.fillRect(this.x - 10, this.y - 30, 150, 15);
    ctx.fillStyle = COLORS.GREEN;
    ctx.fillRect(this.x - 10, this.y - 30, 150 * ratio, 15);

    ctx.fillStyle = COLORS.WHITE;
    ctx.font = "bold 17px Arial";
    ctx.fillText(Math.floor(this.health), this.x + 28, this.y - 16);
  }

  attack(boss) {
    const dmg = 22 + Math.floor(Math.random() * 16);
    boss.health = Math.max(0, boss.health - dmg);
    this.isAttacking = true;
    this.attackTimer = 14;
    return dmg;
  }

  specialAttack(boss) {
    if (this.usedSpecial) return 0;
    const dmg = 55 + Math.floor(Math.random() * 25);
    boss.health = Math.max(0, boss.health - dmg);
    this.usedSpecial = true;
    this.isRaging = true;
    this.rageTimer = 240;
    this.isAttacking = true;
    this.attackTimer = 20;
    return dmg;
  }
}