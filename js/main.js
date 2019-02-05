var mainState = {
  preload: function() {
    this.load.image       ( 'bg',         'assets/images/background.png' );
    this.load.image       ( 'arrow',      'assets/images/arrow.png'      );
    this.load.spritesheet ( 'chicken',    'assets/images/chicken_spritesheet.png', 131, 200, 3 );
    this.load.spritesheet ( 'horse',      'assets/images/horse_spritesheet.png',   212, 200, 3 );
    this.load.spritesheet ( 'pig',        'assets/images/pig_spritesheet.png',     297, 200, 3 );
    this.load.spritesheet ( 'sheep',      'assets/images/sheep_spritesheet.png',   244, 200, 3 );
    this.load.audio       ( 'sndChicken', ['assets/audio/chicken.ogg', 'assets/audio/chicken.mp3'] );
    this.load.audio       ( 'sndHorse',   ['assets/audio/horse.ogg',   'assets/audio/horse.mp3'  ] );
    this.load.audio       ( 'sndPig',     ['assets/audio/pig.ogg',     'assets/audio/pig.mp3'    ] );
    this.load.audio       ( 'sndSheep',   ['assets/audio/sheep.ogg',   'assets/audio/sheep.mp3'  ] );
  },

  create: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically   = true;

    this.bg = this.game.add.sprite(0, 0, 'bg');

    var animalData = [
      { imageName: 'chicken', displayName: 'CHICKEN', soundName: 'sndChicken' },
      { imageName: 'horse',   displayName: 'HORSE',   soundName: 'sndHorse'   },
      { imageName: 'pig',     displayName: 'PIG',     soundName: 'sndPig'     },
      { imageName: 'sheep',   displayName: 'SHEEP',   soundName: 'sndSheep'   }
    ];

    this.animals = this.game.add.group();
    this.currentAnimal = 0;

    for (let i = 0; i < animalData.length; i++) {
      var animal = this.animals.create(
        this.game.world.centerX + i * this.game.world.width,
        this.game.world.centerY, animalData[i].imageName, 0
      );
      animal.anchor.setTo(0.5);
      animal.animations.add('basic', [0, 1, 2, 1, 0, 1], 3, false);
      animal.customParams = {
        name:  animalData[i].displayName,
        sound: this.game.add.sound(animalData[i].soundName)
      };
      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(this.onAnimal, this);
    }

    this.txtAnimalName = this.game.add.text(
      this.game.world.centerX, this.game.height * 0.85, '',
      {
        font  : 'bold 30pt Arial',
        fill  : '#D0171B',
        align : 'center'
      }
    );
    this.txtAnimalName.anchor.setTo(0.5);
    this.txtAnimalName.setText(this.animals.getChildAt(0).customParams.name);

    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    this.leftArrow.customParams = {direction: -1};
    this.leftArrow.inputEnabled = true;
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.onArrow, this);
    this.leftArrow.visible = false;

    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = {direction: +1};
    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.onArrow, this);
  },

  update: function() {

  },

  onArrow: function(arrow, event) {
    var prevAnimal = this.currentAnimal;

    this.currentAnimal += arrow.customParams.direction;
    this.currentAnimal  = Math.max(this.currentAnimal, 0);
    this.currentAnimal  = Math.min(this.currentAnimal, this.animals.length - 1);

    if (this.currentAnimal != prevAnimal) {
      var targetX = 0 - this.currentAnimal * this.game.world.width;
      var time    = Math.abs(targetX - this.animals.x) / this.game.world.width * 750;

      if (this.tween != undefined) {
        this.tween.stop();
      }
      this.tween = this.game.add.tween(this.animals);
      this.tween.to({x: targetX}, time, Phaser.Easing.Cubic.Out);
      this.tween.onComplete.add(() => {
        this.showText(this.animals.getChildAt(this.currentAnimal).customParams.name);
      });
      this.tween.start();

      this.hideText();

      this.rightArrow.visible = this.currentAnimal < this.animals.length - 1;
      this.leftArrow.visible  = this.currentAnimal > 0;
    }
  },

  onAnimal: function(animal, event) {
    animal.play('basic');
    animal.customParams.sound.play();
  },

  showText: function(text) {
    this.txtAnimalName.visible = true;
    this.txtAnimalName.setText(text);
  },

  hideText: function() {
    this.txtAnimalName.visible = false;
  }
};

var game = new Phaser.Game(640, 360, Phaser.AUTO);
game.state.add('Main state', mainState);
game.state.start('Main state');
