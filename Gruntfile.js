var path = require("path");
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compass: {
            dist: {
                options: {
                    config: "config.rb"
                }
            }
        },
        concat: {
            /*js: {
             files: [
             {
             src: ["app/libs*//*.js", "app/src*//*.js"],
             dest: 'app/build/soma.js'
             }
             ]
             },*/
            css: {
                files: [
                    {
                        src: ["app/stylesheets/*.css"],
                        dest: "app/stylesheets/app.css"
                    }
                ]
            }
        },
        csslint: {

        },
        cssmin: {
            options: {
                //report: "gzip"
            },
            dist: {
                files: [
                    {src: ["app/stylesheets/app.css"], dest: "app/stylesheets/app.min.css"}
                ]
            }
        },
        mocha: {
            test: {
                options: {
                    run: true
                },
                src: ['tests/**/*.html']
            }
        },
        jshint: {
            options: {
                jshintrc: true,
                force: true
            },
            all: {
                files: {
                    src: [
                        "app/javascripts/**/*.js",
                        '!app/sea-modules/**/*.js',
                        '!app/javascripts/**/*.min.js'
                    ]
                }
            }
        },
        uglify: {
            options: {
                //report: "gzip",
                preserveComments: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: function (dest) {
                    return dest + ".map";
                },
                //sourceMapRoot: "../javascripts",
                sourceMapPrefix: 2,
                sourceMappingURL: function (dest) {
                    return path.basename(dest) + ".map";
                }
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: "app/javascripts/",
                        src: ["**/*.js", "!**/*.min.js"],
                        dest: "app/javascripts/",
                        ext: ".min.js"
                    },
                    {
                        expand: true,
                        cwd: "app/build/",
                        src: ["**/*.js", "!**/*.min.js"],
                        dest: "app/build/",
                        ext: ".min.js"
                    }
                ]
            }
        },
        replace: {
            sourcemap: {
                src: ["app/**/*.map"],
                overwrite: true,
                replacements: [
                    {
                        from: /"file":"(.*\.js)",/,
                        to: function () {
                            return '"file":"' + path.basename(RegExp.$1) + '",';
                        }
                    }
                ]
            }
        },
        clean: {
            build: [".sass-cache"]
        },
        watch: {
            js: {
                files: ["app/javascripts/**/*.js"],
                tasks: ["js"]
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    protocol: "http",
                    base: "app",
                    keepalive: true
                }
            }
        }
    });


    grunt.registerTask("css", ["compass", "concat:css", "cssmin"]);
    grunt.registerTask("js", ["mocha", "jshint", 'uglify', "replace"]);
    // Default task(s).
    grunt.registerTask('default', ["compass", "concat", "cssmin", "jasmine", "jshint", 'uglify', "replace"]);
};