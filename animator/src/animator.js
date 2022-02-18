import anime from 'animejs/lib/anime.es.js';

class Animator {
    constructor() {
        this.tracks = {};
        this.renderers = {};
        this.factories = {};
        this.ctx = null;
        this.canvas = null;
        this.timeLine = null;
        this.wrapper = null;
    }

    play() {
        this.timeLine?.play();
    }

    pause() {
        this.timeLine?.pause();
    }

    init(canvas, wrapper) {
        if (canvas == null) {
            throw new Error('Canvas is not defined.')
        }

        if(wrapper == null) {
            throw new Error('Object wrapper is not defined.')
        }

        this.wrapper = wrapper;
        this.wrapper.style.position = 'relative';
        this.wrapper.style.overflow = 'hidden';
        this.wrapper.style.transformOrigin = 'top left';
        this.wrapper.style.width = canvas.width + 'px';
        this.wrapper.style.height = canvas.height + 'px';

        this.objectsWrapper = document.createElement("div");
        this.wrapper.appendChild(this.objectsWrapper);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.timeLine = anime.timeline();

        this.ctx.fillStyle = "#212529";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    addTrack(name, track) {
        this.tracks[name] = track;
    }

    getTrack(name) {
        return this.tracks[name] || null;
    }

    addRenderer(name, renderer) {
        this.renderers[name] = renderer;
    }

    addFactory(name, factory) {
        this.factories[name] = factory;
    }

    animate() {
        for (let trackID in this.tracks) {
            let track = this.tracks[trackID];
            for (let animation of track.animations) {
                let factory = this.factories[animation.type];

                if(!factory) {
                    continue
                }

                let renderer = this.renderers[animation.type];

                this.createElement(factory, animation.obj, animation.name);

                this.timeLine = this.timeLine.add({
                    targets: factory.target(animation.name, animation.obj),
                    duration: animation.duration,
                    begin: () => renderer?.begin?renderer.begin(animation.obj, this.ctx, this.canvas):null,
                    complete: () => renderer?.complete?renderer.complete(animation.obj, this.ctx, this.canvas):null,
                    update: () => renderer?.render?renderer.render(this.ctx, this.canvas, animation.obj, animation, this.timeLine.currentTime):null
                })
            }
        }
    }

    update() {
        this.timeLine.pause();
        while(this.objectsWrapper.firstChild) {
            this.objectsWrapper.removeChild(this.objectsWrapper.firstChild);
        }
        this.timeLine = anime.timeline();
        this.animate();
    }

    createElement(factory, obj, id) {
        let objEl = factory.create(obj, this.canvas);
        obj.el = objEl;
        obj.el.style.display = 'none';

        let objWrapper = document.createElement("div");
        objWrapper.id = id;
        objWrapper.classList.add("object-wrapper");
        objWrapper.style.position = 'absolute';
        objWrapper.style.top = '0px';
        objWrapper.style.left = '0px';
        objWrapper.appendChild(objEl);

        //let properties = getProperties(obj);
        //objWrapper.style = objectToStyle(properties);

        this.objectsWrapper.appendChild(objWrapper);
    }
}

export class Track {
    constructor() {
        this.animations = [];
    }

    pushAnimation(type, name, obj, duration) {
        this.animations.push({
            name: name,
            type: type,
            obj: obj,
            duration: duration
        });
    }

    removeAnimation(index) {
        this.animations.splice(index, 1);
    }

    getAnimations() {
        return this.animations;
    }

