import AudioStorageConsumer = require('./AudioStorageConsumer');

// Vanilla javascript / audio api declarations for typescript
declare var AudioContext : any;
declare var window : any;
declare var navigator : any;
declare var AudioRecorder : any;

// Deal with prefixed APIs
window.AudioContext = window.AudioContext || window.webkitAudioContext;
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

/**
 * Manages communication with the device microphone
 */
class Microphone {
    private currentlyRecording : boolean;
    private audioContext : any;
    private audioRecorder : any;
    private clientReadyFunction : Function;
    private storageConsumer : AudioStorageConsumer;

    constructor(clientReadyFunction : Function) {
        this.currentlyRecording = false;
        this.audioRecorder = null;
        this.clientReadyFunction = clientReadyFunction;

        try {
            this.audioContext = new window.AudioContext();
        } catch (e) {
            console.log("Error initializing Web Audio");
        }

        // Get user permissions for audio capture
        if (navigator.getUserMedia) {
            navigator.getUserMedia
                ({audio: true},
                (stream) => {this.onInitAudio(stream)},
                (e) => {console.log("No live audio input in this browser");});
        } else {
            throw "No web audio support in this browser";
        }
    }

    /**
     * Called when user grants permission to initialize audio capture
     */
    private onInitAudio(stream : any) {
        var input = this.audioContext.createMediaStreamSource(stream);
        this.audioRecorder = new AudioRecorder(input, {worker : './js/vendor/audioRecorderWorker.js'});
        this.clientReadyFunction();
    }

    /**
     * Start recording with the device microphone.
     * If the microphone is not yet ready or it is currently recording, it will do nothing.
     */
    public start() : void {
        if (!this.currentlyRecording && this.audioRecorder != null) {
            // A consumer listens to the recording and does something as it records
            // In this case we are simply storing it with a storage consumer.

            // Create a storage consumer and keep a reference to it
            this.storageConsumer = new AudioStorageConsumer();

            // TODO: Create and attach additional consumers, most importantly figure out how to generate
            //       a phoneme detector consumer web worker
            this.audioRecorder.consumers = [this.storageConsumer];

            // Start recording
            this.currentlyRecording = true;
            this.audioRecorder.start();
        }
    }

    /**
     * Stop recording with the device microphone
     * Does nothing if recording has yet to begin, or if the microphone is not yet ready.
     * @returns the audio samples recorded.
     */
    public stop() : any {
        if (this.currentlyRecording && this.audioRecorder != null) {
            // Stop recording
            this.audioRecorder.stop();
            this.currentlyRecording = false;

            // Return storage samples
            return this.storageConsumer.getSamples();
        }
    }

    /**
     * Find out if the program is currently recording
     * @returns {boolean} True if recording, false otherwise
     */
    public isRecording() : boolean {
        return this.currentlyRecording;
    }
}

export = Microphone;