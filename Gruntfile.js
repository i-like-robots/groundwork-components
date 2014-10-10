module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['**/*.js'],
                    dest: 'dist/js'
                }]
            }
        },
        jshint: {
            all: ['src/js/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['**/*.css'],
                    dest: 'dist/css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);

};
