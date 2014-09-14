'use strict';

angular.module('projectsApp')
    .service('Compiler', function ($http) {

        return {
            get: function (data) {
                var request = $http.get('/api/compile');
                return request
            }
        }

    });
