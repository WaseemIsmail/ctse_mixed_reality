// ROTATABLE: Drag to rotate entity
AFRAME.registerComponent('rotatable', {
  init: function () {
    this.rotation = this.el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    this.handleDragMove = this.handleDragMove.bind(this);
    this.el.addEventListener('dragmove', this.handleDragMove); // listen on this.el
    console.log(`rotatable registered on ${this.el.id || this.el.tagName}`);
  },
  handleDragMove: function (event) {
    if (event.target !== this.el) return;
    const ROTATION_SPEED = 0.5;
    this.rotation.x -= event.detail.delta.y * ROTATION_SPEED;
    this.rotation.y += event.detail.delta.x * ROTATION_SPEED;
    this.rotation.x = Math.min(Math.max(this.rotation.x, -90), 90);
    this.el.setAttribute('rotation', this.rotation);
    console.log(`dragmove: rotation updated to`, this.rotation);
  },
  remove: function () {
    this.el.removeEventListener('dragmove', this.handleDragMove);
  }
});

// SCALABLE: Pinch to scale entity
AFRAME.registerComponent('scalable', {
  init: function () {
    this.scale = this.el.getAttribute('scale') || { x: 1, y: 1, z: 1 };
    this.handlePinchMove = this.handlePinchMove.bind(this);
    this.el.addEventListener('pinchmove', this.handlePinchMove); // listen on this.el
    console.log(`scalable registered on ${this.el.id || this.el.tagName}`);
  },
  handlePinchMove: function (event) {
    if (event.target !== this.el) return;
    const SCALE_SPEED = 0.01;
    let scaleChange = event.detail.scaleChange * SCALE_SPEED;
    this.scale.x = Math.min(Math.max(this.scale.x * scaleChange, 0.2), 3);
    this.scale.y = Math.min(Math.max(this.scale.y * scaleChange, 0.2), 3);
    this.scale.z = Math.min(Math.max(this.scale.z * scaleChange, 0.2), 3);
    this.el.setAttribute('scale', this.scale);
    console.log(`pinchmove: scale updated to`, this.scale);
  },
  remove: function () {
    this.el.removeEventListener('pinchmove', this.handlePinchMove);
  }
});

// SOUND-TOGGLE: Tap entity to play/pause sound
AFRAME.registerComponent('sound-toggle', {
  init: function () {
    this.soundPlaying = false;
    this.el.addEventListener('click', (event) => {
      event.stopPropagation();
      const sound = this.el.components.sound;
      if (!sound) {
        console.log(`No sound component found on ${this.el.id}`);
        return;
      }
      if (this.soundPlaying) {
        sound.pauseSound();
        console.log(`Sound paused on ${this.el.id}`);
      } else {
        sound.playSound();
        console.log(`Sound played on ${this.el.id}`);
      }
      this.soundPlaying = !this.soundPlaying;
    });
    console.log(`sound-toggle registered on ${this.el.id || this.el.tagName}`);
  }
});

// Play existing animations on tap — no need to hardcode names
AFRAME.registerComponent('play-all-animations-on-click', {
  init: function () {
    this.el.addEventListener('click', (event) => {
      event.stopPropagation();

      const mixerComp = this.el.components['animation-mixer'];
      if (!mixerComp) {
        console.log(`No animation-mixer component found on ${this.el.id}`);
        return;
      }
      const mixer = mixerComp.mixer;
      if (!mixer) {
        console.log(`No mixer found on animation-mixer component for ${this.el.id}`);
        return;
      }
      const actions = mixer._actions || [];

      if (actions.length === 0) {
        console.log(`No animation clips found on ${this.el.id}`);
        return;
      }

      actions.forEach(action => {
        action.reset();
        action.play();
      });
      console.log(`Playing ${actions.length} animations on ${this.el.id}`);
    });
    console.log(`play-all-animations-on-click registered on ${this.el.id || this.el.tagName}`);
  }
});

// Setup event listeners after scene loaded
window.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');
  scene.addEventListener('loaded', () => {
    console.log('🟢 A-Frame scene loaded!');

    // Auto play sounds once on first tap anywhere (mobile autoplay policy)
    document.body.addEventListener('click', () => {
      ['elephant', 'tiger', 'rhino', 'muskcow'].forEach(id => {
        const entity = document.querySelector('#' + id);
        if (entity && entity.components.sound && !entity.components.sound.isPlaying) {
          entity.components.sound.playSound();
          if (entity.components['sound-toggle']) {
            entity.components['sound-toggle'].soundPlaying = true;
          }
          console.log(`Auto-playing sound for ${id}`);
        }
      });
    }, { once: true });
  });
});
