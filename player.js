class Player {
  constructor() {
    this.x = 150;
    this.y = 350;
    this.width = 60;
    this.height = 80;
    this.health = 100;
    this.maxHealth = 100;
    this.attack = 18;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.defending = false;
    this.usedSpecial = false;
  }

  draw(ctx) {
    // Body
    ctx.fillStyle = COLORS.BLUE;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Head
    ctx.fillStyle = "#c8b48c";
    ctx.beginPath();
    ctx.arc(this.x + 30, this.y + 20, 18, 0, Math.PI * 2);
    ctx.fill();

    // Sword
    ctx.strokeStyle = COLORS.WHITE;
    ctx.lineWidth = 8;
    const swordX = this.isAttacking ? this.x + 70 : this.x + 50;
    ctx.beginPath();
    ctx.moveTo(this.x + 45, this.y + 50);
    ctx.lineTo(swordX, this.y + 30);
    ctx.stroke();

    // Health Bar
    const barWidth = 150;
    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = COLORS.RED;
    ctx.fillRect(this.x - 10, this.y - 30, barWidth, 15);
    ctx.fillStyle = COLORS.GREEN;
    ctx.fillRect(this.x - 10, this.y - 30, barWidth * ratio, 15);

    ctx.fillStyle = COLORS.WHITE;
    ctx.font = "bold 16px Arial";
    ctx.fillText(`${Math.floor(this.health)}`, this.x + 25, this.y - 16);
  }

  attack(boss) {
    const damage = this.attack + Math.floor(Math.random() * 14) - 5;
    boss.health = Math.max(0, boss.health - damage);
    this.isAttacking = true;
    this.attackTimer = 12;
    return damage;
  }

  specialAttack(boss) {
    if (this.usedSpecial) return 0;
    const damage = this.attack + 25 + Math.floor(Math.random() * 16);
    boss.health = Math.max(0, boss.health - damage);
    this.usedSpecial = true;
    this.isAttacking = true;
    this.attackTimer = 20;
    return damage;
  }
}