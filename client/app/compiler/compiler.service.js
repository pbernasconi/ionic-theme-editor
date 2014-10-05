'use strict';

angular.module('projectsApp')
    .service('Compiler', function ($http) {

        return {
            get: function (data) {
                return $http.get('/api/compile/');
            },
            post: function (data, cssType) {
                return $http.post('/api/compile/' + cssType, data);
            }
        }

    });
