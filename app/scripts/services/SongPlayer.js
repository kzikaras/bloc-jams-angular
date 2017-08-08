(function() {
    /**
     * @function SongPlayer
     * @desc Handles all play-pause-stop functionality of the app
     * @returns SongPlayer
     */
    function SongPlayer($rootScope, Fixtures) {
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
                stopSong(SongPlayer.currentSong);
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
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

        var stopSong = function(song){
            currentBuzzObject.stop();
            song.playing = null;
        };
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
         * @desc Current playback time(in seconds) of currently playing song
         * @type {number}
         */
        SongPlayer.currentTime = null;

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

        /**
         * @method SongPlayer.previous
         * @desc function that will allow the user to skip to a previous song
         */
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;

            if(currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
         * @method SongPlayer.next
         * @desc allows the user to skip to the next song
         */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            if(currentSongIndex > currentAlbum.songs.length) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

        /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {number} time
         */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        SongPlayer.volume = 80;

        if(currentBuzzObject) {
            while(currentBuzzObject.isPlaying()) {
                if(currentBuzzObject.ended()) {
                    SongPlayer.next();
                }
            }
            
        }
    
        /**
         * @function setVolume
         * @desc sets the volume of the current song
         * @param {number} volume
         */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
                SongPlayer.volume = volume;
            }
            
        };

        return SongPlayer;
    }

    

    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
    })();