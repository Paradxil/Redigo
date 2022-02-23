import anime from 'animejs/lib/anime.es.js';

class Animator {
    constructor() {
        this.trackItems = {};
        this.tracks = {};
        this.renderers = {};
        this.factories = {};
        this.ctx = null;
        this.canvas = null;
        this.timeLine = null;
        this.wrapper = null;
        this.completeCallback = null;
    }

    play() {
        for (let id in this.trackItems) {
            let item = this.trackItems[id];
            let renderer = this.renderers[item.type];

            if (renderer && renderer.resume) {
                renderer.resume(item);
            }
        }

        this.timeLine?.play();
    }

    pause() {
        for(let id in this.trackItems) {
            let item = this.trackItems[id];
            let renderer = this.renderers[item.type];

            if(renderer && renderer.pause) {
                renderer.pause(item);
            }
        }

        this.timeLine?.pause();
    }

    restart() {
        this.timeLine?.pause();

        // Cleanup current running animation
        for(let id in this.trackItems) {
            let item = this.trackItems[id];
            let renderer = this.renderers[item.type];
            renderer?.complete(item);
        }

        this.timeLine?.restart();
    }

    init(canvas, wrapper, completeCallback) {
        if (canvas == null) {
            throw new Error('Canvas is not defined.')
        }

        if(wrapper == null) {
            throw new Error('Object wrapper is not defined.')
        }

        this.completeCallback = completeCallback;

        this.wrapper = wrapper;
        this.wrapper.style.position = 'relative';

        this.objectsWrapper = document.createElement("div");
        this.objectsWrapper.style.position = 'absolute';
        this.objectsWrapper.style.overflow = 'hidden';
        this.objectsWrapper.style.top = '0';
        this.objectsWrapper.style.left = '0';
        this.objectsWrapper.style.transformOrigin = 'top left';
        this.objectsWrapper.style.width = '100%';
        this.objectsWrapper.style.height = '100%';
        this.wrapper.appendChild(this.objectsWrapper);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.timeLine = anime.timeline();

        this.ctx.fillStyle = "#212529";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.timeLine = anime.timeline();
    }

    setTrack(name, track) {
        this.tracks[name] = track;
    }

    getTrack(name) {
        return this.tracks[name] || null;
    }

    setTrackItem(item) {
        this.trackItems[item.id] = item;
    }

    getTrackItem(id) {
        return this.trackItems[id];
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
            for (let trackItemID of track) {
                let trackItem = this.trackItems[trackItemID];

                if(!trackItem) {
                    console.log("Unable to find track item with id: " + trackItemID);
                    continue;
                }

                let factory = this.factories[trackItem.type];

                if(!factory) {
                    console.log("Unable to find factory for type: " + trackItemID.type);
                    continue
                }

                let renderer = this.renderers[trackItem.type];

                this.createElement(factory, trackItem);

                this.timeLine = this.timeLine.add({
                    targets: factory.target(trackItem),
                    duration: trackItem.duration,
                    begin: () => renderer?.begin?renderer.begin(trackItem, this.ctx, this.canvas):null,
                    complete: () => renderer?.complete ? renderer.complete(trackItem, this.ctx, this.canvas):null,
                    update: () => renderer?.render ? renderer.render(trackItem, this.ctx, this.canvas):null
                })
            }
        }
    }

    update() {
        while(this.objectsWrapper.firstChild) {
            this.objectsWrapper.removeChild(this.objectsWrapper.firstChild);
        }
        this.timeLine = anime.timeline({
            autoplay: !this.timeLine.paused,
            complete: this.completeCallback
        });
        this.animate();
    }

    createElement(factory, trackItem) {
        let objEl = factory.create(trackItem, this.canvas);
        objEl.style.display = 'none';
        trackItem.setEl(objEl);

        let objWrapper = document.createElement("div");
        objWrapper.id = trackItem.id;
        objWrapper.classList.add("object-wrapper");
        objWrapper.style.position = 'absolute';
        objWrapper.style.top = '0px';
        objWrapper.style.left = '0px';
        objWrapper.style.width = '100%';
        objWrapper.style.height = '100%';
        objWrapper.style.display = 'flex';
        objWrapper.style.placeContent = 'center';
        objWrapper.style.alignItems = 'center';
        objWrapper.appendChild(objEl);

        //let properties = getProperties(obj);
        //objWrapper.style = objectToStyle(properties);

        this.objectsWrapper.appendChild(objWrapper);
    }
}

