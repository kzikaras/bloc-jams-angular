(function() {
    /**
     * @function SongPlayer
     * @desc Handles all play-pause-stop functionality of the app
     * @returns SongPlayer
     */
    function SongPlayer() {
        var SongPlayer = {};

       
        /**
        * @desc Buzz Object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;

        /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song 
         */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                songPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            songPlayer.currentSong = song;
        };

        /**
         * @function playSong
         * @desc plays the current song and sets the playing attribute to True
         * @param {object} song 
         */
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        }

         /**
         * @desc current song object
         * @type {Object}
         */
        SongPlayer.songPlayer.currentSong = null;

        /**
         * @method SongPlayer.play
         * @desc handles the play functionality by deciding what will happen depending on if a song is playing or not
         * @param {object} song
         */
        SongPlayer.play = function(song) {
            if (songPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if(songPlayer.currentSong === song) {
                if(currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        /**
         * @method SongPlayer.pause
         * @desc handles the pause functionality
         * @param {Object} song
         */
        SongPlayer.pause = function(song) {
            currentBuzzObject.pause();
            song.playing = false;
        };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
    })();