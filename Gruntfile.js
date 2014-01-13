module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/js',
            src: ['**/*.js'],
            dest: 'dist/js'
          }
        ]
      }
    },
    jshint: {
      all: ['src/js/**/*.js'],
      options: {
        maxdepth: 4,
        curly: true,
        newcap: true,
        eqeqeq: true,
        browser: true,
        trailing: true,
        globals: {
          jquery: true,
          define: false,
          exports: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['jshint', 'uglify']);

};