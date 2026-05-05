class Player {
  constructor() {
    this.x = 150;
    this.y = 350;
    this.width = 60;
    this.height = 80;
    this.health = 100;
    this.maxHealth = 100;
    this.attack = 20;
    this.isAttacking = false;
    this.attackTimer = 0;
    this.defending = false;
    this.usedSpecial = false;
    this.isRaging = false;
    this.rageTimer = 0;
  }

  draw(ctx) {
    const isGlowing = this.isRaging && Math.floor(Date.now() / 80) % 2 === 0;

    // Body with rage glow
    ctx.fillStyle = this.isRaging ? "#ffcc00" : COLORS.BLUE;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Head
    ctx.fillStyle = "#c8b48c";
    ctx.beginPath();
    ctx.arc(this.x + 30, this.y + 20, 18, 0, Math.PI * 2);
    ctx.fill();

    // Sword with rage effect
    ctx.strokeStyle = this.isRaging ? "#ffff00" : COLORS.WHITE;
    ctx.lineWidth = this.isRaging ? 12 : 8;
    const swordX = this.isAttacking ? this.x + 80 : this.x + 50;
    ctx.beginPath();
    ctx.moveTo(this.x + 45, this.y + 50);
    ctx.lineTo(swordX, this.y + 20);
    ctx.stroke();

    // Extra glow on sword when raging
    if (this.isRaging) {
      ctx.strokeStyle = "rgba(255, 255, 100, 0.6)";
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(this.x + 45, this.y + 50);
      ctx.lineTo(swordX, this.y + 20);
      ctx.stroke();
    }

    // Health Bar
    const barWidth = 150;
    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = COLORS.RED;
    ctx.fillRect(this.x - 10, this.y - 30, barWidth, 15);
    ctx.fillStyle = COLORS.GREEN;
    ctx.fillRect(this.x - 10, this.y - 30, barWidth * ratio, 15);

    ctx.fillStyle = COLORS.WHITE;
    ctx.font = "bold 17px Arial";
    ctx.fillText(`${Math.floor(this.health)}`, this.x + 25, this.y - 16);
  }

  attack(boss) {
    let damage = this.attack + Math.floor(Math.random() * 12) - 3;
    boss.health = Math.max(0, boss.health - damage);
    this.isAttacking = true;
    this.attackTimer = 15;
    return Math.floor(damage);
  }

  specialAttack(boss) {
    if (this.usedSpecial) return 0;
    
    const damage = 48 + Math.floor(Math.random() * 22); // 48-69
    boss.health = Math.max(0, boss.health - damage);
    
    this.usedSpecial = true;
    this.isRaging = true;
    this.rageTimer = 240; // ~4 seconds at 60fps
    this.isAttacking = true;
    this.attackTimer = 22;
    
    return Math.floor(damage);
  }

  update() {
    if (this.isRaging) {
      this.rageTimer--;
      if (this.rageTimer <= 0) {
        this.isRaging = false;
      }
    }

    if (this.isAttacking) {
      this.attackTimer--;
      if (this.attackTimer <= 0) this.isAttacking = false;
    }
  }
}