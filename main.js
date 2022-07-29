const prompt = require('prompt-sync')({sigint: true});

const sombrero = '^';
const agujero = 'O';
const campos = '░';
const caracterUsuario = '*';

class Campo {
  constructor(field = [[]]) {
    this.field = field;
    this.locationX = 0;
    this.locationY = 0;
    // Establecer la posición de "inicio" antes de que comience el juego
    this.field[0][0] = caracterUsuario;
  }

  runGame() {
    let playing = true;
    while (playing) {
      this.print();
      this.askQuestion();
      if (!this.isInBounds()) {
        console.log('¡Instrucción fuera de los límites!');
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log('¡Lo siento, te caíste en un hoyo!');
        playing = false;
        break;
      } else if (this.isHat()) {
        console.log('¡Felicidades, encontraste tu sombrero!');
        playing = false;
        break;
      }
      // Actualizar la ubicación actual en el mapa
      this.field[this.locationY][this.locationX] = caracterUsuario;
    }
  }

  askQuestion() {
    console.log('Introduce U, D, L or R.');
    const pregunta = prompt('Que camino eliges? ').toUpperCase();
    switch (pregunta) {
      case 'U':
        this.locationY -= 1;
        break;
      case 'D':
        this.locationY += 1;
        break;
      case 'L':
        this.locationX -= 1;
        break;
      case 'R':
        this.locationX += 1;
        break;
      default:
        console.log('Introduce U, D, L o R.');
        this.askQuestion();
        break;
    }
  }

  isInBounds() {
    return (
      this.locationY >= 0 && 
      this.locationX >= 0 && 
      this.locationY < this.field.length && 
      this.locationX < this.field[0].length
    );
  }

  isHat() {
    return this.field[this.locationY][this.locationX] === sombrero;
  }

  isHole() {
    return this.field[this.locationY][this.locationX] === agujero;
  }

  print() {
    const displayString = this.field.map(row => {
        return row.join('');
      }).join('\n');
    console.log(displayString);
  }

  static generateField(height, width, percentage = 0.1) {
    const field = new Array(height).fill(0).map(el => new Array(width));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const prob = Math.random();
        field[y][x] = prob > percentage ? campos : agujero;
      }
    }
    // Establecer la ubicación del "sombrero"
    const LocalizacionSombrero = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height)
    };
    // Asegúrate de que el "sombrero" no esté en el punto de partida.
    while (LocalizacionSombrero.x === 0 && LocalizacionSombrero.y === 0) {
      LocalizacionSombrero.x = Math.floor(Math.random() * width);
      LocalizacionSombrero.y = Math.floor(Math.random() * height);
    }
    field[LocalizacionSombrero.y][LocalizacionSombrero.x] = sombrero;
    return field;
  }
}

const miCampo = new Campo(Campo.generateField(10, 10, 0.2));
miCampo.runGame();