    setAnimations(animations) {
        this.animations = animations;
    }
}

// DEFAULT RENDERERS --------------------------------------------------
const VideoRenderer =  {
    begin: function(obj) {
        if (obj.el.paused) {
            obj.el.play();
        }
    },
    complete: (obj, ctx, canvas) => {
        obj.el.pause();
    },
    render: function (ctx, canvas, obj, timeLineFrame, currentTime) {
        // if (currentTime >= timeLineFrame.duration) {
        //     if (!obj.el.paused) {
        //         obj.el.pause();
        //     }
        //     return;
        // }

        // if (obj.el.paused && currentTime / 1000 < obj.el.duration) {
        //     try {
        //         obj.el.currentTime = currentTime / 1000;
        //         obj.el.play();
        //     }
        //     catch (err) {
        //         console.log("Unable to play video.");
        //     }
        // }

        if(obj.el.paused) {
            return;
        }

        // Cover the canvas
        let size = Math.min(obj.el.videoHeight, obj.el.videoWidth);

        // Center the video
        let sx = (obj.el.videoWidth - size) / 2;
        let sy = (obj.el.videoHeight - size) / 2

        ctx.drawImage(obj.el, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
    }   
}

const AudioRenderer = {
    render: function (ctx, canvas, obj, timeLineFrame, currentTime) {
        if (currentTime >= timeLineFrame.start + timeLineFrame.duration) {
            if (!obj.el.paused) {
                obj.el.pause();
            }
            return;
        }

        if (obj.el.paused) {
            try {
                obj.el.currentTime = (currentTime - timeLineFrame.start) / 1000;
                obj.el.play();
            }
            catch (err) {
                console.log("Unable to play audio.");
            }
        }
    }
} 

const DefaultRenderer = {
    begin: (obj, ctx, canvas) => {
        obj.el.style.display = 'block';
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    complete: (obj) => {
        obj.el.style.display = 'none';
    }
}


// DEFAULT FACTORIES ----------------------------------------------------

const VideoFactory = {
    create: (obj) => {
        let videoEl = document.createElement("video");
        videoEl.classList.add('video');
        videoEl.style.display = 'none';
        videoEl.preload = 'auto';
        videoEl.src = obj.src;
        videoEl.load();

        return videoEl;
    },
    target: (id, obj) => {
        return obj;
    }
}

const AudioFactory = {
    create: (obj) => {
        var audioEl = document.createElement("AUDIO");
        audioEl.src = obj.src;
        audioEl.preload = 'auto';
        audioEl.load();

        return audioEl;
    },
    target: (id, obj) => {
        return obj;
    }
}

const ImageFactory = {
    create: (obj, canvas) => {
        var imgEl = document.createElement("img");
        imgEl.classList.add('image');
        imgEl.src = obj.src;
        imgEl.style.height = canvas.width + 'px';
        imgEl.style.width = 'auto';
        imgEl.style.maxWidth = 'unset';
        return imgEl;
    },
    target: (id, obj) => {
        return "#" + id;
    }
}

const TextFactory = {
    create: (obj) => {
        let textElWrapper = document.createElement("div");
        textElWrapper.classList.add("text-wrapper")

        let words = obj.content.split(' ');

        let wordIndex = 0;
        for (let word of words) {
            let wordElWrapper = document.createElement("div");
            wordElWrapper.classList.add("word-wrapper");

            if (obj.wordStyle && obj.wordStyle.length > wordIndex) {
                wordElWrapper.style = objectToStyle(obj.wordStyle[wordIndex]);
            }

            for (let char of word) {
                let charElWrapper = document.createElement("span");
                let charEl = document.createTextNode(char);

                charElWrapper.appendChild(charEl);
                wordElWrapper.appendChild(charElWrapper);
            }

            textElWrapper.appendChild(wordElWrapper);
            wordIndex += 1;
        }

        return textElWrapper;
    },
    target: (id, obj) => {
        return "#" + id + " span";
    }
}

const ani = new Animator();

ani.addRenderer('video', VideoRenderer);
ani.addRenderer('audio', AudioRenderer);
ani.addRenderer('image', DefaultRenderer);

ani.addFactory('image', ImageFactory);
ani.addFactory('video', VideoFactory);
ani.addFactory('audio', AudioFactory);
ani.addFactory('text', TextFactory);

export default ani;