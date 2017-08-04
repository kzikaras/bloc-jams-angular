(function() {
    /**
     * @function SongPlayer
     * @desc Handles all play-pause-stop functionality of the app
     * @returns SongPlayer
     */
    function SongPlayer(Fixtures) {
        var SongPlayer = {};

        /**
         * @desc Holds the current album
         * @type {Object}
         */
        var currentAlbum = Fixtures.getAlbum();
       
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
                SongPlayer.currentSong.playing = null;
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            SongPlayer.currentSong = song;
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
         * @desc Gets the index of the song
         * @param {Object} song
         * @returns returns the index of a song 
         */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };

         /**
         * @desc current song object
         * @type {Object}
         */
        SongPlayer.currentSong = null;

        /**
         * @method SongPlayer.play
         * @desc handles the play functionality by deciding what will happen depending on if a song is playing or not
         * @param {object} song
         */
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if(SongPlayer.currentSong === song) {
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
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

        /**@method SongPlayer.previous
         * @desc function that will allow the user to skip to a previous song
         */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if(currentSongIndex < 0) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        return SongPlayer;
    }

    angular
        .module('blocJams')
        .factory('SongPlayer', ['Fixtures', SongPlayer]);
    })();