'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: ['assets/css']
        },
        files: {
          'dist/css/ChromaOS.css': 'src/styles/less/Main.less',
          'docs/css/ChromaOS.css': 'src/styles/less/Main.less'
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 4000,
          hostname: '*',
          base: 'docs',
          keepalive: true,
          onCreateServer: function(server, connect, options) {}
        }
      }
    },
    jshint: {
      'options': {
        'jshintrc': true
      },
      'source': {
        'src': ['src/**/*.js']
      },
      'grunt': {
        'src': ['Gruntfile.js']
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'src/kernel/*.js',
          'src/kernel/**/*.js',
          'src/services/*.js',
          'src/services/**/*.js',
          'src/modules/*.js',
          'src/modules/**/*.js',
          '.tmp/**/*.js',
          'src/*.js',
          // 'src/**/*.js',
        ],
        dest: 'dist/js/ChromaOS.js'
      },
    },
    copy: {
      dist: {
        files: {
          'docs/js/ChromaOS.js': 'dist/js/ChromaOS.js'
            // 'dist/js/ChromaOS.js': 'docs/js/ChromaOS.js'
        }
      }
    },
    uglify: {
      'dist': {
        files: {
          'dist/js/ChromaOS.min.js': ['dist/js/ChromaOS.js'],
          'docs/js/ChromaOS.min.js': ['dist/js/ChromaOS.js']
        }
      }
    },
    ngAnnotate: {
      'dist': {
        files: {
          'dist/js/ChromaOS.min.js': ['dist/js/ChromaOS.js'],
          'docs/js/ChromaOS.min.js': ['dist/js/ChromaOS.js']
        }
      }
    },
    clean: {
      build: {
        src: ['.tmp', 'dist']
      }
    },
    html2js: {
      options: {
        // custom options, see below
				module: 'ChromaOS.Templates'
      },
      main: {
        src: ['src/**/*.html'],
        dest: '.tmp/js/templates/client.templates.js'
      },
    },
    cssmin: {
      dist: {
        files: {
          'dist/css/ChromaOS.min.css': ['dist/css/ChromaOS.css'],
          'docs/css/ChromaOS.min.css': ['dist/css/ChromaOS.css'],
        }
      },
    }
  });

  // Load the plugin that provides the 'less' task.
  grunt.loadNpmTasks('grunt-contrib-less');

  // Load the plugin that provides the 'connect' task.
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Load the plugin that provides the 'jshint' task.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Load the plugin that provides the 'concat' task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the 'uglify' task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the 'clean' task.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Load the plugin that provides the 'copy' task.
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Load the plugin that provides the 'html2js' task.
  grunt.loadNpmTasks('grunt-html2js');

  // Load the plugin that provides the 'ng-annotate' task.
  grunt.loadNpmTasks('grunt-ng-annotate');

  // Load the plugin that provides the 'cssmin' task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', [
    'clean',
    'jshint',
    'html2js',
    'concat',
    'less',
    'uglify',
    // 'ngAnnotate',
    'cssmin',
    'copy',
    'connect'
  ]);
};
