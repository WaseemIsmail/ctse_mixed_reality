// ROTATABLE: Drag to rotate entity
AFRAME.registerComponent('rotatable', {
  init: function () {
    this.rotation = this.el.getAttribute('rotation') || {x: 0, y: 0, z: 0};
    this.handleDragMove = this.handleDragMove.bind(this);
    this.el.sceneEl.addEventListener('dragmove', this.handleDragMove);
  },
  handleDragMove: function (event) {
    if (event.target !== this.el) return;
    const ROTATION_SPEED = 0.5;
    this.rotation.x -= event.detail.delta.y * ROTATION_SPEED;
    this.rotation.y += event.detail.delta.x * ROTATION_SPEED;
    this.rotation.x = Math.min(Math.max(this.rotation.x, -90), 90);
    this.el.setAttribute('rotation', this.rotation);
  },
  remove: function () {
    this.el.sceneEl.removeEventListener('dragmove', this.handleDragMove);
  }
});

// SCALABLE: Pinch to scale entity
AFRAME.registerComponent('scalable', {
  init: function () {
    this.scale = this.el.getAttribute('scale') || {x: 1, y: 1, z: 1};
    this.handlePinchMove = this.handlePinchMove.bind(this);
    this.el.sceneEl.addEventListener('pinchmove', this.handlePinchMove);
  },
  handlePinchMove: function (event) {
    if (event.target !== this.el) return;
    const SCALE_SPEED = 0.01;
    let scaleChange = event.detail.scaleChange * SCALE_SPEED;
    this.scale.x = Math.min(Math.max(this.scale.x * scaleChange, 0.2), 3);
    this.scale.y = Math.min(Math.max(this.scale.y * scaleChange, 0.2), 3);
    this.scale.z = Math.min(Math.max(this.scale.z * scaleChange, 0.2), 3);
    this.el.setAttribute('scale', this.scale);
  },
  remove: function () {
    this.el.sceneEl.removeEventListener('pinchmove', this.handlePinchMove);
  }
});

// SOUND-TOGGLE: Tap elephant to play/pause sound
AFRAME.registerComponent('sound-toggle', {
  init: function () {
    this.soundPlaying = false;
    this.el.addEventListener('click', () => {
      const sound = this.el.components.sound;
      if (!sound) return;
      if (this.soundPlaying) {
        sound.pauseSound();
      } else {
        sound.playSound();
      }
      this.soundPlaying = !this.soundPlaying;
    });
  }
});

// Play sound on first tap anywhere (to comply with mobile autoplay policy)
document.body.addEventListener('click', () => {
  const elephant = document.querySelector('#elephant');
  if (elephant) {
    const soundComp = elephant.components.sound;
    if (soundComp && !soundComp.isPlaying) {
      soundComp.playSound();
      elephant.components['sound-toggle'].soundPlaying = true;
    }
  }
}, { once: true });

// Handle tap events to switch between idle and walk animations
let animationState = "idle";  // Start with the "idle" animation

const elephant = document.querySelector('#elephant');
elephant.addEventListener('click', () => {
  if (animationState === "idle") {
    // Switch to walk animation
    elephant.setAttribute('animation__walk', {
      property: 'position',
      to: '1 0 0',
      dur: 3000,
      loop: true,
      easing: 'linear'
    });
    elephant.setAttribute('animation__idle', { enabled: false });
    animationState = "walk";
  } else {
    // Switch to idle animation
    elephant.setAttribute('animation__walk', { enabled: false });
    elephant.setAttribute('animation__idle', {
      property: 'rotation',
      to: '0 360 0',
      dur: 5000,
      loop: true,
      easing: 'linear'
    });
    animationState = "idle";
  }
});
