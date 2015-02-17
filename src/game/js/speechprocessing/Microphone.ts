import AudioStorageConsumer = require('./AudioStorageConsumer');
import RecognizerConsumer = require('./RecognizerConsumer');
import SpeechSettings = require('./SpeechSettings');
import WordBank = require('./WordBank');

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

    private settings : SpeechSettings;
    private wordBank : WordBank;

    constructor(clientReadyFunction : Function, settings : SpeechSettings, wordBank : WordBank) {
        this.settings = settings;
        this.wordBank = wordBank;
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

        this.spawnConsumers(() => {
            this.clientReadyFunction();
        });
    }

    /**
     * Spawns the consumers of the audio stream
     * @param {Function} The callback to execute when finished
     */
    private spawnConsumers(callback : Function) {
        console.log("Spawning Consumer Workers...");

        this.spawnWorker("js/vendor/recognizer.js", (recognizerWorker : Worker) => {
            // Create a recognizer consumer and keep a reference to it
            this.recognizerConsumer = new RecognizerConsumer(recognizerWorker, this.settings);

            // The recognizer js api needs a special startup script for the worker
            this.recognizerConsumer.initWorkerData(() => {
                console.log("Recognizer Consumer spawned...");

                // Create a storage consumer and keep a reference to it
                this.storageConsumer = new AudioStorageConsumer();

                console.log("Storage Consumer spawned...");

                // Attach consumers to recorder
                this.audioRecorder.consumers = [this.storageConsumer, this.recognizerConsumer];

                callback();
            });
        });
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
            if (!this.audioRecorder.consumers || this.audioRecorder.consumers.length == 0) {
                // No consumers present
                throw 'Error in starting audio stream: No consumers present';
            }

            // Start recording
            this.currentlyRecording = true;
            this.audioRecorder.start(this.wordBank.getCurrentIndex());
            callback();
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



            var samples = this.storageConsumer.getSamples();
            var hypothesis = this.recognizerConsumer.getHypotheses();

            this.storageConsumer.clear();
            this.recognizerConsumer.clear();

            // Return storage samples
            return [samples, hypothesis];
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