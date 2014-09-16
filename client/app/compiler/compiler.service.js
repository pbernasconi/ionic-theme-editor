'use strict';

angular.module('projectsApp')
    .service('Compiler', function ($http) {

        return {
            get: function (data) {
                return $http.get('/api/compile/');
            },
            post: function (data) {
                return $http.post('/api/compile/', data);
            }
        }

    });
