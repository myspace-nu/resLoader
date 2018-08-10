module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*!\n'+
                ' * JavaScript resource loader v<%= pkg.version %>\n'+
                ' * https://github.com/myspace-nu\n'+
                ' *\n'+
                ' * Copyright 2018 Johan Johansson\n'+
                ' * Released under the MIT license\n'+
                ' */\n'
            },
            build: {
                src: 'src/resLoader.js',
                dest: 'dist/resLoader.min.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify']);
};