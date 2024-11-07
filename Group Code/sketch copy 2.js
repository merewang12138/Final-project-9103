// Global variables
let mainRadius = 120; // Radius of the main circle
let numCircles = 280; // Number of circles
let spacingX = mainRadius * 2 + 10; // Horizontal spacing between circles
let spacingY = mainRadius * 2 + 10; // Vertical spacing between circles
let startX = 100; // Starting x position
let startY = 100; // Starting y position
let yStep = -20; // Vertical step to create variation
let xStep = 50; // Horizontal step to create variation
let timeOffset = 0; // Offset for animated noise

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB); // Set color mode to HSB
  background('teal');
}

function draw() {
  background('teal');
  timeOffset += 4; // Increment time for noise-based animation

  // Loop to draw the patterns at different x and y positions
  for (let i = 0; i < numCircles; i++) {
    let row = floor(i / 49); // Determine row position
    let col = i % 49; // Determine column position
    let noiseX = noise(col * 2, row * 0.1, timeOffset); // Noise for x position
    let noiseY = noise(col * 0.1 + 100, row * 0.1 + 100, timeOffset); // Noise for y position
    let x = startX + col * spacingX - row * xStep + noiseX * 50; // Adjust x position with noise
    let y = startY + row * spacingY + col * yStep + noiseY * 50; // Adjust y position with noise

    // Random HSB color influenced by noise
    let hue = noise(col * 0.05, row * 0.05) * 360;
    let saturation = noise(row * 0.05, col * 0.05 + 50) * 60 + 50;
    let brightness = noise(col * 0.1, row * 0.1 + 100) * 20 + 80;

    // Only 1 out of 9 circles will have the zigzag pattern
    let isZigzag = (i % 9 === 0);

    let pattern = new CirclePattern(x, y, mainRadius, hue, saturation, brightness, isZigzag);
    pattern.draw(); // Draw each circle pattern
  }
}

class CirclePattern {
  constructor(x, y, mainRadius, hue, saturation, brightness, isZigzag) {
    this.x = x;
    this.y = y;
    this.mainRadius = mainRadius;
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
    this.isZigzag = isZigzag;

    // Predefined colors
    let predefinedColors = [
      color(0, 0, 0),       // Black
      color(280, 100, 100), // Purple
      color(0, 100, 100),   // Red
      color(210, 100, 100), // Blue
      color(120, 100, 50),  // Dark Green
      color(30, 100, 100)   // Orange
    ];

    // Randomly select three colors from predefined colors
    this.innerColors = shuffle(predefinedColors).slice(0, 3);
  }

  drawDotsInCircle() {
    let numRings = 15; // Number of concentric rings of dots
    let dotSize = 5; // Size of dots

    // Draw concentric rings of dots
    for (let ring = 1; ring < numRings; ring++) {
      let radius = ring * this.mainRadius / numRings;
      let numDots = floor(TWO_PI * radius / (dotSize * 1.2));

      for (let i = 0; i < numDots; i++) {
        let angle = i * TWO_PI / numDots;
        let dotX = this.x + radius * cos(angle);
        let dotY = this.y + radius * sin(angle);

        noStroke();
        fill(this.hue, this.saturation, this.brightness);
        circle(dotX, dotY, dotSize);
      }
    }
  }

  drawZigzagPattern() {
    let outerRadius = this.mainRadius * 0.9;
    let innerRadius = outerRadius * 2 / 3;

    fill('yellow');
    noStroke();
    circle(this.x, this.y, this.mainRadius * 2);

    stroke('red');
    strokeWeight(3);
    let angle = 0;
    let angleStep = radians(3);
    let numZigzags = 120;

    beginShape();
    for (let i = 0; i < numZigzags; i++) {
      let innerX = this.x + innerRadius * cos(angle);
      let innerY = this.y + innerRadius * sin(angle);
      vertex(innerX, innerY);

      angle += angleStep;

      let outerX = this.x + outerRadius * cos(angle);
      let outerY = this.y + outerRadius * sin(angle);
      vertex(outerX, outerY);

      angle += angleStep;
    }
    endShape();
  }

  drawInnerCircles() {
    let smallRadius = 15;
    let numCircles = 9;

    fill("gold");
    noStroke();
    circle(this.x, this.y, smallRadius * 2);

    strokeWeight(6);
    noFill();

    for (let i = 0; i < numCircles; i++) {
      let currentRadius = smallRadius + i * 5;
      stroke(this.innerColors[i % 3]);
      circle(this.x, this.y, currentRadius * 2);
    }
  }

  draw() {
    if (this.isZigzag) {
      this.drawZigzagPattern();
    } else {
      this.drawDotsInCircle();
    }
    this.drawInnerCircles();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('teal');
}

