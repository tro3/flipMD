
module.exports = (grunt) ->
    grunt.initConfig(
        pkg: grunt.file.readJSON('package.json'),

        jshint:
          options: {jshintrc: true, force: true}
          all: ['gruntfile.js', 'src/**/*.js']

        coffeelint:
          src:
            files:
              src: [ 'src/**/*.coffee' ]

        coffee:
            files:
                src: ['src/**/*.coffee', '!src/**/*.spec.coffee']
                expand: true
                ext: '.js'

        concat:
            src:
                src: ['src/**/*.js', '!src/**/*.spec.js']
                dest: 'build/flipMD.js'


        uglify:
          options:
            banner: """
            /*
            /* flipMD - Markdown components for Flip
            */
            
            """
          src:
            files:
              'build/flipMD.min.js': 'build/flipMD.js'
                    
        karma:
            once:
                configFile: 'karma.conf.js'
                        
    )
      
    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-coffeelint')
    grunt.loadNpmTasks('grunt-contrib-coffee')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-karma')
    
    grunt.registerTask('check', ['jshint', 'coffeelint'])
    grunt.registerTask('build', ['coffee', 'concat', 'uglify'])
    grunt.registerTask('default', ['check', 'build', 'karma'])
    