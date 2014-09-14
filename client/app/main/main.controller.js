'use strict';

angular.module('projectsApp')
    .controller('MainCtrl', function ($scope, $http) {

        // globals

        $scope.backgroundColor = "#fff";
        $scope.textColor = "#000";


        // color variables
        $scope.lightColor = "#fff";
        $scope.stableColor = "#f8f8f8";
        $scope.positiveColor = "#4a87ee";
        $scope.calmColor = "#43cee6";
        $scope.balancedColor = "#66cc33";
        $scope.energizedColor = "#f0b840";
        $scope.assertiveColor = "#ef4e3a";
        $scope.royalColor = "#8a6de9";
        $scope.darkColor = "#444";

        $scope.revert = function (list) {
            switch (list) {
                case "globals" :
                    break;
                case "colors" :
                    break;
                default :
                    break;
            }
        }

    });