export class TrackItem {
    constructor(id, name, type, data, duration, file) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.data = data;
        this.duration = duration;
        this.file = file;
        this.el = null;
    }

    setEl(el) {
        this.el = el;
    }

    getEl() {
        return this.el;
    }

    getData() {
        return this.data;
    }
}

// export class Track {
//     constructor() {
//         this.animations = [];
//     }

//     pushAnimation(type, name, obj, duration) {
//         this.animations.push({
//             name: name,
//             type: type,
//             obj: obj,
//             duration: duration
//         });
//     }

//     removeAnimation(index) {
//         this.animations.splice(index, 1);
//     }

//     getAnimations() {
//         return this.animations;
//     }

//     setAnimations(animations) {
//         this.animations = animations;
//     }
// }

// DEFAULT RENDERERS --------------------------------------------------
const VideoRenderer =  {
    begin: function(item) {
        if (item.getEl().paused) {
            item.getEl().play();
        }
    },
    complete: (item) => {
        item.getEl().pause();
        item.getEl().currentTime = 0;
    },
    pause: (item) => {
        item.getEl().pause();
    },
    resume: (item) => {
        item.getEl().play();
    },
    render: function (item, ctx, canvas) {
        if(item.getEl().paused) {
            return;
        }

        // Cover the canvas
        let size = Math.min(item.getEl().videoHeight, item.getEl().videoWidth);

        // Center the video
        let sx = (item.getEl().videoWidth - size) / 2;
        let sy = (item.getEl().videoHeight - size) / 2

        ctx.drawImage(item.getEl(), sx, sy, size, size, 0, 0, canvas.width, canvas.height);
    }   
}

const AudioRenderer = {
    render: function (item, ctx, canvas) {
        // if (currentTime >= timeLineFrame.start + timeLineFrame.duration) {
        //     if (!obj.el.paused) {
        //         obj.el.pause();
        //     }
        //     return;
        // }

        if (item.getEl().paused) {
            try {
                //item.getEl().currentTime = (currentTime - timeLineFrame.start) / 1000;
                item.getEl().play();
            }
            catch (err) {
                console.log("Unable to play audio.");
            }
        }
    }
} 

const DefaultRenderer = {
    begin: (item, ctx, canvas) => {
        item.getEl().style.display = 'block';
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    complete: (item) => {
        item.getEl().style.display = 'none';
    }
}


// DEFAULT FACTORIES ----------------------------------------------------

const VideoFactory = {
    create: (item) => {
        let videoEl = document.createElement("video");
        videoEl.classList.add('video');
        videoEl.style.display = 'none';
        videoEl.preload = 'auto';
        videoEl.src = item.file;
        videoEl.load();

        return videoEl;
    },
    target: (item) => {
        return item;
    }
}

const AudioFactory = {
    create: (item) => {
        var audioEl = document.createElement("AUDIO");
        audioEl.src = item.file.url;
        audioEl.preload = 'auto';
        audioEl.load();

        return audioEl;
    },
    target: (item) => {
        return item;
    }
}

const ImageFactory = {
    create: (item, canvas) => {
        var imgEl = document.createElement("img");
        imgEl.classList.add('image');
        imgEl.src = item.file;
        imgEl.style.height = '100%';
        imgEl.style.width = 'auto';
        imgEl.style.maxWidth = 'unset';
        return imgEl;
    },
    target: (item) => {
        return "#" + item.id;
    }
}

const TextFactory = {
    create: (item) => {
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
    target: (item) => {
        return "#" + item.id + " span";
    }
}

export default () => {
    let ani = new Animator();

    ani.addRenderer('video', VideoRenderer);
    ani.addRenderer('audio', AudioRenderer);
    ani.addRenderer('image', DefaultRenderer);

    ani.addFactory('image', ImageFactory);
    ani.addFactory('video', VideoFactory);
    ani.addFactory('audio', AudioFactory);
    ani.addFactory('text', TextFactory);

    return ani;
};