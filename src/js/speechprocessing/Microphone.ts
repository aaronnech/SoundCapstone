import AudioStorageConsumer = require('./AudioStorageConsumer');
import RecognizerConsumer = require('./RecognizerConsumer');

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
    private recognizerConsumer : RecognizerConsumer;

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
            navigator.getUserMedia({audio: true},
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
     * Spawns a worker at a particular URL
     * @param workerURL the JS file to spawn a worker for
     * @param onReady the callback to call when the worker is ready
     */
    private spawnWorker(workerURL : string, onReady : Function) {
        var worker : Worker = new Worker(workerURL);
        worker.onmessage = function(_) {
            onReady(worker);
        };
        worker.postMessage('');
    }

    /**
     * Start recording with the device microphone.
     * If the microphone is not yet ready or it is currently recording, it will do nothing.
     * @param callback The function to call when recording has started
     */
    public start(callback : Function) : void {
        if (!this.currentlyRecording && this.audioRecorder != null) {
            // A consumer listens to the recording and does something as it records
            // In this case we are simply storing it with a storage consumer.

            this.spawnWorker("js/vendor/recognizer.js", (recognizerWorker : Worker) => {
                // Create a recognizer consumer and keep a reference to it
                this.recognizerConsumer = new RecognizerConsumer(recognizerWorker);
                // The recognizer js api needs a special startup script for the worker
                this.recognizerConsumer.initWorkerData(() => {
                    // Create a storage consumer and keep a reference to it
                    this.storageConsumer = new AudioStorageConsumer();

                    // Attach consumers to recorder
                    this.audioRecorder.consumers = [this.storageConsumer, this.recognizerConsumer];

                    // Start recording
                    this.currentlyRecording = true;
                    this.audioRecorder.start();

                    callback();
                });
            });
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

            console.log(this.recognizerConsumer.getHypotheses());

            // Return storage samples
            return [this.storageConsumer.getSamples(), this.recognizerConsumer.getHypotheses()];
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