// ROTATABLE: Drag to rotate entity
AFRAME.registerComponent('rotatable', {
  init: function () {
    this.rotation = this.el.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
    this.handleDragMove = this.handleDragMove.bind(this);
    this.el.sceneEl.addEventListener('dragmove', this.handleDragMove);
    console.log(`rotatable registered on ${this.el.id || this.el.tagName}`);
  },
  handleDragMove: function (event) {
    if (event.target !== this.el) return;
    console.log(`dragmove fired for ${this.el.id}`, event.detail);
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
    this.scale = this.el.getAttribute('scale') || { x: 1, y: 1, z: 1 };
    this.handlePinchMove = this.handlePinchMove.bind(this);
    this.el.sceneEl.addEventListener('pinchmove', this.handlePinchMove);
    console.log(`scalable registered on ${this.el.id || this.el.tagName}`);
  },
  handlePinchMove: function (event) {
    if (event.target !== this.el) return;
    console.log(`pinchmove fired for ${this.el.id}`, event.detail);
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

// SOUND-TOGGLE: Tap entity to play/pause sound
AFRAME.registerComponent('sound-toggle', {
  init: function () {
    this.soundPlaying = false;
    this.el.addEventListener('click', (event) => {
      event.stopPropagation();
      console.log(`click fired on sound-toggle for ${this.el.id}`);
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

// Ensure all the below runs AFTER scene is loaded
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('a-scene').addEventListener('loaded', () => {
    console.log('🟢 A-Frame scene loaded!');

    // Play sounds once on first tap (mobile requirement)
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

    // Elephant Animation: idle/walk toggle
    const elephant = document.querySelector('#elephant');
    if (elephant) {
      let animationState = "idle";
      elephant.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log(`Elephant clicked, current animation state: ${animationState}`);
        if (animationState === "idle") {
          elephant.setAttribute('animation__walk', {
            property: 'position',
            to: '1 0 0',
            dur: 3000,
            loop: true,
            easing: 'linear'
          });
          elephant.setAttribute('animation__idle', { enabled: false });
          animationState = "walk";
          console.log('Elephant switched to walk animation');
        } else {
          elephant.setAttribute('animation__walk', { enabled: false });
          elephant.setAttribute('animation__idle', {
            property: 'rotation',
            to: '0 360 0',
            dur: 5000,
            loop: true,
            easing: 'linear'
          });
          animationState = "idle";
          console.log('Elephant switched to idle animation');
        }
      });
      console.log('Elephant animation toggle initialized');
    }

    // Tiger Animation: Standing/Sleeping toggle
    const tiger = document.querySelector('#tiger');
    if (tiger) {
      const tigerClips = ['Standing', 'Sleeping'];
      let currentClipIndex = 0;
      tiger.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log(`Tiger clicked. Current clip index: ${currentClipIndex}`);
        tiger.setAttribute('animation-mixer', { clip: null });  // Disable all animations first
        setTimeout(() => {
          tiger.setAttribute('animation-mixer', {
            clip: tigerClips[currentClipIndex],
            loop: 'repeat'
          });
          console.log(`Tiger animation set to clip: ${tigerClips[currentClipIndex]}`);
        }, 50);
        currentClipIndex = (currentClipIndex + 1) % tigerClips.length;
      });
      // Start with "Standing"
      tiger.setAttribute('animation-mixer', {
        clip: tigerClips[0],
        loop: 'repeat'
      });
      console.log('Tiger animation toggle initialized');
    }

    // Rhino Animation: idle/walk toggle
    const rhino = document.querySelector('#rhino');
    if (rhino) {
      let animationState = "idle";
      rhino.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log(`Rhino clicked, current animation state: ${animationState}`);
        if (animationState === "idle") {
          rhino.setAttribute('animation__walk', {
            property: 'position',
            to: '1 0 0',
            dur: 3000,
            loop: true,
            easing: 'linear'
          });
          rhino.setAttribute('animation__idle', { enabled: false });
          animationState = "walk";
          console.log('Rhino switched to walk animation');
        } else {
          rhino.setAttribute('animation__walk', { enabled: false });
          rhino.setAttribute('animation__idle', {
            property: 'rotation',
            to: '0 360 0',
            dur: 5000,
            loop: true,
            easing: 'linear'
          });
          animationState = "idle";
          console.log('Rhino switched to idle animation');
        }
      });
      console.log('Rhino animation toggle initialized');
    }

    // Musk Cow Animation: idle/walk toggle
    const muskcow = document.querySelector('#muskcow');
    if (muskcow) {
      let animationState = "idle";
      muskcow.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log(`Musk Cow clicked, current animation state: ${animationState}`);
        if (animationState === "idle") {
          muskcow.setAttribute('animation__walk', {
            property: 'position',
            to: '1 0 0',
            dur: 3000,
            loop: true,
            easing: 'linear'
          });
          muskcow.setAttribute('animation__idle', { enabled: false });
          animationState = "walk";
          console.log('Musk Cow switched to walk animation');
        } else {
          muskcow.setAttribute('animation__walk', { enabled: false });
          muskcow.setAttribute('animation__idle', {
            property: 'rotation',
            to: '0 360 0',
            dur: 5000,
            loop: true,
            easing: 'linear'
          });
          animationState = "idle";
          console.log('Musk Cow switched to idle animation');
        }
      });
      console.log('Musk Cow animation toggle initialized');
    }
  });
});
