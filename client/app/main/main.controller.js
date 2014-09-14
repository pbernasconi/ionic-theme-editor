'use strict';

angular.module('projectsApp')
    .controller('MainCtrl', function ($scope, $http) {

        // globals
        $scope.globals = [
            { name: "Background Color", value: "#fff" },
            {  name: "Text Color", value: "#000" },
            { name: "Link Color", value: "#fff"}
        ];


        // color variables
        $scope.colors = [
            { name: "light", value: "#fff" },
            { name: "stable", value: "#f8f8f8"},
            { name: "positive", value: "#4a87ee"},
            { name: "calm", value: "#43cee6"   },
            { name: "balanced", value: "#66cc33"},
            { name: "energized", value: "#f0b840"},
            { name: "assertive", value: "#ef4e3a"},
            { name: "royal", value: "#8a6de9" },
            { name: "dark", value: "#444"  }
        ];

        $scope.fonts = [
            {name: "Base - font size", value: "14px"},
            {name: "Large - font size", value: "18px"},
            {name: "Small - font size", value: "11px"}
        ];

        var globalsCopy = angular.copy($scope.globals);
        var colorsCopy = angular.copy($scope.colors);
        var fontsCopy = angular.copy($scope.fonts);

        $scope.revert = function (list) {
            switch (list) {
                case "globals" :
                    var _gCopy = angular.copy(globalsCopy);
                    _.each($scope.globals, function (item, index) {
                        item.value = _gCopy[index].value;
                    });
                    break;
                case "colors" :
                    var _Ccopy = angular.copy(colorsCopy);
                    _.each($scope.colors, function (item, index) {
                        item.value = _Ccopy[index].value;
                    });
                    break;
                default :
                    break;
            }
        }

    });
