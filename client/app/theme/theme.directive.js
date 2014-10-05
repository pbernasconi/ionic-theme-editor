'use strict';

angular.module('projectsApp')
    .directive('theme', function () {
        return {
            restrict: 'EA',
            scope: {
                theme: '=',
                callBack: '&onLoad'
            },
            link: function ($scope, $element, $attr) {
                var cw;
                $element.ready(function () {
                    cw = $element[0].contentWindow;
                });

                $element.on('load', function () {
                    return $scope.callBack();
                });

                var updatePreview = function (colors) {
                    if (!cw) {
                        return;
                    }
                    cw.IonicThemer && cw.IonicThemer.update(colors);
                };

                $scope.$watch('theme', function (nv, ov) {
                    updatePreview(nv);
                }, true);
            }
        }
    });
