var path = require("path");
module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt, {pattern: 'grunt-*'});

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
            css: {
                files: [
                    {
                        src: ["app/stylesheets/*.css", "!app/stylesheets/app.css", "!app/stylesheets/app.min.css"],
                        dest: "app/stylesheets/app.css"
                    }
                ]
            }
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
            options: {
                run: true
            },
            test: {
                src: ["tests/**/*.html"]
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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                options: {
                    sourceMap: function (dest) {
                        return dest + ".map";
                    },
                    //sourceMapRoot: "../javascripts",
                    sourceMapPrefix: 2,
                    sourceMappingURL: function (dest) {
                        return path.basename(dest) + ".map";
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: "app/javascripts/",
                        src: ["**/*.js", "!**/*.min.js"],
                        dest: "app/javascripts/",
                        ext: ".min.js"
                    }
                ]
            },
            vendor: {
                files: [
                    {
                        expand: true,
                        cwd: "app/vendor/",
                        src: ["**/*.js", "!**/*.min.js"],
                        dest: "app/vendor/",
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
            options: {
                livereload: 35729
            },
            js: {
                files: ["app/javascripts/**/*.js"],
                tasks: ["js"]
            },
            css: {
                files: ["sass/**/*.scss"],
                tasks: ["css"]
            }
        },
        express: {
            options: {
                hostname: '*',
                server: path.resolve('./server')
            },
            server: {
                options: {
                    livereload: true,
                    port: 8000,
                    bases: "app",
                    open: true
                }
            },
            mocha: {
                options: {
                    open: "http://localhost:8001/tests/Spec.html",
                    port: 8001,
                    bases: "../webapp"
                }
            }
        },
        concurrent: {
            build: ["css", "js"]
        }
    });

    grunt.registerTask('serve', ['express:server', 'express-keepalive']);
    grunt.registerTask("test", ["express:mocha", 'express-keepalive']);
    grunt.registerTask("css", ["compass", "concat:css", "cssmin"]);
    grunt.registerTask("js", ["mocha", "jshint", 'uglify', "replace"]);
    // Default task(s).
    grunt.registerTask('default', ["concurrent:build"]);
};