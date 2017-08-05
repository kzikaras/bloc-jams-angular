(function() {
    function seekBar($document) {
        /**
         * @desc calculates the percentage of the seek bar
         * @param {element} seekBar 
         * @param {function} event
         * @returns offsetXPercent 
         */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        }

        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: { },
            link: function(scope, element, attirbutes) {
                scope.value = 0;
                scope.max = 100;

                /**
                 * @desc holds the seek bar element
                 */
                var seekBar = $(element);

                /**
                 * @desc creates a percentage that can be used to show the bar fill
                 * @returns a percentage
                 */
                var percentString = function () {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };

                /**
                 * @desc handles the amount of fill sent to the seek bar
                 * @returns fill to seek bar
                 */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                /**
                 * @desc handles the click functionality of seekbar by setting the percentage
                 * @param {function} event
                 */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                };

                /**
                 * @desc tracks the location of the thumb/mouse
                 */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                        });
                    });

                    $document.bind('mouseup.thumb', function() {
                    $document.unbind('mousemove.thumb');
                    $document.unbind('mouseup.thumb');
                    });
                };

                /**
                 * @desc returns the percentage of the seek bar fill
                 * @returns amount of fill
                 */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                };
            }
        };
    }

    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();