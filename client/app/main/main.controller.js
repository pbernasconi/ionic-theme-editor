"use strict";

angular.module("projectsApp")

    .controller("MainCtrl", function ($scope, $timeout, ngDialog) {

        // initial variables
        $scope.activeTab = 1;
        $scope.selectedButtonBar = 0;
        $scope.iframeLoaded = false;

        // Global variables
        $scope.globals = [
            {name: "Background Color", variable: "$base-background-color", value: "#fff", type: "color"},
            {name: "Text Color", variable: "$base-color", value: "#000", type: "color"},
            {name: "Link Color", variable: "$link-color", value: "#4a87ee", type: "color"}
        ];

        // Color variables
        $scope.colors = [
            {name: "light", variable: "$light", value: "#fff", type: "color"},
            {name: "stable", variable: "$stable", value: "#f8f8f8", type: "color"},
            {name: "positive", variable: "$positive", value: "#4a87ee", type: "color"},
            {name: "calm", variable: "$calm", value: "#43cee6", type: "color"},
            {name: "balanced", variable: "$balanced", value: "#66cc33", type: "color"},
            {name: "energized", variable: "$energized", value: "#f0b840", type: "color"},
            {name: "assertive", variable: "$assertive", value: "#ef4e3a", type: "color"},
            {name: "royal", variable: "$royal", value: "#8a6de9", type: "color"},
            {name: "dark", variable: "$dark", value: "#444", type: "color"}
        ];

        // Font variables
        $scope.fonts = [
            {name: "Font Family", variable: "$font-family-base", value: "$font-family-sans-serif", type: "select"},
            {name: "Base - font size", variable: "$font-size-base", value: "14px", type: "pixel"},
            {name: "Large - font size", variable: "$font-size-large", value: "18px", type: "pixel"},
            {name: "Small - font size", variable: "$font-size-small", value: "11px", type: "pixel"}
        ];

        // Padding variables
        $scope.padding = [
            {name: "Content Padding", variable: "$content-padding", value: "10px", type: "pixel"},
            {name: "Base - Vertical", variable: "$padding-base-vertical", value: "6px", type: "pixel"},
            {name: "Base - Horizontal", variable: "$padding-base-horizontal", value: "12px", type: "pixel"},
            {name: "Small - Vertical", variable: "$padding-small-vertical", value: "5px", type: "pixel"},
            {name: "Small - Horizontal", variable: "$padding-small-horizontal", value: "10px", type: "pixel"},
            {name: "Large - Vertical", variable: "$padding-large-vertical", value: "10px", type: "pixel"},
            {name: "Large - Horizontal", variable: "$padding-large-horizontal", value: "16px", type: "pixel"}
        ];

        // collect all data together
        $scope.groupedVars = _.union($scope.globals, $scope.colors, $scope.fonts, $scope.padding);

        // make copies for revert case
        var globalsCopy = angular.copy($scope.globals);
        var colorsCopy = angular.copy($scope.colors);
        var fontsCopy = angular.copy($scope.fonts);
        var paddingCopy = angular.copy($scope.padding);

        // setting the button-bar radio like
        $scope.setButtonBar = function (index) {
            $scope.selectedButtonBar = index;
        };

        // return index of selected button bar
        $scope.isButtonBar = function (index) {
            return index === $scope.selectedButtonBar;
        };


        // revert to original data with switch - case
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

                case "padding" :
                    var _pCopy = angular.copy(paddingCopy);
                    _.each($scope.padding, function (item, index) {
                        item.value = _pCopy[index].value;
                    });
                    break;
                default :
                    break;
            }
        };

        // set the active tab
        $scope.setActiveTab = function (index) {
            if (index == 1) {
                $scope.iframeLoaded = false;
                $scope.iframeCallback();
            }
            return $scope.activeTab = index;
        };


        // iframe loaded
        $scope.iframeCallback = function () {
            $timeout(function () {
                $scope.iframeLoaded = true;
            }, 1000);
        };

        // open modal with download button
        $scope.prepDownload = function () {
            ngDialog.open({
                template: 'downloadModal',
                data: {sassData: $scope.groupedVars},
                controller: 'DownloadModal',
                scope: $scope
            })
        };
    })


    // Download Controller for modal
    .controller("DownloadModal", function ($scope, ngDialog, Compiler) {

        $scope.filename = "ionic.app.css";
        $scope.cssType = "compressed";

        var data = $scope.groupedVars;
        $scope.modalDownload = function () {
            Compiler.post(data, $scope.cssType)
                .success(function (response) {
                    if (response.success == true) {
                        var id = response.id;
                        console.log(id);

                        var hiddenElement = document.createElement('a'); // create new A element and self click to download
                        hiddenElement.href = '/api/compile/download/' + id + '/' + $scope.filename;
                        hiddenElement.target = '_blank';
                        hiddenElement.download = 'ionic.app.css';
                        hiddenElement.click();
                    }
                })
                .error(function (error) {
                    console.log(error);
                    alert("An error occurred : ", error);
                })
        };

        $scope.modalClose = function () {
            ngDialog.close();
        };
    });
