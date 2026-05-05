function drawCenteredText(ctx, text, font, color, x, y) {
  ctx.font = font;
  ctx.fillStyle = color;
  const metrics = ctx.measureText(text);
  ctx.fillText(text, x - metrics.width / 2, y);
}