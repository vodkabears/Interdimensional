module.exports = function(grunt) {
  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON('bower.json'),

    // Banner definitions
    meta: {
      banner: '/*\n' +
        ' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
        ' *  <%= pkg.description %>\n' +
        ' *  <%= pkg.homepage %>\n' +
        ' *\n' +
        ' *  Made by <%= pkg.authors[0] %>\n' +
        ' *  Under <%= pkg.license %> License\n' +
        ' */\n' +
        '\n'
    },

    // Concat definitions
    concat: {
      dist: {
        files: {
          'dist/interdimensional.js': 'src/interdimensional.js',
          'dist/interdimensional.css': 'src/interdimensional.css'
        },
        options: {
          banner: '<%= meta.banner %>'
        }
      }
    },

    // Lint definitions
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'src/**/*.js'
      },
      test: {
        src: 'spec/**/*.js'
      },
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // JavaScript Code Style definitions
    jscs: {
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'src/**/*.js'
      },
      test: {
        src: 'spec/**/*.js'
      },
      options: {
        preset: 'airbnb',
        disallowMultipleVarDecl: true,
        requireMultipleVarDecl: null,
        safeContextKeyword: null
      }
    },

    // Jasmine tests definitions
    jasmine: {
      test: {
        src: 'src/**/*.js',
        options: {
          styles: 'src/**/*.css',
          specs: 'spec/*.spec.js',
          helpers: 'spec/helpers/*.js'
        }
      }
    },

    // CSScomb definitions
    csscomb: {
      src: {
        files: {
          'src/interdimensional.css': 'src/interdimensional.css'
        }
      },
      dist: {
        files: {
          'dist/interdimensional.css': 'dist/interdimensional.css'
        }
      }
    },

    autoprefixer: {
      dist: {
        src: 'dist/interdimensional.css'
      },
      options: {
        browsers: ['> 0.1%']
      }
    },

    // Minify definitions
    uglify: {
      target: {
        src: 'dist/interdimensional.js',
        dest: 'dist/interdimensional.min.js'
      },
      options: {
        banner: '<%= meta.banner %>'
      }
    },

    // Git hooks definitions
    githooks: {
      all: {
        'pre-commit': 'lint'
      },
      options: {
        command: './node_modules/.bin/grunt'
      }
    },

    // Run 'grunt watch' for development
    watch: {
      src: {
        files: ['src/**/*', 'examples/**/*'],
        tasks: ['lint', 'build']
      },
      options: {
        spawn: false,

        // Use browser extensions of LiveReload
        livereload: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.registerTask('lint', [
    'jshint', 'jscs'
  ]);

  grunt.registerTask('test', [
    'lint', 'jasmine'
  ]);

  grunt.registerTask('build', [
    'concat', 'autoprefixer', 'csscomb', 'uglify'
  ]);

  grunt.registerTask('default', [
    'test', 'build', 'githooks'
  ]);
};
