# Bomberman Game

## Project Overview

This is a vanilla JavaScript implementation of the classic Bomberman game, built without using any frameworks or canvas, focusing on pure DOM manipulation and performance optimization.

## Project Objectives

- Achieve consistent 60 FPS performance
- Implement smooth, responsive game mechanics
- Create a fully functional Bomberman game using only HTML, CSS, and JavaScript

## Game Features

### Core Mechanics

- Keyboard-controlled player movement
- Bomb placement and explosion mechanics
- Smooth, non-spammy key controls
- Performance-optimized rendering

### Game UI

- Pause menu with:
  - Continue game
  - Restart game
- Score board displaying:
  - Countdown/Timer
  - Current score
  - Remaining lives

## Technical Requirements

### Performance Constraints

- Maintain 60 FPS at all times
- Minimize layer usage
- Use `requestAnimationFrame` for smooth animations
- No frame drops during game state changes

### Development Tools

Recommended browser developer tools:

- Page Inspector
- Web Console
- Performance Tool

## Project Structure

```
/bomberman
│
├── src/
│   ├── engine/
│   │   └── gameLoop.js        # Main game loop & RAF implementation
│   │
│   ├── core/
│   │   ├── bombe.js           # bombe mechanics and interactions
│   │   ├── enemy.js           # enemy mechanics and interactions
│   │   ├── player.js          # Player mechanics and interactions
│   │   └── map.js             # Game grid system and map generation
│   │
│   ├── utils/
│   │   ├── check_resizing.js  # Check resizing for responsive
│   │   ├── hud.js             # The HUD to visualize game statistics.
│   │   └── collision.js       # Collision detection utilities
│   │
│   ├── assets/
│   │   ├── altima2.png
│   │   ├── block.png
│   │   ├── bomb_sprite.png
│   │   ├── door.png
│   │   ├── empty_space.png
│   │   ├── exp.png
│   │   ├── favico.png
│   │   ├── ifirit.png
│   │   ├── rock.png
│   │   └── styles.css         # Game styling
│   │
│   ├── assets/
│   │   └── constants.js       # game constants
│   ├── index.html             # Main HTML file
│   └── main.js                # Game initialization and main script
│
└── README.md                  # Project documentation
```

## Key Learning Objectives

- Mastering `requestAnimationFrame`
- Understanding the JavaScript event loop
- Performance optimization techniques
- DOM manipulation
- Preventing animation jank
- Browser developer tools profiling

## Getting Started

1. Clone the repository
2. Open `src/index.html` in a modern browser
3. Use keyboard controls to play the game

## Performance Monitoring

Use browser developer tools, specifically the Performance Tool, to:

- Analyze FPS
- Check for frame drops
- Monitor function execution times
- Identify rendering bottlenecks

## Contribution

Feel free to open issues or submit pull requests to improve the game's performance or add new features.

## License

[Add your license information here]
