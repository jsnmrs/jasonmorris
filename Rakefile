# rake serve
desc "serve the site locally"
  task :serve do
    require "launchy"
    Thread.new do
      sleep 4
      puts "Opening in browser..."
      Launchy.open("http://127.0.0.1:4000")
    end

    sh "bundle exec jekyll serve --watch"
  end

# fetch latest normalize.css
desc "Update normalize.css library to the latest version and minify"
  task :update_normalize_css do
    Dir.chdir("_sass/vendor") do
      sh 'curl "http://necolas.github.io/normalize.css/latest/normalize.css" -o "normalize.scss"'
      sh 'sass "normalize.scss":"_normalize-src.scss" --style compressed'
      rm ['normalize.scss', Dir.glob('*.map')].flatten
    end
  end

# rake test
desc "build and test website"
  task :test do
    require 'html/proofer'
    sh "bundle exec jekyll build"
    HTML::Proofer.new("./_site", {:verbose => true, :empty_alt_ignore => true, :check_html => true}).run
    sh "scss-lint"
  end
