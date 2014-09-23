"use strict";

angular.module("projectsApp")
    .controller("MainCtrl", function ($scope, Compiler) {
        $scope.activeTab = 1;


        // global variables
        $scope.globals = [
            { name: "Background Color", variable: "$base-background-color", value: "#fff" },
            { name: "Text Color", variable: "$base-color", value: "#000" },
            { name: "Link Color", variable: "$link-color", value: "#4a87ee"}
        ];

        // color variables
        $scope.colors = [
            { name: "light", variable: "$light", value: "#fff" },
            { name: "stable", variable: "$stable", value: "#f8f8f8"},
            { name: "positive", variable: "$positive", value: "#4a87ee"},
            { name: "calm", variable: "$calm", value: "#43cee6"   },
            { name: "balanced", variable: "$balanced", value: "#66cc33"},
            { name: "energized", variable: "$energized", value: "#f0b840"},
            { name: "assertive", variable: "$assertive", value: "#ef4e3a"},
            { name: "royal", variable: "$royal", value: "#8a6de9" },
            { name: "dark", variable: "$dark", value: "#444"  }
        ];

        // font variables
        $scope.fonts = [
            {name: "Base - font size", variable: "$font-size-base", value: "14px"},
            {name: "Large - font size", variable: "$font-size-large", value: "18px"},
            {name: "Small - font size", variable: "$font-size-small", value: "11px"}
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
                    var _cCopy = angular.copy(colorsCopy);
                    _.each($scope.colors, function (item, index) {
                        item.value = _cCopy[index].value;
                    });
                    break;
                case "fonts" :
                    var _fCopy = angular.copy(fontsCopy);
                    _.each($scope.fonts, function (item, index) {
                        item.value = _fCopy[index].value;
                    });
                    break;
                default :
                    break;
            }
        };

        $scope.setActiveTab = function (index) {
            return $scope.activeTab = index;
        };

        $scope.download = function () {
            var data = _.union($scope.globals, $scope.colors, $scope.fonts);
            Compiler.post(data)
                .success(function (response) {
                    var id = response.id;
                    console.log(id);
                    if (response.success == true) {
                        var hiddenElement = document.createElement('a');
                        hiddenElement.href = '/api/compile/' + id;
                        hiddenElement.target = '_blank';
                        hiddenElement.download = 'ionic.app.css';
                        // hiddenElement.click();
                    }
                })
                .error(function (error) {

                })
        };

    });
